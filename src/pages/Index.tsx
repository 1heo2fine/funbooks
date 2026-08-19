"use client";

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CardItem from '@/components/CardItem';
import ItemModal from '@/components/ItemModal';
import { ITEMS_DATA, Item } from '@/data/games';
import { Flame, Star, Crown, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [selectedTab, setSelectedTab] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<Item | null>(null);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("portal-favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("portal-favorites", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const filteredItems = useMemo(() => {
    return ITEMS_DATA.filter((item) => {
      // Search
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Tab filtering
      if (selectedTab === "home") return true;
      if (selectedTab === "favorites") return favorites.includes(item.id);
      if (selectedTab === "popular") return item.badge === "Hot" || item.badge === "Top";
      if (selectedTab === "new") return item.badge === "New";
      if (selectedTab === "updated") return item.badge === "Updated";
      if (selectedTab === "originals") return item.badge === "Originals";
      if (selectedTab === "multiplayer") return item.category === "Action" || item.category === "Driving";
      if (selectedTab === "recent") return true;

      // Category tab
      return item.category.toLowerCase() === selectedTab.toLowerCase();
    });
  }, [searchQuery, selectedTab, favorites]);

  // Featured hero item for CrazyGames bento style
  const featuredItem = ITEMS_DATA[0];
  const secondaryFeatured = ITEMS_DATA[1];
  const thirdFeatured = ITEMS_DATA[2];

  return (
    <div className="min-h-screen bg-[#0d0f18] text-white flex flex-col font-sans selection:bg-[#6c38ff] selection:text-white">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex flex-1 relative">
        {/* Left Sidebar */}
        <Sidebar
          selectedTab={selectedTab}
          onSelectTab={(tabId) => setSelectedTab(tabId)}
          isOpen={isSidebarOpen}
        />

        {/* Content Canvas */}
        <main
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-200 p-4 sm:p-6",
            isSidebarOpen ? "md:ml-60" : "ml-0"
          )}
        >
          {/* Bento Featured Header on Home view when no search */}
          {selectedTab === "home" && !searchQuery && (
            <section className="mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Large Big Feature Tile */}
              <div
                onClick={() => setActiveItem(featuredItem)}
                className="md:col-span-2 lg:col-span-2 relative aspect-[16/10] sm:aspect-[2/1] rounded-3xl overflow-hidden cursor-pointer group border border-white/10 bg-gradient-to-br from-indigo-700 via-blue-900 to-slate-950 p-6 flex flex-col justify-end shadow-2xl hover:border-[#6c38ff] transition-all duration-200"
              >
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black shadow-md uppercase">
                  <Flame size={13} className="fill-white" />
                  Featured
                </div>
                <div className="absolute right-6 top-6 text-7xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                  {featuredItem.emoji}
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
                    {featuredItem.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md line-clamp-2">
                    {featuredItem.description}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <button className="px-5 py-2 rounded-full bg-[#6c38ff] hover:bg-[#7b4aff] text-white text-xs font-bold shadow-lg shadow-[#6c38ff]/30 flex items-center gap-1.5 transition-transform group-hover:scale-105">
                      <Play size={13} className="fill-white" />
                      Play Now
                    </button>
                    <span className="text-xs text-slate-300">👥 {featuredItem.players} active</span>
                  </div>
                </div>
              </div>

              {/* Second Featured Tile */}
              <div
                onClick={() => setActiveItem(secondaryFeatured)}
                className="relative aspect-[16/10] sm:aspect-auto rounded-3xl overflow-hidden cursor-pointer group border border-white/10 bg-gradient-to-br from-emerald-600 via-teal-900 to-slate-950 p-5 flex flex-col justify-end shadow-xl hover:border-[#6c38ff] transition-all"
              >
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-extrabold shadow">
                  <Star size={11} className="fill-black" />
                  Top
                </div>
                <div className="absolute right-4 top-4 text-5xl opacity-80 group-hover:scale-110 transition-transform">
                  {secondaryFeatured.emoji}
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-extrabold text-white">{secondaryFeatured.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-1">{secondaryFeatured.category}</p>
                </div>
              </div>

              {/* Third Featured Tile */}
              <div
                onClick={() => setActiveItem(thirdFeatured)}
                className="relative aspect-[16/10] sm:aspect-auto rounded-3xl overflow-hidden cursor-pointer group border border-white/10 bg-gradient-to-br from-orange-600 via-amber-800 to-neutral-950 p-5 flex flex-col justify-end shadow-xl hover:border-[#6c38ff] transition-all"
              >
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-extrabold shadow">
                  <Star size={11} className="fill-black" />
                  Top
                </div>
                <div className="absolute right-4 top-4 text-5xl opacity-80 group-hover:scale-110 transition-transform">
                  {thirdFeatured.emoji}
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-extrabold text-white">{thirdFeatured.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-1">{thirdFeatured.category}</p>
                </div>
              </div>
            </section>
          )}

          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white capitalize flex items-center gap-2">
                {selectedTab === "home" ? "Discover" : selectedTab}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  {filteredItems.length}
                </span>
              </h2>
            </div>
          </div>

          {/* Responsive 6-column Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
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
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#141724] rounded-3xl border border-white/5 my-8">
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="text-base font-bold text-white mb-1">No Results</h3>
              <p className="text-xs text-slate-400 mb-4">
                No items match your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTab("home");
                }}
                className="px-4 py-2 text-xs font-bold rounded-full bg-[#6c38ff] text-white hover:bg-[#7b4aff]"
              >
                View Discover
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modal Viewer */}
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