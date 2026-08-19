"use client";

import React from 'react';
import { Heart, Star, Flame, Sparkles, Plus, Play } from "lucide-react";
import { Game } from '@/data/games';
import { cn } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onPlay?: (game: Game) => void;
}

const GameCard = ({
  game,
  isFavorite = false,
  onToggleFavorite,
  onPlay,
}: GameCardProps) => {
  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case "Top":
        return "bg-amber-400 text-black font-extrabold shadow-sm";
      case "Hot":
        return "bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold shadow-sm";
      case "Originals":
        return "bg-indigo-600 text-white font-bold shadow-sm border border-indigo-400/40";
      case "New":
        return "bg-emerald-500 text-black font-extrabold shadow-sm";
      default:
        return "bg-black/60 text-white";
    }
  };

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case "Top":
        return <Star size={10} className="fill-black" />;
      case "Hot":
        return <Flame size={10} className="fill-white" />;
      case "Originals":
        return <Sparkles size={10} />;
      case "New":
        return <Plus size={10} strokeWidth={3} />;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onPlay?.(game)}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 ring-1 ring-white/10 hover:ring-2 hover:ring-blue-500/80 select-none bg-slate-900"
    >
      {/* Visual Rounded Thumbnail Banner */}
      <div className={cn(
        "relative w-full aspect-[4/3] bg-gradient-to-br flex items-center justify-center p-3 overflow-hidden rounded-t-2xl",
        game.gradient
      )}>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:12px_12px] opacity-60 pointer-events-none" />

        {/* Floating Emoji Art */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center transition-transform duration-300 group-hover:scale-110">
          <span className="text-4xl sm:text-5xl filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">
            {game.emoji}
          </span>
        </div>

        {/* Top Badges (Top, Hot, Originals) */}
        {game.badge && (
          <div className="absolute top-2 left-2 z-20">
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full shadow-md backdrop-blur-sm uppercase tracking-wider font-semibold",
                getBadgeStyle(game.badge)
              )}
            >
              {getBadgeIcon(game.badge)}
              {game.badge}
            </span>
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(game.id);
          }}
          className={cn(
            "absolute top-2 right-2 z-20 p-1.5 rounded-full backdrop-blur-md transition-all duration-200",
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

        {/* Hover Play Action Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
          <div className="w-11 h-11 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play size={18} className="fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="p-2.5 bg-slate-900 border-t border-white/5 flex flex-col justify-between">
        <h3 className="font-semibold text-slate-100 text-sm truncate tracking-tight group-hover:text-blue-400 transition-colors">
          {game.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
          <span className="truncate">{game.category}</span>
          {game.players && (
            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
              👥 {game.players}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;