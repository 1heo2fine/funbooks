#!/usr/bin/env node
/**
 * Fetches games from GameMonetize API and writes to src/games/games-data.js
 * Falls back to placeholder data if the API is unavailable.
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../src/games/games-data.js');

const CATEGORIES = [
  "All","Action","Arcade","Multiplayer","Platformer","Puzzle",
  "Racing","RPG","Shooter","Sports","Strategy","Survival","Adventure","Simulation"
];

const CATEGORY_MAP = {
  action: "Action", shooting: "Shooter", shooter: "Shooter",
  puzzle: "Puzzle", racing: "Racing", sport: "Sports", sports: "Sports",
  arcade: "Arcade", multiplayer: "Multiplayer", rpg: "RPG",
  strategy: "Strategy", survival: "Survival", adventure: "Adventure",
  simulation: "Simulation", platformer: "Platformer", platform: "Platformer",
};

function mapCategory(raw) {
  if (!raw) return "Arcade";
  const lower = raw.toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(k)) return v;
  }
  return "Arcade";
}

function toId(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function fetchFromAPI() {
  const url = 'https://gamemonetize.com/feed.php?format=json&num=150';
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Unexpected response shape');
  return data.map(g => ({
    id: toId(g.title || `game-${Math.random()}`),
    title: g.title || 'Unknown Game',
    category: mapCategory(g.category),
    tags: (g.tags || '').split(',').map(t => t.trim()).filter(Boolean),
    thumbnail: g.thumb || null,
    embedPath: g.url || '',
    description: g.description || '',
    featured: false,
    controls: 'Mouse / Keyboard',
  }));
}

const PLACEHOLDER_TITLES = [
  ["Pixel Runner","Arcade"],["Galaxy Blaster","Shooter"],["Cave Explorer","Adventure"],
  ["Neon Dash","Racing"],["Fortress Builder","Strategy"],["Space Miner","Simulation"],
  ["Jungle Jump","Platformer"],["Ocean Quest","RPG"],["Desert Storm","Action"],
  ["Robo Wars","Action"],["Magic Maze","Puzzle"],["Speed Circuit","Racing"],
  ["Dino Herd","Arcade"],["Star Raider","Shooter"],["Dungeon Crawl","RPG"],
  ["Turbo Kart","Racing"],["Ninja Leap","Platformer"],["Pirate Cove","Adventure"],
  ["Laser Grid","Arcade"],["Wizard Quest","RPG"],["Block Blast","Puzzle"],
  ["Tank Battle","Action"],["Sky Runner","Platformer"],["Gem Hunter","Adventure"],
  ["Cyber Chase","Action"],["Zombie Wave","Survival"],["Meteor Dodge","Arcade"],
  ["Fish Tank","Simulation"],["Robot Arena","Action"],["Shadow Ninja","Action"],
  ["Pixel Wars","Strategy"],["Endless Ocean","Adventure"],["Bubble Pop","Puzzle"],
  ["Race Kings","Racing"],["Monster Truck","Racing"],["Space Invader","Shooter"],
  ["Farm Life","Simulation"],["Castle Siege","Strategy"],["Ice Runner","Arcade"],
  ["Fire Trail","Action"],["Storm Rider","Racing"],["Electric Maze","Puzzle"],
  ["Ancient Quest","RPG"],["Gravity Ball","Arcade"],["Micro Wars","Strategy"],
];

function buildPlaceholders(start, count) {
  const games = [];
  for (let i = 0; i < count; i++) {
    const idx = (start + i) % PLACEHOLDER_TITLES.length;
    const [base, cat] = PLACEHOLDER_TITLES[idx];
    const n = Math.floor((start + i) / PLACEHOLDER_TITLES.length) + 1;
    const suffix = n > 1 ? ` ${n}` : '';
    const title = base + suffix;
    const id = toId(title);
    games.push({
      id,
      title,
      category: cat,
      tags: [cat.toLowerCase(), 'browser', 'fun'],
      thumbnail: `https://placehold.co/200x200/1a1a2e/ffffff?text=${encodeURIComponent(title)}`,
      embedPath: `https://placehold.co/800x600/1a1a2e/ffffff?text=${encodeURIComponent(title)}`,
      description: `Play ${title} online for free.`,
      featured: false,
      controls: 'Mouse / Keyboard',
    });
  }
  return games;
}

function serialize(games) {
  return games.map(g => {
    const tags = JSON.stringify(g.tags);
    const thumb = g.thumbnail ? JSON.stringify(g.thumbnail) : 'null';
    return `  { id:${JSON.stringify(g.id)}, title:${JSON.stringify(g.title)}, category:${JSON.stringify(g.category)}, tags:${tags}, thumbnail:${thumb}, embedPath:${JSON.stringify(g.embedPath)}, description:${JSON.stringify(g.description)}, featured:${g.featured}, controls:${JSON.stringify(g.controls)} }`;
  }).join(',\n');
}

async function main() {
  let apiGames = [];
  try {
    console.log('Fetching from GameMonetize API…');
    apiGames = await fetchFromAPI();
    console.log(`Got ${apiGames.length} games from API.`);
  } catch (e) {
    console.warn(`API fetch failed (${e.message}), using placeholders.`);
  }

  // Existing curated games (kept as-is, will be merged)
  // We'll just use API games + fill up to 150 with placeholders
  const needed = Math.max(0, 150 - apiGames.length);
  const placeholders = needed > 0 ? buildPlaceholders(0, needed) : [];
  const all = [...apiGames, ...placeholders].slice(0, 200);

  const content = `export const CATEGORIES = ${JSON.stringify(CATEGORIES)};

export const GAMES = [
${serialize(all)}
];

const seen = new Set();
export const UNIQUE_GAMES = GAMES.filter(g => { if (seen.has(g.id)) return false; seen.add(g.id); return true; });
`;
  writeFileSync(OUT, content);
  console.log(`Written ${all.length} games to ${OUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
