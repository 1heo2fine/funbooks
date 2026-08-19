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
    id: "slope",
    title: "Slope",
    category: "Arcade",
    emoji: "⛰️",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Hot",
    description: "Speed down 3D neon obstacle slopes at extreme speeds.",
    url: "https://playbrain.games/games/slope",
    players: "160k"
  },
  {
    id: "moto-x3m",
    title: "Moto X3M",
    category: "Driving",
    emoji: "🏍️",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Top",
    description: "Perform crazy motorbike flips over hazardous tracks and exploding obstacles.",
    url: "https://playbrain.games/games/moto-x3m",
    players: "130k"
  },
  {
    id: "retro-bowl",
    title: "Retro Bowl",
    category: "Sports",
    emoji: "🏈",
    gradient: "from-amber-700 via-orange-800 to-black",
    badge: "Top",
    description: "Lead your team to glory in this retro-style football management game.",
    url: "https://playbrain.games/games/retro-bowl",
    players: "145k"
  },
  {
    id: "ovo-platformer",
    title: "OvO Platformer",
    category: "Action",
    emoji: "🏃",
    gradient: "from-stone-800 via-neutral-900 to-black",
    badge: "Top",
    description: "Fast-paced parkour platformer using jumps, dives, slides and wall-bounces.",
    url: "https://playbrain.games/games/ovo-platformer",
    players: "98.4k"
  },
  {
    id: "drift-boss",
    title: "Drift Boss",
    category: "Driving",
    emoji: "🚗",
    gradient: "from-neutral-800 via-stone-900 to-black",
    badge: "Hot",
    description: "One-button timing drift challenge along sharp sky highway cliffs.",
    url: "https://playbrain.games/games/drift-boss",
    players: "78.9k"
  },
  {
    id: "basketball-stars",
    title: "Basketball Stars",
    category: "Sports",
    emoji: "🏀",
    gradient: "from-orange-700 via-red-800 to-black",
    badge: "Hot",
    description: "Compete in 1v1 basketball matches with special moves and dunks.",
    url: "https://playbrain.games/games/basketball-stars",
    players: "112k"
  },
  {
    id: "tunnel-rush",
    title: "Tunnel Rush",
    category: "Arcade",
    emoji: "🌀",
    gradient: "from-purple-800 via-indigo-900 to-black",
    badge: "Hot",
    description: "Race through a neon tunnel at breakneck speeds, dodging obstacles.",
    url: "https://playbrain.games/games/tunnel-rush",
    players: "89.3k"
  },
  {
    id: "1v1-lol",
    title: "1v1.LOL",
    category: "Action",
    emoji: "🔫",
    gradient: "from-blue-700 via-cyan-800 to-black",
    badge: "Top",
    description: "Build and battle in this Fortnite-style 1v1 shooter.",
    url: "https://shawgames.com/game/1v1-lol-unblocked",
    players: "156k"
  },
  {
    id: "eggy-car",
    title: "Eggy Car",
    category: "Arcade",
    emoji: "🥚",
    gradient: "from-neutral-700 via-zinc-900 to-black",
    badge: "Top",
    description: "Carefully balance a loose egg on top of your car while driving over bumpy hills.",
    url: "https://shawgames.com/game/eggy-car-unblocked",
    players: "89.2k"
  },
  {
    id: "crazy-cattle-3d",
    title: "Crazy Cattle 3D",
    category: "Action",
    emoji: "🐄",
    gradient: "from-green-700 via-emerald-800 to-black",
    badge: "New",
    description: "Chaotic physics-based cattle herding in 3D arenas.",
    url: "https://shawgames.com/game/crazy-cattle-3d-pro-unblocked",
    players: "67.4k"
  },
  {
    id: "smash-karts",
    title: "Smash Karts",
    category: "Driving",
    emoji: "🏎️",
    gradient: "from-red-700 via-pink-800 to-black",
    badge: "Hot",
    description: "Multiplayer kart battle with power-ups and weapons.",
    url: "https://shawgames.com/game/smash-karts-unblocked",
    players: "134k"
  },
  {
    id: "eagle-craft",
    title: "Eagle Craft (Minecraft)",
    category: "Adventure",
    emoji: "⛏️",
    gradient: "from-green-700 via-lime-800 to-black",
    badge: "Originals",
    description: "Browser-based Minecraft clone with survival and creative modes.",
    url: "https://shawgames.com/game/eagle-craft-unblocked",
    players: "92.1k"
  },
  {
    id: "run-3",
    title: "Run 3",
    category: "Arcade",
    emoji: "🚀",
    gradient: "from-neutral-700 via-stone-900 to-black",
    badge: "Top",
    description: "Sprint through endless space tunnels defying gravity in deep space.",
    url: "https://www.hoodamath.com/games/run-3.html",
    players: "94.5k"
  },
  {
    id: "fireboy-and-watergirl",
    title: "Fireboy and Watergirl",
    category: "Action",
    emoji: "🔥💧",
    gradient: "from-stone-800 via-zinc-900 to-black",
    badge: "Top",
    description: "Solve dual-character elemental puzzles to escape ancient temples.",
    url: "https://www.hoodamath.com/games/fireboy-and-watergirl.html",
    players: "112k"
  },
  {
    id: "2048",
    title: "2048",
    category: "Puzzle",
    emoji: "🔢",
    gradient: "from-amber-700 via-yellow-800 to-black",
    badge: "Originals",
    description: "Slide and merge numbered tiles to reach 2048.",
    url: "https://playbrain.games/games/2048",
    players: "78.5k"
  }
];