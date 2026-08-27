"use client";

import React, { useState } from 'react';
import {
  Home,
  Clock,
  Sparkles,
  Flame,
  RotateCw,
  Crown,
  Users,
  Trophy,
  Zap,
  Compass,
  Gamepad,
  Grid,
  Layers,
  MousePointerClick,
  Car,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  selectedTab: string;
  onSelectTab: (tabId: string) => void;
}

export const MAIN_NAV = [
  { id: "home", label: "Home", icon: Home },
  { id: "hot", label: "HOT", icon: Flame },
  { id: "recent", label: "Recently played", icon: Clock },
  { id: "new", label: "New", icon: Sparkles },
  { id: "popular", label: "Popular", icon: Flame },
  { id: "updated", label: "Updated", icon: RotateCw },
  { id: "originals", label: "Originals", icon: Crown },
  { id: "multiplayer", label: "Multiplayer", icon: Users },
  { id: "leaderboards", label: "Leaderboards", icon: Trophy },
  { id: "favorites", label: "Favorites", icon: Heart },
];

export const CATEGORIES_NAV = [
  { id: "Action", label: "Action", icon: Zap },
  { id: "Adventure", label: "Adventure", icon: Compass },
  { id: "Arcade", label: "Arcade", icon: Gamepad },
  { id: "Board", label: "Board", icon: Grid },
  { id: "Card", label: "Card", icon: Layers },
  { id: "Clicker", label: "Clicker", icon: MousePointerClick },
  { id: "Driving", label: "Driving", icon: Car },
  { id: "Sports", label: "Sports", icon: Trophy },
];

const Sidebar = ({ selectedTab, onSelectTab }: SidebarProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed top-14 left-0 bottom-0 z-30 bg-black border-r border-white/[0.08] flex flex-col transition-all duration-300 ease-in-out select-none shadow-2xl overflow-y-auto overflow-x-hidden scrollbar-none",
        isHovered ? "w-56 shadow-black/80 ring-1 ring-white/10" : "w-14"
      )}
    >
      {/* Main Discover Group */}
      <div className="py-2.5 px-1.5 flex flex-col gap-1">
        {MAIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = selectedTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={!isHovered ? item.label : undefined}
              className={cn(
                "flex items-center gap-3.5 px-2.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 w-full text-left relative",
                isActive
                  ? "bg-gray-700 text-white font-bold ring-1 ring-white/10 shadow-inner"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <div className="w-5 flex justify-center shrink-0">
                <Icon size={18} className={cn(isActive ? "text-white" : "text-gray-400")} />
              </div>
              <span
                className={cn(
                  "truncate transition-opacity duration-200 whitespace-nowrap",
                  isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                {item.label}
              </span>
              {isActive && isHovered && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>

      <div className="my-1.5 border-t border-white/[0.08] mx-2" />

      {/* Categories Group */}
      <div className="py-1 px-1.5 flex flex-col gap-1 pb-16">
        {isHovered && (
          <div className="px-3 py-1 text-[10px] font-bold text-neutral-500 uppercase tracking-wider animate-in fade-in duration-200">
            Categories
          </div>
        )}
        {CATEGORIES_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = selectedTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={!isHovered ? item.label : undefined}
              className={cn(
                "flex items-center gap-3.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 w-full text-left",
                isActive
                  ? "bg-gray-700 text-white font-bold ring-1 ring-white/10"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <div className="w-5 flex justify-center shrink-0">
                <Icon size={17} className={cn(isActive ? "text-white" : "text-gray-400")} />
              </div>
              <span
                className={cn(
                  "truncate transition-opacity duration-200 whitespace-nowrap",
                  isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;