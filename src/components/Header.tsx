import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, Sun, Moon, ChevronDown, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import logo from "@/assets/logo.png";
import { categories } from "@/data/newsData";
import { liveApi, LiveSettings } from "@/services/api";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Live Stream", path: "/live-stream" },
  { name: "Contact", path: "/contact" },
];

export default function Header({ isDark, toggleTheme }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveSettings, setLiveSettings] = useState<LiveSettings | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchLiveStatus = async () => {
      try {
        const data = await liveApi.getSettings();
        setLiveSettings(data);
      } catch {
        // Demo mode - check localStorage
        const stored = localStorage.getItem('live_settings');
        if (stored) {
          setLiveSettings(JSON.parse(stored));
        }
      }
    };
    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border">
                <img src={logo} alt="24x7 News Time" className="h-12 w-auto" />
              </div>
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                          isActive(item.path)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-4 border-t border-border mt-4">
                    <p className="px-4 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Categories
                    </p>
                    <ul className="space-y-1">
                      {categories.map((cat) => (
                        <li key={cat.slug}>
                          <Link
                            to={`/category/${cat.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="24x7 News Time" className="h-10 md:h-12 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.slice(0, 2).map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 text-sm font-medium">
                Categories
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.slug} asChild>
                  <Link to={`/category/${cat.slug}`} className="cursor-pointer">
                    {cat.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navItems.slice(2).map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {item.name}
              {item.path === '/live-stream' && liveSettings?.is_live && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
                  <Radio className="h-3 w-3" />
                  LIVE
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl top-[20%]">
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Search News</h2>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for news, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        setIsSearchOpen(false);
                        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      if (searchQuery.trim()) {
                        setIsSearchOpen(false);
                        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                      }
                    }}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
