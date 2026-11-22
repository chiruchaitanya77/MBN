"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function GetQuoteSection() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const form = e.currentTarget;
        const formData = new FormData(form);

        const payload = {
            name: formData.get("name"),
            email: formData.get("email"),
            projectType: formData.get("projectType"),
            budgetRange: formData.get("budgetRange"),
            message: formData.get("message"),
        };

        const res = await fetch("/api/quotes", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.ok) {
            form.reset();
            setStatus("success");
        } else {
            setStatus("error");
        }

        setLoading(false);
    }

    return (
        <section id="get-a-quote" className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">
                    Get a Construction Quote
                </h2>
                <p className="text-muted-foreground">
                    Share your project requirements and we’ll get back with a tailored estimate.
                </p>

                <form className="space-y-4" onSubmit={onSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="projectType">Project Type</Label>
                        <Input
                            id="projectType"
                            name="projectType"
                            placeholder="Residential villa, warehouse, office, etc."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="budgetRange">Budget Range</Label>
                        <Input
                            id="budgetRange"
                            name="budgetRange"
                            placeholder="e.g. 50–75L, 1–2Cr"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Additional Details</Label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="Plot size, location, timeline, special requirements..."
                            rows={4}
                        />
                    </div>

                    <Button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Request Quote"}
                    </Button>

                    {status === "success" && (
                        <p className="text-sm text-green-600">
                            Quote request submitted! We’ll reach out soon.
                        </p>
                    )}
                    {status === "error" && (
                        <p className="text-sm text-red-600">
                            Something went wrong. Please try again.
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}
