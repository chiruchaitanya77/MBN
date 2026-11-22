// src/lib/tracking.ts
import { UAParser } from "ua-parser-js";

export interface LocationData {
	ip: string;
	country: string | null;
	region: string | null;
	city: string | null;
}

export interface DeviceData {
	browser: string | null;
	os: string | null;
	device: string | null;
	userAgent: string;
}

export interface TrackingData extends LocationData, DeviceData {}

/**
 * Small in-memory cache to reduce ipapi.co calls.
 * Key: ip, Value: { country, region, city, expires }
 */
const geoCache = new Map<
	string,
	{ country: string | null; region: string | null; city: string | null; expiresAt: number }
>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Extract IP address from request headers
 */
export function getClientIP(headers: Headers): string {
	const forwardedFor = headers.get("x-forwarded-for");
	const realIP = headers.get("x-real-ip");
	const cfConnectingIP = headers.get("cf-connecting-ip");

	if (forwardedFor) {
		return forwardedFor.split(",")[0].trim();
	}
	if (realIP) {
		return realIP.trim();
	}
	if (cfConnectingIP) {
		return cfConnectingIP.trim();
	}
	return "unknown";
}

/**
 * Get location data from IP address using ipapi.co (HTTPS).
 * Returns the same shape as before: { country, region, city }.
 *
 * NOTE: This function is async because it performs a network request.
 */

export async function getLocationFromIP(ip: string): Promise<Omit<LocationData, "ip">> {
	// Handle local / private / unknown IPs quickly
	if (!ip || ip === "unknown" || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.")) {
		return { country: "Dev", region: "Local", city: "Local" };
	}

	const now = Date.now();
	const cached = geoCache.get(ip);
	if (cached && cached.expiresAt > now) {
		return { country: cached.country, region: cached.region, city: cached.city };
	}

	try {
		// ip-api.com is fast, free, no API key, and allows 45 req/min
		const res = await fetch(
			`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`
		);

		if (!res.ok) throw new Error("Network error");

		const data = await res.json();

		// If rate-limited or failed, data.status will be "fail"
		if (data.status !== "success") {
			throw new Error(data.message || "Failed");
		}

		const result = {
			country: data.country ?? null,
			region: data.regionName ?? null,
			city: data.city ?? null,
		};

		// Cache successful result
		geoCache.set(ip, { ...result, expiresAt: now + CACHE_TTL_MS });

		return result;
	} catch (err) {
		console.warn("Geolocation failed for IP:", ip, err instanceof Error ? err.message : err);

		// Cache nulls for 1 minute to avoid hammering the API on failure
		geoCache.set(ip, {
			country: null,
			region: null,
			city: null,
			expiresAt: now + 60_000,
		});

		return { country: null, region: null, city: null };
	}
}

/**
 * Parse user agent string
 */
export function parseUserAgent(userAgent: string): Omit<DeviceData, "userAgent"> {
	const parser = new UAParser(userAgent);
	const result = parser.getResult();

	return {
		browser: result.browser.name
			? `${result.browser.name} ${result.browser.version || ""}`.trim()
			: null,
		os: result.os.name ? `${result.os.name} ${result.os.version || ""}`.trim() : null,
		device: result.device.type
			? `${result.device.vendor || ""} ${result.device.model || ""} (${result.device.type})`.trim()
			: result.device.vendor
				? `${result.device.vendor} ${result.device.model || ""}`.trim()
				: "Desktop",
	};
}

/**
 * Get complete tracking data from request
 *
 * NOTE: This function is async because it awaits getLocationFromIP.
 * Returns the exact same TrackingData payload shape as before.
 */
export async function getTrackingData(request: Request): Promise<TrackingData> {
	const headers = request.headers;
	const ip = getClientIP(headers);
	const userAgent = headers.get("user-agent") || "unknown";

	const locationData = await getLocationFromIP(ip);
	const deviceData = parseUserAgent(userAgent);

	return {
		ip,
		...locationData,
		...deviceData,
		userAgent,
	};
}
