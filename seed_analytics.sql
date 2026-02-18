-- Insert dummy data for the last 7 days to test the chart
-- Run this in Supabase SQL Editor

INSERT INTO daily_stats (visit_date, page_hits)
VALUES 
  (CURRENT_DATE - INTERVAL '6 days', 12),
  (CURRENT_DATE - INTERVAL '5 days', 34),
  (CURRENT_DATE - INTERVAL '4 days', 22),
  (CURRENT_DATE - INTERVAL '3 days', 45),
  (CURRENT_DATE - INTERVAL '2 days', 18),
  (CURRENT_DATE - INTERVAL '1 day', 56),
  (CURRENT_DATE, 8)
ON CONFLICT (visit_date) 
DO UPDATE SET page_hits = EXCLUDED.page_hits;
