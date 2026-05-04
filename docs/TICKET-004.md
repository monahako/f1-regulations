# TICKET-004: 比較表示ページ HTML構造（compare.html）

## 概要

2年度比較表示画面（画面B）のHTML骨格を作成する。JavaScriptロジックはTICKET-005で実装するため、このチケットではマークアップ・構造のみを対象とする。

## 対象ファイル

- `compare.html`（新規作成）

## 依存チケット

- TICKET-001（style.css が必要）

## タスク

### ページ基盤
- [x] `<!DOCTYPE html>` および `<html lang="ja">` を含む基本骨格を作成する
- [x] `<head>` に `meta charset`・`meta viewport`・`title`（「F1 Regulation Compare」）を設定する
- [x] `style.css` を `<link>` で読み込む
- [x] `marked.js`（CDN）を `<script>` で読み込む
- [x] `compare.js` を `<script defer>` で読み込む

### ヘッダー
- [x] サイト名「🏎 F1 Regulation Compare」を表示するヘッダーを実装する
- [x] 「Year A」ドロップダウン `<select id="year-a">` を実装する（2000〜2026年の `<option>` を全年分列挙）
- [x] 「←→」区切り文字を配置する
- [x] 「Year B」ドロップダウン `<select id="year-b">` を実装する（同上）
- [x] 「比較する」ボタン `<button id="compare-btn">` を配置する
- [x] 単年表示ページ（index.html）へのリンクをヘッダーに配置する

### 時系列注記エリア
- [x] 時系列注記 `<p id="timeline-note">` を配置する（初期状態：非表示）
  - 表示文言：`※時系列順（XXXX年 → YYYY年）で表示しています`

### 車体画像エリア
- [x] 左画像（年A）用 `<img id="car-image-a">` を配置する
- [x] 右画像（年B）用 `<img id="car-image-b">` を配置する
- [x] 2枚を横並びにするラッパー要素を配置する
- [x] 各画像の下に年度ラベル表示用要素（`<p id="label-a">` 等）を配置する

### 比較コンテンツエリア
- [x] 8カテゴリ分の比較セクションHTML構造を実装する（以下の構造を8回繰り返す）
  ```html
  <section class="compare-section">
    <h2>① エンジン／パワーユニット</h2>
    <div class="compare-columns">
      <div class="col-a" id="col-engine-a"></div>
      <div class="col-b" id="col-engine-b"></div>
    </div>
    <div class="diff-block" id="diff-engine">
      <h3>🔄 変更点</h3>
      <p class="diff-summary" id="diff-summary-engine"></p>
      <ul class="diff-details" id="diff-details-engine"></ul>
    </div>
  </section>
  ```
- [x] 初期状態ではコンテンツエリア全体を非表示にする（比較ボタン押下後に表示）

## 完了条件

- ブラウザで開いてヘッダー・2つのドロップダウン・比較ボタンが表示される
- JavaScriptなしでもページが白紙にならない
- 比較コンテンツエリアは初期状態で非表示
