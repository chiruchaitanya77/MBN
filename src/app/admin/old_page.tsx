// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, TrendingUp, Globe, Smartphone, AlertCircle,} from "lucide-react";

interface Stats {
	contacts: {
		total: number;
		new: number;
		recent: number;
	};
	quotes: {
		total: number;
		new: number;
		recent: number;
	};
	geography: Record<string, number>;
	devices: Record<string, number>;
}

export default function AdminDashboard() {
	const router = useRouter();
	const [stats, setStats] = useState<Stats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		checkAuth();
		fetchStats();
	}, []);

	async function checkAuth() {
		try {
			const res = await fetch("/api/admin/auth/me");
			if (!res.ok) {
				router.push("/admin/login");
			}
		} catch {
			router.push("/admin/login");
		}
	}

	async function fetchStats() {
		try {
			const res = await fetch("/api/admin/stats");
			console.log(res);
			if (!res.ok) throw new Error("Failed to fetch stats");
			const data = await res.json();
			setStats(data);
		} catch (err) {
			setError("Failed to load statistics");
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	async function handleLogout() {
		await fetch("/api/admin/auth/logout", { method: "POST" });
		router.push("/admin/login");
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
			</div>
		);
	}

	if (error || !stats) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Card className="w-96">
					<CardContent className="pt-6">
						<div className="flex items-center gap-2 text-red-500">
							<AlertCircle className="h-5 w-5" />
							<p>{error || "Failed to load data"}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<h1 className="text-2xl font-bold text-gray-900">
						MBN Construction Admin
					</h1>
					<button
						onClick={handleLogout}
						className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 cursor-pointer text-white rounded-lg transition"
					>
						Logout
					</button>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8">
				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Contacts
							</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.contacts.total}</div>
							<p className="text-xs text-muted-foreground">
								{stats.contacts.new} new submissions
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Quotes
							</CardTitle>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.quotes.total}</div>
							<p className="text-xs text-muted-foreground">
								{stats.quotes.new} pending review
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Recent Activity (7d)
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats.contacts.recent + stats.quotes.recent}
							</div>
							<p className="text-xs text-muted-foreground">
								{stats.contacts.recent} contacts, {stats.quotes.recent} quotes
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Top Country
							</CardTitle>
							<Globe className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{Object.keys(stats.geography).length > 0
									? Object.entries(stats.geography).sort(
										([, a], [, b]) => b - a
									)[0][0]
									: "N/A"}
							</div>
							<p className="text-xs text-muted-foreground">
								{Object.keys(stats.geography).length} countries total
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Main Content */}
				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="contacts">Contacts</TabsTrigger>
						<TabsTrigger value="quotes">Quotes</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Geography Distribution */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Globe className="h-5 w-5" />
										Geographic Distribution
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{Object.entries(stats.geography)
											.sort(([, a], [, b]) => b - a)
											.slice(0, 5)
											.map(([country, count]) => (
												<div key={country} className="flex items-center justify-between">
													<span className="text-sm font-medium">{country}</span>
													<span className="text-sm text-gray-500">{count}</span>
												</div>
											))}
									</div>
								</CardContent>
							</Card>

							{/* Device Distribution */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Smartphone className="h-5 w-5" />
										Device Distribution
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{Object.entries(stats.devices)
											.sort(([, a], [, b]) => b - a)
											.slice(0, 5)
											.map(([device, count]) => (
												<div key={device} className="flex items-center justify-between">
													<span className="text-sm font-medium truncate">{device}</span>
													<span className="text-sm text-gray-500">{count}</span>
												</div>
											))}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="contacts">
						<Card>
							<CardHeader>
								<CardTitle>Contact Submissions</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-500">
									View detailed contact submissions in the{" "}
									<a href="/admin/contacts" className="text-orange-500 hover:underline">
										Contacts page
									</a>
								</p>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="quotes">
						<Card>
							<CardHeader>
								<CardTitle>Quote Requests</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-500">
									View detailed quote requests in the{" "}
									<a href="/admin/quotes" className="text-orange-500 hover:underline">
										Quotes page
									</a>
								</p>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

