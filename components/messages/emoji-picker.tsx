"use client";

import { useState, useRef, useEffect } from "react";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";

// Common emoji reactions (can be expanded)
const QUICK_REACTIONS = [
  { emoji: "👍", label: "Thumbs up" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "😂", label: "Laugh" },
  { emoji: "🤔", label: "Thinking" },
  { emoji: "🎵", label: "Music" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "👏", label: "Clap" },
  { emoji: "✨", label: "Sparkles" },
];

const EMOJI_CATEGORIES = {
  Smileys: ["😀", "😁", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳"],
  Hands: ["👍", "👎", "👊", "✊", "🤛", "🤜", "🤝", "🙏", "👏", "🙌", "👐", "🤲", "🤝", "✋", "🤚", "👋", "🤟", "✌️", "🤞", "🤘", "👌", "🤏", "👈", "👉", "👆", "👇", "☝️"],
  Hearts: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟"],
  Music: ["🎵", "🎶", "🎤", "🎧", "🎼", "🎹", "🥁", "🎸", "🎺", "🎷", "🎻"],
  Objects: ["🔥", "✨", "💯", "💪", "🙌", "👀", "💬", "💭", "🎉", "🎊", "🎈", "🎁"],
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  className?: string;
  buttonClassName?: string;
}

export function EmojiPicker({
  onEmojiSelect,
  className,
  buttonClassName,
}: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>("Smileys");
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }

    return undefined; // Explicit return for when isOpen is false
  }, [isOpen]);

  const handleSelect = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={pickerRef}>
      <button
        type="button"
        aria-label="Add emoji"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "min-h-[44px] min-w-[44px] h-11 w-11 flex items-center justify-center bg-white border-2 border-brutal-black hover:bg-brutal-yellow hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-95",
          buttonClassName
        )}
      >
        <Smile className="h-5 w-5 text-brutal-black" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-[calc(100vw-1.5rem)] max-w-[320px] bg-white border-2 md:border-4 border-brutal-black shadow-[4px_4px_0px_hsl(var(--brutal-black))] md:shadow-[8px_8px_0px_hsl(var(--brutal-black))] z-50">
          {/* Quick reactions */}
          <div className="border-b-2 border-brutal-black p-2 bg-brutal-lime">
            <div className="flex gap-1 flex-wrap">
              {QUICK_REACTIONS.map(({ emoji, label }) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleSelect(emoji)}
                  aria-label={label}
                  className="text-2xl p-2 hover:bg-white border-2 border-transparent hover:border-brutal-black transition-all min-h-[44px] min-w-[44px] active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex border-b-2 border-brutal-black bg-brutal-cyan">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category as keyof typeof EMOJI_CATEGORIES)}
                className={cn(
                  "flex-1 py-2 px-1 text-[10px] sm:text-xs font-bold uppercase border-r-2 border-brutal-black last:border-r-0 transition-colors min-h-[44px]",
                  activeCategory === category
                    ? "bg-white"
                    : "bg-brutal-cyan hover:bg-brutal-yellow"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Emoji grid */}
          <div className="p-2 max-h-[200px] overflow-y-auto bg-white">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
              {EMOJI_CATEGORIES[activeCategory].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleSelect(emoji)}
                  className="text-xl sm:text-2xl p-2 min-h-[44px] hover:bg-brutal-yellow border-2 border-transparent hover:border-brutal-black transition-all aspect-square flex items-center justify-center active:scale-95"
                  aria-label={`Select emoji ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
