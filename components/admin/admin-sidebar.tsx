"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavigationItem = {
  name: string;
  href: string;
  icon?: any;
  indent?: boolean;
};

const navigation: NavigationItem[] = [
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b-4 border-brutal-black px-6 bg-brutal-purple">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-brutal-orange border-2 border-brutal-black flex items-center justify-center shadow-[2px_2px_0px_hsl(var(--brutal-black))]">
            <span className="text-brutal-black font-black text-sm">BS</span>
          </div>
          <span className="font-black uppercase text-brutal-white">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-black uppercase transition-transform border-2 border-brutal-black shadow-[2px_2px_0px_hsl(var(--brutal-black))]",
                isActive
                  ? "bg-brutal-orange text-brutal-black"
                  : "bg-brutal-white text-brutal-black hover:bg-brutal-cyan hover:translate-x-0.5 hover:translate-y-0.5",
                item.indent && "ml-4 text-xs"
              )}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t-4 border-brutal-black p-4 bg-brutal-purple">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-black uppercase text-brutal-white hover:text-brutal-orange transition-colors"
        >
          ← Back to App
        </Link>
      </div>
    </div>
  );
}
