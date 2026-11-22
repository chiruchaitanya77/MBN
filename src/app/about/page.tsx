import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Contact } from "@/components/sections/Contact";
import { motion } from "framer-motion";
import { CheckCircle2, Users, Award, HardHat } from "lucide-react";
import aboutImage from "@assets/generated_images/architectural_blueprints_and_safety_gear.png";
import teamImage from "@assets/generated_images/modern_construction_office_meeting.png";
import {Footer} from "@/components/layout/Footer";
import {NumberTicker} from "@/components/ui/number-ticker";
import {Button} from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="About Us"
        subtitle="Building Trust Through Engineering Excellence Since 2010"
        backgroundImage={aboutImage}
      />

      <main>
        {/* Company Story */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h4 className="text-accent font-bold tracking-widest uppercase mb-4 text-sm">Our Story</h4>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6">
                  Engineering Dreams into Reality
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    MBN Construction was founded with a singular vision: to bridge the gap between architectural creativity and structural integrity. Led by M. Bhagya Naik, a qualified Civil Engineer (B.Tech), we bring technical precision to every project.
                  </p>
                  <p>
                    Over the years, we have evolved from a small contracting firm to a full-service construction company capable of handling complex residential, commercial, and industrial projects across Telangana.
                  </p>
                  <p>
                    Our philosophy is simple: <strong>No shortcuts.</strong> We believe that the strength of a building lies in the honesty of its materials and the skill of its builders.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative h-[400px] bg-gray-100 overflow-hidden shadow-xl"
              >
                <img
                  src={teamImage}
                  alt="MBN Team Meeting"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats/Values */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Users, number: "50+", label: "Skilled Workers" },
                { icon: CheckCircle2, number: "120+", label: "Projects Completed" },
                { icon: Award, number: "15", label: "Years Experience" },
                { icon: HardHat, number: "100%", label: "Safety Record" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-white/10 mx-auto mb-4 flex items-center justify-center rounded-full text-accent">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  {/*<h3 className="text-4xl font-heading font-bold mb-2">{stat.number}</h3>*/}
                  <NumberTicker
                      value={stat.number}
                      className="text-4xl font-heading font-bold mb-2"
                  />
                  <p className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gray-50 text-center">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-3xl font-heading font-bold text-primary mb-6">Ready to Start Your Project?</h2>
            <p className="text-gray-600 mb-8">
              We are always ready to discuss your construction needs and provide professional engineering advice.
            </p>
            <Button className="w-full bg-accent hover:bg-accent/90 text-white h-14 text-lg font-heading uppercase tracking-wider rounded-none">
              <a href="/contact">
                Get A Quote
              </a>
            </Button>
          </div>
        </section>

        {/* Reusing contact section footer */}
        <Contact />
        <Footer/>
      </main>
    </div>
  );
}
