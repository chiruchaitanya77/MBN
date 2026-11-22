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
