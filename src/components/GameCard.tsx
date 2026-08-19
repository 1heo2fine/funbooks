"use client";

import React from 'react';
import { Star, Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Game {
  title: string;
  emoji: string;
  description: string;
  url: string;
}

interface GameCardProps {
  game: Game;
  isFavorite?: boolean;
  onToggleFavorite?: (title: string) => void;
  onVote?: (title: string, direction: "up" | "down") => void;
  votePercentage?: number;
  userVote?: "up" | "down" | null;
}

const GameCard = ({
  game,
  isFavorite = false,
  onToggleFavorite,
  onVote,
  votePercentage = 0,
  userVote = null,
}: GameCardProps) => {
  return (
    <div className="bg-base-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{game.emoji}</span>
            <div>
              <h3 className="font-semibold text-base-content">{game.title}</h3>
              <p className="text-sm text-base-content/70 line-clamp-2">
                {game.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => onToggleFavorite?.(game.title)}
            className="text-base-content/70 hover:text-red-500 transition-colors"
            aria-label="Toggle favorite"
          >
            <Heart
              size={18}
              className={cn(isFavorite && "fill-red-500 text-red-500")}
            />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <a
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Play now →
          </a>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onVote?.(game.title, "up")}
              className={cn(
                "p-1 rounded transition-colors",
                userVote === "up"
                  ? "text-green-500 bg-green-100"
                  : "text-base-content/50 hover:text-green-500"
              )}
              aria-label="Upvote"
            >
              <ThumbsUp size={16} />
            </button>
            <span className="text-sm text-base-content/70 w-8 text-center">
              {votePercentage}%
            </span>
            <button
              onClick={() => onVote?.(game.title, "down")}
              className={cn(
                "p-1 rounded transition-colors",
                userVote === "down"
                  ? "text-red-500 bg-red-100"
                  : "text-base-content/50 hover:text-red-500"
              )}
              aria-label="Downvote"
            >
              <ThumbsDown size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;