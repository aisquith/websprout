-- Websprout analytics (Cloudflare D1). Cookieless: `visitor` is a daily-rotating salted hash of IP + user agent
-- (the salt is discarded after two days), `email` is set only for signed-in owners. Raw events are kept ~400 days;
-- `daily` aggregates are kept forever. The worker also runs these statements lazily (CREATE ... IF NOT EXISTS),
-- so they are safe to apply more than once. Keep this file identical to WS_SCHEMA in src/45-admin.js.
CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER NOT NULL, day TEXT NOT NULL, type TEXT NOT NULL, visitor TEXT, session TEXT, email TEXT, site_id TEXT, biz_type TEXT, category TEXT, source TEXT, medium TEXT, campaign TEXT, landing TEXT, referrer TEXT, country TEXT, device TEXT, props TEXT);
CREATE INDEX IF NOT EXISTS ev_day_type ON events(day, type);
CREATE INDEX IF NOT EXISTS ev_visitor ON events(visitor, day);
CREATE INDEX IF NOT EXISTS ev_site ON events(site_id, type);
CREATE INDEX IF NOT EXISTS ev_email ON events(email, day) WHERE email IS NOT NULL;
CREATE TABLE IF NOT EXISTS sites (site_id TEXT PRIMARY KEY, created_ts INTEGER, legacy INTEGER DEFAULT 0, email TEXT, biz_type TEXT, category TEXT, look TEXT, google INTEGER DEFAULT 0, shop INTEGER DEFAULT 0, gen_ms INTEGER, source TEXT, medium TEXT, campaign TEXT, landing TEXT, country TEXT, device TEXT, first_edit_ts INTEGER, account_ts INTEGER, published_ts INTEGER, pro_ts INTEGER, slug TEXT);
CREATE INDEX IF NOT EXISTS sites_created ON sites(created_ts);
CREATE INDEX IF NOT EXISTS sites_email ON sites(email) WHERE email IS NOT NULL;
CREATE TABLE IF NOT EXISTS activity (k TEXT NOT NULL, day TEXT NOT NULL, PRIMARY KEY (k, day)) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS daily (metric TEXT NOT NULL, dim TEXT NOT NULL DEFAULT '', day TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (metric, dim, day)) WITHOUT ROWID;
