/* =========================================================
   Hinata Kitchen - main.js
   ========================================================= */
(() => {
  'use strict';

  /* ---------------------------------------------------------
     メニューデータ（1人分の分量）
     - ingredients / seasonings: [名前, 分量(数値 or null), 単位]
       単位が「少々」「適量」のときは分量に null を入れます
     - time: 分（prep=下ごしらえ, cook=加熱・調理, rest=冷やす・寝かせる）
     - nutrition: 1人分あたり（kcal, g）
     ※ 数値はすべて目安です
     --------------------------------------------------------- */
  const RECIPES = [
    {
      id: 'taco-rice', cat: 'main', name: 'ひなたのタコライス', icon: '🌮', bg: '#fde7cf',
      desc: 'スパイスで炒めたひき肉と、たっぷりの生野菜をごはんにのせて。',
      price: 1100, popular: true, veg: false,
      time: { prep: 10, cook: 10, rest: 0 },
      allergens: ['乳', '小麦'],
      ingredients: [['ごはん', 180, 'g'], ['合いびき肉', 80, 'g'], ['玉ねぎ', 40, 'g'], ['レタス', 2, '枚'], ['トマト', 0.5, '個'], ['ピザ用チーズ', 20, 'g']],
      seasonings: [['ケチャップ', 1, '大さじ'], ['ウスターソース', 1, '小さじ'], ['カレー粉', 0.5, '小さじ'], ['塩・こしょう', null, '少々'], ['オリーブオイル', 1, '小さじ']],
      nutrition: { kcal: 640, protein: 23.5, fat: 22.0, carbs: 82.0, fiber: 3.2, salt: 2.1 },
      steps: ['玉ねぎはみじん切り、レタスは千切り、トマトは角切りにする。', 'フライパンにオリーブオイルを熱し、玉ねぎとひき肉を炒める。', 'ケチャップ・ソース・カレー粉を加え、汁気がなくなるまで炒めて塩・こしょうで味を調える。', 'ごはんにレタス、ひき肉、トマト、チーズの順にのせる。']
    },
    {
      id: 'veg-curry', cat: 'main', name: '季節野菜のグリーンカレー', icon: '🍛', bg: '#e3eed5',
      desc: 'ココナッツミルクのまろやかさと、素揚げ野菜の甘みが広がります。',
      price: 1250, popular: false, veg: true,
      time: { prep: 15, cook: 20, rest: 0 },
      allergens: [],
      ingredients: [['ごはん', 180, 'g'], ['なす', 0.5, '本'], ['かぼちゃ', 50, 'g'], ['パプリカ', 0.25, '個'], ['しめじ', 30, 'g'], ['ココナッツミルク', 150, 'ml']],
      seasonings: [['グリーンカレーペースト', 1, '大さじ'], ['きび砂糖', 1, '小さじ'], ['塩', null, '少々'], ['米油', 1, '大さじ']],
      nutrition: { kcal: 720, protein: 9.8, fat: 34.5, carbs: 92.0, fiber: 5.6, salt: 1.8 },
      steps: ['野菜は食べやすい大きさに切る。', '鍋に米油を熱し、カレーペーストを香りが立つまで炒める。', '野菜を加えて炒め、ココナッツミルクと砂糖を入れて10分煮る。', '塩で味を調え、ごはんと一緒に盛り付ける。']
    },
    {
      id: 'salmon', cat: 'main', name: '鮭の西京焼き定食', icon: '🐟', bg: '#fbe0d8',
      desc: '一晩漬けた鮭をじっくり焼き上げた、ほっとする和定食。',
      price: 1300, popular: true, veg: false,
      time: { prep: 5, cook: 12, rest: 480 },
      allergens: ['大豆'],
      ingredients: [['生鮭', 1, '切れ'], ['ごはん', 160, 'g'], ['小松菜', 50, 'g'], ['豆腐', 50, 'g'], ['わかめ（乾燥）', 1, 'g']],
      seasonings: [['西京味噌', 1.5, '大さじ'], ['みりん', 1, '小さじ'], ['だし汁', 150, 'ml'], ['味噌', 2, '小さじ'], ['醤油', 0.5, '小さじ']],
      nutrition: { kcal: 560, protein: 31.0, fat: 9.5, carbs: 80.5, fiber: 2.8, salt: 3.0 },
      steps: ['西京味噌とみりんを混ぜ、鮭に塗って冷蔵庫で一晩漬ける。', '味噌を拭き取り、弱めの中火でこげないように焼く。', '小松菜はゆでて醤油で和える。', 'だし汁に豆腐とわかめを入れ、味噌を溶いて味噌汁を作る。']
    },
    {
      id: 'avocado-toast', cat: 'main', name: 'アボカドエッグトースト', icon: '🥑', bg: '#e6efd0',
      desc: '厚切りトーストにアボカドと半熟卵。朝ごはんにもぴったり。',
      price: 850, popular: false, veg: true,
      time: { prep: 5, cook: 8, rest: 0 },
      allergens: ['卵', '小麦', '乳'],
      ingredients: [['食パン（4枚切り）', 1, '枚'], ['アボカド', 0.5, '個'], ['卵', 1, '個'], ['ミニトマト', 3, '個']],
      seasonings: [['レモン汁', 1, '小さじ'], ['オリーブオイル', 1, '小さじ'], ['塩', null, '少々'], ['ブラックペッパー', null, '少々']],
      nutrition: { kcal: 430, protein: 14.2, fat: 21.0, carbs: 45.5, fiber: 6.1, salt: 1.4 },
      steps: ['卵を沸騰したお湯で6分半ゆで、冷水にとって殻をむく。', 'アボカドをつぶし、レモン汁と塩を混ぜる。', 'パンをこんがり焼き、アボカドを塗る。', '半分に切った卵とミニトマトをのせ、オリーブオイルとペッパーをかける。']
    },
    {
      id: 'cobb-salad', cat: 'side', name: 'ひなたのコブサラダ', icon: '🥗', bg: '#e1efd9',
      desc: '彩り野菜とチキン、豆をたっぷり。食べごたえのあるサラダ。',
      price: 980, popular: false, veg: false,
      time: { prep: 12, cook: 0, rest: 0 },
      allergens: ['卵'],
      ingredients: [['サラダチキン', 50, 'g'], ['ゆで卵', 0.5, '個'], ['レタス', 60, 'g'], ['ミックスビーンズ', 30, 'g'], ['コーン', 20, 'g'], ['ミニトマト', 4, '個']],
      seasonings: [['オリーブオイル', 1, '大さじ'], ['酢', 2, '小さじ'], ['粒マスタード', 1, '小さじ'], ['はちみつ', 0.5, '小さじ'], ['塩・こしょう', null, '少々']],
      nutrition: { kcal: 330, protein: 21.5, fat: 18.0, carbs: 20.5, fiber: 5.9, salt: 1.3 },
      steps: ['具材をすべて1cm角に切る。', '調味料をよく混ぜてドレッシングを作る。', 'レタスを敷いた器に具材を列に並べ、食べる直前にドレッシングをかける。']
    },
    {
      id: 'pumpkin-soup', cat: 'side', name: 'かぼちゃのポタージュ', icon: '🎃', bg: '#fdebc8',
      desc: '北海道産かぼちゃのやさしい甘さ。なめらかな口あたりです。',
      price: 550, popular: true, veg: true,
      time: { prep: 8, cook: 15, rest: 0 },
      allergens: ['乳'],
      ingredients: [['かぼちゃ', 100, 'g'], ['玉ねぎ', 30, 'g'], ['牛乳', 100, 'ml'], ['水', 50, 'ml']],
      seasonings: [['バター', 5, 'g'], ['コンソメ（顆粒）', 0.5, '小さじ'], ['塩', null, '少々']],
      nutrition: { kcal: 190, protein: 5.2, fat: 8.0, carbs: 25.0, fiber: 3.6, salt: 0.9 },
      steps: ['かぼちゃは皮をむいて薄切り、玉ねぎも薄切りにする。', '鍋にバターを溶かし、玉ねぎをしんなりするまで炒める。', 'かぼちゃ・水・コンソメを加え、柔らかくなるまで煮る。', 'ミキサーにかけて鍋に戻し、牛乳を加えて温め、塩で味を調える。']
    },
    {
      id: 'minestrone', cat: 'side', name: '具だくさんミネストローネ', icon: '🍅', bg: '#fbdcd5',
      desc: '7種の野菜をトマトでじっくり煮込んだ、体が温まるスープ。',
      price: 600, popular: false, veg: true,
      time: { prep: 10, cook: 20, rest: 0 },
      allergens: [],
      ingredients: [['トマト缶（カット）', 100, 'g'], ['キャベツ', 40, 'g'], ['にんじん', 20, 'g'], ['玉ねぎ', 30, 'g'], ['セロリ', 15, 'g'], ['じゃがいも', 30, 'g'], ['水', 150, 'ml']],
      seasonings: [['オリーブオイル', 1, '小さじ'], ['にんにく', 0.5, '片'], ['コンソメ（顆粒）', 1, '小さじ'], ['塩・こしょう', null, '少々']],
      nutrition: { kcal: 120, protein: 3.0, fat: 4.3, carbs: 18.0, fiber: 3.8, salt: 1.2 },
      steps: ['野菜はすべて1cm角に切り、にんにくはみじん切りにする。', '鍋にオリーブオイルとにんにくを入れて弱火にかけ、香りを出す。', '野菜を炒め、トマト缶・水・コンソメを加えて15分煮込む。', '塩・こしょうで味を調える。']
    },
    {
      id: 'pudding', cat: 'sweets', name: '昔ながらの固めプリン', icon: '🍮', bg: '#fdeec0',
      desc: '卵の風味がしっかり感じられる、ほろ苦カラメルのプリン。',
      price: 480, popular: true, veg: true,
      time: { prep: 10, cook: 30, rest: 120 },
      allergens: ['卵', '乳'],
      ingredients: [['卵', 1, '個'], ['牛乳', 100, 'ml']],
      seasonings: [['グラニュー糖（プリン液）', 1.5, '大さじ'], ['グラニュー糖（カラメル）', 1, '大さじ'], ['水（カラメル）', 1, '小さじ'], ['バニラエッセンス', null, '少々']],
      nutrition: { kcal: 230, protein: 9.0, fat: 8.5, carbs: 29.0, fiber: 0, salt: 0.3 },
      steps: ['砂糖と水を火にかけ、茶色く色づいたらカラメルとして型に流す。', '牛乳と砂糖を温め、溶いた卵とバニラを混ぜてこす。', '型に流し、150℃のオーブンで湯せん焼きを30分。', '粗熱をとり、冷蔵庫で2時間以上冷やす。']
    },
    {
      id: 'banana-cake', cat: 'sweets', name: 'バナナとくるみのケーキ', icon: '🍌', bg: '#fbf0c9',
      desc: '完熟バナナをたっぷり練り込んだ、しっとり焼き菓子。',
      price: 450, popular: false, veg: true,
      time: { prep: 15, cook: 40, rest: 0 },
      allergens: ['卵', '小麦', '乳', 'くるみ'],
      ingredients: [['完熟バナナ', 0.5, '本'], ['薄力粉', 25, 'g'], ['卵', 0.25, '個'], ['くるみ', 5, 'g']],
      seasonings: [['きび砂糖', 15, 'g'], ['無塩バター', 15, 'g'], ['ベーキングパウダー', 0.25, '小さじ']],
      nutrition: { kcal: 280, protein: 4.0, fat: 14.5, carbs: 35.0, fiber: 1.4, salt: 0.1 },
      steps: ['バターを室温に戻し、砂糖とすり混ぜる。', '溶き卵とつぶしたバナナを加えてよく混ぜる。', '薄力粉とベーキングパウダーをふるい入れ、くるみを加えて混ぜる。', '型に流し、170℃のオーブンで40分焼く。']
    },
    {
      id: 'hojicha-latte', cat: 'drink', name: 'ほうじ茶ラテ', icon: '🍵', bg: '#eee3d3',
      desc: '香ばしいほうじ茶とミルクの、ほっとする組み合わせ。',
      price: 550, popular: false, veg: true,
      time: { prep: 2, cook: 5, rest: 0 },
      allergens: ['乳'],
      ingredients: [['ほうじ茶（茶葉）', 5, 'g'], ['お湯', 60, 'ml'], ['牛乳', 150, 'ml']],
      seasonings: [['きび砂糖', 1, '小さじ']],
      nutrition: { kcal: 120, protein: 5.0, fat: 5.7, carbs: 12.5, fiber: 0, salt: 0.2 },
      steps: ['茶葉に熱湯を注ぎ、3分蒸らして濃いめに抽出する。', '牛乳を温め、泡立てる。', '茶こしでこしたほうじ茶と砂糖をカップに入れ、ミルクを注ぐ。']
    },
    {
      id: 'lemon-soda', cat: 'drink', name: '自家製レモンスカッシュ', icon: '🍋', bg: '#fbf4c4',
      desc: '国産レモンを漬けたシロップで作る、爽やかな一杯。',
      price: 500, popular: false, veg: true,
      time: { prep: 3, cook: 0, rest: 0 },
      allergens: [],
      ingredients: [['レモン（スライス）', 2, '枚'], ['炭酸水', 150, 'ml'], ['氷', 5, '個']],
      seasonings: [['レモンシロップ', 2, '大さじ'], ['レモン汁', 1, '小さじ']],
      nutrition: { kcal: 85, protein: 0.1, fat: 0, carbs: 21.0, fiber: 0.3, salt: 0 },
      steps: ['グラスに氷とレモンシロップ、レモン汁を入れる。', '炭酸水を静かに注ぎ、軽く混ぜる。', 'レモンスライスを浮かべる。']
    }
  ];

  const CAT_LABEL = { main: 'ごはん', side: 'サラダ・スープ', sweets: 'スイーツ', drink: 'ドリンク' };

  /* 成人の1日の目安量（栄養成分のバー表示用） */
  const DAILY = [
    { key: 'kcal', label: 'エネルギー', unit: 'kcal', daily: 2000 },
    { key: 'protein', label: 'たんぱく質', unit: 'g', daily: 65 },
    { key: 'fat', label: '脂質', unit: 'g', daily: 62 },
    { key: 'carbs', label: '炭水化物', unit: 'g', daily: 300 },
    { key: 'fiber', label: '食物繊維', unit: 'g', daily: 21 },
    { key: 'salt', label: '食塩相当量', unit: 'g', daily: 7 }
  ];

  const QUICK_MIN = 15;
  const LIGHT_KCAL = 400;
  const MAX_SERVINGS = 8;

  /* ---------- ユーティリティ ---------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const yen = (n) => '¥' + n.toLocaleString('ja-JP');
  const activeTime = (r) => r.time.prep + r.time.cook; // 手を動かす時間
  const fmtMin = (m) => (m >= 60 ? `${Math.floor(m / 60)}時間${m % 60 ? (m % 60) + '分' : ''}` : `${m}分`);

  const FRACTIONS = { 0.25: '¼', 0.5: '½', 0.75: '¾' };
  const PREFIX_UNITS = ['大さじ', '小さじ', 'カップ'];
  const COUNT_UNITS = ['個', '枚', '本', '片', '切れ', '大さじ', '小さじ', 'カップ'];

  // 分量を見やすい形に整える（例: 大さじ1½ / 240g / 1¼個）
  const fmtAmount = (amount, unit, servings) => {
    if (amount == null) return unit;
    let v = amount * servings;
    let num;
    if (COUNT_UNITS.includes(unit)) {
      v = Math.round(v * 4) / 4; // ¼ 単位に丸める
      if (v === 0) v = 0.25;
      const whole = Math.floor(v);
      const frac = FRACTIONS[+(v - whole).toFixed(2)] || '';
      num = (whole ? whole : '') + frac;
    } else {
      num = v < 10 ? Math.round(v * 2) / 2 : Math.round(v);
    }
    return PREFIX_UNITS.includes(unit) ? unit + num : num + unit;
  };

  /* ---------- 一覧の描画 ---------- */
  const state = { cat: 'all', opts: new Set(), sort: 'default' };
  const cardsEl = $('#cards');

  const filtered = () => {
    let list = RECIPES.filter((r) =>
      (state.cat === 'all' || r.cat === state.cat) &&
      (!state.opts.has('quick') || activeTime(r) <= QUICK_MIN) &&
      (!state.opts.has('light') || r.nutrition.kcal <= LIGHT_KCAL) &&
      (!state.opts.has('veg') || r.veg)
    );
    const sorters = {
      time: (a, b) => activeTime(a) - activeTime(b),
      kcal: (a, b) => a.nutrition.kcal - b.nutrition.kcal,
      price: (a, b) => a.price - b.price
    };
    if (sorters[state.sort]) list = [...list].sort(sorters[state.sort]);
    return list;
  };

  const render = () => {
    const list = filtered();
    cardsEl.innerHTML = list.map((r, i) => `
      <button type="button" class="card" data-id="${r.id}" style="animation-delay:${i * 40}ms" aria-label="${esc(r.name)} の詳細を見る">
        <div class="card__visual" style="background:${r.bg}" aria-hidden="true">${r.icon}</div>
        <div class="card__badges">
          ${r.popular ? '<span class="badge badge--pop">人気</span>' : ''}
          ${r.veg ? '<span class="badge">🌱 ベジ</span>' : ''}
        </div>
        <div class="card__body">
          <h3 class="card__name">${esc(r.name)}</h3>
          <p class="card__desc">${esc(r.desc)}</p>
          <p class="card__meta">
            <span>⏱ <b>${fmtMin(activeTime(r))}</b></span>
            <span>🔥 <b>${r.nutrition.kcal}</b> kcal</span>
            <span class="card__price">${yen(r.price)}</span>
          </p>
        </div>
      </button>`).join('');
    $('#resultCount').textContent = list.length;
    $('#emptyMsg').hidden = list.length > 0;
  };

  // カテゴリ（単一選択）
  $$('[data-cat]').forEach((btn) => btn.addEventListener('click', () => {
    state.cat = btn.dataset.cat;
    $$('[data-cat]').forEach((b) => {
      b.classList.toggle('is-active', b === btn);
      b.setAttribute('aria-pressed', String(b === btn));
    });
    render();
  }));
  // 条件（複数選択）
  $$('[data-opt]').forEach((btn) => btn.addEventListener('click', () => {
    const on = !state.opts.has(btn.dataset.opt);
    on ? state.opts.add(btn.dataset.opt) : state.opts.delete(btn.dataset.opt);
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', String(on));
    render();
  }));
  $('#sortSelect').addEventListener('change', (e) => { state.sort = e.target.value; render(); });

  render();
  $('#statCount').textContent = RECIPES.length;

  /* ---------- 詳細モーダル ---------- */
  const modal = $('#recipeModal');
  const dialog = $('.modal__dialog', modal);
  let current = null;
  let servings = 1;
  let lastFocused = null;

  const renderAmounts = (flash = false) => {
    const row = ([name, amount, unit]) => `<tr${flash && amount != null ? ' class="is-changed"' : ''}><td>${esc(name)}</td><td>${esc(fmtAmount(amount, unit, servings))}</td></tr>`;
    $('#rIngredients').innerHTML = current.ingredients.map(row).join('');
    $('#rSeasonings').innerHTML = current.seasonings.map(row).join('');
    $('#servNum').textContent = servings + '人分';
    $('#servMinus').disabled = servings <= 1;
    $('#servPlus').disabled = servings >= MAX_SERVINGS;
  };

  const openRecipe = (id) => {
    current = RECIPES.find((r) => r.id === id);
    if (!current) return;
    servings = 1;
    const r = current;

    $('#rHero').style.background = r.bg;
    $('#rIcon').textContent = r.icon;
    $('#rCat').textContent = CAT_LABEL[r.cat];
    $('#rTitle').textContent = r.name;
    $('#rDesc').textContent = r.desc;
    $('#rPrice').textContent = yen(r.price);
    $('#rTime').innerHTML = fmtMin(activeTime(r)) + (r.time.rest ? `<small>＋${r.cat === 'sweets' ? '冷やす' : '漬け込み'} ${fmtMin(r.time.rest)}</small>` : '');
    $('#rKcal').textContent = r.nutrition.kcal + 'kcal';

    // 調理時間の内訳バー
    const parts = [
      ['t-prep', '下ごしらえ', r.time.prep],
      ['t-cook', '調理', r.time.cook],
      ['t-rest', r.cat === 'sweets' ? '冷やす' : '漬け込み', r.time.rest]
    ].filter((p) => p[2] > 0);
    const total = parts.reduce((s, p) => s + p[2], 0);
    // 長い待ち時間でバーが埋まらないよう、表示幅は平方根で圧縮
    const weights = parts.map((p) => Math.sqrt(p[2]));
    const wSum = weights.reduce((a, b) => a + b, 0);
    $('#rTimeBar').innerHTML = parts.map((p, i) =>
      `<span class="${p[0]}" style="flex:${weights[i] / wSum}" title="${p[1]} ${fmtMin(p[2])}">${p[1]} ${fmtMin(p[2])}</span>`).join('');
    $('#rTimeBar').setAttribute('aria-label', `調理時間の内訳：${parts.map((p) => p[1] + fmtMin(p[2])).join('、')}（合計${fmtMin(total)}）`);

    $('#rAllergy').innerHTML = r.allergens.length
      ? '<b class="r-allergy__label">アレルギー：</b>' + r.allergens.map((a) => `<span>${esc(a)}</span>`).join('')
      : '<span class="none">主なアレルゲン不使用</span>';

    renderAmounts();

    $('#rNutrition').innerHTML = DAILY.map((d) => {
      const v = r.nutrition[d.key];
      const pct = Math.round((v / d.daily) * 100);
      return `<li>
        <span>${d.label}</span>
        <span class="nutri__val">${v}${d.unit}</span>
        <span class="nutri__bar" aria-hidden="true"><i class="${pct >= 35 ? 'is-high' : ''}" style="width:${Math.min(pct, 100)}%"></i></span>
        <span class="nutri__pct">1日の目安の ${pct}%</span>
      </li>`;
    }).join('');

    $('#rSteps').innerHTML = r.steps.map((s) => `<li>${esc(s)}</li>`).join('');

    lastFocused = document.activeElement;
    $('.modal__scroll', modal).scrollTop = 0;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    setTimeout(() => $('.modal__close', modal).focus(), 50);
  };

  const closeRecipe = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    if (lastFocused) lastFocused.focus();
  };

  cardsEl.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) openRecipe(card.dataset.id);
  });
  $$('[data-close]', modal).forEach((el) => el.addEventListener('click', closeRecipe));
  $('#servMinus').addEventListener('click', () => { if (servings > 1) { servings--; renderAmounts(true); } });
  $('#servPlus').addEventListener('click', () => { if (servings < MAX_SERVINGS) { servings++; renderAmounts(true); } });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeRecipe();
    if (e.key === 'Tab') {
      const items = $$('button:not([disabled]), a[href], select', dialog);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- その他 ---------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  $('#year').textContent = new Date().getFullYear();
})();
