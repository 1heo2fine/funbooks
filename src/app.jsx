import { MIRRORS } from './data/mirrors.js';

const VOTES_KEY = "mirror_votes";
const SEEDED_KEY = "mirror_votes_seeded_v6";
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
  
  // If clicking same vote again, toggle off
  if (current.userVote === direction) {
    if (direction === "up") {
      votes[url] = { 
        up: Math.max(0, current.up - 1), 
        down: current.down, 
        userVote: null 
      };
    } else {
      votes[url] = { 
        up: current.up, 
        down: Math.max(0, current.down - 1), 
        userVote: null 
      };
    }
  } else {
    // Switching from opposite vote or new vote
    let newUp = current.up;
    let newDown = current.down;
    
    // Remove opposite vote if exists
    if (current.userVote === "up") {
      newUp = Math.max(0, current.up - 1);
    } else if (current.userVote === "down") {
      newDown = Math.max(0, current.down - 1);
    }
    
    // Add new vote
    if (direction === "up") {
      newUp += 1;
    } else {
      newDown += 1;
    }
    
    votes[url] = { 
      up: newUp, 
      down: newDown, 
      userVote: direction 
    };
  }
  
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

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&",
    "<": "<",
    ">": ">",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
}

function renderLinkCard(mirror) {
  const v = getVoteData(mirror.url);
  const isUp = v.userVote === "up";
  const isDown = v.userVote === "down";
  
  // Calculate percentages
  const total = v.up + v.down;
  const upPercent = total === 0 ? 0 : Math.round((v.up / total) * 100);
  const downPercent = total === 0 ? 0 : Math.round((v.down / total) * 100);

  return `
    <div class="link-card" onclick="window.open('${escapeHtml(mirror.url)}', '_blank')">
      <div class="link-left">
        <div class="link-info">
          <span class="link-url">${escapeHtml(mirror.name)}</span>
        </div>
      </div>
      <div class="link-right">
        <button class="vote-btn up ${isUp ? "active" : ""}" onclick="window.__setVote('${escapeHtml(mirror.url)}', 'up', event)" title="Works at my school" aria-label="Upvote: works at my school">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
          <span class="vote-count">${upPercent}%</span>
        </button>
        <button class="vote-btn down ${isDown ? "active" : ""}" onclick="window.__setVote('${escapeHtml(mirror.url)}', 'down', event)" title="Blocked at my school" aria-label="Downvote: blocked at my school">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2-1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
          <span class="vote-count">${downPercent}%</span>
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
      localStorage.removeItem("mirror_votes_seeded_v5");
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