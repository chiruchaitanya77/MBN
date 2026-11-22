"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
	CalendarIcon, CircleChevronRightIcon,
	ClipboardCheckIcon,
	HeartHandshakeIcon,
	IndianRupee,
	LucideCircleStar
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const philosophyTop = [
	{
		title: "HIGH QUALITY",
		icon: "🏗️",
		lucidIcon: LucideCircleStar,
		description:
			"We work hard to earn and maintain our reputation for quality builds. From the first site survey to the final walkthrough, every detail is reviewed by experienced MBNC engineers and supervisors. Our in-house team and carefully vetted trade partners follow strict workmanship standards and use proven materials and methods. Each project is inspected multiple times at every stage so the finished structure performs the way it was designed to for years to come.",
	},
	{
		title: "ON BUDGET",
		icon: "💰",
		lucidIcon: IndianRupee,
		description:
			"Our preconstruction and costing teams combine years of field experience with detailed estimating to develop realistic, transparent budgets. We identify risks early, value-engineer where it makes sense, and keep clients informed of every change so there are no surprises. Throughout construction, cost reports, procurement tracking, and contractor coordination are tightly managed. The result is a project that delivers the expected scope within the agreed investment, without cutting corners.",
	},
	{
		title: "ON SCHEDULE",
		icon: "📅",
		lucidIcon: CalendarIcon,
		description:
			"Delivering projects on or ahead of schedule is a core MBNC commitment. We build detailed programmes, break them into weekly look-ahead plans, and coordinate all trades so work flows smoothly. Regular progress meetings keep clients and stakeholders aligned, and potential delays are tackled before they impact the critical path. This disciplined approach keeps sites productive, minimizes disruption, and gets our clients into their spaces when they planned.",
	},
];

const philosophyBottom = [
	{
		title: "COMMITTED TO SAFETY",
		icon: "🦺",
		lucidIcon: ClipboardCheckIcon,
		description:
			"Safety is not just a checklist for MBNC - it is a culture we reinforce every day. All workers and trade partners receive thorough training before stepping on site and documented inspections that keep everyone aligned. We plan each operation with safety at the forefront, from traffic flows and access points to lifting plans and work-at-height systems, ensuring risks are minimized before work begins. This commitment protects our clients, and the surrounding communities on every MBNC project.",
	},
	{
		title: "RELATIONSHIP FOCUSED",
		icon: "🤝",
		lucidIcon: HeartHandshakeIcon,
		description:
			"Strong relationships are at the centre of how MBNC operates. Many of our projects come from repeat clients who value our honesty, responsiveness, and consistent delivery. We treat design partners, suppliers, and trade specialists as long-term collaborators, not one-time vendors, which leads to smoother coordination and better results on site. By listening carefully, communicating clearly, and standing by our word, we create partnerships that last well beyond a single project.",
	},
];

