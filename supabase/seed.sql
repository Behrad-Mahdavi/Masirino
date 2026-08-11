-- ==========================================
-- رکاد | اسکیمای دیتابیس Supabase (نسخه نهایی بریف اصلاح‌شده)
-- ==========================================

-- ۱. تایپ‌های سفارشی
create type user_role as enum ('student', 'parent', 'coach', 'admin');
create type plan_code as enum ('discover', 'design', 'growth');
create type test_code as enum ('HOLLAND', 'GARDNER', 'MBTI', 'DISC');
create type question_format as enum ('likert5', 'bipolar', 'ipsative_block');
create type response_type as enum ('single', 'most', 'least');

-- ۲. جدول پروفایل‌ها
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'student',
  phone text,
  grade text,
  parent_id uuid references profiles(id),
  created_at timestamptz default now()
);

-- ۳. جدول پلن‌ها و اشتراک‌ها
create table if not exists plans (
  id serial primary key,
  code plan_code unique not null,
  title text not null,
  price bigint not null,
  features jsonb not null
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  plan_id int references plans(id) not null,
  status text not null default 'active',
  purchased_at timestamptz default now(),
  expires_at timestamptz
);

-- ۴. جداول آزمون‌ها و بانک سوالات
create table if not exists tests (
  id serial primary key,
  code test_code unique not null,
  name text not null,
  version int default 1,
  is_active boolean default true
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  test_id int references tests(id) not null,
  dimension text not null,
  text text not null,
  text_secondary text,
  format question_format not null,
  block_group uuid,
  order_index int not null,
  is_active boolean default true
);

create table if not exists question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references questions(id) not null,
  label text not null,
  dimension_weight text not null,
  order_index int not null
);

-- ۵. جداول پاسخ‌ها و نتایج
create table if not exists user_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  question_id uuid references questions(id) not null,
  response_type response_type not null default 'single',
  selected_option_id uuid references question_options(id),
  raw_score int,
  created_at timestamptz default now()
);

create table if not exists user_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  test_id int references tests(id) not null,
  dimension_scores jsonb not null,
  certainty_scores jsonb,
  final_output jsonb not null,
  is_latest boolean default true,
  completed_at timestamptz default now()
);

create table if not exists path_dna (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) unique not null,
  holland_code text,
  top_intelligences jsonb,
  mbti_type text,
  disc_profile text,
  career_clusters jsonb,
  computed_at timestamptz default now()
);

-- ۶. امنیت RLS
alter table profiles enable row level security;
alter table user_responses enable row level security;
alter table user_results enable row level security;
alter table path_dna enable row level security;

-- سیاست‌های دسترسی RLS
drop policy if exists "کاربر فقط پروفایل خودش را می‌بیند" on profiles;
create policy "کاربر فقط پروفایل خودش را می‌بیند" on profiles for select using (auth.uid() = id or auth.uid() = parent_id);

drop policy if exists "کاربر پروفایل خود را ویرایش می‌کند" on profiles;
create policy "کاربر پروفایل خود را ویرایش می‌کند" on profiles for update using (auth.uid() = id);

drop policy if exists "مدیریت پاسخ‌های کاربر" on user_responses;
create policy "مدیریت پاسخ‌های کاربر" on user_responses for all using (auth.uid() = user_id);

drop policy if exists "مشاهده نتایج آزمون کاربر" on user_results;
create policy "مشاهده نتایج آزمون کاربر" on user_results for select using (auth.uid() = user_id);

drop policy if exists "ثبت نتایج آزمون کاربر" on user_results;
create policy "ثبت نتایج آزمون کاربر" on user_results for insert with check (auth.uid() = user_id);

drop policy if exists "مشاهده گزارش Path DNA کاربر" on path_dna;
create policy "مشاهده گزارش Path DNA کاربر" on path_dna for select using (auth.uid() = user_id);

-- ۷. تریگر ساخت خودکار پروفایل هنگام ثبت‌نام Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'دانش‌آموز رکاد'), 'student')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ۸. دیتای اولیه آزمون‌ها و پلن‌ها
insert into tests (id, code, name, version) values
  (1, 'HOLLAND', 'آزمون رغبت‌سنجی شغلی هالند (RIASEC)', 1),
  (2, 'GARDNER', 'آزمون هوش‌های چندگانه گاردنر', 1),
  (3, 'MBTI', 'تحلیل سبک شخصیتی رکاد (دوقطبی MBTI)', 1),
  (4, 'DISC', 'ارزیابی رفتاری DISC', 1)
on conflict (code) do nothing;

insert into plans (code, title, price, features) values
  ('discover', 'پلن ۱ — کشف مسیر', 490000, '["۴ آزمون روان‌سنجی کامل", "گزارش یکپارچه Path DNA", "جلسه مشاوره فردی آنلاین"]'),
  ('design', 'پلن ۲ — طراحی آینده', 990000, '["تمام خدمات پلن ۱", "جلسه تصمیم‌سازی با والدین", "تحلیل بازار کار و مسیر جایگزین", "سند رسمی نقشه راه آینده"]'),
  ('growth', 'پلن ۳ — همراه رشد', 1890000, '["تمام خدمات پلن ۱ و ۲", "برنامه اقدام ۹۰ روزه تعاملی", "کوچینگ مستمر و ارزیابی هفتگی"]')
on conflict (code) do nothing;
