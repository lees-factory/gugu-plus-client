import { Link } from "react-router";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Clock, 
  Bell,
  BellOff
} from "lucide-react";

interface TrackedItem {
  id: string;
  title: string;
  site: string;
  currentPrice: number;
  currency: string;
  priceChange: number;
  changeType: "up" | "down" | "same";
  lastChecked: string;
  trackingFrequency: string;
  alertEnabled: boolean;
  imageUrl?: string;
}

interface ItemCardProps {
  item: TrackedItem;
}

const siteColors: Record<string, { bg: string; text: string }> = {
  Amazon: { bg: '#fef3e8', text: '#c97d32' },
  eBay: { bg: '#fef9e8', text: '#c9a832' },
  AliExpress: { bg: '#fee8e8', text: '#c93232' },
  Taobao: { bg: '#fef0e8', text: '#c96332' },
  "1688": { bg: '#fef5e8', text: '#c99532' },
};

export function ItemCard({ item }: ItemCardProps) {
  const siteStyle = siteColors[item.site] || { bg: '#f7f6f3', text: '#6b6b65' };

  return (
    <Link
      to={`/item/${item.id}`}
      className="block bg-white rounded-2xl p-6 transition-all hover:shadow-lg"
      style={{ border: '1px solid rgba(45, 45, 42, 0.06)' }}
    >
      <div className="flex gap-6">
        {/* Product Image */}
        {item.imageUrl && (
          <div className="w-28 h-28 rounded-xl flex-shrink-0 overflow-hidden" style={{ backgroundColor: '#f7f6f3' }}>
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Site Badge */}
          <div className="flex items-start gap-3 mb-3">
            <h3 className="text-base font-medium line-clamp-2 flex-1" style={{ color: '#1a1a17', lineHeight: '1.5' }}>
              {item.title}
            </h3>
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-medium flex-shrink-0"
              style={{ backgroundColor: siteStyle.bg, color: siteStyle.text }}
            >
              {item.site}
            </span>
          </div>

          {/* Price & Change */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-semibold" style={{ color: '#1a1a17' }}>
              {item.currency}{item.currentPrice.toFixed(2)}
            </span>
            {item.changeType !== "same" && (
              <div
                className="flex items-center gap-1.5 text-sm font-medium"
                style={{ color: item.changeType === "down" ? '#5aad9c' : '#d4183d' }}
              >
                {item.changeType === "down" ? (
                  <TrendingDown className="w-4 h-4" strokeWidth={2} />
                ) : (
                  <TrendingUp className="w-4 h-4" strokeWidth={2} />
                )}
                <span>
                  {item.currency}{Math.abs(item.priceChange).toFixed(2)}
                </span>
              </div>
            )}
            {item.changeType === "same" && (
              <div className="flex items-center gap-1.5 text-sm" style={{ color: '#6b6b65' }}>
                <Minus className="w-4 h-4" strokeWidth={2} />
                <span>No change</span>
              </div>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-sm" style={{ color: '#6b6b65' }}>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" strokeWidth={2} />
              <span>Checked {item.lastChecked}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>•</span>
              <span>Every {item.trackingFrequency}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {item.alertEnabled ? (
                <>
                  <Bell className="w-4 h-4" strokeWidth={2} />
                  <span>Alert on</span>
                </>
              ) : (
                <>
                  <BellOff className="w-4 h-4" strokeWidth={2} />
                  <span>Alert off</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
