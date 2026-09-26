"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  CheckSquare,
  Settings,
  LogOut,
  Zap,
  Menu,
  X,
  RefreshCw,
  FolderKanban,
  Repeat,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signout } from "@/actions/auth";
import { EaseLifeLogo } from "@/components/brand/logo";

const primaryNavItems = [
  { href: "/dashboard", label: "Today", icon: Zap },
  { href: "/horizons", label: "Horizons", icon: Compass },
  { href: "/review", label: "Review", icon: RefreshCw },
];

const secondaryNavItems = [
  { href: "/tasks", label: "Actions", icon: CheckSquare },
  { href: "/habits", label: "Practices", icon: Repeat },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/goals", label: "Goals", icon: Compass },
];

export function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // If on auth routes, don't show shell
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password"
  ) {
    return <>{children}</>;
  }

  const allNav = [
    ...primaryNavItems,
    ...secondaryNavItems,
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/review/daily", label: "Daily Review", icon: RefreshCw },
  ];
  const currentRoute = allNav.find(
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
    <div className="flex flex-col h-full justify-between bg-white select-none">
      <div>
        {/* Brand Header */}
        <div className="h-14 px-5 border-b border-black/[0.05] flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="group block"
          >
            <EaseLifeLogo size={26} />
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary 3 Core Views */}
        <nav className="p-3 space-y-0.5">
          {primaryNavItems.map((item) => {
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
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all",
                  isActive
                    ? "bg-[#235789]/10 text-[#235789] font-semibold"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive ? "text-[#235789]" : "text-zinc-400"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Secondary Detailed Lists Accordion */}
        <div className="px-3 pt-3 border-t border-black/[0.04] mt-2">
          <button
            type="button"
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="w-full flex items-center justify-between text-[11px] font-medium text-zinc-400 hover:text-zinc-700 px-3 py-1.5 rounded-md hover:bg-zinc-50 transition-colors"
          >
            <span className="tracking-wide uppercase text-[10px]">Lists</span>
            <ChevronRight className={cn("w-3 h-3 transition-transform text-zinc-400", detailsOpen && "rotate-90")} />
          </button>

          {detailsOpen && (
            <div className="space-y-0.5 mt-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-colors",
                      isActive
                        ? "text-[#235789] font-medium bg-[#235789]/10"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", isActive ? "text-[#235789]" : "text-zinc-400")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Settings & Logout */}
      <div className="p-3 border-t border-black/[0.05] space-y-0.5">
        <Link
          href="/settings"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors",
            pathname === "/settings"
              ? "bg-zinc-100 text-zinc-900 font-semibold"
              : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-medium"
          )}
        >
          <Settings className="w-3.5 h-3.5 text-zinc-400" />
          <span>Settings</span>
        </Link>

        <form action={signout}>
          <button
            type="submit"
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-zinc-500 hover:text-[#EE6352] hover:bg-red-50/40 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-zinc-400" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex w-52 lg:w-56 border-r border-black/[0.06] bg-white flex-col shrink-0 fixed inset-y-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-2xs z-40 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-60 bg-white z-50 shadow-xl border-r border-black/[0.06] transition-transform duration-200 ease-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {navContent}
      </div>

      {/* Content wrapper with fixed top header */}
      <div className="flex-1 md:pl-52 lg:pl-56 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 border-b border-black/[0.05] bg-white/80 backdrop-blur-md sticky top-0 z-20 px-5 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-zinc-900 tracking-tight">
              {currentRoute?.label || "Today"}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-xs text-zinc-400 font-normal hidden sm:block">
              {todayStr}
            </div>
          </div>
        </header>

        {/* Main Routed Content Area */}
        <main className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
