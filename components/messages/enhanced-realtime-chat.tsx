'use client'

import { useCallback, useEffect, useMemo, useOptimistic, useState, startTransition } from "react"
import { cn } from "@/lib/utils"
import { ChatMessageItem } from "@/components/messages/chat-message"
import { useChatScroll } from "@/hooks/use-chat-scroll"
import { Button } from "@/components/ui/button"
import { Send, Loader2, MessageCircle } from "lucide-react"
import { useSupabase } from "@/components/providers/supabase-provider"
import type { MessageWithProfile } from "@/lib/messaging/types"
import type { ChatMessage } from "@/hooks/use-realtime-chat"
import type { Json } from "@/types/supabase"
import type { RealtimePostgresInsertPayload } from "@supabase/realtime-js"
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/realtime-js"
import { toast } from "sonner"
import { EmojiPicker } from "./emoji-picker"
import { type MessageReaction } from "./message-reactions"
import { getMessagesReactions, addReaction, removeReaction } from "@/lib/messaging/reactions"

interface EnhancedRealtimeChatProps {
  conversationId: string
  currentUserId: string
  currentUserName: string
  initialMessages?: MessageWithProfile[]
  onNewMessage?: (message: MessageWithProfile) => void
}

/**
 * Enhanced realtime chat that integrates with our existing database-backed messaging
 * while providing real-time updates and optimistic UI
 */
