// "use client";
//
// import { Navbar } from "@/components/layout/Navbar";
// import { PageHeader } from "@/components/layout/PageHeader";
// import { Contact } from "@/components/sections/Contact";
// import { motion } from "framer-motion";
// import { CheckCircle2, Users, Award, HardHat } from "lucide-react";
// import aboutImage from "../../../attached_assets/generated_images/architectural_blueprints_and_safety_gear.png";
// import teamImage from "../../../attached_assets/generated_images/modern_construction_office_meeting.png";
// import { Footer } from "@/components/layout/Footer";
// import { NumberTicker } from "@/components/ui/number-ticker";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import concreteTexture from "../../../attached_assets/generated_images/concrete_texture_background.png";
// import Link from "next/link";
//
// export default function AboutPage() {
//   return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <PageHeader
//             title="About Us"
//             subtitle="Building Trust Through Engineering Excellence Since 2010"
//             backgroundImage={aboutImage.src}
//         />
//
//         <main>
//           {/* Company Story */}
//           <section className="py-20 bg-white">
//             <div className="container mx-auto px-6">
//               <div className="grid md:grid-cols-2 gap-16 items-center">
//                 <motion.div
//                     initial={{ opacity: 0, x: -30 }}
//                     whileInView={{ opacity: 1, x: 0 }}
//                     viewport={{ once: true }}
//                 >
//                   <h4 className="text-accent font-bold tracking-widest uppercase mb-4 text-sm">
//                     Our Story
//                   </h4>
//                   <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6">
//                     Engineering Dreams into Reality
//                   </h2>
//                   <div className="space-y-4 text-gray-600 leading-relaxed">
//                     <p>
//                       MBN Construction was founded with a singular vision: to
//                       bridge the gap between architectural creativity and
//                       structural integrity. Led by M. Bhagya Naik, a qualified
//                       Civil Engineer (B.Tech), we bring technical precision to
//                       every project.
//                     </p>
//                     <p>
//                       Over the years, we have evolved from a small contracting
//                       firm to a full-service construction company capable of
//                       handling complex residential, commercial, and industrial
//                       projects across Telangana.
//                     </p>
//                     <p>
//                       Our philosophy is simple: <strong>No shortcuts.</strong> We
//                       believe that the strength of a building lies in the honesty
//                       of its materials and the skill of its builders.
//                     </p>
//                   </div>
//                 </motion.div>
//
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     whileInView={{ opacity: 1, scale: 1 }}
//                     viewport={{ once: true }}
//                     className="relative h-[400px] bg-gray-100 overflow-hidden shadow-xl"
//                 >
//                   <Image
//                       src={teamImage}
//                       alt="MBN Team Meeting"
//                       className="w-full h-full object-cover"
//                   />
//                 </motion.div>
//               </div>
//             </div>
//           </section>
//
//           {/* Stats/Values */}
//           <section className="relative py-20 bg-black/90 text-white overflow-hidden">
//             {/* background texture */}
//             <div
//                 className="pointer-events-none absolute inset-0 opacity-20"
//                 style={{
//                   backgroundImage: `url(${concreteTexture.src})`,
//                   backgroundBlendMode: "multiply",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//             />
//
//             {/* content */}
//             <div className="relative container mx-auto px-6 pb-16">
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//                 {[
//                   {icon: Users, number: "50+", label: "Skilled Workers"},
//                   {icon: CheckCircle2, number: "120+", label: "Projects Completed"},
//                   {icon: Award, number: "15", label: "Years Experience"},
//                   {icon: HardHat, number: "100%", label: "Safety Record"},
//                 ].map( ( stat, i ) => (
//                     <div key={i} className="text-center">
//                       <div
//                           className="w-16 h-16 bg-white/10 mx-auto mb-4 flex items-center justify-center rounded-full text-secondary shadow-xl">
//                         <stat.icon className="w-10 h-10" strokeWidth={1}/>
//                       </div>
//                       <NumberTicker
//                           value={stat.number}
//                           className="text-4xl font-heading font-bold mb-2 text-primary tracking-tighter leading-none"
//                       />
//                       <p className="text-gray-300 text-sm uppercase tracking-wider">
//                         {stat.label}
//                       </p>
//                     </div>
//                 ) )}
//               </div>
//             </div>
//             {/* bottom svg cutout */}
//             <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
//               <path fill="#f9fafb"
//                     d="M0,60L80,70C160,80,320,100,480,90C640,80,800,40,960,30C1120,20,1280,40,1360,50L1440,60L1440,120H1360C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120H0V120Z"/>
//             </svg>
//           </section>
//
//           {/* CTA Section */}
//           <section className="py-44 bg-gray-50 text-center">
//             <div className="container mx-auto px-6 max-w-3xl">
//               <h2 className="text-4xl font-heading font-bold text-primary mb-6">
//                 Ready to <br/>make your dream come true?
//               </h2>
//               <p className="text-gray-600 mb-8">
//                 We are always ready to discuss your construction needs and provide
//                 professional engineering advice.
//               </p>
//
//               <Button
//                   className=" relative group w-full h-14 rounded-none bg-accent text-white text-lg font-heading uppercase tracking-wider
//                     transition-all duration-300 border-none hover:bg-black ring-0 ring-primary ring-offset-0 hover:ring-[8px] hover:ring-primary overflow-hidden"
//               >
//                 <Link href="/quote" className="relative z-10 w-full h-full flex items-center justify-center gap-2">
//                   {/* LEFT SLASH */}
//                   <span className=" absolute left-52 top-[50%] w-0 h-0.5 bg-primary
//                         -rotate-60 opacity-0 transition-all duration-300 ease-out
//                         group-hover:w-18 group-hover:opacity-100 "
//                   />
//                   <span className=" absolute left-44 top-[50%] w-0 h-0.5 bg-primary
//                         -rotate-60 opacity-0 transition-all duration-300 ease-out
//                         group-hover:w-18 group-hover:opacity-100 "
//                   />
//
//                   Get A Quote
//
//                   {/* RIGHT SLASH */}
//                   <span className=" absolute right-52 bottom-[45%] w-0 h-0.5 bg-primary
//                         -rotate-60 opacity-0 transition-all duration-300 ease-out
//                         group-hover:w-18 group-hover:opacity-100"
//                   />
//                   <span className=" absolute right-44 bottom-[45%] w-0 h-0.5 bg-primary
//                         -rotate-60 opacity-0 transition-all duration-300 ease-out
//                         group-hover:w-18 group-hover:opacity-100"
//                   />
//                 </Link>
//               </Button>
//
//
//             </div>
//           </section>
//
//           {/* Reusing contact section footer */}
//           <Contact />
//           <Footer />
//         </main>
//       </div>
//   );
// }

