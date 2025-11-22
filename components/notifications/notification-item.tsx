"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  MessageCircle,
  Heart,
  Eye,
  Bell,
  AlertTriangle,
  MoreHorizontal,
  Check,
  X,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { NotificationWithRelations, NotificationType, NotificationPriority } from "@/lib/notifications/types";

interface NotificationItemProps {
  notification: NotificationWithRelations;
  onClick?: () => void;
  onMarkRead?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export function NotificationItem({
  notification,
  onClick,
  onMarkRead,
  onDelete,
  showActions = true,
}: NotificationItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isUnread = !(notification as any).read_at;

  const handleMarkRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkRead && isUnread) {
      setIsLoading(true);
      try {
        await onMarkRead();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      setIsLoading(true);
      try {
        await onDelete();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const notif = notification as any;
  const icon = getNotificationIcon(notif.type);
  const priorityColor = getPriorityColor(notif.priority);
  const relatedUser = notif.related_user;

  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-3 md:p-3 min-h-[60px] hover:bg-muted/50 cursor-pointer transition-colors border-l-2",
        isUnread ? "bg-muted/20 border-l-primary" : "border-l-transparent",
        isLoading && "opacity-50 pointer-events-none"
      )}
      onClick={onClick}
    >
      {/* Avatar or Icon */}
      <div className="flex-shrink-0">
        {relatedUser ? (
          <Avatar className="h-10 w-10">
            <AvatarImage src={relatedUser.avatar_url || undefined} />
            <AvatarFallback className="text-sm">
              {relatedUser.display_name?.[0] || relatedUser.username?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            priorityColor
          )}>
            {icon}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              "text-sm font-medium truncate",
              isUnread && "font-semibold"
            )}>
              {notif.title}
            </h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {notif.message}
            </p>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-1">
              {notif.priority === 'urgent' && (
                <Badge variant="destructive" className="text-xs px-1">
                  Urgent
                </Badge>
              )}
              {notif.priority === 'high' && (
                <Badge variant="secondary" className="text-xs px-1">
                  High
                </Badge>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="min-h-[36px] min-w-[36px] h-9 w-9 opacity-70 md:opacity-0 md:group-hover:opacity-100 hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isUnread && onMarkRead && (
                    <DropdownMenuItem onClick={handleMarkRead}>
                      <Check className="h-4 w-4 mr-2" />
                      Mark as read
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
          </span>
          {isUnread && (
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </div>
      </div>
    </div>
  );
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'message':
      return <MessageCircle className="h-5 w-5" />;
    case 'favorite':
      return <Heart className="h-5 w-5" />;
    case 'profile_view':
      return <Eye className="h-5 w-5" />;
    case 'system_announcement':
      return <AlertTriangle className="h-5 w-5" />;
    case 'reminder':
      return <Bell className="h-5 w-5" />;
    case 'connection':
      return <UserPlus className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
}

function getPriorityColor(priority: NotificationPriority): string {
  switch (priority) {
    case 'urgent':
      return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400";
    case 'high':
      return "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400";
    case 'normal':
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
    case 'low':
      return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400";
  }
}
