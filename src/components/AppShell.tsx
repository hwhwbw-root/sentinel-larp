"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  History,
  HardDrive,
  Users,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/lib/rbac";
import { logoutAction } from "@/lib/actions/auth";

interface AppShellProps {
  user: { name: string; role: UserRole };
  children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-zinc-900/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-50
        bg-white border-r border-zinc-200/60
        transition-all duration-300 flex flex-col
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        ${sidebarOpen ? "w-64" : "w-20"}
        ${mobileMenuOpen ? "!w-64" : ""}
      `}
      >
        <div className="h-16 flex items-center px-4 border-b border-zinc-200/60 justify-between">
          <Link
            href="/dashboard"
            className={`font-bold text-xl tracking-wider flex items-center gap-2 ${!sidebarOpen && "md:justify-center md:items-center"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/branding/sentinel-logo.svg"
              alt="Sentinel Logo"
              className="w-10 h-10 object-contain"
            />
            {(sidebarOpen || mobileMenuOpen) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/branding/sentinel-typo.svg"
                alt="Sentinel"
                className="w-auto h-9 object-contain ml-2"
              />
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-zinc-400 hover:text-zinc-900 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <NavItem
            to="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Overview"
            active={pathname === "/dashboard"}
            collapsed={!sidebarOpen && !mobileMenuOpen}
            onClick={() => setMobileMenuOpen(false)}
          />
          <NavItem
            to="/analytics"
            icon={<History size={20} />}
            label="Data History"
            active={pathname === "/analytics"}
            collapsed={!sidebarOpen && !mobileMenuOpen}
            onClick={() => setMobileMenuOpen(false)}
          />
          <NavItem
            to="/devices"
            icon={<HardDrive size={20} />}
            label="Device Management"
            active={pathname === "/devices"}
            collapsed={!sidebarOpen && !mobileMenuOpen}
            onClick={() => setMobileMenuOpen(false)}
          />
          {user.role === "Superadmin" && (
            <NavItem
              to="/users"
              icon={<Users size={20} />}
              label="User Access"
              active={pathname === "/users"}
              collapsed={!sidebarOpen && !mobileMenuOpen}
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </nav>

        <div className="hidden md:block p-4 border-t border-zinc-200/60">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <header className="h-16 bg-white/70 backdrop-blur-md border-b border-zinc-200/60 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-zinc-400 hover:text-zinc-900"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-zinc-800">{user.name}</p>
              <p className="text-xs text-zinc-500">{user.role}</p>
            </div>
            <div className="w-8 h-8 md:w-9 md:h-9 bg-zinc-100 rounded-full flex items-center justify-center overflow-hidden border border-zinc-200">
              <UserIcon size={20} className="text-zinc-500" />
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  collapsed,
  to,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  to: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={to}
      onClick={onClick}
      className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
            ${
              active
                ? "bg-accent/5 text-accent"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            }
            ${collapsed ? "justify-center" : ""}
        `}
    >
      {active && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-accent" />
      )}
      <span
        className={`${active ? "text-accent" : "group-hover:text-accent transition-colors"} shrink-0`}
      >
        {icon}
      </span>
      {!collapsed && (
        <span className="text-sm font-medium whitespace-nowrap">{label}</span>
      )}
    </Link>
  );
}
