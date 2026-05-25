import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plane } from 'lucide-react';

const PrabasHero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-primary text-primary-foreground">
      {/* Decorative mountain silhouettes */}
      <svg
        aria-hidden
        className="absolute inset-x-0 bottom-0 w-full text-white/5"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,224L120,202.7C240,181,480,139,720,144C960,149,1200,203,1320,229.3L1440,256L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
        />
      </svg>
      <svg
        aria-hidden
        className="absolute inset-x-0 bottom-0 w-full text-white/10"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,160L240,96L480,160L720,80L960,144L1200,96L1440,160L1440,200L0,200Z"
        />
      </svg>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="relative container mx-auto px-4 pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span className="h-3 w-3 rounded-full bg-secondary" />
              <span className="tracking-[0.3em] text-xs md:text-sm font-semibold text-secondary">
                EST. 2014 · THAMEL · KATHMANDU
              </span>
            </div>

            <p className="tracking-[0.35em] text-xs md:text-sm font-semibold text-secondary mb-4">
              COMPANY · 2026
            </p>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8">
              Connecting Nepal
              <br />
              <span className="text-secondary">to the World</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-10 leading-relaxed">
              Flights · Holidays · Complete Travel Services — trusted since 2014.
              IATA-accredited and Nepal's most awarded travel house.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-7 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-lg"
              >
                Plan Your Journey <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 border border-primary-foreground/30 hover:bg-primary-foreground/10 px-7 py-4 rounded-full font-semibold transition-all"
              >
                Explore Services
              </Link>
            </div>

            {/* Brand list */}
            <div className="space-y-3 text-sm md:text-base">
              {[
                { name: 'FlightsNepal', url: 'flightsnepal.com' },
                { name: 'Prabas Travel & Tours', url: 'prabastravel.com' },
                { name: 'Prabas Holidays', url: 'prabasholidays.com' },
              ].map((b) => (
                <div key={b.name} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  <span className="font-semibold">{b.name}</span>
                  <span className="text-primary-foreground/60">·</span>
                  <span className="text-primary-foreground/70">{b.url}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating plane card */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-secondary/20 blur-3xl rounded-full" />
              <div className="relative bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-3xl p-8">
                <Plane className="h-12 w-12 text-secondary mb-6 -rotate-12" />
                <p className="text-3xl font-bold mb-2">14+ Years</p>
                <p className="text-primary-foreground/70 mb-6">
                  of issuing tickets across the world's leading carriers.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-primary-foreground/10">
                  <div>
                    <p className="text-2xl font-bold text-secondary">30+</p>
                    <p className="text-xs text-primary-foreground/60 tracking-wider">AWARDS</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary">3</p>
                    <p className="text-xs text-primary-foreground/60 tracking-wider">COUNTRIES</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrabasHero;