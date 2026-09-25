"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Target,
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signout } from "@/actions/auth";

const navItems = [
  { href: "/dashboard", label: "Daily Runway", icon: Zap },
  { href: "/goals", label: "Goals & Visions", icon: Compass },
  { href: "/projects", label: "Projects & Pace", icon: FolderKanban },
  { href: "/tasks", label: "Tasks & Lineage", icon: CheckSquare },
  { href: "/habits", label: "Habits", icon: Repeat },
  { href: "/calendar", label: "Timeline", icon: Calendar },
  { href: "/review/daily", label: "Reflection", icon: BookOpen },
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
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
              e
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[var(--foreground)] block leading-none">
                EaseLife
              </span>
              <span className="text-[11px] text-[var(--foreground-muted)] font-medium leading-none">
                Visible Lineage OS
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150",
                  isActive
                    ? "bg-slate-100 text-[var(--primary)] font-bold shadow-2xs"
                    : "text-[var(--foreground-muted)] hover:bg-slate-50 hover:text-[var(--foreground)]"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive ? "text-[var(--primary)]" : "text-slate-400"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-[var(--border)] space-y-2">
        <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)] px-2">
          <span className="font-medium">Active Session</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <form action={signout}>
          <button
            type="submit"
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[var(--danger)] hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 border-r border-[var(--border)] bg-white flex-col shrink-0 fixed inset-y-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-2xl transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {navContent}
      </div>

      {/* Content wrapper with fixed top header */}
      <div className="flex-1 lg:pl-60 flex flex-col min-w-0">
        {/* Top Operational Header */}
        <header className="h-14 border-b border-[var(--border)] bg-white/90 backdrop-blur-xs sticky top-0 z-20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-[var(--foreground)] tracking-tight">
              {currentRoute?.label || "EaseLife"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs font-medium text-[var(--foreground-muted)] tabular-nums hidden sm:block">
              {todayStr}
            </div>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:bg-[var(--primary-hover)] transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </Link>
          </div>
        </header>

        {/* Main Routed Content Area */}
        <main className="flex-1 min-w-0 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
