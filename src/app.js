import { MIRRORS } from './data/mirrors.js';

const VOTES_KEY = "mirror_votes";
const SEEDED_KEY = "mirror_votes_seeded_v7";
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
  while (blockedIndexes.size < Math.min(6, Math.floor(total * 0.15))) {
    blockedIndexes.add(Math.floor(Math.random() * total));
  }

  MIRRORS.forEach((m, i) => {
    let up, down;
    if (blockedIndexes.has(i)) {
      down = 120 + Math.floor(Math.random() * 380);
      up = 20 + Math.floor(Math.random() * 60);
    } else {
      up = 180 + Math.floor(Math.random() * 850);
      const maxDown = Math.max(15, Math.floor(up * 0.15));
      down = 10 + Math.floor(Math.random() * maxDown);
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
  
  if (current.userVote === direction) {
    if (direction === "up") {
      votes[url] = { up: Math.max(0, current.up - 1), down: current.down, userVote: null };
    } else {
      votes[url] = { up: current.up, down: Math.max(0, current.down - 1), userVote: null };
    }
  } else {
    let newUp = current.up;
    let newDown = current.down;
    
    if (current.userVote === "up") newUp = Math.max(0, current.up - 1);
    else if (current.userVote === "down") newDown = Math.max(0, current.down - 1);
    
    if (direction === "up") newUp += 1;
    else newDown += 1;
    
    votes[url] = { up: newUp, down: newDown, userVote: direction };
  }
  
  saveVotes(votes);
  renderAll();
}

function computeStatus(url) {
  const v = getVoteData(url);
  const total = v.up + v.down;
  if (total === 0) return { kind: "new", label: "Unverified" };
  const upPercent = Math.round((v.up / total) * 100);
  if (upPercent >= 70) return { kind: "recommended", label: "Recommended" };
  if (upPercent < 45) return { kind: "low", label: "Low rated" };
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
  
  const total = v.up + v.down;
  const upPercent = total === 0 ? 95 : Math.round((v.up / total) * 100);
  const downPercent = total === 0 ? 5 : Math.round((v.down / total) * 100);
  const cleanUrl = mirror.url.replace(/^https?:\/\//, "");

  return `
    <div class="link-card" onclick="window.open('${escapeHtml(mirror.url)}', '_blank')">
      <div class="link-left">
        <div class="link-dot-status"></div>
        <div class="link-info">
          <span class="link-url">${escapeHtml(mirror.name)}</span>
          <span class="link-sub-url">${escapeHtml(cleanUrl)}</span>
        </div>
      </div>
      <div class="link-right">
        <button class="glass-btn up ${isUp ? "active" : ""}" onclick="window.__setVote('${escapeHtml(mirror.url)}', 'up', event)" title="Works at my school" aria-label="Upvote">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
          <span>${upPercent}%</span>
        </button>
        <button class="glass-btn down ${isDown ? "active" : ""}" onclick="window.__setVote('${escapeHtml(mirror.url)}', 'down', event)" title="Blocked at my school" aria-label="Downvote">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2-1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
          <span>${downPercent}%</span>
        </button>
        <button class="glass-btn-cta" onclick="event.stopPropagation(); window.open('${escapeHtml(mirror.url)}', '_blank')">
          Launch ↗
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
    const matchesSearch = !term || m.name.toLowerCase().includes(term) || m.url.toLowerCase().includes(term) || (m.category || "").toLowerCase().includes(term);
    if (!matchesSearch) return false;

    if (currentFilter === "all") return true;
    if (currentFilter === "hot") return m.tag === "hot";
    if (currentFilter === "new") return m.tag === "new";
    if (currentFilter === "recommended") return computeStatus(m.url).kind === "recommended";
    return false;
  });

  if (currentFilter === "hot") {
    filtered = [...filtered].sort((a, b) => getVoteData(b.url).up - getVoteData(a.url).up);
  }

  const countEl = document.getElementById("results-count");
  if (countEl) {
    countEl.textContent = filtered.length === MIRRORS.length
      ? `${MIRRORS.length} sites`
      : `${filtered.length} of ${MIRRORS.length} sites`;
  }

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state">No results for "${escapeHtml(searchTerm || currentFilter)}".</div>`;
    return;
  }

  list.innerHTML = filtered.map(renderLinkCard).join("");
}

export function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll(".filter-glass-pill").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.filter === filter);
  });
  renderAll();
}

window.__setVote = setVote;
window.__setFilter = setFilter;

export function init() {
  seedRandomVotes();

  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("search-clear");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value;
      if (clearBtn) clearBtn.style.display = searchTerm ? "flex" : "none";
      renderAll();
    });

    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchTerm = "";
      if (searchInput) { searchInput.value = ""; searchInput.focus(); }
      clearBtn.style.display = "none";
      renderAll();
    });
  }

  document.querySelectorAll(".filter-glass-pill").forEach((chip) => {
    chip.addEventListener("click", () => {
      setFilter(chip.dataset.filter);
    });
  });

  renderAll();
}

init();
initBrowser();

