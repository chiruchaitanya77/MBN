// src/app/api/contact/visitordata.tsx
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getTrackingData } from "@/lib/tracking";

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
        console.error("SMTP connection error:", error);
    } else {
        console.log("SMTP server is ready to send emails");
    }
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, message } = body;

        // Validate required fields
        if (!name || !email || !phone || !message) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Get tracking data
        const trackingData = await getTrackingData(request);

        const supabase = await getSupabaseServerClient();

        // Store in Supabase with tracking data
        const { data: submissionData, error: dbError } = await supabase
            .from("contact_submissions")
            .insert({
                name,
                email,
                phone,
                message,
                status: "new",
                ip_address: trackingData.ip,
                country: trackingData.country,
                region: trackingData.region,
                city: trackingData.city,
                user_agent: trackingData.userAgent,
                browser: trackingData.browser,
                os: trackingData.os,
                device: trackingData.device,
            })
            .select()
            .single();

        if (dbError) {
            console.error("Supabase error:", dbError);
            return NextResponse.json(
                { error: "Failed to save submission to database" },
                { status: 500 }
            );
        }

        // Email options (same as before)
        const adminEmailOptions = {
            from: `"MBN Construction Website" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `New Contact Form Submission from ${name}`,
            html: `
               <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>New Contact Form Submission - MBN Construction</title>
                </head>
                <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f4f4; padding:20px 0;">
                    <tr>
                        <td align="center">
                
                            <!-- Main Email Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                
                                <!-- Dark Header with Logo & Name -->
                                <tr>
                                    <td style="background:#1a1a1a; padding:30px 40px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="color:#ff0000; font-family:Arial, Helvetica, sans-serif; font-size:28px; font-weight:bold; letter-spacing:1px;">
                                                    MBN <span style="color:#fff;">Construction</span><br>
                                                    <span style="color:#f4f4f4; font-size:12px; font-weight:lighter; letter-spacing:3px; display:block; line-height:14px;">
                                                        Private Limited
                                                    </span>
                                                </td>
                                                <td align="right">
                                                    <img src="https://res.cloudinary.com/dodwea2yd/image/upload/v1765491050/3d_logo_hrl7hj.png"
                                                         alt="MBN Construction" width="180" style="display:block; border:0;"/>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                
                                <!-- Main Content -->
                                <tr>
                                    <td style="padding:40px; background:#ffffff;">
                                        <h1 style="margin:0 0 10px; font-size:26px; color:#1a1a1a;">New Contact Form Submission</h1>
                                        <p style="margin:0 0 30px; color:#666; font-size:16px;">
                                            Received on: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                                        </p>
                
                                        <!-- User Details -->
                                        <div style="background:#f9f9f9; padding:20px; border-radius:8px; border-left:5px solid #f97316; margin:25px 0;">
                                            <p style="margin:8px 0; font-size:16px;"><strong>Name:</strong> ${name}</p>
                                            <p style="margin:8px 0; font-size:16px;"><strong>Email:</strong> <a href="mailto:${email}" style="color:#f97316; text-decoration:none;">${email}</a></p>
                                            <p style="margin:8px 0; font-size:16px;"><strong>Phone:</strong> <a href="tel:${phone}" style="color:#f97316; text-decoration:none;">${phone}</a></p>
                                        </div>
                
                                        <!-- Message -->
                                        ${message ? `
                                        <div style="background:#fff; border-left:5px solid #ff0000; padding:20px; margin:25px 0; border-radius:0 8px 8px 0; font-size:16px; line-height:1.6;">
                                            <strong style="color:#1a1a1a;">Message:</strong><br><br>
                                            ${message.replace(/\n/g, "<br>")}
                                        </div>
                                        ` : ''}
                
                                        <!-- Tracking Info Box -->
                                        <div style="background:#e3f2fd; padding:18px; border-radius:8px; border-left:5px solid #2196f3; margin:30px 0; font-size:14px;">
                                            <strong style="color:#1976d2; font-size:15px;">Visitor Tracking Information</strong><br><br>
                                            <strong>Location:</strong> ${trackingData.city || 'Unknown'}, ${trackingData.region || 'Unknown'}, ${trackingData.country || 'Unknown'}<br>
                                            <strong>Device:</strong> ${trackingData.device || 'Unknown'}<br>
                                            <strong>Browser:</strong> ${trackingData.browser || 'Unknown'}<br>
                                            <strong>OS:</strong> ${trackingData.os || 'Unknown'}
                                        </div>
                
                                        <p style="margin:30px 0 0; padding:15px; background:#fff3cd; border-left:4px solid #ffc107; color:#856404; border-radius:4px;">
                                            <strong>Submission ID:</strong> ${submissionData.id}
                                        </p>
                                    </td>
                                </tr>
                
                                <!-- Footer -->
                                <tr>
                                    <td style="background:#1a1a1a; color:#aaaaaa; padding:30px; text-align:center; font-size:13px;">
                                        <p style="margin:0; font-weight:bold; color:#ff0000;">MBN <span style="color:#fff;">Construction Private Limited</span></p>
                                        <p style="margin:10px 0 0;">
                                            Thukkuguda, Srisailam Highway, Mandal Maheshwaram<br>
                                            R.R. Dist - 501359, Telangana
                                        </p>
                                        <p style="margin:15px 0 0;">
                                            <a href="tel:9948314455" style="color:#f97316; text-decoration:none;">9948314455</a> |
                                            <a href="mailto:mbnaik1987@gmail.com" style="color:#f97316; text-decoration:none;">mbnaik1987@gmail.com</a>
                                        </p>
                                        <p style="margin-top:25px; font-size:11px; color:#777;">
                                            © 2025 MBN Construction Private Limited. All rights reserved.<br>
                                            This is an automated notification from your website contact form.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                </body>
                </html>
      `,
            text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}

Location: ${trackingData.city || 'Unknown'}, ${trackingData.region || 'Unknown'}, ${trackingData.country || 'Unknown'}
Device: ${trackingData.device || 'Unknown'}
Browser: ${trackingData.browser || 'Unknown'}
OS: ${trackingData.os || 'Unknown'}

Received: ${new Date().toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
            })}
Submission ID: ${submissionData.id}
      `,
        };

        const userEmailOptions = {
            from: `"MBN Construction" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Thank you for contacting MBN Construction",
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Contact Reply - MBN Construction</title>
                </head>
                <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f4f4; padding:20px 0;">
                    <tr>
                        <td align="center">
                
                            <!-- Content -->
                            <table width="100%" cellpadding="0" cellspacing="0"
                                   style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                
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
                                                         style="display:block; border:0;"/>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                
                                <!-- Main Content -->
                                <tr>
                                    <td style="padding:40px; background:#ffffff;">
                                        <h2 style="color: seagreen">Thank You for Contacting Us!</h2>
                                        <h2 style="margin:0 0 20px; font-size:20px; color:#1a1a1a;">Dear ${name},</h2>
                
                                        <p style="margin:0 0 20px; font-size:16px; color:#333;">
                                            We have received your message and will get back to you shortly. Our team typically responds
                                            within 24-48 hours.
                                        </p>
                
                                        ${message ? `
                                        <div style="background:#f9fafb; border-left:5px solid #f97316; padding:20px; margin:25px 0; border-radius:0 8px 8px 0; font-style:italic; font-size: 1rem; color:#444;">
                                            <strong>Your Message:</strong><br>
                                            ${message.replace( /\n/g, "<br>" )}
                                        </div>
                                        ` : ''}
                
                                        <p>If you have any questions or need further assistance, feel free to reach out:</p>
                                        <div style="margin:20px 0; padding:15px; background:#f0f0f0; border-radius:8px; font-size:15px;">
                                            <p style="margin:8px 0;">
                                                Phone: <a href="tel:9948314455" style="font-size:14px; font-weight:bold;">9948314455</a>
                                            </p>
                                            <p style="margin:8px 0;">
                                                Email: <a href="mailto:mbnaik1987@gmail.com" style="font-size:14px; font-weight:bold;">mbnaik1987@gmail.com</a>
                                            </p>
                                        </div>
                                        <p style="margin:30px 0 10px; font-size:18px; font-weight: bolder; color:#333;">
                                            Thank you for choosing MBN Construction!<br><br>
                                            <strong style="color: seagreen; font-size: 20px">We look forward to building with
                                                you!</strong>
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
                                        <p style="margin:0; font-weight:bold; color:#ff0000;">MBN <span style="color:#fff;">Construction Private Limited</span>
                                        </p>
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
                        </td>
                    </tr>
                </table>
                </body>
                </html>
              `,
            text: `
                Dear ${name},
                
                Thank you for contacting MBN Construction!
                
                We have received your message and will get back to you shortly. Our team typically responds within 24-48 hours.
                
                Your Message:
                ${message}
                
                If you need immediate assistance, please call us at 9948314455.
                
                Best regards,
                MBN Construction Team
                
                Contact: mbnaik1987@gmail.com | 9948314455
      `,
        };

        try {
            await Promise.all([
                transporter.sendMail(adminEmailOptions),
                transporter.sendMail(userEmailOptions),
            ]);
        } catch (emailError) {
            console.error("Email sending error:", emailError);
            return NextResponse.json(
                {
                    success: true,
                    message: "Form submitted successfully, but email notification failed",
                    data: submissionData,
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Form submitted successfully and emails sent",
                data: submissionData,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
