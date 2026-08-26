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
  // Action Games
  {
    id: "tunnel-rush",
    title: "Tunnel Rush",
    category: "Action",
    emoji: "🌀",
    gradient: "from-purple-800 via-indigo-900 to-black",
    badge: "Hot",
    description: "Race through a neon tunnel at breakneck speeds, dodging obstacles.",
    url: "https://tunnelrush.app",
    players: "89.3k"
  },
  {
    id: "slope",
    title: "Slope",
    category: "Action",
    emoji: "⛰️",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Hot",
    description: "Speed down 3D neon obstacle slopes at extreme speeds.",
    url: "https://slope-game.org",
    players: "160k"
  },
  {
    id: "moto-x3m",
    title: "Moto X3M",
    category: "Action",
    emoji: "🏍️",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Top",
    description: "Perform crazy motorbike flips over hazardous tracks and exploding obstacles.",
    url: "https://motox3m.io",
    players: "130k"
  },
  {
    id: "drift-hunters",
    title: "Drift Hunters",
    category: "Action",
    emoji: "🏎️",
    gradient: "from-zinc-800 via-stone-900 to-black",
    badge: "Hot",
    description: "Tune your cars, push your drift skills to the limit, and master high-speed tracks.",
    url: "https://drifthunters.io",
    players: "116k"
  },
  {
    id: "death-run-3d",
    title: "Death Run 3D",
    category: "Action",
    emoji: "💀",
    gradient: "from-red-800 via-orange-900 to-black",
    badge: "Hot",
    description: "Survive the endless running through dangerous 3D obstacles.",
    url: "https://deathrun3d.io",
    players: "52.1k"
  },
  {
    id: "rooftop-snipers",
    title: "Rooftop Snipers",
    category: "Action",
    emoji: "🎯",
    gradient: "from-stone-800 via-neutral-900 to-black",
    badge: "Top",
    description: "Jump and shoot your enemy off the rooftop in this sniper battle.",
    url: "https://rooftopsnipers.io",
    players: "98.7k"
  },
  {
    id: "bullet-bros",
    title: "Bullet Bros",
    category: "Action",
    emoji: "💥",
    gradient: "from-stone-800 via-neutral-900 to-black",
    badge: "Hot",
    description: "Fast-paced shooting game with bullet hell mechanics.",
    url: "https://bulletbros.io",
    players: "54.2k"
  },
  {
    id: "drive-mad",
    title: "Drive Mad",
    category: "Action",
    emoji: "🚗",
    gradient: "from-red-800 via-orange-900 to-black",
    badge: "Hot",
    description: "Race against opponents on crazy tracks with crazy stunts.",
    url: "https://drivemad.io",
    players: "76.2k"
  },
  {
    id: "crossy-road",
    title: "Crossy Road",
    category: "Action",
    emoji: "🐔",
    gradient: "from-yellow-700 via-amber-800 to-black",
    badge: "Top",
    description: "Help the chicken cross busy roads, rivers, and railways.",
    url: "https://crossyroad.io",
    players: "89.2k"
  },

  // Platformer Games
  {
    id: "run-3",
    title: "Run 3",
    category: "Platformer",
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
    category: "Platformer",
    emoji: "🔥💧",
    gradient: "from-stone-800 via-zinc-900 to-black",
    badge: "Top",
    description: "Solve dual-character elemental puzzles to escape ancient temples.",
    url: "https://fireboyandwatergirl.co",
    players: "112k"
  },
  {
    id: "geometry-dash",
    title: "Geometry Dash",
    category: "Platformer",
    emoji: "📐",
    gradient: "from-cyan-800 via-blue-900 to-black",
    badge: "Top",
    description: "Rhythm-based platformer with challenging levels and music.",
    url: "https://geometrydash.io",
    players: "178k"
  },
  {
    id: "vex",
    title: "Vex",
    category: "Platformer",
    emoji: "⚡",
    gradient: "from-yellow-800 via-amber-900 to-black",
    badge: "Hot",
    description: "Parkour platformer with momentum-based movement and speedrunning.",
    url: "https://vex.game",
    players: "67.3k"
  },
  {
    id: "karlson",
    title: "Karlson",
    category: "Platformer",
    emoji: "🚀",
    gradient: "from-blue-800 via-indigo-900 to-black",
    badge: "Hot",
    description: "Fast-paced 3D platformer with parkour and gunplay mechanics.",
    url: "https://karlson.io",
    players: "56.7k"
  },
  {
    id: "redball-4",
    title: "Redball 4",
    category: "Platformer",
    emoji: "🔴",
    gradient: "from-red-700 via-orange-800 to-black",
    badge: "Top",
    description: "Help the red ball navigate through challenging platform levels.",
    url: "https://redball4.io",
    players: "87.3k"
  },
  {
    id: "ovo",
    title: "OvO",
    category: "Platformer",
    emoji: "🏃",
    gradient: "from-stone-800 via-neutral-900 to-black",
    badge: "Top",
    description: "Fast-paced parkour platformer using jumps, dives, slides and wall-bounces.",
    url: "https://ovo-game.io",
    players: "98.4k"
  },

  // Puzzle Games
  {
    id: "2048",
    title: "2048",
    category: "Puzzle",
    emoji: "🔢",
    gradient: "from-amber-700 via-yellow-800 to-black",
    badge: "Originals",
    description: "Slide and merge numbered tiles to reach 2048.",
    url: "https://play2048.co",
    players: "78.5k"
  },
  {
    id: "block-blast",
    title: "Block Blast",
    category: "Puzzle",
    emoji: "🧩",
    gradient: "from-indigo-800 via-purple-900 to-black",
    badge: "Hot",
    description: "Match blocks in this viral puzzle sensation.",
    url: "https://blockblast.io",
    players: "112k"
  },
  {
    id: "bloons-td-5",
    title: "Bloons TD 5",
    category: "Puzzle",
    emoji: "🎈",
    gradient: "from-pink-800 via-red-900 to-black",
    badge: "Top",
    description: "Place towers and pop all the bloons in this classic strategy game.",
    url: "https://bloonstd5.io",
    players: "134k"
  },
  {
    id: "chess",
    title: "Chess",
    category: "Puzzle",
    emoji: "♟️",
    gradient: "from-neutral-800 via-stone-900 to-black",
    badge: "Top",
    description: "Play chess against the computer or a friend.",
    url: "https://chess.com/play/computer",
    players: "45.6k"
  },
  {
    id: "worlds-hardest-game-2",
    title: "World's Hardest Game 2",
    category: "Puzzle",
    emoji: "💀",
    gradient: "from-red-800 via-rose-900 to-black",
    badge: "Top",
    description: "The sequel to the notoriously difficult puzzle platformer.",
    url: "https://worldshardestgame.io",
    players: "72.3k"
  },

  // Sports Games
  {
    id: "retro-bowl",
    title: "Retro Bowl",
    category: "Sports",
    emoji: "🏈",
    gradient: "from-amber-700 via-orange-800 to-black",
    badge: "Top",
    description: "Lead your team to glory in this retro-style football management game.",
    url: "https://retrobowl.io",
    players: "145k"
  },
  {
    id: "basketball-stars",
    title: "Basketball Stars",
    category: "Sports",
    emoji: "🏀",
    gradient: "from-orange-700 via-red-800 to-black",
    badge: "Hot",
    description: "Compete in 1v1 basketball matches with special moves and dunks.",
    url: "https://basketballstars.io",
    players: "112k"
  },
  {
    id: "soccer-stars",
    title: "Soccer Stars",
    category: "Sports",
    emoji: "⚽",
    gradient: "from-green-700 via-emerald-800 to-black",
    badge: "Hot",
    description: "Score epic goals in this fun soccer game with crazy physics.",
    url: "https://soccerstars.io",
    players: "68.9k"
  },
  {
    id: "basket-random",
    title: "Basket Random",
    category: "Sports",
    emoji: "🏀",
    gradient: "from-orange-700 via-red-800 to-black",
    badge: "Hot",
    description: "Crazy physics basketball game with random court layouts.",
    url: "https://basketrandom.io",
    players: "71.5k"
  },

  // Racing Games
  {
    id: "drift-boss",
    title: "Drift Boss",
    category: "Racing",
    emoji: "🚗",
    gradient: "from-neutral-800 via-stone-900 to-black",
    badge: "Hot",
    description: "One-button timing drift challenge along sharp sky highway cliffs.",
    url: "https://driftboss.io",
    players: "78.9k"
  },
  {
    id: "snow-rider-3d",
    title: "Snow Rider 3D",
    category: "Racing",
    emoji: "🛷",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Hot",
    description: "Slide down snowy mountain slopes, avoid giant pine trees, and collect gifts!",
    url: "https://snowrider.io",
    players: "142k"
  },
  {
    id: "polytrack",
    title: "Polytrack",
    category: "Racing",
    emoji: "🏎️",
    gradient: "from-neutral-800 via-stone-900 to-black",
    badge: "Hot",
    description: "Drift around corners in this minimalist 3D racing game.",
    url: "https://polytrack.io",
    players: "64.8k"
  },

  // Idle/Simulation
  {
    id: "cookie-clicker",
    title: "Cookie Clicker",
    category: "Idle",
    emoji: "🍪",
    gradient: "from-yellow-700 via-amber-800 to-black",
    badge: "Originals",
    description: "Bake as many cookies as you can in this incremental classic.",
    url: "https://cookieclicker.io",
    players: "156k"
  },
  {
    id: "eggy-car",
    title: "Eggy Car",
    category: "Idle",
    emoji: "🥚",
    gradient: "from-neutral-700 via-zinc-900 to-black",
    badge: "Top",
    description: "Carefully balance a loose egg on top of your car while driving over bumpy hills.",
    url: "https://eggycar.io",
    players: "89.2k"
  },
  {
    id: "tiny-fishing",
    title: "Tiny Fishing",
    category: "Idle",
    emoji: "🎣",
    gradient: "from-cyan-800 via-blue-900 to-black",
    badge: "Hot",
    description: "Catch fish, upgrade your gear, and sell your catch for profit.",
    url: "https://tinyfishing.io",
    players: "62.4k"
  },
  {
    id: "bitlife",
    title: "Bitlife",
    category: "Idle",
    emoji: "📱",
    gradient: "from-purple-800 via-violet-900 to-black",
    badge: "Top",
    description: "Text-based life simulator - live your virtual life from birth.",
    url: "https://bitlife.io",
    players: "123k"
  },
  {
    id: "adventure-capitalist",
    title: "Adventure Capitalist",
    category: "Idle",
    emoji: "💰",
    gradient: "from-green-700 via-lime-800 to-black",
    badge: "Originals",
    description: "Start a business empire and become the richest person on Earth.",
    url: "https://adventurecapitalist.io",
    players: "89.1k"
  },

  // Multiplayer
  {
    id: "1v1-lol",
    title: "1v1.LOL",
    category: "Multiplayer",
    emoji: "🔫",
    gradient: "from-blue-700 via-cyan-800 to-black",
    badge: "Top",
    description: "Build and battle in this Fortnite-style 1v1 shooter.",
    url: "https://1v1lol.com",
    players: "156k"
  },
  {
    id: "shell-shockers",
    title: "Shell Shockers",
    category: "Multiplayer",
    emoji: "🥚",
    gradient: "from-green-700 via-lime-800 to-black",
    badge: "Hot",
    description: "Multiplayer egg shooter with intense 3D combat and rankings.",
    url: "https://shellshockers.io",
    players: "134k"
  },
  {
    id: "krunker-io",
    title: "Krunker.io",
    category: "Multiplayer",
    emoji: "💥",
    gradient: "from-red-800 via-pink-900 to-black",
    badge: "Top",
    description: "Fast-paced multiplayer FPS with pixelated graphics and classes.",
    url: "https://krunker.io",
    players: "145k"
  },
  {
    id: "surviv-io",
    title: "Surviv.io",
    category: "Multiplayer",
    emoji: "⚔️",
    gradient: "from-stone-800 via-neutral-900 to-black",
    badge: "Hot",
    description: "2D battle royale - scavenge gear, avoid the storm, be the last one standing.",
    url: "https://surviv.io",
    players: "123k"
  },
  {
    id: "smash-karts",
    title: "Smash Karts",
    category: "Multiplayer",
    emoji: "🏎️",
    gradient: "from-red-700 via-pink-800 to-black",
    badge: "Hot",
    description: "Multiplayer kart battle with power-ups and weapons.",
    url: "https://smashkarts.io",
    players: "134k"
  },
  {
    id: "snake-io",
    title: "Snake.io",
    category: "Multiplayer",
    emoji: "🐍",
    gradient: "from-green-800 via-lime-900 to-black",
    badge: "Hot",
    description: "Multiplayer snake game - grow longer and don't crash into others.",
    url: "https://snake.io",
    players: "98.7k"
  },

  // Sandbox
  {
    id: "paper-minecraft",
    title: "Paper Minecraft",
    category: "Sandbox",
    emoji: "📄",
    gradient: "from-green-700 via-lime-800 to-black",
    badge: "Originals",
    description: "2D Minecraft-style sandbox with crafting, building, and survival.",
    url: "https://paper-minecraft.io",
    players: "98.2k"
  },
  {
    id: "minecraft-classic",
    title: "Minecraft Classic",
    category: "Sandbox",
    emoji: "⛏️",
    gradient: "from-green-700 via-emerald-800 to-black",
    badge: "Top",
    description: "Browser-based Minecraft clone with survival and creative modes.",
    url: "https://classic.minecraft.net",
    players: "92.1k"
  },

  // Strategy
  {
    id: "state-io",
    title: "State.io",
    category: "Strategy",
    emoji: "🌍",
    gradient: "from-green-800 via-emerald-900 to-black",
    badge: "Hot",
    description: "Multiplayer territory conquest game - capture states and grow.",
    url: "https://state.io",
    players: "87.3k"
  },
  {
    id: "people-playground",
    title: "People Playground",
    category: "Strategy",
    emoji: "🧑",
    gradient: "from-red-800 via-rose-900 to-black",
    badge: "Hot",
    description: "Create and experiment with people in this physics sandbox.",
    url: "https://peopleplayground.io",
    players: "98.2k"
  },

  // New Games Added
  {
    id: "subway-surfers",
    title: "Subway Surfers",
    category: "Action",
    emoji: "🚇",
    gradient: "from-blue-800 via-cyan-900 to-black",
    badge: "New",
    description: "Dodge trains and surf through the subway in this endless runner.",
    url: "https://subwaysurfers.io",
    players: "201k"
  },
  {
    id: "among-us",
    title: "Among Us",
    category: "Multiplayer",
    emoji: "🛸",
    gradient: "from-red-800 via-pink-900 to-black",
    badge: "New",
    description: "Work with crewmates or sabotage as an impostor in space.",
    url: "https://amongus.io",
    players: "178k"
  },
  {
    id: "monopoly-go",
    title: "Monopoly Go",
    category: "Board",
    emoji: "🎲",
    gradient: "from-green-700 via-emerald-800 to-black",
    badge: "New",
    description: "Roll the dice and build your property empire in this digital board game.",
    url: "https://monopolygo.io",
    players: "95.3k"
  }
];