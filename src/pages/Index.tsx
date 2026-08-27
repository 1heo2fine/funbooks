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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="flex flex-1 relative">
        <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 ml-14 transition-all duration-200">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">fykk gamehub</h1>
            <p className="text-neutral-400">Explore a curated collection of unblocked games.</p>
          </div>

          {/* News & Updates */}
          <NewsCard />

          {/* Optional: keep the rest of the UI (tabs, search, favorites) but no card grid */}
        </div>
      </div>
    </div>
  );
};

export default Index;