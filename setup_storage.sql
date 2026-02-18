-- تشغيل هذا الكود في Supabase SQL Editor لحل مشكلة رفع الملفات وتحديث الجدول

-- 1. إنشاء الحاويات (Buckets) للصور والمستندات
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 2. حذف السياسات القديمة (لتجنب التضارب)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- 3. السماح للجميع بمشاهدة الملفات (القراءة)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('portfolio-images', 'documents') );

-- 4. السماح للجميع برفع الملفات (بدون تسجيل دخول لحل مشاكل الصلاحيات)
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id IN ('portfolio-images', 'documents') );

-- 5. السماح للجميع بتعديل الملفات
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id IN ('portfolio-images', 'documents') );

-- 6. السماح للجميع بحذف الملفات
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
TO public
USING ( bucket_id IN ('portfolio-images', 'documents') );

-- 7. تحديث هيكل جدول المشاريع (إضافة الأعمدة المفقودة)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS documents text[] DEFAULT '{}';

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS gallery text[] DEFAULT '{}';

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS long_description text;

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS tech_stack text[] DEFAULT '{}';

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'Web Development';

-- تحديث جدول الخدمات (احتياطياً)
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS icon text;

ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
