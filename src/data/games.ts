export interface Game {
  id: string;
  title: string;
  category: string;
  emoji: string;
  gradient: string;
  badge?: "Top" | "Hot" | "Originals" | "New";
  description: string;
  url: string;
  players?: string;
  rating?: number;
}

export const GAMES_DATA: Game[] = [
  {
    id: "war-knights",
    title: "War The Knights",
    category: "Action",
    emoji: "⚔️",
    gradient: "from-blue-900 via-indigo-950 to-slate-900",
    badge: "Top",
    description: "Battle legions of medieval knights in intense sword duels.",
    url: "https://example.com/war-knights",
    players: "12.4k"
  },
  {
    id: "stickman-clash",
    title: "Stickman Clash",
    category: "Action",
    emoji: "🥋",
    gradient: "from-sky-700 via-indigo-900 to-blue-950",
    badge: "Hot",
    description: "Epic stickman brawler action with special laser abilities.",
    url: "https://example.com/stickman-clash",
    players: "45.1k"
  },
  {
    id: "warfare-1942",
    title: "Warfare 1942",
    category: "Action",
    emoji: "🪖",
    gradient: "from-amber-900 via-stone-900 to-neutral-950",
    badge: "Hot",
    description: "Realistic tactical battlefield action with armor & tanks.",
    url: "https://example.com/warfare-1942",
    players: "28.9k"
  },
  {
    id: "fortzone-battle",
    title: "Fortzone Battle",
    category: "Action",
    emoji: "🪂",
    gradient: "from-cyan-600 via-blue-900 to-slate-950",
    badge: "Top",
    description: "Parachute onto the island and outlive 100 players.",
    url: "https://example.com/fortzone",
    players: "89.2k"
  },
  {
    id: "iron-legion",
    title: "Iron Legion",
    category: "Action",
    emoji: "🛡️",
    gradient: "from-orange-800 via-red-950 to-zinc-950",
    badge: "Top",
    description: "Command futuristic tanks and crush hostile armadas.",
    url: "https://example.com/iron-legion",
    players: "19.5k"
  },
  {
    id: "99-nights",
    title: "99 Nights",
    category: "Action",
    emoji: "🌑",
    gradient: "from-blue-950 via-slate-900 to-black",
    badge: "Originals",
    description: "Survive 99 continuous nights in a haunted voxel realm.",
    url: "https://example.com/99-nights",
    players: "34.1k"
  },
  {
    id: "flappy-cube",
    title: "Fly Block 3D",
    category: "Casual",
    emoji: "📦",
    gradient: "from-yellow-500 via-amber-600 to-rose-900",
    badge: "Hot",
    description: "Flap your golden wings and dodge treacherous obstacles.",
    url: "https://example.com/fly-block",
    players: "15.7k"
  },
  {
    id: "level-race",
    title: "Level 999 Runner",
    category: "Casual",
    emoji: "🏃",
    gradient: "from-teal-600 via-emerald-800 to-slate-900",
    description: "Level up your character and outpace rival runners.",
    url: "https://example.com/level-runner",
    players: "22.3k"
  },
  {
    id: "bloons-td",
    title: "Bloons Tower Defense",
    category: "Strategy",
    emoji: "🎈",
    gradient: "from-sky-500 via-blue-700 to-indigo-950",
    badge: "Top",
    description: "Deploy super monkeys to pop incoming balloon waves.",
    url: "https://example.com/bloons-td",
    players: "98.4k"
  },
  {
    id: "build-crush",
    title: "Build & Crush",
    category: "Action",
    emoji: "💣",
    gradient: "from-blue-600 via-indigo-800 to-slate-950",
    badge: "Originals",
    description: "Build colossal structures then destroy them with TNT!",
    url: "https://example.com/build-crush",
    players: "41.6k"
  },
  {
    id: "squad-survival",
    title: "Survival Arena",
    category: "Action",
    emoji: "🎭",
    gradient: "from-purple-800 via-pink-950 to-slate-950",
    badge: "Hot",
    description: "Avoid creepy chasers in a wild multi-room maze.",
    url: "https://example.com/survival-arena",
    players: "63.0k"
  },
  {
    id: "hoop-shot-3d",
    title: "Hoop Shot 3D",
    category: "Sports",
    emoji: "🏀",
    gradient: "from-emerald-600 via-teal-900 to-slate-950",
    badge: "Originals",
    description: "Arc trick shots into the basket across varied arenas.",
    url: "https://example.com/hoop-shot",
    players: "18.2k"
  },
  {
    id: "type-racer",
    title: "Keyboard Speed Drift",
    category: "Racing",
    emoji: "🏎️",
    gradient: "from-slate-700 via-zinc-800 to-neutral-950",
    badge: "Hot",
    description: "Type rapidly along keys to boost your sports car!",
    url: "https://example.com/type-racer",
    players: "14.8k"
  },
  {
    id: "ships-3d",
    title: "Ships 3D",
    category: "Action",
    emoji: "🏴‍☠️",
    gradient: "from-sky-700 via-blue-900 to-slate-950",
    badge: "Top",
    description: "Naval warfare with massive cannons and pirate ships.",
    url: "https://example.com/ships-3d",
    players: "37.5k"
  },
  {
    id: "lumen-puzzle",
    title: "Lumen Core",
    category: "Puzzle",
    emoji: "🔮",
    gradient: "from-violet-900 via-purple-950 to-slate-950",
    description: "Reflect radiant light rays through optical black holes.",
    url: "https://example.com/lumen",
    players: "9.3k"
  },
  {
    id: "stickman-kombat-2d",
    title: "Stickman Kombat 2D",
    category: "Action",
    emoji: "🥷",
    gradient: "from-yellow-700 via-amber-900 to-stone-950",
    badge: "Hot",
    description: "Master martial arts combos in high-velocity fights.",
    url: "https://example.com/stickman-kombat",
    players: "52.7k"
  },
  {
    id: "house-of-hazards",
    title: "House of Hazards",
    category: "Action",
    emoji: "🏠",
    gradient: "from-emerald-700 via-green-950 to-neutral-950",
    badge: "Top",
    description: "Hilarious multiplayer chaos dodging toaster traps!",
    url: "https://example.com/house-of-hazards",
    players: "84.2k"
  },
  {
    id: "fighter-2-player",
    title: "Fighter 2 Player",
    category: "Action",
    emoji: "🥊",
    gradient: "from-blue-600 via-indigo-900 to-cyan-950",
    badge: "Originals",
    description: "Grab a friend on the same keyboard for ragdoll boxing.",
    url: "https://example.com/fighter-2-player",
    players: "30.1k"
  },
  {
    id: "shell-shockers",
    title: "Shell Shockers",
    category: "Action",
    emoji: "🥚",
    gradient: "from-amber-600 via-orange-900 to-stone-950",
    badge: "Top",
    description: "Multiplayer first-person egg shooter arena.",
    url: "https://example.com/shellshockers",
    players: "112k"
  },
  {
    id: "slope-3d",
    title: "Slope 3D",
    category: "Action",
    emoji: "⛰️",
    gradient: "from-emerald-600 via-green-900 to-slate-950",
    badge: "Top",
    description: "Roll down infinite neon slopes at breakneck speeds.",
    url: "https://example.com/slope",
    players: "95.6k"
  },
  {
    id: "run-3",
    title: "Run 3 Space",
    category: "Casual",
    emoji: "🚀",
    gradient: "from-indigo-600 via-violet-900 to-zinc-950",
    badge: "Top",
    description: "Run through planetary tunnels defying gravity.",
    url: "https://example.com/run3",
    players: "72.4k"
  },
  {
    id: "moto-x3m",
    title: "Moto X3M Pool Party",
    category: "Racing",
    emoji: "🏍️",
    gradient: "from-orange-600 via-amber-800 to-neutral-950",
    badge: "Hot",
    description: "Perform crazy motorbike flips over deadly obstacles.",
    url: "https://example.com/moto-x3m",
    players: "68.9k"
  },
  {
    id: "fireboy-watergirl",
    title: "Fireboy & Watergirl",
    category: "Puzzle",
    emoji: "🔥",
    gradient: "from-rose-700 via-indigo-900 to-slate-950",
    badge: "Top",
    description: "Cooperative dungeon puzzles with elemental duos.",
    url: "https://example.com/fireboy",
    players: "80.3k"
  },
  {
    id: "cookie-clicker",
    title: "Cookie Empire",
    category: "Casual",
    emoji: "🍪",
    gradient: "from-amber-700 via-yellow-900 to-stone-950",
    badge: "Hot",
    description: "Click your way to trillions of sweet cookies.",
    url: "https://example.com/cookie-clicker",
    players: "49.1k"
  },
  {
    id: "subway-surfers",
    title: "Metro Subway Rush",
    category: "Casual",
    emoji: "🚇",
    gradient: "from-cyan-600 via-blue-900 to-slate-950",
    badge: "Top",
    description: "Dash along train tracks and dodge oncoming obstacles.",
    url: "https://example.com/subway-surfers",
    players: "120k"
  },
  {
    id: "geometry-dash",
    title: "Neon Dash Challenge",
    category: "Casual",
    emoji: "🔷",
    gradient: "from-fuchsia-600 via-purple-900 to-zinc-950",
    badge: "Hot",
    description: "Rhythm-based jump mechanics with adrenaline music.",
    url: "https://example.com/geometry-dash",
    players: "78.2k"
  },
  {
    id: "mine-craft-voxel",
    title: "Voxel Craft Builder",
    category: "Strategy",
    emoji: "⛏️",
    gradient: "from-emerald-700 via-teal-950 to-neutral-950",
    badge: "Top",
    description: "Mine blocks, craft tools and build towering castles.",
    url: "https://example.com/voxel-craft",
    players: "150k"
  },
  {
    id: "fall-party",
    title: "Fall Party Royale",
    category: "Casual",
    emoji: "👑",
    gradient: "from-pink-600 via-purple-900 to-slate-950",
    badge: "Originals",
    description: "Stumble through hilarious physics mini-games.",
    url: "https://example.com/fall-party",
    players: "61.3k"
  },
  {
    id: "cyber-drift",
    title: "Cyberpunk Drift",
    category: "Racing",
    emoji: "🏎️",
    gradient: "from-violet-700 via-fuchsia-950 to-slate-950",
    badge: "New",
    description: "Drift high-performance supercars through neon city curves.",
    url: "https://example.com/cyber-drift",
    players: "21.0k"
  },
  {
    id: "dragon-slayer-rpg",
    title: "Dragon Slayer RPG",
    category: "Action",
    emoji: "🐉",
    gradient: "from-red-700 via-orange-950 to-black",
    badge: "New",
    description: "Hunt ancient mythical dragons and forge fiery blades.",
    url: "https://example.com/dragon-slayer",
    players: "33.7k"
  },
  {
    id: "pixel-dungeon",
    title: "Pixel Rogue Dungeon",
    category: "Action",
    emoji: "🗝️",
    gradient: "from-stone-700 via-zinc-900 to-black",
    badge: "New",
    description: "Crawl through randomly generated dungeons with loot.",
    url: "https://example.com/pixel-dungeon",
    players: "19.8k"
  },
  {
    id: "galaxy-conquest",
    title: "Galaxy Fleet Wars",
    category: "Strategy",
    emoji: "🌌",
    gradient: "from-blue-700 via-indigo-950 to-black",
    badge: "Originals",
    description: "Build star cruisers and conquer solar sectors.",
    url: "https://example.com/galaxy-fleet",
    players: "25.4k"
  },
  {
    id: "archery-master",
    title: "Precision Bow 3D",
    category: "Sports",
    emoji: "🎯",
    gradient: "from-emerald-700 via-cyan-950 to-slate-950",
    badge: "New",
    description: "Hit bullseyes in turbulent wind conditions.",
    url: "https://example.com/archery-3d",
    players: "16.1k"
  },
  {
    id: "circus-acrobat",
    title: "Circus Acrobat Stars",
    category: "Casual",
    emoji: "🎪",
    gradient: "from-rose-600 via-red-950 to-neutral-950",
    badge: "New",
    description: "Perform daring high-flying trapeze stunts.",
    url: "https://example.com/circus-stars",
    players: "11.2k"
  },
  {
    id: "dice-tactics",
    title: "Dice & Tactics",
    category: "Strategy",
    emoji: "🎲",
    gradient: "from-purple-700 via-indigo-950 to-slate-950",
    badge: "New",
    description: "Roll enchanted dice to cast spells in turn-based combat.",
    url: "https://example.com/dice-tactics",
    players: "14.0k"
  },
  {
    id: "magic-academy",
    title: "Wizard Spellcraft",
    category: "Action",
    emoji: "🧙‍♂️",
    gradient: "from-violet-800 via-indigo-950 to-black",
    badge: "Originals",
    description: "Combine spell runes to unleash cosmic sorcery.",
    url: "https://example.com/wizard-craft",
    players: "29.9k"
  }
];