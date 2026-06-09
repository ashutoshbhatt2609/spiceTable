"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChefHat, LayoutDashboard, ReceiptText, Table2, Utensils,
  Boxes, Users, BarChart3, Settings, CreditCard, Calendar,
  LogOut, Menu, X
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard",    label: "Dashboard",   icon: LayoutDashboard },
  { href: "/tables",       label: "Tables",       icon: Table2 },
  { href: "/orders",       label: "Orders",       icon: ReceiptText },
  { href: "/kitchen",      label: "Kitchen",      icon: ChefHat },
  { href: "/menu",         label: "Menu",         icon: Utensils },
  { href: "/customers",    label: "Customers",    icon: Users },
  { href: "/reservations", label: "Reservations", icon: Calendar },
  { href: "/inventory",    label: "Inventory",    icon: Boxes },
  { href: "/billing",      label: "Billing",      icon: CreditCard },
  { href: "/reports",      label: "Reports",      icon: BarChart3 },
  { href: "/settings",     label: "Settings",     icon: Settings },
];

export function AppShell({ children, profile }: { children: React.ReactNode; profile: Profile }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  }

  const Sidebar = () => (
    <aside className="flex h-full flex-col bg-white border-r border-[hsl(var(--border))]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-[hsl(var(--border))] px-5 py-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))]">
          <ChefHat className="size-4 text-white" />
        </div>
        <span className="text-sm font-bold tracking-tight text-[hsl(var(--foreground))]">Spice Table</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          Navigation
        </p>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-100",
                active
                  ? "bg-[hsl(var(--primary)/0.08)] text-[hsl(var(--primary))] font-semibold"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
              )}
            >
              <item.icon className={cn("size-4 flex-shrink-0", active && "text-[hsl(var(--primary))]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-[hsl(var(--border))] p-3">
        <div className="flex items-center gap-3 rounded-md bg-[hsl(var(--muted))] px-3 py-2.5">
          <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.12)] text-xs font-bold text-[hsl(var(--primary))]">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[hsl(var(--foreground))]">{profile.name}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] capitalize">{profile.role}</p>
          </div>
          <button
            onClick={signOut}
            title="Sign out"
            className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--destructive)/0.08)] hover:text-[hsl(var(--destructive))] transition-colors"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[240px] animate-slide-left shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="flex flex-col min-h-screen bg-[hsl(var(--background))]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-[hsl(var(--border))] bg-white px-4">
          <button
            className="lg:hidden rounded-md p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <span className="hidden lg:block text-xs text-[hsl(var(--muted-foreground))]">
            Spice Table · Restaurant Management System
          </span>
          <span className="text-sm font-medium text-[hsl(var(--foreground))]">{profile.name}</span>
        </header>

        {/* Page */}
        <main className="flex-1 p-5 lg:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
