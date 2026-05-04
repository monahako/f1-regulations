// カテゴリ見出し → セクションID のマッピング
const CATEGORY_MAP = [
  { heading: '① エンジン／パワーユニット', id: 'section-engine' },
  { heading: '② 車体／シャシー',           id: 'section-chassis' },
  { heading: '③ 空力・タイヤ・ホイール',   id: 'section-aero' },
  { heading: '④ レースルール（Format）',   id: 'section-race_rules' },
  { heading: '⑤ 安全・健康',               id: 'section-safety' },
  { heading: '⑥ コスト・開発制限',         id: 'section-cost' },
  { heading: '⑦ メディア・運営・公平性',   id: 'section-media' },
  { heading: '⑧ 環境・サステナビリティ',   id: 'section-environment' },
];

// 年 → 画像ファイル名
function getCarImage(year) {
  const y = parseInt(year, 10);
  if (y <= 2008) return 'images/CarImage_2000-2008.png';
  if (y <= 2011) return 'images/CarImage_2009-2011.png';
  if (y <= 2021) return 'images/CarImage_2012-2021.png';
  if (y <= 2025) return 'images/CarImage_2022-2025.png';
  return 'images/CarImage_2026.png';
}

// Markdownテキストをカテゴリ別に分割して各アコーディオン本文に注入する
function injectRegulations(mdText) {
  // ## で始まる見出しを区切りに分割
  const lines = mdText.split('\n');
  const sections = {};
  let currentKey = null;
  let buffer = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentKey !== null) {
        sections[currentKey] = buffer.join('\n');
      }
      currentKey = line.replace(/^## /, '').trim();
      buffer = [];
    } else {
      if (currentKey !== null) buffer.push(line);
    }
  }
  if (currentKey !== null) sections[currentKey] = buffer.join('\n');

  for (const { heading, id } of CATEGORY_MAP) {
    const el = document.getElementById(id);
    if (!el) continue;
    const content = sections[heading] ?? '';
    el.innerHTML = marked.parse(content);
  }
}

// 全アコーディオンを折りたたむ
function collapseAll() {
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.nextElementSibling.classList.remove('open');
  });
}

// 選択年のコンテンツを読み込む
async function loadYear(year) {
  // 画像更新
  const carImg = document.getElementById('car-image');
  carImg.src = getCarImage(year);
  carImg.alt = `${year}年 F1カーイメージ`;

  // 年ラベル更新
  document.getElementById('year-label').textContent = `${year}年`;

  // アコーディオンを折りたたんでコンテンツをクリア
  collapseAll();
  CATEGORY_MAP.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });

  // Markdownを取得して注入
  try {
    const res = await fetch(`regulations/${year}.md`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    injectRegulations(text);
  } catch (e) {
    console.error(`regulations/${year}.md の読み込みに失敗しました:`, e);
  }
}

// アコーディオン開閉
function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      btn.nextElementSibling.classList.toggle('open', !expanded);
    });
  });
}

// 初期化
function init() {
  const select = document.getElementById('year-select');

  initAccordion();

  select.addEventListener('change', () => loadYear(select.value));

  // 初回読み込み（select のデフォルト選択年）
  loadYear(select.value);
}

document.addEventListener('DOMContentLoaded', init);
