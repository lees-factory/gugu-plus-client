import { X, Link as LinkIcon, Loader2 } from "lucide-react";
import { useState } from "react";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: AddItemData) => void;
}

export interface AddItemData {
  url: string;
  trackingFrequency: string;
  alertThreshold?: number;
}

export function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const [url, setUrl] = useState("");
  const [trackingFrequency, setTrackingFrequency] = useState("24h");
  const [alertThreshold, setAlertThreshold] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState<{
    title: string;
    site: string;
    price: number;
    currency: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleUrlChange = (value: string) => {
    setUrl(value);
    
    // Simulate detection when URL is pasted
    if (value.length > 20) {
      setIsDetecting(true);
      setTimeout(() => {
        setIsDetecting(false);
        // Mock detection
        if (value.includes("amazon")) {
          setDetectedInfo({
            title: "Apple AirPods Pro (2nd Generation) Wireless Earbuds",
            site: "Amazon",
            price: 249.99,
            currency: "$",
          });
        } else if (value.includes("taobao") || value.includes("1688")) {
          setDetectedInfo({
            title: "无线蓝牙耳机 降噪运动耳机 苹果华为通用",
            site: "Taobao",
            price: 89.90,
            currency: "¥",
          });
        } else {
          setDetectedInfo({
            title: "Wireless Bluetooth Earbuds with Noise Cancellation",
            site: "AliExpress",
            price: 45.99,
            currency: "$",
          });
        }
      }, 800);
    } else {
      setDetectedInfo(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      url,
      trackingFrequency,
      alertThreshold: alertThreshold ? parseFloat(alertThreshold) : undefined,
    });
    // Reset form
    setUrl("");
    setTrackingFrequency("24h");
    setAlertThreshold("");
    setDetectedInfo(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-8" style={{ borderBottom: '1px solid rgba(45, 45, 42, 0.06)' }}>
          <h2 className="text-xl font-semibold" style={{ color: '#1a1a17', letterSpacing: '-0.01em' }}>
            Add item to track
          </h2>
          <button
            onClick={onClose}
            className="transition-colors rounded-lg p-1"
            style={{ color: '#6b6b65' }}
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium mb-2.5" style={{ color: '#1a1a17' }}>
              Product URL
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#6b6b65' }} strokeWidth={2} />
              <input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.amazon.com/product/..."
                className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none transition-all"
                style={{
                  border: '1px solid rgba(45, 45, 42, 0.1)',
                  backgroundColor: '#ffffff',
                  color: '#1a1a17',
                }}
                required
              />
            </div>
            <p className="mt-2 text-xs" style={{ color: '#6b6b65' }}>
              Paste a link from Amazon, eBay, AliExpress, Taobao, 1688, or other supported sites
            </p>
          </div>

          {/* Detection Loading */}
          {isDetecting && (
            <div className="flex items-center gap-3 p-5 rounded-xl" style={{ backgroundColor: '#f7f6f3', border: '1px solid rgba(45, 45, 42, 0.06)' }}>
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#5aad9c' }} strokeWidth={2} />
              <span className="text-sm" style={{ color: '#6b6b65' }}>Detecting product info...</span>
            </div>
          )}

          {/* Detected Info */}
          {detectedInfo && !isDetecting && (
            <div className="p-5 rounded-xl" style={{ backgroundColor: '#e8f2f0', border: '1px solid rgba(90, 173, 156, 0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5aad9c' }}></div>
                <span className="text-sm font-medium" style={{ color: '#1a1a17' }}>Product detected</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium" style={{ color: '#1a1a17' }}>{detectedInfo.title}</p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="px-2.5 py-1 bg-white rounded-lg text-xs font-medium" style={{ color: '#6b6b65' }}>
                    {detectedInfo.site}
                  </span>
                  <span className="font-semibold" style={{ color: '#1a1a17' }}>
                    {detectedInfo.currency}{detectedInfo.price}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tracking Frequency */}
          <div>
            <label className="block text-sm font-medium mb-2.5" style={{ color: '#1a1a17' }}>
              Check frequency
            </label>
            <div className="grid grid-cols-5 gap-2.5">
              {[
                { value: "1h", label: "1 hour" },
                { value: "6h", label: "6 hours" },
                { value: "24h", label: "24 hours" },
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTrackingFrequency(option.value)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    backgroundColor: trackingFrequency === option.value ? '#2d2d2a' : '#f7f6f3',
                    color: trackingFrequency === option.value ? '#ffffff' : '#6b6b65',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Threshold (Optional) */}
          <div>
            <label className="block text-sm font-medium mb-2.5" style={{ color: '#1a1a17' }}>
              Alert threshold <span style={{ color: '#6b6b65', fontWeight: 'normal' }}>(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6b6b65' }}>
                {detectedInfo?.currency || "$"}
              </span>
              <input
                type="number"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none transition-all"
                style={{
                  border: '1px solid rgba(45, 45, 42, 0.1)',
                  backgroundColor: '#ffffff',
                  color: '#1a1a17',
                }}
              />
            </div>
            <p className="mt-2 text-xs" style={{ color: '#6b6b65' }}>
              Get notified when price drops below this amount
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-sm"
              style={{ border: '1px solid rgba(45, 45, 42, 0.1)', color: '#6b6b65', backgroundColor: '#ffffff' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!detectedInfo}
              className="flex-1 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#2d2d2a', color: '#ffffff' }}
            >
              Start tracking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
