// カテゴリ定義（app.js と同じ順序・キー）
const CATEGORY_MAP = [
  { heading: '① エンジン／パワーユニット', key: 'engine' },
  { heading: '② 車体／シャシー',           key: 'chassis' },
  { heading: '③ 空力・タイヤ・ホイール',   key: 'aero' },
  { heading: '④ レースルール（Format）',   key: 'race_rules' },
  { heading: '⑤ 安全・健康',               key: 'safety' },
  { heading: '⑥ コスト・開発制限',         key: 'cost' },
  { heading: '⑦ メディア・運営・公平性',   key: 'media' },
  { heading: '⑧ 環境・サステナビリティ',   key: 'environment' },
];

// 年 → 画像ファイル名（app.js と同じロジック）
function getCarImage(year) {
  const y = parseInt(year, 10);
  if (y <= 2008) return 'images/CarImage_2000-2008.png';
  if (y <= 2011) return 'images/CarImage_2009-2011.png';
  if (y <= 2021) return 'images/CarImage_2012-2021.png';
  if (y <= 2025) return 'images/CarImage_2022-2025.png';
  return 'images/CarImage_2026.png';
}

// Markdownテキストをカテゴリ別に分割して返す { heading → 本文テキスト }
function splitMarkdown(mdText) {
  const lines = mdText.split('\n');
  const sections = {};
  let currentKey = null;
  let buffer = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentKey !== null) sections[currentKey] = buffer.join('\n');
      currentKey = line.replace(/^## /, '').trim();
      buffer = [];
    } else {
      if (currentKey !== null) buffer.push(line);
    }
  }
  if (currentKey !== null) sections[currentKey] = buffer.join('\n');
  return sections;
}

// コンテンツをすべてクリアする
function clearContent() {
  CATEGORY_MAP.forEach(({ key }) => {
    const colA = document.getElementById(`col-${key}-a`);
    const colB = document.getElementById(`col-${key}-b`);
    const summary = document.getElementById(`diff-summary-${key}`);
    const details = document.getElementById(`diff-details-${key}`);
    if (colA) colA.innerHTML = '';
    if (colB) colB.innerHTML = '';
    if (summary) summary.textContent = '';
    if (details) details.innerHTML = '';
  });
}

// diffs.json のキャッシュ
let diffsCache = null;

async function loadDiffs() {
  if (diffsCache) return diffsCache;
  const res = await fetch('diffs/diffs.json');
  if (!res.ok) throw new Error(`diffs.json の取得に失敗しました: HTTP ${res.status}`);
  diffsCache = await res.json();
  return diffsCache;
}

// 比較実行
async function runCompare() {
  const selectA = document.getElementById('year-a');
  const selectB = document.getElementById('year-b');

  let yearA = parseInt(selectA.value, 10);
  let yearB = parseInt(selectB.value, 10);

  // 時系列整列（逆順の場合は自動 swap）
  if (yearA > yearB) {
    [yearA, yearB] = [yearB, yearA];
    selectA.value = String(yearA);
    selectB.value = String(yearB);
  }

  // 時系列注記を表示
  const note = document.getElementById('timeline-note');
  note.textContent = `※時系列順（${yearA}年 → ${yearB}年）で表示しています`;
  note.classList.add('visible');

  // コンテンツエリアを表示・前回データをクリア
  document.getElementById('compare-content').classList.add('visible');
  clearContent();

  // 車体画像を更新
  const imgA = document.getElementById('car-image-a');
  const imgB = document.getElementById('car-image-b');
  imgA.src = getCarImage(yearA);
  imgA.alt = `${yearA}年 F1カーイメージ`;
  imgB.src = getCarImage(yearB);
  imgB.alt = `${yearB}年 F1カーイメージ`;
  document.getElementById('label-a').textContent = `${yearA}年`;
  document.getElementById('label-b').textContent = `${yearB}年`;

  // Markdown と diffs.json を並行取得
  try {
    const [mdA, mdB, diffs] = await Promise.all([
      fetch(`regulations/${yearA}.md`).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      }),
      fetch(`regulations/${yearB}.md`).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      }),
      loadDiffs(),
    ]);

    const sectionsA = splitMarkdown(mdA);
    const sectionsB = splitMarkdown(mdB);
    const diffKey = `${yearA}_${yearB}`;
    const diffData = diffs[diffKey] ?? {};

    CATEGORY_MAP.forEach(({ heading, key }) => {
      // 左右のレギュレーション本文
      const colA = document.getElementById(`col-${key}-a`);
      const colB = document.getElementById(`col-${key}-b`);
      if (colA) colA.innerHTML = marked.parse(sectionsA[heading] ?? '');
      if (colB) colB.innerHTML = marked.parse(sectionsB[heading] ?? '');

      // 差分（summary + details）
      const catDiff = diffData[key];
      if (catDiff) {
        const summary = document.getElementById(`diff-summary-${key}`);
        const detailsEl = document.getElementById(`diff-details-${key}`);
        if (summary) summary.textContent = catDiff.summary ?? '';
        if (detailsEl && Array.isArray(catDiff.details)) {
          detailsEl.innerHTML = catDiff.details
            .map(d => `<li>${d}</li>`)
            .join('');
        }
      }
    });
  } catch (e) {
    console.error('比較データの読み込みに失敗しました:', e);
  }
}

// 初期化
function init() {
  document.getElementById('compare-btn').addEventListener('click', runCompare);
}

document.addEventListener('DOMContentLoaded', init);
