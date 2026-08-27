import { MIRRORS } from './data/mirrors.js';

const VOTES_KEY = "mirror_votes";
const SEEDED_KEY = "mirror_votes_seeded_v5";
let currentFilter = "all";
let searchTerm = "";

function loadVotes() {
  try {
    return JSON.parse(localStorage.getItem(VOTES_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

function saveVotes(votes) {
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

function getVoteData(url) {
  const votes = loadVotes();
  return votes[url] || { up: 0, down: 0, userVote: null };
}

function seedRandomVotes() {
  if (localStorage.getItem(SEEDED_KEY)) return;
  const votes = {};
  const total = MIRRORS.length;
  const blockedIndexes = new Set();
  while (blockedIndexes.size < 4) {
    blockedIndexes.add(Math.floor(Math.random() * total));
  }

  MIRRORS.forEach((m, i) => {
    let up, down;
    if (blockedIndexes.has(i)) {
      down = 100 + Math.floor(Math.random() * 400);
      up = Math.floor(Math.random() * 80);
    } else {
      up = 100 + Math.floor(Math.random() * 900);
      const maxDown = Math.max(20, up - 30 - Math.floor(Math.random() * 40));
      down = 20 + Math.floor(Math.random() * (maxDown - 20));
      if (down >= up) down = Math.max(0, up - 1);
    }
    votes[m.url] = { up, down, userVote: null };
  });
  saveVotes(votes);
  localStorage.setItem(SEEDED_KEY, "1");
}

export function setVote(url, direction, event) {
  if (event) event.stopPropagation();
  const votes = loadVotes();
  const current = votes[url] || { up: 0, down: 0, userVote: null };
  const newVote = { up: current.up, down: current.down, userVote: current.userVote };

  if (newVote.userVote === direction) {
    if (direction === "up") newVote.up = Math.max(0, newVote.up - 1);
    else newVote.down = Math.max(0, newVote.down - 1);
    newVote.userVote = null;
  } else {
    if (newVote.userVote === "up") newVote.up = Math.max(0, newVote.up - 1);
    else if (newVote.userVote === "down") newVote.down = Math.max(0, newVote.down - 1);
    if (direction === "up") newVote.up += 1;
    else newVote.down += 1;
    newVote.userVote = direction;
  }

  votes[url] = newVote;
  saveVotes(votes);
  renderAll();
}

function computeStatus(url) {
  const v = getVoteData(url);
  const total = v.up + v.down;
  if (total === 0) return { kind: "new", label: "Unverified" };
  if (v.up > v.down) return { kind: "recommended", label: "Recommended" };
  if (v.down > v.up) return { kind: "low", label: "Low rated" };
  return { kind: "recommended", label: "Recommended" };
}

function getPercentages(url) {
  const v = getVoteData(url);
  const total = v.up + v.down;
  if (total === 0) return { likePct: 0, dislikePct: 0 };
  const likePct = Math.round((v.up / total) * 100);
  const dislikePct = 100 - likePct;
  return { likePct, dislikePct };
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&",
    "<": "<",
    ">": ">",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
}

function getFaviconEmoji(name) {
  const emojiMap = {
    "unblocked": "🎮", "coolmath": "🧮", "poki": "🎯", "crazygames": "🎲",
    "kizi": "🎪", "gogy": "🎨", "github": "🐙", "gitlab": "🦊", "vercel": "▲",
    "netlify": "🌐", "glitch": "🐛", "replit": "📦", "cloudflare": "☁️",
    "surge": "⚡", "neocities": "🏙️", "firebase": "🔥", "aws": "☁️",
    "azure": "☁️", "gcp": "☁️", "digitalocean": "🌊", "linode": "📦",
    "vultr": "☁️", "scratch": "🐱", "pbs": "📺", "hooda": "📐",
    "abcya": "🔤", "funbrain": "🧠", "mathplayground": "🧮", "prodigy": "🧙",
    "classroom": "🏫", "tyrone": "🎮", "unblockedhub": "🔓", "kazwire": "⚡",
    "cosmic": "🌌", "radon": "☢️", "3kh0": "🎯", "pyrus": "🔮",
    "croxy": "🔐", "hidester": "🕵️", "proxysite": "🌐", "whoer": "🔍",
    "bipass": "🚪", "paper": "📄", "minecraft": "⛏️", "retro": "🕹️",
    "shell": "🥚", "krunker": "💥", "surviv": "⚔️", "smash": "🏎️",
    "snake": "🐍", "state": "🌍", "people": "🧑", "among": "🛸",
    "monopoly": "🎲", "paperio": "🖍️", "stickman": "🪝", "temple": "🗿",
    "cut": "🍬", "subway": "🚇", "slope": "⛰️", "moto": "🏍️",
    "drift": "🏎️", "death": "💀", "rooftop": "🎯", "bullet": "💥",
    "drive": "🚗", "crossy": "🐔", "time": "⏱️", "getaway": "🏃",
    "run": "🚀", "fireboy": "🔥", "geometry": "📐", "vex": "⚡",
    "karlson": "🚀", "redball": "🔴", "ovo": "🏃", "happy": "♿",
    "badice": "🍦", "2048": "🔢", "block": "🧩", "bloons": "🎈",
    "chess": "♟️", "worlds": "💀", "retrobowl": "🏈", "basketball": "🏀",
    "soccer": "⚽", "basketrandom": "🏀", "driftboss": "🚗", "snow": "🛷",
    "polytrack": "🏎️", "cookie": "🍪", "eggy": "🥚", "tiny": "🎣",
    "bitlife": "📱", "adventure": "💰", "1v1": "🔫"
  };

  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (lower.includes(key)) return emoji;
  }
  return "🔗";
}

function renderLinkCard(mirror) {
  const v = getVoteData(mirror.url);
  const isUp = v.userVote === "up";
  const isDown = v.userVote === "down";
  const { likePct, dislikePct } = getPercentages(mirror.url);
  const favicon = getFaviconEmoji(mirror.name);

  return `
    <div class="link-card" onclick="window.open('${escapeHtml(mirror.url)}', '_blank')">
      <div class="link-left">
        <div class="link-favicon" aria-hidden="true">${favicon}</div>
        <div class="link-info">
          <span class="link-url">${escapeHtml(mirror.name)}</span>
        </div>
      </div>
      <div class="link-right">
        <button class="vote-btn up ${isUp ? "active" : ""}" onclick="window.__setVote('${escapeHtml(mirror.url)}', 'up', event)" title="Works at my school" aria-label="Upvote: works at my school">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
          <span class="vote-count">${likePct}%</span>
        </button>
        <button class="vote-btn down ${isDown ? "active" : ""}" onclick="window.__setVote('${escapeHtml(mirror.url)}', 'down', event)" title="Blocked at my school" aria-label="Downvote: blocked at my school">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
          <span class="vote-count">${dislikePct}%</span>
        </button>
      </div>
    </div>
  `;
}

export function renderAll() {
  const list = document.getElementById("links-list");
  if (!list) return;
  const term = searchTerm.toLowerCase();

  let filtered = MIRRORS.filter((m) => {
    const matchesSearch = !term || m.name.toLowerCase().includes(term) || m.url.toLowerCase().includes(term);
    if (!matchesSearch) return false;

    if (currentFilter === "all") return true;
    if (currentFilter === "hot") return true;
    if (currentFilter === "new") return m.tag === "new";
    return computeStatus(m.url).kind === currentFilter;
  });

  if (currentFilter === "hot") {
    filtered = [...filtered].sort((a, b) => getVoteData(b.url).up - getVoteData(a.url).up).slice(0, 5);
  }

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state">No links match your search.</div>`;
    return;
  }

  list.innerHTML = filtered.map(renderLinkCard).join("");
}

export function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.filter === filter);
  });
  renderAll();
}

window.__setVote = setVote;
window.__setFilter = setFilter;

export function init() {
  try {
    const previousSeed = localStorage.getItem(SEEDED_KEY);
    if (!previousSeed) {
      localStorage.removeItem("mirror_votes_seeded_v4");
      localStorage.removeItem("mirror_votes_seeded_v3");
      localStorage.removeItem(VOTES_KEY);
    }
  } catch (e) {}

  seedRandomVotes();

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value;
      renderAll();
    });
  }

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      setFilter(chip.dataset.filter);
    });
  });

  renderAll();
}

init();