"use client";

import React, { useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Contact } from "@/components/sections/Contact";
import {
    Home,
    Building,
    Hammer,
    PaintBucket,
    Truck,
    DraftingCompass,
    Check,
} from "lucide-react";
import serviceBg from "../../../attached_assets/generated_images/modern_concrete_architecture_detail.png";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import concreteTexture from "../../../attached_assets/generated_images/luxury_modern_villa.png";
import flooringTexture from "../../../attached_assets/generated_images/flooring.png";
import residence from "../../../attached_assets/generated_images/residence.png";
import commercial from "../../../attached_assets/generated_images/comercial.png";
import planning from "../../../attached_assets/generated_images/civil_planning.png";
import renovation from "../../../attached_assets/generated_images/renovation.jpg";
import site from "../../../attached_assets/generated_images/site.png";
import Image from "next/image";

const services = [
    {
        icon: Home,
        img: residence,
        title: "Residential Construction",
        description:
            "We build homes that are safe, sustainable, and stunning. From foundations to roofing, every aspect is managed by civil engineers.",
        features: [
            "Custom Home Design",
            "Multi-story Apartments",
            "Villa Communities",
            "Structural Safety Certification",
        ],
    },
    {
        icon: Building,
        img: commercial,
        title: "Commercial Projects",
        description:
            "Scalable construction solutions for businesses. We understand the importance of timelines and budget adherence in commercial projects.",
        features: ["Office Complexes", "Retail Spaces", "Warehouses", "Showrooms"],
    },
    {
        icon: DraftingCompass,
        img: planning,
        title: "Civil Engineering & Planning",
        description:
            "Technical expertise is at our core. We provide detailed structural analysis, architectural planning, and government approval drawings.",
        features: ["Blueprint Design", "3D Elevations", "Structural Analysis", "Estimation & Costing"],
    },
    {
        icon: Hammer,
        img: renovation,
        title: "Renovation & Remodeling",
        description:
            "Modernize your existing property. We assess structural integrity before making modifications to ensure safety.",
        features: ["Home Extensions", "Facade Makeovers", "Kitchen & Bath Remodels", "Structural Strengthening"],
    },
    {
        icon: Truck,
        img: site,
        title: "Site Development",
        description:
            "The foundation of any great project is the land it sits on. We handle all earthworks and site preparation.",
        features: ["Excavation", "Land Leveling", "Retaining Walls", "Drainage Systems"],
    },
    {
        icon: PaintBucket,
        img: flooringTexture,
        title: "Finishing & Interiors",
        description:
            "A great structure deserves a beautiful finish. Our interior team handles all the aesthetic details.",
        features: ["Flooring & Tiling", "False Ceilings", "Painting & Textures", "Electrical & Plumbing"],
    },
];

