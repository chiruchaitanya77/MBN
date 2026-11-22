// // // src/app/api/quotes/visitordata.tsx
// // import { NextResponse } from "next/server";
// // import { getSupabaseServerClient } from "@/lib/supabaseServer";
// //
// // export async function POST(req: Request) {
// //     try {
// //         const body = await req.json();
// //         const { name, email, projectType, budgetRange, message } = body;
// //
// //         if (!name || !email || !projectType) {
// //             return NextResponse.json(
// //                 { error: "Missing required fields" },
// //                 { status: 400 }
// //             );
// //         }
// //
// //         const supabase = await getSupabaseServerClient();
// //
// //         const { data, error } = await supabase
// //             .from("quotes")
// //             .insert({
// //                 name,
// //                 email,
// //                 project_type: projectType,
// //                 budget_range: budgetRange,
// //                 message,
// //             })
// //             .select()
// //             .single();
// //
// //         if (error) {
// //             console.error(error);
// //             return NextResponse.json(
// //                 { error: "Failed to create quote" },
// //                 { status: 500 }
// //             );
// //         }
// //
// //         return NextResponse.json({ quote: data }, { status: 201 });
// //     } catch (e) {
// //         console.error(e);
// //         return NextResponse.json({ error: "Invalid request" }, { status: 400 });
// //     }
// // }
//
//
// // src/app/api/quotes/visitordata.tsx
// import { NextRequest, NextResponse } from "next/server";
// import nodemailer from "nodemailer";
// import { getSupabaseServiceClient } from "@/lib/supabaseServer";
//
// // Email transporter configuration
// const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: parseInt(process.env.SMTP_PORT || "587"),
//     secure: false,
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//     },
// });
//
// // Verify transporter
// transporter.verify(function (error) {
//     if (error) {
//         console.error("SMTP connection error:", error);
//     } else {
//         console.log("SMTP server ready for quote requests");
//     }
// });
//
// export async function POST(request: NextRequest) {
//     try {
//         const body = await request.json();
//         const {
//             name,
//             email,
//             phone,
//             company,
//             projectType,
//             plotSize,
//             location,
//             budget,
//             timeline,
//             services,
//             description,
//         } = body;
//
//         // Validate required fields
//         if (!name || !email || !phone || !projectType || !plotSize || !location || !services || !description) {
//             return NextResponse.json(
//                 { error: "Required fields are missing" },
//                 { status: 400 }
//             );
//         }
//
//         // Initialize Supabase service client
//         const supabase = getSupabaseServiceClient();
//
//         // Store in Supabase
//         const { data: quoteData, error: dbError } = await supabase
//             .from("quote_requests")
//             .insert({
//                 name,
//                 email,
//                 phone,
//                 company: company || null,
//                 project_type: projectType,
//                 // plot_size: plotSize,
//                 plot_size: `${plotSize} sqft`,
//                 location,
//                 budget: budget || null,
//                 timeline: timeline || null,
//                 services: services,
//                 description,
//                 status: "new",
//             })
//             .select()
//             .single();
//
//         if (dbError) {
//             console.error("Supabase error:", dbError);
//             return NextResponse.json(
//                 { error: "Failed to save quote request" },
//                 { status: 500 }
//             );
//         }
//
//         // Prepare service labels for email
//         const serviceLabels: Record<string, string> = {
//             construction: "Full Construction",
//             planning: "Architectural Planning",
//             structural: "Structural Design",
//             renovation: "Renovation",
//             interior: "Interior Finishing",
//             consultation: "General Consultation",
//         };
//
//         const selectedServices = services
//             .map((s: string) => serviceLabels[s] || s)
//             .join(", ");
//
//         // Budget labels
//         const budgetLabels: Record<string, string> = {
//             "under-20l": "Under ₹20 Lakhs",
//             "20l-50l": "₹20L - ₹50L",
//             "50l-1cr": "₹50L - ₹1 Cr",
//             "1cr-plus": "₹1 Cr+",
//             undecided: "Not decided yet",
//         };
//
//         const budgetDisplay = budget ? budgetLabels[budget] || budget : "Not specified";
//
//         // Format timeline
//         const timelineDisplay = timeline
//             ? new Date(timeline).toLocaleDateString("en-IN", {
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//             })
//             : "To be decided";
//
//         // Admin email
//         const adminEmailOptions = {
//             from: `"MBN Construction - Quote Request" <${process.env.SMTP_USER}>`,
//             to: process.env.ADMIN_EMAIL,
//             subject: `🏗️ New Quote Request from ${name} - ${projectType.toUpperCase()}`,
//             html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <style>
//             body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
//             .container { max-width: 700px; margin: 0 auto; background-color: #ffffff; }
//             .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px 20px; text-align: center; }
//             .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
//             .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; }
//             .content { padding: 30px 20px; background-color: #f9f9f9; }
//             .section { background-color: white; padding: 20px; margin-bottom: 20px; border-left: 4px solid #f97316; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
//             .section-title { font-size: 18px; font-weight: bold; color: #f97316; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px; }
//             .field { margin-bottom: 15px; }
//             .label { font-weight: 600; color: #555; display: block; margin-bottom: 5px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.3px; }
//             .value { color: #1a1a1a; padding: 12px; background-color: #f5f5f5; border-left: 3px solid #f97316; font-size: 15px; }
//             .services-list { list-style: none; padding: 0; margin: 0; }
//             .services-list li { background-color: #f5f5f5; padding: 8px 12px; margin-bottom: 5px; border-left: 3px solid #f97316; }
//             .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; background-color: #f0f0f0; }
//             .highlight { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
//             .highlight strong { color: #856404; }
//             .meta { display: flex; justify-content: space-between; padding: 15px 20px; background-color: #e9ecef; font-size: 13px; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>🏗️ New Quote Request</h1>
//               <p>A potential client has submitted a project quote request</p>
//             </div>
//
//             <div class="meta">
//               <span><strong>Request ID:</strong> ${quoteData.id}</span>
//               <span><strong>Submitted:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</span>
//             </div>
//
//             <div class="content">
//
//               <div class="highlight">
//                 <strong>Quick Summary:</strong> ${name} is requesting a quote for a <strong>${projectType}</strong> project
//                 covering <strong>${plotSize} sqft</strong> in <strong>${location}</strong>.
//               </div>
//
//               <div class="section">
//                 <div class="section-title">👤 Contact Information</div>
//                 <div class="field">
//                   <span class="label">Name</span>
//                   <div class="value">${name}</div>
//                 </div>
//                 <div class="field">
//                   <span class="label">Email</span>
//                   <div class="value"><a href="mailto:${email}" style="color: #f97316; text-decoration: none;">${email}</a></div>
//                 </div>
//                 <div class="field">
//                   <span class="label">Phone</span>
//                   <div class="value"><a href="tel:${phone}" style="color: #f97316; text-decoration: none;">${phone}</a></div>
//                 </div>
//                 ${company ? `<div class="field">
//                   <span class="label">Company</span>
//                   <div class="value">${company}</div>
//                 </div>` : ''}
//               </div>
//
//               <div class="section">
//                 <div class="section-title">🏗️ Project Details</div>
//                 <div class="field">
//                   <span class="label">Project Type</span>
//                   <div class="value" style="text-transform: capitalize; font-weight: 600; color: #f97316;">${projectType}</div>
//                 </div>
//                 <div class="field">
//                   <span class="label">Plot/Area Size</span>
//                   <div class="value">${plotSize} sqft</div>
//                 </div>
//                 <div class="field">
//                   <span class="label">Location</span>
//                   <div class="value">${location}</div>
//                 </div>
//                 <div class="field">
//                   <span class="label">Budget Range</span>
//                   <div class="value">${budgetDisplay}</div>
//                 </div>
//                 <div class="field">
//                   <span class="label">Target Start Date</span>
//                   <div class="value">${timelineDisplay}</div>
//                 </div>
//               </div>
//
//               <div class="section">
//                 <div class="section-title">🔧 Services Required</div>
//                 <ul class="services-list">
//                   ${services.map((s: string) => `<li>✓ ${serviceLabels[s] || s}</li>`).join('')}
//                 </ul>
//               </div>
//
//               <div class="section">
//                 <div class="section-title">📝 Project Description</div>
//                 <div class="value">${description.replace(/\n/g, '<br>')}</div>
//               </div>
//
//             </div>
//
//             <div class="footer">
//               <p><strong>MBN Construction</strong> - Quote Management System</p>
//               <p>This is an automated notification from your website quote form</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `,
//             text: `
// NEW QUOTE REQUEST - ${projectType.toUpperCase()}
//
// Request ID: ${quoteData.id}
// Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
//
// CONTACT INFORMATION
// -------------------
// Name: ${name}
// Email: ${email}
// Phone: ${phone}
// ${company ? `Company: ${company}` : ''}
//
// PROJECT DETAILS
// ---------------
// Type: ${projectType}
// Plot Size: ${plotSize}
// Location: ${location}
// Budget: ${budgetDisplay}
// Timeline: ${timelineDisplay}
//
// SERVICES REQUIRED
// -----------------
// ${selectedServices}
//
// PROJECT DESCRIPTION
// -------------------
// ${description}
//
// ---
// MBN Construction - Quote Management System
//       `,
//         };
//
//         // User confirmation email
//         const userEmailOptions = {
//             from: `"MBN Construction" <${process.env.SMTP_USER}>`,
//             to: email,
//             subject: "Quote Request Received - MBN Construction",
//             html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <style>
//             body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
//             .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
//             .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 40px 20px; text-align: center; }
//             .header h1 { margin: 0; font-size: 32px; font-weight: bold; }
//             .content { padding: 40px 30px; background-color: #ffffff; }
//             .content h2 { color: #1a1a1a; margin-top: 0; }
//             .next-steps { background-color: #f8f9fa; padding: 20px; border-left: 4px solid #f97316; margin: 25px 0; }
//             .next-steps h3 { margin-top: 0; color: #f97316; font-size: 18px; }
//             .next-steps ol { margin: 0; padding-left: 20px; }
//             .next-steps li { margin-bottom: 10px; }
//             .project-summary { background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; }
//             .project-summary h3 { margin-top: 0; color: #856404; }
//             .project-summary p { margin: 5px 0; color: #856404; }
//             .cta-button { display: inline-block; background-color: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: bold; }
//             .footer { text-align: center; padding: 30px 20px; color: #777; font-size: 13px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; }
//             .contact-info { margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 4px; }
//             .highlight { color: #f97316; font-weight: bold; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>✓ Request Received</h1>
//               <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for choosing MBN Construction</p>
//             </div>
//
//             <div class="content">
//               <h2>Dear ${name},</h2>
//
//               <p>Thank you for requesting a quote from <strong>MBN Construction</strong>. We have successfully received your project details and our team is excited to work with you!</p>
//
//               <div class="project-summary">
//                 <h3>📋 Your Project Summary</h3>
//                 <p><strong>Type:</strong> ${projectType.charAt(0).toUpperCase() + projectType.slice(1)}</p>
//                 <p><strong>Size:</strong> ${plotSize}</p>
//                 <p><strong>Location:</strong> ${location}</p>
//                 <p><strong>Services:</strong> ${selectedServices}</p>
//               </div>
//
//               <div class="next-steps">
//                 <h3>What Happens Next?</h3>
//                 <ol>
//                   <li><strong>Review:</strong> Our engineering team will carefully analyze your requirements</li>
//                   <li><strong>Site Assessment:</strong> We may schedule a site visit to provide accurate estimates</li>
//                   <li><strong>Detailed Quote:</strong> You'll receive a comprehensive proposal within 24-48 hours</li>
//                   <li><strong>Discussion:</strong> We'll arrange a meeting to discuss the quote and answer your questions</li>
//                 </ol>
//               </div>
//
//               <p>Our team typically responds within <span class="highlight">24-48 business hours</span>. For urgent inquiries, please don't hesitate to call us directly.</p>
//
//               <div class="contact-info">
//                 <strong>Need Immediate Assistance?</strong><br>
//                 📞 Call: <a href="tel:9948314455" style="color: #f97316; text-decoration: none;">9948314455</a><br>
//                 📧 Email: <a href="mailto:mbnaik1987@gmail.com" style="color: #f97316; text-decoration: none;">mbnaik1987@gmail.com</a>
//               </div>
//
//               <p style="margin-top: 30px;">We look forward to bringing your vision to life!</p>
//
//               <p>Best regards,<br>
//               <strong>The MBN Construction Team</strong></p>
//             </div>
//
//             <div class="footer">
//               <p><strong>MBN Construction</strong></p>
//               <p>Thukkuguda, Srisailam Highway<br>
//               Mandal Maheshwaram, R.R.Dist - 501359</p>
//               <p>📞 9948314455 | 📧 mbnaik1987@gmail.com</p>
//               <p style="margin-top: 15px; font-size: 11px; color: #999;">PAN: BFPPM5518C</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `,
//             text: `
// Dear ${name},
//
// Thank you for requesting a quote from MBN Construction!
//
// YOUR PROJECT SUMMARY
// --------------------
// Type: ${projectType}
// Size: ${plotSize}
// Location: ${location}
// Services: ${selectedServices}
//
// WHAT HAPPENS NEXT?
// ------------------
// 1. Our engineering team will analyze your requirements
// 2. We may schedule a site visit for accurate estimates
// 3. You'll receive a detailed proposal within 24-48 hours
// 4. We'll discuss the quote and answer your questions
//
// Our team typically responds within 24-48 business hours.
//
// NEED IMMEDIATE ASSISTANCE?
// --------------------------
// Call: 9948314455
// Email: mbnaik1987@gmail.com
//
// We look forward to bringing your vision to life!
//
// Best regards,
// The MBN Construction Team
//
// ---
// MBN Construction
// Thukkuguda, Srisailam Highway
// Mandal Maheshwaram, R.R.Dist - 501359
// Phone: 9948314455 | Email: mbnaik1987@gmail.com
// PAN: BFPPM5518C
//       `,
//         };
//
//         // Send both emails
//         try {
//             await Promise.all([
//                 transporter.sendMail(adminEmailOptions),
//                 transporter.sendMail(userEmailOptions),
//             ]);
//         } catch (emailError) {
//             console.error("Email sending error:", emailError);
//             return NextResponse.json(
//                 {
//                     success: true,
//                     message: "Quote request saved but email notification failed",
//                     data: quoteData,
//                 },
//                 { status: 200 }
//             );
//         }
//
//         return NextResponse.json(
//             {
//                 success: true,
//                 message: "Quote request submitted successfully",
//                 data: quoteData,
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Quote request error:", error);
//         return NextResponse.json(
//             { error: "Internal server error" },
//             { status: 500 }
//         );
//     }
// }

