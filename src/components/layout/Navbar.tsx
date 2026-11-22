"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import teamImage from "../../../attached_assets/3d_logo.png";
import UnderlineOnHover from "@/components/ui/underline-hover";
import GetQuoteButton from "@/components/ui/get-quote-button";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  // { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    gsap.from(".nav-item", {
      y: -20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.5
    });
  });

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/*<div className="flex items-center gap-2">*/}
        {/*  <Image*/}
        {/*      src="/3d_logo.png"*/}
        {/*      alt="MBN"*/}
        {/*      width={48}*/}
        {/*      height={48}*/}
        {/*      className="w-12 h-12"*/}
        {/*  />*/}
        {/*  <div className="flex flex-col leading-tight">*/}
        {/*    <Link href="/" className="text-2xl md:text-3xl font-heading font-bold text-primary tracking-tighter cursor-pointer">*/}
        {/*      MBN{" "}*/}
        {/*      <span className={`${isScrolled ? "text-accent" : "text-white"}`}>*/}
        {/*        CONSTRUCTION*/}
        {/*      </span>*/}
        {/*    </Link>*/}
        {/*    <span className={`text-sm tracking-[0.3em] ${isScrolled ? "text-primary font-normal" : "text-white font-thin"}`}>*/}
        {/*      Private Limited*/}
        {/*    </span>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <Link href="/" className="group" draggable="false">
          <div className="flex items-center gap-2 select-none"
              style={{ pointerEvents: "auto", WebkitUserSelect: "none", userSelect: "none",}}
              onContextMenu={(e) => e.preventDefault()} // disable right-click
          >
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-2">
                <Image
                    src={teamImage}
                    alt="MBN"
                    width={160}
                    height={160}
                    draggable={false}          // cannot drag
                    className=" w-40 rounded-3xl pointer-events-none select-none"
                />
              </div>
            </div>
          </div>
        </Link>
        {/*<div className="flex items-center gap-2">*/}
        {/*  <div className="flex flex-col leading-tight">*/}
        {/*    <div className="flex items-center gap-2">*/}
        {/*      <Image src={teamImage} alt="MBN" className="w-40 rounded-3xl " />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}


        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
              <UnderlineOnHover key={item.href} >
                <Link key={item.href} href={item.href}
                    className={`nav-item text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest
                     ${isScrolled ? "text-accent" : "text-white"} `}
                >
                  {item.label}
                </Link>
              </UnderlineOnHover>

                ))}
          <Link href="/quote" className="nav-item flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest">
            <GetQuoteButton/>
            {/*<Button className="nav-item bg-primary hover:bg-primary/90 text-white rounded-none px-6 font-heading tracking-wider uppercase">*/}
            {/*  <Phone className="w-4 h-4 mr-2" />*/}
            {/*  Get a Quote*/}
            {/*</Button>*/}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
            className="md:hidden mr-6"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
              <X className={isScrolled ? "text-primary" : "text-white"} />
          ) : (
              <Menu className={isScrolled ? "text-primary" : "text-white"} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b p-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
          {NAV_ITEMS.map((item) => (
              <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium py-2 border-b border-border/50"
                  onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
          ))}
          <Button className="w-full rounded-none mt-2 bg-primary text-white">
            Call Now
          </Button>
        </div>
      )}
    </nav>
  );
}
