-- 1. تفعيل نظام الحماية (RLS) على جميع الجداول
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- تأمين جدول المستخدمين القديم (إخفاؤه تماماً)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. تنظيف السياسات القديمة
DROP POLICY IF EXISTS "Enable Read Access for All" ON public.projects;
DROP POLICY IF EXISTS "Enable Read Access for All" ON public.skills;
DROP POLICY IF EXISTS "Enable Read Access for All" ON public.experience;
DROP POLICY IF EXISTS "Enable Read Access for All" ON public.education;
DROP POLICY IF EXISTS "Enable Read Access for All" ON public.services;
DROP POLICY IF EXISTS "Enable Read Access for All" ON public.about;
DROP POLICY IF EXISTS "Enable Read Access for All" ON public.settings;
DROP POLICY IF EXISTS "Enable Read Access for All" ON public.stats;

DROP POLICY IF EXISTS "Enable All Access for Admin" ON public.projects;
DROP POLICY IF EXISTS "Enable All Access for Admin" ON public.skills;
DROP POLICY IF EXISTS "Enable All Access for Admin" ON public.experience;
DROP POLICY IF EXISTS "Enable All Access for Admin" ON public.education;
DROP POLICY IF EXISTS "Enable All Access for Admin" ON public.services;
DROP POLICY IF EXISTS "Enable All Access for Admin" ON public.about;
DROP POLICY IF EXISTS "Enable All Access for Admin" ON public.settings;
DROP POLICY IF EXISTS "Enable All Access for Admin" ON public.stats;

DROP POLICY IF EXISTS "Allow Public to Send Messages" ON public.contacts;
DROP POLICY IF EXISTS "Allow Admin to Manage Messages" ON public.contacts;

-- 3. سياسات القراءة للعامة (الزوار) - يسمح للجميع بالقراءة
CREATE POLICY "Enable Read Access for All" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Enable Read Access for All" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Enable Read Access for All" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Enable Read Access for All" ON public.education FOR SELECT USING (true);
CREATE POLICY "Enable Read Access for All" ON public.services FOR SELECT USING (true);
CREATE POLICY "Enable Read Access for All" ON public.about FOR SELECT USING (true);
CREATE POLICY "Enable Read Access for All" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Enable Read Access for All" ON public.stats FOR SELECT USING (true);

-- 4. سياسات الإدارة للمسؤول (Admin) - حصرياً للبريد الإلكتروني للمسؤول
-- هذا يحل مشكلة "RLS Policy Always True" بتحديد مستخدم بعينه
-- IMPORTANT: Replace 'abdorhamnk134@gmail.com' with your actual Supabase Auth email
CREATE POLICY "Enable All Access for Admin" ON public.projects FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com');
CREATE POLICY "Enable All Access for Admin" ON public.skills FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com');
CREATE POLICY "Enable All Access for Admin" ON public.experience FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com');
CREATE POLICY "Enable All Access for Admin" ON public.education FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com');
CREATE POLICY "Enable All Access for Admin" ON public.services FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com');
CREATE POLICY "Enable All Access for Admin" ON public.about FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com');
CREATE POLICY "Enable All Access for Admin" ON public.settings FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com');
CREATE POLICY "Enable All Access for Admin" ON public.stats FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com');

-- 5. سياسات خاصة لنموذج التواصل (Contacts)
-- السماح لأي شخص بإرسال رسالة (يجب أن يكون البريد غير فارغ)
CREATE POLICY "Allow Public to Send Messages" ON public.contacts FOR INSERT TO anon, authenticated WITH CHECK (email IS NOT NULL AND length(email) > 3);

-- السماح للمسؤول فقط بقراءة وإدارة الرسائل
CREATE POLICY "Allow Admin to Manage Messages" ON public.contacts FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'abdorhamnk134@gmail.com');
