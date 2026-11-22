// components/UnderlineOnHover.tsx
"use client";

import React from "react";

export default function UnderlineOnHover({
	                                         children,
	                                         className = "",
                                         }: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<span className={`relative inline-block cursor-pointer group ${className}`}>
      {/* Text */}
			<span className="relative z-10">{children}</span>

			{/* Animated SVG underline */}
			<svg
				className="absolute left-0 bottom-0 w-full h-1.5"
				viewBox="0 0 100 4"
				preserveAspectRatio="none"
			>
        <line
	        x1="0"
	        y1="2"
	        x2="100"
	        y2="2"
	        stroke="currentColor"
	        strokeWidth="1"
	        className="text-primary transition-all duration-300 ease-out
                     group-hover:[stroke-dashoffset:0]
                     [stroke-dasharray:100] [stroke-dashoffset:100]"
        />
      </svg>
    </span>
	);
}
