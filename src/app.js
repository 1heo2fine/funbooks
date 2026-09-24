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
        <button class="glass-btn-cta" onclick="event.stopPropagation(); window._openSiteBrowser ? window._openSiteBrowser('${escapeHtml(mirror.url)}') : window.open('${escapeHtml(mirror.url)}','_blank')">
          Launch
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
    if (currentFilter === "unblocked") return m.tag === "unblocked";
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
safeInit(initGamesHub);
safeInit(initSocialSidebar);
safeInit(initSiteBrowser);
safeInit(initScrollHide);
safeInit(initMusicPlayer);
safeInit(initQuickHide);
safeInit(initPlaneGame);
safeInit(initSnakeGame);
safeInit(initBrickGame);
safeInit(initMemoryGame);
safeInit(initTttGame);
safeInit(initSpaceGame);
safeInit(initSpeedTapGame);
safeInit(initDuelGame);
safeInit(initFishingGame);
safeInit(initFabGameHide);

function initFabGameHide() {
  const fab = document.getElementById("menu-fab");
  if (!fab) return;
  const overlays = document.querySelectorAll(".game-modal, .plane-overlay");
  function sync() {
    const anyOpen = [...overlays].some(el =>
      el.classList.contains("open") || el.classList.contains("visible")
    );
    fab.classList.toggle("fab-game-hidden", anyOpen);
  }
  const obs = new MutationObserver(sync);
  overlays.forEach(el => obs.observe(el, { attributes: true, attributeFilter: ["class"] }));
}

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

  // Auto-open on load, auto-close after 3 seconds
  open();
  setTimeout(() => { if (overlay.classList.contains("visible")) close(); }, 3000);

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
  const sidebar = document.getElementById("games-sidebar");
  const bd = document.getElementById("games-sidebar-bd");
  const closeX = document.getElementById("games-sidebar-x");
  if (!sidebar || !bd || !closeX) return;

  function open() { sidebar.classList.add("open"); bd.classList.add("open"); document.body.style.overflow = "hidden"; }
  function close() { sidebar.classList.remove("open"); bd.classList.remove("open"); document.body.style.overflow = ""; }

  window._openGamesHub = open;
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

  if (openBtn) openBtn.addEventListener("click", openOverlay);
  if (closeBtn) closeBtn.addEventListener("click", closeOverlay);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.style.display !== "none") closeOverlay();
  });

  window._openInstagram = () => { openOverlay(); if (!prevBlobUrl) navigate("https://lite.instagram.com/"); };
}

function initSocialSidebar() {
  const bd = document.getElementById("social-sidebar-bd");
  const sidebar = document.getElementById("social-sidebar");
  const closeX = document.getElementById("social-sidebar-x");
  const menuFab = document.getElementById("menu-fab");
  if (!sidebar || !bd || !menuFab) return;

  function openSidebar() { sidebar.classList.add("open"); bd.classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeSidebar() { sidebar.classList.remove("open"); bd.classList.remove("open"); document.body.style.overflow = ""; }

  menuFab.addEventListener("click", openSidebar);
  if (closeX) closeX.addEventListener("click", closeSidebar);
  bd.addEventListener("click", closeSidebar);

  const APP_URLS = { tiktok: "https://tiktok.com", reddit: "https://reddit.com", omegle: "https://omegle.com", roblox: "https://roblox.com" };

  sidebar.querySelectorAll(".social-app-box").forEach(box => {
    box.addEventListener("click", () => {
      closeSidebar();
      const app = box.dataset.app;
      setTimeout(() => {
        if (app === "instagram") {
          if (window._openInstagram) window._openInstagram();
          else { const ol = document.getElementById("ig-overlay"); if (ol) { ol.style.display = "flex"; document.body.style.overflow = "hidden"; } }
        } else if (app === "spotify") {
          if (window._openMusicPlayer) window._openMusicPlayer();
        } else {
          const ol = document.getElementById(app + "-overlay");
          if (!ol) return;
          const frame = ol.querySelector(".app-overlay-frame");
          if (frame && frame.src === "about:blank") frame.src = APP_URLS[app] || "";
          ol.style.display = "flex";
          document.body.style.overflow = "hidden";
        }
      }, 120);
    });
  });

  const exploreBtn = document.getElementById("explore-games-btn");
  if (exploreBtn) exploreBtn.addEventListener("click", () => { closeSidebar(); setTimeout(() => { if (window._openGamesHub) window._openGamesHub(); }, 120); });

  const navHome = document.getElementById("sidebar-nav-home");
  const navIo = document.getElementById("sidebar-nav-io");
  const navUnblocked = document.getElementById("sidebar-nav-unblocked");

  if (navHome) navHome.addEventListener("click", () => {
    closeSidebar();
    if (window.__setFilter) window.__setFilter("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  if (navIo) navIo.addEventListener("click", () => {
    closeSidebar();
    if (window.__setFilter) window.__setFilter("io");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  if (navUnblocked) navUnblocked.addEventListener("click", () => {
    closeSidebar();
    if (window.__setFilter) window.__setFilter("unblocked");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelectorAll(".app-overlay-close").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.close;
      if (id) { const el = document.getElementById(id); if (el) { el.style.display = "none"; document.body.style.overflow = ""; } }
    });
  });
  document.querySelectorAll(".app-overlay-open-btn").forEach(btn => {
    btn.addEventListener("click", () => { if (btn.dataset.href) window.open(btn.dataset.href, "_blank"); });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSidebar();
      document.querySelectorAll(".app-overlay").forEach(ol => { if (ol.style.display !== "none") { ol.style.display = "none"; document.body.style.overflow = ""; } });
    }
  });
}

function initSiteBrowser() {
  const browser  = document.getElementById("site-browser");
  const frame    = document.getElementById("sb-frame");
  const closeBtn = document.getElementById("sb-close");
  const urlInput = document.getElementById("sb-url-input");
  const urlForm  = document.getElementById("sb-url-form");
  const fsBtn    = document.getElementById("sb-fullscreen");
  if (!browser || !frame) return;

  const fab = document.getElementById("menu-fab");

  function open(url) {
    frame.src = url;
    urlInput.value = url;
    browser.style.display = "flex";
    document.body.style.overflow = "hidden";
    if (fab) fab.classList.add("fab-game-hidden");
  }

  function close() {
    browser.style.display = "none";
    document.body.style.overflow = "";
    frame.src = "about:blank";
    if (fab) fab.classList.remove("fab-game-hidden");
  }

  window._openSiteBrowser = open;

  if (closeBtn) closeBtn.addEventListener("click", close);

  if (urlForm) urlForm.addEventListener("submit", e => {
    e.preventDefault();
    let val = urlInput.value.trim();
    if (!val) return;
    if (!/^https?:\/\//i.test(val)) {
      val = /^[a-z0-9-]+\.[a-z]{2,}/i.test(val)
        ? "https://" + val
        : "https://www.google.com/search?q=" + encodeURIComponent(val);
    }
    frame.src = val;
    urlInput.value = val;
  });

  if (fsBtn) fsBtn.addEventListener("click", () => {
    if (frame.requestFullscreen) frame.requestFullscreen();
    else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && browser.style.display !== "none") close();
  });
}

function initScrollHide() {
  const menuFab = document.getElementById("menu-fab");
  const browserArea = document.querySelector(".browser-area");
  let lastY = window.scrollY;
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > lastY + 4 && y > 80;
        if (menuFab) menuFab.classList.toggle("scroll-hidden-left", goingDown);
        if (browserArea) browserArea.classList.toggle("scroll-hidden-right", goingDown);
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initMusicPlayer() {
  const TRACKS = [
    { file: "track1.json", name: "Beyoncé – Morning Dew Donk" },
    { file: "track2.json", name: "Wxoda – Vibin" },
    { file: "track3.json", name: "LONOWN – addiction (Slowed)" },
    { file: "track4.json", name: "Delinquent – My Destiny (Slowed)" },
  ];

  const audio    = document.getElementById("music-audio");
  const counter  = document.getElementById("music-counter");
  const trackEl  = document.getElementById("music-track-name");
  const prevBtn  = document.getElementById("music-prev");
  const nextBtn  = document.getElementById("music-next");
  const playBtn  = document.getElementById("music-play");
  const playIcon = document.getElementById("music-play-icon");
  const loadDot  = document.getElementById("music-loading");
  const progFill = document.getElementById("music-progress-fill");
  const progBar  = document.getElementById("music-progress-bar");
  if (!audio) return;

  let idx = 0;
  let playing = false;
  let loading = false;
  const cache = {};  // blob URL cache per track index

  function setPlayIcon(isPlaying) {
    if (!playIcon) return;
    playIcon.innerHTML = isPlaying
      ? '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>'
      : '<polygon points="5 3 19 12 5 21 5 3"/>';
  }

  function setLoading(on) {
    loading = on;
    if (loadDot) loadDot.style.display = on ? "block" : "none";
    if (playBtn) playBtn.disabled = on;
  }

  function updateMeta() {
    const t = TRACKS[idx];
    if (counter) counter.textContent = `${idx + 1} / ${TRACKS.length}`;
    if (trackEl) trackEl.textContent = t.name;
  }

  async function loadAndPlay(i) {
    idx = ((i % TRACKS.length) + TRACKS.length) % TRACKS.length;
    updateMeta();
    playing = true;
    setPlayIcon(true);

    if (cache[idx]) {
      audio.src = cache[idx];
      audio.play().catch(() => {});
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(TRACKS[idx].file);
      const { data } = await resp.json();
      const bin = atob(data);
      const bytes = new Uint8Array(bin.length);
      for (let j = 0; j < bin.length; j++) bytes[j] = bin.charCodeAt(j);
      const blob = new Blob([bytes], { type: "audio/mpeg" });
      cache[idx] = URL.createObjectURL(blob);
      audio.src = cache[idx];
      audio.play().catch(() => {});
    } catch (e) {
      console.error("music load failed", e);
      playing = false;
      setPlayIcon(false);
    } finally {
      setLoading(false);
    }
  }

  function togglePlay() {
    if (loading) return;
    if (!audio.src || audio.src === window.location.href) {
      loadAndPlay(idx);
      return;
    }
    if (playing) {
      audio.pause();
      playing = false;
      setPlayIcon(false);
    } else {
      audio.play().catch(() => {});
      playing = true;
      setPlayIcon(true);
    }
  }

  audio.addEventListener("ended", () => loadAndPlay(idx + 1));
  audio.addEventListener("timeupdate", () => {
    if (!audio.duration || !progFill) return;
    progFill.style.width = (audio.currentTime / audio.duration * 100) + "%";
  });

  if (progBar) progBar.addEventListener("click", (e) => {
    if (!audio.duration) return;
    const r = progBar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });

  if (prevBtn) prevBtn.addEventListener("click", () => {
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    loadAndPlay(idx - 1);
  });
  if (nextBtn) nextBtn.addEventListener("click", () => loadAndPlay(idx + 1));
  if (playBtn) playBtn.addEventListener("click", togglePlay);

  const player       = document.getElementById("music-player");
  const minimizeBtn  = document.getElementById("music-minimize");
  const closeBtn     = document.getElementById("music-close");

  if (minimizeBtn) minimizeBtn.addEventListener("click", () => {
    player && player.classList.toggle("minimized");
  });
  if (closeBtn) closeBtn.addEventListener("click", () => {
    if (player) player.style.display = "none";
    if (audio) { audio.pause(); playing = false; setPlayIcon(false); }
  });

  // expose so sidebar Spotify button can re-open the player
  window._openMusicPlayer = () => {
    if (!player) return;
    player.style.display = "";
    player.classList.remove("minimized");
  };

  // draggable
  const dragHandle = player && player.querySelector(".music-player-top");
  if (dragHandle && player) {
    let dragging = false, ox = 0, oy = 0;

    function startDrag(cx, cy) {
      const r = player.getBoundingClientRect();
      player.style.right = "auto";
      player.style.bottom = "auto";
      player.style.left = r.left + "px";
      player.style.top  = r.top  + "px";
      player.style.transition = "none";
      ox = cx - r.left;
      oy = cy - r.top;
      dragging = true;
      document.body.style.userSelect = "none";
    }

    function moveDrag(cx, cy) {
      if (!dragging) return;
      const maxX = window.innerWidth  - player.offsetWidth;
      const maxY = window.innerHeight - player.offsetHeight;
      player.style.left = Math.max(0, Math.min(maxX, cx - ox)) + "px";
      player.style.top  = Math.max(0, Math.min(maxY, cy - oy)) + "px";
    }

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      document.body.style.userSelect = "";
      player.style.transition = "";
    }

    dragHandle.addEventListener("mousedown", e => {
      if (e.target.closest(".music-wm-btn")) return;
      startDrag(e.clientX, e.clientY);
    });
    document.addEventListener("mousemove", e => moveDrag(e.clientX, e.clientY));
    document.addEventListener("mouseup", endDrag);

    dragHandle.addEventListener("touchstart", e => {
      if (e.target.closest(".music-wm-btn")) return;
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    document.addEventListener("touchmove", e => {
      if (dragging) { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); }
    }, { passive: false });
    document.addEventListener("touchend", endDrag);
  }

  updateMeta();
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

// ─── 3D Fish Model Renderer ────────────────────────────────────────────────────
const FISH_RENDERER = (() => {
  function lh(h,a){
    if(!h||h[0]!=='#')return h||'#888888';
    const n=parseInt(h.slice(1),16);
    const c=x=>Math.max(0,Math.min(255,x))|0;
    const r=c((n>>16)+(a*255|0)),g=c(((n>>8)&255)+(a*255|0)),b=c((n&255)+(a*255|0));
    return '#'+r.toString(16).padStart(2,'0')+g.toString(16).padStart(2,'0')+b.toString(16).padStart(2,'0');
  }
  const dh=(h,a)=>lh(h,-a);

  // [arch, bodyHex, bellyHex, finHex, accHex, pat, extra]
  // arch: std/deep/long/bill/tuna → generic;  oar/sun/flat/eel/ang/squid → special
  // pat: solid/hs/vs/sp/lat/rb/gh/cr/bnd/sc
  const P = {
    bluegill:      ["deep","#2a6aaa","#e8c040","#1a4a7a","#ffd700","vs",  ""],
    bass:          ["std", "#2a5a22","#b8d070","#1a3a18","#e0a820","lat", ""],
    carp:          ["std", "#c09040","#e8d090","#8a6820","#f0b030","sc",  ""],
    perch:         ["deep","#d08010","#f0e090","#904000","#205a20","hs",  ""],
    catfish:       ["std", "#606070","#a0a8b0","#404050","#907050","solid","wsk"],
    trout:         ["std", "#7a5030","#e8c090","#4a3020","#e03040","sp",  ""],
    sunfish:       ["deep","#e87020","#f8c040","#a84000","#087850","vs",  ""],
    crappie:       ["std", "#304030","#809080","#203020","#607060","sp",  ""],
    roach:         ["std", "#708090","#d0e0e8","#405060","#e03030","solid",""],
    chub:          ["std", "#808888","#d0d8d0","#505858","#e09030","solid",""],
    bream:         ["deep","#b08040","#e0c880","#806028","#d09040","sc",  ""],
    dace:          ["std", "#708898","#e0e8f0","#405070","#e04040","solid",""],
    rudd:          ["std", "#c09040","#f0e0a0","#a07030","#e03020","solid",""],
    tench:         ["std", "#305830","#709070","#203820","#8aaa50","solid",""],
    minnow:        ["std", "#909898","#d8e0e0","#606868","#f0e030","solid",""],
    pike:          ["long","#385830","#b0c098","#284020","#f0d060","sp",  ""],
    salmon:        ["std", "#c06040","#f0b080","#804020","#f090a0","sp",  ""],
    rtrout:        ["std", "#507840","#e0d880","#306028","#e06090","rb",  ""],
    barra:         ["std", "#8898a8","#d0dce8","#586878","#c8d8e8","lat", ""],
    snapper:       ["std", "#d83030","#f8c0a0","#a01818","#f0a050","solid",""],
    grouper:       ["std", "#c84820","#e8b090","#901808","#f0c060","sp",  ""],
    flounder:      ["flat","#a09050","#d0c890","#706030","#c8b060","sp",  ""],
    walleye:       ["std", "#c89040","#e8c880","#907028","#f0e060","lat", ""],
    drum:          ["std", "#383838","#a0a0a0","#202020","#606060","solid",""],
    mullet:        ["std", "#788898","#d0dce8","#485868","#d0d8e0","lat", ""],
    whiting:       ["std", "#d0c8b0","#f0ece0","#a09880","#e0d8c0","solid",""],
    herring:       ["std", "#78a8c8","#d0e8f8","#386898","#e8f0f8","solid",""],
    swordfish:     ["bill","#304860","#c0d0e0","#182838","#6090c0","solid",""],
    mahimahi:      ["tuna","#1890c0","#e8c860","#0860a0","#50d0a0","sp",  ""],
    wahoo:         ["long","#1848a0","#d0d8f8","#103070","#90b0f0","hs",  ""],
    tuna:          ["tuna","#203858","#c0c8d8","#101828","#f0d040","lat", ""],
    tarpon:        ["std", "#8898a8","#e0e8f0","#486078","#c8d8e0","solid",""],
    barracuda:     ["long","#507878","#b0d0d0","#305858","#a0c8c8","lat", ""],
    bonefish:      ["std", "#90a8b8","#d8e8f0","#608090","#d0e0e8","solid",""],
    amberjack:     ["tuna","#d09030","#f0d880","#a06820","#f8f040","lat", ""],
    striped:       ["std", "#485858","#b8c8c8","#283838","#808090","hs",  ""],
    gtrevally:     ["tuna","#485870","#b0c0d0","#283848","#e0d060","lat", ""],
    ggrouper:      ["std", "#806040","#d0b080","#604020","#c0d080","sp",  ""],
    arapaima:      ["long","#505848","#b0b8a8","#303828","#e06040","sc",  ""],
    alligar:       ["long","#484028","#a09878","#302818","#c0b878","hs",  ""],
    tigerfish:     ["long","#c09830","#e0d090","#906020","#282808","hs",  ""],
    payara:        ["long","#485870","#98a8c8","#283850","#e0e8f8","solid","fngs"],
    bluemarlin:    ["bill","#103060","#7090d0","#081838","#30c8f0","solid",""],
    gbluefin:      ["tuna","#102040","#8090a8","#080f20","#d0c830","solid",""],
    oarfish:       ["oar", "#c0c8d0","#e8eef8","#e03050","#f0b820","hs",  ""],
    molamola:      ["sun", "#808898","#c8d0d8","#484858","#d0d8e0","solid",""],
    coelacanth:    ["std", "#3850a0","#90a8d8","#203070","#e0c060","sp",  ""],
    ghostkoi:      ["std", "#a0c8f0","#d0e8ff","#80a8d0","#ffffff","gh",  ""],
    anglerfish:    ["ang", "#181818","#383838","#101010","#f0e020","solid",""],
    aurorafish:    ["std", "#e040b0","#f090e0","#a02080","#40e0f0","rb",  ""],
    eelec:         ["eel", "#2a4a1a","#607050","#1a3010","#ffe020","bnd", ""],
    leviathan:     ["long","#0a1828","#1a3850","#061020","#3090e0","sc",  ""],
    crystaldragon: ["bill","#60c8f0","#c0e8ff","#3090d0","#ffffff","cr",  ""],
    thatone:       ["std", "#909090","#c0c0c0","#606060","#ffffff","gh",  ""],
    kraken:        ["squid","#380820","#6a1838","#200410","#ff0050","solid",""],
    _default:      ["std", "#4a8cc4","#b8d8f0","#2a5a8a","#90c8f0","solid",""],
  };

  const ARCH = {
    std:  [1.00,0.46,0.62,0.26],
    deep: [0.80,0.70,0.60,0.22],
    long: [1.45,0.28,0.40,0.14],
    bill: [1.00,0.40,0.66,0.32],
    tuna: [1.05,0.52,0.78,0.40],
  };

  function drawFish(ctx, fishId, rarityKey, phase) {
    const W=ctx.canvas.width, H=ctx.canvas.height;
    ctx.clearRect(0,0,W,H);
    const pr=P[fishId]||P._default;
    const [arch,bodyC,bellyC,finC,accC,pat,ext]=pr;
    const swim=Math.sin(phase*0.05)*Math.min(W,H)*0.024;
    const tilt=Math.sin(phase*0.03)*0.04;
    const tailWag=Math.sin(phase*0.09);
    const cx=W/2, cy=H/2+swim;
    const RG={legendary:"rgba(251,191,36,0.2)",mythic:"rgba(244,114,182,0.26)",secret:"rgba(255,255,255,0.16)",impossible:"rgba(255,0,80,0.32)"};
    if(RG[rarityKey]){
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(W,H)*0.54);
      g.addColorStop(0,RG[rarityKey]);g.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    }
    ctx.save();ctx.translate(cx,cy);ctx.rotate(tilt);
    const sz=Math.min(W,H)*0.42;
    if(arch==="squid")     drawSquid(ctx,bodyC,bellyC,finC,accC,sz,tailWag,phase);
    else if(arch==="eel")  drawEel(ctx,bodyC,bellyC,finC,accC,sz,tailWag,phase);
    else if(arch==="oar")  drawOarfish(ctx,bodyC,bellyC,finC,accC,sz,tailWag,phase);
    else if(arch==="sun")  drawSunfish(ctx,bodyC,bellyC,finC,accC,sz,tailWag,phase);
    else if(arch==="flat") drawFlatfish(ctx,bodyC,bellyC,finC,accC,sz,tailWag,phase);
    else if(arch==="ang")  drawAnglerfish(ctx,bodyC,bellyC,finC,accC,sz,tailWag,phase);
    else                   drawGenericFish(ctx,ARCH[arch]||ARCH.std,bodyC,bellyC,finC,accC,sz,tailWag,phase,pat,ext,arch==="bill");
    ctx.restore();
  }

  function drawGenericFish(ctx,ap,bodyC,bellyC,finC,accC,sz,tw,ph,pat,ext,isBill){
    const [bL,bH,tSpH,tCurD]=ap;
    const L=sz*bL, H=sz*bH, tailX=L*0.44;
    const forkH=sz*tSpH, forkCurve=sz*tCurD;
    // shadow
    ctx.save();ctx.scale(1,0.22);ctx.translate(sz*0.08,sz*5);
    const shg=ctx.createRadialGradient(0,0,0,0,0,L*0.75);
    shg.addColorStop(0,"rgba(0,0,0,0.3)");shg.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=shg;ctx.fillRect(-L,-L*0.5,L*2,L);ctx.restore();
    // tail fins (before body)
    const tw2=tw*0.14;
    ctx.globalAlpha=0.88;
    ctx.beginPath();
    ctx.moveTo(tailX,-H*0.22-tw2*H);
    ctx.bezierCurveTo(tailX+sz*0.12,-H*0.22+forkCurve-tw2*H,L+forkCurve,-forkH-tw2*sz*0.28,L+sz*0.1,-forkH*1.05);
    ctx.bezierCurveTo(L,-forkH*0.5,tailX+sz*0.1,-H*0.05,tailX,0);
    ctx.closePath();ctx.fillStyle=finC;ctx.fill();
    ctx.beginPath();
    ctx.moveTo(tailX,H*0.22+tw2*H);
    ctx.bezierCurveTo(tailX+sz*0.12,H*0.22-forkCurve+tw2*H,L+forkCurve,forkH+tw2*sz*0.28,L+sz*0.1,forkH*1.05);
    ctx.bezierCurveTo(L,forkH*0.5,tailX+sz*0.1,H*0.05,tailX,0);
    ctx.closePath();ctx.fillStyle=finC;ctx.fill();
    ctx.globalAlpha=1;
    // bill
    if(isBill){
      ctx.beginPath();ctx.moveTo(-L*0.92,-H*0.07);
      ctx.bezierCurveTo(-L*1.05,-H*0.05,-L*1.48,-H*0.02,-L*1.52,0);
      ctx.bezierCurveTo(-L*1.48,H*0.02,-L*1.05,H*0.05,-L*0.92,H*0.07);
      ctx.closePath();ctx.fillStyle=dh(bodyC,0.08);ctx.fill();
    }
    // body
    const bg=ctx.createLinearGradient(0,-H*1.15,0,H*1.15);
    bg.addColorStop(0,lh(bodyC,0.32));bg.addColorStop(0.3,bodyC);
    bg.addColorStop(0.78,dh(bodyC,0.22));bg.addColorStop(1,bellyC);
    ctx.beginPath();ctx.moveTo(-L,0);
    ctx.bezierCurveTo(-L*0.55,-H*1.08,0,-H*1.12,tailX,-H*0.42);
    ctx.bezierCurveTo(tailX+sz*0.07,-H*0.26,tailX+sz*0.07,H*0.26,tailX,H*0.42);
    ctx.bezierCurveTo(0,H*1.12,-L*0.55,H*1.0,-L,0);
    ctx.closePath();ctx.fillStyle=bg;ctx.fill();
    // pattern (clipped)
    ctx.save();
    ctx.beginPath();ctx.moveTo(-L,0);
    ctx.bezierCurveTo(-L*0.55,-H*1.08,0,-H*1.12,tailX,-H*0.42);
    ctx.bezierCurveTo(tailX+sz*0.07,-H*0.26,tailX+sz*0.07,H*0.26,tailX,H*0.42);
    ctx.bezierCurveTo(0,H*1.12,-L*0.55,H*1.0,-L,0);
    ctx.clip();
    if(pat==="hs"){
      for(let i=-3;i<=3;i++){ctx.fillStyle=i%2===0?accC+"4a":dh(bodyC,0.15)+"55";ctx.fillRect(-L,i*H*0.38-H*0.14,L*1.85,H*0.28);}
    }else if(pat==="vs"){
      for(let i=-5;i<=5;i++){if(i%2===0){ctx.fillStyle=accC+"45";ctx.fillRect(i*sz*0.14-sz*0.07,-H*1.2,sz*0.12,H*2.5);}}
    }else if(pat==="sp"){
      const spots=[[-.55,-.3],[-.25,-.55],[.05,-.48],[.28,-.2],[-.4,.28],[-.1,.5],[.2,.35],[-.65,.1],[.35,-.4]];
      for(const [sx,sy] of spots){ctx.beginPath();ctx.arc(sx*L,sy*H,sz*0.048,0,Math.PI*2);ctx.fillStyle=accC+"60";ctx.fill();}
    }else if(pat==="lat"){
      ctx.beginPath();ctx.moveTo(-L*0.45,-H*0.08);ctx.bezierCurveTo(0,-H*0.12,tailX*0.5,-H*0.07,tailX,-H*0.14);
      ctx.strokeStyle="rgba(0,0,0,0.2)";ctx.lineWidth=H*0.12;ctx.stroke();
    }else if(pat==="rb"){
      const rg=ctx.createLinearGradient(-L,0,tailX,0);
      ["#ff004070","#ff800055","#ffff0055","#00ff0055","#0080ff55","#8000ff50"].forEach((c,i)=>rg.addColorStop(i/5,c));
      ctx.fillStyle=rg;ctx.fillRect(-L,-H*1.2,L*2,H*2.5);
    }else if(pat==="gh"){
      ctx.fillStyle="rgba(255,255,255,0.18)";ctx.fillRect(-L,-H*1.2,L*2,H*2.5);
    }else if(pat==="cr"){
      for(let i=0;i<7;i++){const x=-L*0.7+i*L*0.28;ctx.beginPath();ctx.moveTo(x,-H);ctx.lineTo(x+sz*0.12,0);ctx.lineTo(x,H);ctx.strokeStyle="rgba(255,255,255,0.35)";ctx.lineWidth=0.7;ctx.stroke();}
    }else if(pat==="bnd"){
      for(let i=-6;i<=6;i+=2){ctx.fillStyle=accC+"42";ctx.fillRect(i*sz*0.13,-H*1.2,sz*0.12,H*2.5);}
    }else if(pat==="sc"){
      for(let r=0;r<4;r++)for(let c=0;c<8;c++){const sx=-L*0.55+c*L*0.2+(r%2)*L*0.1,sy=-H*0.55+r*H*0.32;ctx.beginPath();ctx.arc(sx,sy,sz*0.068,Math.PI,Math.PI*2);ctx.strokeStyle=dh(bodyC,0.18)+"65";ctx.lineWidth=0.8;ctx.stroke();}
    }
    if(ext==="wsk"){
      for(const [oy,len] of [[-H*0.15,-H*0.7],[-H*0.03,-H*0.5],[H*0.1,H*0.6]]){
        ctx.beginPath();ctx.moveTo(-L*0.85,oy);ctx.bezierCurveTo(-L*0.95,oy+len*0.5,-L*0.88,oy+len*0.82,-L*0.75,oy+len);
        ctx.strokeStyle=dh(bodyC,0.12);ctx.lineWidth=1.4;ctx.lineCap="round";ctx.stroke();
      }
    }
    if(ext==="fngs"){
      ctx.fillStyle="rgba(240,240,255,0.85)";
      for(const fx of[-L*0.78,-L*0.68]){ctx.beginPath();ctx.moveTo(fx,-H*0.05);ctx.lineTo(fx+sz*0.02,-H*0.52);ctx.lineTo(fx+sz*0.04,-H*0.05);ctx.fill();}
    }
    ctx.restore();
    // dorsal fin
    const dmx=-L*0.05;
    ctx.beginPath();ctx.moveTo(-L*0.3,-H*0.96);
    ctx.bezierCurveTo(dmx-sz*0.15,-H*0.95-sz*0.33,dmx+sz*0.18,-H*0.9-sz*0.28,tailX*0.55,-H*0.93);
    ctx.bezierCurveTo(tailX*0.55,-H*0.88,dmx+sz*0.08,-H*0.9,-L*0.3,-H*0.9);
    ctx.closePath();ctx.fillStyle=finC+"cc";ctx.fill();
    // pectoral fin
    ctx.beginPath();ctx.ellipse(-L*0.22,H*0.18,sz*0.24,sz*0.09,Math.PI*0.2,0,Math.PI*2);
    ctx.fillStyle=finC+"90";ctx.fill();
    // specular highlight
    const sg2=ctx.createRadialGradient(-L*0.28,-H*0.38,0,-L*0.1,-H*0.1,sz*0.55);
    sg2.addColorStop(0,"rgba(255,255,255,0.42)");sg2.addColorStop(0.55,"rgba(255,255,255,0.08)");sg2.addColorStop(1,"rgba(255,255,255,0)");
    ctx.beginPath();ctx.ellipse(-L*0.18,-H*0.22,L*0.55,H*0.6,0,0,Math.PI*2);
    ctx.fillStyle=sg2;ctx.fill();
    // outline
    ctx.beginPath();ctx.moveTo(-L,0);
    ctx.bezierCurveTo(-L*0.55,-H*1.08,0,-H*1.12,tailX,-H*0.42);
    ctx.bezierCurveTo(tailX+sz*0.07,-H*0.26,tailX+sz*0.07,H*0.26,tailX,H*0.42);
    ctx.bezierCurveTo(0,H*1.12,-L*0.55,H*1.0,-L,0);
    ctx.strokeStyle="rgba(0,0,0,0.18)";ctx.lineWidth=1;ctx.stroke();
    // eye
    const ex=-L*0.63, ey=-H*0.12, er=sz*0.062;
    ctx.beginPath();ctx.arc(ex,ey,er*1.45,0,Math.PI*2);ctx.fillStyle="rgba(0,0,0,0.55)";ctx.fill();
    ctx.beginPath();ctx.arc(ex,ey,er,0,Math.PI*2);
    const eg=ctx.createRadialGradient(ex,ey,0,ex,ey,er);
    eg.addColorStop(0,"#3a3a4a");eg.addColorStop(1,"#0a0a14");
    ctx.fillStyle=eg;ctx.fill();
    ctx.beginPath();ctx.arc(ex-er*0.3,ey-er*0.35,er*0.38,0,Math.PI*2);ctx.fillStyle="rgba(255,255,255,0.88)";ctx.fill();
  }

  function drawSquid(ctx,bodyC,bellyC,finC,accC,sz,tw,ph){
    const mH=sz*0.95,mW=sz*0.42;
    const mg=ctx.createLinearGradient(-mW,0,mW,0);
    mg.addColorStop(0,dh(bodyC,0.3));mg.addColorStop(0.4,bodyC);mg.addColorStop(1,dh(bodyC,0.2));
    ctx.beginPath();ctx.moveTo(0,-mH*0.55);
    ctx.bezierCurveTo(mW*1.1,-mH*0.42,mW*1.12,mH*0.15,0,mH*0.52);
    ctx.bezierCurveTo(-mW*1.12,mH*0.15,-mW*1.1,-mH*0.42,0,-mH*0.55);
    ctx.fillStyle=mg;ctx.fill();
    ctx.globalAlpha=0.72;
    for(const xf of[-1,1]){
      ctx.beginPath();ctx.moveTo(xf*mW*0.92,mH*0.05);
      ctx.bezierCurveTo(xf*mW*1.6,-mH*0.05,xf*mW*1.55,mH*0.3,xf*mW*0.88,mH*0.38);
      ctx.bezierCurveTo(xf*mW*0.82,mH*0.25,xf*mW*0.88,mH*0.1,xf*mW*0.92,mH*0.05);
      ctx.fillStyle=finC+"cc";ctx.fill();
    }
    ctx.globalAlpha=1;
    for(let i=0;i<8;i++){
      const a=(i/7)*Math.PI-Math.PI*0.05;
      const tx=Math.cos(a)*mW*0.6;
      const tLen=sz*(0.58+Math.sin(ph*0.04+i*0.8)*0.07);
      ctx.beginPath();ctx.moveTo(tx,mH*0.48);
      ctx.bezierCurveTo(tx*0.9+tw*sz*0.06,mH*0.65,tx*0.75+tw*sz*0.08,mH*0.65+tLen*0.5,tx*0.65+tw*sz*0.05,mH*0.5+tLen);
      ctx.strokeStyle=dh(bodyC,0.08);ctx.lineWidth=sz*0.042;ctx.lineCap="round";ctx.stroke();
    }
    for(const xf of[-1,1]){
      const tLen=sz*1.15;
      ctx.beginPath();ctx.moveTo(xf*mW*0.18,mH*0.48);
      ctx.bezierCurveTo(xf*mW*0.5+tw*sz*0.12,mH*0.7,xf*mW*0.8+tw*sz*0.16,mH*0.5+tLen*0.5,xf*mW*0.28+tw*sz*0.1,mH*0.5+tLen);
      ctx.strokeStyle=dh(bodyC,0.05);ctx.lineWidth=sz*0.052;ctx.stroke();
      ctx.beginPath();ctx.ellipse(xf*mW*0.28+tw*sz*0.1,mH*0.5+tLen,sz*0.068,sz*0.028,Math.PI*0.2*xf,0,Math.PI*2);
      ctx.fillStyle=accC+"80";ctx.fill();
    }
    for(const xf of[-1,1]){
      const ex=xf*mW*0.44,ey=-mH*0.1,er=sz*0.072;
      ctx.beginPath();ctx.arc(ex,ey,er*1.85,0,Math.PI*2);ctx.fillStyle="rgba(0,0,0,0.45)";ctx.fill();
      ctx.beginPath();ctx.arc(ex,ey,er,0,Math.PI*2);
      const eg=ctx.createRadialGradient(ex,ey,0,ex,ey,er);
      eg.addColorStop(0,"#ff2020");eg.addColorStop(0.5,accC);eg.addColorStop(1,dh(accC,0.4));
      ctx.fillStyle=eg;ctx.fill();
      ctx.beginPath();ctx.arc(ex-er*0.28,ey-er*0.32,er*0.35,0,Math.PI*2);ctx.fillStyle="rgba(255,255,255,0.88)";ctx.fill();
    }
    const sg=ctx.createRadialGradient(-mW*0.15,-mH*0.22,0,0,-mH*0.05,sz*0.68);
    sg.addColorStop(0,"rgba(255,255,255,0.32)");sg.addColorStop(1,"rgba(255,255,255,0)");
    ctx.beginPath();ctx.ellipse(-mW*0.08,-mH*0.12,mW*0.65,mH*0.52,0,0,Math.PI*2);ctx.fillStyle=sg;ctx.fill();
  }

  function drawEel(ctx,bodyC,bellyC,finC,accC,sz,tw,ph){
    const len=sz*2.1,dia=sz*0.17;
    const amp=sz*0.14*Math.sin(ph*0.05),amp2=sz*0.08*Math.sin(ph*0.05+1.5);
    ctx.save();ctx.scale(1,0.15);ctx.translate(0,sz*6);
    const sgg=ctx.createRadialGradient(sz*0.3,0,0,sz*0.3,0,len*0.45);
    sgg.addColorStop(0,"rgba(0,0,0,0.3)");sgg.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=sgg;ctx.fillRect(-len,-dia*3,len*2,dia*6);ctx.restore();
    ctx.beginPath();ctx.moveTo(-len,-dia);
    ctx.bezierCurveTo(-len*0.5+amp,-dia-dia*0.35,amp2,-dia-dia*0.2,len*0.45-amp,-dia+amp*0.45);
    ctx.lineTo(len,0);ctx.lineTo(len*0.45-amp,dia+amp*0.45);
    ctx.bezierCurveTo(amp2,dia+dia*0.2,-len*0.5+amp,dia+dia*0.35,-len,dia);
    ctx.closePath();
    const eg=ctx.createLinearGradient(0,-dia*1.6,0,dia*1.6);
    eg.addColorStop(0,lh(bodyC,0.3));eg.addColorStop(0.4,bodyC);eg.addColorStop(0.82,dh(bodyC,0.2));eg.addColorStop(1,bellyC);
    ctx.fillStyle=eg;ctx.fill();
    for(let i=-7;i<7;i+=2){ctx.fillStyle=accC+"40";ctx.fillRect(-len+i*len*0.13,-dia*1.15,len*0.1,dia*2.3);}
    ctx.beginPath();ctx.ellipse(-len*0.08,-dia*0.45,len*0.72,dia*0.33,0,0,Math.PI*2);ctx.fillStyle="rgba(255,255,255,0.28)";ctx.fill();
    const er2=sz*0.054;
    ctx.beginPath();ctx.arc(-len*0.92,-dia*0.12,er2*1.4,0,Math.PI*2);ctx.fillStyle="rgba(0,0,0,0.5)";ctx.fill();
    ctx.beginPath();ctx.arc(-len*0.92,-dia*0.12,er2,0,Math.PI*2);ctx.fillStyle="#1a1a2a";ctx.fill();
    ctx.beginPath();ctx.arc(-len*0.92-er2*0.28,-dia*0.12-er2*0.32,er2*0.36,0,Math.PI*2);ctx.fillStyle="rgba(255,255,255,0.82)";ctx.fill();
  }

  function drawOarfish(ctx,bodyC,bellyC,finC,accC,sz,tw,ph){
    const len=sz*2.0,dia=sz*0.11;
    const wave=Math.sin(ph*0.04)*sz*0.1;
    ctx.globalAlpha=0.82;
    for(let i=0;i<12;i++){
      const x=-len*0.82+i*len*0.12;
      const cH=sz*(0.62-i*0.025);
      ctx.beginPath();ctx.moveTo(x,-dia);ctx.bezierCurveTo(x+wave*0.08,-dia-cH*0.5,x+wave*0.14,-dia-cH,x+wave*0.1,-dia-cH);
      ctx.strokeStyle=finC;ctx.lineWidth=2.8;ctx.lineCap="round";ctx.stroke();
      ctx.beginPath();ctx.arc(x+wave*0.1,-dia-cH,3.2,0,Math.PI*2);ctx.fillStyle=finC;ctx.fill();
    }
    ctx.globalAlpha=1;
    ctx.beginPath();ctx.moveTo(-len,0);
    ctx.bezierCurveTo(-len*0.3+wave*0.5,-dia*1.1,wave,-dia*0.9,len*0.4-wave*0.28,-dia*0.38);
    ctx.lineTo(len,0);ctx.lineTo(len*0.4-wave*0.28,dia*0.38);
    ctx.bezierCurveTo(wave,dia*0.9,-len*0.3+wave*0.5,dia*1.1,-len,0);
    ctx.closePath();
    const og=ctx.createLinearGradient(0,-dia*1.5,0,dia*1.5);
    og.addColorStop(0,lh(bodyC,0.25));og.addColorStop(0.38,bodyC);og.addColorStop(1,bellyC);
    ctx.fillStyle=og;ctx.fill();
    for(let i=-5;i<5;i++){ctx.fillStyle=accC+"2e";ctx.fillRect(i*len*0.15,-dia*1.1,len*0.06,dia*2.2);}
    ctx.beginPath();ctx.ellipse(-len*0.08,-dia*0.28,len*0.72,dia*0.32,0,0,Math.PI*2);ctx.fillStyle="rgba(255,255,255,0.28)";ctx.fill();
    const er3=sz*0.048;
    ctx.beginPath();ctx.arc(-len*0.9,-dia*0.04,er3*1.35,0,Math.PI*2);ctx.fillStyle="rgba(0,0,0,0.5)";ctx.fill();
    ctx.beginPath();ctx.arc(-len*0.9,-dia*0.04,er3,0,Math.PI*2);ctx.fillStyle="#1a1a28";ctx.fill();
    ctx.beginPath();ctx.arc(-len*0.9-er3*0.25,-dia*0.04-er3*0.3,er3*0.38,0,Math.PI*2);ctx.fillStyle="rgba(255,255,255,0.84)";ctx.fill();
  }

  function drawSunfish(ctx,bodyC,bellyC,finC,accC,sz,tw,ph){
    const R=sz*0.82,bW=sz*0.55;
    ctx.save();ctx.scale(1,0.2);ctx.translate(sz*0.1,sz*5.2);
    const sg3=ctx.createRadialGradient(0,0,0,0,0,R*0.9);
    sg3.addColorStop(0,"rgba(0,0,0,0.3)");sg3.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=sg3;ctx.fillRect(-R,-R,R*2,R*2);ctx.restore();
    ctx.beginPath();ctx.moveTo(-bW*0.28,-R*0.85);
    ctx.bezierCurveTo(0,-R*0.85-sz*0.38,bW*0.28,-R*0.85-sz*0.34,bW*0.4,-R*0.85);
    ctx.bezierCurveTo(bW*0.35,-R*0.88,0,-R*0.92,-bW*0.28,-R*0.88);
    ctx.closePath();ctx.fillStyle=finC+"bb";ctx.fill();
    ctx.beginPath();ctx.moveTo(-bW*0.28,R*0.85);
    ctx.bezierCurveTo(0,R*0.85+sz*0.38,bW*0.28,R*0.85+sz*0.34,bW*0.4,R*0.85);
    ctx.bezierCurveTo(bW*0.35,R*0.88,0,R*0.92,-bW*0.28,R*0.88);
    ctx.closePath();ctx.fillStyle=finC+"bb";ctx.fill();
    ctx.beginPath();ctx.moveTo(bW*0.92,-R*0.42);
    ctx.bezierCurveTo(bW*1.18,-R*0.5,bW*1.22,R*0.5,bW*0.92,R*0.42);
    ctx.bezierCurveTo(bW*0.94,R*0.14,bW*0.94,-R*0.14,bW*0.92,-R*0.42);
    ctx.closePath();ctx.fillStyle=finC+"99";ctx.fill();
    const bg2=ctx.createRadialGradient(-bW*0.18,-R*0.24,0,0,0,R*1.08);
    bg2.addColorStop(0,lh(bodyC,0.35));bg2.addColorStop(0.5,bodyC);bg2.addColorStop(1,dh(bodyC,0.3));
    ctx.beginPath();ctx.ellipse(0,0,bW,R*0.88,0,0,Math.PI*2);ctx.fillStyle=bg2;ctx.fill();
    const belly=ctx.createRadialGradient(0,R*0.18,0,0,R*0.1,R*0.72);
    belly.addColorStop(0,bellyC+"42");belly.addColorStop(1,"rgba(255,255,255,0)");
    ctx.beginPath();ctx.ellipse(0,R*0.15,bW*0.72,R*0.58,0,0,Math.PI*2);ctx.fillStyle=belly;ctx.fill();
    const shg2=ctx.createRadialGradient(-bW*0.18,-R*0.3,0,-bW*0.08,-R*0.15,sz*0.6);
    shg2.addColorStop(0,"rgba(255,255,255,0.42)");shg2.addColorStop(1,"rgba(255,255,255,0)");
    ctx.beginPath();ctx.ellipse(-bW*0.1,-R*0.1,bW*0.68,R*0.58,0,0,Math.PI*2);ctx.fillStyle=shg2;ctx.fill();
    const er4=sz*0.065;
    ctx.beginPath();ctx.arc(-bW*0.48,-R*0.14,er4*1.52,0,Math.PI*2);ctx.fillStyle="rgba(0,0,0,0.5)";ctx.fill();
    ctx.beginPath();ctx.arc(-bW*0.48,-R*0.14,er4,0,Math.PI*2);ctx.fillStyle="#1a1a28";ctx.fill();
    ctx.beginPath();ctx.arc(-bW*0.48-er4*0.3,-R*0.14-er4*0.35,er4*0.4,0,Math.PI*2);ctx.fillStyle="rgba(255,255,255,0.85)";ctx.fill();
  }

  function drawFlatfish(ctx,bodyC,bellyC,finC,accC,sz,tw,ph){
    const bW=sz*0.74,bH=sz*0.88;
    ctx.save();ctx.rotate(-0.14);
    const fg=ctx.createRadialGradient(-bW*0.08,-bH*0.22,0,0,0,Math.max(bW,bH)*1.08);
    fg.addColorStop(0,lh(bodyC,0.25));fg.addColorStop(0.5,bodyC);fg.addColorStop(1,dh(bodyC,0.3));
    ctx.beginPath();ctx.ellipse(0,0,bW,bH,0,0,Math.PI*2);ctx.fillStyle=fg;ctx.fill();
    ctx.globalAlpha=0.62;
    for(let i=-9;i<=9;i++){
      const a=(i/9)*Math.PI*0.82;
      const fx=Math.cos(a)*bW*1.04,fy=Math.sin(a)*bH*1.04;
      const fl=sz*0.11+Math.sin(ph*0.06+i*0.5)*sz*0.028;
      ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+Math.cos(a)*fl,fy+Math.sin(a)*fl);
      ctx.strokeStyle=finC;ctx.lineWidth=2.2;ctx.stroke();
    }
    ctx.globalAlpha=1;
    for(let i=0;i<12;i++){
      const sx=-bW*0.48+(i%4)*bW*0.28+(Math.floor(i/4)%2)*bW*0.13;
      const sy=-bH*0.48+Math.floor(i/4)*bH*0.34;
      ctx.beginPath();ctx.arc(sx,sy,sz*0.048,0,Math.PI*2);
      ctx.fillStyle=(i%3===0?accC:dh(bodyC,0.35))+"65";ctx.fill();
    }
    for(const eo of[-0.11,0.11]){
      const er5=sz*0.055;
      ctx.beginPath();ctx.arc(-bW*0.44+eo*sz,-bH*0.52,er5*1.48,0,Math.PI*2);ctx.fillStyle="rgba(0,0,0,0.5)";ctx.fill();
      ctx.beginPath();ctx.arc(-bW*0.44+eo*sz,-bH*0.52,er5,0,Math.PI*2);ctx.fillStyle="#1a1a28";ctx.fill();
      ctx.beginPath();ctx.arc(-bW*0.44+eo*sz-er5*0.28,-bH*0.52-er5*0.32,er5*0.36,0,Math.PI*2);ctx.fillStyle="rgba(255,255,255,0.84)";ctx.fill();
    }
    const shg3=ctx.createRadialGradient(-bW*0.12,-bH*0.25,0,0,-bH*0.1,sz*0.62);
    shg3.addColorStop(0,"rgba(255,255,255,0.38)");shg3.addColorStop(1,"rgba(255,255,255,0)");
    ctx.beginPath();ctx.ellipse(-bW*0.08,-bH*0.14,bW*0.6,bH*0.52,0,0,Math.PI*2);ctx.fillStyle=shg3;ctx.fill();
    ctx.restore();
  }

  function drawAnglerfish(ctx,bodyC,bellyC,finC,accC,sz,tw,ph){
    const bW=sz*0.52,bH=sz*0.64;
    const lureGlow=0.62+0.38*Math.sin(ph*0.07);
    const ag=ctx.createRadialGradient(-bW*0.05,-bH*0.22,0,0,0,Math.max(bW,bH)*1.12);
    ag.addColorStop(0,lh(bodyC,0.35));ag.addColorStop(0.5,bodyC);ag.addColorStop(1,dh(bodyC,0.4));
    ctx.beginPath();ctx.moveTo(-bW,0);
    ctx.bezierCurveTo(-bW*0.5,-bH*1.08,bW*0.12,-bH*1.12,bW*0.5,-bH*0.28);
    ctx.bezierCurveTo(bW*0.7,-bH*0.1,bW*0.72,bH*0.1,bW*0.52,bH*0.28);
    ctx.bezierCurveTo(bW*0.12,bH*0.95,-bW*0.28,bH*0.88,-bW*0.58,bH*0.38);
    ctx.bezierCurveTo(-bW*0.88,bH*0.2,-bW*1.02,bH*0.05,-bW,0);
    ctx.fillStyle=ag;ctx.fill();
    ctx.fillStyle="#e8e8e8";
    for(let i=0;i<5;i++){
      const tx=-bW*0.9+i*bW*0.12;
      ctx.beginPath();ctx.moveTo(tx,-bH*0.05);ctx.lineTo(tx+sz*0.024,-bH*0.42);ctx.lineTo(tx+sz*0.048,-bH*0.05);ctx.fill();
      ctx.beginPath();ctx.moveTo(tx,bH*0.05);ctx.lineTo(tx+sz*0.024,bH*0.4);ctx.lineTo(tx+sz*0.048,bH*0.05);ctx.fill();
    }
    const lx=-bW*0.08,ly=-bH*1.12-sz*0.24;
    ctx.beginPath();ctx.moveTo(lx-sz*0.06,-bH*0.94);ctx.bezierCurveTo(lx-sz*0.12,-bH*1.08,lx,-bH*1.08-sz*0.14,lx,ly);
    ctx.strokeStyle=dh(bodyC,0.08);ctx.lineWidth=2;ctx.stroke();
    const lr=sz*0.066;
    const lgg=ctx.createRadialGradient(lx,ly,0,lx,ly,lr*4);
    lgg.addColorStop(0,accC+"ff");lgg.addColorStop(0.3,accC+Math.round(lureGlow*200).toString(16).padStart(2,"0"));lgg.addColorStop(1,accC+"00");
    ctx.globalAlpha=lureGlow;ctx.fillStyle=lgg;ctx.beginPath();ctx.arc(lx,ly,lr*4,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    ctx.beginPath();ctx.arc(lx,ly,lr,0,Math.PI*2);ctx.fillStyle=accC;ctx.fill();
    ctx.globalAlpha=0.62;
    for(let i=0;i<4;i++){const rx=-bW*0.22+i*bW*0.16,rH=sz*(0.18-i*0.02);ctx.beginPath();ctx.moveTo(rx,-bH*0.92);ctx.lineTo(rx,-bH*0.92-rH);ctx.strokeStyle=finC;ctx.lineWidth=2;ctx.stroke();}
    ctx.globalAlpha=1;
    const er6=sz*0.078;
    ctx.beginPath();ctx.arc(bW*0.25,-bH*0.34,er6*2.3,0,Math.PI*2);ctx.fillStyle="rgba(0,0,0,0.48)";ctx.fill();
    ctx.beginPath();ctx.arc(bW*0.25,-bH*0.34,er6,0,Math.PI*2);
    const eyeg=ctx.createRadialGradient(bW*0.25,-bH*0.34,0,bW*0.25,-bH*0.34,er6);
    eyeg.addColorStop(0,"#ffee80");eyeg.addColorStop(0.5,"#ffaa00");eyeg.addColorStop(1,"#aa6600");
    ctx.fillStyle=eyeg;ctx.fill();
    ctx.beginPath();ctx.arc(bW*0.25-er6*0.3,-bH*0.34-er6*0.32,er6*0.36,0,Math.PI*2);ctx.fillStyle="rgba(255,255,255,0.9)";ctx.fill();
    const shg4=ctx.createRadialGradient(-bW*0.05,-bH*0.44,0,0,-bH*0.24,sz*0.54);
    shg4.addColorStop(0,"rgba(255,255,255,0.24)");shg4.addColorStop(1,"rgba(255,255,255,0)");
    ctx.beginPath();ctx.ellipse(-bW*0.05,-bH*0.2,bW*0.6,bH*0.55,0,0,Math.PI*2);ctx.fillStyle=shg4;ctx.fill();
  }

  return { drawFish };
})();

// ─── Gone Fishing ─────────────────────────────────────────────────────────────
function initFishingGame() {
  const overlay = document.getElementById("fishing-overlay");
  if (!overlay) return;

  const RARITY = {
    common:     {label:"Common",     color:"#94a3b8", glow:"rgba(148,163,184,0.3)",  weight:55},
    uncommon:   {label:"Uncommon",   color:"#34d399", glow:"rgba(52,211,153,0.35)",  weight:25},
    rare:       {label:"Rare",       color:"#60a5fa", glow:"rgba(96,165,250,0.45)",  weight:12},
    epic:       {label:"Epic",       color:"#c084fc", glow:"rgba(192,132,252,0.5)",  weight:5},
    legendary:  {label:"Legendary",  color:"#fbbf24", glow:"rgba(251,191,36,0.55)",  weight:2},
    mythic:     {label:"Mythic",     color:"#f472b6", glow:"rgba(244,114,182,0.6)",  weight:0.8},
    secret:     {label:"SECRET",     color:"#e2e8f0", glow:"rgba(255,255,255,0.65)", weight:0.03},
    impossible: {label:"IMPOSSIBLE", color:"#ff0050", glow:"rgba(255,0,80,0.7)",     weight:0.001},
  };

  const FISH = [
    // Common (15)
    {id:"bluegill",  name:"Bluegill",              emoji:"🐟",rarity:"common",   wt:[0.1,0.4],  desc:"A feisty little panfish"},
    {id:"bass",      name:"Largemouth Bass",        emoji:"🐟",rarity:"common",   wt:[0.5,1.8],  desc:"Classic sport fish"},
    {id:"carp",      name:"Common Carp",            emoji:"🐠",rarity:"common",   wt:[0.8,4.0],  desc:"Muddy bottom dweller"},
    {id:"perch",     name:"Yellow Perch",           emoji:"🐡",rarity:"common",   wt:[0.1,0.5],  desc:"Striped and spiny"},
    {id:"catfish",   name:"Channel Catfish",        emoji:"🐟",rarity:"common",   wt:[0.6,5.0],  desc:"Whiskers in the deep"},
    {id:"trout",     name:"Brown Trout",            emoji:"🐟",rarity:"common",   wt:[0.3,1.2],  desc:"Spotted beauty"},
    {id:"sunfish",   name:"Pumpkinseed",            emoji:"🐠",rarity:"common",   wt:[0.05,0.3], desc:"Tiny but colorful"},
    {id:"crappie",   name:"Black Crappie",          emoji:"🐡",rarity:"common",   wt:[0.2,0.8],  desc:"Paper mouth fighter"},
    {id:"roach",     name:"Common Roach",           emoji:"🐟",rarity:"common",   wt:[0.1,0.3],  desc:"Silver flash in the shallows"},
    {id:"chub",      name:"Creek Chub",             emoji:"🐟",rarity:"common",   wt:[0.1,0.5],  desc:"Round and spunky"},
    {id:"bream",     name:"Bronze Bream",           emoji:"🐠",rarity:"common",   wt:[0.2,0.6],  desc:"Classic pond fish"},
    {id:"dace",      name:"Longnose Dace",          emoji:"🐟",rarity:"common",   wt:[0.05,0.2], desc:"Fast river darter"},
    {id:"rudd",      name:"Rudd",                   emoji:"🐠",rarity:"common",   wt:[0.1,0.4],  desc:"Golden-tinged scales"},
    {id:"tench",     name:"Tench",                  emoji:"🐟",rarity:"common",   wt:[0.5,2.0],  desc:"The doctor fish"},
    {id:"minnow",    name:"Fathead Minnow",         emoji:"🐟",rarity:"common",   wt:[0.01,0.05],desc:"Barely fills the hook"},
    // Uncommon (12)
    {id:"pike",      name:"Northern Pike",          emoji:"🐠",rarity:"uncommon", wt:[1.0,8.0],  desc:"Freshwater tiger"},
    {id:"salmon",    name:"Atlantic Salmon",        emoji:"🐟",rarity:"uncommon", wt:[2.0,10.0], desc:"King of the river"},
    {id:"rtrout",    name:"Rainbow Trout",          emoji:"🐟",rarity:"uncommon", wt:[0.5,4.0],  desc:"Iridescent leaper"},
    {id:"barra",     name:"Barramundi",             emoji:"🐡",rarity:"uncommon", wt:[1.0,6.0],  desc:"Silver beast of the flats"},
    {id:"snapper",   name:"Red Snapper",            emoji:"🐠",rarity:"uncommon", wt:[0.8,5.0],  desc:"Reef's finest"},
    {id:"grouper",   name:"Red Grouper",            emoji:"🐡",rarity:"uncommon", wt:[2.0,12.0], desc:"Ambush predator"},
    {id:"flounder",  name:"Summer Flounder",        emoji:"🐟",rarity:"uncommon", wt:[0.5,3.0],  desc:"Flat as a pancake"},
    {id:"walleye",   name:"Walleye",                emoji:"🐟",rarity:"uncommon", wt:[0.5,3.5],  desc:"Glassy-eyed night hunter"},
    {id:"drum",      name:"Black Drum",             emoji:"🐠",rarity:"uncommon", wt:[1.5,15.0], desc:"Makes the water vibrate"},
    {id:"mullet",    name:"Striped Mullet",         emoji:"🐟",rarity:"uncommon", wt:[0.3,2.0],  desc:"Leaps for joy"},
    {id:"whiting",   name:"Southern Whiting",       emoji:"🐡",rarity:"uncommon", wt:[0.2,1.0],  desc:"Clean white flesh"},
    {id:"herring",   name:"Atlantic Herring",       emoji:"🐟",rarity:"uncommon", wt:[0.1,0.4],  desc:"Schools in silver waves"},
    // Rare (9)
    {id:"swordfish", name:"Swordfish",              emoji:"⚔️",rarity:"rare",     wt:[30,180],   desc:"Slices through the deep blue"},
    {id:"mahimahi",  name:"Mahi-Mahi",              emoji:"🌈",rarity:"rare",     wt:[2.5,18],   desc:"Neon colors, acrobatic fighter"},
    {id:"wahoo",     name:"Wahoo",                  emoji:"💨",rarity:"rare",     wt:[4.0,25],   desc:"Fastest fish in the sea"},
    {id:"tuna",      name:"Yellowfin Tuna",         emoji:"🐟",rarity:"rare",     wt:[10,60],    desc:"Ocean sprinter"},
    {id:"tarpon",    name:"Tarpon",                 emoji:"🪙",rarity:"rare",     wt:[15,80],    desc:"Silver king of the flats"},
    {id:"barracuda", name:"Great Barracuda",        emoji:"⚡",rarity:"rare",     wt:[3,15],     desc:"Teeth like razors"},
    {id:"bonefish",  name:"Bonefish",               emoji:"💫",rarity:"rare",     wt:[0.5,3.5],  desc:"The ghost of the flats"},
    {id:"amberjack", name:"Greater Amberjack",      emoji:"🟡",rarity:"rare",     wt:[5,30],     desc:"Reef donkey — fights hard"},
    {id:"striped",   name:"Striped Bass",           emoji:"🐠",rarity:"rare",     wt:[1.5,25],   desc:"Trophy of the Northeast"},
    // Epic (6)
    {id:"gtrevally", name:"Giant Trevally",         emoji:"💪",rarity:"epic",     wt:[5,40],     desc:"Apex hunter of the reef"},
    {id:"ggrouper",  name:"Goliath Grouper",        emoji:"🏔️",rarity:"epic",    wt:[50,220],   desc:"Swallows boats (almost)"},
    {id:"arapaima",  name:"Arapaima",               emoji:"🌿",rarity:"epic",     wt:[20,120],   desc:"Amazon giant — breathes air"},
    {id:"alligar",   name:"Alligator Gar",          emoji:"🦷",rarity:"epic",     wt:[15,80],    desc:"Living fossil in scales"},
    {id:"tigerfish", name:"Goliath Tiger Fish",     emoji:"🐯",rarity:"epic",     wt:[5,25],     desc:"Africa's most feared river fish"},
    {id:"payara",    name:"Payara (Vampire Fish)",  emoji:"🧛",rarity:"epic",     wt:[3,12],     desc:"Fangs that pierce its own jaw"},
    // Legendary (5)
    {id:"bluemarlin",name:"Blue Marlin",            emoji:"🏆",rarity:"legendary",wt:[80,500],   desc:"The pinnacle of big-game fishing"},
    {id:"gbluefin",  name:"Giant Bluefin Tuna",     emoji:"⭐",rarity:"legendary",wt:[150,680],  desc:"The most expensive fish alive"},
    {id:"oarfish",   name:"Oarfish",                emoji:"🐉",rarity:"legendary",wt:[50,300],   desc:"30-foot sea serpent of myth"},
    {id:"molamola",  name:"Ocean Sunfish",          emoji:"🌞",rarity:"legendary",wt:[200,2200], desc:"2-ton floating pancake from another dimension"},
    {id:"coelacanth",name:"Coelacanth",             emoji:"💎",rarity:"legendary",wt:[10,80],    desc:"Extinct for 65 million years… or so they thought"},
    // Mythic (4)
    {id:"ghostkoi",  name:"Ghost Koi",              emoji:"👻",rarity:"mythic",   wt:[0.3,2.0],  desc:"Semi-transparent — vanishes in the hand"},
    {id:"anglerfish",name:"Deep Sea Anglerfish",    emoji:"💀",rarity:"mythic",   wt:[1,5],      desc:"Lantern of nightmares from 3,000m down"},
    {id:"aurorafish",name:"Aurora Salmon",          emoji:"🌈",rarity:"mythic",   wt:[3,12],     desc:"Scales shimmer every color at once"},
    {id:"eelec",     name:"Electric Eel",           emoji:"⚡",rarity:"mythic",   wt:[5,20],     desc:"600 volts — you felt that one"},
    // Secret (3)
    {id:"leviathan", name:"Ancient Leviathan",      emoji:"🌊",rarity:"secret",     wt:[8000,32000],desc:"Biblical sea monster. CLASSIFIED."},
    {id:"crystaldragon",name:"Crystal Dragon Fish", emoji:"🐲",rarity:"secret",     wt:[0.001,0.01],desc:"Looks like a fragment of the universe itself"},
    {id:"thatone",   name:"The One That Got Away",  emoji:"❓",rarity:"secret",     wt:[null,null], desc:"You finally caught it. It's real."},
    // Impossible (1)
    {id:"kraken",    name:"The Kraken",             emoji:"🦑",rarity:"impossible", wt:[500000,2000000],desc:"It shouldn't exist. It does. You'll never prove it."},
  ];

  const LUCK_KEY = "fishing_luck_v1";
  const MAX_LUCK = 1.0, LUCK_PER_CAST = 0.0005;
  let totalCasts = 0, luck = 0;
  (function loadLuckState() {
    try { const d = JSON.parse(localStorage.getItem(LUCK_KEY)||"{}"); totalCasts = d.casts||0; luck = d.luck||0; } catch {}
  })();
  function saveLuckState() { try { localStorage.setItem(LUCK_KEY, JSON.stringify({casts:totalCasts,luck})); } catch {} }

  function getLuckWeights() {
    const L = luck;
    return {
      common:     RARITY.common.weight     * Math.max(0, 1 - L * 1.4),
      uncommon:   RARITY.uncommon.weight   * Math.max(0, 1 - L),
      rare:       RARITY.rare.weight       * (1 + L * 2),
      epic:       RARITY.epic.weight       * (1 + L * 3.5),
      legendary:  RARITY.legendary.weight  * (1 + L * 6),
      mythic:     RARITY.mythic.weight     * (1 + L * 10),
      secret:     RARITY.secret.weight     * (1 + L * 16),
      impossible: RARITY.impossible.weight,
    };
  }

  function rollFish() {
    const w = getLuckWeights();
    const tot = Object.values(w).reduce((s,v) => s+v, 0);
    let rand = Math.random()*tot, tier = "common";
    for (const [t,v] of Object.entries(w)) { rand -= v; if (rand <= 0) { tier = t; break; } }
    const pool = FISH.filter(f => f.rarity === tier);
    const fish = pool[Math.floor(Math.random()*pool.length)];
    const [lo, hi] = fish.wt;
    const wStr = lo !== null ? (lo + Math.random()*(hi-lo)).toFixed(2) : null;
    return { fish, wStr };
  }

  const COLL_KEY = "fishing_coll_v1";
  function loadColl() { try { return JSON.parse(localStorage.getItem(COLL_KEY)||"{}"); } catch { return {}; } }
  function recordCatch(fish, wStr) {
    const c = loadColl();
    if (!c[fish.id]) c[fish.id] = {n:0, best:0};
    c[fish.id].n++;
    const w = parseFloat(wStr||"0");
    if (w > c[fish.id].best) c[fish.id].best = w;
    try { localStorage.setItem(COLL_KEY, JSON.stringify(c)); } catch {}
  }

  const canvas = document.getElementById("fish-canvas");
  const ctx = canvas.getContext("2d");
  let raf = null, phase = 0;

  function resize() {
    const p = canvas.parentElement;
    if (!p) return;
    canvas.width = p.offsetWidth || 400;
    canvas.height = p.offsetHeight || 500;
  }

  let state = "idle", stateStart = 0;
  let CAST_DUR = 550, REEL_DUR = 650, MISS_DUR = 1200;
  let speedActive = false, autoActive = false, autoTimer = null;
  let bobTX = 200, nibbleActive = false, hookOpen = false;
  let waitTimer = null, nibbleMissTimer = null, nibblePingTimer = null;

  function enterState(s) { state = s; stateStart = Date.now(); }

  function skyColors() {
    const h = new Date().getHours();
    if (h >= 6 && h < 8)  return ["#0d0820","#c04010","#183050"];
    if (h >= 8 && h < 18) return ["#061428","#0a3060","#0c2e50"];
    if (h >= 18 && h < 20) return ["#180028","#b03010","#0a1e3a"];
    return ["#000408","#010614","#060c16"];
  }

  function drawFrame() {
    const W = canvas.width, H = canvas.height;
    const elapsed = Date.now() - stateStart;
    const waterY = H * 0.40;
    const rodTipX = W * 0.88, rodTipY = H * 0.15;
    const baseBy = waterY + 5;

    ctx.clearRect(0, 0, W, H);

    const [s0,s1,w0] = skyColors();
    const sg = ctx.createLinearGradient(0,0,0,waterY);
    sg.addColorStop(0,s0); sg.addColorStop(1,s1);
    ctx.fillStyle = sg; ctx.fillRect(0,0,W,waterY);

    const hr = new Date().getHours();
    if (hr >= 20 || hr < 6) {
      for (let i = 0; i < 44; i++) {
        const sx=(i*73+17)%W, sy=(i*113+31)%(waterY-10);
        ctx.globalAlpha = 0.25 + 0.75*Math.abs(Math.sin(phase*0.018+i));
        ctx.fillStyle = "#fff"; ctx.fillRect(sx,sy,1.5,1.5);
      }
      ctx.globalAlpha = 1;
    }

    const wg = ctx.createLinearGradient(0,waterY,0,H);
    wg.addColorStop(0,w0); wg.addColorStop(1,"#010608");
    ctx.fillStyle = wg; ctx.fillRect(0,waterY,W,H-waterY);

    for (const [amp,freq,spd,a] of [[3,0.010,0.55,0.07],[2,0.016,0.90,0.05],[1.5,0.024,1.4,0.04]]) {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const y = waterY + amp*Math.sin(x*freq + phase*spd*0.07);
        x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
      ctx.fillStyle = `rgba(96,210,255,${a})`; ctx.fill();
    }
    ctx.beginPath();
    for (let x = 0; x <= W; x += 2) {
      const y = waterY-1+1.5*Math.sin(x*0.026+phase*0.11);
      x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.strokeStyle = "rgba(160,240,255,0.16)"; ctx.lineWidth = 1.5; ctx.stroke();

    ctx.save(); ctx.lineCap = "round";
    ctx.strokeStyle = "#9a5820"; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(W*0.99,H*0.45); ctx.lineTo(W*0.93,H*0.30); ctx.stroke();
    ctx.strokeStyle = "#cc8c50"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(W*0.93,H*0.30); ctx.lineTo(rodTipX,rodTipY); ctx.stroke();
    ctx.restore();

    let bx=0, by=0, showLine=true;
    if (state==="idle") {
      showLine = false;
    } else if (state==="casting") {
      const t = Math.min(1, elapsed/CAST_DUR), e = 1-Math.pow(1-t,3);
      bx = rodTipX + (bobTX-rodTipX)*e;
      by = rodTipY + (baseBy-rodTipY)*e - Math.sin(e*Math.PI)*H*0.2;
    } else if (state==="waiting") {
      bx = bobTX; by = baseBy + Math.sin(phase*0.06)*3;
    } else if (state==="nibble") {
      bx = bobTX; by = baseBy + Math.sin(phase*0.09)*2 + (nibbleActive ? 10 : 0);
    } else if (state==="missed") {
      bx = bobTX; by = baseBy + 14;
    } else if (state==="reeling") {
      const t = Math.min(1, elapsed/REEL_DUR), e = t*t;
      bx = bobTX + (rodTipX-bobTX)*e;
      by = baseBy + (rodTipY-baseBy)*e;
      if (t >= 0.98) showLine = false;
    } else {
      showLine = false;
    }

    if (showLine) {
      ctx.beginPath(); ctx.moveTo(rodTipX,rodTipY); ctx.lineTo(bx,by-7);
      ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(bx,by,7,Math.PI,0); ctx.fillStyle = "#ef4444"; ctx.fill();
      ctx.beginPath(); ctx.arc(bx,by,7,0,Math.PI); ctx.fillStyle = "#f8f8f8"; ctx.fill();
      ctx.beginPath(); ctx.arc(bx,by,7,0,Math.PI*2);
      ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 1; ctx.stroke();
    }

    if (state==="missed") {
      const a = Math.max(0, 1 - elapsed/MISS_DUR);
      ctx.globalAlpha = a;
      ctx.fillStyle = "#ff6060"; ctx.font = "800 1.2rem 'Syne',sans-serif";
      ctx.textAlign = "center"; ctx.fillText("Too slow! 😔", W/2, H*0.28);
      ctx.textAlign = "left"; ctx.globalAlpha = 1;
    }
  }

  function loop() {
    if (!overlay.classList.contains("open")) { raf = null; return; }
    phase++;
    drawFrame();
    raf = requestAnimationFrame(loop);
  }

  const castBtn = document.getElementById("fish-cast-btn");
  const hookBtn = document.getElementById("fish-hook-btn");
  const revealEl = document.getElementById("fish-reveal");
  const rnRarity = document.getElementById("fish-rn-rarity");
  const rnName   = document.getElementById("fish-rn-name");
  const rnDesc   = document.getElementById("fish-rn-desc");
  const rnWeight = document.getElementById("fish-rn-weight");
  const rnNext   = document.getElementById("fish-rn-next");
  const modelCanvas = document.getElementById("fish-model-canvas");
  const modelCtx = modelCanvas ? modelCanvas.getContext("2d") : null;
  let modelRaf = null, modelPhase = 0;

  function goToIdle() {
    enterState("idle");
    clearTimeout(waitTimer); clearTimeout(nibbleMissTimer); clearTimeout(nibblePingTimer);
    hookOpen = false; nibbleActive = false;
    if (modelRaf) { cancelAnimationFrame(modelRaf); modelRaf = null; }
    if (castBtn) castBtn.style.display = "";
    if (hookBtn) hookBtn.style.display = "none";
    if (revealEl) { revealEl.style.display = "none"; revealEl.className = "fish-reveal"; }
    if (autoActive) { clearTimeout(autoTimer); autoTimer = setTimeout(doCast, speedActive ? 450 : 900); }
  }

  function doCast() {
    if (state !== "idle") return;
    totalCasts++;
    luck = Math.min(MAX_LUCK, luck + LUCK_PER_CAST);
    saveLuckState();
    updateStatsBar();
    updateSideButtons();
    bobTX = canvas.width * (0.22 + Math.random()*0.38);
    enterState("casting");
    castBtn.style.display = "none";
    waitTimer = setTimeout(() => {
      if (state === "casting") {
        enterState("waiting");
        waitTimer = setTimeout(startNibble, (speedActive ? 1000 : 2000) + Math.random()*(speedActive ? 2500 : 5000));
      }
    }, CAST_DUR);
  }

  function startNibble() {
    if (state !== "waiting") return;
    enterState("nibble");
    hookOpen = true;
    if (hookBtn) hookBtn.style.display = "";
    let i = 0, total = 3 + Math.floor(Math.random()*4);
    function ping() {
      if (state !== "nibble" || !hookOpen) return;
      nibbleActive = true;
      nibblePingTimer = setTimeout(() => {
        nibbleActive = false; i++;
        if (i < total) nibblePingTimer = setTimeout(ping, 280 + Math.random()*180);
      }, 200);
    }
    ping();
    nibbleMissTimer = setTimeout(() => {
      if (state !== "nibble") return;
      hookOpen = false;
      clearTimeout(nibblePingTimer); nibbleActive = false;
      if (hookBtn) hookBtn.style.display = "none";
      enterState("missed");
      setTimeout(() => { if (state === "missed") goToIdle(); }, MISS_DUR);
    }, 2000);
  }

  function doHook() {
    if (state !== "nibble" || !hookOpen) return;
    clearTimeout(nibbleMissTimer); clearTimeout(nibblePingTimer); clearTimeout(waitTimer);
    hookOpen = false; nibbleActive = false;
    if (hookBtn) hookBtn.style.display = "none";
    enterState("reeling");
    const {fish, wStr} = rollFish();
    recordCatch(fish, wStr);
    setTimeout(() => showReveal(fish, wStr), REEL_DUR + 80);
  }

  function showReveal(fish, wStr) {
    enterState("reveal");
    if (castBtn) castBtn.style.display = "none";
    const r = RARITY[fish.rarity];
    rnRarity.textContent = r.label; rnRarity.style.color = r.color;
    rnName.textContent = fish.name;
    rnDesc.textContent = fish.desc;
    rnWeight.textContent = wStr ? `${parseFloat(wStr).toLocaleString()} kg` : "?? kg";
    const inner = revealEl.querySelector(".fish-rv-inner");
    if (inner) { inner.style.setProperty("--rv-color", r.color); inner.style.setProperty("--rv-glow", r.glow); }
    revealEl.style.display = "flex";
    revealEl.className = "fish-reveal fish-rarity-" + fish.rarity;
    void revealEl.offsetHeight;
    revealEl.classList.add("fish-reveal-show");
    if (modelCtx) {
      if (modelRaf) cancelAnimationFrame(modelRaf);
      modelPhase = 0;
      (function animModel() {
        try {
          modelPhase++;
          FISH_RENDERER.drawFish(modelCtx, fish.id, fish.rarity, modelPhase);
        } catch(e) { console.warn("[fish render]", e); }
        modelRaf = requestAnimationFrame(animModel);
      })();
    }
    updateCollBtn();
  }

  const speedBtn = document.getElementById("fish-speed-btn");
  const autoBtn  = document.getElementById("fish-auto-btn");
  const totalCastsEl = document.getElementById("fish-total-casts");
  const luckBarEl    = document.getElementById("fish-luck-bar");

  function updateStatsBar() {
    if (totalCastsEl) totalCastsEl.textContent = `${totalCasts.toLocaleString()} CAST${totalCasts !== 1 ? "S" : ""}`;
    if (luckBarEl) luckBarEl.textContent = `LUCK ${(luck * 100).toFixed(2)}%`;
  }

  function updateSideButtons() {
    if (speedBtn) {
      if (totalCasts >= 100) {
        speedBtn.classList.add("unlocked");
        speedBtn.innerHTML = speedActive ? "2× ON" : "2× OFF";
        speedBtn.classList.toggle("fish-btn-on", speedActive);
        speedBtn.title = speedActive ? "2× Speed — click to disable" : "2× Speed — click to enable";
      } else {
        speedBtn.innerHTML = `🔒 2× <span style="font-size:0.5em;opacity:0.5">${totalCasts}/100</span>`;
      }
    }
    if (autoBtn) {
      if (totalCasts >= 25) {
        autoBtn.classList.add("unlocked");
        autoBtn.innerHTML = autoActive ? "AUTO ■" : "AUTO ▶";
        autoBtn.classList.toggle("fish-btn-on", autoActive);
        autoBtn.title = autoActive ? "Auto-cast ON — click to stop" : "Auto-cast — click to enable";
      } else {
        autoBtn.innerHTML = `🔒 AUTO <span style="font-size:0.5em;opacity:0.5">${totalCasts}/25</span>`;
      }
    }
  }

  if (speedBtn) speedBtn.addEventListener("click", () => {
    if (totalCasts < 100) return;
    speedActive = !speedActive;
    CAST_DUR = speedActive ? 275 : 550;
    REEL_DUR = speedActive ? 325 : 650;
    MISS_DUR = speedActive ? 600 : 1200;
    updateSideButtons();
  });

  if (autoBtn) autoBtn.addEventListener("click", () => {
    if (totalCasts < 25) return;
    autoActive = !autoActive;
    if (!autoActive) { clearTimeout(autoTimer); autoTimer = null; }
    updateSideButtons();
    if (autoActive && state === "idle") { clearTimeout(autoTimer); autoTimer = setTimeout(doCast, 600); }
  });

  if (castBtn) castBtn.addEventListener("click", doCast);
  if (hookBtn) hookBtn.addEventListener("click", doHook);
  if (rnNext) rnNext.addEventListener("click", goToIdle);

  const collTab = document.getElementById("fish-coll-tab");
  const gameTab = document.getElementById("fish-game-tab");
  const collGrid = document.getElementById("fish-coll-grid");
  const collCountEl = document.getElementById("fish-coll-count");
  const tabBtns = overlay.querySelectorAll(".fish-tab-btn");

  function updateCollBtn() {
    const n = Object.keys(loadColl()).length;
    const btn = overlay.querySelector('[data-tab="index"]');
    if (btn) btn.textContent = `Index (${n})`;
  }

  function fishCatchPct(fish) {
    const baseW = { common:55, uncommon:25, rare:12, epic:5, legendary:2, mythic:0.8, secret:0.03, impossible:0.001 };
    const total = Object.values(baseW).reduce((s,v) => s+v, 0);
    const tierCount = FISH.filter(f => f.rarity === fish.rarity).length;
    return (baseW[fish.rarity] / total / tierCount) * 100;
  }

  function formatPct(p) {
    if (p === 0) return "0%";
    if (p < 0.001) return p.toFixed(4) + "%";
    if (p < 0.01)  return p.toFixed(3) + "%";
    if (p < 0.1)   return p.toFixed(2) + "%";
    if (p < 1)     return p.toFixed(2) + "%";
    return p.toFixed(1) + "%";
  }

  function renderCollection() {
    const c = loadColl();
    const caught = FISH.filter(f => c[f.id]);
    if (collCountEl) collCountEl.textContent = `${caught.length} / ${FISH.length} discovered`;
    if (!collGrid) return;
    collGrid.innerHTML = "";
    const order = ["impossible","secret","mythic","legendary","epic","rare","uncommon","common"];
    const sorted = [
      ...FISH.filter(f => c[f.id]).sort((a,b) => order.indexOf(a.rarity)-order.indexOf(b.rarity)),
      ...FISH.filter(f => !c[f.id]).sort((a,b) => order.indexOf(a.rarity)-order.indexOf(b.rarity))
    ];
    for (const fish of sorted) {
      const data = c[fish.id], r = RARITY[fish.rarity];
      const pct = formatPct(fishCatchPct(fish));
      const div = document.createElement("div");
      div.className = "fish-cc" + (data ? " fish-cc-found" : " fish-cc-unknown") + (fish.rarity === "impossible" ? " fish-cc-impossible" : "");
      div.style.setProperty("--rc", r.color);
      if (data) {
        div.innerHTML = `<div class="fish-cc-em">${fish.emoji}</div><div class="fish-cc-nm">${fish.name}</div><div class="fish-cc-ti" style="color:${r.color}">${r.label}</div><div class="fish-cc-pct">${pct}</div><div class="fish-cc-ct">×${data.n}</div>`;
        div.title = `${fish.name} · ${fish.desc}\nBest: ${data.best.toLocaleString()} kg · Catch rate: ${pct}`;
      } else {
        div.innerHTML = `<div class="fish-cc-em fish-cc-unk">?</div><div class="fish-cc-nm fish-cc-unk">???</div><div class="fish-cc-ti" style="color:${r.color}">${r.label}</div><div class="fish-cc-pct">${pct}</div>`;
      }
      collGrid.appendChild(div);
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active")); btn.classList.add("active");
      const tab = btn.dataset.tab;
      if (gameTab) gameTab.style.display = tab==="game" ? "" : "none";
      if (collTab) { collTab.style.display = tab==="index" ? "" : "none"; if (tab==="index") renderCollection(); }
    });
  });

  const ro = new ResizeObserver(resize);

  function open() {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    resize();
    ro.observe(canvas.parentElement);
    goToIdle();
    updateCollBtn();
    updateStatsBar();
    updateSideButtons();
    if (!raf) raf = requestAnimationFrame(loop);
  }

  GAMES.fishing = open;
  document.addEventListener("keydown", e => {
    if (overlay.classList.contains("open") && e.key === "Escape") {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
      ro.disconnect();
      clearTimeout(waitTimer); clearTimeout(nibbleMissTimer); clearTimeout(nibblePingTimer);
      if (modelRaf) { cancelAnimationFrame(modelRaf); modelRaf = null; }
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    }
  });
}
