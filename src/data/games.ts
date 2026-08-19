export interface Item {
  id: string;
  title: string;
  category: string;
  emoji: string;
  gradient: string;
  badge?: "Top" | "Hot" | "Originals" | "Updated" | "New";
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
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Hot",
    description: "Multiplayer battle arena with intense building & shootouts.",
    url: "https://example.com/2v2",
    players: "128k"
  },
  {
    id: "bloxd-io",
    title: "bloxd.io",
    category: "Adventure",
    emoji: "⛏️",
    gradient: "from-stone-800 via-neutral-900 to-black",
    badge: "Top",
    description: "Voxel multiplayer building, parkour, and creative sandbox.",
    url: "https://example.com/bloxd",
    players: "94.2k"
  },
  {
    id: "kour-io",
    title: "KOUR.io",
    category: "Action",
    emoji: "🐔",
    gradient: "from-zinc-800 via-stone-900 to-black",
    badge: "Top",
    description: "Fast-paced blocky tactical multiplayer battles.",
    url: "https://example.com/kour",
    players: "76.8k"
  },
  {
    id: "maze-escape-3d",
    title: "Labyrinth Run",
    category: "Puzzle",
    emoji: "🧭",
    gradient: "from-neutral-700 via-zinc-900 to-black",
    badge: "Originals",
    description: "Find your way through infinite optical black & white mazes.",
    url: "https://example.com/maze",
    players: "43.1k"
  },
  {
    id: "mahjongg-solitaire",
    title: "Mahjongg Solitaire",
    category: "Board",
    emoji: "🀄",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Top",
    description: "Classic tile-matching strategy with traditional art.",
    url: "https://example.com/mahjongg",
    players: "51.3k"
  },
  {
    id: "soap-cleaner-3d",
    title: "Soap Sparkle",
    category: "Clicker",
    emoji: "🧼",
    gradient: "from-neutral-800 via-stone-900 to-black",
    badge: "Top",
    description: "Satisfying pressure washing & cleanup simulator.",
    url: "https://example.com/soap-clean",
    players: "38.9k"
  },
  {
    id: "shell-shockers",
    title: "Shell Shockers",
    category: "Action",
    emoji: "🥚",
    gradient: "from-stone-800 via-zinc-900 to-black",
    badge: "Top",
    description: "Multiplayer egg combat arena with custom weaponry.",
    url: "https://example.com/shellshockers",
    players: "140k"
  },
  {
    id: "mini-royale",
    title: "Mini Royale",
    category: "Action",
    emoji: "🪖",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Top",
    description: "Battle arena with fast combat and custom soldier gear.",
    url: "https://example.com/mini-royale",
    players: "82.4k"
  },
  {
    id: "smash-karts",
    title: "Smash Karts",
    category: "Driving",
    emoji: "🏎️",
    gradient: "from-neutral-800 via-zinc-900 to-black",
    badge: "Updated",
    description: "3D multiplayer kart battles with rocket launchers and power-ups.",
    url: "https://example.com/smash-karts",
    players: "115k"
  },
  {
    id: "ev-io",
    title: "Ev.io",
    category: "Action",
    emoji: "🤖",
    gradient: "from-stone-800 via-neutral-900 to-black",
    badge: "Hot",
    description: "Futuristic tactical shooter in cyberpunk arenas.",
    url: "https://example.com/ev-io",
    players: "64.7k"
  },
  {
    id: "slope-run",
    title: "Slope Speed",
    category: "Arcade",
    emoji: "⛰️",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Top",
    description: "Speed down neon 3D tracks dodging shifting barriers.",
    url: "https://example.com/slope",
    players: "102k"
  },
  {
    id: "moto-x3m",
    title: "Moto X3M",
    category: "Driving",
    emoji: "🏍️",
    gradient: "from-neutral-800 via-stone-900 to-black",
    badge: "Hot",
    description: "Perform crazy motorbike flips over hazardous tracks.",
    url: "https://example.com/moto-x3m",
    players: "91.2k"
  },
  {
    id: "fireboy-watergirl",
    title: "Elemental Temple",
    category: "Puzzle",
    emoji: "🔥💧",
    gradient: "from-stone-800 via-zinc-900 to-black",
    badge: "Top",
    description: "Solve dual-character elemental puzzles through temple mazes.",
    url: "https://example.com/fireboy",
    players: "87.0k"
  },
  {
    id: "cookie-clicker",
    title: "Cookie Baker",
    category: "Clicker",
    emoji: "🍪",
    gradient: "from-zinc-800 via-stone-900 to-black",
    badge: "Hot",
    description: "Bake trillions of cookies and build planetary factories.",
    url: "https://example.com/cookie-clicker",
    players: "68.3k"
  },
  {
    id: "subway-runners",
    title: "Subway Track Dash",
    category: "Arcade",
    emoji: "🚇",
    gradient: "from-neutral-800 via-zinc-900 to-black",
    badge: "Top",
    description: "Dash along endless railway tracks collecting gold coins.",
    url: "https://example.com/subway",
    players: "135k"
  },
  {
    id: "hoop-stars",
    title: "Hoop Slam 3D",
    category: "Sports",
    emoji: "🏀",
    gradient: "from-stone-800 via-neutral-900 to-black",
    badge: "Originals",
    description: "Dunk basketballs with realistic physics and trick shots.",
    url: "https://example.com/hoop-slam",
    players: "29.4k"
  },
  {
    id: "stickman-duel",
    title: "Stickman Brawler",
    category: "Action",
    emoji: "🥋",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Hot",
    description: "High-octane duel arena with physics.",
    url: "https://example.com/stickman-brawler",
    players: "73.5k"
  },
  {
    id: "card-shuffle",
    title: "Blackjack 21",
    category: "Card",
    emoji: "🃏",
    gradient: "from-neutral-800 via-stone-900 to-black",
    badge: "New",
    description: "Test card probabilities against dynamic AI dealers.",
    url: "https://example.com/blackjack",
    players: "21.6k"
  },
  {
    id: "drift-boss",
    title: "Drift Boss 3D",
    category: "Driving",
    emoji: "🏎️",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Hot",
    description: "Timing-based drifting along sharp highway cliffs.",
    url: "https://example.com/drift-boss",
    players: "58.1k"
  },
  {
    id: "chess-arena",
    title: "Master Chess",
    category: "Board",
    emoji: "♟️",
    gradient: "from-stone-800 via-zinc-900 to-black",
    badge: "Top",
    description: "Strategic classic chess with puzzles and multiplayer ranks.",
    url: "https://example.com/chess",
    players: "44.9k"
  }
];