// src/app/admin/contacts/page.tsx
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

interface Contact {
	id: string;
	name: string;
	email: string;
	phone: string;
	message: string;
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

interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export default function AdminContacts() {
	const router = useRouter();
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [pagination, setPagination] = useState<Pagination>({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0,
	});
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

	useEffect(() => {
		checkAuth();
	}, []);

	useEffect(() => {
		fetchContacts();
	}, [pagination.page, statusFilter, search]);

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

	async function fetchContacts() {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: pagination.page.toString(),
				limit: pagination.limit.toString(),
				status: statusFilter,
				search: search,
			});

			const res = await fetch(`/api/admin/contacts?${params}`);
			if (!res.ok) throw new Error("Failed to fetch");

			const data = await res.json();
			setContacts(data.data);
			setPagination(data.pagination);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	}

	async function updateStatus(id: string, newStatus: string) {
		try {
			const res = await fetch("/api/admin/contacts", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, status: newStatus }),
			});

			if (res.ok) {
				fetchContacts();
				if (selectedContact?.id === id) {
					setSelectedContact({ ...selectedContact, status: newStatus });
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
			case "contacted":
				return "bg-yellow-100 text-yellow-800";
			case "resolved":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => router.push("/admin")}
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back
						</Button>
						<h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8">
				<Card>
					<CardHeader>
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<CardTitle>All Contacts ({pagination.total})</CardTitle>
							<div className="flex flex-col sm:flex-row gap-2">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<Input
										placeholder="Search contacts..."
										value={search}
										onChange={(e) => {
											setSearch(e.target.value);
											setPagination({ ...pagination, page: 1 });
										}}
										className="pl-10 w-full sm:w-64"
									/>
								</div>
								<Select value={statusFilter} onValueChange={setStatusFilter}>
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
						{loading ? (
							<div className="flex justify-center py-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
							</div>
						) : contacts.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
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
												<TableHead>Location</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{contacts.map((contact) => (
												<TableRow key={contact.id}>
													<TableCell className="font-medium">
														{contact.name}
													</TableCell>
													<TableCell>{contact.email}</TableCell>
													<TableCell>{contact.phone}</TableCell>
													<TableCell>
														<div className="flex items-center gap-1 text-sm">
															<Globe className="h-3 w-3" />
															{contact.city || contact.country || "Unknown"}
														</div>
													</TableCell>
													<TableCell>
														<Badge
															className={getStatusColor(contact.status)}
														>
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
															<Eye className="h-4 w-4" />
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>

								{/* Pagination */}
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
											onClick={() =>
												setPagination({ ...pagination, page: pagination.page - 1 })
											}
											disabled={pagination.page === 1}
										>
											Previous
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												setPagination({ ...pagination, page: pagination.page + 1 })
											}
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
			<Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Contact Details</DialogTitle>
					</DialogHeader>
					{selectedContact && (
						<div className="space-y-6">
							{/* Contact Info */}
							<div className="space-y-3">
								<h3 className="font-semibold text-lg">Contact Information</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-gray-500">Name</p>
										<p className="font-medium">{selectedContact.name}</p>
									</div>
									<div>
										<p className="text-sm text-gray-500">Email</p>
										<p className="font-medium">{selectedContact.email}</p>
									</div>
									<div>
										<p className="text-sm text-gray-500">Phone</p>
										<p className="font-medium">{selectedContact.phone}</p>
									</div>
									<div>
										<p className="text-sm text-gray-500">Status</p>
										<Select
											value={selectedContact.status}
											onValueChange={(value) =>
												updateStatus(selectedContact.id, value)
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="new">New</SelectItem>
												<SelectItem value="contacted">Contacted</SelectItem>
												<SelectItem value="resolved">Resolved</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>

							{/* Message */}
							<div>
								<h3 className="font-semibold text-lg mb-2">Message</h3>
								<p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
									{selectedContact.message}
								</p>
							</div>

							{/* Tracking Info */}
							<TrackingInfo data={selectedContact} />
							{/*<div>*/}
							{/*	<h3 className="font-semibold text-lg mb-3">Tracking Information</h3>*/}
							{/*	<div className="bg-blue-50 p-4 rounded-lg space-y-3">*/}
							{/*		<div className="flex items-start gap-3">*/}
							{/*			<Globe className="h-5 w-5 text-blue-600 mt-0.5" />*/}
							{/*			<div>*/}
							{/*				<p className="text-sm font-medium">Location</p>*/}
							{/*				<p className="text-sm text-gray-600">*/}
							{/*					{selectedContact.city && `${selectedContact.city}, `}*/}
							{/*					{selectedContact.region && `${selectedContact.region}, `}*/}
							{/*					{selectedContact.country || "Unknown"}*/}
							{/*				</p>*/}
							{/*				<p className="text-xs text-gray-500 mt-1">*/}
							{/*					IP: {selectedContact.ip_address}*/}
							{/*				</p>*/}
							{/*			</div>*/}
							{/*		</div>*/}
							{/*		<div className="flex items-start gap-3">*/}
							{/*			<Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />*/}
							{/*			<div>*/}
							{/*				<p className="text-sm font-medium">Device</p>*/}
							{/*				<p className="text-sm text-gray-600">*/}
							{/*					{selectedContact.device || "Unknown"}*/}
							{/*				</p>*/}
							{/*			</div>*/}
							{/*		</div>*/}
							{/*		<div className="flex items-start gap-3">*/}
							{/*			<Monitor className="h-5 w-5 text-blue-600 mt-0.5" />*/}
							{/*			<div>*/}
							{/*				<p className="text-sm font-medium">Browser & OS</p>*/}
							{/*				<p className="text-sm text-gray-600">*/}
							{/*					{selectedContact.browser || "Unknown"} on{" "}*/}
							{/*					{selectedContact.os || "Unknown"}*/}
							{/*				</p>*/}
							{/*			</div>*/}
							{/*		</div>*/}
							{/*	</div>*/}
							{/*</div>*/}

							{/* Metadata */}
							<div className="text-sm text-gray-500">
								<p>
									Submitted:{" "}
									{new Date(selectedContact.created_at).toLocaleString()}
								</p>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
