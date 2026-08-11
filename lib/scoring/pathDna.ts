import { HollandResult } from './holland';
import { GardnerResult } from './gardner';
import { MbtiResult } from './mbti';
import { DiscResult } from './disc';

export interface PathDnaProfile {
  hollandCode: string;
  topIntelligences: string[];
  mbtiType: string;
  discProfile: string;
  careerClusters: {
    title: string;
    description: string;
    matchScore: number;
    suitableRoles: string[];
  }[];
  computedAt: string;
}

export function computePathDna(
  holland: HollandResult,
  gardner: GardnerResult,
  mbti: MbtiResult,
  disc: DiscResult
): PathDnaProfile {
  // Synthesize career clusters based on Path DNA combinations
  const careerClusters = generateCareerClusters(holland.code, mbti.type, disc.profile, gardner.topIntelligences);

  return {
    hollandCode: holland.code,
    topIntelligences: gardner.topIntelligences,
    mbtiType: mbti.type,
    discProfile: disc.profile,
    careerClusters,
    computedAt: new Date().toISOString(),
  };
}

function generateCareerClusters(
  hollandCode: string,
  mbtiType: string,
  discProfile: string,
  intelligences: string[]
) {
  const clusters = [];

  // Logic to synthesize recommendations based on holistic DNA
  const isTechOrScience = hollandCode.includes('I') || mbtiType.includes('NT');
  const isArtOrDesign = hollandCode.includes('A') || mbtiType.includes('NF');
  const isBusinessOrLeader = hollandCode.includes('E') || discProfile.includes('D') || discProfile.includes('I');
  const isSocialOrTeaching = hollandCode.includes('S') || intelligences.includes('interpersonal');

  if (isTechOrScience) {
    clusters.push({
      title: 'فناوری اطلاعات، هوش مصنوعی و مهندسی سیستم‌ها',
      description: 'مناسب افراد با رویکرد تحلیلی، مسئله‌محور و علاقه به معماری ساختارهای پیچیده نرم‌افزاری و داده.',
      matchScore: 94,
      suitableRoles: ['مهندس نرم‌افزار / هوش مصنوعی', 'دانشمند داده', 'معمار سیستم‌های ابری', 'تحلیل‌گر امنیت شبکه'],
    });
  }

  if (isBusinessOrLeader) {
    clusters.push({
      title: 'مدیریت کسب‌وکار، استراتژی و رهبری سازمانی',
      description: 'ترکیب هوش متهورانه و نفوذ رفتاری جهت هدایت تیم‌ها، مذاکره تجاری و توسعه بازار.',
      matchScore: 89,
      suitableRoles: ['مدیر محصول', 'استراتژیست کسب‌وکار', 'مدیر توسعه بازار', 'کارآفرین / رهبر استارتاپ'],
    });
  }

  if (isArtOrDesign) {
    clusters.push({
      title: 'طراحی، تجربه کاربری (UX) و رسانه‌های خلاق',
      description: 'حوزه نوآورانه نیازمند تجسم فضایی، خلاقیت دیداری و درک رفتار کاربر.',
      matchScore: 86,
      suitableRoles: ['طراح تجربه و رابط کاربری (UI/UX)', 'مدیر هنری', 'طراح محصول دیجیتال', 'کارگردان خلاق'],
    });
  }

  if (isSocialOrTeaching || clusters.length < 3) {
    clusters.push({
      title: 'مشاوره، توسعه سرمایه انسانی و آموزش تخصصی',
      description: 'مسیر مبتنی بر تعامل اجتماعی، هوش میان‌فردی بالا و هدایت انسان‌ها به سمت رشد.',
      matchScore: 82,
      suitableRoles: ['کوچ / مشاور توسعه فردی', 'مدیر منابع انسانی', 'مدرس و تسهیل‌گر دوره‌ها', 'متخصص تجربه مشتری'],
    });
  }

  return clusters;
}
