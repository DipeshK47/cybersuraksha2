import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(env.DB, { schema });
}

/**
 * D1 binds at most 100 parameters per statement, so `inArray(column, ids)` over
 * a school-sized roster fails. Run `query` over slices of `ids` (leaving room
 * for the query's other parameters) and concatenate the rows. Ordering is per
 * slice; callers that need a global order sort the result.
 */
export async function inChunks<T>(
  ids: readonly number[],
  query: (chunk: number[]) => Promise<T[]>,
): Promise<T[]> {
  const CHUNK = 80;
  const parts: Promise<T[]>[] = [];
  for (let start = 0; start < ids.length; start += CHUNK) {
    parts.push(query(ids.slice(start, start + CHUNK)));
  }
  return (await Promise.all(parts)).flat();
}
