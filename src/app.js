import { MIRRORS } from './data/mirrors.js';

const VOTES_KEY = "mirror_votes";
const SEEDED_KEY = "mirror_votes_seeded_v8";
let currentFilter = "recommended";
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

const AVATAR_COLORS = ['#6366f1','#8b5cf6','#ec4899','#ef4444','#f59e0b','#10b981','#3b82f6','#06b6d4','#84cc16','#f97316'];

function siteAvatar(name, size = 56) {
  const col = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  const initial = (name[0] || '?').toUpperCase();
  const fs = Math.round(size * 0.48);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'><rect width='${size}' height='${size}' rx='${Math.round(size*0.2)}' fill='${col}'/><text x='${size/2}' y='${size*0.7}' font-family='system-ui,sans-serif' font-size='${fs}' font-weight='800' text-anchor='middle' fill='white'>${initial}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function renderLinkCard(mirror) {
  const v = getVoteData(mirror.url);
  const isUp = v.userVote === "up";
  const isDown = v.userVote === "down";

  const total = v.up + v.down;
  const upPercent = total === 0 ? 95 : Math.round((v.up / total) * 100);
  const downPercent = total === 0 ? 5 : Math.round((v.down / total) * 100);
  const cleanUrl = mirror.url.replace(/^https?:\/\//, "");

  const isHot = mirror.tag === "hot";
  const isIo = mirror.tag === "io";
  const domain = (() => { try { return new URL(mirror.url).hostname; } catch { return ""; } })();
  const thumbHtml = (isHot || isIo) ? `
    <img class="link-card-thumb${isIo ? " link-card-thumb-io" : ""}"
      src="${siteAvatar(mirror.name, 56)}"
      data-real="${isIo
        ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`
        : `https://logo.clearbit.com/${encodeURIComponent(domain)}`}"
      alt=""
      loading="lazy">` : "";

  return `
    <div class="link-card${(isHot || isIo) ? " link-card-hot" : ""}" onclick="window.open('${escapeHtml(mirror.url)}', '_blank')">
      ${thumbHtml}
      <div class="link-left">
        <div class="link-dot-status"></div>
        <div class="link-info">
          <span class="link-url">${escapeHtml(mirror.name)}${mirror.star ? ' <span class="link-star">★</span>' : ''}</span>
          <span class="link-sub-url">${escapeHtml(cleanUrl)}</span>
          ${mirror.hint ? `<span class="link-hint">${escapeHtml(mirror.hint)}</span>` : ""}
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
    if (currentFilter === "io") return m.tag === "io";
    if (currentFilter === "recommended") return m.featured || computeStatus(m.url).kind === "recommended";
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
  upgradeAvatars(list);
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

function upgradeAvatars(root = document) {
  root.querySelectorAll('img[data-real]').forEach(img => {
    const url = img.dataset.real;
    if (!url) return;
    const probe = new Image();
    probe.onload = () => { img.src = url; delete img.dataset.real; };
    probe.src = url;
  });
}

const GAMES = {};

function safeInit(fn) {
  try { fn(); } catch (e) { console.error("[init error]", fn.name, e); }
}

safeInit(init);
safeInit(initHotBanner);
safeInit(upgradeAvatars);
safeInit(initInstagram);
safeInit(initQuickHide);
safeInit(initGamesHub);
safeInit(initPlaneGame);
safeInit(initSnakeGame);
safeInit(initBrickGame);
safeInit(initMemoryGame);
safeInit(initTttGame);
safeInit(initSpaceGame);
safeInit(initSpeedTapGame);
safeInit(initDuelGame);

function initQuickHide() {
  const overlay = document.getElementById("book-overlay");
  if (!overlay) return;

  const pages = Array.from(overlay.querySelectorAll(".book-page"));
  let cur = 0;
  const originalTitle = document.title;

  const pageTitles = [
    "Ch. 7 – Cellular Energy | AP Biology",
    "Ch. 8 – Genetics & Heredity | AP Biology",
    "Ch. 4 – The Cell Cycle | AP Biology",
    "Ch. 11 – Evolution | AP Biology",
    "Ch. 3 – Macromolecules | AP Biology",
  ];

  function showPage(n) {
    cur = ((n % pages.length) + pages.length) % pages.length;
    pages.forEach((p, i) => { p.style.display = i === cur ? "block" : "none"; });
    if (overlay.classList.contains("visible")) document.title = pageTitles[cur];
  }

  function open()  { overlay.classList.add("visible");    document.title = pageTitles[cur]; }
  function close() { overlay.classList.remove("visible"); document.title = originalTitle; }
  function toggle() { overlay.classList.contains("visible") ? close() : open(); }

  showPage(0);

  const hint = document.getElementById("hide-hint");
  if (hint) hint.addEventListener("click", toggle);

  overlay.addEventListener("click", (e) => {
    if (e.target.closest(".book-unhide-btn")) close();
    if (e.target.closest(".book-prev")) showPage(cur - 1);
    if (e.target.closest(".book-next")) showPage(cur + 1);
  });

  document.addEventListener("keydown", (e) => {
    const typing = document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA";
    if ((e.key === "q" || e.key === "Q") && !typing) { e.preventDefault(); toggle(); }
    if (overlay.classList.contains("visible")) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown")  { e.preventDefault(); showPage(cur + 1); }
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")    { e.preventDefault(); showPage(cur - 1); }
    }
  });
}

function initGamesHub() {
  const fab = document.getElementById("games-fab");
  const sidebar = document.getElementById("games-sidebar");
  const bd = document.getElementById("games-sidebar-bd");
  const closeX = document.getElementById("games-sidebar-x");
  if (!fab || !sidebar || !bd || !closeX) return;

  function open() { sidebar.classList.add("open"); bd.classList.add("open"); document.body.style.overflow = "hidden"; }
  function close() { sidebar.classList.remove("open"); bd.classList.remove("open"); document.body.style.overflow = ""; }

  fab.addEventListener("click", open);
  closeX.addEventListener("click", close);
  bd.addEventListener("click", close);

  sidebar.querySelectorAll(".game-card").forEach(card => {
    card.addEventListener("click", () => {
      close();
      const g = card.dataset.game;
      setTimeout(() => { if (GAMES[g]) GAMES[g](); }, 80);
    });
  });

  // Generic close buttons on all game modals
  document.querySelectorAll(".game-modal-close").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.for;
      if (id) { const el = document.getElementById(id); if (el) { el.classList.remove("open"); document.body.style.overflow = ""; } }
      if (GAMES._stopActive) GAMES._stopActive();
    });
  });
}

