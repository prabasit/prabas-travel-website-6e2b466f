import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Ship, Map, Star, CheckCircle, ExternalLink, Phone, Mail, MapPin } from 'lucide-react';

const PrabasAustralia = () => {
  const services = [
    {
      icon: <Plane className="h-12 w-12 text-primary" />,
      title: 'Domestic & International Flights',
      features: ['24/7 Support', 'Best Price Guarantee', 'In-flight / Onboard Assistance'],
    },
    {
      icon: <Map className="h-12 w-12 text-primary" />,
      title: 'Tour Packages',
      features: ['Airport Pick off and Drop off', 'Customise Deal', 'Great Hotel Options with Breakfast', 'Affordable Rate'],
    },
    {
      icon: <Ship className="h-12 w-12 text-primary" />,
      title: 'Cruise Booking',
      features: ['Onboard Entertainment & Activities', 'Family & Couple Friendly Deals', 'Flexible Dates & Itinerary', 'Cruise Options – Budget to Luxury'],
    },
  ];

  const offers = [
    {
      title: 'Colourful Europe',
      description: 'Experience the best of Europe in one unforgettable journey! Start in beautiful Barcelona, travel through France & Switzerland, explore iconic Italy & Austria.',
      duration: '22 days',
      price: '$6,000',
      originalPrice: '$7,000',
      savings: 'Save $1000',
      destinations: ['Spain', 'France', 'Switzerland', 'Italy', 'Austria', 'Hungary', 'Germany', 'Netherlands'],
    },
    {
      title: 'A Fantastic Route Europe',
      description: 'Explore the best of Europe in 16 unforgettable days! From the vibrant streets of Madrid & Barcelona to the romantic wonders of Rome, Florence & Venice.',
      duration: '16 Days',
      price: '$3,900',
      originalPrice: '$4,500',
      savings: 'Save $600',
      destinations: ['Austria', 'France', 'Italy', 'Spain', 'Switzerland'],
    },
    {
      title: 'Dream Bali Holiday',
      description: '5-Night Bali Escape – Stay in a 4-star luxury hotel and enjoy the perfect blend of relaxation, adventure, and tropical vibes.',
      duration: '6 Days / 5 Nights',
      price: '$900',
      originalPrice: '$1,200',
      savings: 'Save $300',
      destinations: ['Bali, Indonesia'],
    },
  ];

  const whyChooseUs = [
    {
      title: 'Expert Local Knowledge',
      description: "Deep understanding of Australia's hidden gems and popular destinations",
    },
    {
      title: 'Personalized Service',
      description: 'Tailored travel experiences designed around your preferences',
    },
    {
      title: 'Trusted Excellence',
      description: 'Years of experience delivering exceptional travel moments',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead pageIdentifier="prabas-australia" />
      <Header />
      
      <main className="pt-32">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                  <Star className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Your Trusted Travel Partner</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Prabas Travel <span className="text-primary">Australia</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Your trusted partner for unforgettable Australian adventures. From the iconic Sydney landmarks to the pristine beaches, from the ancient outback to the tropical rainforests, we transform your travel dreams into reality.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <a href="https://prabastravel.com.au" target="_blank" rel="noopener noreferrer">
                      Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="https://prabastravel.com.au/offers" target="_blank" rel="noopener noreferrer">
                      View Offers
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=400&q=80" 
                    alt="Sydney Opera House" 
                    className="rounded-lg shadow-xl h-48 w-full object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?auto=format&fit=crop&w=400&q=80" 
                    alt="Great Barrier Reef" 
                    className="rounded-lg shadow-xl h-48 w-full object-cover mt-8"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1494949360228-4e9bde560065?auto=format&fit=crop&w=400&q=80" 
                    alt="Uluru" 
                    className="rounded-lg shadow-xl h-48 w-full object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80" 
                    alt="Australia Beach" 
                    className="rounded-lg shadow-xl h-48 w-full object-cover mt-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Us</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We craft journeys that create lasting memories
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {whyChooseUs.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive travel solutions for every journey
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4">{service.icon}</div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Offers */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Offers</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Exclusive deals on Australia's most popular destinations
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {offers.map((offer, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="bg-primary text-primary-foreground text-center py-2 font-semibold">
                    {offer.savings}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{offer.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm">{offer.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {offer.destinations.map((dest, idx) => (
                        <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {dest}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-2xl font-bold text-primary">{offer.price}</span>
                        <span className="text-sm text-muted-foreground line-through ml-2">{offer.originalPrice}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{offer.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button size="lg" asChild>
                <a href="https://prabastravel.com.au/offers" target="_blank" rel="noopener noreferrer">
                  View All Offers <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Explore Australia?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Have questions? We're here to help plan your perfect Australian adventure
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <a href="https://prabastravel.com.au" target="_blank" rel="noopener noreferrer">
                  Visit Our Website <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <a href="https://prabastravel.com.au/contact" target="_blank" rel="noopener noreferrer">
                  Contact Us
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

export default PrabasAustralia;
