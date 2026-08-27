import { MIRRORS } from './data/mirrors.js';

const VOTES_KEY = "mirror_votes";
const SEEDED_KEY = "mirror_votes_seeded_v3";
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
  const partialCount = Math.max(1, Math.floor(total * 0.25));
  const partialIndexes = new Set();
  while (partialIndexes.size < partialCount) {
    const i = Math.floor(Math.random() * total);
    if (!blockedIndexes.has(i) && !partialIndexes.has(i)) {
      partialIndexes.add(i);
    }
  }

  MIRRORS.forEach((m, i) => {
    let up, down;
    if (blockedIndexes.has(i)) {
      down = 100 + Math.floor(Math.random() * 400);
      up = Math.floor(Math.random() * 80);
    } else if (partialIndexes.has(i)) {
      const n = 100 + Math.floor(Math.random() * 200);
      up = n;
      down = n;
    } else {
      up = 100 + Math.floor(Math.random() * 900);
      down = Math.floor(Math.random() * 50);
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
  if (v.up > v.down) return { kind: "unblocked", label: "Unblocked" };
  if (v.down > v.up) return { kind: "blocked", label: "Blocked" };
  return { kind: "partial", label: "Unblocked for some schools" };
}

function statusToIcon(kind) {
  if (kind === "unblocked") return "✓";
  if (kind === "blocked") return "✕";
  if (kind === "partial") return "!";
  return "?";
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
  const status = computeStatus(mirror.url);
  const v = getVoteData(mirror.url);
  const isUp = v.userVote === "up";
  const isDown = v.userVote === "down";
  const badgeHtml = mirror.tag
    ? `<span class="badge-pill badge-${mirror.tag}">${mirror.tag}</span>`
    : "";

  return `
    <div class="link-card" onclick="window.open('${escapeHtml(mirror.url)}', '_blank')">
      <div class="link-left">
        <div class="status-icon ${status.kind}">${statusToIcon(status.kind)}</div>
        <div class="link-info">
          <span class="link-url">${escapeHtml(mirror.name)}${badgeHtml}</span>
          <div class="link-status-text">${status.label}</div>
        </div>
      </div>
      <div class="link-right">
        <button class="vote-btn up ${isUp ? "active" : ""}" onclick="window.__setVote('${escapeHtml(mirror.url)}', 'up', event)" title="Works at my school">👍 <span class="vote-count">${v.up}</span></button>
        <button class="vote-btn down ${isDown ? "active" : ""}" onclick="window.__setVote('${escapeHtml(mirror.url)}', 'down', event)" title="Blocked at my school">👎 <span class="vote-count">${v.down}</span></button>
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
    if (currentFilter === "hot") return m.tag === "hot";
    if (currentFilter === "new") return m.tag === "new";
    return computeStatus(m.url).kind === currentFilter;
  });

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