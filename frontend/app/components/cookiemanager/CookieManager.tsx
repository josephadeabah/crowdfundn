'use client';
import { useState, useEffect } from 'react';
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
  essential: 'bg-bantu-light-green text-bantu-dark-green border-bantu-green/20',
  functional: 'bg-gray-100 text-gray-700 border-gray-200',
  analytics: 'bg-blue-50 text-blue-600 border-blue-200',
  marketing: 'bg-bantu-soft-orange text-bantu-orange border-bantu-orange/20',
};

const categoryIcons: Record<CookieCategory, any> = {
  essential: Shield,
  functional: Sparkles,
  analytics: BarChart3,
  marketing: Target,
};

export const CookieManager = () => {
  const [cookies, setCookies] = useState<DetectedCookie[]>([]);

  const loadCookies = () => {
    setCookies(getAllCookies());
  };

  useEffect(() => {
    loadCookies();
  }, []);

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
    <div className="w-full bg-white text-gray-900 p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cookie Manager</h2>
          <p className="text-gray-700 mt-1">
            View and manage all cookies stored by BantuHive
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="flex items-center gap-4 py-2 mb-4">
        <span className="text-sm text-gray-700">
          Total cookies: <strong className="text-gray-900">{cookies.length}</strong>
        </span>
      </div>

      <ScrollArea className="w-full">
        <div className="space-y-6">
          {Object.entries(groupedCookies).map(
            ([category, categoryCookies]) => {
              const Icon = categoryIcons[category as CookieCategory];
              const colorClass = categoryColors[category as CookieCategory];

              return (
                <div
                  key={category}
                  className="border border-gray-200 rounded-xl p-4 bg-white"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold capitalize text-gray-900">
                        {category}
                      </h3>
                      <p className="text-xs text-gray-700">
                        {categoryCookies.length} cookies
                      </p>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-900">Name</TableHead>
                        <TableHead className="text-gray-900">Domain</TableHead>
                        <TableHead className="text-gray-900">Path</TableHead>
                        <TableHead className="text-gray-900">Size</TableHead>
                        <TableHead className="text-right text-gray-900">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryCookies.map((cookie, idx) => (
                        <TableRow key={`${cookie.name}-${idx}`}>
                          <TableCell className="font-medium text-gray-900">
                            {cookie.name}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {cookie.domain}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {cookie.path}
                          </TableCell>
                          <TableCell className="text-gray-700">
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
                                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </Button>
                            ) : (
                              <Badge variant="outline" className="text-xs text-gray-700 border-gray-300">
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
              <Cookie className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-700">No cookies found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};