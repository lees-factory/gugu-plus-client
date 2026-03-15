import { TrendingDown, Users, Clock } from "lucide-react";
import { Link } from "react-router";

// Mock data for personalized picks
const personalizedPicks = [
  {
    id: "p1",
    name: "Keychron K2 Wireless Mechanical Keyboard",
    site: "Amazon",
    price: 89.99,
    currency: "$",
    priceChange7d: -5.00,
    imageUrl: "https://images.unsplash.com/photo-1656711081969-9d16ebc2d210?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmQlMjBnYW1pbmd8ZW58MXx8fHwxNzcyNzY0MDE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    interest: "Mechanical Keyboards",
  },
  {
    id: "p2",
    name: "Nike Air Max 270 Running Shoes",
    site: "eBay",
    price: 129.99,
    currency: "$",
    priceChange7d: 0,
    imageUrl: "https://images.unsplash.com/photo-1739132268718-53d64165d29a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMGF0aGxldGljJTIwc2hvZXN8ZW58MXx8fHwxNzcyNzkyNzA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    interest: "Sneakers",
  },
  {
    id: "p3",
    name: "Apple AirPods Pro (2nd Generation)",
    site: "Amazon",
    price: 249.99,
    currency: "$",
    priceChange7d: -20.00,
    imageUrl: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMGFpcnBvZHMlMjBwcm98ZW58MXx8fHwxNzcyODA2NjQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    interest: "Apple Accessories",
  },
  {
    id: "p4",
    name: "Sony WH-1000XM5 Wireless Headphones",
    site: "Amazon",
    price: 379.99,
    currency: "$",
    priceChange7d: -20.00,
    imageUrl: "https://images.unsplash.com/photo-1615433366992-1586f3b8fca5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBub2lzZSUyMGNhbmNlbGxpbmd8ZW58MXx8fHwxNzcyODUzMzUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    interest: "Headphones",
  },
];

