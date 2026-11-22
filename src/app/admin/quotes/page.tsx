// src/app/admin/quotes/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Globe, Smartphone, Monitor, ArrowLeft } from "lucide-react";
import {TrackingInfo} from "@/components/ui/tracking-info";

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
	ip_address: string;
	country: string;
	region: string;
	city: string;
	browser: string;
	os: string;
	device: string;
	created_at: string;
}

export default function AdminQuotes() {
	const router = useRouter();
	const [quotes, setQuotes] = useState<Quote[]>([]);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0,
	});
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [projectTypeFilter, setProjectTypeFilter] = useState("all");
	const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

	useEffect(() => {
		checkAuth();
	}, []);

	useEffect(() => {
		fetchQuotes();
	}, [pagination.page, statusFilter, projectTypeFilter, search]);

	async function checkAuth() {
		try {
			const res = await fetch("/api/admin/auth/me");
			if (!res.ok) router.push("/admin/login");
		} catch {
			router.push("/admin/login");
		}
	}

	async function fetchQuotes() {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: pagination.page.toString(),
				limit: pagination.limit.toString(),
				status: statusFilter,
				projectType: projectTypeFilter,
				search: search,
			});

			const res = await fetch(`/api/admin/quotes?${params}`);
			if (!res.ok) throw new Error("Failed to fetch");

			const data = await res.json();
			setQuotes(data.data);
			setPagination(data.pagination);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	}

	async function updateStatus(id: string, newStatus: string) {
		try {
			const res = await fetch("/api/admin/quotes", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, status: newStatus }),
			});

			if (res.ok) {
				fetchQuotes();
				if (selectedQuote?.id === id) {
					setSelectedQuote({ ...selectedQuote, status: newStatus });
				}
			}
		} catch (error) {
			console.error("Error:", error);
		}
	}

	const getStatusColor = (status: string) => {
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

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center gap-4">
						<Button variant="ghost" size="sm" onClick={() => router.push("/admin")}>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back
						</Button>
						<h1 className="text-2xl font-bold text-gray-900">Quote Requests</h1>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8">
				<Card>
					<CardHeader>
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<CardTitle>All Quotes ({pagination.total})</CardTitle>
							<div className="flex flex-col sm:flex-row gap-2">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<Input
										placeholder="Search quotes..."
										value={search}
										onChange={(e) => {
											setSearch(e.target.value);
											setPagination({ ...pagination, page: 1 });
										}}
										className="pl-10 w-full sm:w-64"
									/>
								</div>
								<Select value={projectTypeFilter} onValueChange={setProjectTypeFilter}>
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
								<Select value={statusFilter} onValueChange={setStatusFilter}>
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
						{loading ? (
							<div className="flex justify-center py-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
							</div>
						) : quotes.length === 0 ? (
							<div className="text-center py-8 text-gray-500">No quotes found</div>
						) : (
							<>
								<div className="overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Name</TableHead>
												<TableHead>Project Type</TableHead>
												<TableHead>Plot Size</TableHead>
												<TableHead>Location</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{quotes.map((quote) => (
												<TableRow key={quote.id}>
													<TableCell className="font-medium">{quote.name}</TableCell>
													<TableCell className="capitalize">{quote.project_type}</TableCell>
													<TableCell>{quote.plot_size}</TableCell>
													<TableCell>
														<div className="flex items-center gap-1 text-sm">
															<Globe className="h-3 w-3" />
															{quote.location}
														</div>
													</TableCell>
													<TableCell>
														<Badge className={getStatusColor(quote.status)}>
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
															<Eye className="h-4 w-4" />
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>

								<div className="flex items-center justify-between mt-4">
									<p className="text-sm text-gray-500">
										Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
										{Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
										{pagination.total} results
									</p>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
											disabled={pagination.page === 1}
										>
											Previous
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
											disabled={pagination.page === pagination.totalPages}
										>
											Next
										</Button>
									</div>
								</div>
							</>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Detail Dialog */}
			<Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Quote Request Details</DialogTitle>
					</DialogHeader>
					{selectedQuote && (
						<div className="space-y-6">
							{/* Contact Info */}
							<div className="space-y-3">
								<h3 className="font-semibold text-lg">Contact Information</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-gray-500">Name</p>
										<p className="font-medium">{selectedQuote.name}</p>
									</div>
									<div>
										<p className="text-sm text-gray-500">Email</p>
										<p className="font-medium">{selectedQuote.email}</p>
									</div>
									<div>
										<p className="text-sm text-gray-500">Phone</p>
										<p className="font-medium">{selectedQuote.phone}</p>
									</div>
									{selectedQuote.company && (
										<div>
											<p className="text-sm text-gray-500">Company</p>
											<p className="font-medium">{selectedQuote.company}</p>
										</div>
									)}
									<div>
										<p className="text-sm text-gray-500">Status</p>
										<Select
											value={selectedQuote.status}
											onValueChange={(value) => updateStatus(selectedQuote.id, value)}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="new">New</SelectItem>
												<SelectItem value="reviewing">Reviewing</SelectItem>
												<SelectItem value="quoted">Quoted</SelectItem>
												<SelectItem value="accepted">Accepted</SelectItem>
												<SelectItem value="rejected">Rejected</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>

							{/* Project Details */}
							<div className="space-y-3">
								<h3 className="font-semibold text-lg">Project Details</h3>
								<div className="grid grid-cols-2 gap-4 bg-orange-50 p-4 rounded-lg">
									<div>
										<p className="text-sm text-gray-500">Project Type</p>
										<p className="font-medium capitalize">{selectedQuote.project_type}</p>
									</div>
									<div>
										<p className="text-sm text-gray-500">Plot Size</p>
										<p className="font-medium">{selectedQuote.plot_size}</p>
									</div>
									<div>
										<p className="text-sm text-gray-500">Location</p>
										<p className="font-medium">{selectedQuote.location}</p>
									</div>
									<div>
										<p className="text-sm text-gray-500">Budget</p>
										<p className="font-medium">{selectedQuote.budget || "Not specified"}</p>
									</div>
									<div>
										<p className="text-sm text-gray-500">Timeline</p>
										<p className="font-medium">
											{selectedQuote.timeline
												? new Date(selectedQuote.timeline).toLocaleDateString()
												: "To be decided"}
										</p>
									</div>
								</div>
							</div>

							{/* Services */}
							<div>
								<h3 className="font-semibold text-lg mb-2">Services Required</h3>
								<div className="flex flex-wrap gap-2">
									{selectedQuote.services.map((service) => (
										<Badge key={service} variant="secondary">
											{serviceLabels[service] || service}
										</Badge>
									))}
								</div>
							</div>

							{/* Description */}
							<div>
								<h3 className="font-semibold text-lg mb-2">Project Description</h3>
								<p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
									{selectedQuote.description}
								</p>
							</div>

							{/* Tracking Info */}
							<TrackingInfo data={selectedQuote} />
							{/*<div>*/}
							{/*	<h3 className="font-semibold text-lg mb-3">Tracking Information</h3>*/}
							{/*	<div className="bg-blue-50 p-4 rounded-lg space-y-3">*/}
							{/*		<div className="flex items-start gap-3">*/}
							{/*			<Globe className="h-5 w-5 text-blue-600 mt-0.5" />*/}
							{/*			<div>*/}
							{/*				<p className="text-sm font-medium">Location</p>*/}
							{/*				<p className="text-sm text-gray-600">*/}
							{/*					{selectedQuote.city && `${selectedQuote.city}, `}*/}
							{/*					{selectedQuote.region && `${selectedQuote.region}, `}*/}
							{/*					{selectedQuote.country || "Unknown"}*/}
							{/*				</p>*/}
							{/*				<p className="text-xs text-gray-500 mt-1">IP: {selectedQuote.ip_address}</p>*/}
							{/*			</div>*/}
							{/*		</div>*/}
							{/*		<div className="flex items-start gap-3">*/}
							{/*			<Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />*/}
							{/*			<div>*/}
							{/*				<p className="text-sm font-medium">Device</p>*/}
							{/*				<p className="text-sm text-gray-600">{selectedQuote.device || "Unknown"}</p>*/}
							{/*			</div>*/}
							{/*		</div>*/}
							{/*		<div className="flex items-start gap-3">*/}
							{/*			<Monitor className="h-5 w-5 text-blue-600 mt-0.5" />*/}
							{/*			<div>*/}
							{/*				<p className="text-sm font-medium">Browser & OS</p>*/}
							{/*				<p className="text-sm text-gray-600">*/}
							{/*					{selectedQuote.browser || "Unknown"} on {selectedQuote.os || "Unknown"}*/}
							{/*				</p>*/}
							{/*			</div>*/}
							{/*		</div>*/}
							{/*	</div>*/}
							{/*</div>*/}

							<div className="text-sm text-gray-500">
								<p>Submitted: {new Date(selectedQuote.created_at).toLocaleString()}</p>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
