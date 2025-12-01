'use client';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Rocket,
  FileText,
  Award,
  Users,
  Eye,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
}

export const navItems: NavItem[] = [
  { id: 'hero', label: 'Us', icon: LayoutDashboard },
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
  onSectionChange,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!showAll) return;

      const scrollPosition = window.scrollY + 100;

      for (let i = navItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(navItems[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          onSectionChange(navItems[i].id);
          break;
        }
      }
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAll, onSectionChange]);

  const handleSectionClick = (id: string) => {
    onSectionChange(id);
    if (showAll) {
      const el = document.getElementById(id);
      if (el) {
        const offset = 80;
        const pos =
          el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={cn(
        'sticky top-0 z-40 w-full backdrop-blur-md border-b transition-all duration-300',
        'bg-white/80 border-gray-100',
        isScrolled && 'bg-white/95 shadow-sm',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* DESKTOP — Labels only */}
        <div className="hidden lg:flex items-center justify-center h-16">
          <div className="flex items-center space-x-0 border border-gray-100 bg-green-700/50 p-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionClick(item.id)}
                  className={cn(
                    'px-4 py-1.5 rounded-none text-sm font-medium transition-all whitespace-nowrap',
                    'hover:bg-gray-50 hover:text-gray-900',
                    active
                      ? 'bg-gray-50 text-gray-800 border border-gray-100'
                      : 'text-gray-600',
                  )}
                >
                  {item.label}
                </button>
              );
            })}

            {/* View All Button — stays in same group */}
            <Button
              onClick={onToggleShowAll}
              size="sm"
              className={cn(
                'rounded-none text-sm',
                showAll
                  ? 'bg-green-700 text-white hover:bg-green-800 shadow-xs'
                  : 'bg-white border-none text-gray-700 hover:bg-gray-50',
              )}
            >
              <Eye className="w-3 h-3" />
              {showAll ? 'Showing All' : 'View All'}
            </Button>
          </div>
        </div>

        {/* MOBILE — Icons only */}
        <div className="lg:hidden flex justify-center items-center h-16 gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={cn(
                  'flex flex-col items-center justify-center transition-all',
                  active ? 'text-green-700' : 'text-gray-500',
                )}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}

          {/* View All Button — AFTER icons */}
          <button
            onClick={onToggleShowAll}
            className={cn(
              'flex flex-col items-center justify-center transition-all',
              showAll ? 'text-green-700' : 'text-gray-500',
            )}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
