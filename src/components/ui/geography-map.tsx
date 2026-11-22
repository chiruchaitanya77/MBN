// components/admin/WorldMap.tsx
"use client";

import { useMemo, useState } from "react";
import { ParentSize } from "@visx/responsive";
import { Mercator } from "@visx/geo";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as topojson from "topojson-client";
import worldTopologyData from "../../../attached_assets/world-110m.json";

const worldTopology = worldTopologyData as any;

const world = topojson.feature(worldTopology, worldTopology.objects.countries) as any;

interface WorldMapProps {
	data: Record<string, number>;
	colorScheme?: "blue" | "green" | "purple" | "orange" | "emerald";
	showLegend?: boolean;
	showStats?: boolean;
	enableZoom?: boolean;
	height?: string;
	onCountryClick?: (country: string, count: number) => void;
}

const COLOR_SCHEMES = {
	blue: {
		empty: "#f8fafc",
		light: "rgba(14, 165, 233, 0.3)",
		medium: "rgba(14, 165, 233, 0.5)",
		high: "rgba(14, 165, 233, 0.7)",
		intense: "rgba(14, 165, 233, 0.9)",
		hover: "#0284c7",
	},
	green: {
		empty: "#f8fafc",
		light: "rgba(34, 197, 94, 0.3)",
		medium: "rgba(34, 197, 94, 0.5)",
		high: "rgba(34, 197, 94, 0.7)",
		intense: "rgba(34, 197, 94, 0.9)",
		hover: "#16a34a",
	},
	purple: {
		empty: "#f8fafc",
		light: "rgba(168, 85, 247, 0.3)",
		medium: "rgba(168, 85, 247, 0.5)",
		high: "rgba(168, 85, 247, 0.7)",
		intense: "rgba(168, 85, 247, 0.9)",
		hover: "#9333ea",
	},
	orange: {
		empty: "#f8fafc",
		light: "rgba(249, 115, 22, 0.3)",
		medium: "rgba(249, 115, 22, 0.5)",
		high: "rgba(249, 115, 22, 0.7)",
		intense: "rgba(249, 115, 22, 0.9)",
		hover: "#ea580c",
	},
	emerald: {
		empty: "#f8fafc",
		light: "rgba(16, 185, 129, 0.3)",
		medium: "rgba(16, 185, 129, 0.5)",
		high: "rgba(16, 185, 129, 0.7)",
		intense: "rgba(16, 185, 129, 0.9)",
		hover: "#059669",
	},
};