// src/app/api/quotes/visitordata.tsx
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getSupabaseServiceClient } from "@/lib/supabaseServer";
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
        console.log("SMTP server ready for quote requests");
    }
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            name,
            email,
            phone,
            company,
            projectType,
            plotSize,
            location,
            budget,
            timeline,
            services,
            description,
        } = body;

        if (!name || !email || !phone || !projectType || !plotSize || !location || !services || !description) {
            return NextResponse.json(
                { error: "Required fields are missing" },
                { status: 400 }
            );
        }

        // Get tracking data
        const trackingData = await getTrackingData(request);

        const supabase = getSupabaseServiceClient();

        // Store in Supabase with tracking data
        const { data: quoteData, error: dbError } = await supabase
            .from("quote_requests")
            .insert({
                name,
                email,
                phone,
                company: company || null,
                project_type: projectType,
                plot_size: `${plotSize} sqft`,
                location,
                budget: budget || null,
                timeline: timeline || null,
                services: services,
                description,
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
                { error: "Failed to save quote request" },
                { status: 500 }
            );
        }

        const serviceLabels: Record<string, string> = {
            construction: "Full Construction",
            planning: "Architectural Planning",
            structural: "Structural Design",
            renovation: "Renovation",
            interior: "Interior Finishing",
            consultation: "General Consultation",
        };

        const selectedServices = services
            .map((s: string) => serviceLabels[s] || s)
            .join(", ");

        const budgetLabels: Record<string, string> = {
            "under-20l": "Under ₹20 Lakhs",
            "20l-50l": "₹20L - ₹50L",
            "50l-1cr": "₹50L - ₹1 Cr",
            "1cr-plus": "₹1 Cr+",
            undecided: "Not decided yet",
        };

        const budgetDisplay = budget ? budgetLabels[budget] || budget : "Not specified";

        const timelineDisplay = timeline
            ? new Date(timeline).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
            : "To be decided";

        const adminEmailOptions = {
            from: `"MBN Construction - Quote Request" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `🏗️ New Quote Request from ${name} - ${projectType.toUpperCase()}`,
            html:
                `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>New Quote Request - MBN Construction</title>
                </head>
                <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f4f4; padding:20px 0;">
                    <tr>
                        <td align="center">
                
                            <!-- Main Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                
                                <!-- Dark Header with Logo + Name -->
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
                                                         alt="MBN Construction" width="180" style="display:block; border:0;"/>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                
                                <!-- Main Content -->
                                <tr>
                                    <td style="padding:40px; background:#ffffff;">
                                        <h1 style="margin:0 0 10px; font-size:26px; color:#1a1a1a;">New Quote Request Received</h1>
                                        <p style="margin:0 0 30px; color:#666; font-size:16px;">
                                            Submitted on: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                                        </p>
                
                                        <!-- Quick Summary Highlight -->
                                        <div style="background:#fff3cd; padding:18px; border-left:5px solid #ffc107; border-radius:8px; margin:25px 0; font-size:16px;">
                                            <strong style="color:#856404;">Quick Summary:</strong><br>
                                            ${name} is requesting a quote for a <strong>${projectType}</strong> project – 
                                            <strong>${plotSize} sqft</strong> in <strong>${location}</strong>.
                                        </div>
                
                                        <!-- Contact Info Box -->
                                        <div style="background:#f9f9f9; padding:20px; border-radius:8px; border-left:5px solid #f97316; margin:25px 0;">
                                            <p style="margin:8px 0;"><strong>Name:</strong> ${name}</p>
                                            <p style="margin:8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color:#f97316; text-decoration:none;">${email}</a></p>
                                            <p style="margin:8px 0;"><strong>Phone:</strong> <a href="tel:${phone}" style="color:#f97316; text-decoration:none;">${phone}</a></p>
                                            ${company ? `<p style="margin:8px 0;"><strong>Company:</strong> ${company}</p>` : ''}
                                        </div>
                
                                        <!-- Project Details -->
                                        <div style="margin:30px 0;">
                                            <h3 style="color:#f97316; margin:0 0 15px; font-size:18px;">Project Details</h3>
                                            <table width="100%" cellpadding="8" style="font-size:15px; background:#f8f9fa; border-radius:8px;">
                                                <tr style="background:#e9ecef;"><td><strong>Project Type</strong></td><td style="text-transform:capitalize; color:#f97316; font-weight:600;">${projectType}</td></tr>
                                                <tr><td><strong>Plot Size</strong></td><td>${plotSize} sqft</td></tr>
                                                <tr style="background:#e9ecef;"><td><strong>Location</strong></td><td>${location}</td></tr>
                                                <tr><td><strong>Budget Range</strong></td><td>${budgetDisplay}</td></tr>
                                                <tr style="background:#e9ecef;"><td><strong>Target Start</strong></td><td>${timelineDisplay}</td></tr>
                                            </table>
                                        </div>
                
                                        <!-- Services Required -->
                                        <div style="margin:30px 0;">
                                            <h3 style="color:#f97316; margin:0 0 15px; font-size:18px;">Services Required</h3>
                                            <div style="background:#f5f5f5; padding:15px; border-left:5px solid #f97316; border-radius:8px;">
                                                ${services.map((s: string) => `• ${serviceLabels[s] || s}<br>`).join('')}
                                            </div>
                                        </div>
                
                                        <!-- Full Description -->
                                        ${description ? `
                                        <div style="margin:30px 0;">
                                            <h3 style="color:#f97316; margin:0 0 15px; font-size:18px;">Project Description</h3>
                                            <div style="background:#fff; padding:20px; border-left:5px solid #ff0000; border-radius:8px; line-height:1.7; font-size:16px;">
                                                ${description.replace(/\n/g, "<br>")}
                                            </div>
                                        </div>
                                        ` : ''}
                
                                        <!-- Tracking Info -->
                                        <div style="background:#e3f2fd; padding:18px; border-radius:8px; border-left:5px solid #2196f3; margin:30px 0; font-size:14px;">
                                            <strong style="color:#1976d2; font-size:15px;">Visitor Tracking Information</strong><br><br>
                                            <strong>Location:</strong> ${trackingData.city || 'Unknown'}, ${trackingData.region || 'Unknown'}, ${trackingData.country || 'Unknown'}<br>
                                            <strong>Device:</strong> ${trackingData.device || 'Unknown'}<br>
                                            <strong>Browser:</strong> ${trackingData.browser || 'Unknown'}<br>
                                            <strong>OS:</strong> ${trackingData.os || 'Unknown'}<br>
                                            <strong>IP:</strong> ${trackingData.ip || 'Unknown'}
                                        </div>
                
                                        <p style="margin:30px 0 0; padding:15px; background:#fff3cd; border-left:4px solid #ffc107; color:#856404; border-radius:4px;">
                                            <strong>Quote Request ID:</strong> ${quoteData.id}
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
                                            Automated notification from your website quote request form.
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
        NEW QUOTE REQUEST - ${projectType.toUpperCase()}
        
        Request ID: ${quoteData.id}
        Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
        
        QUICK SUMMARY
        -------------------
        ${name} is requesting a quote for a ${projectType} project – ${plotSize} sqft in ${location}.
        
        CONTACT INFORMATION
        -------------------
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        ${company ? `Company: ${company}` : ''}
        
        PROJECT DETAILS
        ---------------
        Type: ${projectType}
        Plot Size: ${plotSize} sqft
        Location: ${location}
        Budget: ${budgetDisplay}
        Timeline: ${timelineDisplay}
        
        SERVICES REQUIRED
        -----------------
        ${selectedServices}
        
        PROJECT DESCRIPTION
        -------------------
        ${description}
        
        TRACKING INFORMATION
        --------------------
        Location: ${trackingData.city || 'Unknown'}, ${trackingData.region || 'Unknown'}, ${trackingData.country || 'Unknown'}
        Device: ${trackingData.device || 'Unknown'}
        Browser: ${trackingData.browser || 'Unknown'}
        OS: ${trackingData.os || 'Unknown'}
        IP: ${trackingData.ip}
        
        ---
        MBN Construction - Quote Management System
      `,
        };

        const userEmailOptions = {
            from: `"MBN Construction" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Quote Request Received - MBN Construction",
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Quote Request Received - MBN Construction</title>
                </head>
                <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f4f4; padding:20px 0;">
                    <tr>
                        <td align="center">
                
                            <!-- Main Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                
                                <!-- Dark Header with Logo + Name -->
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
                                                         alt="MBN Construction" width="180" style="display:block; border:0;"/>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                
                                <!-- Main Content -->
                                <tr>
                                    <td style="padding:40px; background:#ffffff;">
                                        <h1 style="margin:0 0 15px; font-size:26px; color:seagreen;">Quote Request Received!</h1>
                                        <h2 style="margin:0 0 20px; font-size:20px; color:#333;">Dear ${name},</h2>
                
                                        <p style="margin:0 0 20px; font-size:16px; color:#333; line-height:1.7;">
                                            Thank you for choosing <strong>MBN Construction</strong>. We have successfully received your quote request and our team is excited to assist you with your project!
                                        </p>
                
                                        <!-- Project Summary Box -->
                                        <div style="background:#fff3cd; padding:20px; border-left:5px solid #ffc107; border-radius:8px; margin:25px 0; font-size:16px;">
                                            <strong style="color:#856404; font-size:17px;">Your Project Summary</strong><br><br>
                                            <strong>Type:</strong> ${projectType.charAt(0).toUpperCase() + projectType.slice(1)}<br>
                                            <strong>Size:</strong> ${plotSize} sqft<br>
                                            <strong>Location:</strong> ${location}<br>
                                            <strong>Services:</strong> ${selectedServices}
                                        </div>
                
                                        <!-- Next Steps -->
                                        <div style="background:#f8f9fa; padding:20px; border-left:5px solid #f97316; border-radius:8px; margin:30px 0;">
                                            <h3 style="margin:0 0 15px; color:#f97316; font-size:18px;">What Happens Next?</h3>
                                            <ol style="margin:0; padding-left:22px; line-height:1.8; color:#333;">
                                                <li>Our engineering team will review your requirements</li>
                                                <li>We may schedule a site visit for accurate estimation</li>
                                                <li>You’ll receive a detailed quote within <strong>24–48 hours</strong></li>
                                                <li>We’ll contact you to discuss the proposal and next steps</li>
                                            </ol>
                                        </div>
                
                                        <p style="margin:25px 0; font-size:16px; color:#333;">
                                            For urgent inquiries, feel free to reach out directly:
                                        </p>
                
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
                                            <strong style="color: seagreen; font-size: 20px">
                <!--                                We look forward to building with you!-->
                                                We look forward to building something amazing together!
                                            </strong>
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
                                        <p style="margin:10px 0 0;">
                                            Thukkuguda, Srisailam Highway, Mandal Maheshwaram<br>
                                            R.R. Dist - 501359, Telangana
                                        </p>
                                        <p style="margin:15px 0 0;">
                                            <a href="tel:9948314455" style="color:#f97316; text-decoration:none;">9948314455</a> |
                                            <a href="mailto:mbnaik1987@gmail.com" style="color:#f97316; text-decoration:none;">mbnaik1987@gmail.com</a>
                                        </p>
                                        <p style="margin-top:20px; font-size:11px; color:#777;">
                                            PAN: BFPPM5518C | © 2025 MBN Construction Private Limited. All rights reserved.<br>
                                            This is an automated confirmation of your quote request.
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
                
                Thank you for requesting a quote from MBN Construction!
                
                YOUR PROJECT SUMMARY
                --------------------
                Type: ${projectType}
                Size: ${plotSize}
                Location: ${location}
                Services: ${selectedServices}
                
                WHAT HAPPENS NEXT?
                ------------------
                1. Our engineering team will analyze your requirements
                2. We may schedule a site visit for accurate estimates
                3. You'll receive a detailed proposal within 24-48 hours
                4. We'll discuss the quote and answer your questions
                
                Our team typically responds within 24-48 business hours.
                
                NEED IMMEDIATE ASSISTANCE?
                --------------------------
                Call: 9948314455
                Email: mbnaik1987@gmail.com
                
                We look forward to bringing your vision to life!
                
                Best regards,
                The MBN Construction Team
                
                ---
                MBN Construction
                Thukkuguda, Srisailam Highway
                Mandal Maheshwaram, R.R.Dist - 501359
                Phone: 9948314455 | Email: mbnaik1987@gmail.com
                PAN: BFPPM5518C
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
                    message: "Quote request saved but email notification failed",
                    data: quoteData,
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Quote request submitted successfully",
                data: quoteData,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Quote request error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
