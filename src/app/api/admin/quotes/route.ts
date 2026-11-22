// // src/app/api/admin/quotes/visitordata.tsx
// import { NextRequest, NextResponse } from "next/server";
// import { verifyAuth } from "@/app/api/admin/auth/me/route";
// import { getSupabaseServiceClient } from "@/lib/supabaseServer";
//
// export async function GET(request: NextRequest) {
// 	const user = await verifyAuth(request);
// 	if (!user) {
// 		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// 	}
//
// 	try {
// 		const { searchParams } = new URL(request.url);
// 		const page = parseInt(searchParams.get("page") || "1");
// 		const limit = parseInt(searchParams.get("limit") || "10");
// 		const status = searchParams.get("status");
// 		const projectType = searchParams.get("projectType");
// 		const search = searchParams.get("search");
//
// 		const offset = (page - 1) * limit;
//
// 		const supabase = getSupabaseServiceClient();
//
// 		let query = supabase
// 			.from("quote_requests")
// 			.select("*", { count: "exact" })
// 			.order("created_at", { ascending: false })
// 			.range(offset, offset + limit - 1);
//
// 		if (status && status !== "all") {
// 			query = query.eq("status", status);
// 		}
//
// 		if (projectType && projectType !== "all") {
// 			query = query.eq("project_type", projectType);
// 		}
//
// 		if (search) {
// 			query = query.or(
// 				`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,location.ilike.%${search}%`
// 			);
// 		}
//
// 		const { data, error, count } = await query;
//
// 		if (error) throw error;
//
// 		return NextResponse.json({
// 			data,
// 			pagination: {
// 				page,
// 				limit,
// 				total: count || 0,
// 				totalPages: Math.ceil((count || 0) / limit),
// 			},
// 		});
// 	} catch (error) {
// 		console.error("Error fetching quotes:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to fetch quotes" },
// 			{ status: 500 }
// 		);
// 	}
// }
//
// // ADD THIS PATCH HANDLER — THIS WAS MISSING!
// export async function PATCH(request: NextRequest) {
// 	const user = await verifyAuth(request);
// 	if (!user) {
// 		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// 	}
//
// 	try {
// 		const body = await request.json();
// 		const { id, status } = body;
//
// 		if (!id || !status) {
// 			return NextResponse.json(
// 				{ error: "Missing id or status" },
// 				{ status: 400 }
// 			);
// 		}
//
// 		const supabase = getSupabaseServiceClient();
//
// 		const { data, error } = await supabase
// 			.from("quote_requests")
// 			.update({
// 				status,
// 				updated_at: new Date().toISOString(),
// 			})
// 			.eq("id", id)
// 			.select()
// 			.single();
//
// 		if (error) {
// 			console.error("Supabase update error:", error);
// 			return NextResponse.json(
// 				{ error: error.message || "Failed to update quote" },
// 				{ status: 500 }
// 			);
// 		}
//
// 		return NextResponse.json({ success: true, data });
// 	} catch (error) {
// 		console.error("PATCH /api/admin/quotes error:", error);
// 		return NextResponse.json(
// 			{ error: "Internal server error" },
// 			{ status: 500 }
// 		);
// 	}
// }


