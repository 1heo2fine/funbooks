"use client";

import React from 'react';
import { Star, Flame, Sparkles, RotateCw, Heart, Play } from 'lucide-react';
import { Item } from '@/data/games';
import { cn } from '@/lib/utils';

interface CardItemProps {
  item: Item;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onSelect?: (item: Item) => void;
  className?: string;
}

const CardItem = ({
  item,
  isFavorite = false,
  onToggleFavorite,
  onSelect,
  className,
}: CardItemProps) => {
  const getBadgeConfig = (badge?: string) => {
    switch (badge) {
      case "Top":
        return {
          label: "Top",
          icon: <Star size={11} className="fill-black text-black" />,
          classes: "bg-[#fcd34d] text-black font-extrabold shadow",
        };
      case "Hot":
        return {
          label: "Hot",
          icon: <Flame size={11} className="fill-white text-white" />,
          classes: "bg-gradient-to-r from-[#f97316] to-[#ef4444] text-white font-bold shadow",
        };
      case "Updated":
        return {
          label: "Updated",
          icon: <RotateCw size={11} className="text-white" />,
          classes: "bg-[#06b6d4] text-white font-bold shadow",
        };
      case "Originals":
        return {
          label: "Originals",
          icon: <Sparkles size={11} className="text-white" />,
          classes: "bg-[#6c38ff] text-white font-bold shadow border border-white/20",
        };
      case "New":
        return {
          label: "New",
          icon: <Sparkles size={11} className="text-black" />,
          classes: "bg-[#10b981] text-black font-extrabold shadow",
        };
      default:
        return null;
    }
  };

  const badgeConfig = getBadgeConfig(item.badge);

  return (
    <div
      onClick={() => onSelect?.(item)}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer bg-[#141724] border border-white/[0.06] transition-all duration-200 transform hover:-translate-y-1 hover:border-[#6c38ff]/80 hover:shadow-xl hover:shadow-[#6c38ff]/15 select-none",
        className
      )}
    >
      {/* Visual Thumbnail Art Frame */}
      <div
        className={cn(
          "relative w-full aspect-[16/10] bg-gradient-to-br flex items-center justify-center p-3 overflow-hidden rounded-t-2xl",
          item.gradient
        )}
      >
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

        {/* Floating Centered Artwork */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center transition-transform duration-300 group-hover:scale-110">
          <span className="text-4xl sm:text-5xl filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">
            {item.emoji}
          </span>
          <span className="mt-1.5 text-xs font-black tracking-wider uppercase text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-[90%] truncate">
            {item.title}
          </span>
        </div>

        {/* Pill Badge */}
        {badgeConfig && (
          <div className="absolute top-2.5 left-2.5 z-20">
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-sm tracking-wide",
                badgeConfig.classes
              )}
            >
              {badgeConfig.icon}
              {badgeConfig.label}
            </span>
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(item.id);
          }}
          className={cn(
            "absolute top-2.5 right-2.5 z-20 p-1.5 rounded-full backdrop-blur-md transition-all duration-200",
            isFavorite
              ? "bg-red-500/20 text-red-500 ring-1 ring-red-500/50 scale-105"
              : "bg-black/40 text-slate-300 hover:text-white hover:bg-black/70 opacity-0 group-hover:opacity-100"
          )}
          aria-label="Add to favorites"
        >
          <Heart
            size={14}
            className={cn(isFavorite && "fill-red-500 text-red-500")}
          />
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
          <div className="w-10 h-10 rounded-full bg-[#6c38ff] text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
            <Play size={16} className="fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info Strip */}
      <div className="px-3 py-2 bg-[#141724] border-t border-white/[0.04] flex items-center justify-between">
        <h3 className="font-semibold text-white text-xs truncate tracking-tight group-hover:text-[#a881ff] transition-colors">
          {item.title}
        </h3>
        {item.players && (
          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 shrink-0 ml-2">
            👥 {item.players}
          </span>
        )}
      </div>
    </div>
  );
};

export default CardItem;