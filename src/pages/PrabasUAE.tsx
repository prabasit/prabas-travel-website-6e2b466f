import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Plane, Building2, Globe, Star, CheckCircle, MessageCircle, ExternalLink } from 'lucide-react';

const PrabasUAE = () => {
  const services = [
    {
      icon: <Plane className="h-12 w-12 text-primary" />,
      title: 'Flight Bookings',
      description: 'Domestic and international flight bookings with best price guarantee',
    },
    {
      icon: <Building2 className="h-12 w-12 text-primary" />,
      title: 'Hotel Reservations',
      description: 'Premium hotel bookings across UAE and worldwide destinations',
    },
    {
      icon: <Globe className="h-12 w-12 text-primary" />,
      title: 'Tour Packages',
      description: 'Customized tour packages for families, couples, and groups',
    },
  ];

  const highlights = [
    'Direct flights to Nepal from UAE',
    'Visa assistance and documentation',
    'Corporate travel solutions',
    'Group travel discounts',
    '24/7 customer support',
    'Best price guarantee',
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead pageIdentifier="prabas-uae" />
      <Header />
      
      <main className="pt-32">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                  <Star className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Your Trusted Travel Partner in UAE</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Prabas Travel <span className="text-primary">UAE</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Your gateway to seamless travel experiences from the United Arab Emirates. We specialize in flights, tours, and complete travel solutions for the Nepali community and beyond.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <a href="https://prabastravel.ae" target="_blank" rel="noopener noreferrer">
                      Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2" asChild>
                    <a href="https://wa.me/9710508804799" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" /> WhatsApp Us
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80" 
                    alt="Dubai Skyline" 
                    className="rounded-lg shadow-xl h-48 w-full object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=400&q=80" 
                    alt="Burj Khalifa" 
                    className="rounded-lg shadow-xl h-48 w-full object-cover mt-8"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=400&q=80" 
                    alt="Abu Dhabi Mosque" 
                    className="rounded-lg shadow-xl h-48 w-full object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80" 
                    alt="Dubai Marina" 
                    className="rounded-lg shadow-xl h-48 w-full object-cover mt-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're here to help you plan your perfect journey
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Phone className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <a href="tel:+97142365211" className="text-muted-foreground hover:text-primary transition-colors">
                    04-2365211
                  </a>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="h-7 w-7 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2">WhatsApp</h3>
                  <div className="space-y-1">
                    <a href="https://wa.me/9710508804799" className="block text-muted-foreground hover:text-green-500 transition-colors">
                      050-8804799
                    </a>
                    <a href="https://wa.me/9710553115044" className="block text-muted-foreground hover:text-green-500 transition-colors">
                      055-3115044
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <a href="mailto:info@prabastravel.ae" className="text-muted-foreground hover:text-primary transition-colors">
                    info@prabastravel.ae
                  </a>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-muted-foreground text-sm">
                    4th Floor, AL Souq AL Kabeer<br />
                    3 mins from Sharaf DG Metro, Exit 3
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive travel solutions tailored to your needs
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="mx-auto mb-4">{service.icon}</div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Why Choose Prabas Travel UAE?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  We are committed to providing exceptional travel experiences with personalized service and competitive pricing.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=600&q=80"
                  alt="Dubai Travel"
                  className="rounded-lg shadow-xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-xl">
                  <div className="text-3xl font-bold">10+</div>
                  <div className="text-sm opacity-90">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Plan Your Trip?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Contact us today for the best travel deals from UAE to Nepal and beyond
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <a href="https://wa.me/9710508804799" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <a href="tel:+97142365211">
                  <Phone className="mr-2 h-5 w-5" /> Call Now
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrabasUAE;