// src/app/api/admin/quotes/visitordata.tsx
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/app/api/admin/auth/me/route";
import { getSupabaseServiceClient } from "@/lib/supabaseServer";
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
		console.error("SMTP connection error in admin/quotes:", error);
	} else {
		console.log("SMTP server ready for admin/quotes");
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
		const projectType = searchParams.get("projectType");
		const search = searchParams.get("search");

		const offset = (page - 1) * limit;

		const supabase = getSupabaseServiceClient();

		let query = supabase
			.from("quote_requests")
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (status && status !== "all") {
			query = query.eq("status", status);
		}

		if (projectType && projectType !== "all") {
			query = query.eq("project_type", projectType);
		}

		if (search) {
			query = query.or(
				`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,location.ilike.%${search}%`
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
		console.error("Error fetching quotes:", error);
		return NextResponse.json(
			{ error: "Failed to fetch quotes" },
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
			.from("quote_requests")
			.update({
				status,
				admin_notes,
				updated_at: new Date().toISOString(),
			})
			.eq("id", id)
			.select()
			.single();

		if (error) {
			console.error("Supabase update error:", error);
			return NextResponse.json(
				{ error: error.message || "Failed to update quote" },
				{ status: 500 }
			);
		}

		// Send email to user if status changed
		if (data) {
			const { name, email } = data;

			let subject = "Update on Your Quote Request";
			let htmlTemplate = "";

			if (status === "rejected") {
				subject = "Quote Request Update – Thank You for Your Interest";

				htmlTemplate = `
					<!DOCTYPE html>
					<html lang="en">
					<head>
					    <meta charset="UTF-8">
					    <title>Quote Update - MBN Construction</title>
					</head>
					<body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">
					<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f4f4; padding:20px 0;">
					    <tr>
					        <td align="center">
					            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
					
					                <!-- Header -->
					                <tr>
					                    <td style="background:#1a1a1a; padding:30px 40px;">
					                        <table width="100%" cellpadding="0" cellspacing="0">
					                            <tr>
					                                <td style="color:#ff0000; font-size:28px; font-weight:bold; letter-spacing:1px;">
					                                    MBN <span style="color:#fff;">Construction</span><br>
					                                    <span style="color:#f4f4f4; font-size:12px; font-weight:lighter; letter-spacing:3px; display:block; line-height:14px;">
					                            Private Limited
					                          </span>
					                                </td>
					                                <td align="right">
					                                    <img src="https://res.cloudinary.com/dodwea2yd/image/upload/v1765491050/3d_logo_hrl7hj.png"
					                                         alt="MBN Construction" width="180" style="display:block;" />
					                                </td>
					                            </tr>
					                        </table>
					                    </td>
					                </tr>
					
					                <!-- Main Content -->
					                <tr>
					                    <td style="padding:40px;">
					                        <h2 style="margin:0 0 20px; font-size:22px; color:#1a1a1a;">Dear ${name},</h2>
					
					                        <p style="margin:0 0 25px; font-size:16px; color:#333; line-height:1.7;">
					                            Thank you for reaching out to <strong>MBN Construction</strong> and giving us the opportunity to quote for your project.
					                        </p>
					
					                        <div style="background:#ffebee; padding:14px; border-radius:8px; border-left:6px solid #e53935; margin:30px 0;">
					                            <p style="margin:0; font-size:17px; color:#c62828;">
					                                <strong>Status:</strong>
					                                <span style="display:inline-block; background:#e53935; color:white; padding:8px 10px; border-radius:6px; margin-left:12px; font-size:12px; text-transform:uppercase; letter-spacing:1px;">
					                                  Rejected
					                                </span>
					                            </p>
					                        </div>
					
					                        ${admin_notes ? `
					                        <div style="background:#fff3e0; border-left:5px solid #ff8f00; padding:20px; margin:30px 0; border-radius:0 8px 8px 0; font-style:italic; color:#5d4037;">
					                            <strong>Our Feedback:</strong><br><br>
					                            ${admin_notes.replace(/\n/g, "<br>")}
					                        </div>` : ''}
					
					                        <p style="margin:30px 0; font-size:16px; color:#333; line-height:1.7;">
					                            While we were unable to move forward with your project at this time, we truly appreciate your interest in our services.
					                        </p>
					
					                        <p style="margin:20px 0; font-size:16px; color:#333; line-height:1.7;">
					                            We keep all inquiries on file and would be happy to assist you with any future construction or renovation needs — whether it's a different scope, timeline, or budget.
					                        </p>
					
					                        <div style="background:#e8f5e8; padding:20px; border-radius:8px; border-left:5px solid #4caf50; margin:30px 0;">
					                            <p style="margin:0; font-size:16px; color:#2e7d32;">
					                                <strong>We’re here when you need us again.</strong><br>
					                                Feel free to reach out anytime for a new quote or consultation.
					                            </p>
					                        </div>
					
					                        <p style="margin:30px 0 10px; font-size:16px; color:#333;">
					                            Have questions or want to discuss other options?<br>
					                            We’re just one call or email away:
					                        </p>
					
					                        <div style="margin:20px 0; padding:15px; background:#f0f0f0; border-radius:8px; font-size:15px;">
					                            <p style="margin:8px 0;">
					                                Phone: <a href="tel:9948314455" style="font-size:14px; font-weight:bold;">9948314455</a>
					                            </p>
					                            <p style="margin:8px 0;">
					                                Email: <a href="mailto:mbnaik1987@gmail.com" style="font-size:14px; font-weight:bold;">mbnaik1987@gmail.com</a>
					                            </p>
					                        </div>
					
					                        <p style="margin:40px 0 10px; font-size:16px; color:#333;">
					                            Thank you once again for considering MBN Construction.<br>
					                            We wish you the very best with your project!
					                        </p>
					
					                        <p style="margin-top:30px; color:#555;">
					                            Best regards,<br>
					                            <strong style="color:#d32f2f;">The MBN Construction Team</strong>
					                        </p>
					                    </td>
					                </tr>
					
					                <!-- Footer -->
					                <tr>
					                    <td style="background:#1a1a1a; color:#aaaaaa; padding:30px; text-align:center; font-size:13px;">
					                        <p style="margin:0; font-weight:bold; color:#ff0000;">MBN <span style="color:#fff;">Construction Private Limited</span></p>
					                        <p style="margin:12px 0 0;">
					                            Thukkuguda, Srisailam Highway, Mandal Maheshwaram<br>
					                            R.R. Dist - 501359, Telangana, India
					                        </p>
					                        <p style="margin:20px 0 0;">
					                            <a href="tel:9948314455" style="color:#f97316; text-decoration:none;">9948314455</a> |
					                            <a href="mailto:mbnaik1987@gmail.com" style="color:#f97316; text-decoration:none;">mbnaik1987@gmail.com</a>
					                        </p>
					                        <p style="margin-top:25px; font-size:11px; color:#777;">
					                            © 2025 MBN Construction Private Limited. All rights reserved.
					                        </p>
					                    </td>
					                </tr>
					            </table>
					        </td>
					    </tr>
					</table>
					</body>
					</html>
    			`;
				} else {
				// Default template for all other statuses (new, reviewing, quoted, accepted)
				subject = "Update on Your Quote Request";

				htmlTemplate = `
      			<!DOCTYPE html>
	            <html lang="en">
	            <head>
	                <meta charset="UTF-8">
	                <title>Quote Status Update - MBN Construction</title>
	            </head>
	            <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">
	            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f4f4; padding:20px 0;">
	                <tr>
	                    <td align="center">
	                        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1);">

	                            <!-- Header: Logo on Right, Name on Left -->
	                            <tr>
	                                <td style="background:#1a1a1a; padding:30px 40px;">
	                                    <table width="100%" cellpadding="0" cellspacing="0">
	                                        <tr>
	                                            <!-- Left: Company Name -->
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

	                            <!-- Main Content -->
	                            <tr>
	                                <td style="padding:40px;">
	                                    <h2 style="margin:0 0 20px; font-size:22px; color:#1a1a1a;">
	                                        Dear ${name},
	                                    </h2>

	                                    <p style="margin:0 0 25px; font-size:16px; color:#333; line-height:1.7;">
	                                        We’re happy to inform you that the status of your <strong>quote request</strong> has been updated.
	                                    </p>

	                                    <!-- Status Badge -->
	                                    <div style="padding:12px 20px; border-radius:8px; border-left:6px solid #ffc107; margin:30px 0;">
	                                        <p style="margin:0; font-size:15px;">
	                                            <strong>Your quote is now:</strong>
	                                            <span style="display:inline-block; color: orangered; padding:8px 10px; border-radius:6px; margin-left:12px; font-size:12px; text-transform:uppercase; letter-spacing:1px;">
	                                                ${status}
	                                            </span>
	                                        </p>
	                                    </div>

	                                    <!-- Admin Notes -->
						                ${admin_notes ? `
						                <div style="background:#f9fafb; border-left:5px solid #f97316; padding:20px; margin:25px 0; border-radius:0 8px 8px 0; font-style:italic; font-size: 1rem; color:#444;">
						                    <strong>Notes from our team:</strong><br>
						                    ${admin_notes.replace(/\n/g, "<br>")}
						                </div>` : ''}

	                                    <p style="margin:30px 0; font-size:16px; color:#333; line-height:1.7;">
	                                        Our team is working on your project and will reach out soon with next steps.
	                                    </p>

	                                    <p style="margin:25px 0 0; font-size:16px; color:#333;">
	                                        Need to discuss anything urgently?<br>
	                                        Feel free to contact us directly:
	                                    </p>

	                                    <div style="margin:20px 0; padding:15px; background:#f0f0f0; border-radius:8px; font-size:15px;">
	                                        <p style="margin:8px 0;">
	                                            Phone: <a href="tel:9948314455" style="font-size:14px; font-weight:bold;">9948314455</a>
	                                        </p>
	                                        <p style="margin:8px 0;">
	                                            Email: <a href="mailto:mbnaik1987@gmail.com" style="font-size:14px; font-weight:bold;">mbnaik1987@gmail.com</a>
	                                        </p>
	                                    </div>

	                                    <p style="margin:35px 0 10px; font-size:16px; color:#333;">
	                                        Thank you for trusting MBN Construction with your project.<br><br>
	                                        <strong style="color: seagreen; font-size: 20px">We look forward to building with you!</strong>
	                                    </p>

	                                    <p style="margin-top:30px; color:#555;">
	                                        Best regards,<br>
	                                        <strong style="color:#ff0000;">The MBN Construction Team</strong>
	                                    </p>
	                                </td>
	                            </tr>

	                            <!-- Footer -->
	                            <tr>
	                                <td style="background:#1a1a1a; color:#aaaaaa; padding:30px; text-align:center; font-size:13px;">
	                                    <p style="margin:0; font-weight:bold; color:#ff0000;">MBN <span style="color:#fff;">Construction Private Limited</span></p>
	                                    <p style="margin:12px 0 0;">
	                                        Thukkuguda, Srisailam Highway, Mandal Maheshwaram<br>
	                                        R.R. Dist - 501359, Telangana, India
	                                    </p>
	                                    <p style="margin:20px 0 0;">
	                                        <a href="tel:9948314455" style="color:#f97316; text-decoration:none;">9948314455</a> |
	                                        <a href="mailto:mbnaik1987@gmail.com" style="color:#f97316; text-decoration:none;">mbnaik1987@gmail.com</a>
	                                    </p>
	                                    <p style="margin-top:25px; font-size:11px; color:#777;">
	                                        © 2025 MBN Construction Private Limited. All rights reserved.<br>
	                                        This is an automated status update from your quote request.
	                                    </p>
	                                </td>
	                            </tr>
	                        </table>
	                    </td>
	                </tr>
	            </table>
	            </body>
	            </html>
    			`;
			}

			const userEmailOptions = {
				from: `"MBN Construction" <${process.env.SMTP_USER}>`,
				to: email,
				subject,
				html: htmlTemplate,
			};

			try {
				await transporter.sendMail(userEmailOptions);
			} catch (emailError) {
				console.error("Email sending error in quote update:", emailError);
			}
		}

		return NextResponse.json({ success: true, data });
	} catch (error) {
		console.error("PATCH /api/admin/quotes error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
