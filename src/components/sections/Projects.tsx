"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

import villaImg from "../../../attached_assets/generated_images/luxury_modern_villa.png";
import officeImg from "../../../attached_assets/generated_images/commercial_office_building.png";
import warehouseImg from "../../../attached_assets/generated_images/industrial_warehouse.png";
import bridgeImg from "../../../attached_assets/generated_images/bridge_infrastructure.png";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: "The Horizon Residences",
    category: "Residential",
    location: "Jubilee Hills, Hyderabad",
    image: villaImg,
    description: "A luxury gated community featuring 25 custom-designed villas with state-of-the-art amenities and sustainable architecture."
  },
  {
    id: 2,
    title: "TechSpace Tower",
    category: "Commercial",
    location: "Hitech City, Hyderabad",
    image: officeImg,
    description: "A 15-story Grade A office complex with glass facade technology, LEED Gold certification, and premium retail spaces."
  },
  {
    id: 3,
    title: "MBN Logistics Hub",
    category: "Industrial",
    location: "Shamshabad, Hyderabad",
    image: warehouseImg,
    description: "Modern warehousing facility spanning 200,000 sq. ft. featuring automated loading docks and climate-controlled storage."
  },
  {
    id: 4,
    title: "Krishna River Bridge",
    category: "Infrastructure",
    location: "Mahbubnagar, Telangana",
    image: bridgeImg,
    description: "Major infrastructure project connecting key districts, executed with precision engineering and high-grade reinforced concrete."
  }
];

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const sections = gsap.utils.toArray(".project-card-section");
    if (!containerRef.current) return;

    const width = containerRef.current.offsetWidth;

    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: "+=" + width,
      },
    });
  }, { scope: containerRef });

  return (
      <section id="projects" className="overflow-hidden bg-background">
        <div ref={containerRef} className="flex w-[400%] h-screen">
          {projects.map((project, index) => (
              <div
                  key={project.id}
                  className="project-card-section w-screen h-screen flex flex-col md:flex-row relative"
              >
                {/* Image Half */}
                <div className="w-full md:w-3/5 h-1/2 md:h-full relative overflow-hidden">
                  <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-1000 hover:scale-105"
                      priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-0 left-0 p-8 md:p-16 bg-linear-to-t from-black/80 to-transparent w-full md:hidden">
                    <Badge className="mb-2 bg-primary text-white hover:bg-primary rounded-none uppercase tracking-widest">
                      {project.category}
                    </Badge>
                    <h3 className="text-3xl font-heading font-bold text-white">{project.title}</h3>
                  </div>
                </div>

                {/* Content Half */}
                <div className="w-full md:w-2/5 h-1/2 md:h-full bg-white dark:bg-zinc-900 p-8 md:p-20 flex flex-col justify-center relative z-10 border-l border-border/10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                  <span
                      className="text-6xl md:text-8xl font-heading font-bold text-border" //text-transparent
                      style={{ WebkitTextStroke: "1px currentColor" }}
                  >
                    0{index + 1}
                  </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>

                    <div className="hidden md:block">
                      <Badge className="mb-4 bg-primary text-white hover:bg-primary rounded-none uppercase tracking-widest px-4 py-1">
                        {project.category}
                      </Badge>
                      <h3 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-2 leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-primary font-medium uppercase tracking-wider text-sm mb-6">
                        {project.location}
                      </p>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>

                    <div className="pt-8">
                      <Button
                          variant="outline"
                          className="rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background px-8 py-6 uppercase tracking-widest group transition-all"
                      >
                        View Case Study
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </section>
  );
}
