# サッカースパイクNavi

Next.js 14 (App Router) + Tailwind CSS で作る、全年代対応のサッカースパイク紹介・アフィリエイトサイト。

## セットアップ

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## ディレクトリ構成

```
app/
  page.tsx                       # トップ
  age/[category]/                # 年代別 (elementary/junior/high/adult)
  ranking/overall/               # 総合ランキング
  ranking/price/[range]/         # 価格帯別 (under5000/around10000/premium)
  ranking/ground/[type]/         # グラウンド別 (fg/ag/tf/hg)
  ranking/brand/[brand]/         # ブランド別
  spikes/[slug]/                 # 個別レビュー (Product JSON-LD)
  compare/[slug]/                # 2モデル比較 (slugA-vs-slugB)
  blog/[slug]/                   # ブログ記事
  api/og/                        # OGP画像 (1200x630, @vercel/og)
  sitemap.ts / robots.ts         # SEO
components/                      # Header / Footer / SpikeCard / AffiliateButtons / Breadcrumbs
lib/                             # types / data / seo / affiliate
data/spikes.json                 # スパイク情報 (サンプル5件)
data/rankings.json               # ランキング (サンプル2種)
data/schema.md                   # データスキーマ定義
scripts/post-sns.ts              # X / Instagram 自動投稿
.github/workflows/post-sns.yml   # GitHub Actions
```

## アフィリエイト

各スパイクは Amazon / 楽天 / Yahoo / KAMO の4ストアにリンクできます。`data/spikes.json` の `affiliate` オブジェクトにURLを入れてください。

## SNS自動投稿

- `scripts/post-sns.ts` が日次ローテーションでスパイクを選び、X と Instagram に投稿します。
- OGP画像は `/api/og?title=...` から取得 (1200x630)。
- GitHub Secrets に `X_API_KEY` / `X_API_SECRET` / `X_ACCESS_TOKEN` / `X_ACCESS_SECRET` / `INSTAGRAM_ACCESS_TOKEN` / `INSTAGRAM_BUSINESS_ID` を登録してください。
- main へのpush または `workflow_dispatch` で発火します。

## SEO

- 全ページ `generateStaticParams` で静的生成
- メタデータ・OGP・Twitter Card は `lib/seo.ts` で集約生成
- スパイク詳細は Product / BreadcrumbList JSON-LD を出力
- `/sitemap.xml` / `/robots.txt` 自動生成
