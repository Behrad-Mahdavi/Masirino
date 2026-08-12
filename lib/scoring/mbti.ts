export interface MbtiResponse {
  axis: 'EI' | 'SN' | 'TF' | 'JP';
  value: number; // 1 to 5: 1 is pole 1 (E,S,T,J), 5 is pole 2 (I,N,F,P)
}

export interface AxisCertainty {
  dominantLetter: string; // E/I/X
  intensityPct: number;
  pole1Pct: number;
  pole2Pct: number;
  isNeutral: boolean;
}

export interface MbtiResult {
  type: string; // 4-letter type e.g. "ENFP" or "XNFP"
  certainty: Record<string, number>; // Intensity 0 to 100%
  certaintyScores: Record<string, AxisCertainty>;
  scores: Record<string, { raw: number; count: number; midpoint: number }>;
}

export const MBTI_DESCRIPTIONS_FA: Record<string, { title: string; subtitle: string }> = {
  INTJ: { title: 'معمار و استراتژیست', subtitle: 'مفاهیم پیچیده و چشم‌اندازهای بلندمدت' },
  INTP: { title: 'متفکر و منطق‌دان', subtitle: 'تحلیل دقیق نوآورانه و ایده‌پردازی انتزاعی' },
  ENTJ: { title: 'فرمانده و رهبر', subtitle: 'سوق دادن تیم‌ها به سوی اهداف بزرگ' },
  ENTP: { title: 'ایده‌پرداز و چالش‌گر', subtitle: 'کشف فرصت‌های نو و حل خلاقانه مسائل' },
  INFJ: { title: 'مستشار و حامی', subtitle: 'ارزش‌های درونی عمیق و درک همدلانه' },
  INFP: { title: 'میانجی و آرمان‌گرا', subtitle: 'پایبندی به اصالت، خلاقیت و رشد انسانی' },
  ENFJ: { title: 'مربی و الهام‌بخش', subtitle: 'رشد دادن به پتانسیل دیگران و رهبری کاریزماتیک' },
  ENFP: { title: 'پویا و قهرمان', subtitle: 'انرژی فراوان، برقراری ارتباط و شور زندگی' },
  ISTJ: { title: 'بازرس و واقع‌گرا', subtitle: 'نظم، قانون‌مندی، دقت و مسئولیت‌پذیری' },
  ISFJ: { title: 'مدافع و پشتیبان', subtitle: 'دقت صبورانه، وفاداری و خدمت‌رسانی' },
  ESTJ: { title: 'مدیر و مجری', subtitle: 'مدیریت رویه‌ها، ساختاردهی و کارایی' },
  ESFJ: { title: 'سفیر و هماهنگ‌کننده', subtitle: 'ایجاد انسجام تیمی، صمیمیت و پشتیبانی' },
  ISTP: { title: 'مکانیک و چیره دست', subtitle: 'تحلیل عملی پدیده‌ها و حل بحران در عمل' },
  ISFP: { title: 'هنرمند و فردگرا', subtitle: 'زیبایی‌شناسی، انعطاف‌پذیری و حس لحظه' },
  ESTP: { title: 'کارآفرین و عمل‌گرا', subtitle: 'ریسک‌پذیری هوشمندانه، اقدام سریع و انرژی بالا' },
  ESFP: { title: 'بازیگر و انگیزش‌بخش', subtitle: 'شور، اشتیاق و همگامی با جمع' },
};

export function scoreMbti(responses: MbtiResponse[]): MbtiResult {
  const axisTotals: Record<string, { raw: number; count: number }> = {
    EI: { raw: 0, count: 0 },
    SN: { raw: 0, count: 0 },
    TF: { raw: 0, count: 0 },
    JP: { raw: 0, count: 0 },
  };

  for (const r of responses) {
    if (axisTotals[r.axis]) {
      axisTotals[r.axis].raw += r.value;
      axisTotals[r.axis].count += 1;
    }
  }

  const letters: Record<string, [string, string]> = {
    EI: ['E', 'I'],
    SN: ['S', 'N'],
    TF: ['T', 'F'],
    JP: ['J', 'P'],
  };

  let type = '';
  const certainty: Record<string, number> = {};
  const certaintyScores: Record<string, AxisCertainty> = {};
  const scores: Record<string, { raw: number; count: number; midpoint: number }> = {};

  for (const [axis, [first, second]] of Object.entries(letters)) {
    const { raw, count } = axisTotals[axis];
    const safeCount = count > 0 ? count : 1;
    const midpoint = safeCount * 3;
    const maxPossible = safeCount * 5;

    scores[axis] = { raw, count: safeCount, midpoint };

    if (count === 0 || raw === midpoint) {
      // Explicit neutral state (50% / 50%)
      type += 'X';
      certainty[axis] = 0;
      certaintyScores[axis] = {
        dominantLetter: 'X',
        intensityPct: 0,
        pole1Pct: 50,
        pole2Pct: 50,
        isNeutral: true,
      };
    } else {
      const isPoleFirst = raw < midpoint;
      const dominant = isPoleFirst ? first : second;
      type += dominant;

      const diff = Math.abs(raw - midpoint);
      const maxDiff = maxPossible - midpoint;
      const intensityPct = Math.min(100, Math.round((diff / maxDiff) * 100));

      const dominantPolePct = 50 + Math.round(intensityPct / 2);
      const subordinatePolePct = 100 - dominantPolePct;

      const pole1Pct = isPoleFirst ? dominantPolePct : subordinatePolePct;
      const pole2Pct = isPoleFirst ? subordinatePolePct : dominantPolePct;

      certainty[axis] = intensityPct;
      certaintyScores[axis] = {
        dominantLetter: dominant,
        intensityPct,
        pole1Pct,
        pole2Pct,
        isNeutral: false,
      };
    }
  }

  return {
    type,
    certainty,
    certaintyScores,
    scores,
  };
}
