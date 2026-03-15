import { useParams, useNavigate } from "react-router";
import { 
  ArrowLeft, 
  ExternalLink, 
  Trash2, 
  TrendingDown,
  TrendingUp,
  Clock,
  Bell,
  BellOff,
  RefreshCw
} from "lucide-react";

// Mock price history data
const mockPriceHistory = [
  { date: "Mar 7, 2026", price: 249.99, change: 0 },
  { date: "Mar 6, 2026", price: 249.99, change: 0 },
  { date: "Mar 5, 2026", price: 269.99, change: 20.00 },
  { date: "Mar 4, 2026", price: 269.99, change: 0 },
  { date: "Mar 3, 2026", price: 259.99, change: -10.00 },
  { date: "Mar 2, 2026", price: 259.99, change: 0 },
  { date: "Mar 1, 2026", price: 279.99, change: 20.00 },
  { date: "Feb 28, 2026", price: 269.99, change: -10.00 },
];

const mockItem = {
  id: "1",
  title: "Apple AirPods Pro (2nd Generation) Wireless Earbuds with MagSafe",
  site: "Amazon",
  url: "https://www.amazon.com/example-product",
  currentPrice: 249.99,
  currency: "$",
  priceChange: -20.00,
  changeType: "down" as const,
  lastChecked: "5 minutes ago",
  trackingFrequency: "6h",
  alertEnabled: true,
  alertThreshold: 240.00,
  imageUrl: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600",
};

const siteColors: Record<string, { bg: string; text: string }> = {
  Amazon: { bg: '#fef3e8', text: '#c97d32' },
  eBay: { bg: '#fef9e8', text: '#c9a832' },
  AliExpress: { bg: '#fee8e8', text: '#c93232' },
  Taobao: { bg: '#fef0e8', text: '#c96332' },
  "1688": { bg: '#fef5e8', text: '#c99532' },
};

export function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const item = mockItem;
  const siteStyle = siteColors[item.site] || { bg: '#f7f6f3', text: '#6b6b65' };

  const handleDelete = () => {
    if (confirm("Are you sure you want to stop tracking this item?")) {
      // In a real app, this would make an API call
      navigate("/tracked-items");
    }
  };

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="bg-white px-10 py-8 sticky top-0 z-10" style={{ borderBottom: '1px solid rgba(45, 45, 42, 0.06)' }}>
        <button
          onClick={() => navigate("/tracked-items")}
          className="flex items-center gap-2 mb-6 transition-colors rounded-lg px-2 py-1 -ml-2"
          style={{ color: '#6b6b65' }}
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2} />
          <span className="text-sm font-medium">Back to Tracked Items</span>
        </button>
        
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold" style={{ color: '#1a1a17', letterSpacing: '-0.01em' }}>
                {item.title}
              </h1>
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-medium flex-shrink-0"
                style={{ backgroundColor: siteStyle.bg, color: siteStyle.text }}
              >
                {item.site}
              </span>
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm inline-flex items-center gap-1.5 transition-colors"
              style={{ color: '#5aad9c' }}
            >
              View on {item.site}
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
            </a>
          </div>
          
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:shadow-sm"
            style={{ color: '#d4183d', backgroundColor: '#fee8e8' }}
          >
            <Trash2 className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm font-medium">Delete</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-10 max-w-6xl">
        {/* Product Image & Current Price */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          {/* Image */}
          <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: '1px solid rgba(45, 45, 42, 0.06)' }}>
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full rounded-xl"
            />
          </div>

          {/* Price Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: '1px solid rgba(45, 45, 42, 0.06)' }}>
              <div className="text-sm mb-2" style={{ color: '#6b6b65' }}>Current price</div>
              <div className="text-5xl font-semibold mb-4" style={{ color: '#1a1a17', letterSpacing: '-0.02em' }}>
                {item.currency}{item.currentPrice.toFixed(2)}
              </div>
              {item.changeType !== "same" && (
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                  style={{
                    backgroundColor: item.changeType === "down" ? '#e8f2f0' : '#fee8e8',
                    color: item.changeType === "down" ? '#5aad9c' : '#d4183d',
                  }}
                >
                  {item.changeType === "down" ? (
                    <TrendingDown className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    <TrendingUp className="w-4 h-4" strokeWidth={2} />
                  )}
                  <span>
                    {item.currency}{Math.abs(item.priceChange).toFixed(2)} from last check
                  </span>
                </div>
              )}
            </div>

            {/* Tracking Settings */}
            <div className="bg-white rounded-2xl p-8 space-y-5 shadow-sm" style={{ border: '1px solid rgba(45, 45, 42, 0.06)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-sm" style={{ color: '#6b6b65' }}>
                  <Clock className="w-4 h-4" strokeWidth={2} />
                  <span>Last checked</span>
                </div>
                <span className="text-sm font-medium" style={{ color: '#1a1a17' }}>
                  {item.lastChecked}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-sm" style={{ color: '#6b6b65' }}>
                  <RefreshCw className="w-4 h-4" strokeWidth={2} />
                  <span>Check frequency</span>
                </div>
                <span className="text-sm font-medium" style={{ color: '#1a1a17' }}>
                  Every {item.trackingFrequency}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-sm" style={{ color: '#6b6b65' }}>
                  {item.alertEnabled ? (
                    <Bell className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    <BellOff className="w-4 h-4" strokeWidth={2} />
                  )}
                  <span>Price alert</span>
                </div>
                <span className="text-sm font-medium" style={{ color: '#1a1a17' }}>
                  {item.alertEnabled
                    ? `Below ${item.currency}${item.alertThreshold?.toFixed(2)}`
                    : "Off"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Price History */}
        <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: '1px solid rgba(45, 45, 42, 0.06)' }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: '#1a1a17', letterSpacing: '-0.01em' }}>
            Price history
          </h2>

          {/* Placeholder for graph */}
          <div className="h-72 rounded-xl flex items-center justify-center mb-8" style={{ backgroundColor: '#f7f6f3', border: '1px solid rgba(45, 45, 42, 0.06)' }}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#e8f2f0' }}>
                <TrendingDown className="w-7 h-7" style={{ color: '#5aad9c' }} strokeWidth={2} />
              </div>
              <p className="text-sm" style={{ color: '#6b6b65' }}>
                Price chart visualization coming soon
              </p>
            </div>
          </div>

          {/* Price History List */}
          <div className="space-y-1">
            {mockPriceHistory.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-4 rounded-xl px-4 -mx-4"
                style={{ borderBottom: index < mockPriceHistory.length - 1 ? '1px solid rgba(45, 45, 42, 0.04)' : 'none' }}
              >
                <span className="text-sm" style={{ color: '#6b6b65' }}>{entry.date}</span>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium" style={{ color: '#1a1a17' }}>
                    {item.currency}{entry.price.toFixed(2)}
                  </span>
                  {entry.change !== 0 && (
                    <span
                      className="text-sm font-medium min-w-[80px] text-right"
                      style={{ color: entry.change < 0 ? '#5aad9c' : '#d4183d' }}
                    >
                      {entry.change > 0 ? "+" : ""}
                      {item.currency}{entry.change.toFixed(2)}
                    </span>
                  )}
                  {entry.change === 0 && (
                    <span className="text-sm min-w-[80px] text-right" style={{ color: '#6b6b65' }}>No change</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
