const AMAZON_SEARCH_BASE = "https://www.amazon.co.jp/s";
const RAKUTEN_SEARCH_BASE = "https://search.rakuten.co.jp/search/mall";
const RAKUTEN_AFFILIATE_BASE = "https://hb.afl.rakuten.co.jp/hgc";

/**
 * 商品名で検索結果ページへ誘導するリンクを生成する。
 * 特定商品APIの審査を待たずに使える「検索リンク方式」。
 * AMAZON_ASSOCIATE_TAG が未設定の場合は素の検索リンクを返す。
 */
export function buildAmazonSearchUrl(query: string): string {
  const params = new URLSearchParams({ k: query });
  const tag = process.env.AMAZON_ASSOCIATE_TAG;
  if (tag) params.set("tag", tag);
  return `${AMAZON_SEARCH_BASE}?${params.toString()}`;
}

/**
 * 楽天市場の検索結果ページへのリンクを生成する。
 * RAKUTEN_AFFILIATE_ID が設定されている場合は、楽天が提供する
 * 汎用リンク変換フォーマット（hb.afl.rakuten.co.jp/hgc/{id}/?pc=...）でラップする。
 * 未設定の場合は素の検索リンクを返す。
 */
export function buildRakutenSearchUrl(query: string): string {
  const searchUrl = `${RAKUTEN_SEARCH_BASE}/${encodeURIComponent(query)}/`;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;
  if (!affiliateId) return searchUrl;
  return `${RAKUTEN_AFFILIATE_BASE}/${affiliateId}/?pc=${encodeURIComponent(searchUrl)}`;
}
