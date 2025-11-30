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

export const navItems: NavItem[] = [
  { id: 'hero', label: 'Hero', icon: LayoutDashboard },
  { id: 'campaigns', label: 'Featured', icon: Rocket },
  { id: 'contracts', label: 'Contracts', icon: FileText },
  { id: 'brand', label: 'Brand', icon: Award },
  { id: 'partners', label: 'Partners', icon: Users },
];

interface NavigationProps {
  showAll: boolean;
  activeSection: string;
  onToggleShowAll: () => void;
  onSectionChange: (sectionId: string) => void;
}

export default function Navigation({ 
  showAll, 
  activeSection, 
  onToggleShowAll, 
  onSectionChange 
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!showAll) return;
      
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          onSectionChange(navItems[i].id);
          break;
        }
      }

      // Check if page is scrolled for styling
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAll, onSectionChange]);

  const handleSectionClick = (id: string) => {
    onSectionChange(id);
    setMobileMenuOpen(false);
    
    if (showAll) {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <>
      {/* Horizontal Navigation Bar */}
      <nav
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          'bg-white/80 backdrop-blur-md border-b border-gray-200/60',
          isScrolled && 'bg-white/95 shadow-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between h-16">
            {/* Centered Navigation Items */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center space-x-1 bg-gray-50/80 rounded-2xl p-1 border border-gray-200/60">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSectionClick(item.id)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200',
                        'text-sm font-medium whitespace-nowrap',
                        'hover:bg-white hover:text-gray-900 hover:shadow-sm',
                        isActive 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs' 
                          : 'text-gray-600'
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* View All Sections Toggle */}
            <div className="flex-1 flex items-center justify-end">
              <Button
                onClick={onToggleShowAll}
                variant={showAll ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'gap-2 transition-all',
                  showAll
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-xs'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                )}
              >
                <Eye className="w-4 h-4" />
                {showAll ? 'Showing All' : 'View All'}
              </Button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Title */}
            <div className="flex-1 text-center">
              <span className="text-sm font-medium text-gray-700">
                {navItems.find(item => item.id === activeSection)?.label || 'Navigation'}
              </span>
            </div>

            {/* Mobile View All Toggle */}
            <Button
              onClick={onToggleShowAll}
              variant={showAll ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'gap-1 px-3 transition-all',
                showAll
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-xs'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              )}
            >
              <Eye className="w-3 h-3" />
              <span className="sr-only lg:not-sr-only">{showAll ? 'All' : 'View'}</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 z-30"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg z-40">
              <div className="p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSectionClick(item.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                        'text-sm font-medium',
                        'hover:bg-gray-50 hover:text-gray-900',
                        isActive 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'text-gray-600'
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}