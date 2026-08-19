"use client";

import React from 'react';
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
  Heart,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  selectedTab: string;
  onSelectTab: (tabId: string) => void;
  isOpen: boolean;
}

export const MAIN_NAV = [
  { id: "home", label: "Home", icon: Home },
  { id: "recent", label: "Recently played", icon: Clock },
  { id: "new", label: "New", icon: Sparkles },
  { id: "popular", label: "Popular", icon: Flame, badge: "Hot" },
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

const Sidebar = ({ selectedTab, onSelectTab, isOpen }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed top-14 left-0 bottom-0 z-30 w-60 bg-[#0d0f18] border-r border-white/5 flex flex-col transition-transform duration-200 overflow-y-auto select-none",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="py-2 px-2 flex flex-col gap-0.5">
        {MAIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = selectedTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={cn(
                "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors duration-150 w-full text-left relative",
                isActive
                  ? "bg-[#6c38ff]/20 text-[#a881ff] font-bold"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <Icon size={18} className={cn(isActive ? "text-[#a881ff]" : "text-slate-400")} />
              <span className="flex-1 truncate">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#a881ff]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="my-2 border-t border-white/5 mx-3" />

      {/* Categories Section */}
      <div className="py-1 px-2 flex flex-col gap-0.5 pb-12">
        <div className="px-3.5 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Categories
        </div>
        {CATEGORIES_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = selectedTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={cn(
                "flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-colors duration-150 w-full text-left",
                isActive
                  ? "bg-[#6c38ff]/20 text-[#a881ff] font-bold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
              )}
            >
              <Icon size={17} className={cn(isActive ? "text-[#a881ff]" : "text-slate-500")} />
              <span className="flex-1 truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;