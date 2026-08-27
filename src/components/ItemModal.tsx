"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2, Heart, ArrowLeft, RefreshCw, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFallbackBanner, setShowFallbackBanner] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (item) {
      setIsLoading(true);
      setShowFallbackBanner(false);

      const timer = setTimeout(() => {
        setShowFallbackBanner(true);
      }, 7000);

      return () => {
        clearTimeout(timer);
        if (iframeRef.current) {
          iframeRef.current.src = '';
        }
      };
    }
  }, [item, iframeKey]);

  const handleClose = () => {
    if (iframeRef.current) {
      iframeRef.current.src = '';
    }
    onClose();
  };

  const handleReload = () => {
    setIsLoading(true);
    setShowFallbackBanner(false);
    setIframeKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={cn(
          "relative w-full bg-[#0a0a0e]/80 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl transition-all duration-200 backdrop-blur-xl",
          isFullscreen ? "h-[98vh] max-w-[98vw]" : "h-[90vh] max-w-6xl"
        )}
      >
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-black/50 border-b border-white/[0.08] select-none shrink-0 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-white/10 bg-neutral-900/50 hover:bg-neutral-800/50 text-neutral-300 hover:text-white text-xs font-semibold transition-all backdrop-blur-sm"
              title="Return to selection"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xl">{item.emoji}</span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white leading-none">
                  {item.title}
                </h2>
                <span className="text-[11px] text-neutral-400">{item.category}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-neutral-900/50 hover:bg-neutral-800/50 text-xs font-semibold text-neutral-300 hover:text-white transition-colors backdrop-blur-sm"
              title="Play in new tab if blocked"
            >
              <ExternalLink size={13} />
              <span>New Tab</span>
            </a>

            <button
              onClick={handleReload}
              className="p-2 rounded-xl border border-white/10 bg-neutral-900/50 hover:bg-neutral-800/50 text-neutral-400 hover:text-white transition-colors backdrop-blur-sm"
              title="Reload Game Frame"
            >
              <RefreshCw size={15} />
            </button>

            <button
              onClick={() => onToggleFavorite(item.id)}
              className={cn(
                "p-2 rounded-xl border border-white/10 bg-neutral-900/50 hover:bg-neutral-800/50 text-neutral-400 hover:text-white transition-colors backdrop-blur-sm",
                isFavorite && "text-red-500 border-red-500/40 bg-red-500/10"
              )}
              title="Favorite"
            >
              <Heart size={15} className={cn(isFavorite && "fill-red-500 text-red-500")} />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl border border-white/10 bg-neutral-900/50 hover:bg-neutral-800/50 text-neutral-400 hover:text-white transition-colors backdrop-blur-sm"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl border border-white/10 bg-neutral-900/50 hover:bg-red-600/80 hover:text-white text-neutral-300 transition-colors ml-1 backdrop-blur-sm"
              title="Close Game"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 w-full h-full bg-black relative flex items-center justify-center overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none">
              <Loader2 className="w-8 h-8 text-neutral-400 animate-spin mb-3" />
              <p className="text-xs font-semibold text-neutral-300">Loading {item.title}...</p>
            </div>
          )}

          {showFallbackBanner && (
            <div className="absolute bottom-4 z-20 px-4 py-2 rounded-xl bg-neutral-900/90 border border-white/20 backdrop-blur-md flex items-center gap-3 shadow-2xl animate-in fade-in">
              <AlertCircle size={15} className="text-amber-400 shrink-0" />
              <span className="text-xs text-neutral-200">
                Having trouble loading?
              </span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-all shadow"
              >
                Play in New Tab <ExternalLink size={12} />
              </a>
            </div>
          )}

          <iframe
            ref={iframeRef}
            key={iframeKey}
            src={item.url}
            title={item.title}
            className="w-full h-full border-0 bg-black"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-forms"
            width="100%"
            height="100%"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default ItemModal;