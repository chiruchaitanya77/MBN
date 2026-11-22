import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Contact } from "@/components/sections/Contact";
import { motion } from "framer-motion";
import { Home, Building, Hammer, PaintBucket, Truck, DraftingCompass, Check } from "lucide-react";
import serviceBg from "@assets/generated_images/modern_concrete_architecture_detail.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/pages/footer.tsx";

export default function ServicesPage() {
  const services = [
    {
      icon: Home,
      title: "Residential Construction",
      description: "We build homes that are safe, sustainable, and stunning. From foundations to roofing, every aspect is managed by civil engineers.",
      features: ["Custom Home Design", "Multi-story Apartments", "Villa Communities", "Structural Safety Certification"]
    },
    {
      icon: Building,
      title: "Commercial Projects",
      description: "Scalable construction solutions for businesses. We understand the importance of timelines and budget adherence in commercial projects.",
      features: ["Office Complexes", "Retail Spaces", "Warehouses", "Showrooms"]
    },
    {
      icon: DraftingCompass,
      title: "Civil Engineering & Planning",
      description: "Technical expertise is at our core. We provide detailed structural analysis, architectural planning, and government approval drawings.",
      features: ["Blueprint Design", "3D Elevations", "Structural Analysis", "Estimation & Costing"]
    },
    {
      icon: Hammer,
      title: "Renovation & Remodeling",
      description: "Modernize your existing property. We assess structural integrity before making modifications to ensure safety.",
      features: ["Home Extensions", "Facade Makeovers", "Kitchen & Bath Remodels", "Structural Strengthening"]
    },
    {
      icon: Truck,
      title: "Site Development",
      description: "The foundation of any great project is the land it sits on. We handle all earthworks and site preparation.",
      features: ["Excavation", "Land Leveling", "Retaining Walls", "Drainage Systems"]
    },
    {
      icon: PaintBucket,
      title: "Finishing & Interiors",
      description: "A great structure deserves a beautiful finish. Our interior team handles all the aesthetic details.",
      features: ["Flooring & Tiling", "False Ceilings", "Painting & Textures", "Electrical & Plumbing"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="Our Services"
        subtitle="Comprehensive Civil Engineering & Construction Solutions"
        backgroundImage={serviceBg}
      />

      <main>
        {/* Detailed Services Grid */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="bg-primary/5 p-8 flex items-center justify-center md:w-32 shrink-0">
                        <service.icon className="w-12 h-12 text-primary" />
                      </div>
                      <div className="p-6 flex-1">
                        <h3 className="text-xl font-heading font-bold text-primary mb-3">{service.title}</h3>
                        <p className="text-gray-600 mb-6">{service.description}</p>
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                              <Check className="w-4 h-4 text-accent" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
             <div className="text-center mb-16">
                <h2 className="text-3xl font-heading font-bold text-primary">Our Construction Process</h2>
                <div className="w-24 h-1 bg-accent mx-auto mt-4" />
             </div>

             <div className="relative">
                {/* Connecting Line (Desktop) */}
                 <div className="hidden md:block absolute top-1/2 md:top-2/6 left-0 w-full h-1 bg-gray-500 -translate-y-1/2 z-0 " />

                 {/* Arrow Line (Mobile) */}
                 <div className="md:hidden block absolute mt-4">
                     <svg
                         className="w-6 h-6 text-gray-900 animate-bounce"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         viewBox="0 0 24 24"
                     >
                         <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                     </svg>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                  {[
                    { step: "01", title: "Consultation", desc: "We discuss your vision, budget, and timeline." },
                    { step: "02", title: "Planning", desc: "Architectural drawings and structural design." },
                    { step: "03", title: "Construction", desc: "Execution with quality materials and supervision." },
                    { step: "04", title: "Handover", desc: "Final inspection and key handover." },
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-6 text-center border border-gray-100 shadow-lg md:shadow-none md:border-none">
                      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 ring-8 ring-white">
                        {item.step}
                      </div>
                      <h3 className="font-heading font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </section>

        <Contact />
        <Footer/>
      </main>
    </div>
  );
}
