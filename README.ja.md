# WriteCraft

Next.js 15 (Turbopack) + React 19 + TypeScript + shadcn/ui (new-york) + Tailwind CSS v4

> AI を活用した英語ライティング練習ツール — そして Claude Code 駆動開発の実験プロジェクト。

[English](README.md) | [中文](README.zh.md)

---

## 背景

このプロジェクトには 2 つの目標があります：

1. **Claude Code によるプログラミングの実践** — Claude Code を使って要件定義から実装まで完全な開発サイクルを体験する。
2. **Claude Code に適した開発ワークフローの模索** — Spec-Driven Development (SDD) を核としたワークフロー探求：AI にいきなりコードを書かせるのではなく、仕様書 → 計画 → タスク分解 → 実装という順序を踏む。

---

## 機能概要

WriteCraft は英語学習者向けの翻訳練習ツールです。コアフロー：

```
シーン選択 → 内容入力 → 英訳を書く → AI レビュー → フラッシュカード生成 → 間隔反復復習
```

### シーン

| シーン | 用途 |
|--------|------|
| **Interview（面接）** | 職務経歴書・企業背景・質問タイプをコンテキストとした段落レベルの翻訳練習 |
| **Daily（日常）** | 断片的な表現の素早いキャプチャ；コンテキストフィールドは任意入力 |

### モジュール

- **翻訳練習** — 原文を参照しながら英訳を記述；AI 参考訳はデフォルト非表示
- **AI レビュー** — 文単位で比較；文法エラー / 語彙選択 / 文構造の 3 カテゴリに分類、各指摘に理由を付記
- **フラッシュカード生成** — パラグラフモード（1 セッション = 1 カード）またはセンテンスモード（1 文 = 1 カード）；カード裏面にユーザー訳 + AI 修正版 + 重要フィードバック要約を収録
- **間隔反復復習** — SM-2 アルゴリズムによるスケジューリング；想起度 0–5 で評価し次回復習間隔を更新
- **練習履歴** — シーン・日付範囲でフィルタリング、キーワード検索、過去の練習をやり直し

---

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| フレームワーク | Next.js 15 (Turbopack) + React 19 |
| 言語 | TypeScript |
| UI | shadcn/ui (new-york) + Tailwind CSS v4 |
| ORM | Prisma |
| データベース | PostgreSQL |
| パッケージマネージャー | pnpm |

### データモデル

```
TranslationSession   — 1 回の完了した練習セッション
  └── ReviewIssue[]  — AI フィードバック項目（カスケード削除）
  └── Flashcard[]    — SM-2 スケジューリング状態を持つ生成済みカード（カスケード削除）
        └── ReviewLog[] — 各評価イベントの不変ログ（カスケード削除）
```

---

## ローカル開発

```bash
# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env.local
# DATABASE_URL に PostgreSQL 接続文字列を設定

# データベースマイグレーションの実行
pnpm exec prisma migrate dev

# 開発サーバーの起動
pnpm dev
```

---

## 開発ワークフロー（SDD）

すべての機能変更は Spec-Driven Development に従います：

```
/sdd-specify  →  /sdd-plan  →  /sdd-tasks  →  /sdd-implement  →  /sdd-review
```

仕様書は [specs/](specs/) ディレクトリ配下に機能ごとのサブディレクトリで管理（例：`specs/001-database/`）。

---

## API エンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| `GET` | `/api/sessions` | 練習履歴の取得（scene / dateRange / keyword でフィルタリング可） |
| `POST` | `/api/sessions` | 新規セッションレコードの作成 |
| `GET` | `/api/sessions/:id` | 単一セッションとすべてのレビュー項目の取得 |
