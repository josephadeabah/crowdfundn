import { CheckCircle2 } from 'lucide-react';
import { Deal } from '../services/dealRoomApi';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface OverviewTabProps {
  deal: Deal;
}

export function OverviewTab({ deal }: OverviewTabProps) {
  return (
    <>
      {/* Description */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">
          About {deal.companyName}
        </h3>
        <div
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: deal.description,
          }}
        />
      </div>

      {/* Highlights */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">
          Investment Highlights
        </h3>
        <ul className="space-y-2">
          {deal.highlights?.map((highlight, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-gray-700">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Metrics */}
      {deal.metrics && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Key Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deal.metrics.revenue !== undefined && (
              <div className="bg-gray-50 p-3 text-center rounded-lg">
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(deal.metrics.revenue)}
                </p>
                <p className="text-xs text-gray-600">Annual Revenue</p>
              </div>
            )}
            {deal.metrics.growth !== undefined && (
              <div className="bg-gray-50 p-3 text-center rounded-lg">
                <p className="text-lg font-bold text-emerald-600">
                  +{deal.metrics.growth}%
                </p>
                <p className="text-xs text-gray-600">YoY Growth</p>
              </div>
            )}
            {deal.metrics.users !== undefined && (
              <div className="bg-gray-50 p-3 text-center rounded-lg">
                <p className="text-lg font-bold text-gray-900">
                  {formatNumber(deal.metrics.users)}
                </p>
                <p className="text-xs text-gray-600">Active Users</p>
              </div>
            )}
            {deal.metrics.mrr !== undefined && (
              <div className="bg-gray-50 p-3 text-center rounded-lg">
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(deal.metrics.mrr)}
                </p>
                <p className="text-xs text-gray-600">Monthly Revenue</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