function initHotBanner() {
  const track = document.getElementById("hot-track");
  const dotsEl = document.getElementById("hot-dots");
  if (!track || !dotsEl) return;

  const daySeed = Math.floor(Date.now() / 86400000);
  function seededRand(seed) {
    let s = seed;
    return function() {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 0xffffffff;
    };
  }
  const rand = seededRand(daySeed);

  const studysync = MIRRORS.find(m => m.url === "https://studysync.co.uk");
  const pool = MIRRORS.filter(m => m.url !== "https://studysync.co.uk");
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const picks = [studysync, ...shuffled.slice(0, 3)].filter(Boolean);

  picks.forEach((m, i) => {
    const cleanUrl = m.url.replace(/^https?:\/\//, "");
    const domain = new URL(m.url).hostname;
    const slide = document.createElement("div");
    slide.className = "hot-slide";
    slide.onclick = () => window.open(m.url, "_blank");
    slide.innerHTML = `
      <img class="hot-slide-favicon" src="${siteAvatar(m.name, 32)}" data-real="https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64" alt="" loading="lazy">
      <div>
        <span class="hot-slide-name">${escapeHtml(m.name)}${m.star ? ' <span class="hot-slide-star">★</span>' : ''}</span>
        <span class="hot-slide-domain">${escapeHtml(cleanUrl)}</span>
      </div>
      <span class="hot-slide-arrow">↗</span>
    `;
    track.appendChild(slide);

    const dot = document.createElement("div");
    dot.className = "hot-dot" + (i === 0 ? " active" : "");
    dotsEl.appendChild(dot);
  });

  let current = 0;
  const dots = () => dotsEl.querySelectorAll(".hot-dot");

  function goTo(idx) {
    current = ((idx % picks.length) + picks.length) % picks.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots().forEach((d, i) => d.classList.toggle("active", i === current));
  }

  setInterval(() => goTo(current + 1), 3000);
}

function initInstagram() {
  const overlay    = document.getElementById("ig-overlay");
  const openBtn    = document.getElementById("ig-fab");
  const closeBtn   = document.getElementById("ig-close");
  const statusEl   = document.getElementById("ig-status");
  const frame      = document.getElementById("ig-frame");
  const blockedMsg = document.getElementById("ig-blocked");
  const openTabBtn = document.getElementById("ig-open-tab");

  if (!overlay || !frame) return;

  const PROXIES = [
    "https://api.allorigins.win/raw?url=",
    "https://corsproxy.io/?",
    "https://api.codetabs.com/v1/proxy?quest=",
  ];

  const IG_ORIGINS = ["instagram.com", "cdninstagram.com", "fbcdn.net", "lite.instagram.com"];
  let prevBlobUrl = null;
  let busy = false;

  function isIgUrl(url) {
    try {
      const h = new URL(url).hostname.replace(/^www\./, "");
      return IG_ORIGINS.some(o => h === o || h.endsWith("." + o));
    } catch (_) { return false; }
  }

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  function buildInjected(html, pageUrl) {
    const PROXY = "https://api.allorigins.win/raw?url=";
    const IG_BASE = pageUrl ? new URL(pageUrl).origin : "https://www.instagram.com";

    // Strip CSP/X-Frame-Options meta tags and SRI integrity (will be invalid after URL rewriting)
    html = html.replace(/<meta\s[^>]*http-equiv\s*=\s*["']?(?:content-security-policy|x-frame-options)["']?[^>]*>/gi, "");
    html = html.replace(/\s+integrity="sha\d+-[^"]*"/gi, "");
    html = html.replace(/\s+crossorigin="[^"]*"/gi, "");

    // Rewrite src/href attributes so JS bundles + CSS load through the CORS proxy
    // (without this, scripts fail from blob URL's null origin)
    function toAbs(url) {
      if (!url) return url;
      if (url.startsWith("//")) return "https:" + url;
      if (url.startsWith("/")) return IG_BASE + url;
      return url;
    }
    function isIgCdn(url) {
      try {
        const h = new URL(url).hostname;
        return h.endsWith(".instagram.com") || h.endsWith(".cdninstagram.com") ||
               h.endsWith(".fbcdn.net") || h === "instagram.com";
      } catch { return false; }
    }
    html = html.replace(/((?:src|href)\s*=\s*")([^"#\s][^"]*?)(")/gi, (m, pre, url, post) => {
      if (/^(blob:|data:|javascript:|mailto:|tel:|#)/.test(url)) return m;
      if (url.startsWith(PROXY)) return m; // already proxied
      const abs = toAbs(url);
      if (!abs || !abs.startsWith("http")) return m;
      if (isIgCdn(abs) || url.startsWith("/")) return pre + PROXY + encodeURIComponent(abs) + post;
      return m;
    });

    // Frame-bust bypass
    const frameBust = `<script>(function(){try{Object.defineProperty(window,'top',{get:function(){return window;}})}catch(e){}try{Object.defineProperty(window,'parent',{get:function(){return window;}})}catch(e){}try{Object.defineProperty(window,'frameElement',{get:function(){return null;}})}catch(e){}})();<` + `/script>`;

    // Runtime proxy override: route fetch + XHR through allorigins + lock navigation to IG only
    const proxyScript = `<script>(function(){
      var P='https://api.allorigins.win/raw?url=';
      var IG=['instagram.com','cdninstagram.com','fbcdn.net'];
      function isIG(u){try{var h=new URL(u).hostname.replace(/^www\\./,'');return IG.some(function(o){return h===o||h.endsWith('.'+o);});}catch(e){return false;}}
      function abs(u){if(!u)return u;if(/^https?:\\/\\//.test(u))return u;if(u.startsWith('//'))return 'https:'+u;if(u.startsWith('/'))return '${IG_BASE}'+u;return u;}
      var oF=window.fetch;
      window.fetch=function(u,opts){
        var a=abs(typeof u==='string'?u:(u&&u.url)||'');
        if(a&&isIG(a))return oF(P+encodeURIComponent(a),opts);
        return oF.apply(this,arguments);
      };
      var oO=XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open=function(m,u){
        var a=abs(u||'');
        if(a&&isIG(a))arguments[1]=P+encodeURIComponent(a);
        return oO.apply(this,arguments);
      };
      document.addEventListener('click',function(e){
        var a=e.target;while(a&&a.tagName!=='A')a=a.parentElement;
        if(!a||!a.href)return;
        var href=a.getAttribute('href')||'';
        if(/^(javascript:|blob:|#|data:)/.test(href))return;
        e.preventDefault();e.stopPropagation();
        try{var url=new URL(a.href,window.location.href);if(isIG(url.toString()))window.parent.postMessage({__ig:url.toString()},'*');}catch(err){}
      },true);
      document.addEventListener('submit',function(e){
        e.preventDefault();
        var f=e.target;
        var action=f.getAttribute('action')||window.location.href;
        var method=(f.getAttribute('method')||'get').toLowerCase();
        if(method==='get'){
          var params=new URLSearchParams();
          new FormData(f).forEach(function(v,k){params.set(k,v);});
          try{var u=new URL(action,window.location.href);u.search=params.toString();if(isIG(u.toString()))window.parent.postMessage({__ig:u.toString()},'*');}catch(err){}
        }
      },true);
    })();<` + `/script>`;

    const inject = frameBust + proxyScript;
    if (/<head[\s>]/i.test(html)) return html.replace(/<head([\s>][^>]*)?>/i, m => m + inject);
    return inject + html;
  }

  async function fetchWithTimeout(url, ms) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
      const r = await fetch(url, { signal: ctrl.signal });
      clearTimeout(t);
      return r;
    } catch (e) {
      clearTimeout(t);
      throw e;
    }
  }

  async function navigate(url) {
    if (!url || busy) return;
    busy = true;
    blockedMsg.style.display = "none";
    frame.style.display = "block";
    setStatus("Loading…");

    try {
      let res = null;
      for (const base of PROXIES) {
        try {
          const r = await fetchWithTimeout(base + encodeURIComponent(url), 12000);
          if (r.ok) { res = r; break; }
        } catch (_) {}
      }
      if (!res) throw new Error("all proxies failed");

      const html = await res.text();
      const injected = buildInjected(html, url);
      const blob = new Blob([injected], { type: "text/html; charset=utf-8" });
      if (prevBlobUrl) URL.revokeObjectURL(prevBlobUrl);
      prevBlobUrl = URL.createObjectURL(blob);
      frame.src = prevBlobUrl;
      setStatus("");
    } catch (_) {
      setStatus("");
      frame.style.display = "none";
      blockedMsg.style.display = "flex";
    } finally {
      busy = false;
    }
  }

  // Only allow instagram.com navigation from inside the frame
  window.addEventListener("message", (e) => {
    if (e.data && e.data.__ig && isIgUrl(e.data.__ig)) navigate(e.data.__ig);
  });

  frame.addEventListener("load", () => setStatus(""));

  function openOverlay() {
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
    if (!prevBlobUrl) navigate("https://lite.instagram.com/");
  }

  function closeOverlay() {
    overlay.style.display = "none";
    document.body.style.overflow = "";
  }

  if (openTabBtn) openTabBtn.onclick = () => window.open("https://www.instagram.com/", "_blank");

  openBtn.addEventListener("click", openOverlay);
  closeBtn.addEventListener("click", closeOverlay);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.style.display !== "none") closeOverlay();
  });
}

