// // src/app/api/track-visit/route.ts
// import { NextResponse } from "next/server";
// import {getSupabaseServiceClient} from "@/lib/supabaseServer";
// import { getTrackingData } from "@/lib/tracking";
//
// const BOT_USER_AGENTS = [
// 	"vercel-screenshot",     // ← This one you saw
// 	"Vercelbot",
// 	"bot",
// 	"crawl",
// 	"spider",
// 	"headless",
// 	"lighthouse",
// 	"preview",
// 	"slackbot",
// 	"facebookexternalhit",
// 	"twitterbot",
// 	"linkedinbot",
// 	"googlebot",
// 	"bingbot",
// 	"duckduckbot",
// ];
//
// export async function POST(request: Request) {
// 	try {
// 		const trackingData = await getTrackingData(request);
// 		const userAgent = trackingData.userAgent.toLowerCase();
//
// 		// Ignore bots & Vercel screenshots
// 		if (Ignore) if (BOT_USER_AGENTS.some(bot => userAgent.includes(bot))) {
// 			return NextResponse.json({ ok: true, ignored: true });
// 		}
//
// 		// Optional: Also ignore localhost / dev environments
// 		if (trackingData.ip === "127.0.0.1" || trackingData.ip.startsWith("192.168.")) {
// 			return NextResponse.json({ ok: true, ignored: true });
// 		}
//
// 		const supabase = getSupabaseServiceClient();
//
// 		const { error } = await supabase.from("visitors").insert({
// 			ip_address: trackingData.ip,
// 			user_agent: trackingData.userAgent,
// 			country: trackingData.country,
// 			region: trackingData.region,
// 			city: trackingData.city,
// 			browser: trackingData.browser,
// 			os: trackingData.os,
// 			device: trackingData.device,
// 			path: new URL(request.url).pathname,
// 		});
//
// 		if (error) {
// 			console.error("Supabase insert error:", error);
// 			return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
// 		}
//
// 		return NextResponse.json({ ok: true });
// 	} catch (err) {
// 		console.error("Tracking error:", err);
// 		return NextResponse.json({ ok: false }, { status: 500 });
// 	}
// }
//
// export const dynamic = "force-dynamic";


// src/app/api/track-visit/route.ts
import { NextResponse } from "next/server";
import {getSupabaseServiceClient} from "@/lib/supabaseServer";
import { getTrackingData } from "@/lib/tracking";

const BOT_USER_AGENTS = [
	"vercel-screenshot",
	"Vercelbot",
	"bot",
	"crawl",
	"spider",
	"headless",
	"lighthouse",
	"preview",
	"slackbot",
	"facebookexternalhit",
	"twitterbot",
	"linkedinbot",
	"googlebot",
	"bingbot",
	"duckduckbot",
];

export async function POST(request: Request) {
	try {
		const trackingData = await getTrackingData(request);
		const userAgent = trackingData.userAgent.toLowerCase();

		// Ignore bots & Vercel screenshots
		if (BOT_USER_AGENTS.some(bot => userAgent.includes(bot))) {
			return NextResponse.json({ ok: true, ignored: true });
		}

		// Optional: Also ignore localhost / dev environments
		if (trackingData.ip === "127.0.0.1" || trackingData.ip.startsWith("192.168.")) {
			return NextResponse.json({ ok: true, ignored: true });
		}

		const supabase = getSupabaseServiceClient();

		const { error } = await supabase.from("visitors").insert({
			ip_address: trackingData.ip,
			user_agent: trackingData.userAgent,
			country: trackingData.country,
			region: trackingData.region,
			city: trackingData.city,
			browser: trackingData.browser,
			os: trackingData.os,
			device: trackingData.device,
			path: new URL(request.url).pathname,
		});

		if (error) {
			console.error("Supabase insert error:", error);
			return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
		}

		return NextResponse.json({ ok: true });
	} catch (err) {
		console.error("Tracking error:", err);
		return NextResponse.json({ ok: false }, { status: 500 });
	}
}

export const dynamic = "force-dynamic";