export const EnhancedRealtimeChat = ({
  conversationId,
  currentUserId,
  currentUserName,
  initialMessages = [],
  onNewMessage,
}: EnhancedRealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll()
  const { client: supabase } = useSupabase()
  
  const [messages, setMessages] = useState<MessageWithProfile[]>(initialMessages)
  const [reactions, setReactions] = useState<Map<string, MessageReaction[]>>(new Map())

  // Update messages when initialMessages change
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // React 19 useOptimistic for instant message feedback
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state: MessageWithProfile[], newMessage: MessageWithProfile) => [...state, newMessage]
  )

  // Convert our database messages to the chat component format
  const chatMessages: ChatMessage[] = useMemo(() => {
    return optimisticMessages.map((msg) => {
      const isOwnMessage = msg.sender_id === currentUserId
      const displayName =
        msg.senderProfile?.display_name?.trim() ||
        msg.senderProfile?.username?.trim() ||
        (isOwnMessage ? currentUserName : "DrumSeeker member")

      return {
        id: msg.id,
        content: msg.body,
        user: {
          name: displayName,
        },
        createdAt: msg.created_at || new Date().toISOString(),
        senderId: msg.sender_id,
        avatarUrl: msg.senderProfile?.avatar_url ?? null,
      }
    })
  }, [optimisticMessages, currentUserId, currentUserName])

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!supabase || !conversationId) return

    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload: RealtimePostgresInsertPayload<any>) => {
          const newMsg = payload.new
          
          // Fetch the complete message with profile data
          try {
            const response = await fetch(`/api/messages/${newMsg.id}`)
            if (response.ok) {
              const messageWithProfile = await response.json()
              setMessages((current) => {
                // Avoid duplicates
                if (current.some(m => m.id === messageWithProfile.id)) {
                  return current
                }
                const updated = [...current, messageWithProfile].sort((a, b) =>
                  a.created_at.localeCompare(b.created_at)
                )
                return updated
              })
              
              if (onNewMessage) {
                onNewMessage(messageWithProfile)
              }
            }
          } catch (error) {
            console.error('Error fetching new message:', error)
          }
        }
      )
      .subscribe((status: REALTIME_SUBSCRIBE_STATES) => {
        setIsConnected(status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, conversationId, onNewMessage])

  // Auto-scroll when optimistic messages change
  useEffect(() => {
    scrollToBottom()
  }, [optimisticMessages, scrollToBottom])

  // Fetch reactions for all messages
  useEffect(() => {
    if (!supabase || messages.length === 0) return

    const messageIds = messages.map((m) => m.id)

    getMessagesReactions(supabase, messageIds, currentUserId)
      .then((reactionsMap) => {
        setReactions(reactionsMap)
      })
      .catch((error) => {
        console.error('Error fetching reactions:', error)
      })
  }, [supabase, messages, currentUserId])

  // Set up real-time subscription for reaction changes
  useEffect(() => {
    if (!supabase || !conversationId) return

    const channel = supabase
      .channel(`reactions:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
        },
        async () => {
          // Refetch all reactions when any change occurs
          const messageIds = messages.map((m) => m.id)
          if (messageIds.length > 0) {
            const reactionsMap = await getMessagesReactions(supabase, messageIds, currentUserId)
            setReactions(reactionsMap)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, conversationId, messages, currentUserId])

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newMessage.trim() || isSending) return

      setIsSending(true)
      const messageContent = newMessage.trim()
      setNewMessage('')

      // Optimistic update - add message immediately
      const optimisticMessage: MessageWithProfile = {
        id: `temp-${Date.now()}`,
        conversation_id: conversationId,
        sender_id: currentUserId,
        body: messageContent,
        created_at: new Date().toISOString(),
        attachments: null as Json,
        deleted_at: null,
        edited_at: null,
        metadata: null as Json,
        senderProfile: {
          id: currentUserId,
          user_id: currentUserId,
          username: currentUserName,
          display_name: currentUserName,
          bio: null,
          booking_email: null,
          avatar_url: null,
          created_at: new Date().toISOString(),
          experience_level: 'intermediate' as const,
          genres: [],
          instruments: [],
          is_profile_visible: true,
          is_quick_responder: false,
          is_demo: false,
          is_admin: false,
          last_seen_at: null,
          location_city: null,
          location_country: null,
          location_lat: null,
          location_lng: null,
          location_postal_code: null,
          location_state: null,
          search_vector: null,
          seeking: [],
          social_links: {} as Json,
          updated_at: new Date().toISOString(),
          youtube_url: null,
          desert_island_record: null,
          user_type: 'drummer' as const,
        },
      }

      // React 19 optimistic update - add message immediately
      startTransition(() => {
        addOptimisticMessage(optimisticMessage)
      })

      try {
        const response = await fetch(`/api/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            body: messageContent,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to send message')
        }

        const { message: savedMessage } = (await response.json()) as {
          message?: MessageWithProfile
        }

        if (!savedMessage) {
          throw new Error('Failed to parse message response')
        }

        // Update the actual messages state - optimistic state will sync automatically
        setMessages((current) => {
          let removedPlaceholder = false
          const withoutPlaceholder = current.filter((msg) => {
            if (msg.id === savedMessage.id) {
              return false
            }
            if (
              !removedPlaceholder &&
              msg.id.startsWith('temp-') &&
              msg.conversation_id === conversationId
            ) {
              removedPlaceholder = true
              return false
            }
            return true
          })

          return [...withoutPlaceholder, savedMessage].sort((a, b) =>
            a.created_at.localeCompare(b.created_at)
          )
        })

        if (onNewMessage) {
          onNewMessage(savedMessage)
        }
      } catch (error) {
        console.error('Error sending message:', error)
        toast.error("Failed to send message. Please try again.")
        // The optimistic update will be reverted automatically since we don't update the base state
        // This is the beauty of useOptimistic - it handles rollbacks automatically!
        // Restore the message text
        setNewMessage(messageContent)
      } finally {
        setIsSending(false)
      }
    },
    [
      newMessage,
      isSending,
      conversationId,
      currentUserId,
      currentUserName,
      addOptimisticMessage,
      onNewMessage,
    ]
  )

  const handleAddReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!supabase) return

      const result = await addReaction(supabase, messageId, emoji, currentUserId)

      if (!result.success) {
        if (result.error !== "You already reacted with this emoji") {
          toast.error(result.error || "Failed to add reaction")
        }
      }
    },
    [supabase, currentUserId]
  )

  const handleRemoveReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!supabase) return

      const result = await removeReaction(supabase, messageId, emoji, currentUserId)

      if (!result.success) {
        toast.error(result.error || "Failed to remove reaction")
      }
    },
    [supabase, currentUserId]
  )

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto px-3 md:px-6 py-4 md:py-6">
        {chatMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-2">No messages yet</p>
              <p className="text-xs text-muted-foreground">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {chatMessages.map((message, index) => {
              const prevMessage = index > 0 ? chatMessages[index - 1] : null
              const showHeader = !prevMessage || prevMessage.user.name !== message.user.name
              const isOwnMessage = message.senderId
                ? message.senderId === currentUserId
                : message.user.name === currentUserName

              return (
                <div
                  key={message.id}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <ChatMessageItem
                    message={message}
                    isOwnMessage={isOwnMessage}
                    showHeader={showHeader}
                    reactions={reactions.get(message.id) || []}
                    onAddReaction={handleAddReaction}
                    onRemoveReaction={handleRemoveReaction}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="border-t border-border/40 bg-background p-3 md:p-6 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <form onSubmit={handleSendMessage} className="space-y-3 md:space-y-4">
          <div className="relative">
            <textarea
              className="w-full min-h-[80px] md:min-h-[120px] resize-none border-2 md:border-4 border-brutal-black bg-white px-3 md:px-4 py-2 md:py-3 text-sm font-medium text-brutal-black placeholder:text-gray-500 focus:border-brutal-purple focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 shadow-[2px_2px_0px_hsl(var(--brutal-black))] md:shadow-[4px_4px_0px_hsl(var(--brutal-black))]"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isConnected ? "Write your message..." : "Connecting..."}
              disabled={isSending}
              aria-label="Message"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <EmojiPicker
                onEmojiSelect={(emoji) => setNewMessage(prev => prev + emoji)}
                buttonClassName="border-2"
              />
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-600 uppercase">
                <span>Press Enter to send, Shift+Enter for new line</span>
              </div>
            </div>
            <button
              type="submit"
              className={cn(
                "min-h-[44px] h-12 px-6 md:px-8 border-2 md:border-4 border-brutal-black bg-brutal-purple text-white font-bold uppercase text-sm md:text-base transition-all shadow-[2px_2px_0px_hsl(var(--brutal-black))] md:shadow-[4px_4px_0px_hsl(var(--brutal-black))] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_hsl(var(--brutal-black))] md:hover:shadow-[2px_2px_0px_hsl(var(--brutal-black))]",
                newMessage.trim() ? "opacity-100" : "pointer-events-none opacity-40"
              )}
              disabled={isSending || !newMessage.trim()}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              SEND MESSAGE
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
