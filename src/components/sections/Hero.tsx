"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroImage from "../../../attached_assets/generated_images/cinematic_construction_site_hero.png";
import Link from "next/link";
import ContactUsButton from "@/components/ui/contactus-button";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Parallax effect on image
    gsap.to(imageRef.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Text Reveal
    tl.from(".hero-text-line", {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power4.out",
    })
    .from(".hero-sub", {
      opacity: 0,
      y: 20,
      duration: 0.8,
    }, "-=0.5")
    .from(".hero-btn", {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.7)",
    }, "-=0.3");

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative h-screen w-full overflow-hidden flex items-center justify-center clip-path-slant"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          ref={imageRef}
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
          style={{
            backgroundImage: `url(${heroImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-black/40 z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center text-white" ref={textRef}>
        <h2 className="hero-sub text-primary font-bold tracking-[0.3em] uppercase mb-4 text-sm md:text-base">
          Est. 1987 • Excellence in Engineering
        </h2>

        <div className="overflow-hidden mb-2">
          <h1 className="hero-text-line text-5xl md:text-7xl lg:text-9xl font-heading font-bold uppercase leading-none tracking-tighter">
            Building
          </h1>
        </div>
        <div className="overflow-hidden mb-8">
          <h1 className="hero-text-line text-5xl md:text-7xl lg:text-9xl font-heading font-bold uppercase leading-none tracking-tighter text-transparent stroke-text bg-clip-text bg-white/10" style={{ WebkitTextStroke: "2px white" }}>
            The Future
          </h1>
        </div>

        <p className="hero-sub max-w-2xl mx-auto text-gray-200 text-lg md:text-xl font-light mb-10 leading-relaxed">
          Premier civil engineering and construction services delivered with precision, quality, and integrity.
        </p>

        <div className="hero-btn flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/projects">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-none px-6 h-12 text-lg font-heading tracking-wider uppercase group">
              View Projects
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/#contact">
            {/*<Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white rounded-none px-8 h-14 text-lg font-heading tracking-wider uppercase backdrop-blur-sm">*/}
            {/*  Contact Us*/}
            {/*</Button>*/}
            <ContactUsButton/>
          </Link>
        </div>
      </div>

    </section>
  );
}
