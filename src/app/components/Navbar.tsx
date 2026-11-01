import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { goToSection } from "./nav";
import { openLeadForm } from "./LeadForm";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";

function Logo() {
  return (
    <Link to="/" className="inline-flex items-center">
      <img
        src="/lumen-and-co-logo.png"
        alt="Lumen & Co Agency"
        className="h-10 sm:h-12 w-auto object-contain transition-all hover:scale-105"
      />
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center pt-5 sm:pt-7 px-3 sm:px-4">
      <nav className="bg-white rounded-full shadow-sm border border-neutral-200 pl-2 pr-2 py-2.5 w-full max-w-[820px] relative">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <Logo />
          </div>

          <div
            className="hidden md:flex items-center gap-5 lg:gap-6"
            style={{ fontSize: 14 }}
          >
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-black text-neutral-800 transition-colors">
              <span
                className="inline-block rounded-full bg-black"
                style={{ width: 1.5, height: 1.5 }}
              />
              Home
            </Link>
            <a href="#services" onClick={(e) => goToSection(e, "services")} className="hover:text-black text-neutral-800 transition-colors">
              Services
            </a>
            <Link to="/work/" className="hover:text-black text-neutral-800 transition-colors">
              Work
            </Link>
            <Link to="/pricing/" className="hover:text-black text-neutral-800 transition-colors">
              Pricing
            </Link>
            <Link to="/blog/" className="hover:text-black text-neutral-800 transition-colors">
              Blog
            </Link>
            <Link to="/about/" className="hover:text-black text-neutral-800 transition-colors">
              About
            </Link>
            <Link
              to="/contact/"
              className="inline-flex items-center gap-1 font-medium transition-colors"
              style={{ color: "#ef4d23" }}
            >
              Contact
            </Link>
          </div>


          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={openLeadForm}
              className="inline-flex items-center gap-2 rounded-full text-white pl-4 pr-1.5 py-2"
              style={{ backgroundColor: "#ef4d23", fontSize: 15 }}
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Get Started</span>
              <span className="w-7 h-7 rounded-full bg-white/20 inline-flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
            <button
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-neutral-200"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {open && (
          <div className="absolute top-full left-2 right-2 mt-2 bg-white rounded-2xl shadow-lg border border-neutral-200 p-4 z-20 md:hidden">
            <div className="flex flex-col gap-3" style={{ fontSize: 15 }}>
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5"
              >
                <span
                  className="inline-block rounded-full bg-black"
                  style={{ width: 1.5, height: 1.5 }}
                />
                Home
              </Link>
              <a href="#services" onClick={(e) => { setOpen(false); goToSection(e, "services"); }}>
                Services
              </a>
              <Link to="/work/" onClick={() => setOpen(false)}>
                Work
              </Link>
              <Link to="/pricing/" onClick={() => setOpen(false)}>
                Pricing
              </Link>
              <Link to="/blog/" onClick={() => setOpen(false)}>
                Blog
              </Link>
              <Link to="/about/" onClick={() => setOpen(false)}>
                About
              </Link>
              <Link
                to="/contact/"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1"
                style={{ color: "#ef4d23" }}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
