-- SQL to enable page view tracking
-- Run this in your Supabase SQL Editor

-- 1. Create the stats table if it doesn't exist (it should already exist from secure_database.sql)
CREATE TABLE IF NOT EXISTS public.stats (
    id SERIAL PRIMARY KEY,
    page_hits INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

-- 3. Create the increment_hit function (RPC)
-- This function allows anonymous users to increment the counter safely
CREATE OR REPLACE FUNCTION increment_hit()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if a row exists, if not create one
  IF NOT EXISTS (SELECT 1 FROM stats LIMIT 1) THEN
    INSERT INTO stats (page_hits, last_updated) VALUES (1, NOW());
  ELSE
    UPDATE stats
    SET page_hits = page_hits + 1,
        last_updated = NOW()
    WHERE id = (SELECT id FROM stats LIMIT 1);
  END IF;
END;
$$;

-- 4. Grant execute permission to everyone (public/anon)
GRANT EXECUTE ON FUNCTION increment_hit() TO anon, authenticated, service_role;

-- 5. Ensure the admin can read the stats (already covered by policies, but good to double check)
-- The policy "Enable Read Access for All" in secure_database.sql covers this.
