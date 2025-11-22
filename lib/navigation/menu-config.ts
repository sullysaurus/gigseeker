import {
  Users,
  User,
  Heart,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  color?: string;
  badge?: "favoritesCount" | "unreadMessages" | "unreadNotifications" | "pendingConnections";
  public?: boolean;
  adminOnly?: boolean;
}

export interface NavigationConfig {
  browse: NavItem[];
  myContent: NavItem[];
  quickAccess: NavItem[];
  more: NavItem[];
}

export const navigationConfig: NavigationConfig = {
  browse: [
    {
      label: "Drummers",
      href: "/drummers",
      icon: Users,
      description: "Search drummer profiles",
      color: "bg-brutal-cyan",
      public: true,
    },
  ],
  myContent: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Your overview",
      color: "bg-brutal-cyan",
    },
    {
      label: "My Profile",
      href: "/profile",
      icon: User,
      description: "Edit your profile",
      color: "bg-brutal-lime",
    },
  ],
  quickAccess: [
    {
      label: "Favorites",
      href: "/favorites",
      icon: Heart,
      color: "bg-brutal-pink",
      badge: "favoritesCount",
    },
  ],
  more: [],
};

/**
 * Get visible navigation items based on authentication status
 */
export function getVisibleNavItems(
  section: keyof NavigationConfig,
  isAuthenticated: boolean
): NavItem[] {
  const items = navigationConfig[section];

  if (section === "browse") {
    // Browse items are visible to everyone
    return items;
  }

  // All other sections require authentication
  return isAuthenticated ? items : [];
}

/**
 * Get navigation item by href
 */
export function getNavItem(href: string): NavItem | undefined {
  const allItems = [
    ...navigationConfig.browse,
    ...navigationConfig.myContent,
    ...navigationConfig.quickAccess,
    ...navigationConfig.more,
  ];

  return allItems.find((item) => item.href === href);
}

/**
 * Check if a path is active
 */
export function isNavItemActive(itemHref: string, currentPath: string): boolean {
  if (itemHref === "/") {
    return currentPath === "/";
  }
  return currentPath.startsWith(itemHref);
}
