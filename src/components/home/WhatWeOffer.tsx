import React from 'react';
import { Plane, Map, FileCheck, BedDouble, Car } from 'lucide-react';

const offerings = [
  {
    icon: Plane,
    title: 'Air Ticketing — Domestic & International',
    desc: 'Best fares and hassle-free ticketing on long-haul routes to Canada, the USA, the UK, Australia, Japan, India and beyond.',
  },
  {
    icon: Map,
    title: 'Package Tours — Inbound & Outbound',
    desc: 'Curated holidays by Prabas Holidays across Asia, the Middle East, Europe and within Nepal — tailored to you.',
  },
  {
    icon: FileCheck,
    title: 'Visa Guidance & Travel Insurance',
    desc: 'Complete documentation support and travel insurance so every journey is smooth, safe and worry-free.',
  },
  {
    icon: BedDouble,
    title: 'Hotel Booking — Inbound & International',
    desc: 'Handpicked accommodation in Nepal and worldwide, chosen for comfort, quality and genuine value.',
  },
  {
    icon: Car,
    title: 'Transport — Vehicle Rental',
    desc: 'Comfortable vehicles for airport transfers, sightseeing and group trips, at home or abroad.',
  },
];

const WhatWeOffer = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-3 w-3 rounded-full bg-secondary" />
          <span className="tracking-[0.3em] text-xs font-semibold text-secondary">
            COMPLETE TRAVEL SOLUTIONS
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-primary mb-14 leading-tight">
          What We Offer
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((o, i) => {
            const Icon = o.icon;
            const featured = i === 0;
            return (
              <div
                key={o.title}
                className={`group relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${
                  featured
                    ? 'bg-primary text-primary-foreground lg:row-span-2 lg:col-span-1 flex flex-col justify-between shadow-xl'
                    : 'bg-muted/50 hover:bg-muted hover:shadow-lg'
                }`}
              >
                <div>
                  <div
                    className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${
                      featured
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-primary/10 text-primary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors'
                    }`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3
                    className={`text-xl font-bold mb-3 ${
                      featured ? 'text-primary-foreground' : 'text-primary'
                    }`}
                  >
                    {o.title}
                  </h3>
                  <p
                    className={`leading-relaxed text-sm ${
                      featured ? 'text-primary-foreground/80' : 'text-foreground/70'
                    }`}
                  >
                    {o.desc}
                  </p>
                </div>
                {featured && (
                  <p className="mt-8 text-secondary font-semibold tracking-wider text-xs">
                    IATA · NTB · NATTA CERTIFIED
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;