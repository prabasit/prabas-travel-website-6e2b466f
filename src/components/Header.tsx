
import React, { useState } from 'react';
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger, 
} from '@/components/ui/navigation-menu';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const businessMenuItems = [
    { name: 'Prabas Holidays', href: '/prabas-holidays' },
    { name: 'Flights Nepal', href: '/flights-nepal' },
  ];

  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50">
      {/* Top Contact Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>01-4700921/22</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>info@prabastravel.com</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Your Trusted Travel Partner Since 2014</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/">
              <img 
                src="prabas-upload\prabaslogo.png" 
                alt="Prabas Travel Logo" 
                className="h-16 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className="px-4 py-2 hover:text-primary transition-colors">
                    Home
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/about" className="px-4 py-2 hover:text-primary transition-colors">
                    About Us
                  </Link>
                </NavigationMenuItem>

               <NavigationMenuItem>
  <NavigationMenuTrigger>Our Businesses</NavigationMenuTrigger>
  <NavigationMenuContent>
    <div className="w-64 p-4">
      {businessMenuItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className="block px-4 py-2 text-sm rounded-md transition-colors hover:bg-[#F15A24] hover:text-white active:bg-[#d94f20]"
        >
          {item.name}
        </Link>
      ))}
    </div>
  </NavigationMenuContent>
</NavigationMenuItem>
    

                <NavigationMenuItem>
                  <Link to="/team" className="px-4 py-2 hover:text-primary transition-colors">
                    Our Team
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/careers" className="px-4 py-2 hover:text-primary transition-colors">
                    Careers
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/testimonials" className="px-4 py-2 hover:text-primary transition-colors">
                    Testimonials
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/blog" className="px-4 py-2 hover:text-primary transition-colors">
                    Blog
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/inquiries" className="px-4 py-2 hover:text-primary transition-colors">
                    Inquiries
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Button className="bg-[#F15A24] hover:bg-[#d94f20]">Get Quote</Button>

          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border">
            <div className="space-y-2 pt-4">
              <Link to="/" className="block px-4 py-2 hover:bg-accent rounded-md">Home</Link>
              <Link to="/about" className="block px-4 py-2 hover:bg-accent rounded-md">About Us</Link>
              
              <div className="px-4 py-2">
                <span className="font-semibold">Our Businesses</span>
                <div className="ml-4 mt-2 space-y-1">
                  {businessMenuItems.map((item) => (
                    <Link key={item.name} to={item.href} className="block py-1 text-sm hover:text-primary">
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link to="/team" className="block px-4 py-2 hover:bg-accent rounded-md">Our Team</Link>
              <Link to="/careers" className="block px-4 py-2 hover:bg-accent rounded-md">Careers</Link>
              <Link to="/testimonials" className="block px-4 py-2 hover:bg-accent rounded-md">Testimonials</Link>
              <Link to="/blog" className="block px-4 py-2 hover:bg-accent rounded-md">Blog</Link>
              <Link to="/inquiries" className="block px-4 py-2 hover:bg-accent rounded-md">Inquiries</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
