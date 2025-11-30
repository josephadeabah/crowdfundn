'use client';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Rocket, FileText, Award, Users, Eye, Menu, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Hero', icon: LayoutDashboard },
  { id: 'campaigns', label: 'Featured', icon: Rocket },
  { id: 'contracts', label: 'Contracts', icon: FileText },
  { id: 'brand', label: 'Brand', icon: Award },
  { id: 'partners', label: 'Partners', icon: Users },
];

interface NavigationProps {
  showAll: boolean;
  onToggleShowAll: () => void;
}

export default function Navigation({ showAll, onToggleShowAll }: NavigationProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-sidebar text-sidebar-foreground rounded-full shadow-lg"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <nav
        className={cn(
          'bg-sidebar text-sidebar-foreground p-6 rounded-2xl shadow-soft',
          'lg:w-64 lg:sticky lg:top-6 lg:self-start',
          'fixed top-0 right-0 h-full w-72 z-40 transition-transform duration-300',
          'lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-xl font-bold mb-2">Navigation</h2>
            <p className="text-sm text-sidebar-foreground/70">Explore sections</p>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    'hover:bg-sidebar-foreground/10 hover:translate-x-1',
                    isActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-sidebar-border">
            <Button
              onClick={() => {
                onToggleShowAll();
                setMobileMenuOpen(false);
              }}
              variant={showAll ? 'default' : 'outline'}
              className={cn(
                'w-full gap-2',
                showAll
                  ? 'bg-emerald-600 text-primary-foreground hover:bg-emerald-600/90'
                  : 'border-sidebar-border text-sidebar-foreground hover:bg-sidebar-foreground/10'
              )}
            >
              <Eye className="w-4 h-4" />
              {showAll ? 'Showing All' : 'View All Sections'}
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}