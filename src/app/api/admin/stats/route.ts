
// src/app/api/admin/stats/visitordata.tsx
// Dashboard statistics
"use server"

import {NextRequest, NextResponse} from "next/server";
import {getSupabaseServiceClient} from "@/lib/supabaseServer";
import {verifyAuth} from "@/app/api/admin/auth/me/route";


export async function GET( request: NextRequest) {
	const user = verifyAuth(request);

	if (!user) {
		return NextResponse.json(
			{ error: "Unauthorized" },
			{ status: 401 }
		);
	}

	try {
		const supabase = getSupabaseServiceClient();

		// Get contact stats
		const { count: totalContacts } = await supabase
			.from("contact_submissions")
			.select("*", { count: "exact", head: true });

		const { count: newContacts } = await supabase
			.from("contact_submissions")
			.select("*", { count: "exact", head: true })
			.eq("status", "new");

		// Get quote stats
		const { count: totalQuotes } = await supabase
			.from("quote_requests")
			.select("*", { count: "exact", head: true });

		const { count: newQuotes } = await supabase
			.from("quote_requests")
			.select("*", { count: "exact", head: true })
			.eq("status", "new");

		// Get recent submissions (last 7 days)
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const { count: recentContacts } = await supabase
			.from("contact_submissions")
			.select("*", { count: "exact", head: true })
			.gte("created_at", sevenDaysAgo.toISOString());

		const { count: recentQuotes } = await supabase
			.from("quote_requests")
			.select("*", { count: "exact", head: true })
			.gte("created_at", sevenDaysAgo.toISOString());

		// Get country distribution
		const { data: countryData } = await supabase
			.from("contact_submissions")
			.select("country")
			.not("country", "is", null);

		const { data: quoteCountryData } = await supabase
			.from("quote_requests")
			.select("country")
			.not("country", "is", null);

		const allCountries = [
			...(countryData || []),
			...(quoteCountryData || []),
		];

		const countryDistribution = allCountries.reduce((acc: any, item) => {
			const country = item.country || "Unknown";
			acc[country] = (acc[country] || 0) + 1;
			return acc;
		}, {});

		// Get region distribution
		const { data: regionData } = await supabase
			.from("contact_submissions")
			.select("region")
			.not("region", "is", null);

		const { data: quoteRegionData } = await supabase
			.from("quote_requests")
			.select("region")
			.not("region", "is", null);

		const allRegions = [
			...(regionData || []),
			...(quoteRegionData || []),
		];

		const regionDistribution = allRegions.reduce((acc: any, item) => {
			const region = item.region || "Unknown";
			acc[region] = (acc[region] || 0) + 1;
			return acc;
		}, {});

		// Get device distribution
		const { data: deviceData } = await supabase
			.from("contact_submissions")
			.select("device")
			.not("device", "is", null);

		const { data: quoteDeviceData } = await supabase
			.from("quote_requests")
			.select("device")
			.not("device", "is", null);

		const allDevices = [
			...(deviceData || []),
			...(quoteDeviceData || []),
		];

		const deviceDistribution = allDevices.reduce((acc: any, item) => {
			const device = item.device || "Unknown";
			acc[device] = (acc[device] || 0) + 1;
			return acc;
		}, {});

		return NextResponse.json({
			contacts: {
				total: totalContacts || 0,
				new: newContacts || 0,
				recent: recentContacts || 0,
			},
			quotes: {
				total: totalQuotes || 0,
				new: newQuotes || 0,
				recent: recentQuotes || 0,
			},
			regions: regionDistribution,
			geography: countryDistribution,
			devices: deviceDistribution,
		});
	} catch (error) {
		console.error("Error fetching stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch statistics" },
			{ status: 500 }
		);
	}
}
