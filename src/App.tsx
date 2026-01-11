import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Testimonials from "./pages/Testimonials";
import Awards from "./pages/Awards";
import FlightsNepal from "./pages/FlightsNepal";
import PrabasHolidays from "./pages/PrabasHolidays";
import Inquiries from "./pages/Inquiries";
import DynamicPage from "./pages/DynamicPage";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import BannerManagement from "./pages/admin/BannerManagement";
import Pages from "./pages/admin/Pages";
import BlogManagement from "./pages/admin/BlogManagement";
import TeamManagement from "./pages/admin/TeamManagement";
import ServicesManagement from "./pages/admin/ServicesManagement";
import TestimonialsManagement from "./pages/admin/TestimonialsManagement";
import AwardsManagement from "./pages/admin/AwardsManagement";
import CareerManagement from "./pages/admin/CareerManagement";
import FlightsNepalManagement from "./pages/admin/FlightsNepalManagement";
import PrabasHolidaysManagement from "./pages/admin/PrabasHolidaysManagement";
import InquiriesManagement from "./pages/admin/InquiriesManagement";
import NewsletterManagement from "./pages/admin/NewsletterManagement";
import AdminManagement from "./pages/admin/AdminManagement";
import AboutAdmin from "./pages/admin/About";
import Settings from "./pages/admin/Settings";
import CareerApplicationsManagement from "./pages/admin/CareerApplicationsManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/flights-nepal" element={<FlightsNepal />} />
          <Route path="/prabas-holidays" element={<PrabasHolidays />} />
          <Route path="/inquiries" element={<Inquiries />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/banners" element={<BannerManagement />} />
          <Route path="/admin/pages" element={<Pages />} />
          <Route path="/admin/blogs" element={<BlogManagement />} />
          <Route path="/admin/team" element={<TeamManagement />} />
          <Route path="/admin/services" element={<ServicesManagement />} />
          <Route path="/admin/testimonials" element={<TestimonialsManagement />} />
          <Route path="/admin/awards" element={<AwardsManagement />} />
          <Route path="/admin/careers" element={<CareerManagement />} />
          <Route path="/admin/flights-nepal" element={<FlightsNepalManagement />} />
          <Route path="/admin/prabas-holidays" element={<PrabasHolidaysManagement />} />
          <Route path="/admin/inquiries" element={<InquiriesManagement />} />
          <Route path="/admin/newsletter" element={<NewsletterManagement />} />
          <Route path="/admin/admin-management" element={<AdminManagement />} />
          <Route path="/admin/about" element={<AboutAdmin />} />
          <Route path="/admin/settings" element={<Settings />} />

          {/* ✅ FIX: make the router match your sidebar link */}
          <Route path="/admin/job-applications" element={<CareerApplicationsManagement />} />
          {/* (Optional legacy alias—remove later if you want) */}
          <Route path="/admin/career-applications" element={<CareerApplicationsManagement />} />
          
          {/* Dynamic pages */}
          <Route path="/:slug" element={<DynamicPage />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