function initBrowser() {
  const overlay    = document.getElementById("proxy-browser-overlay");
  const openBtn    = document.getElementById("open-browser");
  const closeBtn   = document.getElementById("browser-close");
  const urlInput   = document.getElementById("browser-url");
  const goBtn      = document.getElementById("browser-go");
  const frame      = document.getElementById("browser-frame");
  const backBtn    = document.getElementById("browser-back");
  const fwdBtn     = document.getElementById("browser-forward");
  const refreshBtn = document.getElementById("browser-refresh");
  const statusBar  = document.getElementById("browser-status-bar");
  const statusText = document.getElementById("browser-status-text");
  const blockedMsg = document.getElementById("browser-blocked-msg");
  const openTabBtn = document.getElementById("browser-open-tab");

  if (!overlay || !frame) return;

  // Proxy endpoint – fetches any URL server-side, strips X-Frame-Options / CSP headers
  const PROXY = "https://api.allorigins.win/raw?url=";

  const hist = [];
  let histIdx = -1;
  let currentUrl = "";
  let prevBlobUrl = null;
  let busy = false;

  function normalizeUrl(raw) {
    raw = raw.trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    if (/^localhost|^\d{1,3}\.\d{1,3}/.test(raw)) return "http://" + raw;
    // Treat as search query if it contains spaces or has no dot
    if (raw.includes(" ") || !raw.includes(".")) {
      return "https://duckduckgo.com/?q=" + encodeURIComponent(raw);
    }
    return "https://" + raw;
  }

  function setStatus(msg) {
    if (!msg) { statusBar.style.display = "none"; return; }
    statusBar.style.display = "block";
    statusText.textContent = msg;
  }

  function updateNavBtns() {
    backBtn.disabled = histIdx <= 0;
    fwdBtn.disabled  = histIdx >= hist.length - 1;
  }

  // Rewrite HTML so relative links resolve correctly and clicks are intercepted
  function injectProxy(html, pageUrl) {
    let basePath = pageUrl;
    try {
      const u = new URL(pageUrl);
      basePath = u.origin + u.pathname.replace(/[^/]*$/, "");
    } catch (_) {}

    // Interceptor is injected into the fetched page – it sends clicked hrefs back via postMessage
    const interceptor = `<script>(function(){
      document.addEventListener('click',function(e){
        var a=e.target;while(a&&a.tagName!=='A')a=a.parentElement;
        if(a&&a.href&&!/^(javascript:|blob:|#)/.test(a.getAttribute('href')||'')){
          e.preventDefault();e.stopPropagation();
          window.parent.postMessage({__pb:a.href},'*');
        }
      },true);
      document.addEventListener('submit',function(e){e.preventDefault();},true);
    })();<` + `/script>`;

    const baseTag = `<base href="${basePath}">`;
    const inject  = baseTag + interceptor;

    if (/<head[\s>]/i.test(html)) return html.replace(/<head([\s>][^>]*)?>/i, m => m + inject);
    return inject + html;
  }

  async function navigate(url, pushHistory = true) {
    if (!url || busy) return;
    busy = true;

    blockedMsg.style.display = "none";
    frame.style.display = "block";
    currentUrl = url;
    urlInput.value = url;
    setStatus("Proxying…");

    if (pushHistory) {
      hist.splice(histIdx + 1);
      hist.push(url);
      histIdx = hist.length - 1;
    }
    updateNavBtns();
    if (openTabBtn) openTabBtn.onclick = () => window.open(url, "_blank");

    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);

    try {
      const res = await fetch(PROXY + encodeURIComponent(url), { signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error("HTTP " + res.status);

      const html = await res.text();
      const blob = new Blob([injectProxy(html, url)], { type: "text/html; charset=utf-8" });
      if (prevBlobUrl) URL.revokeObjectURL(prevBlobUrl);
      prevBlobUrl = URL.createObjectURL(blob);
      frame.src = prevBlobUrl;
      setStatus("");
    } catch (_) {
      clearTimeout(timer);
      setStatus("");
      frame.style.display = "none";
      blockedMsg.style.display = "flex";
    } finally {
      busy = false;
    }
  }

  // Navigation messages from inside the proxied page
  window.addEventListener("message", (e) => {
    if (e.data && e.data.__pb) navigate(e.data.__pb);
  });

  frame.addEventListener("load", () => setStatus(""));

  function openOverlay() {
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
    if (!currentUrl) navigate("https://duckduckgo.com");
    else urlInput.focus();
  }

  function closeOverlay() {
    overlay.style.display = "none";
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", openOverlay);
  closeBtn.addEventListener("click", closeOverlay);
  goBtn.addEventListener("click", () => navigate(normalizeUrl(urlInput.value)));
  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") navigate(normalizeUrl(urlInput.value));
  });
  backBtn.addEventListener("click", () => {
    if (histIdx > 0) { histIdx--; navigate(hist[histIdx], false); }
  });
  fwdBtn.addEventListener("click", () => {
    if (histIdx < hist.length - 1) { histIdx++; navigate(hist[histIdx], false); }
  });
  refreshBtn.addEventListener("click", () => {
    if (currentUrl) navigate(currentUrl, false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.style.display !== "none") closeOverlay();
  });
}