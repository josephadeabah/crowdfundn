import { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, FileText } from 'lucide-react';

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
  tableOfContents: { id: string; title: string }[];
}

const PolicyLayout = ({
  title,
  lastUpdated,
  children,
  tableOfContents,
}: PolicyLayoutProps) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-6">
            <Link
              href="/"
              className="hover:text-primary-foreground transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary-foreground">{title}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            {title}
          </h1>
          <div className="flex items-center gap-6 text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Last Updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm">BantuHive Ltd</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar - Table of Contents */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-xl p-6 shadow-card border border-border">
                <h3 className="font-semibold text-foreground mb-4">
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="block w-full text-left text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                    >
                      {item.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              <div className="bg-card rounded-xl p-8 md:p-12 shadow-card border border-border">
                {children}
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PolicyLayout;
