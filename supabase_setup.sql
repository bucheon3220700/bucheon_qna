-- 1. 공지사항 테이블 생성
CREATE TABLE public.notices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Q&A 질문 테이블 생성
CREATE TABLE public.questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  is_secret boolean DEFAULT false,
  password text,
  author text DEFAULT '익명',
  status text DEFAULT '답변대기',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Q&A 답변 테이블 생성
CREATE TABLE public.answers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. RLS (Row Level Security) 설정 (간단한 구현을 위해 모두 허용 - 실제 서비스 전 보안 정책 적용 필요)
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Allow admin write notices" ON public.notices FOR ALL USING (true);

CREATE POLICY "Allow public read questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Allow public insert questions" ON public.questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin modify questions" ON public.questions FOR ALL USING (true);

CREATE POLICY "Allow public read answers" ON public.answers FOR SELECT USING (true);
CREATE POLICY "Allow admin all answers" ON public.answers FOR ALL USING (true);