function initPlaneGame() {
  const planeFab   = document.getElementById("plane-fab");
  const planeOver  = document.getElementById("plane-overlay");
  const closeBtn   = document.getElementById("plane-close");
  const canvas     = document.getElementById("plane-canvas");
  const canvasWrap = document.getElementById("plane-canvas-wrap");
  const goScreen   = document.getElementById("plane-gameover");
  const goScoreEl  = document.getElementById("plane-go-score");
  const goBestEl   = document.getElementById("plane-go-best");
  const goNewBest  = document.getElementById("plane-go-newbest");
  const goRetryBtn = document.getElementById("plane-go-retry");
  if (!planeOver || !canvas) return;

  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const HS_KEY = "plane_high_score";
  const GROUND_H = 48;
  const SKY_TOP = "#0d1117", SKY_BOT = "#1a2233", GROUND_COL = "#1c2333";

  let highScore = 0;
  try { highScore = parseInt(localStorage.getItem(HS_KEY) || "0") || 0; } catch (_) {}

  let state = "ready"; // "ready" | "playing" | "dead"
  let score, frame, raf;
  let plane, buildings, groundX, frameCount, scored;

  function saveHS(n) {
    highScore = n;
    try { localStorage.setItem(HS_KEY, String(n)); } catch (_) {}
  }

  function getDifficulty() {
    const tier = Math.floor(score / 10);
    return {
      speed: Math.min(2.8 + tier * 0.55, 8.5),
      gap: Math.max(200 - tier * 13, 108),
      spawnInterval: Math.max(115 - tier * 6, 65),
    };
  }

  function makeWindows(bw, bh) {
    const wins = [];
    const cols = Math.floor(bw / 18), rows = Math.floor(bh / 20);
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (Math.random() < 0.55) wins.push({ x: 6 + c * 18, y: 8 + r * 20, lit: Math.random() < 0.6 });
    return wins;
  }

  function initRound() {
    state = "ready";
    score = 0; frame = 0; frameCount = 0; groundX = 0;
    plane = { x: 100, y: H / 2 - 20, vy: 0, w: 38, h: 20, tilt: 0 };
    buildings = []; scored = new Set();
    goScreen.style.display = "none";
  }

  function flap() {
    if (state === "ready") { state = "playing"; plane.vy = -7.2; return; }
    if (state === "playing") plane.vy = -7.2;
  }

  function spawnBuilding() {
    const d = getDifficulty(), gap = d.gap;
    const minTop = 60, maxTop = H - GROUND_H - gap - 60;
    const topH = minTop + Math.random() * (maxTop - minTop);
    const botY = topH + gap, botH = H - GROUND_H - botY;
    const bw = 64 + Math.floor(Math.random() * 24);
    buildings.push({ x: W + 10, w: bw, topH, botY, botH,
      wins_top: makeWindows(bw, topH), wins_bot: makeWindows(bw, botH), id: frame });
  }

  function update() {
    if (state === "ready" || state !== "playing") return;
    frame++; frameCount++;
    const d = getDifficulty();
    plane.vy += 0.45; plane.y += plane.vy;
    plane.tilt = Math.max(-25, Math.min(45, plane.vy * 3));
    if (plane.y + plane.h >= H - GROUND_H || plane.y <= 0) { die(); return; }
    if (frameCount % d.spawnInterval === 0) spawnBuilding();
    for (const b of buildings) {
      b.x -= d.speed;
      if (!scored.has(b.id) && b.x + b.w < plane.x) { scored.add(b.id); score++; }
      const px = plane.x + 4, py = plane.y + 4, pw = plane.w - 8, ph = plane.h - 6;
      if (px < b.x + b.w && px + pw > b.x && (py < b.topH || py + ph > b.botY)) { die(); return; }
    }
    buildings = buildings.filter(b => b.x + b.w > -10);
    groundX = (groundX - d.speed) % 48;
  }

  function die() {
    state = "dead";
    const isNew = score > highScore;
    if (isNew) saveHS(score);
    // show HTML game-over overlay
    goScoreEl.textContent  = score;
    goBestEl.textContent   = highScore;
    goNewBest.style.display = isNew && score > 0 ? "block" : "none";
    goScreen.style.display  = "flex";
    plane.vy = 0;
  }

  // ── Drawing ───────────────────────────────────────────────────────
  function drawSky() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, SKY_TOP); g.addColorStop(1, SKY_BOT);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    for (const [sx, sy] of [[23,30],[87,15],[155,55],[260,20],[380,40],[430,10],[70,90],[310,70],[200,100],[450,80]])
      ctx.fillRect(sx, sy, 1, 1);
  }

  function drawBuilding(b) {
    ctx.fillStyle = "#1e2d45";
    ctx.fillRect(b.x, 0, b.w, b.topH);
    ctx.strokeStyle = "#2a3d5a"; ctx.lineWidth = 1;
    ctx.strokeRect(b.x + 0.5, 0, b.w - 1, b.topH);
    for (const w of b.wins_top) {
      ctx.fillStyle = w.lit ? "rgba(255,240,140,0.85)" : "rgba(40,60,90,0.8)";
      ctx.fillRect(b.x + w.x, w.y, 10, 8);
    }
    ctx.fillStyle = "#1e2d45";
    ctx.fillRect(b.x, b.botY, b.w, b.botH);
    ctx.strokeStyle = "#2a3d5a";
    ctx.strokeRect(b.x + 0.5, b.botY, b.w - 1, b.botH);
    for (const w of b.wins_bot) {
      ctx.fillStyle = w.lit ? "rgba(255,240,140,0.85)" : "rgba(40,60,90,0.8)";
      ctx.fillRect(b.x + w.x, b.botY + w.y, 10, 8);
    }
    ctx.fillStyle = "#2e4060";
    ctx.fillRect(b.x - 2, b.topH - 6, b.w + 4, 6);
    ctx.fillRect(b.x - 2, b.botY, b.w + 4, 6);
  }

  function drawGround() {
    ctx.fillStyle = GROUND_COL; ctx.fillRect(0, H - GROUND_H, W, GROUND_H);
    ctx.fillStyle = "#263040";
    for (let x = groundX; x < W; x += 48) ctx.fillRect(x, H - GROUND_H, 24, 4);
    ctx.fillStyle = "#2e3d50"; ctx.fillRect(0, H - GROUND_H, W, 2);
  }

  function drawPlane() {
    ctx.save();
    ctx.translate(plane.x + plane.w / 2, plane.y + plane.h / 2);
    ctx.rotate((plane.tilt * Math.PI) / 180);
    const pw = plane.w, ph = plane.h, hx = -pw / 2, hy = -ph / 2;
    ctx.fillStyle = "#e8eef6";
    ctx.beginPath(); ctx.ellipse(hx + pw*0.5, hy + ph*0.5, pw*0.5, ph*0.28, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#cdd6e8";
    ctx.beginPath(); ctx.moveTo(hx+pw*0.9,hy+ph*0.5); ctx.lineTo(hx+pw*1.05,hy+ph*0.5); ctx.lineTo(hx+pw*0.9,hy+ph*0.38); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#a0b8d8";
    ctx.beginPath(); ctx.moveTo(hx+pw*0.45,hy+ph*0.5); ctx.lineTo(hx+pw*0.55,hy+ph*0.5); ctx.lineTo(hx+pw*0.35,hy+ph*1.2); ctx.lineTo(hx+pw*0.15,hy+ph*1.15); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hx+pw*0.08,hy+ph*0.35); ctx.lineTo(hx+pw*0.08,hy-ph*0.1); ctx.lineTo(hx+pw*0.22,hy+ph*0.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#7ecbff";
    ctx.beginPath(); ctx.ellipse(hx+pw*0.72, hy+ph*0.42, 5, 3.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  function drawHUD() {
    ctx.fillStyle = "#fff"; ctx.font = "bold 28px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.7)"; ctx.shadowBlur = 6;
    ctx.fillText(score, W / 2, 52); ctx.shadowBlur = 0;
    ctx.font = "bold 11px 'JetBrains Mono', monospace"; ctx.fillStyle = "rgba(255,220,80,0.7)"; ctx.textAlign = "left";
    ctx.fillText("BEST " + highScore, 10, 20);
    const tier = Math.floor(score / 10);
    if (tier > 0) {
      ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.textAlign = "right";
      ctx.fillText("LVL " + (tier + 1), W - 10, 20);
    }
    if (state === "ready") {
      ctx.textAlign = "center";
      ctx.font = "bold 15px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.shadowColor = "rgba(0,0,0,0.9)"; ctx.shadowBlur = 10;
      ctx.fillText("TAP OR CLICK TO FLY", W / 2, H / 2 + 64);
      ctx.shadowBlur = 0;
    }
  }

  function gameLoop() {
    update();
    drawSky();
    for (const b of buildings) drawBuilding(b);
    drawGround();
    drawPlane();
    drawHUD();
    raf = requestAnimationFrame(gameLoop);
  }

  function openGame() {
    planeOver.classList.add("visible");
    document.body.style.overflow = "hidden";
    canvasWrap.style.display = "flex";
    initRound();
    if (!raf) raf = requestAnimationFrame(gameLoop);
  }

  function closeGame() {
    planeOver.classList.remove("visible");
    document.body.style.overflow = "";
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  GAMES.plane = openGame;
  if (planeFab) planeFab.addEventListener("click", openGame);
  closeBtn.addEventListener("click", closeGame);
  goRetryBtn.addEventListener("click", () => initRound());

  canvas.addEventListener("click", flap);
  canvas.addEventListener("touchstart", (e) => { e.preventDefault(); flap(); }, { passive: false });

  document.addEventListener("keydown", (e) => {
    if (!planeOver.classList.contains("visible")) return;
    if (e.key === "Escape") { closeGame(); return; }
    if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); flap(); }
  });
}
// ─── Snake ───────────────────────────────────────────────────────────────────
function initSnakeGame() {
  const overlay = document.getElementById("snake-overlay");
  const canvas  = document.getElementById("snake-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const CELL = 20, COLS = W / CELL, ROWS = H / CELL;
  const HS_KEY = "snake_hs";
  let hs = 0; try { hs = parseInt(localStorage.getItem(HS_KEY)||"0")||0; } catch(_){}
  let snake, dir, nextDir, food, score, raf, tickMs;

  const startScreen = document.getElementById("snake-start");
  const overScreen  = document.getElementById("snake-over");
  const scoreVal    = document.getElementById("snake-score-val");
  const bestVal     = document.getElementById("snake-best-val");
  const newBest     = document.getElementById("snake-newbest");

  function rndFood() {
    let pos;
    do { pos = { x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS) }; }
    while (snake.some(s => s.x===pos.x && s.y===pos.y));
    return pos;
  }

  function startRound() {
    snake = [{x:12,y:12},{x:11,y:12},{x:10,y:12}];
    dir = {x:1,y:0}; nextDir = {x:1,y:0};
    food = rndFood(); score = 0; tickMs = 150;
    overScreen.classList.add("hidden");
    startScreen.classList.add("hidden");
    if (raf) cancelAnimationFrame(raf);
    tick();
  }

  function tick() {
    raf = requestAnimationFrame(() => setTimeout(tick, tickMs));
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    dir = nextDir;
    if (head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS||snake.some(s=>s.x===head.x&&s.y===head.y)) { die(); return; }
    snake.unshift(head);
    if (head.x===food.x&&head.y===food.y) { score++; food=rndFood(); tickMs=Math.max(80,tickMs-2); } else { snake.pop(); }
    draw();
  }

  function die() {
    cancelAnimationFrame(raf); raf = null;
    const isNew = score > hs;
    if (isNew) { hs = score; try{localStorage.setItem(HS_KEY,String(hs));}catch(_){} }
    scoreVal.textContent = score; bestVal.textContent = hs;
    newBest.classList.toggle("hidden", !isNew || score===0);
    overScreen.classList.remove("hidden");
  }

  function draw() {
    ctx.fillStyle="#080f18"; ctx.fillRect(0,0,W,H);
    // grid
    ctx.strokeStyle="rgba(255,255,255,0.03)"; ctx.lineWidth=1;
    for(let x=0;x<COLS;x++){ctx.beginPath();ctx.moveTo(x*CELL,0);ctx.lineTo(x*CELL,H);ctx.stroke();}
    for(let y=0;y<ROWS;y++){ctx.beginPath();ctx.moveTo(0,y*CELL);ctx.lineTo(W,y*CELL);ctx.stroke();}
    // food
    ctx.fillStyle="#f43f5e";
    ctx.beginPath(); ctx.arc(food.x*CELL+CELL/2,food.y*CELL+CELL/2,CELL/2-2,0,Math.PI*2); ctx.fill();
    // snake
    snake.forEach((s,i)=>{
      const alpha = 1 - i*0.02;
      ctx.fillStyle=i===0?"#22c55e":`rgba(34,197,94,${Math.max(0.4,alpha)})`;
      ctx.beginPath(); ctx.roundRect(s.x*CELL+1,s.y*CELL+1,CELL-2,CELL-2,4); ctx.fill();
    });
    // score
    ctx.fillStyle="rgba(255,255,255,0.8)"; ctx.font="bold 14px 'JetBrains Mono',monospace"; ctx.textAlign="left";
    ctx.fillText("SCORE: "+score, 10, 20);
    ctx.fillStyle="rgba(255,215,0,0.7)"; ctx.textAlign="right";
    ctx.fillText("BEST: "+hs, W-10, 20);
  }

  function open() { overlay.classList.add("open"); document.body.style.overflow="hidden"; startScreen.classList.remove("hidden"); overScreen.classList.add("hidden"); }
  GAMES.snake = open;
  GAMES._stopActive = () => { if(raf){cancelAnimationFrame(raf);raf=null;} };

  document.getElementById("snake-play-btn").addEventListener("click", startRound);
  document.getElementById("snake-retry-btn").addEventListener("click", startRound);

  const DIRS = { ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1}, ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0},
                 w:{x:0,y:-1}, s:{x:0,y:1}, a:{x:-1,y:0}, d:{x:1,y:0}, W:{x:0,y:-1}, S:{x:0,y:1}, A:{x:-1,y:0}, D:{x:1,y:0} };
  document.addEventListener("keydown", e => {
    if (!overlay.classList.contains("open")) return;
    if (e.key==="Escape") { overlay.classList.remove("open"); document.body.style.overflow=""; if(raf){cancelAnimationFrame(raf);raf=null;} return; }
    const d=DIRS[e.key]; if(!d) return; e.preventDefault();
    if(d.x!==0&&dir.x===0||d.y!==0&&dir.y===0) nextDir=d;
  });
  // swipe
  let tx=0,ty=0;
  canvas.addEventListener("touchstart",e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;},{passive:true});
  canvas.addEventListener("touchend",e=>{
    const dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty;
    if(Math.abs(dx)>Math.abs(dy)){if(dx>20&&dir.x===0)nextDir={x:1,y:0};else if(dx<-20&&dir.x===0)nextDir={x:-1,y:0};}
    else{if(dy>20&&dir.y===0)nextDir={x:0,y:1};else if(dy<-20&&dir.y===0)nextDir={x:0,y:-1};}
  },{passive:true});
}

