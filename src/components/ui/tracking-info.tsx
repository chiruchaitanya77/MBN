// components/tracking-info-with-icons.tsx
import Image from "next/image";
import { Globe } from "lucide-react";

type TrackingData = {
	ip_address: string | null;
	country: string | null;
	region: string | null;
	city: string | null;
	device: string | null;
	browser: string | null;
	os: string | null;
};

type TrackingInfoProps = {
	data: TrackingData;
	className?: string;
};

export function TrackingInfo({ data, className = "" }: TrackingInfoProps) {
	const { ip_address, country, region, city, device, browser, os } = data;

	// Helper: extract browser name (case-insensitive)
	const getBrowserKey = (browserStr: string | null) => {
		if (!browserStr) return "unknown";
		const lower = browserStr.toLowerCase();
		if (lower.includes("chrome")) return "chrome";
		if (lower.includes("firefox")) return "firefox";
		if (lower.includes("safari")) return "safari";
		if (lower.includes("edge") || lower.includes("explorer")) return "explorer";
		if (lower.includes("opera")) return "opera";
		return "internet";
	};

	// Helper: OS icon
	const getOSKey = (osStr: string | null) => {
		if (!osStr) return "unknown";
		const lower = osStr.toLowerCase();
		if (lower.includes("windows")) return "windows";
		if (lower.includes("mac") || lower.includes("os x")) return "mac";
		if (lower.includes("ios") || lower.includes("ipad")) return "ios";
		if (lower.includes("android")) return "android";
		if (lower.includes("linux")) return "linux";
		if (lower.includes("ubuntu")) return "ubuntu";
		if (lower.includes("bot")) return "robot";
		return "unknown";
	};

	// Helper: Device icon
	const getDeviceKey = (deviceStr: string | null) => {
		if (!deviceStr) return "unknown";
		const lower = deviceStr.toLowerCase();
		if (lower.includes("iphone") || lower.includes("mobile")) return "iphone";
		if (lower.includes("ipad") || lower.includes("tablet")) return "ipad";
		if (lower.includes("mac")) return "mac";
		if (lower.includes("android")) return "android_device";
		if (lower.includes("desktop")) return "mac"; // fallback to mac/laptop look
		return "tablet";
	};

	const browserKey = getBrowserKey(browser);
	const osKey = getOSKey(os);
	const deviceKey = getDeviceKey(device);

	const location = [city, region, country || "Unknown"].filter(Boolean).join(", ") || "Unknown";

	return (
		<div className={className}>
			<h3 className="font-semibold text-lg mb-4 text-gray-800">Tracking Information</h3>
			<div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 shadow-sm space-y-5">

				{/* Location */}
				<div className="flex items-start gap-4">
					<div className="bg-blue-600 p-3 rounded-lg">
						<Globe className="h-6 w-6 text-white" />
					</div>
					<div className="flex-1">
						<p className="text-sm font-medium text-blue-900">Location</p>
						<p className="text-base font-semibold text-gray-800">{location}</p>
						{ip_address && (
							<p className="text-xs text-gray-500 font-mono mt-1">IP: {ip_address}</p>
						)}
					</div>
				</div>

				{/* Device */}
				<div className="flex items-center gap-4">
					<div className="relative w-14 h-14 bg-white rounded-xl shadow-md p-2 flex items-center justify-center border border-gray-200">
						<Image
							src={`/icons/device/${deviceKey}.png`}
							alt={device || "Device"}
							width={48}
							height={48}
							className="object-contain"
						/>
					</div>
					<div>
						<p className="text-sm font-medium text-blue-900">Device</p>
						<p className="text-base font-semibold text-gray-800">
							{device === "Desktop" ? "Desktop / Laptop" : device || "Unknown Device"}
						</p>
					</div>
				</div>

				{/* Browser */}
				<div className="flex items-center gap-4">
					<div className="w-14 h-14 bg-white rounded-xl shadow-md p-3 flex items-center justify-center border border-gray-200">
						<Image
							src={`/icons/browser/${browserKey}.png`}
							alt={browser || "Browser"}
							width={40}
							height={40}
							className="object-contain"
						/>
					</div>
					<div>
						<p className="text-sm font-medium text-blue-900">Browser</p>
						<p className="text-base font-semibold text-gray-800">
							{browser || "Unknown Browser"}
						</p>
					</div>
				</div>

				{/* OS */}
				<div className="flex items-center gap-4">
					<div className="w-14 h-14 bg-white rounded-xl shadow-md p-3 flex items-center justify-center border border-gray-200">
						<Image
							src={`/icons/os/${osKey}.png`}
							alt={os || "OS"}
							width={40}
							height={40}
							className="object-contain"
						/>
					</div>
					<div>
						<p className="text-sm font-medium text-blue-900">Operating System</p>
						<p className="text-base font-semibold text-gray-800">
							{os || "Unknown OS"}
						</p>
					</div>
				</div>

			</div>
		</div>
	);
}
