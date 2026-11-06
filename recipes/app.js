/* =========================================================
   今日のごはん - app.js
   データはすべてこのブラウザの IndexedDB に保存します。
   ========================================================= */
(() => {
  'use strict';

  /* ---------- 定数 ---------- */
  const CAT_LABEL = { staple: '主食', main: '主菜', side: '副菜', soup: '汁物', sweets: 'スイーツ', drink: 'ドリンク', other: 'その他' };
  const CAT_COLOR = { staple: '#fde7cf', main: '#fbdcd5', side: '#e1efd9', soup: '#fdeec0', sweets: '#f8e1ec', drink: '#eee3d3', other: '#e9e4f2' };
  // 献立の枠：[キー, 表示名, 入れられるカテゴリ]
  const SLOTS = [['main', '主菜・主食', ['main', 'staple']], ['side', '副菜', ['side']], ['soup', '汁物', ['soup']]];
  const slotOf = (cat) => (SLOTS.find((s) => s[2].includes(cat)) || SLOTS[0])[0];
  const SCHEMA = 2; // 2: カテゴリを主食・主菜・副菜・汁物に変更し、献立を3品の枠にした版
  const ALLERGENS = ['卵', '乳', '小麦', 'えび', 'かに', 'そば', '落花生', 'くるみ', '大豆', 'ごま'];
  const NUTRI = [
    { key: 'kcal', label: 'エネルギー', unit: 'kcal', def: 2000, step: 1 },
    { key: 'protein', label: 'たんぱく質', unit: 'g', def: 65, step: 0.1 },
    { key: 'fat', label: '脂質', unit: 'g', def: 62, step: 0.1 },
    { key: 'carbs', label: '炭水化物', unit: 'g', def: 300, step: 0.1 },
    { key: 'fiber', label: '食物繊維', unit: 'g', def: 21, step: 0.1 },
    { key: 'salt', label: '食塩相当量', unit: 'g', def: 7, step: 0.1 }
  ];
  const UNITS = ['g', 'ml', '個', '枚', '本', '片', '切れ', '大さじ', '小さじ', 'カップ', '少々', '適量'];
  const QUICK_MIN = 15, LIGHT_KCAL = 400, MAX_SERV = 20;
  const PHOTO_MAX = 1200, PHOTO_Q = 0.82;
  const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

  /* ---------- ユーティリティ ---------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => 'r_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const num = (v, d = 0) => { const n = parseFloat(v); return Number.isFinite(n) && n >= 0 ? n : d; };
  const round1 = (n) => Math.round(n * 10) / 10;
  const fmtMin = (m) => (m >= 60 ? `${Math.floor(m / 60)}時間${m % 60 ? (m % 60) + '分' : ''}` : `${m}分`);
  const activeTime = (r) => (r.time?.prep || 0) + (r.time?.cook || 0);
  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const parseYmd = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const fmtDate = (ts) => { const d = new Date(ts); return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`; };

  const FRACTIONS = { 0.25: '¼', 0.5: '½', 0.75: '¾' };
  const PREFIX_UNITS = ['大さじ', '小さじ', 'カップ'];
  const COUNT_UNITS = ['個', '枚', '本', '片', '切れ', '大さじ', '小さじ', 'カップ'];
  const fmtAmount = (amount, unit, factor) => {
    if (amount == null || amount === '') return unit || '';
    let v = amount * factor, n;
    if (COUNT_UNITS.includes(unit)) {
      v = Math.max(0.25, Math.round(v * 4) / 4);
      const whole = Math.floor(v);
      const frac = FRACTIONS[+(v - whole).toFixed(2)] || '';
      n = (whole || '') + frac;
    } else {
      n = v < 10 ? Math.round(v * 10) / 10 : Math.round(v);
    }
    return PREFIX_UNITS.includes(unit) ? unit + n : n + (unit || '');
  };

  /* ---------- 保存（IndexedDB。使えない環境ではメモリのみ） ---------- */
  const Store = (() => {
    const mem = { kv: new Map(), photos: new Map() };
    let dbp = null, ok = true;
    const open = () => dbp || (dbp = new Promise((res, rej) => {
      const r = indexedDB.open('hinata-recipe-note', 1);
      r.onupgradeneeded = () => { r.result.createObjectStore('kv'); r.result.createObjectStore('photos'); };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    }));
    const run = async (store, mode, fn) => {
      if (!ok) return fn(null, mem[store]);
      try {
        const db = await open();
        return await new Promise((res, rej) => {
          const t = db.transaction(store, mode);
          const req = fn(t.objectStore(store));
          t.oncomplete = () => res(req?.result);
          t.onerror = () => rej(t.error);
          t.onabort = () => rej(t.error || new Error('保存に失敗しました'));
        });
      } catch (e) {
        if (e?.name === 'QuotaExceededError') throw e;
        console.warn('IndexedDB が使えないため、一時的な保存に切り替えます', e);
        ok = false;
        return fn(null, mem[store]);
      }
    };
    // IndexedDB では request を返し（完了時に result を取り出す）、メモリでは値をそのまま返す
    const wrap = (store, mode, idb, memf) => run(store, mode, (s, m) => (s ? idb(s) : memf(m)));
    return {
      get persistent() { return ok; },
      get: (st, k) => wrap(st, 'readonly', (s) => s.get(k), (m) => m.get(k)),
      set: (st, k, v) => wrap(st, 'readwrite', (s) => s.put(v, k), (m) => { m.set(k, v); }),
      del: (st, k) => wrap(st, 'readwrite', (s) => s.delete(k), (m) => { m.delete(k); }),
      keys: (st) => wrap(st, 'readonly', (s) => s.getAllKeys(), (m) => [...m.keys()]),
      clear: (st) => wrap(st, 'readwrite', (s) => s.clear(), (m) => { m.clear(); })
    };
  })();

  /* ---------- 状態 ---------- */
  const state = {
    recipes: [],
    plan: {},          // { 'YYYY-MM-DD': { main: id, side: id, soup: id } }
    targets: Object.fromEntries(NUTRI.map((n) => [n.key, n.def])),
    photoURL: new Map(), // id -> objectURL
    filter: { q: '', cat: 'all', opts: new Set(), sort: 'updated' },
    month: null,       // 献立カレンダーで表示中の月 { y, m }
    weekIdx: 0         // その月の何週目か（0始まり）
  };
  const byId = (id) => state.recipes.find((r) => r.id === id);

  /* ---------- 旧データ（版1）からの移行 ---------- */
  const SAMPLE_CAT_V2 = {
    'sample-taco-rice': 'staple', 'sample-veg-curry': 'staple', 'sample-avocado-toast': 'staple',
    'sample-salmon': 'main', 'sample-cobb-salad': 'side', 'sample-pumpkin-soup': 'soup', 'sample-minestrone': 'soup'
  };
  const SOUP_RE = /スープ|汁|ポタージュ|ミネストローネ|シチュー|chowder|soup/i;
  const migrateRecipeV1 = (r) => ({
    ...r,
    cat: SAMPLE_CAT_V2[r.id] || (r.cat === 'side' ? (SOUP_RE.test(r.name || '') ? 'soup' : 'side') : r.cat)
  });
  // 旧：{ breakfast:[id], lunch:[id], dinner:[id], snack:[id] } → 新：{ main, side, soup }（入りきらない分は外す）
  const migratePlanV1 = (plan, recipes) => {
    const find = (id) => recipes.find((r) => r.id === id);
    const out = {};
    for (const [key, day] of Object.entries(plan || {})) {
      if (!day || typeof day !== 'object') continue;
      const d = {};
      for (const id of ['breakfast', 'lunch', 'dinner', 'snack'].flatMap((s) => (Array.isArray(day[s]) ? day[s] : []))) {
        const r = find(id);
        if (!r) continue;
        const slot = SLOTS.find((s) => s[2].includes(r.cat));
        if (slot && !d[slot[0]]) d[slot[0]] = id;
      }
      if (Object.keys(d).length) out[key] = d;
    }
    return out;
  };
  // 献立データを検証して、存在するレシピだけを残す
  const normPlan = (plan, ids) => {
    const out = {};
    for (const [key, day] of Object.entries(plan || {})) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || !day || typeof day !== 'object') continue;
      const d = {};
      for (const [s] of SLOTS) if (typeof day[s] === 'string' && ids.has(day[s])) d[s] = day[s];
      if (Object.keys(d).length) out[key] = d;
    }
    return out;
  };

  const saveRecipes = () => Store.set('kv', 'recipes', state.recipes).catch(onSaveError);
  const savePlan = () => Store.set('kv', 'plan', state.plan).catch(onSaveError);
  const saveTargets = () => Store.set('kv', 'targets', state.targets).catch(onSaveError);
  function onSaveError(e) {
    console.error(e);
    toast(e?.name === 'QuotaExceededError' ? '保存容量がいっぱいです。写真を減らしてください' : '保存に失敗しました');
  }

  const setPhoto = async (id, blob) => {
    await Store.set('photos', id, blob);
    if (state.photoURL.has(id)) URL.revokeObjectURL(state.photoURL.get(id));
    state.photoURL.set(id, URL.createObjectURL(blob));
  };
  const removePhoto = async (id) => {
    await Store.del('photos', id);
    if (state.photoURL.has(id)) URL.revokeObjectURL(state.photoURL.get(id));
    state.photoURL.delete(id);
  };

  /* ---------- データの正規化（読み込み・サンプル・インポート共通） ---------- */
  const normRow = (x) => {
    if (Array.isArray(x)) x = { name: x[0], amount: x[1], unit: x[2] };
    const amount = x?.amount === '' || x?.amount == null ? null : num(x.amount, null);
    return { name: String(x?.name ?? '').trim(), amount, unit: String(x?.unit ?? '').trim() };
  };
  const normRecipe = (r) => {
    const now = Date.now();
    return {
      id: typeof r.id === 'string' && r.id ? r.id : uid(),
      cat: CAT_LABEL[r.cat] ? r.cat : 'other',
      name: String(r.name ?? '').trim() || '名称未設定',
      desc: String(r.desc ?? ''),
      servings: Math.min(MAX_SERV, Math.max(1, Math.round(num(r.servings, 1)) || 1)),
      veg: !!r.veg,
      favorite: !!r.favorite,
      time: { prep: num(r.time?.prep), cook: num(r.time?.cook), rest: num(r.time?.rest) },
      allergens: Array.isArray(r.allergens) ? r.allergens.map(String) : [],
      ingredients: (r.ingredients || []).map(normRow).filter((x) => x.name),
      seasonings: (r.seasonings || []).map(normRow).filter((x) => x.name),
      nutrition: Object.fromEntries(NUTRI.map((n) => [n.key, num(r.nutrition?.[n.key])])),
      steps: (r.steps || []).map((s) => String(s).trim()).filter(Boolean),
      memo: String(r.memo ?? ''),
      color: typeof r.color === 'string' && /^#[0-9a-f]{3,8}$/i.test(r.color) ? r.color : (CAT_COLOR[r.cat] || CAT_COLOR.other),
      createdAt: num(r.createdAt, now) || now,
      updatedAt: num(r.updatedAt, now) || now
    };
  };
  const samples = () => (window.SAMPLE_RECIPES || []).map(normRecipe);

  /* ---------- 画像の縮小 ---------- */
  const resizeImage = (file) => new Promise((res, rej) => {
    if (!file || !/^image\//.test(file.type)) return rej(new Error('画像ファイルを選んでください'));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const sc = Math.min(1, PHOTO_MAX / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * sc), h = Math.round(img.naturalHeight * sc);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? res(b) : rej(new Error('画像の変換に失敗しました'))), 'image/jpeg', PHOTO_Q);
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('この画像は読み込めませんでした')); };
    img.src = url;
  });
  const blobToDataURL = (b) => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = () => rej(fr.error); fr.readAsDataURL(b); });
  const dataURLToBlob = (d) => {
    const m = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(d || '');
    if (!m || !/^image\//.test(m[1] || '')) return null;
    const bin = m[2] ? atob(m[3]) : decodeURIComponent(m[3]);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: m[1] });
  };

  /* ---------- 共通 UI ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2600);
  }

  const confirmDlg = $('#confirmDialog');
  const ask = (msg, { ok = 'OK', danger = false } = {}) => new Promise((res) => {
    $('#cMsg').textContent = msg;
    $('#cOk').textContent = ok;
    confirmDlg.classList.toggle('is-danger', danger);
    confirmDlg.returnValue = '';
    confirmDlg.addEventListener('close', () => res(confirmDlg.returnValue === 'ok'), { once: true });
    confirmDlg.showModal();
  });

  // ダイアログ共通：✕ボタン・背景クリックで閉じる
  // （編集画面は未保存の確認があるため別に処理）
  $$('dialog:not(#editDialog)').forEach((d) => {
    $$('[data-close]', d).forEach((b) => b.addEventListener('click', () => d.close()));
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });

  // 写真 or プレースホルダー
  const photoHTML = (r, { hint = false } = {}) => {
    const url = state.photoURL.get(r.id);
    if (url) return `<img src="${url}" alt="" loading="lazy" decoding="async">`;
    return `<div class="ph" style="background:${esc(r.color)}"><span class="ph__char">${esc([...r.name][0] || '？')}</span>${hint ? '<span class="ph__hint">📷 写真なし</span>' : ''}</div>`;
  };

  /* =========================================================
     画面切り替え
     ========================================================= */
  const VIEWS = ['recipes', 'plan', 'settings'];
  const route = () => {
    const v = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'recipes';
    VIEWS.forEach((name) => { $('#view-' + name).hidden = name !== v; });
    $$('[data-nav]').forEach((a) => {
      const cur = a.dataset.nav === v;
      a.classList.toggle('is-current', cur);
      if (cur) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (v === 'plan') renderPlan();
    if (v === 'settings') renderSettings();
    window.scrollTo(0, 0);
  };
  window.addEventListener('hashchange', route);

  /* =========================================================
     レシピ一覧
     ========================================================= */
  const cardsEl = $('#cards');
  const filteredRecipes = () => {
    const { q, cat, opts, sort } = state.filter;
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let list = state.recipes.filter((r) => {
      if (cat !== 'all' && r.cat !== cat) return false;
      if (opts.has('fav') && !r.favorite) return false;
      if (opts.has('quick') && activeTime(r) > QUICK_MIN) return false;
      if (opts.has('light') && r.nutrition.kcal > LIGHT_KCAL) return false;
      if (opts.has('veg') && !r.veg) return false;
      if (words.length) {
        const hay = [r.name, r.desc, ...r.ingredients.map((x) => x.name), ...r.seasonings.map((x) => x.name)].join(' ').toLowerCase();
        if (!words.every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    const sorters = {
      updated: (a, b) => b.updatedAt - a.updatedAt,
      name: (a, b) => a.name.localeCompare(b.name, 'ja'),
      time: (a, b) => activeTime(a) - activeTime(b),
      kcal: (a, b) => a.nutrition.kcal - b.nutrition.kcal
    };
    return list.sort(sorters[sort] || sorters.updated);
  };

  const renderList = () => {
    const list = filteredRecipes();
    cardsEl.innerHTML = list.map((r, i) => `
      <button type="button" class="card" data-id="${esc(r.id)}" style="animation-delay:${Math.min(i, 12) * 30}ms">
        <div class="card__photo">
          ${photoHTML(r, { hint: true })}
          <span class="card__role">${CAT_LABEL[r.cat]}</span>
          ${r.favorite ? '<span class="card__fav" aria-label="お気に入り">★</span>' : ''}
        </div>
        <div class="card__body">
          <h2 class="card__name">${esc(r.name)}</h2>
          <p class="card__meta">
            <span>⏱ <b>${fmtMin(activeTime(r))}</b></span>
            <span>🔥 <b>${r.nutrition.kcal}</b>kcal</span>
          </p>
        </div>
      </button>`).join('');
    $('#resultCount').textContent = list.length;
    const empty = list.length === 0;
    $('#emptyRecipes').hidden = !empty;
    if (empty) {
      const none = state.recipes.length === 0;
      $('#emptyText').textContent = none ? 'まだレシピがありません。' : '条件に合うレシピがありません。';
      $('#emptyRecipes .btn').hidden = !none;
    }
  };

  $('#searchInput').addEventListener('input', (e) => { state.filter.q = e.target.value; renderList(); });
  $$('[data-cat]').forEach((b) => b.addEventListener('click', () => {
    state.filter.cat = b.dataset.cat;
    $$('[data-cat]').forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    renderList();
  }));
  $$('[data-opt]').forEach((b) => b.addEventListener('click', () => {
    const o = state.filter.opts, k = b.dataset.opt, on = !o.has(k);
    on ? o.add(k) : o.delete(k);
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', String(on));
    renderList();
  }));
  $('#sortSelect').addEventListener('change', (e) => { state.filter.sort = e.target.value; renderList(); });
  cardsEl.addEventListener('click', (e) => { const c = e.target.closest('.card'); if (c) openDetail(c.dataset.id); });
  $('#addRecipeBtn').addEventListener('click', () => openEditor());
  $$('[data-action=add-recipe]').forEach((b) => b.addEventListener('click', () => openEditor()));

  /* =========================================================
     レシピ詳細
     ========================================================= */
  const detailDlg = $('#detailDialog');
  let cur = null, servings = 1;

  const renderAmounts = (flash = false) => {
    const factor = servings / cur.servings;
    const rows = (arr, emptyMsg) => arr.length
      ? arr.map((x) => `<tr${flash && x.amount != null ? ' class="is-changed"' : ''}><td>${esc(x.name)}</td><td>${esc(fmtAmount(x.amount, x.unit, factor))}</td></tr>`).join('')
      : `<tr class="empty-row"><td colspan="2">${emptyMsg}</td></tr>`;
    $('#dIngredients').innerHTML = rows(cur.ingredients, '材料は登録されていません');
    $('#dSeasonings').innerHTML = rows(cur.seasonings, '調味料は登録されていません');
    $('#servNum').textContent = servings + '人分';
    $('#servMinus').disabled = servings <= 1;
    $('#servPlus').disabled = servings >= MAX_SERV;
  };

  const fillDetail = () => {
    const r = cur;
    $('#dPhoto').innerHTML = photoHTML(r);
    $('#dCat').textContent = CAT_LABEL[r.cat] + (r.veg ? '・🌱 ベジ' : '');
    $('#dTitle').textContent = r.name;
    $('#dDesc').textContent = r.desc;
    const fav = $('#dFav');
    fav.setAttribute('aria-pressed', String(r.favorite));
    fav.textContent = r.favorite ? '★ お気に入り' : '☆ お気に入り';

    const restLabel = r.cat === 'sweets' || r.cat === 'drink' ? '冷やす' : '待ち';
    $('#dTime').innerHTML = esc(fmtMin(activeTime(r))) + (r.time.rest ? `<small>＋${restLabel} ${esc(fmtMin(r.time.rest))}</small>` : '');
    $('#dKcal').textContent = r.nutrition.kcal + 'kcal';
    $('#dSalt').textContent = r.nutrition.salt + 'g';

    const parts = [['t-prep', '下ごしらえ', r.time.prep], ['t-cook', '調理', r.time.cook], ['t-rest', restLabel, r.time.rest]].filter((p) => p[2] > 0);
    const w = parts.map((p) => Math.sqrt(p[2])), ws = w.reduce((a, b) => a + b, 0);
    $('#dTimeBar').innerHTML = parts.map((p, i) => `<span class="${p[0]}" style="flex:${w[i] / ws}" title="${p[1]} ${fmtMin(p[2])}">${p[1]} ${fmtMin(p[2])}</span>`).join('');
    $('#dTimeBar').setAttribute('aria-label', '調理時間の内訳：' + parts.map((p) => p[1] + fmtMin(p[2])).join('、'));

    $('#dAllergy').innerHTML = r.allergens.length
      ? '<span class="d-allergy__label">アレルギー：</span>' + r.allergens.map((a) => `<span class="tag">${esc(a)}</span>`).join('')
      : '<span class="tag tag--none">登録されたアレルギー食材なし</span>';

    renderAmounts();

    $('#dNutrition').innerHTML = NUTRI.map((n) => {
      const v = r.nutrition[n.key], t = state.targets[n.key] || n.def;
      const pct = Math.round((v / t) * 100);
      return `<li><span>${n.label}</span><span class="nutri__val">${v}${n.unit}</span>
        <span class="nutri__bar" aria-hidden="true"><i class="${pct >= 35 ? 'is-high' : ''}" style="width:${Math.min(pct, 100)}%"></i></span>
        <span class="nutri__pct">1日の目安の ${pct}%</span></li>`;
    }).join('');

    $('#dSteps').innerHTML = r.steps.length ? r.steps.map((s) => `<li>${esc(s)}</li>`).join('') : '<li class="muted">作り方は登録されていません</li>';
    $('#dMemoBlock').hidden = !r.memo.trim();
    $('#dMemo').textContent = r.memo;
    $('#dDates').textContent = `登録 ${fmtDate(r.createdAt)} ・ 更新 ${fmtDate(r.updatedAt)}`;
  };

  function openDetail(id) {
    cur = byId(id);
    if (!cur) return;
    servings = cur.servings;
    fillDetail();
    if (!detailDlg.open) detailDlg.showModal();
    detailDlg.scrollTop = 0;
  }

  $('#servMinus').addEventListener('click', () => { if (servings > 1) { servings--; renderAmounts(true); } });
  $('#servPlus').addEventListener('click', () => { if (servings < MAX_SERV) { servings++; renderAmounts(true); } });
  $('#dFav').addEventListener('click', async () => {
    cur.favorite = !cur.favorite;
    await saveRecipes();
    fillDetail(); renderList();
  });
  $('#dEdit').addEventListener('click', () => { const id = cur.id; detailDlg.close(); openEditor(id); });
  $('#dCopy').addEventListener('click', async () => {
    const now = Date.now();
    const copy = { ...structuredClone(cur), id: uid(), name: cur.name + '（コピー）', favorite: false, createdAt: now, updatedAt: now };
    state.recipes.push(copy);
    const photo = await Store.get('photos', cur.id);
    if (photo) await setPhoto(copy.id, photo);
    await saveRecipes();
    renderList();
    toast('複製しました');
    openDetail(copy.id);
  });
  $('#dDelete').addEventListener('click', async () => {
    const r = cur;
    if (!(await ask(`「${r.name}」を削除しますか？\n献立からも外れます。元に戻せません。`, { ok: '削除する', danger: true }))) return;
    await deleteRecipes([r.id]);
    detailDlg.close();
    toast('削除しました');
  });
  $('#dPlan').addEventListener('click', () => openSlotDialog(cur.id));

  async function deleteRecipes(ids) {
    const set = new Set(ids);
    state.recipes = state.recipes.filter((r) => !set.has(r.id));
    for (const [key, day] of Object.entries(state.plan)) {
      for (const k of Object.keys(day)) if (set.has(day[k])) delete day[k];
      if (!Object.keys(day).length) delete state.plan[key];
    }
    for (const id of ids) await removePhoto(id).catch(() => {});
    await Promise.all([saveRecipes(), savePlan()]);
    renderList();
    if (!$('#view-plan').hidden) renderPlan();
  }

  /* =========================================================
     レシピ編集
     ========================================================= */
  const editDlg = $('#editDialog');
  const form = $('#editForm');
  let editId = null;          // null = 新規
  let pendingPhoto;           // undefined=変更なし / Blob=新しい写真 / null=削除
  let previewURL = null;

  // 栄養・アレルギーの入力欄を生成
  $('#nutriFields').innerHTML = NUTRI.map((n) => `
    <div class="field"><label for="n-${n.key}">${n.label}</label>
      <div class="unit-input"><input type="number" id="n-${n.key}" name="n-${n.key}" min="0" step="${n.step}" inputmode="decimal"><span>${n.unit}</span></div></div>`).join('');
  $('#allergyChecks').innerHTML = ALLERGENS.map((a) => `<label class="check"><input type="checkbox" name="allergen" value="${a}"> ${a}</label>`).join('');

  // 単位の候補
  const dl = document.createElement('datalist');
  dl.id = 'unitList';
  dl.innerHTML = UNITS.map((u) => `<option value="${u}">`).join('');
  document.body.appendChild(dl);

  const rowHTML = (type, data = {}) => {
    const fields = type === 'step'
      ? `<div class="row__fields row__fields--step"><textarea rows="2" aria-label="手順" data-f="text" maxlength="400">${esc(data.text || '')}</textarea></div>`
      : `<div class="row__fields">
          <input type="text" class="r-name" data-f="name" placeholder="${type === 'ing' ? '例：玉ねぎ' : '例：醤油'}" aria-label="名前" value="${esc(data.name || '')}" maxlength="40">
          <input type="number" data-f="amount" placeholder="分量" aria-label="分量" min="0" step="any" inputmode="decimal" value="${data.amount ?? ''}">
          <input type="text" data-f="unit" placeholder="単位" aria-label="単位" list="unitList" value="${esc(data.unit || '')}" maxlength="10">
        </div>`;
    return `<div class="row" data-type="${type}">${fields}
      <div class="row__tools">
        <button type="button" data-row="up" aria-label="上へ">▲</button>
        <button type="button" data-row="down" aria-label="下へ">▼</button>
        <button type="button" data-row="del" aria-label="削除">✕</button>
      </div></div>`;
  };
  const ROWS = { ing: '#ingRows', sea: '#seaRows', step: '#stepRows' };
  const refreshRowTools = (box) => {
    const rows = $$('.row', box);
    rows.forEach((r, i) => { $('[data-row=up]', r).disabled = i === 0; $('[data-row=down]', r).disabled = i === rows.length - 1; });
  };
  const addRow = (type, data, focus = false) => {
    const box = $(ROWS[type]);
    box.insertAdjacentHTML('beforeend', rowHTML(type, data));
    refreshRowTools(box);
    if (focus) $('.row:last-child input, .row:last-child textarea', box).focus();
  };
  $$('[data-add]').forEach((b) => b.addEventListener('click', () => addRow(b.dataset.add, {}, true)));
  form.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-row]');
    if (!btn) return;
    const row = btn.closest('.row'), box = row.parentElement;
    if (btn.dataset.row === 'del') row.remove();
    if (btn.dataset.row === 'up' && row.previousElementSibling) box.insertBefore(row, row.previousElementSibling);
    if (btn.dataset.row === 'down' && row.nextElementSibling) box.insertBefore(row.nextElementSibling, row);
    refreshRowTools(box);
    if (btn.isConnected && !btn.disabled) btn.focus();
  });

  const showPreview = (blobOrNull, recipe) => {
    if (previewURL) { URL.revokeObjectURL(previewURL); previewURL = null; }
    const box = $('#photoPreview');
    if (blobOrNull instanceof Blob) {
      previewURL = URL.createObjectURL(blobOrNull);
      box.innerHTML = `<img src="${previewURL}" alt="選んだ写真">`;
    } else if (blobOrNull === undefined && recipe && state.photoURL.has(recipe.id)) {
      box.innerHTML = `<img src="${state.photoURL.get(recipe.id)}" alt="現在の写真">`;
    } else {
      const name = form.name.value || '？';
      box.innerHTML = `<div class="ph" style="background:${CAT_COLOR[form.cat.value]}"><span class="ph__char">${esc([...name][0])}</span><span class="ph__hint">📷 写真なし</span></div>`;
    }
    $('#photoRemove').hidden = !box.querySelector('img');
  };
  const handlePhotoFile = async (file) => {
    if (!file) return;
    try {
      toast('写真を準備しています…');
      pendingPhoto = await resizeImage(file);
      showPreview(pendingPhoto);
      toast(`写真を設定しました（${Math.round(pendingPhoto.size / 1024)}KB）`);
    } catch (err) { toast(err.message); }
  };
  $('#photoInput').addEventListener('change', (e) => { handlePhotoFile(e.target.files[0]); e.target.value = ''; });
  $('#photoRemove').addEventListener('click', () => { pendingPhoto = null; showPreview(null); });
  const drop = $('#photoDrop');
  ['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add('is-drag'); }));
  ['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove('is-drag'); }));
  drop.addEventListener('drop', (e) => handlePhotoFile(e.dataTransfer.files[0]));

  let formSnapshot = '';
  const snapshot = () => JSON.stringify([...new FormData(form).entries()]) + $$('.row', form).length + String(pendingPhoto);

  function openEditor(id = null) {
    const r = id ? byId(id) : null;
    editId = r ? r.id : null;
    pendingPhoto = undefined;
    form.reset();
    $('#eTitle').textContent = r ? 'レシピを編集' : '新しいレシピ';
    $$('.field__error', form).forEach((x) => { x.textContent = ''; });
    $$('.is-invalid', form).forEach((x) => x.classList.remove('is-invalid'));

    const d = r || { cat: 'main', servings: 2, time: {}, nutrition: {}, allergens: [], ingredients: [], seasonings: [], steps: [] };
    form.name.value = d.name || '';
    form.cat.value = d.cat;
    form.servings.value = d.servings;
    form.desc.value = d.desc || '';
    form.favorite.checked = !!d.favorite;
    form.veg.checked = !!d.veg;
    form.prep.value = d.time.prep ?? '';
    form.cook.value = d.time.cook ?? '';
    form.rest.value = d.time.rest || '';
    NUTRI.forEach((n) => { form['n-' + n.key].value = d.nutrition[n.key] ?? ''; });
    $$('input[name=allergen]', form).forEach((c) => { c.checked = d.allergens.includes(c.value); });
    form.memo.value = d.memo || '';

    Object.values(ROWS).forEach((s) => { $(s).innerHTML = ''; });
    (d.ingredients.length ? d.ingredients : [{}, {}]).forEach((x) => addRow('ing', x));
    (d.seasonings.length ? d.seasonings : [{}]).forEach((x) => addRow('sea', x));
    (d.steps.length ? d.steps : ['']).forEach((t) => addRow('step', { text: t }));

    showPreview(undefined, r);
    editDlg.showModal();
    editDlg.scrollTop = 0;
    formSnapshot = snapshot();
    if (!r) form.name.focus();
  }

  // 未保存のまま閉じるときは確認
  async function tryCloseEditor() {
    if (snapshot() === formSnapshot || await ask('保存していない変更があります。閉じますか？', { ok: '閉じる', danger: true })) editDlg.close();
  }
  editDlg.addEventListener('cancel', (e) => { e.preventDefault(); tryCloseEditor(); });
  $$('[data-close]', editDlg).forEach((b) => b.addEventListener('click', tryCloseEditor));
  editDlg.addEventListener('click', (e) => { if (e.target === editDlg) tryCloseEditor(); });

  form.name.addEventListener('input', () => { if (!$('#photoPreview img')) showPreview(null); });
  form.cat.addEventListener('change', () => { if (!$('#photoPreview img')) showPreview(null); });

  const readRows = (type) => $$(ROWS[type] + ' .row').map((row) => {
    if (type === 'step') return $('[data-f=text]', row).value.trim();
    const amountRaw = $('[data-f=amount]', row).value;
    return { name: $('[data-f=name]', row).value.trim(), amount: amountRaw === '' ? null : num(amountRaw, null), unit: $('[data-f=unit]', row).value.trim() };
  }).filter((x) => (type === 'step' ? x : x.name));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const err = $('#fName-error');
    err.textContent = name ? '' : '料理名を入力してください';
    form.name.classList.toggle('is-invalid', !name);
    if (!name) { form.name.focus(); return; }

    const now = Date.now();
    const old = editId ? byId(editId) : null;
    const r = normRecipe({
      id: editId || uid(),
      cat: form.cat.value,
      name,
      desc: form.desc.value.trim(),
      servings: form.servings.value,
      veg: form.veg.checked,
      favorite: form.favorite.checked,
      time: { prep: form.prep.value, cook: form.cook.value, rest: form.rest.value },
      allergens: $$('input[name=allergen]:checked', form).map((c) => c.value),
      ingredients: readRows('ing'),
      seasonings: readRows('sea'),
      nutrition: Object.fromEntries(NUTRI.map((n) => [n.key, round1(num(form['n-' + n.key].value))])),
      steps: readRows('step'),
      memo: form.memo.value,
      color: old?.color || CAT_COLOR[form.cat.value],
      createdAt: old?.createdAt || now,
      updatedAt: now
    });

    try {
      if (pendingPhoto instanceof Blob) await setPhoto(r.id, pendingPhoto);
      else if (pendingPhoto === null) await removePhoto(r.id);
    } catch (e2) { onSaveError(e2); return; }

    if (old) state.recipes[state.recipes.indexOf(old)] = r; else state.recipes.push(r);
    await saveRecipes();
    formSnapshot = snapshot();
    editDlg.close();
    renderList();
    if (!$('#view-plan').hidden) renderPlan();
    toast(old ? '更新しました' : '登録しました');
    openDetail(r.id);
  });

  /* =========================================================
     献立カレンダー
     ========================================================= */
  // 月の各週（日曜始まり）の開始日
  const weeksOfMonth = ({ y, m }) => {
    const first = new Date(y, m, 1), last = new Date(y, m + 1, 0);
    const weeks = [];
    for (let s = addDays(first, -first.getDay()); s <= last; s = addDays(s, 7)) weeks.push(s);
    return weeks;
  };
  // 表示中の週の、その月に含まれる日
  const visibleDays = () => {
    const { y, m } = state.month;
    const start = weeksOfMonth(state.month)[state.weekIdx];
    return Array.from({ length: 7 }, (_, i) => addDays(start, i)).filter((d) => d.getFullYear() === y && d.getMonth() === m);
  };
  const goToDate = (d) => {
    state.month = { y: d.getFullYear(), m: d.getMonth() };
    state.weekIdx = Math.max(0, weeksOfMonth(state.month).findIndex((s) => d >= s && d < addDays(s, 7)));
  };
  goToDate(new Date());

  const dayTotals = (key) => {
    const day = state.plan[key] || {};
    const t = Object.fromEntries(NUTRI.map((n) => [n.key, 0]));
    let count = 0;
    for (const [s] of SLOTS) {
      const r = byId(day[s]);
      if (!r) continue;
      count++;
      NUTRI.forEach((n) => { t[n.key] += r.nutrition[n.key]; });
    }
    return { t, count };
  };

  const dishHTML = (key, slot, label, r) => {
    const cls = `dish dish--${slot}`;
    if (!r) {
      return `<button type="button" class="${cls} dish--empty" data-swap="${key}|${slot}" aria-label="${label}を選ぶ">
        <span class="plus" aria-hidden="true">＋</span><span class="dish__role">${label}</span></button>`;
    }
    const restNote = r.time.rest ? `（＋待ち${fmtMin(r.time.rest)}）` : '';
    return `<div class="${cls}">
      <button type="button" class="dish__photo" data-open="${esc(r.id)}" aria-label="${esc(r.name)} の詳細">
        ${photoHTML(r)}<span class="dish__role">${CAT_LABEL[r.cat] || label}</span>
      </button>
      <p class="dish__name">${esc(r.name)}</p>
      <p class="dish__meta"><span>⏱ ${fmtMin(activeTime(r))}${restNote}</span><span>🔥 ${r.nutrition.kcal}kcal</span></p>
      <div class="dish__tools">
        <button type="button" data-swap="${key}|${slot}">入れ替え</button>
        <button type="button" class="del" data-clear="${key}|${slot}" aria-label="${esc(r.name)} を外す">✕</button>
      </div>
    </div>`;
  };

  function renderPlan() {
    const { y, m } = state.month;
    const weeks = weeksOfMonth(state.month);
    if (state.weekIdx >= weeks.length) state.weekIdx = weeks.length - 1;
    const prev = new Date(y, m - 1, 1), next = new Date(y, m + 1, 1);
    $('#monthLabel').textContent = `${y}年 ${m + 1}月`;
    $('#prevMonthLabel').textContent = `${prev.getFullYear()}年 ${prev.getMonth() + 1}月`;
    $('#nextMonthLabel').textContent = `${next.getFullYear()}年 ${next.getMonth() + 1}月`;

    $('#weekTabs').innerHTML = weeks.map((s, i) => {
      const days = Array.from({ length: 7 }, (_, j) => addDays(s, j)).filter((d) => d.getMonth() === m);
      const a = days[0], b = days[days.length - 1];
      return `<button type="button" class="weektab${i === state.weekIdx ? ' is-current' : ''}" data-week="${i}" aria-pressed="${i === state.weekIdx}">
        ${i + 1}週目<small>${m + 1}/${a.getDate()}〜${m + 1}/${b.getDate()}</small></button>`;
    }).join('');

    const days = visibleDays();
    const todayKey = ymd(new Date());
    let html = '', sumKcal = 0, sumSalt = 0, filledDays = 0, dishes = 0;
    for (const d of days) {
      const key = ymd(d), day = state.plan[key] || {}, dow = d.getDay();
      const { t, count } = dayTotals(key);
      if (count) { filledDays++; sumKcal += t.kcal; sumSalt += t.salt; dishes += count; }
      html += `<article class="dayrow${key === todayKey ? ' is-today' : ''}${dow === 0 ? ' sun' : dow === 6 ? ' sat' : ''}" aria-label="${m + 1}月${d.getDate()}日（${WEEKDAYS[dow]}）">
        <h3 class="dayrow__date"><span class="dayrow__md">${m + 1}/${d.getDate()}</span><span class="dayrow__dow">（${WEEKDAYS[dow]}）</span>${key === todayKey ? '<span class="today">今日</span>' : ''}</h3>
        <div class="dayrow__dishes">${SLOTS.map(([s, label]) => dishHTML(key, s, label, byId(day[s]))).join('')}</div>
        <div class="dayrow__foot">
          <span>${count ? `合計 <b>${Math.round(t.kcal)}</b>kcal ・ 塩分 <b>${round1(t.salt)}</b>g ・ 手を動かす時間 約<b>${SLOTS.reduce((a, [s]) => a + (byId(day[s]) ? activeTime(byId(day[s])) : 0), 0)}</b>分` : 'まだ決まっていません'}</span>
          <button type="button" class="reroll" data-reroll="${key}">🔀 この日を提案</button>
        </div>
      </article>`;
    }
    $('#days').innerHTML = html;
    $('#weekSummary').innerHTML = `
      <div class="weeksum__item"><span>決まった品数</span><strong>${dishes}<small style="font-size:12px"> / ${days.length * SLOTS.length}</small></strong></div>
      <div class="weeksum__item"><span>1日平均 kcal</span><strong>${filledDays ? Math.round(sumKcal / filledDays) : '—'}</strong></div>
      <div class="weeksum__item"><span>1日平均 塩分</span><strong>${filledDays ? round1(sumSalt / filledDays) + 'g' : '—'}</strong></div>`;
    const a = days[0], b = days[days.length - 1];
    $('#printRange').textContent = `${y}年${m + 1}月${a.getDate()}日（${WEEKDAYS[a.getDay()]}）〜${m + 1}月${b.getDate()}日（${WEEKDAYS[b.getDay()]}）`;
  }

  $('#prevMonth').addEventListener('click', () => { const { y, m } = state.month; state.month = { y: m ? y : y - 1, m: (m + 11) % 12 }; state.weekIdx = 0; renderPlan(); });
  $('#nextMonth').addEventListener('click', () => { const { y, m } = state.month; state.month = { y: m === 11 ? y + 1 : y, m: (m + 1) % 12 }; state.weekIdx = 0; renderPlan(); });
  $('#weekTabs').addEventListener('click', (e) => { const b = e.target.closest('[data-week]'); if (b) { state.weekIdx = Number(b.dataset.week); renderPlan(); } });
  $('#thisWeekBtn').addEventListener('click', () => { goToDate(new Date()); renderPlan(); });
  $('#printBtn').addEventListener('click', () => window.print());

  const setSlot = async (key, slot, id) => {
    const day = state.plan[key] || (state.plan[key] = {});
    if (id) day[slot] = id; else delete day[slot];
    if (!Object.keys(day).length) delete state.plan[key];
    await savePlan();
  };

  /* ---------- 提案（登録したレシピからランダムに選ぶ） ---------- */
  const candidates = (slot) => state.recipes.filter((r) => SLOTS.find((s) => s[0] === slot)[2].includes(r.cat));
  // お気に入りは2倍選ばれやすくする。avoid はなるべく避け、mustAvoid は候補がほかにある限り必ず避ける
  const pickOne = (list, avoid, mustAvoid = new Set()) => {
    let pool = list.filter((r) => !avoid.has(r.id) && !mustAvoid.has(r.id));
    if (!pool.length) pool = list.filter((r) => !mustAvoid.has(r.id));
    if (!pool.length) pool = list;
    if (!pool.length) return null;
    const weights = pool.map((r) => (r.favorite ? 2 : 1));
    let x = Math.random() * weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < pool.length; i++) { x -= weights[i]; if (x < 0) return pool[i]; }
    return pool[pool.length - 1];
  };
  const usedInWeek = (exceptKey) => new Set(visibleDays().filter((d) => ymd(d) !== exceptKey).flatMap((d) => Object.values(state.plan[ymd(d)] || {})));
  const noCandidates = () => SLOTS.every(([s]) => !candidates(s).length);

  $('#suggestBtn').addEventListener('click', async () => {
    if (noCandidates()) { toast('提案できるレシピがありません。主菜・副菜・汁物のレシピを登録してください'); return; }
    const used = usedInWeek(null);
    let filled = 0;
    for (const d of visibleDays()) {
      const key = ymd(d);
      for (const [s] of SLOTS) {
        if (byId(state.plan[key]?.[s])) continue;
        const r = pickOne(candidates(s), used);
        if (!r) continue;
        (state.plan[key] || (state.plan[key] = {}))[s] = r.id;
        used.add(r.id);
        filled++;
      }
    }
    await savePlan();
    renderPlan();
    toast(filled ? `${filled} 品を提案しました` : 'この週はすべて決まっています');
  });

  $('#clearWeekBtn').addEventListener('click', async () => {
    const keys = visibleDays().map(ymd).filter((k) => state.plan[k]);
    if (!keys.length) { toast('この週の献立はまだありません'); return; }
    if (!(await ask('この週の献立をすべて外しますか？\n（レシピは消えません）', { ok: 'クリアする', danger: true }))) return;
    keys.forEach((k) => delete state.plan[k]);
    await savePlan();
    renderPlan();
    toast('この週をクリアしました');
  });

  $('#days').addEventListener('click', async (e) => {
    const open = e.target.closest('[data-open]');
    const clear = e.target.closest('[data-clear]');
    const swap = e.target.closest('[data-swap]');
    const reroll = e.target.closest('[data-reroll]');
    if (open) openDetail(open.dataset.open);
    if (clear) {
      const [key, slot] = clear.dataset.clear.split('|');
      await setSlot(key, slot, null);
      renderPlan();
    }
    if (swap) {
      const [key, slot] = swap.dataset.swap.split('|');
      openPicker(key, slot);
    }
    if (reroll) {
      if (noCandidates()) { toast('提案できるレシピがありません'); return; }
      const key = reroll.dataset.reroll;
      const before = { ...(state.plan[key] || {}) };
      const used = usedInWeek(key);
      const current = new Set(Object.values(before)); // 今の料理とは違うものを選ぶ
      const day = {};
      for (const [s] of SLOTS) { const r = pickOne(candidates(s), used, current); if (r) { day[s] = r.id; used.add(r.id); } }
      state.plan[key] = day;
      await savePlan();
      renderPlan();
      toast('この日の献立を提案しました');
    }
  });

  /* ---------- レシピを選ぶ ---------- */
  const pickDlg = $('#pickDialog');
  let pickCtx = null;
  const renderPickList = () => {
    const q = $('#pickSearch').value.trim().toLowerCase();
    const cats = SLOTS.find((s) => s[0] === pickCtx.slot)[2];
    const all = $('#pickAll').checked;
    const list = state.recipes
      .filter((r) => (all || cats.includes(r.cat)) && (!q || r.name.toLowerCase().includes(q)))
      .sort((a, b) => (cats.includes(b.cat) - cats.includes(a.cat)) || (b.favorite - a.favorite) || a.name.localeCompare(b.name, 'ja'));
    const current = state.plan[pickCtx.key]?.[pickCtx.slot];
    $('#pickList').innerHTML = list.length ? list.map((r) => `
      <li><button type="button" data-pick="${esc(r.id)}"${r.id === current ? ' aria-current="true"' : ''}>
        <span class="picklist__thumb">${photoHTML(r)}</span>
        <span><span class="picklist__name">${r.favorite ? '★ ' : ''}${esc(r.name)}${r.id === current ? '（いまの料理）' : ''}</span>
        <span class="picklist__meta">${CAT_LABEL[r.cat]} ・ ${r.nutrition.kcal}kcal ・ ${fmtMin(activeTime(r))}</span></span>
      </button></li>`).join('')
      : `<li class="empty">${all || q ? 'レシピが見つかりません' : `「${esc(SLOTS.find((s) => s[0] === pickCtx.slot)[1])}」のレシピがありません。<br>「ほかのカテゴリも表示」で選ぶか、レシピを登録してください。`}</li>`;
  };
  function openPicker(key, slot) {
    pickCtx = { key, slot };
    const d = parseYmd(key);
    $('#pTitle').textContent = `${d.getMonth() + 1}/${d.getDate()}（${WEEKDAYS[d.getDay()]}）の${SLOTS.find((s) => s[0] === slot)[1]}`;
    $('#pickSearch').value = '';
    $('#pickAll').checked = false;
    renderPickList();
    pickDlg.showModal();
  }
  $('#pickSearch').addEventListener('input', renderPickList);
  $('#pickAll').addEventListener('change', renderPickList);
  $('#pickList').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-pick]');
    if (!b) return;
    await setSlot(pickCtx.key, pickCtx.slot, b.dataset.pick);
    pickDlg.close();
    renderPlan();
    toast('献立に入れました');
  });

  /* ---------- 詳細画面から「献立に追加」 ---------- */
  const slotDlg = $('#slotDialog');
  let slotRecipeId = null;
  $('#slotSeg').innerHTML = SLOTS.map(([k, l]) => `<label><input type="radio" name="slot" value="${k}">${l}</label>`).join('');
  function openSlotDialog(id) {
    slotRecipeId = id;
    const r = byId(id);
    $('#slotRecipe').textContent = r.name;
    $('#slotDate').value = ymd(new Date());
    const def = slotOf(r.cat);
    $$('input[name=slot]', slotDlg).forEach((x) => { x.checked = x.value === def; });
    slotDlg.showModal();
  }
  $('#slotForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const date = $('#slotDate').value;
    if (!date) { $('#slotDate').focus(); return; }
    const slot = $('input[name=slot]:checked', slotDlg).value;
    const replaced = byId(state.plan[date]?.[slot]);
    await setSlot(date, slot, slotRecipeId);
    slotDlg.close();
    const d = parseYmd(date);
    const label = SLOTS.find((s) => s[0] === slot)[1];
    toast(replaced && replaced.id !== slotRecipeId ? `${d.getMonth() + 1}/${d.getDate()} の${label}を入れ替えました` : `${d.getMonth() + 1}/${d.getDate()} の${label}に入れました`);
    goToDate(d);
    if (!$('#view-plan').hidden) renderPlan();
  });

  /* =========================================================
     設定
     ========================================================= */
  const targetsForm = $('#targetsForm');
  targetsForm.innerHTML = NUTRI.map((n) => `
    <div class="field"><label for="t-${n.key}">${n.label}</label>
      <div class="unit-input"><input type="number" id="t-${n.key}" data-key="${n.key}" min="0" step="${n.step}" inputmode="decimal"><span>${n.unit}</span></div></div>`).join('');
  targetsForm.addEventListener('change', async (e) => {
    const k = e.target.dataset.key;
    if (!k) return;
    const v = num(e.target.value, 0);
    state.targets[k] = v > 0 ? v : NUTRI.find((n) => n.key === k).def;
    e.target.value = state.targets[k];
    await saveTargets();
    toast('目安量を保存しました');
  });

  async function renderSettings() {
    NUTRI.forEach((n) => { $('#t-' + n.key).value = state.targets[n.key]; });
    const info = $('#storageInfo');
    const photos = state.photoURL.size;
    let text = `レシピ ${state.recipes.length} 件（写真 ${photos} 枚）`;
    if (!Store.persistent) text += '。⚠️ このブラウザでは保存機能が使えないため、ページを閉じると内容が消えます。';
    try {
      const est = await navigator.storage?.estimate?.();
      if (est?.usage != null) text += ` ・ 使用量 約${(est.usage / 1024 / 1024).toFixed(1)}MB`;
    } catch (_) { /* 取得できない環境では省略 */ }
    info.textContent = text;
  }

  // 書き出し
  $('#exportBtn').addEventListener('click', async () => {
    try {
      const photos = {};
      for (const id of await Store.keys('photos')) {
        const b = await Store.get('photos', id);
        if (b) photos[id] = await blobToDataURL(b);
      }
      const data = { app: 'hinata-recipe-note', version: SCHEMA, exportedAt: new Date().toISOString(), recipes: state.recipes, plan: state.plan, targets: state.targets, photos };
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `kyou-no-gohan-${ymd(new Date())}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      toast('書き出しました');
    } catch (e) { console.error(e); toast('書き出しに失敗しました'); }
  });

  // 読み込み
  $('#importInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    let data;
    try { data = JSON.parse(await file.text()); } catch (_) { toast('ファイルを読み込めませんでした'); return; }
    if (!data || data.app !== 'hinata-recipe-note' || !Array.isArray(data.recipes)) { toast('「今日のごはん」のバックアップファイルではありません'); return; }
    const ok = await ask(`${data.recipes.length} 件のレシピを読み込みます。\n今のデータはすべて置き換わります。よろしいですか？`, { ok: '置き換える', danger: true });
    if (!ok) return;
    try {
      const old = !(data.version >= SCHEMA); // 古い版で書き出したファイルは移行してから読み込む
      const recipes = data.recipes.map((r) => normRecipe(old ? migrateRecipeV1(r) : r));
      const ids = new Set(recipes.map((r) => r.id));
      await Store.clear('photos');
      state.photoURL.forEach((u) => URL.revokeObjectURL(u));
      state.photoURL.clear();
      for (const [id, d] of Object.entries(data.photos || {})) {
        const b = ids.has(id) && dataURLToBlob(d);
        if (b) await setPhoto(id, b);
      }
      state.recipes = recipes;
      state.plan = normPlan(old ? migratePlanV1(data.plan, recipes) : data.plan, ids);
      NUTRI.forEach((n) => { const v = num(data.targets?.[n.key], 0); state.targets[n.key] = v > 0 ? v : n.def; });
      await Promise.all([saveRecipes(), savePlan(), saveTargets()]);
      renderList(); renderSettings();
      toast('読み込みました');
    } catch (err) { onSaveError(err); }
  });

  $('#addSamplesBtn').addEventListener('click', async () => {
    const have = new Set(state.recipes.map((r) => r.id));
    const add = samples().filter((r) => !have.has(r.id));
    if (!add.length) { toast('サンプルはすべて入っています'); return; }
    state.recipes.push(...add);
    await saveRecipes();
    renderList(); renderSettings();
    toast(`サンプルを ${add.length} 件追加しました`);
  });
  $('#removeSamplesBtn').addEventListener('click', async () => {
    const ids = state.recipes.filter((r) => r.id.startsWith('sample-')).map((r) => r.id);
    if (!ids.length) { toast('サンプルはありません'); return; }
    if (!(await ask(`サンプルのレシピ ${ids.length} 件を削除しますか？\n（サンプルを複製したものは残ります）`, { ok: '削除する', danger: true }))) return;
    await deleteRecipes(ids);
    renderSettings();
    toast('サンプルを削除しました');
  });
  $('#clearAllBtn').addEventListener('click', async () => {
    if (!(await ask('レシピ・写真・献立をすべて削除します。\n元に戻せません。先にバックアップを書き出すことをおすすめします。', { ok: 'すべて削除', danger: true }))) return;
    await deleteRecipes(state.recipes.map((r) => r.id));
    state.plan = {};
    await savePlan();
    renderSettings();
    toast('すべて削除しました');
  });

  /* =========================================================
     起動
     ========================================================= */
  (async () => {
    try {
      const [recipes, plan, targets, schema] = await Promise.all(['recipes', 'plan', 'targets', 'schema'].map((k) => Store.get('kv', k)));
      if (Array.isArray(recipes)) {
        const old = schema !== SCHEMA;
        state.recipes = recipes.map((r) => normRecipe(old ? migrateRecipeV1(r) : r));
        state.plan = normPlan(old ? migratePlanV1(plan, state.recipes) : plan, new Set(state.recipes.map((r) => r.id)));
        if (old) await Promise.all([saveRecipes(), savePlan()]);
      } else {
        state.recipes = samples(); // 初回だけサンプルを入れる
        await saveRecipes();
      }
      await Store.set('kv', 'schema', SCHEMA);
      if (targets && typeof targets === 'object') NUTRI.forEach((n) => { if (num(targets[n.key]) > 0) state.targets[n.key] = targets[n.key]; });
      for (const id of await Store.keys('photos')) {
        const b = await Store.get('photos', id);
        if (b instanceof Blob) state.photoURL.set(id, URL.createObjectURL(b));
      }
      navigator.storage?.persist?.().catch(() => {});
    } catch (e) {
      console.error(e);
      toast('データの読み込みに失敗しました');
    }
    renderList();
    route();
    document.documentElement.dataset.ready = '1';
  })();
})();