// ─── Brick Smash ─────────────────────────────────────────────────────────────
function initBrickGame() {
  const overlay = document.getElementById("brick-overlay");
  const canvas  = document.getElementById("brick-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const HS_KEY = "brick_hs";
  let hs = 0; try { hs = parseInt(localStorage.getItem(HS_KEY)||"0")||0; } catch(_){}
  let paddle, ball, bricks, score, lives, raf, running;
  const ROWS=5, COLS=8, BW=52, BH=18, BPAD=5;
  const BRICK_COLS = ["#f43f5e","#f97316","#eab308","#22c55e","#38bdf8"];

  const startScr = document.getElementById("brick-start");
  const overScr  = document.getElementById("brick-over");
  const overTitle = document.getElementById("brick-over-title");
  const scoreVal = document.getElementById("brick-score-val");
  const bestVal  = document.getElementById("brick-best-val");

  function makeBricks() {
    const arr = [];
    const totalW = COLS*(BW+BPAD)-BPAD;
    const offX = (W-totalW)/2;
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++)
      arr.push({x:offX+c*(BW+BPAD), y:50+r*(BH+BPAD), alive:true, col:BRICK_COLS[r]});
    return arr;
  }

  function startRound() {
    paddle = {x:W/2-40, y:H-30, w:80, h:12, speed:7};
    ball = {x:W/2, y:H-60, vx:3, vy:-4, r:7};
    bricks = makeBricks(); score=0; lives=3; running=true;
    overScr.classList.add("hidden"); startScr.classList.add("hidden");
    if(raf) cancelAnimationFrame(raf);
    loop();
  }

  let keys={};
  document.addEventListener("keydown", e=>{ keys[e.key]=true; });
  document.addEventListener("keyup",   e=>{ keys[e.key]=false; });
  canvas.addEventListener("mousemove", e=>{
    if(!running) return;
    const r=canvas.getBoundingClientRect();
    paddle.x = (e.clientX-r.left)*(W/r.width) - paddle.w/2;
    paddle.x = Math.max(0, Math.min(W-paddle.w, paddle.x));
  });
  canvas.addEventListener("touchmove", e=>{
    e.preventDefault();
    const r=canvas.getBoundingClientRect();
    paddle.x = (e.touches[0].clientX-r.left)*(W/r.width) - paddle.w/2;
    paddle.x = Math.max(0, Math.min(W-paddle.w, paddle.x));
  },{passive:false});

  function loop() {
    raf = requestAnimationFrame(loop);
    // input
    if(keys["ArrowLeft"]||keys["a"]||keys["A"]) paddle.x=Math.max(0,paddle.x-paddle.speed);
    if(keys["ArrowRight"]||keys["d"]||keys["D"]) paddle.x=Math.min(W-paddle.w,paddle.x+paddle.speed);
    // ball
    ball.x+=ball.vx; ball.y+=ball.vy;
    if(ball.x-ball.r<0){ball.x=ball.r;ball.vx*=-1;}
    if(ball.x+ball.r>W){ball.x=W-ball.r;ball.vx*=-1;}
    if(ball.y-ball.r<0){ball.y=ball.r;ball.vy*=-1;}
    // paddle
    if(ball.y+ball.r>paddle.y && ball.x>paddle.x && ball.x<paddle.x+paddle.w && ball.vy>0) {
      ball.vy*=-1; ball.vy-=0.1;
      ball.vx += (ball.x-(paddle.x+paddle.w/2))/16;
    }
    // bricks
    for(const b of bricks){
      if(!b.alive) continue;
      if(ball.x+ball.r>b.x && ball.x-ball.r<b.x+BW && ball.y+ball.r>b.y && ball.y-ball.r<b.y+BH){
        b.alive=false; score++; ball.vy*=-1; break;
      }
    }
    // lost ball
    if(ball.y>H+20){
      lives--;
      if(lives<=0){ endGame(false); return; }
      ball={x:W/2,y:H-60,vx:3+(Math.random()-.5)*2,vy:-4-score*0.05,r:7};
    }
    // win
    if(bricks.every(b=>!b.alive)){ endGame(true); return; }
    draw();
  }

  function endGame(win) {
    cancelAnimationFrame(raf); raf=null; running=false;
    const isNew = score>hs; if(isNew){hs=score;try{localStorage.setItem(HS_KEY,String(hs));}catch(_){}}
    overTitle.textContent = win ? "YOU WIN! 🏆" : "GAME OVER";
    scoreVal.textContent=score; bestVal.textContent=hs;
    overScr.classList.remove("hidden");
  }

  function draw() {
    ctx.fillStyle="#05080f"; ctx.fillRect(0,0,W,H);
    bricks.forEach(b=>{ if(!b.alive) return; ctx.fillStyle=b.col; ctx.beginPath(); ctx.roundRect(b.x,b.y,BW,BH,4); ctx.fill(); });
    ctx.fillStyle="#e2e8f0"; ctx.beginPath(); ctx.roundRect(paddle.x,paddle.y,paddle.w,paddle.h,6); ctx.fill();
    ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="rgba(255,255,255,0.75)"; ctx.font="bold 13px 'JetBrains Mono',monospace"; ctx.textAlign="left"; ctx.fillText("SCORE: "+score,10,28);
    ctx.textAlign="right"; ctx.fillText("LIVES: "+"❤".repeat(lives),W-10,28);
  }

  function open() { overlay.classList.add("open"); document.body.style.overflow="hidden"; startScr.classList.remove("hidden"); overScr.classList.add("hidden"); }
  GAMES.brick = open;

  document.getElementById("brick-play-btn").addEventListener("click", startRound);
  document.getElementById("brick-retry-btn").addEventListener("click", startRound);
  document.addEventListener("keydown", e=>{ if(overlay.classList.contains("open")&&e.key==="Escape"){overlay.classList.remove("open");document.body.style.overflow="";if(raf){cancelAnimationFrame(raf);raf=null;}} });
}

