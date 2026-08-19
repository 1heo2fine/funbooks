"use client";

import React from 'react';
import { Menu, Search, Users, Bookmark, Bell, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onToggleSidebar: () => void;
}

const Header = ({ searchQuery, onSearchChange, onToggleSidebar }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 h-14 bg-[#0d0f18] border-b border-white/5 px-3 sm:px-4 flex items-center justify-between gap-4">
      {/* Left Menu & Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        {/* Crazy logo icon & brand */}
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6c38ff] to-[#8c52ff] flex items-center justify-center text-white shadow-md shadow-[#6c38ff]/30">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-white"
              fill="currentColor"
            >
              <path d="M7 4h10c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4V8c0-2.2 1.8-4 4-4zm1.5 5.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM8 15.5c1.2 1 2.5 1.5 4 1.5s2.8-.5 4-1.5H8z"/>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-[15px] tracking-tight text-white flex items-center gap-1">
              crazy<span className="text-[#a881ff]">portal</span>
            </span>
          </div>
        </div>
      </div>

      {/* Centered Pill Search Bar */}
      <div className="flex-1 max-w-xl mx-auto px-2">
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search titles and categories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-11 pr-4 rounded-full bg-[#181a26] border border-white/[0.06] text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#6c38ff] focus:ring-1 focus:ring-[#6c38ff] transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-colors hidden sm:inline-flex"
          title="Friends"
        >
          <Users size={18} />
        </button>

        <button
          className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-colors hidden sm:inline-flex"
          title="Bookmarks"
        >
          <Bookmark size={18} />
        </button>

        <button
          className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-colors relative"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#6c38ff]" />
        </button>

        <button className="ml-1 px-4 py-2 rounded-full bg-[#6c38ff] hover:bg-[#7b4aff] text-white text-xs font-bold shadow-lg shadow-[#6c38ff]/25 transition-all">
          Log in
        </button>
      </div>
    </header>
  );
};

export default Header;