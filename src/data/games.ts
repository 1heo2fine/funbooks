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
    id: "snow-rider-3d",
    title: "Snow Rider 3D",
    category: "Driving",
    emoji: "🛷",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Hot",
    description: "Slide down snowy mountain slopes, avoid giant pine trees, and collect gifts!",
    url: "https://www.hoodamath.com/games/snow-rider.html",
    players: "142k"
  },
  {
    id: "ovo",
    title: "OvO",
    category: "Action",
    emoji: "🏃",
    gradient: "from-stone-800 via-neutral-900 to-black",
    badge: "Top",
    description: "Fast-paced parkour platformer using jumps, dives, slides and wall-bounces.",
    url: "https://www.hoodamath.com/games/ovo.html",
    players: "98.4k"
  },
  {
    id: "drift-hunters",
    title: "Drift Hunters",
    category: "Driving",
    emoji: "🏎️",
    gradient: "from-zinc-800 via-stone-900 to-black",
    badge: "Hot",
    description: "Tune your cars, push your drift skills to the limit, and master high-speed tracks.",
    url: "https://www.hoodamath.com/games/drift-hunters.html",
    players: "116k"
  },
  {
    id: "eggy-car",
    title: "Eggy Car",
    category: "Arcade",
    emoji: "🥚",
    gradient: "from-neutral-700 via-zinc-900 to-black",
    badge: "Top",
    description: "Carefully balance a loose egg on top of your car while driving over bumpy hills.",
    url: "https://www.hoodamath.com/games/eggy-car.html",
    players: "89.2k"
  },
  {
    id: "drift-boss",
    title: "Drift Boss",
    category: "Driving",
    emoji: "🚗",
    gradient: "from-neutral-800 via-stone-900 to-black",
    badge: "Hot",
    description: "One-button timing drift challenge along sharp sky highway cliffs.",
    url: "https://www.hoodamath.com/games/drift-boss.html",
    players: "78.9k"
  },
  {
    id: "moto-x3m",
    title: "Moto X3M",
    category: "Driving",
    emoji: "🏍️",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Top",
    description: "Perform crazy motorbike flips over hazardous tracks and exploding obstacles.",
    url: "https://motox3m.io",
    players: "130k"
  },
  {
    id: "slope",
    title: "Slope",
    category: "Arcade",
    emoji: "⛰️",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Hot",
    description: "Speed down 3D neon obstacle slopes at extreme speeds.",
    url: "https://slope.game",
    players: "160k"
  },
  {
    id: "run-3",
    title: "Run 3",
    category: "Arcade",
    emoji: "🚀",
    gradient: "from-neutral-700 via-stone-900 to-black",
    badge: "Top",
    description: "Sprint through endless space tunnels defying gravity in deep space.",
    url: "https://run3.io",
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
    url: "https://fireboyandwatergirl.co",
    players: "112k"
  },
  {
    id: "1v1-lol",
    title: "1v1.LOL",
    category: "Action",
    emoji: "👊🏽",
    gradient: "from-neutral-800 via-zinc-900 to-black",
    badge: "Hot",
    description: "Competitive multiplayer third-person building and shooting battle royale.",
    url: "https://1v1lol.com",
    players: "210k"
  }
];