// ─── Memory Match ────────────────────────────────────────────────────────────
function initMemoryGame() {
  const overlay = document.getElementById("memory-overlay");
  if (!overlay) return;
  const grid   = document.getElementById("memory-grid");
  const pairsEl= document.getElementById("mem-pairs");
  const movesEl= document.getElementById("mem-moves");
  const timeEl = document.getElementById("mem-time");
  const startSc= document.getElementById("memory-start");
  const winSc  = document.getElementById("memory-win");
  const winMov = document.getElementById("mem-win-moves");
  const winTim = document.getElementById("mem-win-time");
  const EMOJIS = ["🎮","🎵","🚀","🌟","🎯","🎪","🏆","🎭"];
  let cards=[], flipped=[], matched=0, moves=0, timer=null, seconds=0, busy=false;

  function startRound() {
    clearInterval(timer); moves=0; matched=0; seconds=0; flipped=[]; busy=false;
    const deck = [...EMOJIS,...EMOJIS].sort(()=>Math.random()-.5);
    grid.innerHTML = "";
    cards = deck.map((em,i)=>{
      const el = document.createElement("button");
      el.className="mem-card"; el.dataset.em=em; el.dataset.i=i;
      el.innerHTML=`<div class="mem-back">?</div><div class="mem-front">${em}</div>`;
      el.addEventListener("click", ()=>flipCard(el));
      grid.appendChild(el); return el;
    });
    pairsEl.textContent="0/8"; movesEl.textContent="0"; timeEl.textContent="0";
    startSc.classList.add("hidden"); winSc.classList.add("hidden");
    timer = setInterval(()=>{ seconds++; timeEl.textContent=seconds; },1000);
  }

  function flipCard(el) {
    if(busy || el.classList.contains("flipped")||el.classList.contains("matched")) return;
    el.classList.add("flipped"); flipped.push(el);
    if(flipped.length===2){
      busy=true; moves++;
      movesEl.textContent=moves;
      if(flipped[0].dataset.em===flipped[1].dataset.em){
        flipped.forEach(c=>c.classList.add("matched")); flipped=[]; matched++; busy=false;
        pairsEl.textContent=matched+"/8";
        if(matched===8){ clearInterval(timer); setTimeout(()=>{ winMov.textContent=moves; winTim.textContent=seconds+"s"; winSc.classList.remove("hidden"); },300); }
      } else {
        setTimeout(()=>{ flipped.forEach(c=>c.classList.remove("flipped")); flipped=[]; busy=false; },800);
      }
    }
  }

  function open() { overlay.classList.add("open"); document.body.style.overflow="hidden"; startSc.classList.remove("hidden"); winSc.classList.add("hidden"); grid.innerHTML=""; }
  GAMES.memory = open;

  document.getElementById("memory-play-btn").addEventListener("click", startRound);
  document.getElementById("memory-retry-btn").addEventListener("click", startRound);
  document.addEventListener("keydown", e=>{ if(overlay.classList.contains("open")&&e.key==="Escape"){overlay.classList.remove("open");document.body.style.overflow="";clearInterval(timer);} });
}

