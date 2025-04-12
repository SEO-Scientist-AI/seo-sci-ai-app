import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

// @ts-ignore - D1 binding is injected by Cloudflare Workers
const db = drizzle(process.env.DATABASE as unknown as D1Database, { schema, logger: true });

export { db };
