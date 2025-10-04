'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  getAllCookies,
  deleteCookie,
  DetectedCookie,
  CookieCategory,
} from '@/app/lib/cookieManager';
import {
  Cookie,
  Trash2,
  RefreshCw,
  Shield,
  BarChart3,
  Target,
  Sparkles,
} from 'lucide-react';
import { toast } from '@/app/hooks/use-toast';

const categoryColors: Record<CookieCategory, string> = {
  essential: 'bg-primary/10 text-primary border-primary/20',
  functional: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  analytics: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  marketing: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
};

const categoryIcons: Record<CookieCategory, any> = {
  essential: Shield,
  functional: Sparkles,
  analytics: BarChart3,
  marketing: Target,
};

export const CookieManager = () => {
  const [cookies, setCookies] = useState<DetectedCookie[]>([]);
  const [open, setOpen] = useState(false);

  const loadCookies = () => {
    setCookies(getAllCookies());
  };

  useEffect(() => {
    if (open) {
      loadCookies();
    }
  }, [open]);

  const handleDelete = (name: string, domain: string) => {
    deleteCookie(name, domain);
    loadCookies();
    toast({
      title: 'Cookie deleted',
      description: `${name} has been removed.`,
    });
  };

  const handleRefresh = () => {
    loadCookies();
    toast({
      title: 'Cookies refreshed',
      description: 'Cookie list has been updated.',
    });
  };

  const groupedCookies = cookies.reduce(
    (acc, cookie) => {
      if (!acc[cookie.category]) {
        acc[cookie.category] = [];
      }
      acc[cookie.category].push(cookie);
      return acc;
    },
    {} as Record<CookieCategory, DetectedCookie[]>,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Cookie className="w-4 h-4" />
          Manage Cookies
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                Cookie Manager
              </DialogTitle>
              <DialogDescription>
                View and manage all cookies stored by BantuHive
              </DialogDescription>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-4 py-2">
          <span className="text-sm text-muted-foreground">
            Total cookies: <strong>{cookies.length}</strong>
          </span>
        </div>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6">
            {Object.entries(groupedCookies).map(
              ([category, categoryCookies]) => {
                const Icon = categoryIcons[category as CookieCategory];
                const colorClass = categoryColors[category as CookieCategory];

                return (
                  <div
                    key={category}
                    className="border border-border rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize text-card-foreground">
                          {category}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {categoryCookies.length} cookies
                        </p>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Domain</TableHead>
                          <TableHead>Path</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryCookies.map((cookie, idx) => (
                          <TableRow key={`${cookie.name}-${idx}`}>
                            <TableCell className="font-medium">
                              {cookie.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {cookie.domain}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {cookie.path}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {cookie.size} bytes
                            </TableCell>
                            <TableCell className="text-right">
                              {category !== 'essential' ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDelete(cookie.name, cookie.domain)
                                  }
                                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </Button>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  Protected
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
              },
            )}

            {cookies.length === 0 && (
              <div className="text-center py-12">
                <Cookie className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No cookies found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