// ─── Tic-Tac-Toe vs Bot ──────────────────────────────────────────────────────
function initTttGame() {
  const overlay  = document.getElementById("ttt-overlay");
  if (!overlay) return;
  const statusEl = document.getElementById("ttt-status");
  const cells    = Array.from(document.querySelectorAll(".ttt-cell"));
  const winsEl   = document.getElementById("ttt-wins");
  const drawsEl  = document.getElementById("ttt-draws");
  const lossesEl = document.getElementById("ttt-losses");
  let board, gameOver, difficulty="easy", wins=0, draws=0, losses=0;
  const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  function checkWin(b,p){return WINS.find(l=>l.every(i=>b[i]===p));}
  function isDraw(b){return b.every(Boolean);}

  function minimax(b, isMax, depth) {
    if(checkWin(b,"O")) return 10-depth;
    if(checkWin(b,"X")) return depth-10;
    if(isDraw(b)) return 0;
    let best = isMax ? -Infinity : Infinity;
    for(let i=0;i<9;i++){
      if(b[i]) continue;
      b[i]=isMax?"O":"X";
      const val=minimax(b,!isMax,depth+1);
      b[i]=null;
      best=isMax?Math.max(best,val):Math.min(best,val);
    }
    return best;
  }

  function botMove() {
    if(difficulty==="easy"){
      const empty=board.map((_,i)=>i).filter(i=>!board[i]);
      return empty[Math.floor(Math.random()*empty.length)];
    }
    let best=-Infinity, move=0;
    for(let i=0;i<9;i++){
      if(board[i]) continue;
      board[i]="O";
      const v=minimax(board,false,0);
      board[i]=null;
      if(v>best){best=v;move=i;}
    }
    return move;
  }

  function render() {
    cells.forEach((c,i)=>{c.dataset.mark=board[i]||""; c.textContent=board[i]||""; c.classList.remove("win-cell");});
  }

  function newGame() {
    board=Array(9).fill(null); gameOver=false;
    cells.forEach(c=>{c.dataset.mark="";c.textContent="";c.classList.remove("win-cell");});
    statusEl.textContent="YOUR TURN (X)";
  }

  function playerMove(i) {
    if(gameOver||board[i]) return;
    board[i]="X"; render();
    const wLine=checkWin(board,"X");
    if(wLine){ wins++; winsEl.textContent=wins; wLine.forEach(j=>cells[j].classList.add("win-cell")); statusEl.textContent="YOU WIN! 🎉"; gameOver=true; return; }
    if(isDraw(board)){ draws++; drawsEl.textContent=draws; statusEl.textContent="DRAW!"; gameOver=true; return; }
    statusEl.textContent="BOT THINKING…";
    setTimeout(()=>{
      const m=botMove(); board[m]="O"; render();
      const bl=checkWin(board,"O");
      if(bl){ losses++; lossesEl.textContent=losses; bl.forEach(j=>cells[j].classList.add("win-cell")); statusEl.textContent="BOT WINS 🤖"; gameOver=true; return; }
      if(isDraw(board)){ draws++; drawsEl.textContent=draws; statusEl.textContent="DRAW!"; gameOver=true; return; }
      statusEl.textContent="YOUR TURN (X)";
    },320);
  }

  cells.forEach((c,i)=>c.addEventListener("click",()=>playerMove(i)));
  document.getElementById("ttt-new-btn").addEventListener("click", newGame);
  document.querySelectorAll(".ttt-diff-btn").forEach(b=>{
    b.addEventListener("click",()=>{
      difficulty=b.dataset.diff;
      document.querySelectorAll(".ttt-diff-btn").forEach(x=>x.classList.remove("active"));
      b.classList.add("active"); newGame();
    });
  });

  function open() { overlay.classList.add("open"); document.body.style.overflow="hidden"; newGame(); }
  GAMES.ttt = open;
  document.addEventListener("keydown",e=>{ if(overlay.classList.contains("open")&&e.key==="Escape"){overlay.classList.remove("open");document.body.style.overflow="";} });
}

