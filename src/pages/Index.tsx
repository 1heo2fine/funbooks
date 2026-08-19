"use client";

import React, { useState, useMemo } from 'react';
import { Search, Flame, Star, Sparkles, Trophy, Grid, Gamepad2, ChevronRight, SlidersHorizontal, Heart, ShieldCheck } from "lucide-react";
import GameCard from "@/components/GameCard";
import GameModal from "@/components/GameModal";
import { GAMES_DATA, Game } from "@/data/games";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All Games", icon: Grid },
  { id: "Action", label: "Action", icon: Gamepad2 },
  { id: "Casual", label: "Casual", icon: Sparkles },
  { id: "Strategy", label: "Strategy", icon: ShieldCheck },
  { id: "Racing", label: "Racing", icon: Flame },
  { id: "Sports", label: "Sports", icon: Trophy },
  { id: "favorites", label: "Favorites", icon: Heart },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "az">("popular");
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("funbooks-favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("funbooks-favorites", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const filteredGames = useMemo(() => {
    return GAMES_DATA.filter((game) => {
      // Search matching
      const matchesSearch =
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category matching
      if (selectedCategory === "favorites") {
        return favorites.includes(game.id);
      }
      if (selectedCategory !== "all") {
        return game.category.toLowerCase() === selectedCategory.toLowerCase();
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "az") return a.title.localeCompare(b.title);
      if (sortBy === "newest") return (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0);
      // Popular default
      const badgeScore = { Top: 3, Hot: 2, Originals: 1, New: 1 };
      const scoreA = (a.badge ? badgeScore[a.badge] : 0) || 0;
      const scoreB = (b.badge ? badgeScore[b.badge] : 0) || 0;
      return scoreB - scoreA;
    });
  }, [searchQuery, selectedCategory, sortBy, favorites]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20 font-black">
              🎮
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">FunBooks</h1>
              <span className="text-[11px] text-blue-400 font-medium">Free Unblocked Games</span>
            </div>
          </div>

          {/* Centered Search Bar */}
          <div className="relative max-w-md w-full hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              type="text"
              placeholder="Search all 35+ games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/80 border-slate-700/80 focus:border-blue-500 text-white rounded-xl placeholder:text-slate-400 h-10 w-full"
            />
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-2 text-xs font-semibold bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{filteredGames.length} Games</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1 flex flex-col">
        {/* Mobile Search input */}
        <div className="sm:hidden mb-4 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-white rounded-xl h-10 w-full"
          />
        </div>

        {/* Breadcrumb & Title Section matching reference */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
              <span className="hover:text-slate-200 cursor-pointer">Home</span>
              <ChevronRight size={12} className="text-slate-600" />
              <span className="text-blue-400 capitalize">{selectedCategory === "all" ? "All Games" : selectedCategory}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>{selectedCategory === "all" ? "Explore Games" : `${selectedCategory} Games`}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                {filteredGames.length}
              </span>
            </h2>
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <SlidersHorizontal size={14} className="text-slate-400" />
              <span className="text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-200 outline-none cursor-pointer font-medium"
              >
                <option value="popular" className="bg-slate-900 text-white">Popular First</option>
                <option value="newest" className="bg-slate-900 text-white">Newest First</option>
                <option value="az" className="bg-slate-900 text-white">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0",
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800"
                )}
              >
                <Icon size={14} className={cn(isSelected ? "text-white" : "text-slate-400")} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Game Grid with rounded responsive cards matching screenshot layout */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={favorites.includes(game.id)}
                onToggleFavorite={toggleFavorite}
                onPlay={(selected) => setActiveGame(selected)}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-900/40 rounded-3xl border border-slate-800/80 my-8">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-white mb-1">No Games Found</h3>
            <p className="text-slate-400 text-sm max-w-sm mb-4">
              We couldn't find any games matching "{searchQuery}". Try a different keyword or category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Play Modal */}
      <GameModal
        game={activeGame}
        onClose={() => setActiveGame(null)}
        isFavorite={activeGame ? favorites.includes(activeGame.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default Index;