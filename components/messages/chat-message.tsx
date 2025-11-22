import Image from 'next/image'

import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'
import { MessageReactions, type MessageReaction } from './message-reactions'

interface ChatMessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showHeader: boolean
  reactions?: MessageReaction[]
  onAddReaction?: (messageId: string, emoji: string) => Promise<void>
  onRemoveReaction?: (messageId: string, emoji: string) => Promise<void>
}

export const ChatMessageItem = ({
  message,
  isOwnMessage,
  showHeader,
  reactions = [],
  onAddReaction,
  onRemoveReaction,
}: ChatMessageItemProps) => {
  const timeLabel = (() => {
    try {
      const date = new Date(message.createdAt)
      if (Number.isNaN(date.getTime())) {
        return 'Just now'
      }
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    } catch (error) {
      return 'Just now'
    }
  })()

  const initials = message.user.name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'

  const avatar = message.avatarUrl ? (
    <Image
      src={message.avatarUrl}
      alt={message.user.name}
      width={32}
      height={32}
      className="h-8 w-8 rounded-full object-cover"
    />
  ) : (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase text-foreground/80">
      {initials}
    </div>
  )

  return (
    <div className={cn('flex w-full gap-3', isOwnMessage ? 'justify-end' : 'justify-start')}>
      {!isOwnMessage && (
        <div className="shrink-0">
          {avatar}
        </div>
      )}
      <div
        className={cn('flex max-w-[90%] sm:max-w-[80%] flex-col gap-2', {
          'items-end': isOwnMessage,
        })}
      >
        {showHeader && !isOwnMessage && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-sm font-semibold text-foreground">
              {message.user.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {timeLabel}
            </span>
          </div>
        )}
        <div
          className={cn(
            'w-fit rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
            isOwnMessage
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted/60 text-foreground rounded-bl-md border border-border/40'
          )}
        >
          {message.content}
        </div>
        {(reactions.length > 0 || (onAddReaction && onRemoveReaction)) && (
          <MessageReactions
            messageId={message.id}
            reactions={reactions}
            onAddReaction={onAddReaction || (async () => {})}
            onRemoveReaction={onRemoveReaction || (async () => {})}
            disabled={!onAddReaction || !onRemoveReaction}
            className="px-1"
          />
        )}
        {isOwnMessage && (
          <span className="text-xs text-muted-foreground px-1">
            {timeLabel}
          </span>
        )}
      </div>
      {isOwnMessage && (
        <div className="shrink-0">
          {avatar}
        </div>
      )}
    </div>
  )
}
