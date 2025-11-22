"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { EmojiPicker } from "./emoji-picker";
import { Plus, Smile } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ReactionUser } from "@/lib/messaging/reactions";

export interface MessageReaction {
  emoji: string;
  count: number;
  userReacted: boolean;
  userIds: string[];
  users?: ReactionUser[];
}

// Common quick reactions
const QUICK_REACTIONS = ["👍", "❤️", "😂"];

interface MessageReactionsProps {
  messageId: string;
  reactions: MessageReaction[];
  onAddReaction: (messageId: string, emoji: string) => Promise<void>;
  onRemoveReaction: (messageId: string, emoji: string) => Promise<void>;
  disabled?: boolean;
  className?: string;
  showQuickReactions?: boolean;
}

export function MessageReactions({
  messageId,
  reactions,
  onAddReaction,
  onRemoveReaction,
  disabled = false,
  className,
  showQuickReactions = true,
}: MessageReactionsProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleReactionClick = useCallback(
    async (emoji: string, userReacted: boolean) => {
      if (disabled || isAdding) return;

      setIsAdding(true);
      try {
        if (userReacted) {
          await onRemoveReaction(messageId, emoji);
        } else {
          await onAddReaction(messageId, emoji);
        }
      } finally {
        setIsAdding(false);
      }
    },
    [messageId, onAddReaction, onRemoveReaction, disabled, isAdding]
  );

  const handleEmojiSelect = useCallback(
    async (emoji: string) => {
      if (disabled || isAdding) return;

      setIsAdding(true);
      try {
        await onAddReaction(messageId, emoji);
      } finally {
        setIsAdding(false);
      }
    },
    [messageId, onAddReaction, disabled, isAdding]
  );

  const formatReactors = (reaction: MessageReaction): string => {
    if (!reaction.users || reaction.users.length === 0) {
      return `${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted`;
    }

    const names = reaction.users.map((u) => u.display_name || u.username);

    if (names.length === 1) {
      return names[0] || "Someone";
    } else if (names.length === 2) {
      return `${names[0] || "Someone"} and ${names[1] || "Someone"}`;
    } else if (names.length === 3) {
      return `${names[0] || "Someone"}, ${names[1] || "Someone"}, and ${names[2] || "Someone"}`;
    } else {
      return `${names[0] || "Someone"}, ${names[1] || "Someone"}, and ${names.length - 2} other${names.length - 2 === 1 ? "" : "s"}`;
    }
  };

  // Get quick reactions that haven't been added yet
  const availableQuickReactions = showQuickReactions && !disabled
    ? QUICK_REACTIONS.filter((emoji) => !reactions.some((r) => r.emoji === emoji))
    : [];

  if (reactions.length === 0 && disabled) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-1 flex-wrap", className)}>
      <TooltipProvider>
        {reactions.map((reaction) => (
          <Tooltip key={reaction.emoji}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => handleReactionClick(reaction.emoji, reaction.userReacted)}
                disabled={disabled || isAdding}
                className={cn(
                  "min-h-[44px] min-w-[44px] px-2 py-2 flex items-center gap-1 border-2 border-brutal-black transition-all active:scale-95",
                  reaction.userReacted
                    ? "bg-brutal-yellow hover:bg-yellow-200"
                    : "bg-white hover:bg-gray-50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                aria-label={`${reaction.userReacted ? "Remove" : "Add"} ${reaction.emoji} reaction`}
              >
                <span className="text-base leading-none">{reaction.emoji}</span>
                <span className="text-xs font-bold text-brutal-black">{reaction.count}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-brutal-black text-white border-2 border-brutal-black">
              <p className="text-sm">{formatReactors(reaction)}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {/* Quick reaction buttons */}
        {availableQuickReactions.length > 0 && (
          <div className="flex items-center gap-1">
            {availableQuickReactions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleEmojiSelect(emoji)}
                disabled={isAdding}
                className={cn(
                  "min-h-[44px] min-w-[44px] h-11 w-11 flex items-center justify-center border-2 border-brutal-black bg-white hover:bg-brutal-cyan transition-all active:scale-95",
                  isAdding && "opacity-50 cursor-not-allowed"
                )}
                aria-label={`Add ${emoji} reaction`}
              >
                <span className="text-base leading-none">{emoji}</span>
              </button>
            ))}
          </div>
        )}

        {/* Emoji picker for custom reactions */}
        {!disabled && (
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            className="inline-flex"
            buttonClassName={cn(
              "min-h-[44px] min-w-[44px] h-11 w-11 border-2 bg-white hover:bg-brutal-cyan",
              isAdding && "opacity-50 cursor-not-allowed"
            )}
          />
        )}
      </TooltipProvider>
    </div>
  );
}
