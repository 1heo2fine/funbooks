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
  // === UBGHYPER SOURCE (Most Reliable) ===
  {
    id: "tunnel-rush",
    title: "Tunnel Rush",
    category: "Action",
    emoji: "🌀",
    gradient: "from-purple-800 via-indigo-900 to-black",
    badge: "Hot",
    description: "Race through a neon tunnel at breakneck speeds, dodging obstacles.",
    url: "https://ubghyper.github.io/game/tunnel-rush",
    players: "89.3k"
  },
  {
    id: "drive-mad",
    title: "Drive Mad",
    category: "Racing",
    emoji: "🚗",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Hot",
    description: "Race against opponents on crazy tracks with crazy stunts.",
    url: "https://ubghyper.github.io/game/drive-mad",
    players: "76.2k"
  },
  {
    id: "polytrack",
    title: "Polytrack",
    category: "Racing",
    emoji: "🏎️",
    gradient: "from-neutral-800 via-stone-900 to-black",
    badge: "Hot",
    description: "Drift around corners in this minimalist 3D racing game.",
    url: "https://ubghyper.github.io/game/polytrack",
    players: "64.8k"
  },
  {
    id: "death-run-3d",
    title: "Death Run 3D",
    category: "Action",
    emoji: "💀",
    gradient: "from-red-800 via-orange-900 to-black",
    badge: "Hot",
    description: "Survive the endless running through dangerous 3D obstacles.",
    url: "https://ubghyper.github.io/game/death-run-3d",
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
    url: "https://ubghyper.github.io/game/rooftop-snipers",
    players: "98.7k"
  },
  {
    id: "2048-ubg",
    title: "2048",
    category: "Puzzle",
    emoji: "🔢",
    gradient: "from-amber-700 via-yellow-800 to-black",
    badge: "Originals",
    description: "Slide and merge numbered tiles to reach 2048.",
    url: "https://ubghyper.github.io/game/2048",
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
    url: "https://ubghyper.github.io/game/block-blast",
    players: "112k"
  },
  {
    id: "bloons-td-5",
    title: "Bloons TD 5",
    category: "Puzzle",
    emoji: " balloons",
    gradient: "from-pink-800 via-red-900 to-black",
    badge: "Top",
    description: "Place towers and pop all the bloons in this classic strategy game.",
    url: "https://ubghyper.github.io/game/bloons-td-5",
    players: "134k"
  },
  {
    id: "state-io",
    title: "State.io",
    category: "Multiplayer",
    emoji: "🌍",
    gradient: "from-green-800 via-emerald-900 to-black",
    badge: "Hot",
    description: "Multiplayer territory conquest game - capture states and grow.",
    url: "https://ubghyper.github.io/game/state-io",
    players: "87.3k"
  },
  {
    id: "chess",
    title: "Chess",
    category: "Puzzle",
    emoji: "♟️",
    gradient: "from-neutral-800 via-stone-900 to-black",
    badge: "Top",
    description: "Play chess against the computer or a friend.",
    url: "https://ubghyper.github.io/game/chess",
    players: "45.6k"
  },
  {
    id: "cookie-clicker",
    title: "Cookie Clicker",
    category: "Idle",
    emoji: "🍪",
    gradient: "from-yellow-700 via-amber-800 to-black",
    badge: "Originals",
    description: "Bake as many cookies as you can in this incremental classic.",
    url: "https://ubghyper.github.io/game/cookie-clicker",
    players: "156k"
  },
  {
    id: "tiny-fishing",
    title: "Tiny Fishing",
    category: "Idle",
    emoji: "🎣",
    gradient: "from-cyan-800 via-blue-900 to-black",
    badge: "Hot",
    description: "Catch fish, upgrade your gear, and sell your catch for profit.",
    url: "https://ubghyper.github.io/game/tiny-fishing",
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
    url: "https://ubghyper.github.io/game/bitlife",
    players: "123k"
  },
  {
    id: "people-playground",
    title: "People Playground",
    category: "Sandbox",
    emoji: "🧑",
    gradient: "from-red-800 via-rose-900 to-black",
    badge: "Hot",
    description: "Create and experiment with people in this physics sandbox.",
    url: "https://ubghyper.github.io/game/people-playground",
    players: "98.2k"
  },
  {
    id: "adventure-capitalist",
    title: "Adventure Capitalist",
    category: "Idle",
    emoji: "💰",
    gradient: "from-green-700 via-lime-800 to-black",
    badge: "Originals",
    description: "Start a business empire and become the richest person on Earth.",
    url: "https://ubghyper.github.io/game/adventure-capitalist",
    players: "89.1k"
  },
  {
    id: "retro-bowl-ubg",
    title: "Retro Bowl",
    category: "Sports",
    emoji: "🏈",
    gradient: "from-amber-700 via-orange-800 to-black",
    badge: "Top",
    description: "Lead your team to glory in this retro-style football management game.",
    url: "https://ubghyper.github.io/game/retro-bowl",
    players: "145k"
  },
  {
    id: "basket-random",
    title: "Basket Random",
    category: "Sports",
    emoji: "🏀",
    gradient: "from-orange-700 via-red-800 to-black",
    badge: "Hot",
    description: "Crazy physics basketball game with random court layouts.",
    url: "https://ubghyper.github.io/game/basket-random",
    players: "71.5k"
  },
  {
    id: "soccer-stars",
    title: "Soccer Stars",
    category: "Sports",
    emoji: "⚽",
    gradient: "from-green-700 via-emerald-800 to-black",
    badge: "Hot",
    description: "Score epic goals in this fun soccer game with crazy physics.",
    url: "https://ubghyper.github.io/game/soccer-stars",
    players: "68.9k"
  },
  {
    id: "moto-x3m-ubg",
    title: "Moto X3M",
    category: "Racing",
    emoji: "🏍️",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Top",
    description: "Perform crazy motorbike flips over hazardous tracks and exploding obstacles.",
    url: "https://ubghyper.github.io/game/moto-x3m",
    players: "130k"
  },
  {
    id: "drift-hunters",
    title: "Drift Hunters",
    category: "Racing",
    emoji: "🏎️",
    gradient: "from-zinc-800 via-stone-900 to-black",
    badge: "Hot",
    description: "Tune your cars, push your drift skills to the limit, and master high-speed tracks.",
    url: "https://ubghyper.github.io/game/drift-hunters",
    players: "116k"
  },
  {
    id: "run-3-ubg",
    title: "Run 3",
    category: "Platformer",
    emoji: "🚀",
    gradient: "from-neutral-700 via-stone-900 to-black",
    badge: "Top",
    description: "Sprint through endless space tunnels defying gravity in deep space.",
    url: "https://ubghyper.github.io/game/run-3",
    players: "94.5k"
  },
  {
    id: "karlson",
    title: "Karlson",
    category: "Platformer",
    emoji: "🚀",
    gradient: "from-blue-800 via-indigo-900 to-black",
    badge: "Hot",
    description: "Fast-paced 3D platformer with parkour and gunplay mechanics.",
    url: "https://ubghyper.github.io/game/karlson",
    players: "56.7k"
  },
  {
    id: "fireboy-and-watergirl-ubg",
    title: "Fireboy and Watergirl",
    category: "Platformer",
    emoji: "🔥💧",
    gradient: "from-stone-800 via-zinc-900 to-black",
    badge: "Top",
    description: "Solve dual-character elemental puzzles to escape ancient temples.",
    url: "https://ubghyper.github.io/game/fireboy-and-watergirl",
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
    url: "https://ubghyper.github.io/game/geometry-dash",
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
    url: "https://ubghyper.github.io/game/vex",
    players: "67.3k"
  },
  {
    id: "1v1-lol-ubg",
    title: "1v1.LOL",
    category: "Multiplayer",
    emoji: "🔫",
    gradient: "from-blue-700 via-cyan-800 to-black",
    badge: "Top",
    description: "Build and battle in this Fortnite-style 1v1 shooter.",
    url: "https://ubghyper.github.io/game/1v1-lol",
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
    url: "https://ubghyper.github.io/game/shell-shockers",
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
    url: "https://ubghyper.github.io/game/krunker-io",
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
    url: "https://ubghyper.github.io/game/surviv-io",
    players: "123k"
  },
  {
    id: "smash-karts-ubg",
    title: "Smash Karts",
    category: "Multiplayer",
    emoji: "🏎️",
    gradient: "from-red-700 via-pink-800 to-black",
    badge: "Hot",
    description: "Multiplayer kart battle with power-ups and weapons.",
    url: "https://ubghyper.github.io/game/smash-karts",
    players: "134k"
  },
  {
    id: "paper-minecraft",
    title: "Paper Minecraft",
    category: "Sandbox",
    emoji: "📄",
    gradient: "from-green-700 via-lime-800 to-black",
    badge: "Originals",
    description: "2D Minecraft-style sandbox with crafting, building, and survival.",
    url: "https://ubghyper.github.io/game/paper-minecraft",
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
    url: "https://ubghyper.github.io/game/minecraft-classic",
    players: "92.1k"
  },

  // === OTTERGAMES SOURCE (HTML5 Games) ===
  {
    id: "redball-4",
    title: "Redball 4",
    category: "Platformer",
    emoji: "🔴",
    gradient: "from-red-700 via-orange-800 to-black",
    badge: "Top",
    description: "Help the red ball navigate through challenging platform levels.",
    url: "https://ottergames.org/g/redball-4",
    players: "87.3k"
  },
  {
    id: "bullet-bros",
    title: "Bullet Bros",
    category: "Action",
    emoji: "💥",
    gradient: "from-stone-800 via-neutral-900 to-black",
    badge: "Hot",
    description: "Fast-paced shooting game with bullet hell mechanics.",
    url: "https://ottergames.org/g/bullet-bros",
    players: "54.2k"
  },
  {
    id: "run-run-duck",
    title: "Run Run Duck",
    category: "Platformer",
    emoji: "🦆",
    gradient: "from-yellow-700 via-amber-800 to-black",
    badge: "New",
    description: "Help the duck run and jump through endless obstacles.",
    url: "https://ottergames.org/g/run-run-duck",
    players: "43.1k"
  },
  {
    id: "level-devil-2",
    title: "Level Devil 2",
    category: "Platformer",
    emoji: "😈",
    gradient: "from-red-800 via-rose-900 to-black",
    badge: "Hot",
    description: "Brutally hard platformer with devilish traps and challenges.",
    url: "https://ottergames.org/g/level-devil-2",
    players: "76.8k"
  },
  {
    id: "temple-of-boom",
    title: "Temple of Boom",
    category: "Action",
    emoji: "🏛️",
    gradient: "from-amber-800 via-orange-900 to-black",
    badge: "Top",
    description: "Explode your way through the ancient temple in this puzzle action game.",
    url: "https://ottergames.org/g/temple-of-boom",
    players: "62.4k"
  },
  {
    id: "poor-bunny",
    title: "Poor Bunny",
    category: "Platformer",
    emoji: "🐰",
    gradient: "from-pink-800 via-rose-900 to-black",
    badge: "New",
    description: "Help the bunny navigate through dangerous obstacles and traps.",
    url: "https://ottergames.org/g/poor-bunny",
    players: "38.9k"
  },
  {
    id: "moss-moss",
    title: "Moss Moss",
    category: "Puzzle",
    emoji: "🌿",
    gradient: "from-green-800 via-emerald-900 to-black",
    badge: "New",
    description: "Relaxing puzzle game with moss and nature themes.",
    url: "https://ottergames.org/g/moss-moss",
    players: "29.4k"
  },
  {
    id: "geometry-dash-absolute-zero",
    title: "Geometry Dash Absolute Zero",
    category: "Platformer",
    emoji: "❄️",
    gradient: "from-cyan-800 via-blue-900 to-black",
    badge: "Hot",
    description: "Frozen Geometry Dash fan level with ice mechanics and challenges.",
    url: "https://ottergames.org/g/geometry-dash-absolute-zero",
    players: "64.2k"
  },
  {
    id: "bomberman-classic",
    title: "Bomberman Classic",
    category: "Action",
    emoji: "💥",
    gradient: "from-red-800 via-orange-900 to-black",
    badge: "Top",
    description: "Classic arcade bomberman - place bombs to eliminate opponents.",
    url: "https://ottergames.org/g/bomberman-classic",
    players: "81.5k"
  },
  {
    id: "escape-school-duel",
    title: "Escape School Duel",
    category: "Puzzle",
    emoji: "🏫",
    gradient: "from-indigo-800 via-purple-900 to-black",
    badge: "New",
    description: "Escape the school and duel your way to freedom.",
    url: "https://ottergames.org/g/escape-school-duel",
    players: "34.7k"
  },
  {
    id: "worlds-hardest-game-2",
    title: "World's Hardest Game 2",
    category: "Puzzle",
    emoji: "💀",
    gradient: "from-red-800 via-rose-900 to-black",
    badge: "Top",
    description: "The sequel to the notoriously difficult puzzle platformer.",
    url: "https://ottergames.org/g/worlds-hardest-game-2",
    players: "72.3k"
  },
  {
    id: "stacktris",
    title: "Stacktris",
    category: "Puzzle",
    emoji: "📦",
    gradient: "from-blue-800 via-indigo-900 to-black",
    badge: "New",
    description: "Stack blocks in this Tetris-inspired puzzle game.",
    url: "https://ottergames.org/g/stacktris",
    players: "41.2k"
  },
  {
    id: "gobble",
    title: "Gobble",
    category: "Action",
    emoji: "👻",
    gradient: "from-purple-800 via-violet-900 to-black",
    badge: "New",
    description: "Eat your way through the maze while avoiding ghosts.",
    url: "https://ottergames.org/g/gobble",
    players: "36.8k"
  },
  {
    id: "crossy-road",
    title: "Crossy Road",
    category: "Arcade",
    emoji: "🐔",
    gradient: "from-yellow-700 via-amber-800 to-black",
    badge: "Top",
    description: "Help the chicken cross busy roads, rivers, and railways.",
    url: "https://ottergames.org/g/crossy-road",
    players: "89.2k"
  },
  {
    id: "snake-io",
    title: "Snake.io",
    category: "Multiplayer",
    emoji: "🐍",
    gradient: "from-green-800 via-lime-900 to-black",
    badge: "Hot",
    description: "Multiplayer snake game - grow longer and don't crash into others.",
    url: "https://ottergames.org/g/snake-io",
    players: "98.7k"
  },
  {
    id: "pinball-master",
    title: "Pinball Master",
    category: "Arcade",
    emoji: "🎯",
    gradient: "from-amber-700 via-orange-800 to-black",
    badge: "Top",
    description: "Classic pinball machine with multiple tables and scoring.",
    url: "https://ottergames.org/g/pinball-master",
    players: "52.3k"
  },
  {
    id: "flipping-master",
    title: "Flipping Master",
    category: "Sports",
    emoji: " Gymnastics",
    gradient: "from-cyan-800 via-blue-900 to-black",
    badge: "Hot",
    description: "Perform gymnastics flips and stunts in this physics game.",
    url: "https://ottergames.org/g/flipping-master",
    players: "47.6k"
  },
  {
    id: "slide-down",
    title: "Slide Down",
    category: "Action",
    emoji: "⬇️",
    gradient: "from-stone-800 via-neutral-900 to-black",
    badge: "New",
    description: "Slide down the mountain avoiding obstacles and collecting items.",
    url: "https://ottergames.org/g/slide-down",
    players: "33.1k"
  },
  {
    id: "ziggy-road",
    title: "Ziggy Road",
    category: "Racing",
    emoji: "🚗",
    gradient: "from-orange-700 via-red-800 to-black",
    badge: "Hot",
    description: "Navigate the zigzag road and avoid crashes in this driving game.",
    url: "https://ottergames.org/g/ziggy-road",
    players: "58.4k"
  },
  {
    id: "tag-game",
    title: "Tag Game",
    category: "Multiplayer",
    emoji: "🏃",
    gradient: "from-green-700 via-emerald-800 to-black",
    badge: "New",
    description: "Multiplayer tag game - be the fastest and tag other players.",
    url: "https://ottergames.org/g/tag-game",
    players: "27.9k"
  },

  // === PLAYBRAIN & SHAWGAMES SOURCE (Best of 2026) ===
  {
    id: "snow-rider",
    title: "Snow Rider 3D",
    category: "Racing",
    emoji: "🛷",
    gradient: "from-zinc-800 via-neutral-900 to-black",
    badge: "Hot",
    description: "Slide down snowy mountain slopes, avoid giant pine trees, and collect gifts!",
    url: "https://playbrain.games/games/snow-rider",
    players: "142k"
  },
  {
    id: "ovo-platformer-playbrain",
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
    id: "slope-playbrain",
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
    id: "drift-boss-playbrain",
    title: "Drift Boss",
    category: "Racing",
    emoji: "🚗",
    gradient: "from-neutral-800 via-stone-900 to-black",
    badge: "Hot",
    description: "One-button timing drift challenge along sharp sky highway cliffs.",
    url: "https://playbrain.games/games/drift-boss",
    players: "78.9k"
  },
  {
    id: "basketball-stars-playbrain",
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
    id: "eggy-car-shaw",
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
    id: "crazy-cattle-3d-shaw",
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
    id: "eagle-craft-shaw",
    title: "Eagle Craft (Minecraft)",
    category: "Sandbox",
    emoji: "⛏️",
    gradient: "from-green-700 via-lime-800 to-black",
    badge: "Originals",
    description: "Browser-based Minecraft clone with survival and creative modes.",
    url: "https://shawgames.com/game/eagle-craft-unblocked",
    players: "92.1k"
  }
];