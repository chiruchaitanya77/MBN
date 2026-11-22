"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, HardHat, Ruler, BrickWall } from "lucide-react";
import Image from "next/image";
import blueprintImage from "../../../attached_assets/generated_images/blueprints_and_architectural_plans.png";
import {NumberTicker} from "@/components/ui/number-ticker";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from(".about-card", {
      scrollTrigger: {
        trigger: ".about-grid",
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power2.out",
    });

    gsap.from(".stat-item", {
      scrollTrigger: {
        trigger: ".stats-container",
        start: "top 85%",
      },
      scale: 0.5,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "back.out(1.7)",
    });
  }, { scope: containerRef });

  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden" ref={containerRef}>
      {/* Background Pattern */}
      {/*<div*/}
      {/*  className="absolute top-0 right-0 w-1/2 h-full opacity-50 pointer-events-none"*/}
      {/*  style={{*/}
      {/*    backgroundImage: `url(${blueprintImage})`,*/}
      {/*    backgroundSize: "cover",*/}
      {/*    maskImage: "linear-gradient(to left, black, transparent)"*/}
      {/*  }}*/}
      {/*/>*/}
      <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-60 pointer-events-none"
          style={{
            backgroundImage: `url(${blueprintImage.src})`,
            backgroundSize: "cover",

            // Multi-direction mask (right fade + top fade)
            maskImage: `
              linear-gradient(to left, black 30%, transparent 100%),
              linear-gradient(to top, black 30%, transparent 100%)
            `,
            WebkitMaskImage: `
              linear-gradient(to left, black 30%, transparent 100%),
              linear-gradient(to top, black 30%, transparent 100%)
            `,
            maskComposite: "intersect",
            WebkitMaskComposite: "destination-in",
          }}
      />


      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center about-grid">

          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-2">
              <Badge variant="outline" className="rounded-none border-primary text-primary tracking-widest uppercase px-4 py-1">
                Who We Are
              </Badge>
              <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight text-foreground">
                Building Dreams with <span className="text-primary">Concrete Precision</span>
              </h2>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              MBN Construction stands as a pillar of excellence in the construction industry.
              Led by <strong className="text-foreground">M. Bhagya Naik (B. Tech Civil)</strong>,
              we bring professional engineering expertise to every project.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Our commitment to quality is unwavering. We don&#39;t just build structures;
              we create lasting legacies using the finest materials and cutting-edge techniques.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                "Premium Quality Materials",
                "Expert Engineering",
                "Timely Delivery",
                "Cost-Effective Solutions"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 about-card">
                  <CheckCircle2 className="text-primary w-6 h-6" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Owner Card */}
            <Card className="mt-8 bg-secondary/30 border-none rounded-none about-card relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary group-hover:w-2 transition-all" />
              <CardContent className="p-6 pl-8">
                <h4 className="font-heading text-xl font-bold text-foreground">M. Bhagya Naik</h4>
                <p className="text-primary font-medium mb-2">B. Tech (Civil)</p>
                <p className="text-sm text-muted-foreground">Founder & Chief Engineer</p>
              </CardContent>
            </Card>
          </div>

          {/* Visual/Stats */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 stats-container">
              <div className="col-span-2 h-64 bg-muted rounded-none overflow-hidden relative group stat-item">
                <Image
                  src={blueprintImage}
                  alt="Planning"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                <div className="absolute bottom-4 left-4 bg-background/90 p-3 backdrop-blur-sm">
                  <Ruler className="w-6 h-6 text-primary mb-1" />
                  <p className="font-heading font-bold">Precise Planning</p>
                </div>
              </div>

              <div className="h-48 bg-muted rounded-none overflow-hidden relative group stat-item">
                 <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center text-white p-4 text-center">
                    <HardHat className="w-14 h-14 text-primary" strokeWidth={1}/>
                    {/*<span className="text-3xl font-heading font-bold">*/}
                    {/*    35+</span>*/}
                     <span className="text-3xl font-heading font-bold">
                        <NumberTicker
                            value={35}
                            className="text-3xl font-heading font-bold tracking-tighter leading-none text-white"
                        />
                         &nbsp;+</span>
                    <span className="text-xs uppercase tracking-wider opacity-80">Years Exp.</span>
                 </div>
              </div>

              <div className="h-48 bg-primary rounded-none overflow-hidden relative group stat-item flex items-center justify-center p-4 text-center text-white">
                 <div>
                    <BrickWall className="w-13 h-13 mb-1 mx-auto text-white/80" strokeWidth={1}/>
                    <span className="text-3xl font-heading font-bold">
                        <NumberTicker
                            value={100}
                            className="text-3xl font-heading font-bold tracking-tighter leading-none text-white"
                        />
                        &nbsp;+</span>
                    <div className="text-xs uppercase tracking-wider opacity-80">Projects Done</div>
                 </div>
              </div>
            </div>

            {/* Decorative box */}
            <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 border-8 border-muted/30 rounded-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
