import {
  Home,
  Heart,
  History,
  BarChart3,
  Trophy,
  Bell,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import { useDashboard, DashboardPage } from "./DashboardContext";
import { useAuth } from "../context/AuthContext";

export default function DashboardSidebar() {
  const {
    page,
    setPage,
    sidebarOpen,
    setSidebarOpen,
  } = useDashboard();

  const { logout } = useAuth();

  const menu: {
    page: DashboardPage;
    label: string;
    icon: any;
  }[] = [
    {
      page: "overview",
      label: "Overview",
      icon: Home,
    },
    {
      page: "favorites",
      label: "Favorites",
      icon: Heart,
    },
    {
      page: "history",
      label: "Listening History",
      icon: History,
    },
    {
      page: "statistics",
      label: "Statistics",
      icon: BarChart3,
    },
    {
      page: "achievements",
      label: "Achievements",
      icon: Trophy,
    },
    {
      page: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      page: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky
          top-0 left-0
          z-50
          h-screen
          w-72
          bg-slate-900
          border-r border-white/10
          transform transition-transform duration-300

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">

          <div>

            <h2 className="text-lg font-bold text-white">
              Dashboard
            </h2>

            <p className="text-xs text-slate-400">
              Sermon Center
            </p>

          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6 text-white" />
          </button>

        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">

          {menu.map((item) => {

            const Icon = item.icon;

            const active = page === item.page;

            return (
              <button
                key={item.page}
                onClick={() => {
                  setPage(item.page);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  transition

                  ${
                    active
                      ? "bg-amber-500 text-black font-semibold shadow-lg"
                      : "text-slate-300 hover:bg-white/5"
                  }
                `}
              >
                <Icon className="w-5 h-5" />

                {item.label}
              </button>
            );

          })}

        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-4 right-4">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
          >
            <LogOut className="w-5 h-5" />

            Logout
          </button>

        </div>

      </aside>
    </>
  );
}