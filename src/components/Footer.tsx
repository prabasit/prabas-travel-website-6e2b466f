
import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="prabas-upload\prabaslogo.png" 
                alt="Prabas Travel Logo" 
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold">Prabas Travel</h3>
                <p className="text-sm opacity-80">& Tours Pvt. Ltd.</p>
              </div>
            </div>
            <p className="text-sm opacity-90">
              Your trusted travel partner since 2014. We specialize in creating unforgettable 
              experiences across Nepal and beyond.
            </p>
            <div className="flex space-x-4">
  <a href="https://www.facebook.com/prabastravel/" aria-label="Facebook">
    <Button size="icon" variant="ghost" className="hover:bg-white/10">
      <Facebook className="h-5 w-5" />
    </Button>
  </a>
  <a href="https://www.instagram.com/prabastravel/" aria-label="Instagram">
    <Button size="icon" variant="ghost" className="hover:bg-white/10">
      <Instagram className="h-5 w-5" />
    </Button>
  </a>
  <a href="https://www.youtube.com/@flightsnepal" aria-label="Youtube">
    <Button size="icon" variant="ghost" className="hover:bg-white/10">
      <Youtube className="h-5 w-5" />
    </Button>
  </a>
</div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-yellow-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-yellow-400 transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-yellow-400 transition-colors">Our Services</a></li>
              <li><a href="#team" className="hover:text-yellow-400 transition-colors">Our Team</a></li>
              <li><a href="#blog" className="hover:text-yellow-400 transition-colors">Travel Blog</a></li>
              <li><a href="#testimonials" className="hover:text-yellow-400 transition-colors">Testimonials</a></li>
            </ul>
          </div>

          {/* Our Companies */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Companies</h4>
            <ul className="space-y-2">
              <li><a href="#holidays" className="hover:text-yellow-400 transition-colors">Prabas Holidays</a></li>
              <li><a href="#flights" className="hover:text-yellow-400 transition-colors">FlightsNepal.com</a></li>
            </ul>
            
            <h4 className="text-lg font-semibold mb-4 mt-6">Popular Destinations</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Bali</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Singapore</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Europe</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Nepal Tour</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm">Chhaya Devi Complex,Shop No. 315-317</p>
                  <p className="text-sm">Thamel, Kathmandu</p>
                  <p className="text-sm">Nepal, 44600</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="text-sm">+977-1-4700921</p>
                  <p className="text-sm">+977-1-4700922</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="text-sm">info@prabastravel.com</p>
                  <p className="text-sm">info@flightsnepal.com</p>
                  <p className="text-sm">info@prabasholidays.com</p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="font-semibold mb-2">Newsletter</h5>
              <p className="text-sm opacity-90 mb-3">Subscribe for travel tips and exclusive offers</p>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Your email" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button variant="secondary" size="sm">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm opacity-80">
              © 2026 Prabas Travel & Tours Pvt. Ltd. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
