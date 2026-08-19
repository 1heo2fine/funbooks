"use client";

import React from 'react';
import { X, ExternalLink, Heart, Play } from 'lucide-react';
import { Item } from '@/data/games';
import { cn } from '@/lib/utils';

interface ItemModalProps {
  item: Item | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const ItemModal = ({
  item,
  onClose,
  isFavorite,
  onToggleFavorite,
}: ItemModalProps) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[85vh] max-h-[850px] bg-[#0c0c10] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-black">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{item.emoji}</span>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">{item.title}</h2>
              <span className="text-xs text-neutral-400">{item.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(item.id)}
              className={cn(
                "p-2 rounded-xl border border-white/10 bg-[#15151b] hover:bg-white/10 text-neutral-300 transition-colors",
                isFavorite && "text-red-500 border-red-500/40 bg-red-500/10"
              )}
              title="Add to favorites"
            >
              <Heart size={16} className={cn(isFavorite && "fill-red-500 text-red-500")} />
            </button>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-white/10 bg-[#15151b] hover:bg-white/10 text-neutral-300 transition-colors"
              title="Open external window"
            >
              <ExternalLink size={16} />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/10 bg-[#15151b] hover:bg-red-600 hover:text-white text-neutral-300 transition-colors ml-1"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Main Viewport */}
        <div className="flex-1 bg-black flex flex-col items-center justify-center p-6 text-center relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-neutral-800 via-neutral-900 to-black border border-white/10 flex items-center justify-center text-5xl mb-4 shadow-2xl">
            {item.emoji}
          </div>
          <h3 className="text-2xl font-black text-white mb-2">{item.title}</h3>
          <p className="text-neutral-400 text-sm max-w-md mb-6">{item.description}</p>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black hover:bg-neutral-200 font-bold text-sm shadow-2xl transition-all hover:scale-105"
          >
            <Play size={16} className="fill-black" />
            Launch Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;