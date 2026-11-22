// // api/admin/visitors/route.tsx
// "use server";
//
// import {getSupabaseServiceClient} from "@/lib/supabaseServer";
//
//
// async function getVisitorStats() {
//
// 	const supabase = getSupabaseServiceClient();
//
// 	const [
// 		{ data: total },
// 		{ data: unique },
// 		{ data: today },
// 		{ data: month },
// 	] = await Promise.all([
// 		supabase.rpc("get_total_visits"),
// 		supabase.rpc("get_unique_visitors"),
// 		supabase.rpc("get_visits_today"),
// 		supabase.rpc("get_visits_this_month"),
// 	]);
//
// 	return {
// 		total: Number(total ?? 0),
// 		unique: Number(unique ?? 0),
// 		today: Number(today ?? 0),
// 		thisMonth: Number(month ?? 0),
// 	};
// }
//
// export default async function VisitorStatsData({ children,}: {
// 	children: (visitorStats: {
// 		total: number;
// 		unique: number;
// 		today: number;
// 		thisMonth: number;
// 	}) => React.ReactNode;
// }) {
// 	const visitorStats = await getVisitorStats();
//
// 	return (
// 		<>
// 			{children(visitorStats)}
// 		</>
// 	);
// }

// src/components/VisitorStats.tsx   ← .tsx file, NOT in /api folder!
"use server";

import { getSupabaseServiceClient } from "@/lib/supabaseServer";

async function getVisitorStats() {
	const supabase = getSupabaseServiceClient();

	const [
		{ data: total },
		{ data: unique },
		{ data: today },
		{ data: month },
	] = await Promise.all([
		supabase.rpc("get_total_visits"),
		supabase.rpc("get_unique_visitors"),
		supabase.rpc("get_visits_today"),
		supabase.rpc("get_visits_this_month"),
		supabase.rpc("get_visits_this_month"),
	]);

	return {
		total: Number(total ?? 0),
		unique: Number(unique ?? 0),
		today: Number(today ?? 0),
		thisMonth: Number(month ?? 0),
	};
}

// This is a pure Server Component — returns individual values
export async function VisitorStats() {
	const { total, unique, today, thisMonth } = await getVisitorStats();

	return {
		total,
		unique,
		today,
		thisMonth,
	};
}

// Optional: also export as individual named values if you prefer
export async function TotalVisits() {
	const { total } = await getVisitorStats();
	return total;
}

export async function UniqueVisitors() {
	const { unique } = await getVisitorStats();
	return unique;
}

export async function VisitsToday() {
	const { today } = await getVisitorStats();
	return today;
}

export async function VisitsThisMonth() {
	const { thisMonth } = await getVisitorStats();
	return thisMonth;
}
