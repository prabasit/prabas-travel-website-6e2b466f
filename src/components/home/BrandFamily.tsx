import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Globe2, Compass, ArrowUpRight } from 'lucide-react';

const brands = [
  {
    icon: Plane,
    tag: 'PARENT AGENCY · IATA ACCREDITED',
    name: 'Prabas Travel & Tours',
    desc: "Our flagship air-ticketing agency. B2B & B2C ticketing for domestic and international flights, backed by 14 years of expertise and a wall of airline awards.",
    site: 'prabastravel.com',
    href: '/services',
    accent: 'border-primary',
  },
  {
    icon: Globe2,
    tag: 'ONLINE TRAVEL AGENT (OTA)',
    name: 'FlightsNepal',
    desc: "Our own booking platform and one of Nepal's top OTAs — flights, hotels and travel insurance in real time, on web and mobile, for travellers and corporates.",
    site: 'flightsnepal.com',
    href: '/flights-nepal',
    accent: 'border-secondary',
  },
  {
    icon: Compass,
    tag: 'HOLIDAYS & TOURS',
    name: 'Prabas Holidays',
    desc: "Our holidays division, crafting curated tour packages across Asia, Europe and worldwide — plus memorable domestic getaways within Nepal.",
    site: 'prabasholidays.com',
    href: '/prabas-holidays',
    accent: 'border-primary',
  },
];

const BrandFamily = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-3 w-3 rounded-full bg-secondary" />
          <span className="tracking-[0.3em] text-xs font-semibold text-secondary">
            OUR FAMILY OF BRANDS
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-end mb-14">
          <div className="lg:col-span-2">
            <h2 className="text-4xl md:text-6xl font-bold text-primary leading-tight">
              One Group, <span className="text-secondary">Three Specialists</span>
            </h2>
          </div>
          <p className="text-foreground/70 leading-relaxed">
            Prabas Travel &amp; Tours is the parent company — a full-service travel house operating
            three focused brands that together cover every part of your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {brands.map((b) => {
            const Icon = b.icon;
            return (
              <Link
                key={b.name}
                to={b.href}
                className={`group relative bg-background border-l-4 ${b.accent} rounded-2xl p-7 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                    <Icon className="h-7 w-7" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-foreground/40 group-hover:text-secondary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
                <p className="text-secondary font-bold tracking-wider text-[11px] mb-2">
                  {b.tag}
                </p>
                <h3 className="text-2xl font-bold text-primary mb-3">{b.name}</h3>
                <p className="text-foreground/70 leading-relaxed mb-6 text-sm">{b.desc}</p>
                <p className="font-semibold text-primary text-sm">{b.site}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandFamily;