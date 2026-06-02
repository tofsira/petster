const CMS_URL = (process.env.CMS_URL ?? "http://localhost:3000").trim().replace(/\/$/, "");

type WhereClause = Record<string, unknown>;

function flattenWhere(prefix: string, obj: unknown, out: Record<string, string>): void {
  if (obj === null || obj === undefined) return;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => flattenWhere(`${prefix}[${i}]`, item, out));
    return;
  }
  if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      flattenWhere(`${prefix}[${k}]`, v, out);
    }
    return;
  }
  out[prefix] = String(obj);
}

function buildQuery(params: {
  where?: WhereClause;
  sort?: string;
  depth?: number;
  limit?: number;
  draft?: boolean;
}): string {
  const flat: Record<string, string> = {};
  if (params.where) flattenWhere("where", params.where, flat);
  if (params.sort) flat["sort"] = params.sort;
  if (params.depth !== undefined) flat["depth"] = String(params.depth);
  if (params.limit !== undefined) flat["limit"] = String(params.limit);
  if (params.draft) flat["draft"] = "true";
  return new URLSearchParams(flat).toString();
}

export type CmsResult<T> = { docs: T[]; totalDocs: number; ok: boolean };

export async function cmsFind<T>(
  collection: string,
  params: {
    where?: WhereClause;
    sort?: string;
    depth?: number;
    limit?: number;
    draft?: boolean;
    token?: string;
  } = {},
): Promise<CmsResult<T>> {
  const qs = buildQuery(params);
  const headers = params.token ? { Authorization: `JWT ${params.token}` } : undefined;
  // Never throw: a CMS outage must not fail the build (returns empty params) or
  // crash a Server Component at runtime. Callers inspect `ok` to tell a real
  // "no content" from a "could not reach the CMS" and render accordingly.
  try {
    const res = await fetch(
      `${CMS_URL}/api/${collection}?${qs}`,
      params.draft
        ? { cache: "no-store", headers }
        : {
            headers,
            next: { revalidate: 60 },
          },
    );
    if (!res.ok) {
      console.error(`CMS ${collection}: HTTP ${res.status}`);
      return { docs: [], totalDocs: 0, ok: false };
    }
    const json = (await res.json()) as { docs?: T[]; totalDocs?: number };
    return { docs: json.docs ?? [], totalDocs: json.totalDocs ?? 0, ok: true };
  } catch (err) {
    console.error(`CMS ${collection}: ${(err as Error).message}`);
    return { docs: [], totalDocs: 0, ok: false };
  }
}

export async function cmsGlobal<T>(slug: string): Promise<T> {
  const res = await fetch(`${CMS_URL}/api/globals/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`CMS globals/${slug}: ${res.status}`);
  return res.json();
}
