import React from 'react';
import officeImage from '@/assets/prabas-office.jpg';

const stats = [
  { value: '14+', label: 'Years' },
  { value: '30+', label: 'Awards' },
  { value: '5', label: 'Brands & Branches' },
  { value: '24/7', label: 'Support' },
  { value: '3', label: 'Countries' },
];

const WhoWeAre = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="h-3 w-3 rounded-full bg-secondary" />
          <span className="tracking-[0.3em] text-xs font-semibold text-secondary">
            THE PRABAS STORY
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 items-start mb-16">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold text-primary mb-8 leading-tight">
              Who We Are
            </h2>
            <div className="space-y-5 text-base md:text-lg text-foreground/80 leading-relaxed">
              <p>
                Founded in 2014, <strong className="text-primary">Prabas Travel &amp; Tours</strong> has
                grown into one of Nepal's most recognised names in air travel.
              </p>
              <p>
                Fourteen years on, we are an IATA-accredited agency issuing tickets across the
                world's major carriers, building journeys through Prabas Holidays, and powering
                online bookings through our own OTA, FlightsNepal.
              </p>
              <p className="italic text-primary/80 border-l-4 border-secondary pl-5">
                We serve individual travellers, students, corporates and fellow agencies alike —
                and our founding principle hasn't changed: the right fare, honest advice, and
                customer satisfaction.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 bg-secondary/20 rounded-3xl rotate-2" />
            <img
              src={officeImage}
              alt="Prabas Travel office in Thamel, Kathmandu"
              className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Vision / Mission */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-muted border-l-4 border-secondary rounded-r-2xl p-7">
            <p className="text-secondary font-bold tracking-wider text-sm mb-2">OUR VISION</p>
            <p className="text-foreground/80 leading-relaxed">
              To be Nepal's most trusted travel partner — the standard for reliability, value and
              service in every journey.
            </p>
          </div>
          <div className="bg-muted border-l-4 border-secondary rounded-r-2xl p-7">
            <p className="text-secondary font-bold tracking-wider text-sm mb-2">OUR MISSION</p>
            <p className="text-foreground/80 leading-relaxed">
              To make world-class travel simple and affordable for all, backed by genuine 24/7
              support and lasting relationships.
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/15">
            {stats.map((s) => (
              <div key={s.label} className="text-center md:px-2 pt-4 md:pt-0 first:pt-0">
                <p className="text-4xl md:text-5xl font-bold mb-1">{s.value}</p>
                <p className="text-xs md:text-sm tracking-wider text-primary-foreground/70 uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;