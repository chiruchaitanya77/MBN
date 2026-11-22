// src/components/VisitorTracker.tsx
"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
	useEffect(() => {
		if (process.env.NODE_ENV === "production") {
			fetch("/api/track-visit", {
				method: "POST",
				credentials: "same-origin",
				keepalive: true, // important: survives page unload
			}).catch(() => {
				// silent – never break UX
			});
		}
	}, []);

	// This component renders nothing
	return null;
}
