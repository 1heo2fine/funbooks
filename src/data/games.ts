export interface Item {
  id: string;
  title: string;
  category: string;
  emoji: string;
  gradient: string;
  badge?: "Top" | "Hot" | "Originals" | "Updated" | "New";
  size?: "large" | "wide" | "normal";
  description: string;
  url: string;
  players?: string;
}

export const ITEMS_DATA: Item[] = [
  {
    id: "fortzone-2v2",
    title: "2v2.io",
    category: "Action",
    emoji: "🍌",
    gradient: "from-amber-500 via-sky-600 to-indigo-950",
    badge: "Hot",
    size: "large",
    description: "Multiplayer battle arena with intense building & shootouts.",
    url: "https://example.com/2v2",
    players: "128k"
  },
  {
    id: "bloxd-io",
    title: "bloxd.io",
    category: "Adventure",
    emoji: "⛏️",
    gradient: "from-emerald-600 via-teal-800 to-slate-900",
    badge: "Top",
    size: "normal",
    description: "Voxel multiplayer building, parkour, and creative sandbox.",
    url: "https://example.com/bloxd",
    players: "94.2k"
  },
  {
    id: "kour-io",
    title: "KOUR.io",
    category: "Action",
    emoji: "🐔",
    gradient: "from-orange-600 via-amber-700 to-zinc-900",
    badge: "Top",
    size: "normal",
    description: "Fast-paced blocky first-person tactical multiplayer battles.",
    url: "https://example.com/kour",
    players: "76.8k"
  },
  {
    id: "maze-escape-3d",
    title: "Labyrinth Run",
    category: "Puzzle",
    emoji: "🧭",
    gradient: "from-zinc-200 via-slate-400 to-zinc-800",
    badge: "Originals",
    size: "wide",
    description: "Find your way through infinite optical black & white mazes.",
    url: "https://example.com/maze",
    players: "43.1k"
  },
  {
    id: "mahjongg-solitaire",
    title: "Mahjongg Solitaire",
    category: "Board",
    emoji: "🀄",
    gradient: "from-emerald-900 via-teal-950 to-slate-950",
    badge: "Top",
    size: "normal",
    description: "Classic tile-matching strategy with traditional Chinese art.",
    url: "https://example.com/mahjongg",
    players: "51.3k"
  },
  {
    id: "soap-cleaner-3d",
    title: "Soap Sparkle",
    category: "Clicker",
    emoji: "🧼",
    gradient: "from-pink-500 via-rose-600 to-amber-900",
    badge: "Top",
    size: "normal",
    description: "Satisfying pressure washing & cleanup simulator.",
    url: "https://example.com/soap-clean",
    players: "38.9k"
  },
  {
    id: "shell-shockers",
    title: "Shell Shockers",
    category: "Action",
    emoji: "🥚",
    gradient: "from-amber-600 via-orange-800 to-stone-950",
    badge: "Top",
    size: "normal",
    description: "Multiplayer egg combat arena with custom weaponry.",
    url: "https://example.com/shellshockers",
    players: "140k"
  },
  {
    id: "mini-royale",
    title: "Mini Royale",
    category: "Action",
    emoji: "🪖",
    gradient: "from-violet-800 via-purple-950 to-slate-950",
    badge: "Top",
    size: "normal",
    description: "Battle royale with fast gunplay and custom soldier gear.",
    url: "https://example.com/mini-royale",
    players: "82.4k"
  },
  {
    id: "smash-karts",
    title: "Smash Karts",
    category: "Driving",
    emoji: "🏎️",
    gradient: "from-cyan-600 via-blue-800 to-slate-950",
    badge: "Updated",
    size: "normal",
    description: "3D multiplayer kart battles with rocket launchers and power-ups.",
    url: "https://example.com/smash-karts",
    players: "115k"
  },
  {
    id: "ev-io",
    title: "Ev.io",
    category: "Action",
    emoji: "🤖",
    gradient: "from-red-600 via-rose-900 to-stone-950",
    badge: "Hot",
    size: "normal",
    description: "Futuristic halo-inspired arena shooter in neon cyberpunk spaces.",
    url: "https://example.com/ev-io",
    players: "64.7k"
  },
  {
    id: "slope-run",
    title: "Slope Speed",
    category: "Arcade",
    emoji: "⛰️",
    gradient: "from-emerald-500 via-green-800 to-slate-950",
    badge: "Top",
    size: "normal",
    description: "Speed down neon 3D tracks dodging shifting barriers.",
    url: "https://example.com/slope",
    players: "102k"
  },
  {
    id: "moto-x3m",
    title: "Moto X3M",
    category: "Driving",
    emoji: "🏍️",
    gradient: "from-orange-500 via-amber-700 to-neutral-950",
    badge: "Hot",
    size: "normal",
    description: "Perform crazy motorbike flips over hazardous tracks.",
    url: "https://example.com/moto-x3m",
    players: "91.2k"
  },
  {
    id: "fireboy-watergirl",
    title: "Elemental Temple",
    category: "Puzzle",
    emoji: "🔥💧",
    gradient: "from-rose-600 via-indigo-900 to-slate-950",
    badge: "Top",
    size: "normal",
    description: "Solve dual-character elemental puzzles through temple mazes.",
    url: "https://example.com/fireboy",
    players: "87.0k"
  },
  {
    id: "cookie-clicker",
    title: "Cookie Baker",
    category: "Clicker",
    emoji: "🍪",
    gradient: "from-amber-600 via-yellow-800 to-stone-950",
    badge: "Hot",
    size: "normal",
    description: "Bake trillions of cookies and build planetary factories.",
    url: "https://example.com/cookie-clicker",
    players: "68.3k"
  },
  {
    id: "subway-runners",
    title: "Subway Track Dash",
    category: "Arcade",
    emoji: "🚇",
    gradient: "from-cyan-500 via-blue-900 to-slate-950",
    badge: "Top",
    size: "normal",
    description: "Dash along endless railway tracks collecting gold coins.",
    url: "https://example.com/subway",
    players: "135k"
  },
  {
    id: "hoop-stars",
    title: "Hoop Slam 3D",
    category: "Sports",
    emoji: "🏀",
    gradient: "from-orange-600 via-red-900 to-slate-950",
    badge: "Originals",
    size: "normal",
    description: "Dunk basketballs with realistic physics and trick shots.",
    url: "https://example.com/hoop-slam",
    players: "29.4k"
  },
  {
    id: "stickman-duel",
    title: "Stickman Brawler",
    category: "Action",
    emoji: "🥋",
    gradient: "from-indigo-600 via-purple-900 to-slate-950",
    badge: "Hot",
    size: "normal",
    description: "High-octane duel arena with laser swords and physics.",
    url: "https://example.com/stickman-brawler",
    players: "73.5k"
  },
  {
    id: "card-shuffle",
    title: "Blackjack 21",
    category: "Card",
    emoji: "🃏",
    gradient: "from-emerald-800 via-green-950 to-neutral-950",
    badge: "New",
    size: "normal",
    description: "Test card probabilities against dynamic AI dealers.",
    url: "https://example.com/blackjack",
    players: "21.6k"
  },
  {
    id: "drift-boss",
    title: "Drift Boss 3D",
    category: "Driving",
    emoji: "🏎️",
    gradient: "from-fuchsia-600 via-purple-950 to-slate-950",
    badge: "Hot",
    size: "normal",
    description: "Timing-based drifting along sharp highway cliffs.",
    url: "https://example.com/drift-boss",
    players: "58.1k"
  },
  {
    id: "chess-arena",
    title: "Master Chess",
    category: "Board",
    emoji: "♟️",
    gradient: "from-stone-700 via-zinc-900 to-black",
    badge: "Top",
    size: "normal",
    description: "Strategic classic chess with puzzles and multiplayer ranks.",
    url: "https://example.com/chess",
    players: "44.9k"
  }
];