// ─── Space Dodge ─────────────────────────────────────────────────────────────
function initSpaceGame() {
  const overlay = document.getElementById("space-overlay");
  const canvas  = document.getElementById("space-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const HS_KEY = "space_hs";
  let hs=0; try{hs=parseInt(localStorage.getItem(HS_KEY)||"0")||0;}catch(_){}
  let ship, asteroids, score, raf, keys={}, lastSpawn, spawnRate, running;

  const startScr = document.getElementById("space-start");
  const overScr  = document.getElementById("space-over");
  const scoreVal = document.getElementById("space-score-val");
  const bestVal  = document.getElementById("space-best-val");
  const newBest  = document.getElementById("space-newbest");

  function startRound() {
    ship={x:W/2, y:H-60, w:30, h:36, vx:0};
    asteroids=[]; score=0; lastSpawn=0; spawnRate=90; running=true;
    overScr.classList.add("hidden"); startScr.classList.add("hidden");
    if(raf) cancelAnimationFrame(raf);
    loop();
  }

  function spawnAsteroid() {
    const r=14+Math.random()*18;
    asteroids.push({x:r+Math.random()*(W-2*r), y:-r, r, vy:1.5+Math.random()*2+score*0.003, vx:(Math.random()-.5)*1.5});
  }

  let frame=0;
  function loop() {
    raf=requestAnimationFrame(loop); frame++;
    // input
    const spd=5;
    if(keys["ArrowLeft"]||keys["a"]||keys["A"]) ship.vx-=0.8;
    if(keys["ArrowRight"]||keys["d"]||keys["D"]) ship.vx+=0.8;
    ship.vx*=0.85; ship.x+=ship.vx;
    ship.x=Math.max(ship.w/2, Math.min(W-ship.w/2, ship.x));
    score++;
    spawnRate=Math.max(40,90-Math.floor(score/200)*8);
    if(frame%spawnRate===0) spawnAsteroid();
    for(const a of asteroids){ a.x+=a.vx; a.y+=a.vy; }
    asteroids=asteroids.filter(a=>a.y<H+50);
    // collision (circle vs rect)
    for(const a of asteroids){
      const cx=Math.max(ship.x-ship.w/2,Math.min(a.x,ship.x+ship.w/2));
      const cy=Math.max(ship.y-ship.h/2,Math.min(a.y,ship.y+ship.h/2));
      if(Math.hypot(a.x-cx,a.y-cy)<a.r-3){endGame();return;}
    }
    draw();
  }

  function endGame() {
    cancelAnimationFrame(raf);raf=null;running=false;
    const s=Math.floor(score/60); const isNew=s>hs; if(isNew){hs=s;try{localStorage.setItem(HS_KEY,String(hs));}catch(_){}}
    scoreVal.textContent=s; bestVal.textContent=hs;
    newBest.classList.toggle("hidden",!isNew||s===0);
    overScr.classList.remove("hidden");
  }

  function draw() {
    // bg
    ctx.fillStyle="#050810"; ctx.fillRect(0,0,W,H);
    // stars
    ctx.fillStyle="rgba(255,255,255,0.5)";
    for(const [sx,sy] of [[30,40],[80,120],[200,80],[350,200],[420,60],[150,300],[300,400],[60,480],[380,500],[240,550]])
      ctx.fillRect(sx,sy+((frame/3)%H),1,1);
    // asteroids
    for(const a of asteroids){
      ctx.fillStyle="#8b7355"; ctx.beginPath(); ctx.arc(a.x,a.y,a.r,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#6b5a3e"; ctx.beginPath(); ctx.arc(a.x-a.r*0.2,a.y-a.r*0.2,a.r*0.4,0,Math.PI*2); ctx.fill();
    }
    // ship
    ctx.save(); ctx.translate(ship.x, ship.y);
    ctx.fillStyle="#e2e8f0";
    ctx.beginPath(); ctx.moveTo(0,-ship.h/2); ctx.lineTo(ship.w/2,ship.h/2); ctx.lineTo(-ship.w/2,ship.h/2); ctx.closePath(); ctx.fill();
    ctx.fillStyle="#38bdf8";
    ctx.beginPath(); ctx.moveTo(0,-ship.h/2+8); ctx.lineTo(ship.w/2-6,ship.h/2-6); ctx.lineTo(-ship.w/2+6,ship.h/2-6); ctx.closePath(); ctx.fill();
    ctx.fillStyle="#0ea5e9"; ctx.beginPath(); ctx.ellipse(0,ship.h/2-4,6,10,0,0,Math.PI*2); ctx.fill();
    ctx.restore();
    // hud
    const s=Math.floor(score/60);
    ctx.fillStyle="rgba(255,255,255,0.75)"; ctx.font="bold 13px 'JetBrains Mono',monospace"; ctx.textAlign="left"; ctx.fillText("SCORE: "+s,10,24);
    ctx.textAlign="right"; ctx.fillText("BEST: "+hs,W-10,24);
  }

  document.addEventListener("keydown",e=>{keys[e.key]=true;});
  document.addEventListener("keyup",e=>{keys[e.key]=false;});
  canvas.addEventListener("mousemove",e=>{
    if(!running) return;
    const r=canvas.getBoundingClientRect(); ship.x=(e.clientX-r.left)*(W/r.width); ship.x=Math.max(ship.w/2,Math.min(W-ship.w/2,ship.x));
  });
  canvas.addEventListener("touchmove",e=>{
    e.preventDefault(); const r=canvas.getBoundingClientRect();
    ship.x=(e.touches[0].clientX-r.left)*(W/r.width); ship.x=Math.max(ship.w/2,Math.min(W-ship.w/2,ship.x));
  },{passive:false});

  function open() { overlay.classList.add("open"); document.body.style.overflow="hidden"; startScr.classList.remove("hidden"); overScr.classList.add("hidden"); }
  GAMES.space = open;

  document.getElementById("space-play-btn").addEventListener("click", startRound);
  document.getElementById("space-retry-btn").addEventListener("click", startRound);
  document.addEventListener("keydown",e=>{ if(overlay.classList.contains("open")&&e.key==="Escape"){overlay.classList.remove("open");document.body.style.overflow="";if(raf){cancelAnimationFrame(raf);raf=null;}} });
}

// ─── Speed Tap ───────────────────────────────────────────────────────────────
function initSpeedTapGame() {
  const overlay = document.getElementById("speedtap-overlay");
  if (!overlay) return;
  const countEl  = document.getElementById("speedtap-count");
  const timerEl  = document.getElementById("speedtap-timer");
  const tapBtn   = document.getElementById("speedtap-btn");
  const msgEl    = document.getElementById("speedtap-msg");
  const vsWrap   = document.getElementById("speedtap-vs");
  const youVal   = document.getElementById("speedtap-you-val");
  const botVal   = document.getElementById("speedtap-bot-val");
  const againBtn = document.getElementById("speedtap-again-btn");
  const DURATION = 10;
  let count=0, timeLeft=DURATION, timer=null, phase="idle";

  function reset() {
    phase="idle"; count=0; timeLeft=DURATION;
    countEl.textContent="0"; timerEl.textContent="TAP TO START";
    tapBtn.classList.add("idle"); msgEl.textContent="TAP THE BUTTON AS FAST AS YOU CAN!";
    vsWrap.style.display="none"; againBtn.style.display="none";
  }

  function start() {
    phase="playing"; count=0; timeLeft=DURATION;
    tapBtn.classList.remove("idle"); msgEl.textContent="GO!";
    timerEl.textContent=DURATION+"s";
    clearInterval(timer);
    timer=setInterval(()=>{
      timeLeft--;
      timerEl.textContent=timeLeft+"s";
      if(timeLeft<=0){ clearInterval(timer); finish(); }
    },1000);
  }

  function finish() {
    phase="done"; tapBtn.classList.add("idle");
    const botScore = 48+Math.floor(Math.random()*24);
    const win=count>botScore;
    msgEl.textContent=win?"YOU WIN! 🏆":"BOT WINS 🤖";
    timerEl.textContent="DONE";
    youVal.textContent=count; botVal.textContent=botScore;
    vsWrap.style.display="flex"; againBtn.style.display="";
  }

  tapBtn.addEventListener("click",()=>{
    if(phase==="idle") start();
    else if(phase==="playing"){ count++; countEl.textContent=count; }
  });
  tapBtn.addEventListener("touchstart",e=>{ e.preventDefault(); tapBtn.click(); },{passive:false});
  againBtn.addEventListener("click",reset);

  function open() { overlay.classList.add("open"); document.body.style.overflow="hidden"; reset(); }
  GAMES.speedtap = open;
  document.addEventListener("keydown",e=>{ if(overlay.classList.contains("open")&&e.key==="Escape"){overlay.classList.remove("open");document.body.style.overflow="";clearInterval(timer);} });
}

// ─── 1v1 Reaction Duel ───────────────────────────────────────────────────────
function initDuelGame() {
  const overlay = document.getElementById("duel-overlay");
  if (!overlay) return;
  const lobbyEl   = document.getElementById("duel-lobby");
  const waitingEl = document.getElementById("duel-waiting");
  const gameEl    = document.getElementById("duel-game");
  const codeDisp  = document.getElementById("duel-code-display");
  const waitMsg   = document.getElementById("duel-wait-msg");
  const joinInput = document.getElementById("duel-join-input");
  const createBtn = document.getElementById("duel-create-btn");
  const joinBtn   = document.getElementById("duel-join-btn");
  const cancelBtn = document.getElementById("duel-cancel-btn");
  const arenaEl   = document.getElementById("duel-arena");
  const arenaIcon = document.getElementById("duel-arena-icon");
  const myScoreEl = document.getElementById("duel-my-score");
  const theirScoreEl = document.getElementById("duel-their-score");
  const gameStatus = document.getElementById("duel-game-status");
  const rematchBtn = document.getElementById("duel-rematch-btn");

  let channel=null, myRole=null, myCode=null, myScore=0, theirScore=0, armed=false, roundTimer=null;

  function show(which) {
    [lobbyEl,waitingEl,gameEl].forEach(el=>el.style.display="none");
    which.style.display="flex";
  }

  function cleanup() {
    if(channel){channel.close();channel=null;} myRole=null; armed=false;
    clearTimeout(roundTimer);
  }

  function openLobby() {
    cleanup(); myScore=0; theirScore=0;
    myScoreEl.textContent="0"; theirScoreEl.textContent="0";
    show(lobbyEl); joinInput.value="";
  }

  createBtn.addEventListener("click",()=>{
    myCode = String(1000+Math.floor(Math.random()*9000));
    myRole = "host"; codeDisp.textContent=myCode;
    channel = new BroadcastChannel("duel_"+myCode);
    waitMsg.textContent="Waiting for opponent to join…";
    show(waitingEl);
    channel.onmessage = e => handleMsg(e.data);
  });

  joinBtn.addEventListener("click",()=>{
    const code=(joinInput.value||"").trim();
    if(code.length!==4){joinInput.style.borderColor="#f43f5e";setTimeout(()=>joinInput.style.borderColor="",1200);return;}
    myRole="guest"; myCode=code;
    channel = new BroadcastChannel("duel_"+code);
    channel.onmessage = e => handleMsg(e.data);
    channel.postMessage({t:"join"});
    waitMsg.textContent="Connecting…";
    show(waitingEl);
    setTimeout(()=>{ if(channel&&myRole==="guest"&&waitingEl.style.display!=="none"){ waitMsg.textContent="Room not found — check the code"; }},3000);
  });

  cancelBtn.addEventListener("click",()=>{ cleanup(); show(lobbyEl); });

  function handleMsg(msg) {
    if(msg.t==="join"&&myRole==="host") {
      channel.postMessage({t:"start"});
      startGame();
    } else if(msg.t==="start") {
      startGame();
    } else if(msg.t==="tap") {
      if(armed){ theirScore++; theirScoreEl.textContent=theirScore; resolveRound(false); }
    } else if(msg.t==="next") {
      if(!armed) scheduleNext();
    } else if(msg.t==="rematch") {
      myScore=0; theirScore=0; myScoreEl.textContent="0"; theirScoreEl.textContent="0";
      startGame();
    }
  }

  function startGame() {
    myScore=0; theirScore=0; myScoreEl.textContent="0"; theirScoreEl.textContent="0";
    show(gameEl); rematchBtn.style.display="none";
    arenaEl.classList.remove("armed"); gameStatus.textContent="GET READY…";
    arenaIcon.textContent="🎯";
    setTimeout(scheduleNext,1500);
  }

  function scheduleNext() {
    armed=false; arenaEl.classList.remove("armed"); arenaIcon.textContent="🎯";
    gameStatus.textContent="WAIT FOR IT…";
    const delay=1500+Math.random()*2500;
    roundTimer=setTimeout(armRound,delay);
  }

  function armRound() {
    armed=true; arenaEl.classList.add("armed"); arenaIcon.textContent="🟢";
    gameStatus.textContent="TAP NOW!";
  }

  function resolveRound(iWon) {
    armed=false; arenaEl.classList.remove("armed");
    gameStatus.textContent=iWon?"YOU GOT IT! +1 ✅":"THEY WERE FASTER ❌";
    arenaIcon.textContent=iWon?"🏆":"💀";
    const total=myScore+theirScore;
    if(total>=5) {
      setTimeout(()=>{
        gameStatus.textContent=myScore>theirScore?"YOU WIN THE MATCH! 🏆":"THEY WIN THE MATCH 🤖";
        rematchBtn.style.display="";
      },1000);
    } else {
      roundTimer=setTimeout(()=>{
        channel.postMessage({t:"next"});
        scheduleNext();
      },1400);
    }
  }

  arenaEl.addEventListener("click",()=>{
    if(!armed) return;
    myScore++; myScoreEl.textContent=myScore;
    channel.postMessage({t:"tap"});
    resolveRound(true);
  });
  arenaEl.addEventListener("touchstart",e=>{e.preventDefault();arenaEl.click();},{passive:false});

  rematchBtn.addEventListener("click",()=>{
    channel.postMessage({t:"rematch"});
    myScore=0; theirScore=0; myScoreEl.textContent="0"; theirScoreEl.textContent="0";
    startGame();
  });

  function open() {
    overlay.classList.add("open"); document.body.style.overflow="hidden"; openLobby();
  }
  GAMES.duel = open;
  document.addEventListener("keydown",e=>{if(overlay.classList.contains("open")&&e.key==="Escape"){cleanup();overlay.classList.remove("open");document.body.style.overflow="";}});
}
