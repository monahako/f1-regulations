# TICKET-002: 単年表示ページ HTML構造（index.html）

## 概要

単年レギュレーション表示画面（画面A）のHTML骨格を作成する。JavaScriptロジックはTICKET-003で実装するため、このチケットではマークアップ・構造のみを対象とする。

## 対象ファイル

- `index.html`（新規作成）

## 依存チケット

- TICKET-001（style.css が必要）

## タスク

### ページ基盤
- [x] `<!DOCTYPE html>` および `<html lang="ja">` を含む基本骨格を作成する
- [x] `<head>` に `meta charset`・`meta viewport`・`title` を設定する
- [x] `style.css` を `<link>` で読み込む
- [x] `marked.js`（CDN）を `<script>` で読み込む
- [x] `app.js` を `<script defer>` で読み込む

### ヘッダー
- [x] サイト名「🏎 F1 Regulation History」を表示するヘッダーを実装する
- [x] 年度選択 `<select>` を実装する（2000〜2026年の `<option>` を全年分列挙）
- [x] 比較ページ（compare.html）へのリンクをヘッダーに配置する

### 車体画像エリア
- [x] 選択年の車体画像を表示する `<img>` タグを配置する（`id="car-image"`）
- [x] 年度ラベル表示用の要素を配置する

### アコーディオンセクション
- [x] 8カテゴリ分のアコーディオンHTML構造を実装する（以下の構造を8回繰り返す）
  ```html
  <div class="accordion-item">
    <button class="accordion-header">① エンジン／パワーユニット</button>
    <div class="accordion-body" id="section-engine"></div>
  </div>
  ```
- [x] カテゴリIDと `diffs.json` キーの対応を `data-*` 属性で付与する
- [x] 全アコーディオン初期状態を折りたたみ済みにする（`aria-expanded="false"`）

## 完了条件

- ブラウザで開いてヘッダー・画像エリア・8つのアコーディオン行が表示される
- JavaScriptなしでも静的構造が崩れない
- `app.js` 読み込み前でもページが白紙にならない
