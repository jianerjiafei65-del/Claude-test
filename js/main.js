/* =========================================================
   Café Komorebi - main.js
   ========================================================= */
(() => {
  'use strict';

  /* ---------- メニューデータ（ここを編集すれば内容を差し替えられます） ---------- */
  const MENU_DATA = {
    coffee: [
      { icon: '☕', name: 'コモレビブレンド', price: 550, desc: 'ナッツのような香ばしさと、やさしい甘みが広がる当店の定番。', tag: 'No.1' },
      { icon: '🫘', name: '本日のシングルオリジン', price: 650, desc: '季節ごとに厳選した農園の豆を、個性が引き立つ焙煎で。' },
      { icon: '🥛', name: 'カフェラテ', price: 600, desc: 'エスプレッソにきめ細かなスチームミルクを合わせて。' },
      { icon: '🍯', name: 'ハニーカフェオレ', price: 650, desc: '国産はちみつのまろやかな甘さがコーヒーとよく合います。' },
      { icon: '🧊', name: '水出しアイスコーヒー', price: 600, desc: '12時間かけてじっくり抽出。すっきりとした後味。' },
      { icon: '🍫', name: 'カフェモカ', price: 680, desc: 'ビターチョコレートとエスプレッソの大人の組み合わせ。' }
    ],
    tea: [
      { icon: '🍵', name: '抹茶ラテ', price: 650, desc: '京都・宇治の抹茶を使った、濃厚でほろ苦い一杯。', tag: '人気' },
      { icon: '🫖', name: 'アールグレイ', price: 600, desc: 'ベルガモットの華やかな香り。ポットでご提供します。' },
      { icon: '🌼', name: 'カモミールティー', price: 600, desc: 'ノンカフェインでリラックスしたい時にどうぞ。' },
      { icon: '🍋', name: 'レモネード', price: 580, desc: '自家製シロップで作る、甘酸っぱい爽やかな味わい。' }
    ],
    food: [
      { icon: '🥪', name: 'クラブハウスサンド', price: 1100, desc: 'ローストチキンとベーコン、たっぷり野菜をサンド。', tag: 'ランチ' },
      { icon: '🥐', name: 'クロワッサンセット', price: 750, desc: '焼きたてクロワッサンにサラダとスープを添えて。' },
      { icon: '🍛', name: '木漏れ日キーマカレー', price: 1200, desc: '10種のスパイスと野菜の旨みが溶け込んだ自慢の一皿。' },
      { icon: '🍞', name: 'あんバタートースト', price: 680, desc: '厚切りトーストに自家製あんこと発酵バターをのせて。' },
      { icon: '🥗', name: '季節野菜のキッシュ', price: 950, desc: 'サクサクの生地に旬の野菜をたっぷり詰め込みました。' }
    ],
    sweets: [
      { icon: '🍮', name: '固めプリン', price: 550, desc: '昔ながらの懐かしい食感。ほろ苦いカラメルとともに。', tag: '人気' },
      { icon: '🍰', name: 'いちごのショートケーキ', price: 650, desc: 'ふわふわのスポンジと甘さ控えめの生クリーム。' },
      { icon: '🧀', name: 'ベイクドチーズケーキ', price: 600, desc: 'しっとり濃厚。コーヒーとの相性は抜群です。' },
      { icon: '🍪', name: '焼き菓子セット', price: 500, desc: 'クッキーとフィナンシェの詰め合わせ。お土産にも。' },
      { icon: '🍨', name: 'アフォガート', price: 700, desc: 'バニラアイスに淹れたてのエスプレッソをかけて。' },
      { icon: '🥞', name: 'スフレパンケーキ', price: 1000, desc: '注文を受けてから焼き上げる、とろける口どけ。' }
    ]
  };

  /* ---------- 営業時間（0=日曜 … 6=土曜） ---------- */
  const HOURS = {
    0: [9, 19], 1: [8, 20], 2: [8, 20], 3: null, 4: [8, 20], 5: [8, 20], 6: [9, 19]
  };

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const yen = (n) => '¥' + n.toLocaleString('ja-JP');
  const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- ヘッダー：スクロール時の背景 ---------- */
  const header = $('#header');
  const toTop = $('#toTop');
  const spFixed = $('.sp-fixed');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    toTop.classList.toggle('is-show', y > 500);
    spFixed.classList.toggle('is-show', y > 300);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- ハンバーガーメニュー ---------- */
  const navToggle = $('#navToggle');
  const setNav = (open) => {
    header.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    document.body.classList.toggle('is-locked', open);
  };
  navToggle.addEventListener('click', () => setNav(!header.classList.contains('is-open')));
  $$('.nav a, .nav button').forEach((el) => el.addEventListener('click', () => setNav(false)));
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });

  /* ---------- メニュー：パネル生成 & タブ切り替え ---------- */
  const panelsWrap = $('#menuPanels');
  panelsWrap.innerHTML = Object.entries(MENU_DATA).map(([key, items], i) => `
    <div class="menu__panel" role="tabpanel" id="panel-${key}" aria-labelledby="tab-${key}" ${i === 0 ? '' : 'hidden'}>
      ${items.map((item) => `
        <article class="menu-card">
          ${item.tag ? `<span class="menu-card__tag">${escapeHTML(item.tag)}</span>` : ''}
          <div class="menu-card__icon" aria-hidden="true">${item.icon}</div>
          <div class="menu-card__body">
            <div class="menu-card__head">
              <h3 class="menu-card__name">${escapeHTML(item.name)}</h3>
              <span class="menu-card__price">${yen(item.price)}</span>
            </div>
            <p class="menu-card__desc">${escapeHTML(item.desc)}</p>
          </div>
        </article>`).join('')}
    </div>`).join('');

  const tabs = $$('.tabs__btn');
  const activateTab = (tab, focus = false) => {
    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      $('#panel-' + t.dataset.tab).hidden = !active;
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: 1, ArrowLeft: -1 };
      if (e.key in keys) {
        e.preventDefault();
        activateTab(tabs[(i + keys[e.key] + tabs.length) % tabs.length], true);
      } else if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        activateTab(tabs[e.key === 'Home' ? 0 : tabs.length - 1], true);
      }
    });
  });

  /* ---------- スクロールで表示 ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- ナビの現在地ハイライト ---------- */
  const navLinks = $$('.nav__link');
  if ('IntersectionObserver' in window) {
    const sectionIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['concept', 'menu', 'info'].forEach((id) => sectionIO.observe(document.getElementById(id)));
  }

  /* ---------- 営業中ステータス ---------- */
  const status = $('#openStatus');
  const updateStatus = () => {
    // 日本時間で判定
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    const today = HOURS[now.getDay()];
    const h = now.getHours() + now.getMinutes() / 60;
    if (!today) {
      status.textContent = '本日は定休日です';
      status.classList.remove('is-open');
    } else if (h >= today[0] && h < today[1]) {
      status.textContent = `ただいま営業中（${today[1]}:00 まで）`;
      status.classList.add('is-open');
    } else {
      status.textContent = `営業時間外（本日 ${today[0]}:00〜${today[1]}:00）`;
      status.classList.remove('is-open');
    }
  };
  updateStatus();
  setInterval(updateStatus, 60 * 1000);

  /* ---------- お問い合わせモーダル ---------- */
  const modal = $('#contactModal');
  const dialog = $('.modal__dialog', modal);
  const form = $('#contactForm');
  const formView = $('#formView');
  const doneView = $('#doneView');
  let lastFocused = null;

  const focusables = () => $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', dialog)
    .filter((el) => el.offsetParent !== null);

  const openModal = () => {
    lastFocused = document.activeElement;
    formView.hidden = false;
    doneView.hidden = true;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    setTimeout(() => $('#name').focus(), 50);
  };
  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    if (lastFocused) lastFocused.focus();
  };

  $$('.js-open-contact').forEach((btn) => btn.addEventListener('click', openModal));
  $$('[data-close]', modal).forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') {
      // フォーカスをモーダル内に閉じ込める
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- フォームのバリデーション ---------- */
  const rules = {
    name: (v) => (v.trim() ? '' : 'お名前を入力してください。'),
    email: (v) => {
      if (!v.trim()) return 'メールアドレスを入力してください。';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'メールアドレスの形式が正しくありません。';
    },
    message: (v) => {
      if (!v.trim()) return 'お問い合わせ内容を入力してください。';
      return v.trim().length < 10 ? '10文字以上でご記入ください。' : '';
    }
  };

  const validateField = (field) => {
    const msg = rules[field.name](field.value);
    const errorEl = $('#' + field.name + '-error');
    errorEl.textContent = msg;
    field.classList.toggle('is-invalid', !!msg);
    field.setAttribute('aria-invalid', String(!!msg));
    if (msg) field.setAttribute('aria-describedby', errorEl.id);
    else field.removeAttribute('aria-describedby');
    return !msg;
  };

  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => { if (field.classList.contains('is-invalid')) validateField(field); });
  });

  const msgCount = $('#msgCount');
  form.elements.message.addEventListener('input', (e) => { msgCount.textContent = e.target.value.length; });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(rules).map((name) => validateField(form.elements[name]));
    if (results.includes(false)) {
      form.querySelector('.is-invalid').focus();
      return;
    }

    // ※ デモのため実際の送信は行いません。サーバーやフォームサービスと連携する場合はここで fetch します。
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中…';
    setTimeout(() => {
      form.reset();
      msgCount.textContent = '0';
      submitBtn.disabled = false;
      submitBtn.textContent = '送信する';
      formView.hidden = true;
      doneView.hidden = false;
      $('#doneTitle').focus();
    }, 800);
  });

  /* ---------- フッターの年 ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
