"use client";

import React from 'react';
import { Search } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 h-14 bg-black/80 border-b border-white/[0.08] px-3 sm:px-5 flex items-center justify-between gap-4 backdrop-blur-xl">
      {/* Left Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-black via-neutral-900 to-black border border-white/10 flex items-center justify-center text-white shadow-lg">
            <span className="font-black text-sm tracking-tighter">f</span>
          </div>
          <span className="font-black text-base tracking-tight text-white">
            funbooks<span className="text-neutral-400">.lol</span>
          </span>
        </div>
      </div>

      {/* Centered Pill Search Bar - Liquid Glass */}
      <div className="flex-1 max-w-xl mx-auto px-2">
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search titles and categories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-11 pr-4 rounded-full bg-black/50 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500/40 focus:bg-black/60 transition-all backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Right clean status spacer */}
      <div className="shrink-0 flex items-center">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Online" />
      </div>
    </header>
  );
};

export default Header;