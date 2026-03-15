import { useState } from "react";
import { Plus, Chrome } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { ItemCard } from "./ItemCard";
import { AddItemModal } from "./AddItemModal";
import type { AddItemData } from "./AddItemModal";

// Mock data
const mockItems = [
  {
    id: "1",
    title: "Apple AirPods Pro (2nd Generation) Wireless Earbuds with MagSafe",
    site: "Amazon",
    currentPrice: 249.99,
    currency: "$",
    priceChange: -20.00,
    changeType: "down" as const,
    lastChecked: "5 min ago",
    trackingFrequency: "6h",
    alertEnabled: true,
    imageUrl: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400",
  },
  {
    id: "2",
    title: "无线蓝牙耳机 降噪运动耳机 苹果华为通用 长续航",
    site: "Taobao",
    currentPrice: 89.90,
    currency: "¥",
    priceChange: 0,
    changeType: "same" as const,
    lastChecked: "1 hour ago",
    trackingFrequency: "24h",
    alertEnabled: false,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
  },
  {
    id: "3",
    title: "Samsung Galaxy S24 Ultra 256GB Titanium Gray - Unlocked",
    site: "eBay",
    currentPrice: 1099.99,
    currency: "$",
    priceChange: 50.00,
    changeType: "up" as const,
    lastChecked: "2 hours ago",
    trackingFrequency: "6h",
    alertEnabled: true,
    imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
  },
  {
    id: "4",
    title: "Mechanical Gaming Keyboard RGB Backlit 87 Keys Hot Swappable",
    site: "AliExpress",
    currentPrice: 45.99,
    currency: "$",
    priceChange: -5.00,
    changeType: "down" as const,
    lastChecked: "3 hours ago",
    trackingFrequency: "24h",
    alertEnabled: true,
    imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400",
  },
  {
    id: "5",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black",
    site: "Amazon",
    currentPrice: 379.99,
    currency: "$",
    priceChange: -20.00,
    changeType: "down" as const,
    lastChecked: "4 hours ago",
    trackingFrequency: "6h",
    alertEnabled: true,
    imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
  },
  {
    id: "6",
    title: "工业电动工具套装 充电式冲击钻 家用多功能电钻",
    site: "1688",
    currentPrice: 156.00,
    currency: "¥",
    priceChange: -12.00,
    changeType: "down" as const,
    lastChecked: "6 hours ago",
    trackingFrequency: "24h",
    alertEnabled: false,
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400",
  },
  {
    id: "7",
    title: "Logitech MX Master 3S Wireless Performance Mouse - Graphite",
    site: "Amazon",
    currentPrice: 99.99,
    currency: "$",
    priceChange: 0,
    changeType: "same" as const,
    lastChecked: "12 hours ago",
    trackingFrequency: "24h",
    alertEnabled: true,
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
  },
];

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState(mockItems);

  const handleAddItem = (data: AddItemData) => {
    console.log("Adding item:", data);
    // In a real app, this would make an API call
  };

  const hasItems = items.length > 0;

  return (
    <div className="h-full">
      {/* Header */}
      <div className="bg-white px-10 py-8 sticky top-0 z-10" style={{ borderBottom: '1px solid rgba(45, 45, 42, 0.06)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-1" style={{ color: '#1a1a17', letterSpacing: '-0.02em' }}>
              Tracked Items
            </h1>
            <p className="text-base" style={{ color: '#6b6b65' }}>
              Monitor price changes for your tracked items
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium transition-all hover:shadow-md"
            style={{ backgroundColor: '#2d2d2a', color: '#ffffff' }}
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
            Add item
          </button>
        </div>
      </div>

      {/* Content */}
      {!hasItems ? (
        <EmptyState onAddItem={() => setIsModalOpen(true)} />
      ) : (
        <div className="p-10 max-w-[1400px]">
          {/* Chrome Extension Banner */}
          <div className="mb-8 p-6 rounded-2xl flex items-center justify-between shadow-sm" style={{ background: 'linear-gradient(135deg, #e8f2f0 0%, #f0f9f7 100%)', border: '1px solid rgba(90, 173, 156, 0.15)' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Chrome className="w-6 h-6" style={{ color: '#5aad9c' }} strokeWidth={2} />
              </div>
              <div>
                <p className="font-medium mb-0.5" style={{ color: '#1a1a17' }}>
                  Use Chrome extension to add items faster
                </p>
                <p className="text-sm" style={{ color: '#6b6b65' }}>
                  Track products while browsing any supported site
                </p>
              </div>
            </div>
            <button className="px-5 py-2.5 bg-white rounded-xl text-sm font-medium transition-all hover:shadow-md" style={{ color: '#2d2d2a', border: '1px solid rgba(45, 45, 42, 0.06)' }}>
              Install extension
            </button>
          </div>

          {/* Items Grid */}
          <div className="space-y-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}
