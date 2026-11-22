// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {Users, FileText, TrendingUp, Globe, Smartphone, AlertCircle, Search, Eye, LogOut,} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TrackingInfo } from "@/components/ui/tracking-info";
import Image from "next/image";
import teamImage from "../../../attached_assets/3d_logo.png";
import WorldMap from "@/components/ui/geography-map";
import {VisitorStats} from "@/components/visitordata";

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
	regions: Record<string, number>;
	geography: Record<string, number>;
	devices: Record<string, number>;
}

interface Contact {
	id: string;
	name: string;
	email: string;
	phone: string;
	message: string;
	status: string;
	admin_notes: string | null;
	ip_address: string;
	country: string;
	region: string;
	city: string;
	browser: string;
	os: string;
	device: string;
	created_at: string;
}

interface Quote {
	id: string;
	name: string;
	email: string;
	phone: string;
	company: string;
	project_type: string;
	plot_size: string;
	location: string;
	budget: string;
	timeline: string;
	services: string[];
	description: string;
	status: string;
	admin_notes: string | null;
	ip_address: string;
	country: string;
	region: string;
	city: string;
	browser: string;
	os: string;
	device: string;
	created_at: string;
}

interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export default function AdminDashboard() {
	const router = useRouter();
	const [stats, setStats] = useState<Stats | null>(null);
	const [vstats, setVstats] = useState<{ total: number; unique: number; today: number; thisMonth: number } | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Contacts states
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [contactsPagination, setContactsPagination] = useState<Pagination>({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0,
	});
	const [contactsLoading, setContactsLoading] = useState(false);
	const [contactsSearch, setContactsSearch] = useState("");
	const [contactsStatusFilter, setContactsStatusFilter] = useState("all");
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
	const [contactNotesDialogOpen, setContactNotesDialogOpen] = useState(false);
	const [contactPendingStatus, setContactPendingStatus] = useState("");
	const [contactAdminNotesInput, setContactAdminNotesInput] = useState("");

	// Quotes states
	const [quotes, setQuotes] = useState<Quote[]>([]);
	const [quotesPagination, setQuotesPagination] = useState<Pagination>({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0,
	});
	const [quotesLoading, setQuotesLoading] = useState(false);
	const [quotesSearch, setQuotesSearch] = useState("");
	const [quotesStatusFilter, setQuotesStatusFilter] = useState("all");
	const [quotesProjectTypeFilter, setQuotesProjectTypeFilter] = useState("all");
	const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
	const [quoteNotesDialogOpen, setQuoteNotesDialogOpen] = useState(false);
	const [quotePendingStatus, setQuotePendingStatus] = useState("");
	const [quoteAdminNotesInput, setQuoteAdminNotesInput] = useState("");

	useEffect(() => {
		checkAuth();
		fetchStats();
	}, []);

	useEffect(() => {
		if (!loading) {
			fetchContacts();
			fetchQuotes();
		}
	}, [contactsPagination.page, contactsStatusFilter, contactsSearch, quotesPagination.page, quotesStatusFilter, quotesProjectTypeFilter, quotesSearch, loading]);

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

	// Contacts functions
	async function fetchContacts() {
		setContactsLoading(true);
		try {
			const params = new URLSearchParams({
				page: contactsPagination.page.toString(),
				limit: contactsPagination.limit.toString(),
				status: contactsStatusFilter,
				search: contactsSearch,
			});

			const res = await fetch(`/api/admin/contacts?${params}`);
			if (!res.ok) throw new Error("Failed to fetch");
			const data = await res.json();
			setContacts(data.data);
			setContactsPagination(data.pagination);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setContactsLoading(false);
		}
	}

	async function updateContactStatus(id: string, newStatus: string, adminNotes: string) {
		try {
			const res = await fetch("/api/admin/contacts", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, status: newStatus, admin_notes: adminNotes }),
			});

			if (res.ok) {
				fetchContacts();
				if (selectedContact?.id === id) {
					setSelectedContact({ ...selectedContact, status: newStatus, admin_notes: adminNotes });
				}
			}
		} catch (error) {
			console.error("Error:", error);
		}
	}

	function handleContactStatusChange(value: string) {
		if (selectedContact) {
			setContactPendingStatus(value);
			setContactAdminNotesInput(selectedContact.admin_notes || "");
			setContactNotesDialogOpen(true);
		}
	}

	function confirmContactStatusUpdate() {
		if (selectedContact && contactPendingStatus) {
			updateContactStatus(selectedContact.id, contactPendingStatus, contactAdminNotesInput);
			setContactNotesDialogOpen(false);
		}
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case "new":
				return "bg-blue-100 text-blue-800";
			case "contacted":
				return "bg-yellow-100 text-yellow-800";
			case "resolved":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// Quotes functions
	async function fetchQuotes() {
		setQuotesLoading(true);
		try {
			const params = new URLSearchParams({
				page: quotesPagination.page.toString(),
				limit: quotesPagination.limit.toString(),
				status: quotesStatusFilter,
				projectType: quotesProjectTypeFilter,
				search: quotesSearch,
			});

			const res = await fetch(`/api/admin/quotes?${params}`);
			if (!res.ok) throw new Error("Failed to fetch");
			const data = await res.json();
			setQuotes(data.data);
			setQuotesPagination(data.pagination);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setQuotesLoading(false);
		}
	}

	async function updateQuoteStatus(id: string, newStatus: string, adminNotes: string) {
		try {
			const res = await fetch("/api/admin/quotes", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, status: newStatus, admin_notes: adminNotes }),
			});

			if (res.ok) {
				fetchQuotes();
				if (selectedQuote?.id === id) {
					setSelectedQuote({ ...selectedQuote, status: newStatus, admin_notes: adminNotes });
				}
			}
		} catch (error) {
			console.error("Error:", error);
		}
	}

	function handleQuoteStatusChange(value: string) {
		if (selectedQuote) {
			setQuotePendingStatus(value);
			setQuoteAdminNotesInput(selectedQuote.admin_notes || "");
			setQuoteNotesDialogOpen(true);
		}
	}

	function confirmQuoteStatusUpdate() {
		if (selectedQuote && quotePendingStatus) {
			updateQuoteStatus(selectedQuote.id, quotePendingStatus, quoteAdminNotesInput);
			setQuoteNotesDialogOpen(false);
		}
	}

	const getQuoteStatusColor = (status: string) => {
		switch (status) {
			case "new":
				return "bg-blue-100 text-blue-800";
			case "reviewing":
				return "bg-yellow-100 text-yellow-800";
			case "quoted":
				return "bg-purple-100 text-purple-800";
			case "accepted":
				return "bg-green-100 text-green-800";
			case "rejected":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const serviceLabels: Record<string, string> = {
		construction: "Full Construction",
		planning: "Architectural Planning",
		structural: "Structural Design",
		renovation: "Renovation",
		interior: "Interior Finishing",
		consultation: "General Consultation",
	};

	useEffect(() => {
		VisitorStats()
			.then(setVstats)
			.catch(err => {
				console.error('Failed to load visitor stats:', err);
				setVstats({ total: 0, unique: 0, today: 0, thisMonth: 0 }); // fallback
			});
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (error || !stats) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Card className="w-96">
					<CardContent className="pt-6">
						<div className="flex items-center gap-2 text-destructive">
							<AlertCircle className="h-5 w-5" />
							<p>{error || "Failed to load data"}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Helper for max in distributions
	const geoEntries = Object.entries(stats.geography).sort(([, a], [, b]) => b - a);
	const geoTotal = geoEntries.reduce((sum, [, count]) => sum + count, 0);
	const geoMax = geoEntries[0]?.[1] || 1;

	const regEntries = Object.entries(stats.regions).sort(([, a], [, b]) => b - a);
	const regTotal = regEntries.reduce((sum, [, count]) => sum + count, 0);
	const regMax = regEntries[0]?.[1] || 1;

	const deviceEntries = Object.entries(stats.devices).sort(([, a], [, b]) => b - a);
	const deviceMax = deviceEntries[0]?.[1] || 1;
	const deviceTotal = deviceEntries.reduce((sum, [, count]) => sum + count, 0);

	const Vstats = VisitorStats();

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="bg-card border-b border-border">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex flex-row items-center gap-3 leading-tight">
						<div className="flex items-center gap-2">
							<Image
								src={teamImage}
								alt="MBN"
								width={160}
								height={160}
								draggable={false}
								className=" w-32 sm:w-36 md:w-40 lg:w-44 rounded-3xl pointer-events-none select-none"
							/>
						</div>
						<h1 className="text-xl md:text-3xl font-bold text-foreground">
							Admin Panel
						</h1>
					</div>

					<Button
						onClick={handleLogout}
						className="bg-destructive md:rounded-xl rounded-3xl hover:bg-destructive/90 text-destructive-foreground flex items-center gap-2"
					>
						<LogOut className="h-4 w-4" />
						{/* Text only visible on md+ screens */}
						<span className="hidden md:inline">Logout</span>
					</Button>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8 space-y-8">
				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
					<Card className="shadow-md hover:shadow-lg transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.contacts.total}</div>
							<p className="text-xs text-muted-foreground">
								{stats.contacts.new} new submissions
							</p>
						</CardContent>
					</Card>

					<Card className="shadow-md hover:shadow-lg transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.quotes.total}</div>
							<p className="text-xs text-muted-foreground">
								{stats.quotes.new} pending review
							</p>
						</CardContent>
					</Card>

					<Card className="shadow-md hover:shadow-lg transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Recent Activity (7d)</CardTitle>
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

					<Card className="shadow-md hover:shadow-lg transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Top Country</CardTitle>
							<Globe className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent className="flex flex-row items-center justify-start gap-10">
							<div>
								<div className="text-2xl font-bold">
									{geoEntries.length > 0 ? geoEntries[0][0] : "N/A"}
								</div>
								<p className="text-xs text-muted-foreground">
									{geoEntries.length} countries total
								</p>
							</div>
							<div>
								<div className="text-2xl font-bold">
									{regEntries.length > 0 ? regEntries[0][0] : "N/A"}
								</div>
								<p className="text-xs text-muted-foreground">
									{regEntries.length} regions total
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Tabs */}
				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="bg-card p-1 rounded-lg shadow-sm">
						<TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
						<TabsTrigger value="contacts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Contacts</TabsTrigger>
						<TabsTrigger value="quotes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Quotes</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-6 animate-fade-in">
						<WorldMap
							data={stats.geography}
							showStats={true}
							enableZoom={true}
							colorScheme={"purple"}
						/>
						{ vstats ? (
							<div className="p-8">
								<h1 className="text-3xl font-bold mb-8">Visitor Statistics</h1>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
									<div className="text-center p-6 bg-white rounded-xl shadow">
										<p className="text-5xl font-bold text-blue-600">{vstats.total.toLocaleString()}</p>
										<p className="text-gray-600 mt-2">Total Visits</p>
									</div>
									<div className="text-center p-6 bg-white rounded-xl shadow">
										<p className="text-5xl font-bold text-green-600">{vstats.unique.toLocaleString()}</p>
										<p className="text-gray-600 mt-2">Unique Visitors</p>
									</div>
									<div className="text-center p-6 bg-white rounded-xl shadow">
										<p className="text-5xl font-bold text-orange-600">{vstats.today}</p>
										<p className="text-gray-600 mt-2">Today</p>
									</div>
									<div className="text-center p-6 bg-white rounded-xl shadow">
										<p className="text-5xl font-bold text-purple-600">{vstats.thisMonth.toLocaleString()}</p>
										<p className="text-gray-600 mt-2">This Month</p>
									</div>
								</div>
							</div>
						) : (
							<div className="p-8 text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
								<p className="mt-4 text-muted-foreground">Loading visitor statistics...</p>
							</div>
						)}

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Enhanced Geography Distribution */}
							<Card className="shadow-md">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-primary">
										<Globe className="h-5 w-5" />
										Country Distribution
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{geoEntries.slice(0, 5).map(([country, count]) => (
											<div key={country} className="space-y-1">
												<div className="flex items-center justify-between text-sm">
													<span className="font-medium">{country}</span>
													<span className="text-muted-foreground">{count} ({Math.round((count / geoTotal) * 100)}%)</span>
												</div>
												<div className="h-2 bg-muted rounded-full overflow-hidden">
													<div
														className="h-full bg-primary transition-all duration-500"
														style={{ width: `${(count / geoMax) * 100}%` }}
													/>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Enhanced Region Distribution */}
							<Card className="shadow-md">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-primary">
										<Globe className="h-5 w-5" />
										Region Distribution
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{regEntries.slice(0, 5).map(([region, count]) => (
											<div key={region} className="space-y-1">
												<div className="flex items-center justify-between text-sm">
													<span className="font-medium">{region}</span>
													<span className="text-muted-foreground">{count} ({Math.round((count / regTotal) * 100)}%)</span>
												</div>
												<div className="h-2 bg-muted rounded-full overflow-hidden">
													<div
														className="h-full bg-primary transition-all duration-500"
														style={{ width: `${(count / regMax) * 100}%` }}
													/>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Enhanced Device Distribution */}
							<Card className="shadow-md">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-primary">
										<Smartphone className="h-5 w-5" />
										Device Distribution
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{deviceEntries.slice(0, 5).map(([device, count]) => (
											<div key={device} className="space-y-1">
												<div className="flex items-center justify-between text-sm">
													<span className="font-medium truncate">{device}</span>
													<span className="text-muted-foreground">{count} ({Math.round((count / deviceTotal) * 100)}%)</span>
												</div>
												<div className="h-2 bg-muted rounded-full overflow-hidden">
													<div
														className="h-full bg-accent transition-all duration-500"
														style={{ width: `${(count / deviceMax) * 100}%` }}
													/>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="contacts" className="animate-fade-in">
						<Card className="shadow-md">
							<CardHeader>
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
									<CardTitle className="text-primary">All Contacts ({contactsPagination.total})</CardTitle>
									<div className="flex flex-col sm:flex-row gap-2">
										<div className="relative">
											<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
											<Input
												placeholder="Search contacts..."
												value={contactsSearch}
												onChange={(e) => {
													setContactsSearch(e.target.value);
													setContactsPagination({ ...contactsPagination, page: 1 });
												}}
												className="pl-10 w-full sm:w-64"
											/>
										</div>
										<Select value={contactsStatusFilter} onValueChange={setContactsStatusFilter}>
											<SelectTrigger className="w-full sm:w-40">
												<SelectValue placeholder="Status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Status</SelectItem>
												<SelectItem value="new">New</SelectItem>
												<SelectItem value="contacted">Contacted</SelectItem>
												<SelectItem value="resolved">Resolved</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								{contactsLoading ? (
									<div className="flex justify-center py-8">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
									</div>
								) : contacts.length === 0 ? (
									<div className="text-center py-8 text-muted-foreground">
										No contacts found
									</div>
								) : (
									<>
										<div className="overflow-x-auto">
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>Name</TableHead>
														<TableHead>Email</TableHead>
														<TableHead>Phone</TableHead>
														<TableHead>Status</TableHead>
														<TableHead>Submitted</TableHead>
														<TableHead>Actions</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{contacts.map((contact) => (
														<TableRow key={contact.id} className="hover:bg-muted/50 transition-colors">
															<TableCell className="font-medium">{contact.name}</TableCell>
															<TableCell>{contact.email}</TableCell>
															<TableCell>{contact.phone}</TableCell>
															<TableCell>
																<Badge className={getStatusColor(contact.status)}>
																	{contact.status}
																</Badge>
															</TableCell>
															<TableCell>
																{new Date(contact.created_at).toLocaleDateString()}
															</TableCell>
															<TableCell>
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() => setSelectedContact(contact)}
																>
																	<Eye className="h-4 w-4 text-blue-600" />
																</Button>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>

										{/* Pagination */}
										<div className="flex items-center justify-between mt-4">
											<p className="text-sm text-muted-foreground">
												Showing {(contactsPagination.page - 1) * contactsPagination.limit + 1} to{" "}
												{Math.min(contactsPagination.page * contactsPagination.limit, contactsPagination.total)} of{" "}
												{contactsPagination.total} results
											</p>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														setContactsPagination({ ...contactsPagination, page: contactsPagination.page - 1 })
													}
													disabled={contactsPagination.page === 1}
												>
													Previous
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														setContactsPagination({ ...contactsPagination, page: contactsPagination.page + 1 })
													}
													disabled={contactsPagination.page === contactsPagination.totalPages}
												>
													Next
												</Button>
											</div>
										</div>
									</>
								)}
							</CardContent>
						</Card>

						{/* Contact Detail Dialog */}
						<Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
							<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
								<DialogHeader>
									<DialogTitle>Contact Details</DialogTitle>
								</DialogHeader>
								{selectedContact && (
									<div className="space-y-6">
										<div className="space-y-3">
											<h3 className="font-semibold text-lg text-primary">Contact Information</h3>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm text-muted-foreground">Name</p>
													<p className="font-medium">{selectedContact.name}</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Email</p>
													<p className="font-medium">{selectedContact.email}</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Phone</p>
													<p className="font-medium">{selectedContact.phone}</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Status</p>
													{selectedContact.status === "resolved" ? (
														<>
															<div>
																<Badge className={`${getStatusColor(selectedContact.status)} text-md border-black/20 rounded-full`}>
																	{selectedContact.status}
																</Badge>
															</div>
														</>
														) : (
														<Select
															value={selectedContact.status}
															onValueChange={handleContactStatusChange}
														>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																{selectedContact.status === "new" && (
																	<>
																		<SelectItem value="new">New</SelectItem>
																		<SelectItem value="contacted">Contacted</SelectItem>
																		<SelectItem value="resolved">Resolved</SelectItem>
																	</>
																)}

																{selectedContact.status === "contacted" && (
																	<>
																		<SelectItem value="contacted">Contacted</SelectItem>
																		<SelectItem value="resolved">Resolved</SelectItem>
																	</>
																)}
															</SelectContent>
														</Select>
													)}
												</div>
											</div>
										</div>

										<div>
											<h3 className="font-semibold text-lg mb-2 text-primary">Message</h3>
											<p className="text-foreground whitespace-pre-wrap bg-card p-4 rounded-lg shadow-inner">
												{selectedContact.message}
											</p>
										</div>

										<div>
											<h3 className="font-semibold text-lg mb-2 text-primary">Admin Notes</h3>
											<p className="text-foreground whitespace-pre-wrap bg-card p-4 rounded-lg shadow-inner">
												{selectedContact.admin_notes || "No notes yet"}
											</p>
										</div>

										<TrackingInfo data={selectedContact} />

										<div className="text-sm text-muted-foreground">
											<p>
												Submitted:{" "}
												{new Date(selectedContact.created_at).toLocaleString()}
											</p>
										</div>
									</div>
								)}
							</DialogContent>
						</Dialog>

						{/* Contact Notes Dialog */}
						<Dialog open={contactNotesDialogOpen} onOpenChange={setContactNotesDialogOpen}>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Update Status</DialogTitle>
									<DialogDescription>
										Add notes for this status change. These will be sent to the user.
									</DialogDescription>
								</DialogHeader>
								<Textarea
									placeholder="Inform user about why status updated..."
									value={contactAdminNotesInput}
									onChange={(e) => setContactAdminNotesInput(e.target.value)}
									className="min-h-[100px]"
								/>
								<DialogFooter>
									<Button variant="outline" onClick={() => setContactNotesDialogOpen(false)}>
										Cancel
									</Button>
									<Button
										onClick={confirmContactStatusUpdate}
										disabled={!contactAdminNotesInput.trim()}
									>
										Confirm Update
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</TabsContent>

					<TabsContent value="quotes" className="animate-fade-in">
						<Card className="shadow-md">
							<CardHeader>
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
									<CardTitle className="text-primary">All Quotes ({quotesPagination.total})</CardTitle>
									<div className="flex flex-col sm:flex-row gap-2">
										<div className="relative">
											<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
											<Input
												placeholder="Search quotes..."
												value={quotesSearch}
												onChange={(e) => {
													setQuotesSearch(e.target.value);
													setQuotesPagination({ ...quotesPagination, page: 1 });
												}}
												className="pl-10 w-full sm:w-64"
											/>
										</div>
										<Select value={quotesProjectTypeFilter} onValueChange={setQuotesProjectTypeFilter}>
											<SelectTrigger className="w-full sm:w-40">
												<SelectValue placeholder="Project Type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Types</SelectItem>
												<SelectItem value="residential">Residential</SelectItem>
												<SelectItem value="commercial">Commercial</SelectItem>
												<SelectItem value="industrial">Industrial</SelectItem>
												<SelectItem value="renovation">Renovation</SelectItem>
											</SelectContent>
										</Select>
										<Select value={quotesStatusFilter} onValueChange={setQuotesStatusFilter}>
											<SelectTrigger className="w-full sm:w-40">
												<SelectValue placeholder="Status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Status</SelectItem>
												<SelectItem value="new">New</SelectItem>
												<SelectItem value="reviewing">Reviewing</SelectItem>
												<SelectItem value="quoted">Quoted</SelectItem>
												<SelectItem value="accepted">Accepted</SelectItem>
												<SelectItem value="rejected">Rejected</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								{quotesLoading ? (
									<div className="flex justify-center py-8">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
									</div>
								) : quotes.length === 0 ? (
									<div className="text-center py-8 text-muted-foreground">
										No quotes found
									</div>
								) : (
									<>
										<div className="overflow-x-auto">
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>Name</TableHead>
														<TableHead>Email</TableHead>
														<TableHead>Project Type</TableHead>
														<TableHead>Status</TableHead>
														<TableHead>Submitted</TableHead>
														<TableHead>Actions</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{quotes.map((quote) => (
														<TableRow key={quote.id} className="hover:bg-muted/50 transition-colors">
															<TableCell className="font-medium">{quote.name}</TableCell>
															<TableCell>{quote.email}</TableCell>
															<TableCell className="capitalize">{quote.project_type}</TableCell>
															<TableCell>
																<Badge className={getQuoteStatusColor(quote.status)}>
																	{quote.status}
																</Badge>
															</TableCell>
															<TableCell>
																{new Date(quote.created_at).toLocaleDateString()}
															</TableCell>
															<TableCell>
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() => setSelectedQuote(quote)}
																>
																	<Eye className="h-4 w-4 text-blue-600" />
																</Button>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>

										{/* Pagination */}
										<div className="flex items-center justify-between mt-4">
											<p className="text-sm text-muted-foreground">
												Showing {(quotesPagination.page - 1) * quotesPagination.limit + 1} to{" "}
												{Math.min(quotesPagination.page * quotesPagination.limit, quotesPagination.total)} of{" "}
												{quotesPagination.total} results
											</p>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														setQuotesPagination({ ...quotesPagination, page: quotesPagination.page - 1 })
													}
													disabled={quotesPagination.page === 1}
												>
													Previous
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														setQuotesPagination({ ...quotesPagination, page: quotesPagination.page + 1 })
													}
													disabled={quotesPagination.page === quotesPagination.totalPages}
												>
													Next
												</Button>
											</div>
										</div>
									</>
								)}
							</CardContent>
						</Card>

						{/* Quote Detail Dialog */}
						<Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
							<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
								<DialogHeader>
									<DialogTitle>Quote Request Details</DialogTitle>
								</DialogHeader>
								{selectedQuote && (
									<div className="space-y-6">
										<div className="space-y-3">
											<h3 className="font-semibold text-lg text-primary">Contact Information</h3>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm text-muted-foreground">Name</p>
													<p className="font-medium">{selectedQuote.name}</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Email</p>
													<p className="font-medium">{selectedQuote.email}</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Phone</p>
													<p className="font-medium">{selectedQuote.phone}</p>
												</div>
												{selectedQuote.company && (
													<div>
														<p className="text-sm text-muted-foreground">Company</p>
														<p className="font-medium">{selectedQuote.company}</p>
													</div>
												)}
												<div>
													<p className="text-sm text-muted-foreground">Status</p>
													{(selectedQuote.status === "accepted" || selectedQuote.status === "rejected") ? (
														<>
															<div>
																<Badge className={`${getQuoteStatusColor(selectedQuote.status)} text-md border-black/20 rounded-full`}>
																	{selectedQuote.status}
																</Badge>
															</div>
														</>
													) : (
														<Select
															value={selectedQuote.status}
															onValueChange={handleQuoteStatusChange}
														>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>

																<SelectContent>
																	{selectedQuote.status === "new" && (
																		<>
																			<SelectItem value="new">New</SelectItem>
																			<SelectItem value="reviewing">Reviewing</SelectItem>
																			<SelectItem value="quoted">Quoted</SelectItem>
																			<SelectItem value="accepted">Accepted</SelectItem>
																			<SelectItem value="rejected">Rejected</SelectItem>
																		</>
																	)}

																	{selectedQuote.status === "reviewing" && (
																		<>
																			<SelectItem value="reviewing">Reviewing</SelectItem>
																			<SelectItem value="quoted">Quoted</SelectItem>
																			<SelectItem value="accepted">Accepted</SelectItem>
																			<SelectItem value="rejected">Rejected</SelectItem>
																		</>
																	)}

																	{selectedQuote.status === "quoted" && (
																		<>
																			<SelectItem value="quoted">Quoted</SelectItem>
																			<SelectItem value="accepted">Accepted</SelectItem>
																			<SelectItem value="rejected">Rejected</SelectItem>
																		</>
																	)}

																	{selectedQuote.status === "accepted" && (
																		<SelectItem value="accepted">Accepted</SelectItem>
																	)}

																	{selectedQuote.status === "rejected" && (
																		<SelectItem value="rejected">Rejected</SelectItem>
																	)}
																</SelectContent>
														</Select>
													)}
												</div>
											</div>
										</div>

										<div className="space-y-3">
											<h3 className="font-semibold text-lg text-primary">Project Details</h3>
											<div className="grid grid-cols-2 gap-4 bg-accent/10 p-4 rounded-lg">
												<div>
													<p className="text-sm text-muted-foreground">Project Type</p>
													<p className="font-medium capitalize">{selectedQuote.project_type}</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Plot Size</p>
													<p className="font-medium">{selectedQuote.plot_size}</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Location</p>
													<p className="font-medium">{selectedQuote.location}</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Budget</p>
													<p className="font-medium">{selectedQuote.budget || "Not specified"}</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Timeline</p>
													<p className="font-medium">
														{selectedQuote.timeline
															? new Date(selectedQuote.timeline).toLocaleDateString()
															: "To be decided"}
													</p>
												</div>
											</div>
										</div>

										<div>
											<h3 className="font-semibold text-lg mb-2 text-primary">Services Required</h3>
											<div className="flex flex-wrap gap-2">
												{selectedQuote.services.map((service) => (
													<Badge key={service} variant="secondary" className="bg-secondary text-secondary-foreground">
														{serviceLabels[service] || service}
													</Badge>
												))}
											</div>
										</div>

										<div>
											<h3 className="font-semibold text-lg mb-2 text-primary">Project Description</h3>
											<p className="text-foreground whitespace-pre-wrap bg-card p-4 rounded-lg shadow-inner">
												{selectedQuote.description}
											</p>
										</div>

										<div>
											<h3 className="font-semibold text-lg mb-2 text-primary">Admin Notes</h3>
											<p className="text-foreground whitespace-pre-wrap bg-card p-4 rounded-lg shadow-inner">
												{selectedQuote.admin_notes || "No notes yet"}
											</p>
										</div>

										<TrackingInfo data={selectedQuote} />

										<div className="text-sm text-muted-foreground">
											<p>Submitted: {new Date(selectedQuote.created_at).toLocaleString()}</p>
										</div>
									</div>
								)}
							</DialogContent>
						</Dialog>

						{/* Quote Notes Dialog */}
						<Dialog open={quoteNotesDialogOpen} onOpenChange={setQuoteNotesDialogOpen}>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Update Status</DialogTitle>
									<DialogDescription>
										Add notes for this status change. These will be sent to the user.
									</DialogDescription>
								</DialogHeader>
								<Textarea
									placeholder="Enter admin notes..."
									value={quoteAdminNotesInput}
									onChange={(e) => setQuoteAdminNotesInput(e.target.value)}
									className="min-h-[100px]"
								/>
								<DialogFooter>
									<Button variant="outline" onClick={() => setQuoteNotesDialogOpen(false)}>
										Cancel
									</Button>
									<Button
										onClick={confirmQuoteStatusUpdate}
										disabled={!quoteAdminNotesInput.trim()}
									>
										Confirm Update
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
