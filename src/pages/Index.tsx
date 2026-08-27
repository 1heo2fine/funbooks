"use client";

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import { ITEMS_DATA, Item } from '@/data/games';
import { cn } from '@/lib/utils';

const Index = () => {
  const [selectedTab, setSelectedTab] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState("");
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

  const hotGames = useMemo(() => {
    return [...ITEMS_DATA].sort((a, b) => {
      const aFavs = favorites.filter(f => f === a.id).length;
      const bFavs = favorites.filter(f => f === b.id).length;
      return bFavs - aFavs;
    }).slice(0, 3);
  }, [favorites]);

  const filteredItems = useMemo(() => {
    return ITEMS_DATA.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedTab === "home") return true;
      if (selectedTab === "hot") return hotGames.includes(item);
      if (selectedTab === "favorites") return favorites.includes(item.id);
      if (selectedTab === "popular") return item.badge === "Hot" || item.badge === "Top";
      if (selectedTab === "new") return item.badge === "New";
      if (selectedTab === "updated") return item.badge === "Updated";
      if (selectedTab === "originals") return item.badge === "Originals";
      if (selectedTab === "multiplayer") return item.category === "Action" || item.category === "Driving";
      return item.category.toLowerCase() === selectedTab.toLowerCase();
    });
  }, [searchQuery, selectedTab, favorites, hotGames]);

  // Tabs without "50/50"
  const tabs = [
    { id: "home", label: "Home" },
    { id: "hot", label: "Hot" },
    { id: "popular", label: "Popular" },
    { id: "new", label: "New" },
    { id: "updated", label: "Updated" },
    { id: "originals", label: "Originals" },
    { id: "favorites", label: "Favorites" },
    { id: "multiplayer", label: "Multiplayer" },
    { id: "action", label: "Action" },
    { id: "platformer", label: "Platformer" },
    { id: "puzzle", label: "Puzzle" },
    { id: "sports", label: "Sports" },
    { id: "racing", label: "Racing" },
    { id: "idle", label: "Idle" },
    { id: "sandbox", label: "Sandbox" },
    { id: "strategy", label: "Strategy" },
    { id: "board", label: "Board" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="flex flex-1 relative">
        <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 ml-14 transition-all duration-200">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">funbooks.lol</h1>
            <p className="text-neutral-400">Explore a curated collection of unblocked games.</p>
          </div>

          {/* News & Updates */}
          <NewsCard />

          {/* Tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                  selectedTab === tab.id
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-neutral-900/50 text-neutral-400 hover:text-white hover:bg-neutral-800/50 border border-white/10"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Game Grid - Pure text cards with vote-style buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-neutral-950/50 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all backdrop-blur-xl"
                onClick={() => {}}
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br {item.gradient} opacity-30" />
                
                <div className="relative p-4 h-full flex flex-col">
                  {/* Top row: emoji + favorite + badge */}
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-white border border-white/20">
                          {item.badge}
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                        className={cn(
                          "p-1.5 rounded-xl border border-white/10 bg-neutral-900/50 hover:bg-neutral-800/50 text-neutral-400 hover:text-white transition-colors backdrop-blur-sm",
                          favorites.includes(item.id) && "text-red-500 border-red-500/40 bg-red-500/10"
                        )}
                        title="Add to favorites"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={favorites.includes(item.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <div className="mb-2">
                    <h3 className="font-bold text-white leading-tight group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-neutral-400">{item.category}</span>
                  </div>

                  {/* Description */}
                  <p className="text-[12px] text-neutral-500 line-clamp-2 flex-1 mb-4">
                    {item.description}
                  </p>

                  {/* Bottom: Players + Launch button (vote-style) */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    {item.players && (
                      <span className="text-[10px] font-mono text-neutral-400">
                        {item.players} players
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); window.open(item.url, '_blank'); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30 hover:border-emerald-500/50 transition-all"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      <span>Play</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-neutral-500">
              No games found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;