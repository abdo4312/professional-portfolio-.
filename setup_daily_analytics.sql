-- SQL to enable DAILY visitor tracking
-- Run this in your Supabase SQL Editor

-- 1. Create the daily_stats table (Safe if exists)
CREATE TABLE IF NOT EXISTS public.daily_stats (
    id SERIAL PRIMARY KEY,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    page_hits INTEGER DEFAULT 0,
    CONSTRAINT unique_date UNIQUE (visit_date)
);

-- 2. Enable RLS (Safe to run multiple times)
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public can insert/update via RPC, Admin can read
-- Drop existing policy first to avoid "policy already exists" error
DROP POLICY IF EXISTS "Enable Read Access for Admin" ON public.daily_stats;

CREATE POLICY "Enable Read Access for Admin" ON public.daily_stats 
FOR SELECT TO authenticated 
USING (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com');

-- 4. Update the increment_hit function to tracking daily stats too
CREATE OR REPLACE FUNCTION increment_hit()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- A. Update Global Stats
  IF NOT EXISTS (SELECT 1 FROM stats LIMIT 1) THEN
    INSERT INTO stats (page_hits, last_updated) VALUES (1, NOW());
  ELSE
    UPDATE stats
    SET page_hits = page_hits + 1,
        last_updated = NOW()
    WHERE id = (SELECT id FROM stats LIMIT 1);
  END IF;

  -- B. Update Daily Stats (Upsert)
  INSERT INTO daily_stats (visit_date, page_hits)
  VALUES (CURRENT_DATE, 1)
  ON CONFLICT (visit_date)
  DO UPDATE SET page_hits = daily_stats.page_hits + 1;

END;
$$;

-- 5. Grant permissions (Safe to run multiple times)
GRANT SELECT ON public.daily_stats TO authenticated;
GRANT EXECUTE ON FUNCTION increment_hit() TO anon, authenticated, service_role;
