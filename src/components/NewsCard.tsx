"use client";

import React from 'react';
import { Newspaper, ChevronRight, Calendar } from 'lucide-react';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  date: string;
  tag?: string;
}

interface NewsCardProps {
  news?: NewsItem[];
}

const DEFAULT_NEWS: NewsItem[] = [
  {
    title: "Version 3.4 Platform Update",
    description: "Added faster instant launches, customizable controls, and high-performance server frames.",
    url: "#",
    date: "Just now",
    tag: "Update"
  },
  {
    title: "10 New Titles Added to Catalog",
    description: "Explore top trending multiplayer battle arenas, physics puzzles, and endless speed tracks.",
    url: "#",
    date: "Yesterday",
    tag: "New"
  },
  {
    title: "Cloud Save Syncing Live",
    description: "Your favorited items and high scores are now automatically remembered in your local session.",
    url: "#",
    date: "3 days ago",
    tag: "Feature"
  }
];

const NewsCard = ({ news = DEFAULT_NEWS }: NewsCardProps) => {
  return (
    <div className="bg-[#0f0f13] border border-white/[0.08] rounded-2xl p-5 mb-8 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-neutral-800 border border-white/10 text-white">
            <Newspaper size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-none">News & Announcements</h3>
            <span className="text-[11px] text-neutral-400">Latest updates across funbooks.lol</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {news.map((item, index) => (
          <div
            key={index}
            className="p-3.5 rounded-xl bg-[#14141a] border border-white/[0.06] hover:border-white/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                {item.tag && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-200 text-gray-900 border border-gray-300/20">
                    {item.tag}
                  </span>
                )}
                <span className="text-[10px] text-neutral-500 flex items-center gap-1 font-mono">
                  <Calendar size={10} />
                  {item.date}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mb-1 leading-snug">
                {item.title}
              </h4>
              <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsCard;