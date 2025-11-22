"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, MailPlus, MessageCircle, ArrowLeft, MoreVertical, Check, Trash2 } from "lucide-react";

import { useSupabase } from "@/components/providers/supabase-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnhancedRealtimeChat } from "@/components/messages/enhanced-realtime-chat";
import { cn } from "@/lib/utils";
// import type { ProfileRow } from "@/lib/profile/types";
import type {
  ConversationSummary,
  MessageWithProfile,
} from "@/lib/messaging/types";

const conversationTimeFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function getConversationPartnerLabel(
  conversation: ConversationSummary,
  currentUserId: string
): string {
  const others = conversation.participants.filter((participant) => participant.user_id !== currentUserId);

  if (others.length === 0) {
    return conversation.topic?.trim() || "Personal notes";
  }

  const names = others.map((participant) =>
    participant.profile?.display_name || participant.profile?.username || "Unknown member"
  );

  return names.join(", ");
}

type EnhancedMessagesDashboardProps = {
  initialConversations: ConversationSummary[];
  currentUserId: string;
  initialComposeUsername?: string;
};

function ConversationAvatar({
  conversation,
  currentUserId,
}: {
  conversation: ConversationSummary;
  currentUserId: string;
}) {
  const otherParticipant = conversation.participants.find(
    (participant) => participant.user_id !== currentUserId
  );
  const avatarUrl = otherParticipant?.profile?.avatar_url ?? null;
  const displayName =
    otherParticipant?.profile?.display_name ||
    otherParticipant?.profile?.username ||
    conversation.topic ||
    "Bandseeking";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "B";

  if (avatarUrl) {
    return (
      <div className="relative h-11 w-11 shrink-0 border-2 border-brutal-black bg-white">
        <Image src={avatarUrl} alt={displayName} fill sizes="44px" loading="lazy" className="object-cover" />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-brutal-black bg-brutal-orange text-sm font-bold uppercase text-brutal-black">
      {initials}
    </div>
  );
}

export function EnhancedMessagesDashboard({
  initialConversations,
  currentUserId,
  initialComposeUsername,
}: EnhancedMessagesDashboardProps) {
  const { session } = useSupabase();
  const user = session?.user;

  const [conversations, setConversations] = useState<ConversationSummary[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, MessageWithProfile[]>>({});
  const [threadLoading, setThreadLoading] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [composeUsername, setComposeUsername] = useState(initialComposeUsername || "");
  const [composeTopic, setComposeTopic] = useState("");
  const [composeMessage, setComposeMessage] = useState("");
  const [composeLoading, setComposeLoading] = useState(false);
  const [processingConversations, setProcessingConversations] = useState<Set<string>>(new Set());

  const currentUserName = user?.email || "You";

  // Check for existing conversation when initialComposeUsername is provided
  useEffect(() => {
    if (!initialComposeUsername || !user) return;

    const checkExistingConversation = async () => {
      try {
        // First, look up the user ID from the username
        const profileResponse = await fetch(`/api/profiles/by-username/${encodeURIComponent(initialComposeUsername)}`);
        if (!profileResponse.ok) {
          // User not found, show compose form
          setShowCompose(true);
          return;
        }
        const profileData = await profileResponse.json();

        // Check if there's already a conversation with this user
        const existingConversation = conversations.find(conv =>
          conv.participants.some(p => p.user_id === profileData.user_id)
        );

        if (existingConversation) {
          // Open existing conversation
          setActiveConversationId(existingConversation.id);

          // Load messages if not already loaded
          if (!messagesByConversation[existingConversation.id]) {
            setThreadLoading(true);
            try {
              const response = await fetch(`/api/conversations/${existingConversation.id}/messages`);
              if (response.ok) {
                const data = await response.json();
                const sortedMessages = [...(data.messages ?? [])].sort((a, b) =>
                  a.created_at.localeCompare(b.created_at)
                );
                setMessagesByConversation((prev) => ({
                  ...prev,
                  [existingConversation.id]: sortedMessages,
                }));

                // Mark as read
                await fetch(`/api/conversations/${existingConversation.id}/read`, {
                  method: "POST",
                });
              }
            } catch (error) {
              console.error("Error loading messages:", error);
            } finally {
              setThreadLoading(false);
            }
          }
        } else {
          // No existing conversation, show compose form
          setShowCompose(true);
        }
      } catch (error) {
        console.error("Error checking for existing conversation:", error);
        // Fallback to showing compose form
        setShowCompose(true);
      }
    };

    checkExistingConversation();
  }, [initialComposeUsername, user, conversations, messagesByConversation]);

  // Load conversation messages
  const loadConversationMessages = useCallback(
    async (conversationId: string) => {
      if (messagesByConversation[conversationId]) {
        return; // Already loaded
      }

      setThreadLoading(true);
      try {
        const response = await fetch(`/api/conversations/${conversationId}/messages`);
        if (!response.ok) {
          throw new Error("Failed to load messages");
        }
        const data = await response.json();
        const sortedMessages = [...(data.messages ?? [])].sort((a, b) =>
          a.created_at.localeCompare(b.created_at)
        );
        setMessagesByConversation((prev) => ({
          ...prev,
          [conversationId]: sortedMessages,
        }));

        // Mark as read
        await fetch(`/api/conversations/${conversationId}/read`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setThreadLoading(false);
      }
    },
    [messagesByConversation]
  );

  // Handle conversation selection
  const handleConversationSelect = useCallback(
    (conversationId: string) => {
      setActiveConversationId(conversationId);
      loadConversationMessages(conversationId);
    },
    [loadConversationMessages]
  );

  // Handle new message from real-time chat
  const handleNewMessage = useCallback((message: MessageWithProfile) => {
    // Update the conversation list to show latest message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === message.conversation_id
          ? {
              ...conv,
              last_message_at: message.created_at,
              lastMessage: {
                // Extract the MessageRow fields
                id: message.id,
                body: message.body,
                conversation_id: message.conversation_id,
                created_at: message.created_at,
                sender_id: message.sender_id,
                attachments: message.attachments,
                deleted_at: message.deleted_at,
                edited_at: message.edited_at,
                metadata: message.metadata,
                // Add the profile
                senderProfile: message.senderProfile,
              },
            }
          : conv
      )
    );
    setMessagesByConversation((prev) => {
      const existing = prev[message.conversation_id];
      if (!existing) {
        return prev;
      }
      const nextMessages = [...existing.filter((msg) => msg.id !== message.id), message].sort((a, b) =>
        a.created_at.localeCompare(b.created_at)
      );
      return {
        ...prev,
        [message.conversation_id]: nextMessages,
      };
    });
  }, []);

  // Handle compose new conversation
  const handleCompose = useCallback(async () => {
    const username = composeUsername.trim();
    const messageBody = composeMessage.trim();
    const topic = composeTopic.trim();

    if (!username || !messageBody) return;

    setComposeLoading(true);
    try {
      // First, look up the user ID from the username
      const profileResponse = await fetch(`/api/profiles/by-username/${encodeURIComponent(username)}`);
      if (!profileResponse.ok) {
        throw new Error("User not found");
      }
      const profileData = await profileResponse.json();

      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantUserIds: [profileData.user_id],
          topic: topic || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      const newConversation = (await response.json()) as ConversationSummary;

      const messageResponse = await fetch(`/api/conversations/${newConversation.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: messageBody }),
      });

      if (!messageResponse.ok) {
        throw new Error("Failed to send message");
      }

      const { message: createdMessage } = (await messageResponse.json()) as {
        message?: MessageWithProfile;
      };

      if (!createdMessage) {
        throw new Error("Message response missing data");
      }

      const conversationWithMessage: ConversationSummary = {
        ...newConversation,
        lastMessage: createdMessage,
        last_message_at: createdMessage.created_at,
      };

      setMessagesByConversation((prev) => ({
        ...prev,
        [newConversation.id]: [createdMessage],
      }));

      setConversations((prev) => [conversationWithMessage, ...prev.filter((conv) => conv.id !== newConversation.id)]);

      setActiveConversationId(newConversation.id);

      handleNewMessage(createdMessage);

      // Reset compose form
      setShowCompose(false);
      setComposeUsername("");
      setComposeTopic("");
      setComposeMessage("");
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setComposeLoading(false);
    }
  }, [composeUsername, composeTopic, composeMessage, handleNewMessage]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aDate = a.lastMessage?.created_at ?? a.created_at ?? ""
      const bDate = b.lastMessage?.created_at ?? b.created_at ?? ""
      return bDate.localeCompare(aDate)
    })
  }, [conversations])

  const handleMarkAsRead = useCallback(async (conversationId: string) => {
    setProcessingConversations(prev => new Set(prev).add(conversationId));

    try {
      const response = await fetch(`/api/conversations/${conversationId}/read`, {
        method: 'POST',
      });

      if (response.ok) {
        // Update the conversation to mark as read
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Failed to mark conversation as read:', error);
    } finally {
      setProcessingConversations(prev => {
        const newSet = new Set(prev);
        newSet.delete(conversationId);
        return newSet;
      });
    }
  }, []);

  const handleDeleteConversation = useCallback(async (conversationId: string) => {
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }

    setProcessingConversations(prev => new Set(prev).add(conversationId));

    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove conversation from list
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));

        // Clear active conversation if it was deleted
        if (activeConversationId === conversationId) {
          setActiveConversationId(null);
        }

        // Clear messages for this conversation
        setMessagesByConversation(prev => {
          const newMessages = { ...prev };
          delete newMessages[conversationId];
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    } finally {
      setProcessingConversations(prev => {
        const newSet = new Set(prev);
        newSet.delete(conversationId);
        return newSet;
      });
    }
  }, [activeConversationId]);

  return (
    <div className="bg-brutal-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-brutal-purple border-b-8 border-brutal-black py-6 sm:py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-white leading-tight break-words">
            MESSAGES
          </h1>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="flex h-[calc(100dvh-10rem)] sm:h-[calc(100dvh-12rem)] w-full min-h-0 flex-col overflow-hidden md:flex-row gap-3 md:gap-6">
          <aside className={cn(
            "relative flex w-full flex-col bg-brutal-white border-2 md:border-4 border-brutal-black shadow-[4px_4px_0px_hsl(var(--brutal-black))] md:shadow-[8px_8px_0px_hsl(var(--brutal-black))] md:w-80 lg:w-96",
            activeConversationId && "hidden md:flex"
          )}>
            <div className="bg-brutal-lime border-b-4 border-brutal-black p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center border-2 border-brutal-black bg-white">
                  <MessageCircle className="h-4 w-4 text-brutal-black" />
                </div>
                <h2 className="text-lg font-black uppercase text-brutal-black">CONVERSATIONS</h2>
              </div>
              <button
                aria-label="Compose new message"
                className="min-h-[44px] min-w-[44px] h-12 w-12 flex items-center justify-center bg-white border-2 border-brutal-black hover:bg-gray-100 hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-95"
                onClick={() => setShowCompose(true)}
              >
                <MailPlus className="h-5 w-5 text-brutal-black" aria-hidden="true" />
              </button>
            </div>

        {showCompose && (
          <div className="fixed inset-0 z-50 flex flex-col bg-brutal-white border-2 md:border-4 border-brutal-black md:absolute md:inset-0 md:z-10 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
            <div className="bg-brutal-orange border-b-2 md:border-b-4 border-brutal-black px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between flex-shrink-0 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <h2 className="text-lg font-black uppercase text-brutal-black">NEW MESSAGE</h2>
              <button
                aria-label="Cancel compose"
                className="bg-white border-2 border-brutal-black px-4 py-2 min-h-[44px] text-xs sm:text-sm font-bold uppercase hover:bg-gray-100 hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-95"
                onClick={() => setShowCompose(false)}
              >
                CANCEL
              </button>
            </div>
            <div className="flex-1 flex flex-col p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-brutal-black">TO</label>
                <input
                  placeholder="Enter username"
                  value={composeUsername}
                  onChange={(e) => setComposeUsername(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-brutal-black bg-white text-brutal-black placeholder-gray-500 font-medium focus:outline-none focus:border-brutal-purple"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-brutal-black">SUBJECT (OPTIONAL)</label>
                <input
                  placeholder="What's this about?"
                  value={composeTopic}
                  onChange={(e) => setComposeTopic(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-brutal-black bg-white text-brutal-black placeholder-gray-500 font-medium focus:outline-none focus:border-brutal-purple"
                />
              </div>
              <div className="space-y-2 flex-1">
                <label className="text-sm font-bold uppercase text-brutal-black">MESSAGE</label>
                <textarea
                  placeholder="Write your message..."
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  className="w-full min-h-[80px] sm:min-h-[100px] md:min-h-[120px] px-3 py-2 border-2 border-brutal-black bg-white text-brutal-black placeholder-gray-500 font-medium resize-none focus:outline-none focus:border-brutal-purple"
                />
              </div>
              <button
                onClick={handleCompose}
                disabled={composeLoading || !composeUsername.trim() || !composeMessage.trim()}
                aria-label="Send message"
                className="w-full min-h-[44px] bg-brutal-purple text-white px-4 py-3 border-2 border-brutal-black font-bold uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-transform disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 active:scale-95"
              >
                {composeLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                SEND MESSAGE
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {sortedConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center border-4 border-brutal-black bg-brutal-cyan mb-4">
                <MessageCircle className="h-8 w-8 text-brutal-black" />
              </div>
              <p className="text-sm font-bold text-brutal-black mb-2 uppercase">NO CONVERSATIONS YET</p>
              <p className="text-xs font-medium text-gray-600 uppercase">Start a conversation by tapping the compose button.</p>
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {sortedConversations.map((conversation) => {
                const isActive = activeConversationId === conversation.id
                const preview = conversation.lastMessage?.body ?? "Say hello"
                const timeLabel = conversation.lastMessage
                  ? conversationTimeFormatter.format(new Date(conversation.lastMessage.created_at))
                  : ""
                const partnerLabel = getConversationPartnerLabel(conversation, currentUserId)
                const topicLabel = conversation.topic?.trim() ?? ""

                return (
                  <div
                    key={conversation.id}
                    className={cn(
                      "group flex w-full items-start gap-3 p-3 min-h-[4rem] border-2 border-brutal-black transition-all hover:bg-brutal-cyan hover:translate-x-0.5 hover:translate-y-0.5",
                      isActive ? "bg-brutal-lime shadow-[4px_4px_0px_hsl(var(--brutal-black))]" : "bg-white"
                    )}
                  >
                    <div
                      className="flex-1 flex items-start gap-3 cursor-pointer"
                      onClick={() => handleConversationSelect(conversation.id)}
                    >
                      <ConversationAvatar conversation={conversation} currentUserId={currentUserId} />
                      <div className="min-w-0 flex-1 py-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="truncate text-sm font-bold text-brutal-black uppercase">{partnerLabel}</p>
                          {timeLabel && (
                            <span className="text-xs font-bold text-gray-600">{timeLabel}</span>
                          )}
                        </div>
                        {topicLabel && (
                          <p className="truncate text-xs font-bold text-gray-600 mb-1 uppercase">
                            {topicLabel}
                          </p>
                        )}
                        <p className="text-xs font-medium text-gray-500 line-clamp-2 break-words overflow-hidden"
                           style={{
                             display: '-webkit-box',
                             WebkitLineClamp: 2,
                             WebkitBoxOrient: 'vertical',
                             lineHeight: '1.3',
                             maxHeight: '2.6em'
                           }}
                        >
                          {preview}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 bg-brutal-purple text-white px-2 py-1 text-xs font-bold border border-brutal-black">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Action Menu - Always visible for now to debug */}
                    <div className="flex-shrink-0 self-start pt-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            aria-label="Conversation options"
                            className="min-h-[44px] min-w-[44px] h-11 w-11 bg-white border-2 border-brutal-black hover:bg-gray-100 hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center disabled:opacity-50 active:scale-95"
                            disabled={processingConversations.has(conversation.id)}
                          >
                            {processingConversations.has(conversation.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin text-brutal-black" aria-hidden="true" />
                            ) : (
                              <MoreVertical className="h-4 w-4 text-brutal-black" aria-hidden="true" />
                            )}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          side="bottom"
                          sideOffset={4}
                          className="w-full sm:w-48 max-w-[90vw] border-2 border-brutal-black bg-white shadow-[4px_4px_0px_hsl(var(--brutal-black))] p-2"
                        >
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(conversation.id);
                            }}
                            disabled={processingConversations.has(conversation.id)}
                            className="border border-brutal-black bg-white hover:bg-brutal-cyan font-bold text-brutal-black uppercase text-xs p-2 mb-1"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            MARK AS READ
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConversation(conversation.id);
                            }}
                            disabled={processingConversations.has(conversation.id)}
                            className="border border-brutal-black bg-white hover:bg-red-200 font-bold text-red-600 uppercase text-xs p-2"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            DELETE CONVERSATION
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </aside>

      <section className={cn(
        "relative flex flex-1 min-h-0 flex-col bg-brutal-white border-2 md:border-4 border-brutal-black shadow-[4px_4px_0px_hsl(var(--brutal-black))] md:shadow-[8px_8px_0px_hsl(var(--brutal-black))]",
        !activeConversationId && "hidden md:flex"
      )}>
        {activeConversation ? (
          <>
            <div className="flex items-center gap-3 border-b-2 md:border-b-4 border-brutal-black px-3 md:px-4 py-3 md:py-4 bg-brutal-cyan">
              <button
                aria-label="Back to conversations"
                className="md:hidden min-h-[44px] min-w-[44px] h-11 w-11 bg-white border-2 border-brutal-black hover:bg-gray-100 hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center active:scale-95"
                onClick={() => setActiveConversationId(null)}
              >
                <ArrowLeft className="h-5 w-5 text-brutal-black" aria-hidden="true" />
              </button>
              <ConversationAvatar conversation={activeConversation} currentUserId={currentUserId} />
              <div className="flex flex-col">
                <h2 className="text-lg font-black uppercase text-brutal-black">
                  {getConversationPartnerLabel(activeConversation, currentUserId)}
                </h2>
                {activeConversation.topic && (
                  <span className="text-sm font-bold text-gray-700 uppercase">
                    {activeConversation.topic}
                  </span>
                )}
              </div>
            </div>
            <div className="relative flex-1 min-h-0">
              {threadLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <EnhancedRealtimeChat
                  conversationId={activeConversation.id}
                  currentUserId={currentUserId}
                  currentUserName={currentUserName}
                  initialMessages={messagesByConversation[activeConversation.id] || []}
                  onNewMessage={handleNewMessage}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center p-8">
            <div className="flex h-20 w-20 items-center justify-center border-4 border-brutal-black bg-brutal-pink">
              <MessageCircle className="h-10 w-10 text-brutal-black" />
            </div>
            <div>
              <p className="text-xl font-black uppercase text-brutal-black mb-2">SELECT A CONVERSATION</p>
              <p className="text-sm font-bold text-gray-600 uppercase">Choose someone from the list to start chatting.</p>
            </div>
            <button
              onClick={() => setShowCompose(true)}
              className="bg-brutal-orange text-brutal-black px-6 py-3 border-2 border-brutal-black font-bold uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
            >
              START A NEW CHAT
            </button>
          </div>
        )}
      </section>
        </div>
      </div>
    </div>
  );
}
