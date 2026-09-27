import { GAMES as GAME_LIST, CATEGORIES } from './games-data.js';

export function initMainGamesGrid(GAMES_REGISTRY) {
  const grid       = document.getElementById('main-games-grid');
  const overlay    = document.getElementById('game-overlay');
  const titleEl    = document.getElementById('game-overlay-title');
  const frame      = document.getElementById('game-frame');
  const closeBtn   = document.getElementById('game-overlay-close');
  const fsBtn      = document.getElementById('game-overlay-fullscreen');
  const reloadBtn  = document.getElementById('game-overlay-reload');
  const newTabBtn  = document.getElementById('game-overlay-newtab');
  const favBtn     = document.getElementById('game-overlay-fav');
  const spinner    = document.getElementById('game-overlay-spinner');
  const searchInput = document.getElementById('search-input');

  if (!grid) return;

  let activeFilter = 'all';
  let activeGame   = null;
  let boredPool    = null;
  let searchQ      = '';

  // ── Filter logic ────────────────────────────────────────────
  function getFilteredGames() {
    let list = [...GAME_LIST];
    if (searchQ) {
      list = list.filter(g =>
        g.title.toLowerCase().includes(searchQ) ||
        g.category.toLowerCase().includes(searchQ) ||
        (g.tags || []).some(t => t.toLowerCase().includes(searchQ))
      );
    }
    if (activeFilter === 'all') return list;
    if (activeFilter === 'shooting') return list.filter(g =>
      g.category === 'Shooter' || (g.tags || []).some(t => ['shooting','fps','shooter','sniper','gun'].includes(t))
    );
    if (activeFilter === 'sports') return list.filter(g =>
      g.category === 'Sports' || (g.tags || []).some(t => ['sport','sports','basketball','soccer','football','baseball'].includes(t))
    );
    if (activeFilter === 'boardgame') return list.filter(g =>
      ['Puzzle','Strategy'].includes(g.category) ||
      (g.tags || []).some(t => ['puzzle','board','strategy','chess','cards','2048','word'].includes(t))
    );
    if (activeFilter === 'bored') {
      if (!boredPool) {
        boredPool = [...list].sort(() => Math.random() - 0.5).slice(0, 24);
      }
      return boredPool;
    }
    return list;
  }

  function renderGames() {
    const list = getFilteredGames();
    grid.innerHTML = '';
    if (list.length === 0) {
      grid.insertAdjacentHTML('beforeend', '<p class="games-empty">No games found.</p>');
      return;
    }
    list.forEach(g => { GAMES_REGISTRY[g.id] = () => handleGameClick(g); });
    list.forEach(g => grid.appendChild(makeCard(g)));
  }

  function makeCard(g) {
    const btn = document.createElement('button');
    btn.className = 'game-card main-game-card';
    btn.dataset.game = g.id;
    const thumb = g.thumbnail || buildPlaceholderSvg(g.title);
    btn.innerHTML =
      `<div class="game-card-icon"><img src="${escHtml(thumb)}" alt="${escHtml(g.title)}" loading="lazy" onerror="this.src='${buildPlaceholderSvg(g.title)}'"></div>` +
      `<div class="game-card-name">${escHtml(g.title)}</div>`;
    return btn;
  }

  // ── Click on grid (event delegation) ────────────────────────
  grid.addEventListener('click', e => {
    const card = e.target.closest('.main-game-card');
    if (!card) return;
    const g = GAME_LIST.find(x => x.id === card.dataset.game);
    if (g) handleGameClick(g);
  });

  const APP_URLS = { tiktok:'https://tiktok.com', reddit:'https://reddit.com', roblox:'https://roblox.com', omegle:'https://omegle.com' };

  function handleGameClick(g) {
    if (g.embedPath && g.embedPath.startsWith('app:')) {
      const appName = g.embedPath.slice(4);
      if (appName === 'instagram') {
        if (window._openInstagram) { window._openInstagram(); return; }
        const ol = document.getElementById('ig-overlay');
        if (ol) { ol.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
        return;
      }
      if (appName === 'spotify') {
        if (window._openMusicPlayer) window._openMusicPlayer();
        return;
      }
      const ol = document.getElementById(appName + '-overlay');
      if (!ol) return;
      const frame = ol.querySelector('.app-overlay-frame');
      if (frame && frame.src === 'about:blank') frame.src = APP_URLS[appName] || '';
      ol.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      return;
    }
    openGame(g);
  }

  // ── Game player ─────────────────────────────────────────────
  function openGame(g) {
    if (!overlay || !frame) return;
    activeGame = g;
    frame.src = g.embedPath;
    if (titleEl) titleEl.textContent = g.title;
    if (spinner) spinner.classList.add('visible');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    saveRecent(g.id);
    updateFavBtn();
  }

  function closeGame() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (spinner) spinner.classList.remove('visible');
    setTimeout(() => { if (frame) frame.src = ''; activeGame = null; }, 300);
  }

  if (frame) frame.addEventListener('load', () => { if (spinner) spinner.classList.remove('visible'); });
  if (closeBtn) closeBtn.addEventListener('click', closeGame);
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeGame(); });
  document.addEventListener('keydown', e => {
    if (overlay && overlay.classList.contains('open') && e.key === 'Escape') closeGame();
  });

  if (fsBtn) fsBtn.addEventListener('click', () => {
    const el = (overlay && overlay.querySelector('.game-modal-body')) || frame;
    if (!el) return;
    const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
    if (req) req.call(el).catch(() => {});
  });

  if (reloadBtn) reloadBtn.addEventListener('click', () => {
    if (frame && frame.src) { const s = frame.src; frame.src = ''; frame.src = s; }
    if (spinner) spinner.classList.add('visible');
  });

  if (newTabBtn) newTabBtn.addEventListener('click', () => {
    if (activeGame) window.open(activeGame.embedPath, '_blank', 'noopener');
  });

  function updateFavBtn() {
    if (!favBtn || !activeGame) return;
    const isFav = loadFavs().includes(activeGame.id);
    favBtn.classList.toggle('active', isFav);
    favBtn.title = isFav ? 'Remove from favorites' : 'Add to favorites';
  }

  if (favBtn) favBtn.addEventListener('click', () => {
    if (!activeGame) return;
    let favs = loadFavs();
    favs = favs.includes(activeGame.id) ? favs.filter(x => x !== activeGame.id) : [...favs, activeGame.id];
    saveFavs(favs);
    updateFavBtn();
  });

  // ── Tab switching ─────────────────────────────────────────
  document.querySelectorAll('[data-game-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.gameFilter;
      const linksList   = document.getElementById('links-list');
      const resultsMeta = document.querySelector('.results-meta');

      document.querySelectorAll('[data-game-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (f === 'sites') {
        grid.style.display = 'none';
        if (linksList)   linksList.style.display   = '';
        if (resultsMeta) resultsMeta.style.display = '';
        if (window.__setFilter) window.__setFilter('all');
        return;
      }

      grid.style.display = '';
      if (linksList)   linksList.style.display   = 'none';
      if (resultsMeta) resultsMeta.style.display = 'none';

      if (f === 'bored') boredPool = null;
      activeFilter = f;
      renderGames();
    });
  });

  // ── Search ─────────────────────────────────────────────────
  if (searchInput) searchInput.addEventListener('input', () => {
    searchQ = searchInput.value.trim().toLowerCase();
    if (activeFilter !== 'sites') renderGames();
  });

  // ── Initial render ───────────────────────────────────────────
  const linksList   = document.getElementById('links-list');
  const resultsMeta = document.querySelector('.results-meta');
  if (linksList)   linksList.style.display   = 'none';
  if (resultsMeta) resultsMeta.style.display = 'none';
  renderGames();
}

