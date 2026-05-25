import React from 'react';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

const branches = [
  {
    region: 'UAE',
    name: 'Prabas Travel & Tourism LLC',
    city: 'DUBAI · UNITED ARAB EMIRATES',
    address: '403, Makeya Abdulha Sharafi Bldg, Khalid Bin Al Waleed Rd, Dubai',
    phone: '+971 4 236 5211',
    email: 'info@prabastravel.ae',
    web: 'www.prabastravel.ae',
  },
  {
    region: 'AUS',
    name: 'Prabas Travel Australia',
    city: 'CANBERRA · AUSTRALIA',
    address: '90 Swain Street, Gungahlin ACT 2912, Canberra',
    phone: '0452 045 248 · 0402 412 450 (Canberra), 0449 945 279 (Sydney)',
    email: 'info@prabastravel.com.au',
    web: 'www.prabastravel.com.au',
  },
];

const GlobalBranches = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-3 w-3 rounded-full bg-secondary" />
          <span className="tracking-[0.3em] text-xs font-semibold text-secondary">
            GLOBAL PRESENCE
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-primary mb-4 leading-tight">
          Our Branches Outside Nepal
        </h2>
        <p className="text-foreground/70 max-w-2xl mb-14">
          Prabas Travel &amp; Tours now serves travellers from two international branches —
          the UAE and Australia.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {branches.map((b) => (
            <div
              key={b.region}
              className="relative bg-muted/40 rounded-3xl p-8 md:p-10 hover:shadow-xl transition-shadow border border-border"
            >
              <div className="absolute top-8 right-8 text-7xl font-bold text-primary/10 leading-none select-none">
                {b.region}
              </div>
              <p className="text-secondary font-bold tracking-wider text-xs mb-2">
                {b.city}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6">{b.name}</h3>
              <div className="space-y-4 text-sm text-foreground/80">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{b.address}</span>
                </div>
                <div className="flex gap-3">
                  <Phone className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{b.phone}</span>
                </div>
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{b.email}</span>
                </div>
                <div className="flex gap-3">
                  <Globe className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{b.web}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalBranches;