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
initHotBanner();
initInstagram();
initQuickHide();

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
    const slide = document.createElement("div");
    slide.className = "hot-slide";
    slide.onclick = () => window.open(m.url, "_blank");
    slide.innerHTML = `
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