// src/app/api/admin/contacts/visitordata.tsx
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabaseServer";
import { verifyAuth } from "@/app/api/admin/auth/me/route";
import nodemailer from "nodemailer";

// Email transporter configuration
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: parseInt(process.env.SMTP_PORT || "587"),
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

transporter.verify(function (error) {
	if (error) {
		console.error("SMTP connection error in admin/contacts:", error);
	} else {
		console.log("SMTP server ready for admin/contacts");
	}
});

export async function GET(request: NextRequest) {
	const user = await verifyAuth(request);
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const status = searchParams.get("status");
		const search = searchParams.get("search");

		const offset = (page - 1) * limit;

		const supabase = getSupabaseServiceClient();

		let query = supabase
			.from("contact_submissions")
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (status && status !== "all") {
			query = query.eq("status", status);
		}

		if (search) {
			query = query.or(
				`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
			);
		}

		const { data, error, count } = await query;

		if (error) throw error;

		return NextResponse.json({
			data,
			pagination: {
				page,
				limit,
				total: count || 0,
				totalPages: Math.ceil((count || 0) / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching contacts:", error);
		return NextResponse.json(
			{ error: "Failed to fetch contacts" },
			{ status: 500 }
		);
	}
}

export async function PATCH(request: NextRequest) {
	const user = await verifyAuth(request);
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { id, status, admin_notes } = await request.json();

		if (!id || !status) {
			return NextResponse.json(
				{ error: "Missing id or status" },
				{ status: 400 }
			);
		}

		const supabase = getSupabaseServiceClient();

		const { data, error } = await supabase
			.from("contact_submissions")
			.update({
				status,
				admin_notes,
				updated_at: new Date().toISOString(),
			})
			.eq("id", id)
			.select()
			.single();

		if (error) throw error;

		// Send email to user if status changed
		if (data) {
			const { name, email } = data;

			const userEmailOptions = {
				from: `"MBN Construction" <${process.env.SMTP_USER}>`,
				to: email,
				subject: "Update on Your Contact Inquiry",
				html:
				`
				<!DOCTYPE html>
				<html>
				<head>
				    <meta charset="UTF-8">
				    <title>MBN Construction - Status Update</title>
				    <style>
				        /* Only inline styles or very basic CSS works reliably */
				        table { border-collapse: collapse; width: 100%; }
				        td, th { vertical-align: center; }
				        img { display: block; }
				        a { color: #f97316; text-decoration: none; }
				    </style>
				</head>
				<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
				<div style="max-width:600px; margin:20px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
				
				    <!-- Header - Using TABLE for perfect alignment -->
				    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
				        <tr>
				            <td style="background:#1a1a1a; padding:30px 40px;">
				                <table width="100%" cellpadding="0" cellspacing="0">
				                    <tr>
				                        <!-- Left: Company Name -->
<!--				                        <td style="color:#ff0000; font-size:28px; font-weight:bold; letter-spacing:1px;">-->
<!--				                            MBN <span style="color:#fff;">Construction</span>-->
<!--				                        </td>-->
										<td style="color:#ff0000; font-size:28px; font-weight:bold; letter-spacing:1px;">
		                                    MBN <span style="color:#fff;">Construction</span><br>
		                                    <span style="color:#f4f4f4; font-size:12px; font-weight: lighter; letter-spacing: 3px; display:block; line-height:14px;">
		                                        Private Limited
		                                    </span>
		                                </td>
				                        <!-- Right: Logo -->
				                        <td align="right">
				                            <img src="https://res.cloudinary.com/dodwea2yd/image/upload/v1765491050/3d_logo_hrl7hj.png"
				                                 alt="MBN Construction"
				                                 width="180"
				                                 style="display:block; border:0;" />
				                        </td>
				                    </tr>
				                </table>
				            </td>
				        </tr>
				    </table>
				
				    <!-- Content -->
				    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
				        <tr>
				            <td style="padding:40px; background:#ffffff;">
				                <h2 style="color: seagreen">Thank You for Contacting Us!</h2>
				                <h2 style="margin:0 0 20px; font-size:20px; color:#1a1a1a;">Dear ${name},</h2>
				
				                <p style="margin:0 0 20px; font-size:16px; color:#333;">
				                    Your contact inquiry status has been updated to:
				                    <span style="background:#fef3c7; color:#92400e; padding:6px 14px; border-radius:6px; font-weight:600;">
						              ${status}
						            </span>
				                </p>
				
				                ${admin_notes ? `
				                <div style="background:#f9fafb; border-left:5px solid #f97316; padding:20px; margin:25px 0; border-radius:0 8px 8px 0; font-style:italic; font-size: 1rem; color:#444;">
				                    <strong>Notes from our team:</strong><br>
				                    ${admin_notes.replace(/\n/g, "<br>")}
				                </div>` : ''}
				                
				                <p>If you have any questions or need further assistance, feel free to reach out:</p>
						        <p>
						            Phone: <a href="tel:9948314455" class="highlight">9948314455</a><br>
						            Email: <a href="mailto:mbnaik1987@gmail.com" class="highlight">mbnaik1987@gmail.com</a>
						        </p>
				                <p style="margin:30px 0 10px; font-size:16px; color:#333;">
				                    Thank you for choosing MBN Construction!<br>
				                    <strong>The MBN Team</strong>
				                </p>
				            </td>
				        </tr>
				    </table>
				
				    <!-- Footer -->
				    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
				        <tr>
				            <td style="background:#1a1a1a; color:#aaaaaa; padding:30px; text-align:center; font-size:13px;">
				                <p style="margin:0; font-weight:bold; color:#ff0000;">MBN <span style="color:#fff;">Construction Private Limited</span></p>
				                <p style="margin:10px 0 0;">
				                    Thukkuguda, Srisailam Highway, Mandal Maheshwaram<br>
				                    R.R. Dist - 501359, Telangana
				                </p>
				                <p style="margin:15px 0 0;">
				                    <a href="tel:9948314455" style="color:#f97316;">9948314455</a> |
				                    <a href="mailto:mbnaik1987@gmail.com" style="color:#f97316;">mbnaik1987@gmail.com</a>
				                </p>
				                <p style="margin-top:25px; font-size:11px; color:#777;">
		                            © 2025 MBN Construction Private Limited. All rights reserved.<br>
		                            This is an automated status update from your quote request.
		                        </p>
				            </td>
				        </tr>
				    </table>
				</div>
				</body>
				</html>
				`,
			};

			try {
				await transporter.sendMail(userEmailOptions);
			} catch (emailError) {
				console.error("Email sending error in contact update:", emailError);
				// Continue even if email fails
			}
		}

		return NextResponse.json({ success: true, data });
	} catch (error) {
		console.error("Error updating contact:", error);
		return NextResponse.json(
			{ error: "Failed to update contact" },
			{ status: 500 }
		);
	}
}
