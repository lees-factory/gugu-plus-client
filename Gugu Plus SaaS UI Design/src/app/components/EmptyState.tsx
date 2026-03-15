import { Plus, Chrome } from "lucide-react";

interface EmptyStateProps {
  onAddItem: () => void;
}

export function EmptyState({ onAddItem }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#f7f6f3' }}>
          <Plus className="w-10 h-10" style={{ color: '#6b6b65' }} strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-semibold mb-3" style={{ color: '#1a1a17', letterSpacing: '-0.01em' }}>
          Start tracking prices
        </h2>
        <p className="mb-8 text-base leading-relaxed" style={{ color: '#6b6b65' }}>
          Paste a product link from Amazon, eBay, AliExpress, Taobao, or any supported site to start monitoring price changes.
        </p>
        <button
          onClick={onAddItem}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium transition-all hover:shadow-md"
          style={{ backgroundColor: '#2d2d2a', color: '#ffffff' }}
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
          Add your first item
        </button>
        
        {/* Chrome Extension Hint */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(45, 45, 42, 0.06)' }}>
          <div className="flex items-center justify-center gap-2.5 text-sm" style={{ color: '#6b6b65' }}>
            <Chrome className="w-4 h-4" strokeWidth={2} />
            <span>Use Chrome extension to add items faster</span>
          </div>
        </div>
      </div>
    </div>
  );
}
