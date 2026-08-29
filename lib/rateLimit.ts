const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

const requestLog = new Map<string, number[]>();

/**
 * サーバーレス関数のメモリ上で完結する簡易レート制限。
 * インスタンスの再起動やスケールアウトでリセットされるため厳密ではないが、
 * 単純な連続叩き・想定外の大量アクセスに対する簡易的な歯止めとして機能する。
 */
export function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(identifier) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(identifier, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(identifier, recent);
  return false;
}

export function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}