const FAV_KEY = 'games-favorites';
const RECENT_KEY = 'games-recent';
const RECENT_MAX = 10;

function loadFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { return []; }
}
function saveFavs(arr) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(arr)); } catch {}
}
function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function saveRecent(id) {
  try {
    let r = loadRecent().filter(x => x !== id);
    r.unshift(id);
    localStorage.setItem(RECENT_KEY, JSON.stringify(r.slice(0, RECENT_MAX)));
  } catch {}
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

function buildPlaceholderSvg(title) {
  const colors = ['#6366f1','#8b5cf6','#ec4899','#ef4444','#f59e0b','#10b981','#3b82f6','#06b6d4'];
  const i = (title.charCodeAt(0) || 0) % colors.length;
  const letter = (title[0] || '?').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="46" height="46"><rect width="46" height="46" rx="8" fill="${colors[i]}"/><text x="23" y="31" text-anchor="middle" font-size="22" font-family="sans-serif" fill="rgba(255,255,255,0.9)" font-weight="bold">${escHtml(letter)}</text></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

export function initGamesSection(GAMES_REGISTRY) {
  const grid        = document.getElementById('games-grid-inner');
  const overlay     = document.getElementById('game-overlay');
  const titleEl     = document.getElementById('game-overlay-title');
  const frame       = document.getElementById('game-frame');
  const closeBtn    = document.getElementById('game-overlay-close');
  const fsBtn       = document.getElementById('game-overlay-fullscreen');
  const reloadBtn   = document.getElementById('game-overlay-reload');
  const newTabBtn   = document.getElementById('game-overlay-newtab');
  const favBtn      = document.getElementById('game-overlay-fav');
  const spinner     = document.getElementById('game-overlay-spinner');
  const searchInput = document.getElementById('games-search');
  const filterBtn   = document.getElementById('games-filter-btn');
  const filterPanel = document.getElementById('games-filter-panel');
  const filterClear = document.getElementById('games-filter-clear');
  const catList     = document.getElementById('games-filter-cats');
  const sortSel     = document.getElementById('games-sort-select');

  if (!grid || !overlay || !frame) return;

  // ── State ──────────────────────────────────────────────────
  let activeGame    = null;  // { id, title, embedPath }
  let searchQ       = '';
  let activeCats    = new Set();  // empty = all
  let sortMode      = 'default';
  let filterOpen    = false;

  // ── Build category checkboxes ───────────────────────────────
  if (catList) {
    CATEGORIES.filter(c => c !== 'All').forEach(cat => {
      const label = document.createElement('label');
      label.className = 'gf-cat-label';
      label.innerHTML = `<input type="checkbox" class="gf-cat-cb" value="${escHtml(cat)}"><span>${escHtml(cat)}</span>`;
      catList.appendChild(label);
    });
    catList.addEventListener('change', () => {
      activeCats = new Set(
        [...catList.querySelectorAll('.gf-cat-cb:checked')].map(cb => cb.value)
      );
      applyFilters();
      updateFilterBtnState();
    });
  }

  if (sortSel) {
    sortSel.addEventListener('change', () => {
      sortMode = sortSel.value;
      applyFilters();
    });
  }

  if (filterClear) {
    filterClear.addEventListener('click', () => {
      activeCats.clear();
      sortMode = 'default';
      if (catList) catList.querySelectorAll('.gf-cat-cb').forEach(cb => { cb.checked = false; });
      if (sortSel) sortSel.value = 'default';
      applyFilters();
      updateFilterBtnState();
    });
  }

  // ── Filter panel toggle ─────────────────────────────────────
  if (filterBtn && filterPanel) {
    filterBtn.addEventListener('click', e => {
      e.stopPropagation();
      filterOpen = !filterOpen;
      filterPanel.classList.toggle('open', filterOpen);
      filterBtn.classList.toggle('active', filterOpen);
    });
  }

  // ── Search ─────────────────────────────────────────────────
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQ = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // ── Render + filter ─────────────────────────────────────────
  function getFilteredGames() {
    let list = [...GAME_LIST];
    if (searchQ) {
      list = list.filter(g =>
        g.title.toLowerCase().includes(searchQ) ||
        g.category.toLowerCase().includes(searchQ) ||
        (g.tags || []).some(t => t.toLowerCase().includes(searchQ))
      );
    }
    if (activeCats.size > 0) {
      list = list.filter(g => activeCats.has(g.category));
    }
    if (sortMode === 'az') list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortMode === 'za') list.sort((a, b) => b.title.localeCompare(a.title));
    else if (sortMode === 'featured') list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return list;
  }

  function applyFilters() {
    const list = getFilteredGames();
    const favs = loadFavs();
    grid.innerHTML = '';
    if (list.length === 0) {
      grid.insertAdjacentHTML('beforeend', '<p class="games-empty">No games found.</p>');
      return;
    }
    list.forEach(g => {
      GAMES_REGISTRY[g.id] = () => openGame(g);
      grid.appendChild(makeCard(g, favs));
    });
  }

  function makeCard(g, favs) {
    const btn = document.createElement('button');
    btn.className = 'game-card';
    btn.dataset.game = g.id;
    const thumb = g.thumbnail || buildPlaceholderSvg(g.title);
    btn.innerHTML =
      `<div class="game-card-icon"><img src="${escHtml(thumb)}" alt="${escHtml(g.title)}" loading="lazy" onerror="this.src='${buildPlaceholderSvg(g.title)}'"></div>` +
      `<div class="game-card-name">${escHtml(g.title)}</div>`;
    if (favs.includes(g.id)) btn.classList.add('game-card-fav');
    return btn;
  }

  function updateFilterBtnState() {
    if (!filterBtn) return;
    const hasFilters = activeCats.size > 0 || sortMode !== 'default';
    filterBtn.classList.toggle('has-filters', hasFilters);
  }

  // ── Game player ─────────────────────────────────────────────
  function openGame(g) {
    activeGame = g;
    frame.src = g.embedPath;
    if (titleEl) titleEl.textContent = g.title;
    if (spinner) spinner.classList.add('visible');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    saveRecent(g.id);
    updateFavBtn();
  }

  function closeGame() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (spinner) spinner.classList.remove('visible');
    setTimeout(() => { frame.src = ''; activeGame = null; }, 300);
  }

  // Hide spinner when iframe loads
  frame.addEventListener('load', () => {
    if (spinner) spinner.classList.remove('visible');
  });

  // Close
  if (closeBtn) closeBtn.addEventListener('click', closeGame);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeGame(); });
  document.addEventListener('keydown', e => {
    if (overlay.classList.contains('open') && e.key === 'Escape') closeGame();
  });

  // Fullscreen
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      const container = overlay.querySelector('.game-modal-body');
      const el = container || frame;
      const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
      if (req) req.call(el).catch(() => {});
    });
  }

  // Reload
  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
      if (frame.src) { const s = frame.src; frame.src = ''; frame.src = s; }
      if (spinner) spinner.classList.add('visible');
    });
  }

  // New tab
  if (newTabBtn) {
    newTabBtn.addEventListener('click', () => {
      if (activeGame) window.open(activeGame.embedPath, '_blank', 'noopener');
    });
  }

  // Favorite toggle
  function updateFavBtn() {
    if (!favBtn || !activeGame) return;
    const favs = loadFavs();
    const isFav = favs.includes(activeGame.id);
    favBtn.classList.toggle('active', isFav);
    favBtn.title = isFav ? 'Remove from favorites' : 'Add to favorites';
  }

  if (favBtn) {
    favBtn.addEventListener('click', () => {
      if (!activeGame) return;
      let favs = loadFavs();
      if (favs.includes(activeGame.id)) {
        favs = favs.filter(x => x !== activeGame.id);
      } else {
        favs.push(activeGame.id);
      }
      saveFavs(favs);
      updateFavBtn();
      // update card in grid
      const card = grid.querySelector(`[data-game="${activeGame.id}"]`);
      if (card) card.classList.toggle('game-card-fav', favs.includes(activeGame.id));
    });
  }

  // ── Initial render ───────────────────────────────────────────
  applyFilters();
}