"use client";

import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Contact } from "@/components/sections/Contact";
import { motion } from "framer-motion";
import { CheckCircle2, Users, Award, HardHat } from "lucide-react";
import aboutImage from "../../../attached_assets/generated_images/architectural_blueprints_and_safety_gear.png";
import teamImage from "../../../attached_assets/generated_images/modern_construction_office_meeting.png";
import { Footer } from "@/components/layout/Footer";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import concreteTexture from "../../../attached_assets/generated_images/concrete_texture_background.png";
import Link from "next/link";

export default function AboutPage() {
  return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageHeader
            title="About Us"
            subtitle="Building Trust Through Engineering Excellence Since 2010"
            backgroundImage={aboutImage.src}
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
                  <h4 className="text-accent font-bold tracking-widest uppercase mb-4 text-sm">
                    Our Story
                  </h4>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6">
                    Engineering Dreams into Reality
                  </h2>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                      MBN Construction was founded with a singular vision: to
                      bridge the gap between architectural creativity and
                      structural integrity. Led by M. Bhagya Naik, a qualified
                      Civil Engineer (B.Tech), we bring technical precision to
                      every project.
                    </p>
                    <p>
                      Over the years, we have evolved from a small contracting
                      firm to a full-service construction company capable of
                      handling complex residential, commercial, and industrial
                      projects across Telangana.
                    </p>
                    <p>
                      Our philosophy is simple: <strong>No shortcuts.</strong> We
                      believe that the strength of a building lies in the honesty
                      of its materials and the skill of its builders.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative h-[400px] bg-gray-100 overflow-hidden shadow-xl"
                >
                  <Image
                      src={teamImage}
                      alt="MBN Team Meeting"
                      className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Stats/Values */}
          <section className="relative py-20 bg-black/90 text-white overflow-hidden">
            {/* background texture */}
            <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url(${concreteTexture.src})`,
                  backgroundBlendMode: "multiply",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
            />

            {/* content */}
            <div className="relative container mx-auto px-6 pb-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  {icon: Users, number: 50, suffix: "+", label: "Skilled Workers"},
                  {icon: CheckCircle2, number: 120, suffix: "+", label: "Projects Completed"},
                  {icon: Award, number: 15, suffix: "", label: "Years Experience"},
                  {icon: HardHat, number: 100, suffix: "%", label: "Safety Record"},
                ].map( ( stat, i ) => (
                    <div key={i} className="text-center">
                      <div
                          className="w-16 h-16 bg-white/10 mx-auto mb-4 flex items-center justify-center rounded-full text-secondary shadow-xl">
                        <stat.icon className="w-10 h-10 text-primary" strokeWidth={2}/>
                      </div>
                      <div className="text-4xl font-heading font-bold mb-2 text-primary tracking-tighter leading-none">
                        <NumberTicker
                            value={stat.number}
                            className="inline text-white"
                        />
                        <span className="text-white">{stat.suffix}</span>
                      </div>
                      <p className="text-gray-300 text-sm uppercase tracking-wider">
                        {stat.label}
                      </p>
                    </div>
                ) )}
              </div>
            </div>
            {/* bottom svg cutout */}
            <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
              <path fill="#f9fafb"
                    d="M0,60L80,70C160,80,320,100,480,90C640,80,800,40,960,30C1120,20,1280,40,1360,50L1440,60L1440,120H1360C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120H0V120Z"/>
            </svg>
          </section>

          {/* CTA Section */}
          <section className="py-44 bg-gray-50 text-center">
            <div className="container mx-auto px-6 max-w-3xl">
              <h2 className="text-4xl font-heading font-bold text-primary mb-6">
                Ready to <br/>make your dream come true?
              </h2>
              <p className="text-gray-600 mb-8">
                We are always ready to discuss your construction needs and provide
                professional engineering advice.
              </p>

              <Button
                  className=" relative group w-full h-14 rounded-none bg-accent text-white text-lg font-heading uppercase tracking-wider
                    transition-all duration-300 border-none hover:bg-black ring-0 ring-primary ring-offset-0 hover:ring-[8px] hover:ring-primary overflow-hidden"
              >
                <Link href="/quote" className="relative z-10 w-full h-full flex items-center justify-center gap-2">
                  {/* LEFT SLASH */}
                  <span className=" absolute left-52 top-[50%] w-0 h-0.5 bg-primary
                        -rotate-60 opacity-0 transition-all duration-300 ease-out
                        group-hover:w-18 group-hover:opacity-100 "
                  />
                  <span className=" absolute left-44 top-[50%] w-0 h-0.5 bg-primary
                        -rotate-60 opacity-0 transition-all duration-300 ease-out
                        group-hover:w-18 group-hover:opacity-100 "
                  />

                  Get A Quote

                  {/* RIGHT SLASH */}
                  <span className=" absolute right-52 bottom-[45%] w-0 h-0.5 bg-primary
                        -rotate-60 opacity-0 transition-all duration-300 ease-out
                        group-hover:w-18 group-hover:opacity-100"
                  />
                  <span className=" absolute right-44 bottom-[45%] w-0 h-0.5 bg-primary
                        -rotate-60 opacity-0 transition-all duration-300 ease-out
                        group-hover:w-18 group-hover:opacity-100"
                  />
                </Link>
              </Button>


            </div>
          </section>

          {/* Reusing contact section footer */}
          <Contact />
          <Footer />
        </main>
      </div>
  );
}
