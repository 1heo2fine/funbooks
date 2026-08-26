"use client";

import React from 'react';
import { X, Maximize2, ExternalLink, Heart } from 'lucide-react';
import { Game } from '@/data/games';
import { cn } from '@/lib/utils';

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const GameModal = ({
  game,
  onClose,
  isFavorite,
  onToggleFavorite,
}: GameModalProps) => {
  if (!game) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[85vh] max-h-[850px] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{game.emoji}</span>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">{game.title}</h2>
              <span className="text-xs text-slate-400">{game.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={cn(
                "p-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors",
                isFavorite && "text-red-500 border-red-500/40 bg-red-500/10"
              )}
              title="Add to favorites"
            >
              <Heart size={18} className={cn(isFavorite && "fill-red-500 text-red-500")} />
            </button>

            <a
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Open in new window"
            >
              <ExternalLink size={18} />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-red-600/80 hover:text-white text-slate-300 transition-colors ml-1"
              title="Close game"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Game Play Area */}
        <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center relative">
          <div className="flex flex-col items-center text-center p-6 max-w-md">
            <span className="text-6xl mb-4 animate-bounce">{game.emoji}</span>
            <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
            <p className="text-slate-400 text-sm mb-6">{game.description}</p>
            <a
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              Launch Game Frame <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;