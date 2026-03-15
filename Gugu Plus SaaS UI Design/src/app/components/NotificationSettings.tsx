import { useState } from "react";
import { Mail, Bell, Smartphone } from "lucide-react";

export function NotificationSettings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [webPushAlerts, setWebPushAlerts] = useState(true);
  const [appPushAlerts, setAppPushAlerts] = useState(false);
  const [priceDrops, setPriceDrops] = useState(true);
  const [priceIncreases, setPriceIncreases] = useState(false);
  const [dailySummary, setDailySummary] = useState(true);

  const Toggle = ({ enabled, onChange, disabled = false }: { enabled: boolean; onChange: () => void; disabled?: boolean }) => (
    <button
      onClick={onChange}
      disabled={disabled}
      className="relative inline-flex h-7 w-12 items-center rounded-full transition-all"
      style={{
        backgroundColor: enabled ? '#5aad9c' : '#d4d3ce',
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <span
        className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm"
        style={{
          transform: enabled ? 'translateX(1.75rem)' : 'translateX(0.25rem)',
        }}
      />
    </button>
  );

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="bg-white px-10 py-8 sticky top-0 z-10" style={{ borderBottom: '1px solid rgba(45, 45, 42, 0.06)' }}>
        <div>
          <h1 className="text-3xl font-semibold mb-1" style={{ color: '#1a1a17', letterSpacing: '-0.02em' }}>
            Notification Settings
          </h1>
          <p className="text-base" style={{ color: '#6b6b65' }}>
            Manage how you receive price alerts and updates
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-10 max-w-3xl">
        {/* Notification Channels */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm" style={{ border: '1px solid rgba(45, 45, 42, 0.06)' }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: '#1a1a17', letterSpacing: '-0.01em' }}>
            Notification channels
          </h2>
          
          <div className="space-y-6">
            {/* Email Alerts */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#e8f2f0' }}>
                  <Mail className="w-6 h-6" style={{ color: '#5aad9c' }} strokeWidth={2} />
                </div>
                <div>
                  <div className="text-base font-medium mb-0.5" style={{ color: '#1a1a17' }}>Email alerts</div>
                  <div className="text-sm" style={{ color: '#6b6b65' }}>Receive notifications via email</div>
                </div>
              </div>
              <Toggle enabled={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
            </div>

            <div style={{ borderBottom: '1px solid rgba(45, 45, 42, 0.06)' }}></div>

            {/* Web Push Alerts */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#e8f2f0' }}>
                  <Bell className="w-6 h-6" style={{ color: '#5aad9c' }} strokeWidth={2} />
                </div>
                <div>
                  <div className="text-base font-medium mb-0.5" style={{ color: '#1a1a17' }}>Web push notifications</div>
                  <div className="text-sm" style={{ color: '#6b6b65' }}>Browser notifications on desktop</div>
                </div>
              </div>
              <Toggle enabled={webPushAlerts} onChange={() => setWebPushAlerts(!webPushAlerts)} />
            </div>

            <div style={{ borderBottom: '1px solid rgba(45, 45, 42, 0.06)' }}></div>

            {/* App Push Alerts */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f7f6f3' }}>
                  <Smartphone className="w-6 h-6" style={{ color: '#6b6b65' }} strokeWidth={2} />
                </div>
                <div>
                  <div className="text-base font-medium mb-0.5" style={{ color: '#1a1a17' }}>Mobile push notifications</div>
                  <div className="text-sm" style={{ color: '#6b6b65' }}>Coming soon with mobile app</div>
                </div>
              </div>
              <Toggle enabled={appPushAlerts} onChange={() => setAppPushAlerts(!appPushAlerts)} disabled />
            </div>
          </div>
        </div>

        {/* Alert Types */}
        <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: '1px solid rgba(45, 45, 42, 0.06)' }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: '#1a1a17', letterSpacing: '-0.01em' }}>
            Alert preferences
          </h2>
          
          <div className="space-y-6">
            {/* Price Drops */}
            <div className="flex items-center justify-between py-4">
              <div>
                <div className="text-base font-medium mb-0.5" style={{ color: '#1a1a17' }}>Price drops</div>
                <div className="text-sm" style={{ color: '#6b6b65' }}>Get notified when prices decrease</div>
              </div>
              <Toggle enabled={priceDrops} onChange={() => setPriceDrops(!priceDrops)} />
            </div>

            <div style={{ borderBottom: '1px solid rgba(45, 45, 42, 0.06)' }}></div>

            {/* Price Increases */}
            <div className="flex items-center justify-between py-4">
              <div>
                <div className="text-base font-medium mb-0.5" style={{ color: '#1a1a17' }}>Price increases</div>
                <div className="text-sm" style={{ color: '#6b6b65' }}>Get notified when prices go up</div>
              </div>
              <Toggle enabled={priceIncreases} onChange={() => setPriceIncreases(!priceIncreases)} />
            </div>

            <div style={{ borderBottom: '1px solid rgba(45, 45, 42, 0.06)' }}></div>

            {/* Daily Summary */}
            <div className="flex items-center justify-between py-4">
              <div>
                <div className="text-base font-medium mb-0.5" style={{ color: '#1a1a17' }}>Daily summary</div>
                <div className="text-sm" style={{ color: '#6b6b65' }}>Receive a daily digest of all changes</div>
              </div>
              <Toggle enabled={dailySummary} onChange={() => setDailySummary(!dailySummary)} />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 rounded-2xl" style={{ backgroundColor: '#e8f2f0', border: '1px solid rgba(90, 173, 156, 0.2)' }}>
          <p className="text-sm" style={{ color: '#1a1a17', lineHeight: '1.6' }}>
            💡 <strong>Tip:</strong> Configure alert thresholds for individual items to get notified only when prices drop below your target.
          </p>
        </div>
      </div>
    </div>
  );
}