export default function WorldMap({
	                                 data,
	                                 colorScheme = "blue",
	                                 showLegend = true,
	                                 showStats = true,
	                                 enableZoom = false,
	                                 height = "h-96",
	                                 onCountryClick,
                                 }: WorldMapProps) {
	const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
	const [scale, setScale] = useState(100);

	const scheme = COLOR_SCHEMES[colorScheme];

	// Calculate statistics
	const stats = useMemo(() => {
		const counts = Object.values(data);
		const validCounts = counts.filter((c) => c > 0);
		return {
			maxValue: Math.max(...counts, 1),
			totalSubmissions: counts.reduce((sum, count) => sum + count, 0),
			countriesWithData: validCounts.length,
			avgSubmissions: validCounts.length > 0
				? Math.round(validCounts.reduce((a, b) => a + b, 0) / validCounts.length)
				: 0,
		};
	}, [data]);

	// Get color based on count with improved gradient
	const getColor = (count: number): string => {
		if (count === 0) return scheme.empty;
		const percentage = count / stats.maxValue;
		if (percentage <= 0.25) return scheme.light;
		if (percentage <= 0.5) return scheme.medium;
		if (percentage <= 0.75) return scheme.high;
		return scheme.intense;
	};

	// Legend component
	const Legend = () => {
		if (!showLegend) return null;

		return (
			<div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg p-4 border z-10">
				<div className="text-xs font-semibold text-foreground mb-2">
					Submissions by Country
				</div>
				<div className="space-y-1.5">
					<div className="flex items-center gap-2">
						<div className="w-4 h-3 rounded border" style={{ backgroundColor: scheme.empty }} />
						<span className="text-xs text-muted-foreground">No data</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-3 rounded border" style={{ backgroundColor: scheme.light }} />
						<span className="text-xs text-muted-foreground">1-25%</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-3 rounded border" style={{ backgroundColor: scheme.medium }} />
						<span className="text-xs text-muted-foreground">26-50%</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-3 rounded border" style={{ backgroundColor: scheme.high }} />
						<span className="text-xs text-muted-foreground">51-75%</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-3 rounded border" style={{ backgroundColor: scheme.intense }} />
						<span className="text-xs text-muted-foreground">76-100%</span>
					</div>
				</div>
			</div>
		);
	};

	// Stats component
	const Stats = () => {
		if (!showStats) return null;

		return (
			<div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg p-4 border z-10">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<div className="text-2xl font-bold text-foreground">{stats.totalSubmissions}</div>
						<div className="text-xs text-muted-foreground">Total Submissions</div>
					</div>
					<div>
						<div className="text-2xl font-bold text-foreground">{stats.countriesWithData}</div>
						<div className="text-xs text-muted-foreground">Countries</div>
					</div>
					{stats.avgSubmissions > 0 && (
						<div className="col-span-2">
							<div className="text-xl font-bold text-foreground">{stats.avgSubmissions}</div>
							<div className="text-xs text-muted-foreground">Avg per Country</div>
						</div>
					)}
				</div>
			</div>
		);
	};

	// Zoom controls
	const ZoomControls = () => {
		if (!enableZoom) return null;

		return (
			<div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
				<button
					onClick={() => setScale((s) => Math.min(s + 20, 200))}
					className="bg-card/95 backdrop-blur-sm rounded-lg shadow-lg p-2 hover:bg-accent transition-colors border"
					aria-label="Zoom in"
				>
					<svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
						<path d="M12 4v16m8-8H4" />
					</svg>
				</button>
				<button
					onClick={() => setScale((s) => Math.max(s - 20, 60))}
					className="bg-card/95 backdrop-blur-sm rounded-lg shadow-lg p-2 hover:bg-accent transition-colors border"
					aria-label="Zoom out"
				>
					<svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
						<path d="M20 12H4" />
					</svg>
				</button>
				<button
					onClick={() => setScale(100)}
					className="bg-card/95 backdrop-blur-sm rounded-lg shadow-lg px-2 py-1 hover:bg-accent transition-colors border text-xs font-medium"
					aria-label="Reset zoom"
				>
					Reset
				</button>
			</div>
		);
	};

	return (
		<div className={`w-full ${height} bg-card rounded-xl border overflow-hidden relative`}>
			<TooltipProvider>
				<ParentSize>
					{({ width, height }) => (
						<svg width={width} height={height} className="bg-transparent">
							<Mercator
								data={world.features as any}
								scale={(width / 630) * scale}
								translate={[width / 2, height / 1.6]}
							>
								{(mercator: any) => (
									<g>
										{mercator.features.map((feat: any, i: number) => {
											const geo = feat.feature;
											const name = geo.properties?.name || geo.properties?.NAME || "Unknown";
											const code = geo.id;
											const count = data[name] || data[code] || 0;
											const fill = getColor(count);
											const isHovered = hoveredCountry === name;

											return (
												<Tooltip key={i} delayDuration={0}>
													<TooltipTrigger asChild>
														<path
															d={feat.path}
															fill={fill}
															stroke={isHovered ? scheme.hover : "#fff"}
															strokeWidth={isHovered ? 1 : 0.5}
															className="transition-all duration-200 cursor-pointer"
															style={{
																filter: isHovered ? "brightness(1.1)" : "none",
															}}
															onMouseEnter={() => setHoveredCountry(name)}
															onMouseLeave={() => setHoveredCountry(null)}
															onClick={() => {
																if (onCountryClick && count > 0) {
																	onCountryClick(name, count);
																}
															}}
														/>
													</TooltipTrigger>
													<TooltipContent side="top" className="z-50">
														<p className="font-semibold">{name}</p>
														<p className="text-sm text-white">
															{count} submission{count !== 1 ? "s" : ""}
														</p>
														{count > 0 && (
															<p className="text-xs text-white mt-1">
																{((count / stats.maxValue) * 100).toFixed(1)}% of max
															</p>
														)}
													</TooltipContent>
												</Tooltip>
											);
										})}
									</g>
								)}
							</Mercator>
						</svg>
					)}
				</ParentSize>
			</TooltipProvider>

			<Stats />
			<Legend />
			<ZoomControls />
		</div>
	);
}
