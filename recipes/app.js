/* =========================================================
   ひなたレシピ帳 - app.js
   データはすべてこのブラウザの IndexedDB に保存します。
   ========================================================= */
(() => {
  'use strict';

  /* ---------- 定数 ---------- */
  const CAT_LABEL = { main: 'ごはん', side: 'サラダ・スープ', sweets: 'スイーツ', drink: 'ドリンク', other: 'その他' };
  const CAT_COLOR = { main: '#fde7cf', side: '#e1efd9', sweets: '#fdeec0', drink: '#eee3d3', other: '#e9e4f2' };
  const SLOTS = [['breakfast', '朝'], ['lunch', '昼'], ['dinner', '夜'], ['snack', '間食']];
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
  const mondayOf = (d) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); return addDays(x, -((x.getDay() + 6) % 7)); };
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
    plan: {},          // { 'YYYY-MM-DD': { breakfast: [id], lunch: [], dinner: [], snack: [] } }
    targets: Object.fromEntries(NUTRI.map((n) => [n.key, n.def])),
    photoURL: new Map(), // id -> objectURL
    filter: { q: '', cat: 'all', opts: new Set(), sort: 'updated' },
    week: mondayOf(new Date())
  };
  const byId = (id) => state.recipes.find((r) => r.id === id);

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
    for (const day of Object.values(state.plan)) for (const k of Object.keys(day)) day[k] = day[k].filter((id) => !set.has(id));
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
     献立
     ========================================================= */
  const dayTotals = (key) => {
    const day = state.plan[key];
    const t = Object.fromEntries(NUTRI.map((n) => [n.key, 0]));
    let count = 0;
    if (day) for (const [s] of SLOTS) for (const id of day[s] || []) {
      const r = byId(id);
      if (!r) continue;
      count++;
      NUTRI.forEach((n) => { t[n.key] += r.nutrition[n.key]; });
    }
    return { t, count };
  };

  const minibar = (label, v, unit, target) => {
    const pct = target ? (v / target) * 100 : 0;
    return `<div class="minibar"><span>${label}</span><b>${round1(v)}</b>${unit}
      <div class="minibar__track" title="目安の${Math.round(pct)}%"><i class="${pct > 100 ? 'is-over' : ''}" style="width:${Math.min(pct, 100)}%"></i></div></div>`;
  };

  function renderPlan() {
    const start = state.week, end = addDays(start, 6);
    $('#weekLabel').textContent = `${start.getMonth() + 1}/${start.getDate()}（月）〜 ${end.getMonth() + 1}/${end.getDate()}（日）`;
    const todayKey = ymd(new Date());
    let html = '', sumKcal = 0, sumSalt = 0, days = 0, dishes = 0;

    for (let i = 0; i < 7; i++) {
      const d = addDays(start, i), key = ymd(d), plan = state.plan[key] || {};
      const { t, count } = dayTotals(key);
      if (count) { days++; sumKcal += t.kcal; sumSalt += t.salt; dishes += count; }
      const dow = d.getDay();
      html += `<article class="day${key === todayKey ? ' is-today' : ''}" aria-label="${d.getMonth() + 1}月${d.getDate()}日">
        <div class="day__head">
          <h2 class="day__date ${dow === 0 ? 'sun' : dow === 6 ? 'sat' : ''}">${d.getMonth() + 1}/${d.getDate()}<small>（${WEEKDAYS[dow]}）</small>${key === todayKey ? '<span class="today">今日</span>' : ''}</h2>
          <p class="day__kcal">${count ? Math.round(t.kcal) + '<small> kcal</small>' : '<small>未登録</small>'}</p>
        </div>
        ${SLOTS.map(([s, label]) => `
          <div class="slot">
            <span class="slot__label">${label}</span>
            <div class="slot__items">
              ${(plan[s] || []).map((id, idx) => { const r = byId(id); return r ? `
                <span class="plan-item">
                  <button type="button" class="plan-item__open" data-open="${esc(id)}">
                    <span class="plan-item__thumb">${photoHTML(r)}</span>
                    <span class="plan-item__name">${esc(r.name)}</span>
                  </button>
                  <button type="button" class="plan-item__del" data-del="${key}|${s}|${idx}" aria-label="${esc(r.name)} を外す">✕</button>
                </span>` : ''; }).join('')}
              <button type="button" class="slot__add" data-add-slot="${key}|${s}" aria-label="${d.getMonth() + 1}/${d.getDate()} ${label}に追加">＋</button>
            </div>
          </div>`).join('')}
        ${count ? `<div class="day__bars">
          ${minibar('エネルギー', t.kcal, 'kcal', state.targets.kcal)}
          ${minibar('たんぱく質', t.protein, 'g', state.targets.protein)}
          ${minibar('塩分', t.salt, 'g', state.targets.salt)}
        </div>` : ''}
      </article>`;
    }
    $('#days').innerHTML = html;
    $('#weekSummary').innerHTML = `
      <div class="weeksum__item"><span>登録した品数</span><strong>${dishes}</strong></div>
      <div class="weeksum__item"><span>1日平均 kcal</span><strong>${days ? Math.round(sumKcal / days) : '—'}</strong></div>
      <div class="weeksum__item"><span>1日平均 塩分</span><strong>${days ? round1(sumSalt / days) + 'g' : '—'}</strong></div>`;
  }

  $('#prevWeek').addEventListener('click', () => { state.week = addDays(state.week, -7); renderPlan(); });
  $('#nextWeek').addEventListener('click', () => { state.week = addDays(state.week, 7); renderPlan(); });
  $('#thisWeekBtn').addEventListener('click', () => { state.week = mondayOf(new Date()); renderPlan(); });

  const addToPlan = async (key, slot, id) => {
    const day = state.plan[key] || (state.plan[key] = {});
    (day[slot] || (day[slot] = [])).push(id);
    await savePlan();
  };

  $('#days').addEventListener('click', async (e) => {
    const open = e.target.closest('[data-open]');
    const del = e.target.closest('[data-del]');
    const add = e.target.closest('[data-add-slot]');
    if (open) openDetail(open.dataset.open);
    if (del) {
      const [key, slot, idx] = del.dataset.del.split('|');
      state.plan[key][slot].splice(Number(idx), 1);
      await savePlan();
      renderPlan();
    }
    if (add) {
      const [key, slot] = add.dataset.addSlot.split('|');
      openPicker(key, slot);
    }
  });

  // レシピを選ぶ
  const pickDlg = $('#pickDialog');
  let pickCtx = null;
  const renderPickList = () => {
    const q = $('#pickSearch').value.trim().toLowerCase();
    const list = state.recipes.filter((r) => !q || r.name.toLowerCase().includes(q)).sort((a, b) => (b.favorite - a.favorite) || a.name.localeCompare(b.name, 'ja'));
    $('#pickList').innerHTML = list.length ? list.map((r) => `
      <li><button type="button" data-pick="${esc(r.id)}">
        <span class="picklist__thumb">${photoHTML(r)}</span>
        <span><span class="picklist__name">${r.favorite ? '★ ' : ''}${esc(r.name)}</span>
        <span class="picklist__meta">${CAT_LABEL[r.cat]} ・ ${r.nutrition.kcal}kcal ・ ${fmtMin(activeTime(r))}</span></span>
      </button></li>`).join('') : '<li class="empty">レシピが見つかりません</li>';
  };
  function openPicker(key, slot) {
    pickCtx = { key, slot };
    const d = parseYmd(key);
    $('#pTitle').textContent = `${d.getMonth() + 1}/${d.getDate()}（${WEEKDAYS[d.getDay()]}）${SLOTS.find((s) => s[0] === slot)[1]}`;
    $('#pickSearch').value = '';
    renderPickList();
    pickDlg.showModal();
  }
  $('#pickSearch').addEventListener('input', renderPickList);
  $('#pickList').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-pick]');
    if (!b) return;
    await addToPlan(pickCtx.key, pickCtx.slot, b.dataset.pick);
    pickDlg.close();
    renderPlan();
    toast('献立に追加しました');
  });

  // 詳細画面から「献立に追加」
  const slotDlg = $('#slotDialog');
  let slotRecipeId = null;
  $('#slotSeg').innerHTML = SLOTS.map(([k, l], i) => `<label><input type="radio" name="slot" value="${k}"${i === 2 ? ' checked' : ''}>${l}</label>`).join('');
  function openSlotDialog(id) {
    slotRecipeId = id;
    $('#slotRecipe').textContent = byId(id).name;
    $('#slotDate').value = ymd(new Date());
    const h = new Date().getHours();
    const def = h < 10 ? 'breakfast' : h < 15 ? 'lunch' : 'dinner';
    $$('input[name=slot]', slotDlg).forEach((r) => { r.checked = r.value === def; });
    slotDlg.showModal();
  }
  $('#slotForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const date = $('#slotDate').value;
    if (!date) { $('#slotDate').focus(); return; }
    const slot = $('input[name=slot]:checked', slotDlg).value;
    await addToPlan(date, slot, slotRecipeId);
    slotDlg.close();
    const d = parseYmd(date);
    toast(`${d.getMonth() + 1}/${d.getDate()} の${SLOTS.find((s) => s[0] === slot)[1]}に追加しました`);
    state.week = mondayOf(d);
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
      const data = { app: 'hinata-recipe-note', version: 1, exportedAt: new Date().toISOString(), recipes: state.recipes, plan: state.plan, targets: state.targets, photos };
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `hinata-recipes-${ymd(new Date())}.json`;
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
    if (!data || data.app !== 'hinata-recipe-note' || !Array.isArray(data.recipes)) { toast('ひなたレシピ帳のファイルではありません'); return; }
    const ok = await ask(`${data.recipes.length} 件のレシピを読み込みます。\n今のデータはすべて置き換わります。よろしいですか？`, { ok: '置き換える', danger: true });
    if (!ok) return;
    try {
      const recipes = data.recipes.map(normRecipe);
      const ids = new Set(recipes.map((r) => r.id));
      await Store.clear('photos');
      state.photoURL.forEach((u) => URL.revokeObjectURL(u));
      state.photoURL.clear();
      for (const [id, d] of Object.entries(data.photos || {})) {
        const b = ids.has(id) && dataURLToBlob(d);
        if (b) await setPhoto(id, b);
      }
      state.recipes = recipes;
      state.plan = {};
      for (const [k, day] of Object.entries(data.plan || {})) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(k) || typeof day !== 'object') continue;
        state.plan[k] = Object.fromEntries(SLOTS.map(([s]) => [s, (Array.isArray(day[s]) ? day[s] : []).filter((id) => ids.has(id))]));
      }
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
      const [recipes, plan, targets] = await Promise.all([Store.get('kv', 'recipes'), Store.get('kv', 'plan'), Store.get('kv', 'targets')]);
      if (Array.isArray(recipes)) state.recipes = recipes.map(normRecipe);
      else { state.recipes = samples(); await saveRecipes(); } // 初回だけサンプルを入れる
      if (plan && typeof plan === 'object') state.plan = plan;
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
