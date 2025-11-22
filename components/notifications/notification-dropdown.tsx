"use client";

import { useState, useEffect } from "react";
import { Bell, Check, X, Settings, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSupabase } from "@/components/providers/supabase-provider";
import { NotificationItem } from "./notification-item";
import { NotificationPermissionBanner } from "./notification-permission-banner";
import { useNotifications } from "@/hooks/use-notifications";
import type { NotificationWithRelations } from "@/lib/notifications/types";

interface NotificationDropdownProps {
  className?: string;
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const { session } = useSupabase();
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    counts,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  } = useNotifications();

  const user = session?.user;
  const unreadCount = counts?.unread || 0;

  // Refresh notifications when dropdown opens
  useEffect(() => {
    if (isOpen && user) {
      refreshNotifications();
    }
  }, [isOpen, user, refreshNotifications]);

  if (!user) {
    return null;
  }

  const handleNotificationClick = async (notification: NotificationWithRelations) => {
    // Mark as read if unread
    if (!(notification as any).read_at) {
      await markAsRead((notification as any).id);
    }

    // Navigate based on notification type
    const url = getNotificationUrl(notification);
    if (url) {
      window.location.href = url;
    }

    setIsOpen(false);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (notificationId: string) => {
    await deleteNotification(notificationId);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`relative min-h-[44px] min-w-[44px] h-11 w-11 flex items-center justify-center border-2 md:border-4 border-brutal-black bg-brutal-pink text-brutal-black shadow-[2px_2px_0px_hsl(var(--brutal-black))] md:shadow-[4px_4px_0px_hsl(var(--brutal-black))] hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-brutal-purple hover:text-brutal-white transition-all ${className}`}
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">
            Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
          </span>
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 min-h-[20px] min-w-[20px] h-5 w-5 bg-brutal-orange text-brutal-black border-2 border-brutal-black flex items-center justify-center text-xs font-black shadow-[2px_2px_0px_hsl(var(--brutal-black))]">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-1rem)] max-w-md p-0 max-h-[min(500px,80dvh)] overflow-hidden"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllRead}
                  className="min-h-[36px] h-9 px-2 text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="min-h-[36px] min-w-[36px] h-9 w-9"
                asChild
              >
                <a href="/settings/notifications">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Notification settings</span>
                </a>
              </Button>
            </div>
          </div>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </DropdownMenuLabel>

        <NotificationPermissionBanner />

        <DropdownMenuSeparator />

        <div className="max-h-[350px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-destructive">
              Failed to load notifications
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You'll see notifications here when you receive messages, favorites, and more.
              </p>
            </div>
          ) : (
            <div className="py-2">
              {notifications.slice(0, 10).map((notification) => (
                <NotificationItem
                  key={(notification as any).id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                  onMarkRead={() => markAsRead((notification as any).id)}
                  onDelete={() => handleDeleteNotification((notification as any).id)}
                />
              ))}
              {notifications.length > 10 && (
                <div className="p-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a href="/notifications">
                      View all notifications
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getNotificationUrl(notification: NotificationWithRelations): string {
  const notif = notification as any;
  switch (notif.type) {
    case 'message':
      return notif.related_conversation_id
        ? `/messages?conversation=${notif.related_conversation_id}`
        : '/messages';
    case 'favorite':
      return '/favorites';
    case 'profile_view':
      return '/dashboard';
    case 'system_announcement':
      return '/dashboard';
    case 'connection':
      return '/connections';
    default:
      return '/notifications';
  }
}
