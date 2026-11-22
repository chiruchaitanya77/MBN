"use client";

import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Contact } from "@/components/sections/Contact";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import heroBg from "../../../attached_assets/generated_images/cinematic_modern_construction_site_at_twilight.png";
import {Footer} from "@/components/layout/Footer";
import Image from "next/image";

export default function ProjectsPage() {
  const [filter, setFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "Modern Villa Residence",
      category: "residential",
      location: "Hyderabad",
      image: "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TW9kZXJuJTIwVmlsbGElMjBSZXNpZGVuY2V8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 2,
      title: "Corporate Heights",
      category: "commercial",
      location: "Cyberabad",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Urban Apartments",
      category: "residential",
      location: "Secunderabad",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Industrial Complex",
      category: "industrial",
      location: "Patancheru",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 5,
      title: "Luxury Duplex",
      category: "residential",
      location: "Jubilee Hills",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 6,
      title: "Tech Park Phase 1",
      category: "commercial",
      location: "Gachibowli",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    }
  ];

  const filteredProjects = filter === "all"
    ? projects
    : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="Our Projects"
        subtitle="A Showcase of Engineering Excellence and Design"
        backgroundImage={heroBg.src}
      />

      <main>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              {["all", "residential", "commercial", "industrial"].map((cat) => (
                <Button
                  key={cat}
                  variant={filter === cat ? "default" : "outline"}
                  onClick={() => setFilter(cat)}
                  className={filter === cat ? "bg-primary text-white" : "text-primary hover:bg-primary/10"}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden aspect-4/3 mb-4">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white border border-white px-4 py-2 uppercase tracking-wider text-sm hover:bg-white hover:text-black transition-colors">
                        View Details
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-primary group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{project.location}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Contact />
        <Footer/>
      </main>
    </div>
  );
}
