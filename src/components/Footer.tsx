import { Link } from "react-router-dom";
import { Youtube, Facebook, Twitter, Instagram, Mail, Phone, MapPin, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";
import { categories } from "@/data/newsData";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="24x7 News Time" className="h-16 w-auto brightness-0 invert" />
            <p className="text-background/70 text-sm">
              Your trusted 24x7 news source for breaking news, latest updates from India and around the world.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-red-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-sky-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-pink-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-background/70 hover:text-background transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-background/70 hover:text-background transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-background/70 hover:text-background transition-colors">Contact Us</Link></li>
              <li><Link to="/live-stream" className="text-background/70 hover:text-background transition-colors">Live Stream</Link></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-background/70 hover:text-background transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-background/70">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Ghaziabad, Uttar Pradesh, India</span>
                </li>
                <li className="flex items-center gap-2 text-background/70">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2 text-background/70">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">contact@24x7newstime.com</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Newsletter</h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
                <Button className="bg-primary hover:bg-primary/90 flex-shrink-0">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/60 text-sm text-center md:text-left">
            © 2026 24x7 News Time Pvt Ltd. All rights reserved. Made with ❤️ in India
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="text-background/60 hover:text-background hover:bg-background/10"
          >
            <ArrowUp className="h-4 w-4 mr-1" />
            Back to Top
          </Button>
        </div>
      </div>
    </footer>
  );
}
