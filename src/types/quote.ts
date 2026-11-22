// src/types/contact.ts
export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    created_at: string;
    status: "new" | "contacted" | "resolved";
    admin_notes?: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export interface QuoteRequest {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    project_type: "residential" | "commercial" | "industrial" | "renovation" | "other";
    plot_size: string;
    location: string;
    budget?: string;
    timeline?: string;
    services: string[];
    description: string;
    created_at: string;
    status: "new" | "quoted" | "accepted" | "rejected";
    admin_notes?: string;
    estimated_cost?: number;
}

export interface QuoteFormData {
    name: string;
    email: string;
    phone: string;
    company?: string;
    projectType: "residential" | "commercial" | "industrial" | "renovation" | "other";
    plotSize: string;
    location: string;
    budget?: string;
    timeline?: Date;
    services: string[];
    description: string;
}