export function Philosophy() {
	const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
	const sectionRef = useRef<HTMLElement | null>(null);
	const headingRef = useRef<HTMLDivElement | null>(null);
	const decorLineRef = useRef<HTMLDivElement | null>(null);

	useLayoutEffect(() => {
		if (!sectionRef.current) return;

		const ctx = gsap.context(() => {
			// Decorative line animation
			gsap.from(decorLineRef.current, {
				scrollTrigger: {
					trigger: decorLineRef.current,
					start: "top 85%",
					toggleActions: "play none none none",
				},
				scaleX: 0,
				duration: 0.12,
				ease: "power3.out",
			});

			// Heading animation
			gsap.from(headingRef.current, {
				scrollTrigger: {
					trigger: headingRef.current,
					start: "top 80%",
					toggleActions: "play none none none",
				},
				opacity: 0,
				y: -40,
				duration: 0.1,
				ease: "power3.out",
			});

			// Cards staggered animation
			cardsRef.current.forEach((card, index) => {
				if (card) {
					gsap.from(card, {
						opacity: 0,
						y: 100,
						scale: 0.9,
						duration: 1,
						delay: index * 0.02,
						ease: "power3.out",
						scrollTrigger: {
							trigger: card,
							start: "top 90%",
							toggleActions: "play none none reverse"
						}
					});
				}
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			className="relative w-full bg-linear-to-b from-slate-50 via-white to-slate-50 py-24 px-4 md:py-32 overflow-hidden"
			id="mbnc-philosophy"
		>
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-[0.03]">
				<div className="absolute inset-0" style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
				}} />
			</div>

			<div className="relative mx-auto max-w-7xl">


				{/* Heading Section */}
				<div ref={headingRef} className="text-center mb-16 md:mb-20">

					<h2 className="text-primary font-bold tracking-widest uppercase mb-2 text-sm md:text-base">
						Our Foundation
					</h2>
					{/* Decorative Line */}
					<div
						ref={decorLineRef}
						className="mx-auto w-20 h-1 bg-linear-to-r from-red-600 to-red-500 mb-8 origin-center"
					/>
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
						The&nbsp;
						<span className="text-primary">MBNC</span>
						&nbsp;Philosophy
					</h1>
					<p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
						As a construction partner, MBNC believes that a knowledgeable,
						healthy, and engaged team delivers superior outcomes for clients who
						trust us with their projects.
					</p>
					<button className="group inline-flex items-center gap-2 px-6 py-3 text-md font-bold tracking-wide text-primary uppercase transition-all duration-300 hover:scale-105 hover:from-red-700 hover:to-red-800">
						<span className="-mb-0.5 transition-transform duration-300 group-hover:translate-x-1">
							Learn more about our team
						</span>
						<span className=" transition-transform duration-300 group-hover:translate-x-2">
							<CircleChevronRightIcon className="w-5 h-5"/>
						</span>
					</button>
				</div>

				{/* Top Row - 3 Cards */}
				<div className="grid gap-8 md:grid-cols-3 mb-8">
					{philosophyTop.map((item, idx) => (
						<div
							key={item.title}
							ref={(el) => { cardsRef.current[idx] = el; }}
							className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
						>

							<div className="relative flex flex-col flex-1 items-center text-center px-8 py-12 md:px-10 md:py-14 transition-transform duration-500 group-hover:-translate-y-2">
								{/* Icon with an animated border */}
								<div className="relative mb-6">
									<div className="absolute inset-0 rounded-full opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-500" />
									{/*rounded-full border-2 border-red-400 group-hover:border-red-500 group-hover:shadow-lg*/}
									<div className="relative flex h-16 w-16 items-center justify-center text-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ">
										{item.lucidIcon ? (
											<item.lucidIcon className="h-16 w-16 text-red-500" strokeWidth={1}/>
										) : (
											<span>{item.icon}</span>
										)}
									</div>
								</div>

								<h3 className="text-2xl font-black tracking-wide text-gray-900 mb-5 transition-colors duration-300 group-hover:text-red-600"
								    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
								> {item.title}
								</h3>

								<p className="text-md text-muted-foreground leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
									{item.description}
								</p>
							</div>

							{/* Animated Bottom Bar */}
							<div className="relative h-1.5 w-full bg-linear-to-r from-red-600 via-red-500 to-red-500 transition-all duration-500 group-hover:h-3 overflow-hidden mt-auto">
								<div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
							</div>
						</div>
					))}
				</div>

				{/* Bottom Row - 2 Cards */}
				<div className="grid gap-8 md:grid-cols-2 md:max-w-4xl md:mx-auto">
					{philosophyBottom.map((item, idx) => (
						<div
							key={item.title}
							ref={(el) => {cardsRef.current[philosophyTop.length + idx] = el}}
							className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
						>

							<div className="relative flex flex-col flex-1 items-center text-center px-8 py-12 md:px-10 md:py-14 transition-transform duration-500 group-hover:-translate-y-2">
								{/* Icon with an animated border */}
								<div className="relative mb-6">
									<div className="absolute inset-0 rounded-full opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-500" />
									<div className="relative flex h-16 w-16 items-center justify-center text-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
										{item.lucidIcon ? (
											<item.lucidIcon className="h-16 w-16 text-red-500" strokeWidth={1}/>
										) : (
											<span>{item.icon}</span>
										)}
									</div>
								</div>

								<h3 className="text-2xl font-black tracking-wide text-gray-900 mb-5 transition-colors duration-300 group-hover:text-red-600"
									style={{ textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
								> {item.title}
								</h3>

								<p className="text-md text-muted-foreground leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
									{item.description}
								</p>
							</div>

							{/* Animated Bottom Bar */}
							<div className="relative h-1.5 w-full bg-linear-to-r from-red-600 via-red-500 to-red-500 transition-all duration-500 group-hover:h-3 overflow-hidden mt-auto">
								<div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
