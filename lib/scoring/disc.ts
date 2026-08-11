export interface DiscBlockResponse {
  most: 'D' | 'I' | 'S' | 'C';
  least: 'D' | 'I' | 'S' | 'C';
}

export interface DiscResult {
  scores: Record<string, number>;
  mostCounts: Record<string, number>;
  leastCounts: Record<string, number>;
  profile: string; // e.g. "D", "DC", "ID"
  primaryDimension: string;
  secondaryDimension: string | null;
  gap: number;
}

export const DISC_DIMENSIONS_FA: Record<string, { title: string; desc: string }> = {
  D: { title: 'تسلط‌گر و نتیجه‌گرا (Dominance)', desc: 'تصمیم‌گیری سریع، تمرکز روی چالش‌ها و دستیابی به نتایج' },
  I: { title: 'متقاعدکننده و تاثیرگذار (Influence)', desc: 'ارتباطات قوی، پرانرژی، متقاعدسازی و کار تیمی' },
  S: { title: 'باثبات و پشتیبان (Steadiness)', desc: 'صبور، وفادار، ایجاد ثبات و همکاری در گروه' },
  C: { title: 'دقیق و قطعی (Conscientiousness)', desc: 'تحلیل‌گر، استانداردهای بالا، کیفیت و نظم در ساختار' },
};

const FIXED_ORDER = ['D', 'I', 'S', 'C'];

export function scoreDisc(blocks: DiscBlockResponse[]): DiscResult {
  const scores: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 };
  const mostCounts: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 };
  const leastCounts: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 };

  for (const b of blocks) {
    if (b.most && b.least && b.most === b.least) {
      throw new Error('در هر بلوک DISC، گزینه‌ی «بیشترین شباهت» و «کمترین شباهت» نباید یکسان باشند.');
    }

    if (b.most) {
      mostCounts[b.most] = (mostCounts[b.most] || 0) + 1;
      scores[b.most] = (scores[b.most] || 0) + 1;
    }

    if (b.least) {
      leastCounts[b.least] = (leastCounts[b.least] || 0) + 1;
      scores[b.least] = (scores[b.least] || 0) - 1;
    }
  }

  // Tie-break sorting:
  // 1. Higher score (most_count - least_count)
  // 2. Higher most_count
  // 3. Fixed order: D > I > S > C
  const sortedDimensions = [...FIXED_ORDER].sort((a, b) => {
    const scoreDiff = (scores[b] ?? 0) - (scores[a] ?? 0);
    if (scoreDiff !== 0) return scoreDiff;

    const mostDiff = (mostCounts[b] ?? 0) - (mostCounts[a] ?? 0);
    if (mostDiff !== 0) return mostDiff;

    return FIXED_ORDER.indexOf(a) - FIXED_ORDER.indexOf(b);
  });

  const primaryDimension = sortedDimensions[0];
  const secondaryCandidate = sortedDimensions[1];
  const gap = (scores[primaryDimension] ?? 0) - (scores[secondaryCandidate] ?? 0);

  // If gap <= 2, form hybrid 2-letter profile (e.g. DC or ID)
  const isHybrid = gap <= 2;
  const profile = isHybrid ? `${primaryDimension}${secondaryCandidate}` : primaryDimension;
  const secondaryDimension = isHybrid ? secondaryCandidate : null;

  return {
    scores,
    mostCounts,
    leastCounts,
    profile,
    primaryDimension,
    secondaryDimension,
    gap,
  };
}
