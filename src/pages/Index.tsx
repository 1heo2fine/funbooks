"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, Heart, Search, Filter } from "lucide-react";
import GameCard from "@/components/GameCard";

interface Game {
  title: string;
  emoji: string;
  description: string;
  url: string;
}

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("trending");
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("funbooks-favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [votes, setVotes] = useState<Record<string, { up: number; down: number }>>(() => {
    const saved = localStorage.getItem("funbooks-votes");
    return saved ? JSON.parse(saved) : {};
  });
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down" | null>>(() => {
    const saved = localStorage.getItem("funbooks-user-votes");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    // Load games from the global games array
    if (typeof window !== "undefined" && (window as any).games) {
      setGames((window as any).games);
    }
  }, []);

  useEffect(() => {
    let filtered = [...games];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query)
      );
    }

    // Apply tab filter
    if (activeTab === "favorites") {
      filtered = filtered.filter((game) => favorites.includes(game.title));
    } else if (activeTab === "trending") {
      // Sort by vote percentage (up / total) descending
      filtered.sort((a, b) => {
        const aVotes = votes[a.title] || { up: 0, down: 0 };
        const bVotes = votes[b.title] || { up: 0, down: 0 };
        const aTotal = aVotes.up + aVotes.down;
        const bTotal = bVotes.up + bVotes.down;
        const aPct = aTotal > 0 ? aVotes.up / aTotal : 0;
        const bPct = bTotal > 0 ? bVotes.up / bTotal : 0;
        return bPct - aPct;
      });
      // Show top 4 for trending
      filtered = filtered.slice(0, 4);
    }

    setFilteredGames(filtered);
  }, [games, searchQuery, activeTab, favorites, votes]);

  const toggleFavorite = (title: string) => {
    setFavorites((prev) => {
      const next = prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title];
      localStorage.setItem("funbooks-favorites", JSON.stringify(next));
      return next;
    });
  };

  const handleVote = (title: string, direction: "up" | "down") => {
    setUserVotes((prev) => {
      const current = prev[title];
      if (current === direction) return prev; // Already voted this way
      const next = { ...prev, [title]: direction };
      localStorage.setItem("funbooks-user-votes", JSON.stringify(next));
      return next;
    });

    setVotes((prev) => {
      const current = prev[title] || { up: 0, down: 0 };
      const userCurrent = userVotes[title];
      let next = { ...current };

      if (userCurrent === "up") next.up -= 1;
      else if (userCurrent === "down") next.down -= 1;

      if (direction === "up") next.up += 1;
      else next.down += 1;

      const updated = { ...prev, [title]: next };
      localStorage.setItem("funbooks-votes", JSON.stringify(updated));
      return updated;
    });
  };

  const getVotePercentage = (title: string) => {
    const v = votes[title] || { up: 0, down: 0 };
    const total = v.up + v.down;
    if (total === 0) return 0;
    return Math.round((v.up / total) * 100);
  };

  const isFavorite = (title: string) => favorites.includes(title);
  const userVote = (title: string) => userVotes[title] || null;

  return (
    <div className="min-h-screen bg-base-200">
      {/* Starfield Canvas */}
      <canvas
        id="starfield"
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">FunBooks</h1>
          <p className="text-base-content/70">Your school game portal</p>
        </header>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={20} />
            <Input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="trending">
              <Star className="mr-2 h-4 w-4" /> Trending
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="mr-2 h-4 w-4" /> Favorites
            </TabsTrigger>
            <TabsTrigger value="all">
              All Games
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredGames.map((game) => (
                <GameCard key={game.title} game={game} />
              ))}
            </div>
            {filteredGames.length === 0 && (
              <p className="text-center text-base-content/70 py-8">No trending games yet. Be the first to vote!</p>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredGames.map((game) => (
                <GameCard key={game.title} game={game} />
              ))}
            </div>
            {filteredGames.length === 0 && (
              <p className="text-center text-base-content/70 py-8">No favorites yet. Click the heart on a game to add it!</p>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredGames.map((game) => (
                <GameCard key={game.title} game={game} />
              ))}
            </div>
            {filteredGames.length === 0 && (
              <p className="text-center text-base-content/70 py-8">No games found.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Starfield Initialization Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const canvas = document.getElementById('starfield');
              if (!canvas) return;
              const ctx = canvas.getContext('2d');
              let stars = [];
              const numStars = 200;

              function resize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
              }

              function initStars() {
                stars = [];
                for (let i = 0; i < numStars; i++) {
                  stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.5,
                    speed: Math.random() * 0.5 + 0.2,
                    opacity: Math.random() * 0.5 + 0.3
                  });
                }
              }

              function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#ffffff';
                stars.forEach(star => {
                  ctx.globalAlpha = star.opacity;
                  ctx.beginPath();
                  ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                  ctx.fill();
                  star.y += star.speed;
                  if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                  }
                });
                ctx.globalAlpha = 1;
                requestAnimationFrame(animate);
              }

              window.addEventListener('resize', () => {
                resize();
                initStars();
              });

              resize();
              initStars();
              animate();
            })();
          `,
        }}
      />
    </div>
  );
};

export default Index;