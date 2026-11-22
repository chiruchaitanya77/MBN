import { Phone, Mail, MapPin } from "lucide-react";
import UnderlineOnHover from "@/components/ui/underline-hover";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-white pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-white tracking-tighter mb-6">
              MBN <span className="text-primary">CONSTRUCTION</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Building the foundation for a better tomorrow. We are committed to excellence in every brick we lay.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white uppercase tracking-wider">Links</h4>
            <ul className="space-y-3">
              {["Home", "About", "Services", "Projects", "Contact"].map((item) => (
                <li key={item}>
                  <UnderlineOnHover>
                  <a href={`#${item.toLowerCase()}`} className="text-zinc-400 hover:text-secondary transition-colors">
                    {item}
                  </a>
                    </UnderlineOnHover>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white uppercase tracking-wider">Services</h4>
            <ul className="space-y-3">
              {[ "Residential Buildings", "Commercial Complexes", "Industrial Infrastructure", "Civil Engineering", "Renovations"].map((service) => (
                  <li key={service}>
                    <UnderlineOnHover>
                      <span className="text-zinc-400 hover:text-secondary transition-colors">
                        {service}
                      </span>
                    </UnderlineOnHover>
                  </li>
              ))}
            </ul>
          </div>


          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-zinc-400">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span>Thukkuguda, Srisailam Highway, Mandal Maheshwaram, R.R.Dist - 501359</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <UnderlineOnHover>
                 <a href="tel:9948314455" className="hover:text-white transition-colors underline underline-offset-4 decoration-white/20">9948314455</a>
                </UnderlineOnHover>
              </li>
              <li className="flex items-center gap-3 text-zinc-400">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <UnderlineOnHover>
                 <a href="mailto:mbnaik1987@gmail.com" className="hover:text-white transition-colors underline underline-offset-4 decoration-white/20">mbnaik1987@gmail.com</a>
                </UnderlineOnHover>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-zinc-500 text-sm">
          <p>&copy; {new Date().getFullYear()} MBN Construction. All rights reserved.</p>
          <p>Designed with precision.</p>
          <UnderlineOnHover>
            <Link href="/privacy" className="hover:text-white transition-colors underline underline-offset-2 decoration-white/20">
              Privacy Policy
            </Link>
          </UnderlineOnHover>
        </div>
      </div>
    </footer>
  );
}
