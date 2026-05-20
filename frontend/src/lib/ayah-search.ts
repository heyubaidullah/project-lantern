import { fetchJson } from "@/lib/fetch-json";
import type { AyahSearchResponse } from "@/types/quran";

export async function searchAyahs(query: string): Promise<AyahSearchResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("Missing API base URL.");
  }

  const params = new URLSearchParams({ q: query });

  return fetchJson<AyahSearchResponse>(`${apiBaseUrl}/api/qf/search?${params}`, {
    timeoutMs: 15000,
    retries: 1,
    retryDelayMs: 900,
  });
}