// Mock data for trending price drops
const trendingDrops = [
  {
    id: "t1",
    name: "Apple MacBook Pro 14-inch M3",
    currentPrice: 1599.00,
    previousPrice: 1999.00,
    dropPercentage: 20,
    currency: "$",
    imageUrl: "https://images.unsplash.com/photo-1675668409245-955188b96bf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2t8ZW58MXx8fHwxNzcyODExNDU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "t2",
    name: "Apple Watch Series 9 GPS 45mm",
    currentPrice: 359.00,
    previousPrice: 429.00,
    dropPercentage: 16,
    currency: "$",
    imageUrl: "https://images.unsplash.com/photo-1665860455418-017fa50d29bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNoJTIwZml0bmVzcyUyMHRyYWNrZXJ8ZW58MXx8fHwxNzcyNzYxMjg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "t3",
    name: "Sony Alpha a7 IV Mirrorless Camera",
    currentPrice: 2298.00,
    previousPrice: 2498.00,
    dropPercentage: 8,
    currency: "$",
    imageUrl: "https://images.unsplash.com/photo-1729655669048-a667a0b01148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzI4NDUyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

// Mock data for most tracked items
const mostTracked = [
  {
    id: "m1",
    name: "Apple AirPods Pro (2nd Generation)",
    price: 249.99,
    currency: "$",
    trackingCount: 1247,
    imageUrl: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMGFpcnBvZHMlMjBwcm98ZW58MXx8fHwxNzcyODA2NjQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "m2",
    name: "Logitech MX Master 3S Wireless Mouse",
    price: 99.99,
    currency: "$",
    trackingCount: 892,
    imageUrl: "https://images.unsplash.com/photo-1616296425622-4560a2ad83de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb3VzZSUyMHJnYnxlbnwxfHx8fDE3NzI4NTMzNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "m3",
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 379.99,
    currency: "$",
    trackingCount: 756,
    imageUrl: "https://images.unsplash.com/photo-1615433366992-1586f3b8fca5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBub2lzZSUyMGNhbmNlbGxpbmd8ZW58MXx8fHwxNzcyODUzMzUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "m4",
    name: "Keychron K2 Wireless Mechanical Keyboard",
    price: 89.99,
    currency: "$",
    trackingCount: 634,
    imageUrl: "https://images.unsplash.com/photo-1656711081969-9d16ebc2d210?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmQlMjBnYW1pbmd8ZW58MXx8fHwxNzcyNzY0MDE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const siteColors: Record<string, { bg: string; text: string }> = {
  Amazon: { bg: '#fef3e8', text: '#c97d32' },
  eBay: { bg: '#fef9e8', text: '#c9a832' },
  AliExpress: { bg: '#fee8e8', text: '#c93232' },
  Taobao: { bg: '#fef0e8', text: '#c96332' },
};

export function Home() {
  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="bg-white px-10 py-8 sticky top-0 z-10" style={{ borderBottom: '1px solid rgba(45, 45, 42, 0.06)' }}>
        <div>
          <h1 className="text-3xl font-semibold mb-1" style={{ color: '#1a1a17', letterSpacing: '-0.02em' }}>
            Home
          </h1>
          <p className="text-base" style={{ color: '#6b6b65' }}>
            Discover trending prices and personalized picks
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-10 space-y-12 max-w-[1400px]">
        {/* Your Tracking Summary */}
        <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: '1px solid rgba(45, 45, 42, 0.06)' }}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-3" style={{ color: '#1a1a17', letterSpacing: '-0.01em' }}>
                Your Tracking Summary
              </h2>
              <p className="mb-5 text-base" style={{ color: '#1a1a17' }}>
                You are tracking <span className="font-semibold">3 items</span>.
              </p>
              <div className="flex items-center gap-8 text-sm" style={{ color: '#6b6b65' }}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" strokeWidth={2} />
                  <span>Last update: <span className="font-medium" style={{ color: '#1a1a17' }}>today</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" style={{ color: '#5aad9c' }} strokeWidth={2} />
                  <span><span className="font-medium" style={{ color: '#1a1a17' }}>2</span> price drops detected this week</span>
                </div>
              </div>
            </div>
            <Link
              to="/tracked-items"
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-md"
              style={{ backgroundColor: '#2d2d2a', color: '#ffffff' }}
            >
              View all items
            </Link>
          </div>
        </div>

        {/* Personalized Picks */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1.5" style={{ color: '#1a1a17', letterSpacing: '-0.01em' }}>
              Personalized Picks
            </h2>
            <p className="text-sm" style={{ color: '#6b6b65' }}>Based on your interests</p>
          </div>
          
          <div className="grid grid-cols-4 gap-5">
            {personalizedPicks.map((item) => {
              const siteStyle = siteColors[item.site] || { bg: '#f7f6f3', text: '#6b6b65' };
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 transition-all hover:shadow-lg cursor-pointer"
                  style={{ border: '1px solid rgba(45, 45, 42, 0.06)' }}
                >
                  <div className="aspect-square rounded-xl mb-4 overflow-hidden" style={{ backgroundColor: '#f7f6f3' }}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <span
                      className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: siteStyle.bg, color: siteStyle.text }}
                    >
                      {item.site}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-medium mb-3 line-clamp-2" style={{ color: '#1a1a17', lineHeight: '1.5' }}>
                    {item.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold" style={{ color: '#1a1a17' }}>
                      {item.currency}{item.price.toFixed(2)}
                    </span>
                    {item.priceChange7d !== 0 && (
                      <span
                        className="text-xs font-medium"
                        style={{ color: item.priceChange7d < 0 ? '#5aad9c' : '#d4183d' }}
                      >
                        {item.priceChange7d > 0 ? "+" : ""}{item.currency}{item.priceChange7d.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#6b6b65' }}>7-day change</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trending Price Drops */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1.5" style={{ color: '#1a1a17', letterSpacing: '-0.01em' }}>
              Trending Price Drops
            </h2>
            <p className="text-sm" style={{ color: '#6b6b65' }}>Biggest recent price drops across all sites</p>
          </div>
          
          <div className="grid grid-cols-3 gap-5">
            {trendingDrops.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 transition-all hover:shadow-lg cursor-pointer"
                style={{ border: '1px solid rgba(45, 45, 42, 0.06)' }}
              >
                <div className="aspect-video rounded-xl mb-4 overflow-hidden" style={{ backgroundColor: '#f7f6f3' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="text-sm font-medium mb-4 line-clamp-2" style={{ color: '#1a1a17', lineHeight: '1.5' }}>
                  {item.name}
                </h3>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-semibold" style={{ color: '#1a1a17' }}>
                    {item.currency}{item.currentPrice.toFixed(2)}
                  </span>
                  <div className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#e8f2f0' }}>
                    <span className="text-sm font-semibold" style={{ color: '#5aad9c' }}>
                      -{item.dropPercentage}%
                    </span>
                  </div>
                </div>
                
                <div className="text-xs" style={{ color: '#6b6b65' }}>
                  Was <span className="line-through">{item.currency}{item.previousPrice.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Tracked Items */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1.5" style={{ color: '#1a1a17', letterSpacing: '-0.01em' }}>
              Most Tracked Items
            </h2>
            <p className="text-sm" style={{ color: '#6b6b65' }}>Popular products tracked by the community</p>
          </div>
          
          <div className="grid grid-cols-4 gap-5">
            {mostTracked.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 transition-all hover:shadow-lg cursor-pointer"
                style={{ border: '1px solid rgba(45, 45, 42, 0.06)' }}
              >
                <div className="aspect-square rounded-xl mb-4 overflow-hidden" style={{ backgroundColor: '#f7f6f3' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="text-sm font-medium mb-3 line-clamp-2" style={{ color: '#1a1a17', lineHeight: '1.5' }}>
                  {item.name}
                </h3>
                
                <div className="mb-2">
                  <span className="text-xl font-semibold" style={{ color: '#1a1a17' }}>
                    {item.currency}{item.price.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs" style={{ color: '#6b6b65' }}>
                  <Users className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>{item.trackingCount.toLocaleString()} tracking</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
