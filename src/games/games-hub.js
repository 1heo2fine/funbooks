import { GAMES as GAME_LIST, CATEGORIES } from './games-data.js';

// ── Vote helpers ─────────────────────────────────────────────────────────
const VOTE_PREFIX = 'gv_';
function loadVotes(id) {
  try { return JSON.parse(localStorage.getItem(VOTE_PREFIX + id) || '{"l":0,"d":0,"v":null}'); }
  catch { return {l:0, d:0, v:null}; }
}
function saveVotes(id, obj) {
  try { localStorage.setItem(VOTE_PREFIX + id, JSON.stringify(obj)); } catch {}
}
function castVote(id, type) {
  const v = loadVotes(id);
  if (v.v === type) {
    // undo vote
    if (type === 'l') v.l = Math.max(0, v.l - 1);
    else v.d = Math.max(0, v.d - 1);
    v.v = null;
  } else {
    // switch or new vote
    if (v.v === 'l') v.l = Math.max(0, v.l - 1);
    if (v.v === 'd') v.d = Math.max(0, v.d - 1);
    if (type === 'l') v.l++;
    else v.d++;
    v.v = type;
  }
  saveVotes(id, v);
  return v;
}

// ── Similar games ────────────────────────────────────────────────────────
function getSimilarGames(g, count = 8) {
  const others = GAME_LIST.filter(x => x.id !== g.id && !x.embedPath?.startsWith('app:'));
  // score by category + tag overlap
  const scored = others.map(x => {
    let score = 0;
    if (x.category === g.category) score += 3;
    const gTags = g.tags || [];
    const xTags = x.tags || [];
    score += gTags.filter(t => xTags.includes(t)).length;
    return {game: x, score};
  });
  scored.sort((a, b) => b.score - a.score || Math.random() - 0.5);
  return scored.slice(0, count).map(s => s.game);
}

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
  const likeBtn    = document.getElementById('game-overlay-like');
  const dislikeBtn = document.getElementById('game-overlay-dislike');
  const likeCount  = document.getElementById('game-overlay-like-count');
  const dislikeCount = document.getElementById('game-overlay-dislike-count');
  const simGrid    = document.getElementById('similar-games-grid');
  const searchInput = document.getElementById('search-input');

  if (!grid) return;

  let activeFilter = 'all';
  let activeGame   = null;
  let boredPool    = null;
  let searchQ      = '';
  const PAGE_SIZE  = 40;
  let currentPage  = 0;

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

  function renderGames(reset = true) {
    const list = getFilteredGames();
    if (reset) {
      currentPage = 0;
      grid.innerHTML = '';
    }
    // remove any existing load-more sentinel
    const old = grid.querySelector('.games-load-more');
    if (old) old.remove();

    if (list.length === 0) {
      grid.insertAdjacentHTML('beforeend', '<p class="games-empty">No games found.</p>');
      return;
    }
    const start = currentPage * PAGE_SIZE;
    const slice = list.slice(start, start + PAGE_SIZE);
    slice.forEach(g => {
      GAMES_REGISTRY[g.id] = () => handleGameClick(g);
      grid.appendChild(makeCard(g));
    });

    // append load-more button if more remain
    if (start + PAGE_SIZE < list.length) {
      const btn = document.createElement('button');
      btn.className = 'games-load-more';
      btn.textContent = `Load more (${list.length - start - PAGE_SIZE} left)`;
      btn.addEventListener('click', () => {
        currentPage++;
        renderGames(false);
      });
      grid.appendChild(btn);
    }
  }

  function makeCard(g) {
    const btn = document.createElement('button');
    btn.className = 'game-card main-game-card';
    btn.dataset.game = g.id;
    const thumb = g.thumbnail || buildPlaceholderSvg(g.title);
    const votes = loadVotes(g.id);
    btn.innerHTML =
      `<div class="game-card-icon"><img src="${escHtml(thumb)}" alt="${escHtml(g.title)}" loading="lazy" onerror="this.src='${buildPlaceholderSvg(g.title)}'"></div>` +
      `<div class="game-card-name">${escHtml(g.title)}</div>` +
      `<div class="game-card-votes"><span class="vote-like-badge">👍 ${votes.l}</span><span class="vote-dislike-badge">👎 ${votes.d}</span></div>`;
    return btn;
  }

  // ── Click on grid (event delegation) ────────────────────────
  grid.addEventListener('click', e => {
    const card = e.target.closest('.main-game-card');
    if (!card) return;
    const g = GAME_LIST.find(x => x.id === card.dataset.game);
    if (g) handleGameClick(g);
  });

  function handleGameClick(g) {
    if (g.embedPath && g.embedPath.startsWith('app:')) {
      const appName = g.embedPath.slice(4);
      const btn = document.querySelector(`.social-app-box[data-app="${appName}"]`);
      if (btn) { btn.click(); return; }
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
    updateVoteUI();
    renderSimilarGames(g);
  }

  function closeGame() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (spinner) spinner.classList.remove('visible');
    setTimeout(() => { if (frame) frame.src = ''; activeGame = null; }, 300);
  }

  function updateVoteUI() {
    if (!activeGame) return;
    const v = loadVotes(activeGame.id);
    if (likeCount) likeCount.textContent = v.l;
    if (dislikeCount) dislikeCount.textContent = v.d;
    if (likeBtn) likeBtn.classList.toggle('voted', v.v === 'l');
    if (dislikeBtn) dislikeBtn.classList.toggle('voted', v.v === 'd');
  }

  function renderSimilarGames(g) {
    if (!simGrid) return;
    simGrid.innerHTML = '';
    const similar = getSimilarGames(g, 8);
    similar.forEach(sg => {
      const thumb = sg.thumbnail || buildPlaceholderSvg(sg.title);
      const card = document.createElement('button');
      card.className = 'sim-game-card';
      card.innerHTML =
        `<div class="sim-game-thumb"><img src="${escHtml(thumb)}" alt="${escHtml(sg.title)}" loading="lazy" onerror="this.src='${buildPlaceholderSvg(sg.title)}'"></div>` +
        `<div class="sim-game-name">${escHtml(sg.title)}</div>`;
      card.addEventListener('click', () => openGame(sg));
      simGrid.appendChild(card);
    });
  }

  if (frame) frame.addEventListener('load', () => { if (spinner) spinner.classList.remove('visible'); });
  if (closeBtn) closeBtn.addEventListener('click', closeGame);
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeGame(); });
  document.addEventListener('keydown', e => {
    if (overlay && overlay.classList.contains('open') && e.key === 'Escape') closeGame();
  });

  if (fsBtn) fsBtn.addEventListener('click', () => {
    const el = frame;
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

  if (likeBtn) likeBtn.addEventListener('click', () => {
    if (!activeGame) return;
    castVote(activeGame.id, 'l');
    updateVoteUI();
    // refresh card in grid
    refreshCardVotes(activeGame.id);
  });

  if (dislikeBtn) dislikeBtn.addEventListener('click', () => {
    if (!activeGame) return;
    castVote(activeGame.id, 'd');
    updateVoteUI();
    refreshCardVotes(activeGame.id);
  });

  function refreshCardVotes(id) {
    const card = grid.querySelector(`[data-game="${id}"]`);
    if (!card) return;
    const v = loadVotes(id);
    const likeBadge = card.querySelector('.vote-like-badge');
    const dislikeBadge = card.querySelector('.vote-dislike-badge');
    if (likeBadge) likeBadge.textContent = `👍 ${v.l}`;
    if (dislikeBadge) dislikeBadge.textContent = `👎 ${v.d}`;
  }

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

  let activeGame    = null;
  let searchQ       = '';
  let activeCats    = new Set();
  let sortMode      = 'default';
  let filterOpen    = false;

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

  if (filterBtn && filterPanel) {
    filterBtn.addEventListener('click', e => {
      e.stopPropagation();
      filterOpen = !filterOpen;
      filterPanel.classList.toggle('open', filterOpen);
      filterBtn.classList.toggle('active', filterOpen);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQ = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }

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
    const votes = loadVotes(g.id);
    btn.innerHTML =
      `<div class="game-card-icon"><img src="${escHtml(thumb)}" alt="${escHtml(g.title)}" loading="lazy" onerror="this.src='${buildPlaceholderSvg(g.title)}'"></div>` +
      `<div class="game-card-name">${escHtml(g.title)}</div>` +
      `<div class="game-card-votes"><span class="vote-like-badge">👍 ${votes.l}</span><span class="vote-dislike-badge">👎 ${votes.d}</span></div>`;
    if (favs.includes(g.id)) btn.classList.add('game-card-fav');
    return btn;
  }

  function updateFilterBtnState() {
    if (!filterBtn) return;
    const hasFilters = activeCats.size > 0 || sortMode !== 'default';
    filterBtn.classList.toggle('has-filters', hasFilters);
  }

  function openGame(g) {
    activeGame = g;
    frame.src = g.embedPath;
    if (titleEl) titleEl.textContent = g.title;
    if (spinner) spinner.classList.add('visible');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    saveRecent(g.id);
    updateFavBtn();
    updateVoteDisplay();
    renderSimilarGames(g);
  }

  function closeGame() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (spinner) spinner.classList.remove('visible');
    setTimeout(() => { frame.src = ''; activeGame = null; }, 300);
  }

  function updateVoteDisplay() {
    const likeCount = document.getElementById('game-overlay-like-count');
    const dislikeCount = document.getElementById('game-overlay-dislike-count');
    const likeBtn = document.getElementById('game-overlay-like');
    const dislikeBtn = document.getElementById('game-overlay-dislike');
    if (!activeGame) return;
    const v = loadVotes(activeGame.id);
    if (likeCount) likeCount.textContent = v.l;
    if (dislikeCount) dislikeCount.textContent = v.d;
    if (likeBtn) likeBtn.classList.toggle('voted', v.v === 'l');
    if (dislikeBtn) dislikeBtn.classList.toggle('voted', v.v === 'd');
  }

  function renderSimilarGames(g) {
    const simGrid = document.getElementById('similar-games-grid');
    if (!simGrid) return;
    simGrid.innerHTML = '';
    const similar = getSimilarGames(g, 8);
    similar.forEach(sg => {
      const thumb = sg.thumbnail || buildPlaceholderSvg(sg.title);
      const card = document.createElement('button');
      card.className = 'sim-game-card';
      card.innerHTML =
        `<div class="sim-game-thumb"><img src="${escHtml(thumb)}" alt="${escHtml(sg.title)}" loading="lazy" onerror="this.src='${buildPlaceholderSvg(sg.title)}'"></div>` +
        `<div class="sim-game-name">${escHtml(sg.title)}</div>`;
      card.addEventListener('click', () => openGame(sg));
      simGrid.appendChild(card);
    });
  }

  frame.addEventListener('load', () => {
    if (spinner) spinner.classList.remove('visible');
  });

  if (closeBtn) closeBtn.addEventListener('click', closeGame);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeGame(); });
  document.addEventListener('keydown', e => {
    if (overlay.classList.contains('open') && e.key === 'Escape') closeGame();
  });

  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      const req = frame.requestFullscreen || frame.webkitRequestFullscreen || frame.mozRequestFullScreen;
      if (req) req.call(frame).catch(() => {});
    });
  }

  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
      if (frame.src) { const s = frame.src; frame.src = ''; frame.src = s; }
      if (spinner) spinner.classList.add('visible');
    });
  }

  if (newTabBtn) {
    newTabBtn.addEventListener('click', () => {
      if (activeGame) window.open(activeGame.embedPath, '_blank', 'noopener');
    });
  }

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
      const card = grid.querySelector(`[data-game="${activeGame.id}"]`);
      if (card) card.classList.toggle('game-card-fav', favs.includes(activeGame.id));
    });
  }

  applyFilters();
}
