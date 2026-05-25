import React from 'react';

const international = [
  'Turkish Airlines', 'Qatar Airways', 'Emirates', 'Singapore Airlines',
  'Cathay Pacific', 'Thai Airways', 'Malaysia Airlines', 'Air China',
  'China Southern', 'China Eastern', 'Air India', 'Sri Lankan',
  'Himalaya Airlines', 'Nepal Airlines', 'Fly Dubai', 'Air Arabia',
  'Jazeera Airways', 'Sichuan Airlines',
];

const domestic = ['Buddha Air', 'Yeti Airlines', 'Shree Airlines'];

const AirlinePartners = () => {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_60%)]" />
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-3 w-3 rounded-full bg-secondary" />
          <span className="tracking-[0.3em] text-xs font-semibold text-secondary">
            OUR TICKETING NETWORK
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">Airline Partners</h2>
        <p className="text-primary-foreground/70 max-w-2xl mb-14">
          We issue tickets across the world's leading international carriers and every major
          domestic airline in Nepal.
        </p>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <p className="text-secondary font-bold tracking-wider text-xs mb-5">
              INTERNATIONAL AIRLINES
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {international.map((a) => (
                <div
                  key={a}
                  className="px-4 py-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 hover:border-secondary hover:bg-primary-foreground/10 transition-colors text-sm"
                >
                  {a}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-secondary font-bold tracking-wider text-xs mb-5">
              DOMESTIC AIRLINES
            </p>
            <div className="space-y-3">
              {domestic.map((a) => (
                <div
                  key={a}
                  className="px-4 py-3 rounded-lg bg-secondary/15 border border-secondary/30 text-sm font-medium"
                >
                  {a}
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-primary-foreground/15">
              <p className="text-3xl font-bold text-secondary">IATA · NTB · NATTA</p>
              <p className="text-sm text-primary-foreground/60 mt-1">
                Accredited & Certified
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AirlinePartners;