export default function ServicesPage() {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const bgRef = useRef(null);


    useEffect(() => {
        if (typeof window === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const cards = cardsRef.current;

            // Initial state: all cards far below, small, rotated, blurred
            gsap.set(cards, {
                y: 600,
                opacity: 0,
                scale: 0.85,
                rotate: 10,
                filter: "blur(10px)",
                transformOrigin: "center bottom",
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=2200",
                    scrub: true,
                    pin: true,        // pin this section
                    pinSpacing: true,
                    anticipatePin: 1,
                },
            });

            // All cards end EXACTLY at same center position (stacked)
            tl.to(cards, {
                y: 0,
                opacity: 1,
                scale: 1,
                rotate: 0,
                filter: "blur(0px)",
                ease: "power3.out",
                stagger: {
                    each: 0.3,
                    from: "start", // last card flies in last
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);



    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <PageHeader
                title="Our Services"
                subtitle="Comprehensive Civil Engineering & Construction Solutions"
                backgroundImage={serviceBg.src}
            />

            <main>
                {/* PINNED GSAP STACKED SERVICES SECTION */}
                <section
                    ref={sectionRef}
                    className="relative py-20 z-50"
                >
                    {/* Parallax Background */}
                    <div
                        ref={bgRef}
                        className="absolute top-[0%] left-0 w-full h-full opacity-90 pointer-events-none z-0"
                        style={{
                            backgroundImage: `url(${
                                typeof concreteTexture === "string" ? concreteTexture : concreteTexture.src
                            })`,
                            // backgroundImage: `url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop")`,
                            backgroundBlendMode: "multiply",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                    <div className="absolute inset-0 bg-accent/60 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Pattern Overlay if no image, or on top of image for texture */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />


                    <div className="container mx-auto px-6 -mt-12 md:mt-0 md:pt-12 md:pb-14 pb-20 relative">

                        <div className="text-center mb-16 md:pb-0">
                            <h2 className="text-3xl font-heading font-bold text-primary">
                                What We Do
                            </h2>
                            <p className="text-secondary mt-2 text-sm md:text-base max-w-2xl mx-auto">
                                From blueprint to ribbon cutting, MBN Construction provides end-to-end solutions for all your civil engineering needs.                            </p>
                        </div>
                        <div className="relative h-[70vh] md:h-[50vh]">
                            {services.map((service, index) => (
                                <div
                                    key={service.title}
                                    ref={(el) => {
                                        if (el) cardsRef.current[index] = el;
                                    }}
                                    className="absolute left-1/2 top-1/2 w-full h-full max-w-3xl -translate-x-1/2 -translate-y-1/2"
                                >
                                    <Card className="border-none overflow-hidden h-full">
                                        <div className="flex flex-col md:flex-row h-full">
                                            <div className="bg-primary/5 md:w-80 shrink-0 overflow-hidden">
                                                {service.img ? (
                                                    <Image
                                                        src={service.img}
                                                        alt={service.title}
                                                        width={800}
                                                        height={800}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full p-8">
                                                        <service.icon className="w-30 h-30 text-primary" strokeWidth={1} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6 md:p-12 flex-1">
                                                <h3 className="text-2xl font-heading font-bold text-primary mb-3">
                                                    {service.title}
                                                </h3>
                                                <p className="text-gray-600 mb-5 text-sm md:text-lg">
                                                    {service.description}
                                                </p>
                                                <ul className="space-y-2">
                                                    {service.features.map((feature) => (
                                                        <li
                                                            key={feature}
                                                            className="flex items-center gap-2 text-sm md:text-lg text-gray-500"
                                                        >
                                                            <Check className="w-4 h-4 text-accent" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>

                {/* Process Section (unchanged) */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-heading font-bold text-primary">
                                Our Construction Process
                            </h2>
                            <div className="w-24 h-1 bg-accent mx-auto mt-4" />
                        </div>

                        <div className="relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-1/2 md:top-2/6 left-0 w-full h-1 bg-gray-500 -translate-y-1/2 z-0" />

                            {/* Arrow Line (Mobile) */}
                            <div className="md:hidden block absolute mt-4">
                                <svg
                                    className="w-6 h-6 text-gray-900 animate-bounce"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                                {[
                                    {
                                        step: "01",
                                        title: "Consultation",
                                        desc: "We discuss your vision, budget, and timeline.",
                                    },
                                    {
                                        step: "02",
                                        title: "Planning",
                                        desc: "Architectural drawings and structural design.",
                                    },
                                    {
                                        step: "03",
                                        title: "Construction",
                                        desc: "Execution with quality materials and supervision.",
                                    },
                                    {
                                        step: "04",
                                        title: "Handover",
                                        desc: "Final inspection and key handover.",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.step}
                                        className="bg-white p-6 text-center border border-gray-100 shadow-lg md:shadow-none md:border-none"
                                    >
                                        <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 ring-8 ring-white">
                                            {item.step}
                                        </div>
                                        <h3 className="font-heading font-bold text-lg mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <Contact />
                <Footer />
            </main>
        </div>
    );
}
