"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Building2, Home, Factory, Truck } from "lucide-react";
import concreteTexture from "../../../attached_assets/generated_images/concrete_texture_background.png";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Home,
    title: "Residential Construction",
    description: "Custom homes, villas, and apartments built to perfection with premium finishes.",
    id: "01"
  },
  {
    icon: Building2,
    title: "Commercial Complexes",
    description: "Office spaces, retail centers, and malls designed for modern businesses.",
    id: "02"
  },
  {
    icon: Factory,
    title: "Industrial Projects",
    description: "Factories, warehouses, and specialized industrial infrastructure.",
    id: "03"
  },
  {
    icon: Truck,
    title: "Infrastructure",
    description: "Roads, drainage systems, and large-scale civil engineering works.",
    id: "04"
  }
];

export function Services() {
  const containerRef = useRef(null);
  const bgRef = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray(".service-card");

    // Parallax background
    gsap.to(bgRef.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Staggered Parallax Cards
    cards.forEach((card: any, i) => {
      gsap.fromTo(card,
        {
          y: 100,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Add subtle parallax scroll speed difference to columns
      if (window.innerWidth > 768) {
        gsap.to(card, {
          y: i % 2 === 0 ? -50 : -20, // Even cards move faster
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      }
    });
  }, { scope: containerRef });

  return (
    <section
      id="services"
      ref={containerRef}
      className="py-32 relative bg-zinc-900 text-white overflow-hidden"
    >
      {/* Parallax Background */}
      <div
        ref={bgRef}
        className="absolute -top-[20%] left-0 w-full h-[140%] opacity-20 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${concreteTexture.src})`,
          backgroundBlendMode: "multiply",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          {/*<div className="max-w-xl">*/}
          {/*  <h2 className="text-primary font-bold tracking-widest uppercase mb-2">Our Expertise</h2>*/}
          {/*  <h3 className="text-5xl md:text-6xl font-heading font-bold leading-none">*/}
          {/*    Mastering The Art <br/> of Construction*/}
          {/*  </h3>*/}
          {/*</div>*/}
          <div className="max-w-xl text-left">
            <h2 className="text-primary font-bold tracking-widest uppercase mb-2 text-sm md:text-base">
              Our Expertise
            </h2>

            <h3 className="font-heading font-bold leading-tight text-4xl sm:text-5xl md:text-6xl">
              Mastering The Art of Construction
            </h3>
          </div>

          <p className="md:max-w-sm text-gray-400 mt-6 md:mt-0 text-lg">
            From blueprint to reality, we deliver exceptional quality across all sectors of civil engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group relative bg-zinc-800/50 border border-white/10 p-8 min-h-80 flex flex-col justify-between hover:bg-primary hover:border-primary transition-colors duration-500 ease-out backdrop-blur-sm"
            >
              <div className="flex justify-between items-start">
                <service.icon className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
                <span className="font-heading text-4xl font-bold text-white/10 group-hover:text-white/30 transition-colors">
                  {service.id}
                </span>
              </div>

              <div>
                <h4 className="text-2xl font-heading font-bold mb-4 group-hover:text-white transition-colors">
                  {service.title}
                </h4>
                <p className="text-gray-400 group-hover:text-white/90 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
