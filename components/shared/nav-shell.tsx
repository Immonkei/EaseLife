"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  FolderKanban,
  CheckSquare,
  Repeat,
  Calendar,
  BookOpen,
  Settings,
  LogOut,
  Zap,
  Menu,
  X,
  Plus,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signout } from "@/actions/auth";
import { EaseLifeLogo } from "@/components/brand/logo";

const navItems = [
  { href: "/dashboard", label: "Daily Runway", icon: Zap },
  { href: "/goals", label: "Goals & Visions", icon: Compass },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/habits", label: "Habits", icon: Repeat },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/review/daily", label: "Review", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on auth routes, don't show shell
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password"
  ) {
    return <>{children}</>;
  }

  const currentRoute = navItems.find(
    (item) =>
      item.href === pathname ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href))
  );

  const todayStr = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Brand Header */}
        <div className="h-14 px-5 border-b border-slate-200/80 flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="group block"
          >
            <EaseLifeLogo size={28} showTagline={false} />
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                  isActive
                    ? "bg-slate-100/90 text-[#235789] font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive ? "text-[#235789]" : "text-slate-400"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-200/80 space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-3 py-1">
          <span className="font-medium">System Status</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A896]" />
            <span className="text-[10px] text-slate-400">Live</span>
          </span>
        </div>

        <form action={signout}>
          <button
            type="submit"
            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-500 hover:text-[#EE6352] hover:bg-red-50/50 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 border-r border-slate-200/80 bg-white flex-col shrink-0 fixed inset-y-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-2xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl border-r border-slate-200/80 transition-transform duration-200 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {navContent}
      </div>

      {/* Content wrapper with fixed top header */}
      <div className="flex-1 lg:pl-60 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 border-b border-slate-200/80 bg-white/90 backdrop-blur-xs sticky top-0 z-20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-semibold text-slate-900 tracking-tight">
              {currentRoute?.href === "/dashboard" ? "Daily Runway" : currentRoute?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-xs text-slate-500 font-medium tabular-nums hidden sm:block">
              {todayStr}
            </div>

            <button
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#235789] text-white text-xs font-semibold hover:bg-[#1b456e] transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Work</span>
            </Link>
          </div>
        </header>

        {/* Main Routed Content Area */}
        <main className="flex-1 min-w-0 p-5 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
