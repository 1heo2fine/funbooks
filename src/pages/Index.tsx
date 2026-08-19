"use client";

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CardItem from '@/components/CardItem';
import ItemModal from '@/components/ItemModal';
import NewsCard from '@/components/NewsCard';
import { ITEMS_DATA, Item } from '@/data/games';
import { Flame, Star, ChevronRight, Play, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [selectedTab, setSelectedTab] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItem, setActiveItem] = useState<Item | null>(null);

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

  const filteredItems = useMemo(() => {
    return ITEMS_DATA.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedTab === "home") return true;
      if (selectedTab === "favorites") return favorites.includes(item.id);
      if (selectedTab === "popular") return item.badge === "Hot" || item.badge === "Top";
      if (selectedTab === "new") return item.badge === "New";
      if (selectedTab === "updated") return item.badge === "Updated";
      if (selectedTab === "originals") return item.badge === "Originals";
      if (selectedTab === "multiplayer") return item.category === "Action" || item.category === "Driving";
      if (selectedTab === "recent") return true;

      return item.category.toLowerCase() === selectedTab.toLowerCase();
    });
  }, [searchQuery, selectedTab, favorites]);

  // Bento layout items
  const heroItem = ITEMS_DATA[0];
  const bentoRow1 = ITEMS_DATA[1];
  const bentoRow2 = ITEMS_DATA[2];
  const bentoRow3 = ITEMS_DATA[3];
  const bentoRow4 = ITEMS_DATA[4];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Container */}
      <div className="flex flex-1 relative">
        {/* Left Hover Expandable Sidebar */}
        <Sidebar
          selectedTab={selectedTab}
          onSelectTab={(tabId) => setSelectedTab(tabId)}
        />

        {/* Content Viewport */}
        <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 ml-14 transition-all duration-200">
          {/* Home View Sections */}
          {selectedTab === "home" && !searchQuery && (
            <>
              {/* Continue Playing / Top Section */}
              <div className="mb-6">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 mb-3 uppercase tracking-wider">
                  <span>Continue</span>
                  <ChevronRight size={13} className="text-neutral-500" />
                </div>

                <div className="flex items-center gap-3">
                  <div
                    onClick={() => setActiveItem(heroItem)}
                    className="w-24 sm:w-28 aspect-square rounded-2xl bg-gradient-to-br from-neutral-800 to-black border border-white/10 p-2 flex flex-col items-center justify-center cursor-pointer relative group hover:border-white/30 transition-all shadow-xl"
                  >
                    <div className="absolute top-1.5 left-1.5">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-400 text-black font-extrabold shadow">
                        Top
                      </span>
                    </div>
                    <span className="text-3xl group-hover:scale-110 transition-transform">
                      {heroItem.emoji}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-300 truncate mt-1 max-w-full text-center">
                      {heroItem.title}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bento Grid: Top Picks */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                    Top picks for you
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                  {/* Big Hero Banner */}
                  <div
                    onClick={() => setActiveItem(heroItem)}
                    className="md:col-span-6 relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer group border border-white/[0.08] bg-gradient-to-br from-neutral-800 via-neutral-900 to-black p-5 flex flex-col justify-end shadow-2xl hover:border-white/30 transition-all"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-600 to-red-600 text-white text-[10px] font-bold shadow">
                      <Flame size={11} className="fill-white" />
                      Hot
                    </div>
                    <div className="absolute right-5 top-5 text-6xl opacity-75 group-hover:scale-110 transition-transform duration-300">
                      {heroItem.emoji}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {heroItem.title}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5 max-w-sm line-clamp-1">
                        {heroItem.description}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <button className="px-4 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold shadow-lg flex items-center gap-1.5 transition-transform group-hover:scale-105">
                          <Play size={12} className="fill-black" />
                          Launch
                        </button>
                        {heroItem.players && (
                          <span className="text-[11px] text-neutral-400">👥 {heroItem.players}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2x2 Bento Mini Tiles */}
                  <div className="md:col-span-3 grid grid-cols-2 gap-3">
                    {[bentoRow1, bentoRow2, bentoRow3, bentoRow4].map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveItem(item)}
                        className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group border border-white/[0.08] bg-gradient-to-br from-neutral-800 via-neutral-900 to-black p-3 flex flex-col justify-between shadow-xl hover:border-white/30 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-2xl group-hover:scale-110 transition-transform">
                            {item.emoji}
                          </span>
                          {item.badge && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                          <span className="text-[10px] text-neutral-500">{item.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Wide Labyrinth Maze Tile */}
                  <div
                    onClick={() => setActiveItem(ITEMS_DATA[3])}
                    className="md:col-span-3 relative rounded-2xl overflow-hidden cursor-pointer group border border-white/[0.08] bg-gradient-to-b from-neutral-800 via-neutral-900 to-black p-4 flex flex-col justify-between shadow-2xl hover:border-white/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-bold border border-white/10">
                        Originals
                      </span>
                      <Sparkles size={14} className="text-neutral-400" />
                    </div>
                    <div className="flex flex-col items-center justify-center my-3 group-hover:scale-105 transition-transform">
                      <span className="text-5xl">{ITEMS_DATA[3].emoji}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white truncate">{ITEMS_DATA[3].title}</h4>
                      <p className="text-[11px] text-neutral-400 line-clamp-1">{ITEMS_DATA[3].description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* News & Updates Section on Home */}
              <NewsCard />
            </>
          )}

          {/* Section Header */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                {selectedTab === "home" ? "Featured Items" : selectedTab}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.08] text-neutral-400">
                  {filteredItems.length}
                </span>
              </h2>
            </div>
          </div>

          {/* Clean 6-Column Card Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-3.5">
              {filteredItems.map((item) => (
                <CardItem
                  key={item.id}
                  item={item}
                  isFavorite={favorites.includes(item.id)}
                  onToggleFavorite={toggleFavorite}
                  onSelect={(sel) => setActiveItem(sel)}
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#0d0d11] rounded-2xl border border-white/[0.06] my-6">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="text-sm font-bold text-white mb-1">No Results Found</h3>
              <p className="text-xs text-neutral-500 mb-4">
                No items match your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTab("home");
                }}
                className="px-4 py-1.5 text-xs font-bold rounded-full bg-white text-black hover:bg-neutral-200 transition-colors"
              >
                Show All
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Item Modal Player */}
      <ItemModal
        item={activeItem}
        onClose={() => setActiveItem(null)}
        isFavorite={activeItem ? favorites.includes(activeItem.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default Index;