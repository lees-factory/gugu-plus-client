import { Outlet, Link, useLocation } from "react-router";
import { 
  Home,
  Package,
  Bell, 
  Settings,
  Sparkles 
} from "lucide-react";

export function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#fafaf8' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col" style={{ borderRight: '1px solid rgba(45, 45, 42, 0.06)' }}>
        {/* Logo */}
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5aad9c 0%, #4a9384 100%)' }}>
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="font-semibold text-lg" style={{ color: '#1a1a17' }}>Gugu Plus</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <Link
            to="/"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              isActive("/") && location.pathname === "/"
                ? "shadow-sm"
                : "hover:shadow-sm"
            }`}
            style={{
              backgroundColor: isActive("/") && location.pathname === "/" ? '#f7f6f3' : 'transparent',
              color: isActive("/") && location.pathname === "/" ? '#1a1a17' : '#6b6b65',
            }}
          >
            <Home className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm font-medium">Home</span>
          </Link>

          <Link
            to="/tracked-items"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              isActive("/tracked-items")
                ? "shadow-sm"
                : "hover:shadow-sm"
            }`}
            style={{
              backgroundColor: isActive("/tracked-items") ? '#f7f6f3' : 'transparent',
              color: isActive("/tracked-items") ? '#1a1a17' : '#6b6b65',
            }}
          >
            <Package className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm font-medium">Tracked Items</span>
          </Link>

          <Link
            to="/notifications"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              isActive("/notifications")
                ? "shadow-sm"
                : "hover:shadow-sm"
            }`}
            style={{
              backgroundColor: isActive("/notifications") ? '#f7f6f3' : 'transparent',
              color: isActive("/notifications") ? '#1a1a17' : '#6b6b65',
            }}
          >
            <Bell className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm font-medium">Notifications</span>
          </Link>

          <Link
            to="/settings"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              isActive("/settings")
                ? "shadow-sm"
                : "hover:shadow-sm"
            }`}
            style={{
              backgroundColor: isActive("/settings") ? '#f7f6f3' : 'transparent',
              color: isActive("/settings") ? '#1a1a17' : '#6b6b65',
            }}
          >
            <Settings className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </nav>

        {/* Usage Indicator */}
        <div className="p-5 space-y-4" style={{ borderTop: '1px solid rgba(45, 45, 42, 0.06)' }}>
          <div>
            <div className="flex items-center justify-between text-sm mb-2.5">
              <span style={{ color: '#6b6b65' }}>Items tracked</span>
              <span className="font-semibold" style={{ color: '#1a1a17' }}>7 / 10</span>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: '#f4f3ef' }}>
              <div className="h-2 rounded-full transition-all" style={{ width: "70%", background: 'linear-gradient(90deg, #5aad9c 0%, #4a9384 100%)' }}></div>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-md" style={{ backgroundColor: '#2d2d2a', color: '#ffffff' }}>
            Upgrade to Pro
          </button>
          <p className="text-xs text-center" style={{ color: '#6b6b65' }}>
            Track up to 100 items
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
