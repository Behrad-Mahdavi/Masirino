export interface RiasecVector {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

export interface TrackDefinition {
  id: string;
  name: string;
  isMainGroup: boolean;
  parentGroup?: string; // "فنی‌وحرفه‌ای — گروه صنعت" or "فنی‌وحرفه‌ای — گروه هنر"
  vector: RiasecVector;
}

export interface BehavioralVector {
  structure: number; // 0 (freeform) to 100 (highly structured/procedural)
  social: number; // 0 (solitary) to 100 (intense interpersonal)
  autonomy: number; // 0 (guided/directed) to 100 (high independence)
  pace: number; // 0 (stable/slow) to 100 (fast-paced/dynamic)
  analytical_vs_valuebased: number; // 0 (value/people-based) to 100 (analytical/logical)
  competitiveness: number; // 0 (cooperative) to 100 (competitive/drive)
}

export interface PathDefinition {
  id: string;
  title: string;
  category: string;
  description: string;
  gardnerWeights: Record<string, number>; // e.g. { interpersonal: 0.9, intrapersonal: 0.7, linguistic: 0.5 }
  compatibleTracks: string[]; // Track names or subfield names, e.g. ["علوم تجربی", "ادبیات و علوم‌انسانی"]
  behavioralVector: BehavioralVector;
  recommendedHighschoolTrack: string;
  universityMajors: string[];
  exampleCareers: string[];
}

// ---------------------------------------------------------
// Section 1.1: High School Track & Subfield RIASEC Vectors
// ---------------------------------------------------------

export class MainGroups {
  static readonly MATH_PHYSICS = 'ریاضی‌فیزیک';
  static readonly EXPERIMENTAL_SCIENCE = 'علوم تجربی';
  static readonly HUMANITIES = 'ادبیات و علوم‌انسانی';
  static readonly TVET_INDUSTRY = 'فنی‌وحرفه‌ای — گروه صنعت';
  static readonly TVET_ARTS = 'فنی‌وحرفه‌ای — گروه هنر';
}

export const MAIN_GROUPS_VECTORS: Record<string, RiasecVector> = {
  [MainGroups.MATH_PHYSICS]: { R: 50, I: 90, A: 20, S: 10, E: 40, C: 70 },
  [MainGroups.EXPERIMENTAL_SCIENCE]: { R: 35, I: 90, A: 15, S: 50, E: 20, C: 65 },
  [MainGroups.HUMANITIES]: { R: 10, I: 60, A: 55, S: 85, E: 45, C: 40 },
  [MainGroups.TVET_INDUSTRY]: { R: 82, I: 52, A: 16, S: 13, E: 19, C: 55 },
  [MainGroups.TVET_ARTS]: { R: 32, I: 29, A: 89, S: 29, E: 30, C: 31 },
};

export const TVET_INDUSTRY_SUBFIELDS: Record<string, RiasecVector> = {
  'شبکه و نرم‌افزار رایانه': { R: 40, I: 80, A: 20, S: 20, E: 20, C: 70 },
  'الکتروتکنیک (برق)': { R: 80, I: 60, A: 10, S: 10, E: 20, C: 55 },
  'الکترونیک': { R: 75, I: 65, A: 15, S: 10, E: 20, C: 55 },
  'مکانیک خودرو': { R: 90, I: 40, A: 10, S: 15, E: 20, C: 50 },
  'تأسیسات مکانیکی': { R: 90, I: 35, A: 10, S: 15, E: 15, C: 55 },
  'ماشین‌ابزار': { R: 90, I: 40, A: 10, S: 10, E: 15, C: 55 },
  'صنایع فلزی': { R: 90, I: 35, A: 15, S: 10, E: 15, C: 50 },
  'نقشه‌کشی معماری و ساختمان': { R: 60, I: 50, A: 50, S: 15, E: 20, C: 60 },
  'صنایع چوب و مبلمان': { R: 80, I: 25, A: 45, S: 15, E: 20, C: 40 },
  'مکاترونیک': { R: 75, I: 70, A: 15, S: 10, E: 20, C: 60 },
  'متالورژی، معدن و صنایع شیمیایی': { R: 70, I: 70, A: 10, S: 10, E: 15, C: 55 },
};

export const TVET_ARTS_SUBFIELDS: Record<string, RiasecVector> = {
  'گرافیک و فتوگرافیک': { R: 30, I: 30, A: 90, S: 25, E: 35, C: 30 },
  'نقاشی': { R: 15, I: 20, A: 95, S: 20, E: 20, C: 20 },
  'نمایش و سینما': { R: 15, I: 25, A: 90, S: 60, E: 45, C: 25 },
  'انیمیشن (پویانمایی)': { R: 25, I: 40, A: 90, S: 20, E: 25, C: 35 },
  'طراحی دوخت (خیاطی)': { R: 55, I: 20, A: 85, S: 25, E: 30, C: 35 },
  'معماری داخلی': { R: 40, I: 45, A: 85, S: 30, E: 30, C: 40 },
  'صنایع دستی و عکاسی': { R: 45, I: 25, A: 85, S: 25, E: 25, C: 30 },
};

// ---------------------------------------------------------
// Section 1.2 & 1.3: Reference Academic / Career Paths Database (35 Paths)
// ---------------------------------------------------------

export const PATH_DATABASE: PathDefinition[] = [
  {
    id: 'software-engineering',
    title: 'مهندسی نرم‌افزار و توسعه‌دهنده سیستم',
    category: 'فناوری اطلاعات و مهندسی',
    description: 'تحلیل، طراحی و پیاده‌سازی سامانه‌های نرم‌افزاری، الگوریتم‌های پیچیده و برنامه‌های هوشمند.',
    gardnerWeights: { logical: 0.9, spatial: 0.5, intrapersonal: 0.4 },
    compatibleTracks: [MainGroups.MATH_PHYSICS, 'شبکه و نرم‌افزار رایانه'],
    behavioralVector: { structure: 65, social: 35, autonomy: 75, pace: 80, analytical_vs_valuebased: 90, competitiveness: 60 },
    recommendedHighschoolTrack: 'ریاضی‌فیزیک یا فنی‌وحرفه‌ای (شبکه و نرم‌افزار رایانه)',
    universityMajors: ['مهندسی کامپیوتر', 'علوم کامپیوتر', 'مهندسی فناوری اطلاعات'],
    exampleCareers: ['توسعه‌دهنده وب/موبایل', 'مهندس بک‌اند', 'معمار نرم‌افزار'],
  },
  {
    id: 'data-science-ai',
    title: 'علوم داده و هوش مصنوعی',
    category: 'فناوری اطلاعات و تحلیل داده',
    description: 'استخراج دانش و الگوهای ارزشمند از داده‌های کلان با مدل‌های ریاضی، یادگیری ماشین و آمار.',
    gardnerWeights: { logical: 0.9, intrapersonal: 0.5 },
    compatibleTracks: [MainGroups.MATH_PHYSICS],
    behavioralVector: { structure: 60, social: 30, autonomy: 80, pace: 85, analytical_vs_valuebased: 95, competitiveness: 65 },
    recommendedHighschoolTrack: 'ریاضی‌فیزیک',
    universityMajors: ['علوم داده', 'مهندسی کامپیوتر (گرایش هوش مصنوعی)', 'آمار کاربردی'],
    exampleCareers: ['دانشمند داده (Data Scientist)', 'مهندس یادگیری ماشین', 'تحلیل‌گر داده‌های کلان'],
  },
  {
    id: 'network-cybersecurity',
    title: 'مهندسی شبکه و امنیت سایبری',
    category: 'فناوری اطلاعات و امنیت',
    description: 'طراحی، پیکربندی و ایمن‌سازی زیرساخت‌های شبکه‌ای و مقابله با حملات سایبری.',
    gardnerWeights: { logical: 0.8, bodily: 0.4 },
    compatibleTracks: [MainGroups.MATH_PHYSICS, 'شبکه و نرم‌افزار رایانه'],
    behavioralVector: { structure: 80, social: 35, autonomy: 65, pace: 75, analytical_vs_valuebased: 85, competitiveness: 55 },
    recommendedHighschoolTrack: 'فنی‌وحرفه‌ای (شبکه و نرم‌افزار رایانه) یا ریاضی‌فیزیک',
    universityMajors: ['مهندسی شبکه', 'امنیت اطلاعات', 'مهندسی فناوری اطلاعات'],
    exampleCareers: ['متخصص امنیت سایبری', 'مدیر ارشد شبکه (SysAdmin)', 'تست‌کننده نفوذ (PenTester)'],
  },
  {
    id: 'architecture',
    title: 'معماری و طراحی فضاهای زیستی',
    category: 'مهندسی و هنر',
    description: 'تلفیق تفکر ریاضی، سازه مهندسی و زیبایی‌شناسی بصری برای طراحی بناها و فضاهای شهری.',
    gardnerWeights: { spatial: 0.9, logical: 0.5, bodily: 0.4 },
    compatibleTracks: [MainGroups.MATH_PHYSICS, 'نقشه‌کشی معماری و ساختمان', 'معماری داخلی'],
    behavioralVector: { structure: 55, social: 50, autonomy: 70, pace: 50, analytical_vs_valuebased: 55, competitiveness: 50 },
    recommendedHighschoolTrack: 'ریاضی‌فیزیک یا فنی‌وحرفه‌ای (نقشه‌کشی معماری و ساختمان / معماری داخلی)',
    universityMajors: ['مهندسی معماری', 'طراحی شهری', 'معماری داخلی'],
    exampleCareers: ['مهندس معمار', 'طراح نمای ساختمان', 'مدیر پروژه ساختمانی'],
  },
  {
    id: 'civil-engineering',
    title: 'مهندسی عمران و سازه',
    category: 'مهندسی و ساخت‌وساز',
    description: 'محاسبه، تحلیل و نظارت بر ساخت برج‌ها، پل‌ها، جاده‌ها و زیرساخت‌های عمرانی کشور.',
    gardnerWeights: { logical: 0.85, spatial: 0.7, bodily: 0.4 },
    compatibleTracks: [MainGroups.MATH_PHYSICS, 'نقشه‌کشی معماری و ساختمان'],
    behavioralVector: { structure: 85, social: 45, autonomy: 55, pace: 60, analytical_vs_valuebased: 90, competitiveness: 60 },
    recommendedHighschoolTrack: 'ریاضی‌فیزیک یا فنی‌وحرفه‌ای (نقشه‌کشی معماری)',
    universityMajors: ['مهندسی عمران', 'مدیریت ساخت', 'مهندسی زلزله'],
    exampleCareers: ['مهندس محاسب سازه', 'سرپرست کارگاه عمرانی', 'مهندس ناظر سازه'],
  },
  {
    id: 'electrical-engineering',
    title: 'مهندسی برق و الکترونیک',
    category: 'مهندسی و سخت‌افزار',
    description: 'طراحی مدارات الکترونیکی، سیستم‌های قدرت، کنترل اتوماتیک و مخابرات پیشرفته.',
    gardnerWeights: { logical: 0.9, spatial: 0.6 },
    compatibleTracks: [MainGroups.MATH_PHYSICS, 'الکتروتکنیک (برق)', 'الکترونیک'],
    behavioralVector: { structure: 80, social: 30, autonomy: 65, pace: 70, analytical_vs_valuebased: 95, competitiveness: 65 },
    recommendedHighschoolTrack: 'ریاضی‌فیزیک یا فنی‌وحرفه‌ای (الکتروتکنیک / الکترونیک)',
    universityMajors: ['مهندسی برق (قدرت، الکترونیک، مخابرات، کنترل)'],
    exampleCareers: ['طراح مدارهای الکترونیکی', 'مهندس سیستم‌های قدرت', 'اتوماسیون صنعتی'],
  },
  {
    id: 'mechatronics-robotics',
    title: 'مهندسی رباتیک و مکاترونیک',
    category: 'مهندسی تلفیقی',
    description: 'ترکیب مهندسی مکانیک، الکترونیک و نرم‌افزار برای ساخت سیستم‌های هوشمند و ربات‌های صنعتی.',
    gardnerWeights: { logical: 0.9, spatial: 0.7, bodily: 0.5 },
    compatibleTracks: [MainGroups.MATH_PHYSICS, 'مکاترونیک', 'الکترونیک'],
    behavioralVector: { structure: 70, social: 35, autonomy: 75, pace: 80, analytical_vs_valuebased: 90, competitiveness: 70 },
    recommendedHighschoolTrack: 'ریاضی‌فیزیک یا فنی‌وحرفه‌ای (مکاترونیک)',
    universityMajors: ['مهندسی مکاترونیک', 'مهندسی رباتیک', 'مهندسی مکانیک'],
    exampleCareers: ['مهندس رباتیک صنعتی', 'طراح سیستم‌های خودمختار', 'متخصص اتوماسیون صنعتی'],
  },
  {
    id: 'medicine',
    title: 'پزشکی عمومی و تخصص‌های بالینی',
    category: 'علوم پزشکی و سلامت',
    description: 'تشخیص، درمان و مراقبت از سلامت بیماران بر پایه علمی دانش زیست‌شناسی و همدلی انسانی.',
    gardnerWeights: { logical: 0.7, interpersonal: 0.6, naturalistic: 0.5 },
    compatibleTracks: [MainGroups.EXPERIMENTAL_SCIENCE],
    behavioralVector: { structure: 90, social: 85, autonomy: 60, pace: 75, analytical_vs_valuebased: 55, competitiveness: 75 },
    recommendedHighschoolTrack: 'علوم تجربی',
    universityMajors: ['پزشکی عمومی', 'تخصص‌های جراحی و داخلی'],
    exampleCareers: ['پزشک عمومی', 'جراح', 'پزشک متخصص'],
  },
  {
    id: 'dentistry',
    title: 'دندان‌پزشکی',
    category: 'علوم پزشکی و سلامت',
    description: 'پیشگیری، تشخیص و درمان بیماری‌های دهان و دندان با ظرافت بالای دست و دانش پزشکی.',
    gardnerWeights: { bodily: 0.8, logical: 0.7, spatial: 0.6, interpersonal: 0.5 },
    compatibleTracks: [MainGroups.EXPERIMENTAL_SCIENCE],
    behavioralVector: { structure: 85, social: 75, autonomy: 75, pace: 60, analytical_vs_valuebased: 60, competitiveness: 70 },
    recommendedHighschoolTrack: 'علوم تجربی',
    universityMajors: ['دندان‌پزشکی عمومی', 'تخصص‌های دندان‌پزشکی (ارتودنسی، ترمیمی)'],
    exampleCareers: ['دندان‌پزشک عمومی', 'متخصص ارتودنسی', 'جراح فک و صورت'],
  },
  {
    id: 'pharmacy',
    title: 'داروسازی و علوم دارویی',
    category: 'علوم پزشکی و شیمی',
    description: 'کشف، ساخت، ارزیابی ترکیبات شیمیایی دارویی و مشاوره دارویی به بیماران و کادر درمان.',
    gardnerWeights: { logical: 0.85, naturalistic: 0.65, intrapersonal: 0.4 },
    compatibleTracks: [MainGroups.EXPERIMENTAL_SCIENCE, 'متالورژی، معدن و صنایع شیمیایی'],
    behavioralVector: { structure: 95, social: 50, autonomy: 60, pace: 50, analytical_vs_valuebased: 80, competitiveness: 60 },
    recommendedHighschoolTrack: 'علوم تجربی',
    universityMajors: ['دکتری حرفه‌ای داروسازی', 'بیوتکنولوژی دارویی'],
    exampleCareers: ['داروساز داروخانه', 'محقق صنایع داروسازی', 'متخصص کنترل کیفیت دارو'],
  },
  {
    id: 'psychology',
    title: 'روان‌شناسی و مشاوره سلامت روان',
    category: 'علوم انسانی و سلامت',
    description: 'تحلیل رفتار، فرآیندهای شناختی و کمک به افراد برای بهبود کیفیت زندگی و سلامت روان.',
    gardnerWeights: { interpersonal: 0.9, intrapersonal: 0.7, linguistic: 0.5 },
    compatibleTracks: [MainGroups.HUMANITIES, MainGroups.EXPERIMENTAL_SCIENCE],
    behavioralVector: { structure: 40, social: 85, autonomy: 65, pace: 35, analytical_vs_valuebased: 35, competitiveness: 25 },
    recommendedHighschoolTrack: 'ادبیات و علوم‌انسانی یا علوم تجربی',
    universityMajors: ['روان‌شناسی بالینی', 'مشاوره خانواده', 'روان‌شناسی شناختی'],
    exampleCareers: ['روان‌شناس بالینی', 'مشاوره خانواده و تحصیلی', 'روان‌سنج'],
  },
  {
    id: 'law-attorney',
    title: 'حقوق، وکالت و داوری',
    category: 'علوم انسانی و حقوقی',
    description: 'تحلیل قوانین، دفاع از حقوق موکلین، تنظیم قراردادهای رسمی و حل نهایی دعاوی قانون.',
    gardnerWeights: { linguistic: 0.9, logical: 0.6, interpersonal: 0.5 },
    compatibleTracks: [MainGroups.HUMANITIES],
    behavioralVector: { structure: 85, social: 75, autonomy: 70, pace: 70, analytical_vs_valuebased: 75, competitiveness: 85 },
    recommendedHighschoolTrack: 'ادبیات و علوم‌انسانی',
    universityMajors: ['حقوق عمومی و خصوصی', 'جرم‌شناسی', 'حقوق بین‌الملل'],
    exampleCareers: ['وکیل دادگستری', 'مشاور حقوقی شرکت‌ها', 'سردفتر اسناد رسمی'],
  },
  {
    id: 'management-business',
    title: 'مدیریت کسب‌وکار و استراتژی (MBA)',
    category: 'مدیریت و تجارت',
    description: 'هدایت سازمان‌ها، برنامه‌ریزی استراتژیک، مدیریت منابع انسانی و توسعه بازارهای تجاری.',
    gardnerWeights: { interpersonal: 0.8, linguistic: 0.7, logical: 0.6 },
    compatibleTracks: [MainGroups.HUMANITIES, MainGroups.MATH_PHYSICS],
    behavioralVector: { structure: 50, social: 80, autonomy: 85, pace: 80, analytical_vs_valuebased: 60, competitiveness: 80 },
    recommendedHighschoolTrack: 'ادبیات و علوم‌انسانی یا ریاضی‌فیزیک',
    universityMajors: ['مدیریت بازرگانی', 'مدیریت صنعتی', 'مدیریت کسب‌وکار (MBA)'],
    exampleCareers: ['مدیر اجرایی (CEO)', 'مدیر توسعه کسب‌وکار', 'مشاور مدیریت'],
  },
  {
    id: 'accounting-finance',
    title: 'حسابداری، مالی و مدیریت سرمایه‌گذاری',
    category: 'مدیریت و مالی',
    description: 'ثبت، طبقه‌بندی، گزارش‌گری مالی و تحلیل سرمایه‌گذاری‌ها بر طبق استانداردهای دقیق حسابداری.',
    gardnerWeights: { logical: 0.85, intrapersonal: 0.4 },
    compatibleTracks: [MainGroups.HUMANITIES, MainGroups.MATH_PHYSICS],
    behavioralVector: { structure: 95, social: 40, autonomy: 40, pace: 50, analytical_vs_valuebased: 90, competitiveness: 50 },
    recommendedHighschoolTrack: 'ادبیات و علوم‌انسانی یا ریاضی‌فیزیک',
    universityMajors: ['حسابداری', 'مدیریت مالی', 'علوم اقتصادی'],
    exampleCareers: ['حسابدار ارشد', 'تحلیل‌گر مالی بازار سرمایه', 'حسابرس رسمی'],
  },
  {
    id: 'teaching-education',
    title: 'آموزش، معلمی و علوم تربیتی',
    category: 'آموزش و یادگیری',
    description: 'انتقال مفاهیم علمی، پروش نسل جدید و تسهیل فرآیند یادگیری در مدارس و موسسات.',
    gardnerWeights: { interpersonal: 0.85, linguistic: 0.75, intrapersonal: 0.5 },
    compatibleTracks: [MainGroups.HUMANITIES, MainGroups.EXPERIMENTAL_SCIENCE, MainGroups.MATH_PHYSICS],
    behavioralVector: { structure: 70, social: 90, autonomy: 50, pace: 40, analytical_vs_valuebased: 30, competitiveness: 20 },
    recommendedHighschoolTrack: 'ادبیات و علوم‌انسانی / علوم تجربی / ریاضی‌فیزیک',
    universityMajors: ['علوم تربیتی', 'آموزش ابتدایی', 'آموزش تخصصی در دانشگاه فرهنگیان'],
    exampleCareers: ['معلم و دبیر رسمی', 'مدرس و برنامه‌ریز درسی', 'کارشناس علوم تربیتی'],
  },
  {
    id: 'graphic-design-uiux',
    title: 'گرافیک، تصویرسازی و طراح UI/UX',
    category: 'هنر و رسانه‌های بصری',
    description: 'خلق ایده‌های بصری، هویت برند، تصویرسازی و طراحی رابط‌های کاربری جذاب نرم‌افزارها.',
    gardnerWeights: { spatial: 0.9, intrapersonal: 0.5, bodily: 0.4 },
    compatibleTracks: [MainGroups.TVET_ARTS, 'گرافیک و فتوگرافیک', 'نقاشی'],
    behavioralVector: { structure: 35, social: 45, autonomy: 80, pace: 70, analytical_vs_valuebased: 40, competitiveness: 50 },
    recommendedHighschoolTrack: 'فنی‌وحرفه‌ای (گرافیک و فتوگرافیک / نقاشی)',
    universityMajors: ['ارتباط تصویری (گرافیک)', 'طراحی صنعتی', 'تصویرسازی'],
    exampleCareers: ['طراح گرافیک ارشد', 'طراح UI/UX', 'تصویرگر کتاب و برند'],
  },
  {
    id: 'animation-motion',
    title: 'انیمیشن، موشن‌گرافیک و جلوه‌های ویژه',
    category: 'هنر و رسانه‌های بصری',
    description: 'پویانمایی کاراکترها، خلق صحنه‌های چندبعدی و تولید ویدیوهای متحرک تبلیغاتی و سینمایی.',
    gardnerWeights: { spatial: 0.9, logical: 0.5, musical: 0.4 },
    compatibleTracks: [MainGroups.TVET_ARTS, 'انیمیشن (پویانمایی)', 'گرافیک و فتوگرافیک'],
    behavioralVector: { structure: 45, social: 35, autonomy: 75, pace: 75, analytical_vs_valuebased: 50, competitiveness: 60 },
    recommendedHighschoolTrack: 'فنی‌وحرفه‌ای (انیمیشن پویانمایی)',
    universityMajors: ['پویانمایی (انیمیشن)', 'هنرهای دیجیتال'],
    exampleCareers: ['انیماتور دو‌بعدی و سه‌بعدی', 'طراح موشن گرافیک', 'متخصص جلوه‌های بصری (VFX)'],
  },
  {
    id: 'cinema-directing',
    title: 'سینما، کارگردانی و فیلم‌سازی',
    category: 'هنرهای نمایشی',
    description: 'هدایت داستان، روایت‌گری بصری، کارگردانی عوامل فیلم و روایت هنری تجربیات انسانی.',
    gardnerWeights: { spatial: 0.85, linguistic: 0.7, interpersonal: 0.6 },
    compatibleTracks: [MainGroups.TVET_ARTS, 'نمایش و سینما'],
    behavioralVector: { structure: 30, social: 75, autonomy: 85, pace: 80, analytical_vs_valuebased: 30, competitiveness: 70 },
    recommendedHighschoolTrack: 'فنی‌وحرفه‌ای (نمایش و سینما)',
    universityMajors: ['سینما (کارگردانی، فیلم‌نامه‌نویسی)', 'هنرهای نمایشی'],
    exampleCareers: ['کارگردان سینما و تیزر', 'فیلم‌نامه‌نویس', 'تدوین‌گر فیلم'],
  },
  {
    id: 'interior-architecture',
    title: 'معماری داخلی و طراحی دکوراسیون',
    category: 'هنر و طراحی فضا',
    description: 'بهینه‌سازی کاربردی، زیبایی‌شناختی و چیدمان فضاهای داخلی مسکونی، اداری و تجاری.',
    gardnerWeights: { spatial: 0.9, bodily: 0.4, interpersonal: 0.5 },
    compatibleTracks: [MainGroups.TVET_ARTS, 'معماری داخلی', 'نقشه‌کشی معماری و ساختمان'],
    behavioralVector: { structure: 50, social: 60, autonomy: 75, pace: 55, analytical_vs_valuebased: 45, competitiveness: 50 },
    recommendedHighschoolTrack: 'فنی‌وحرفه‌ای (معماری داخلی / نقشه‌کشی معماری)',
    universityMajors: ['معماری داخلی', 'طراحی صحنه'],
    exampleCareers: ['طراح دکوراسیون داخلی', 'مشاور چیدمان فضا', 'طراح غرفه‌های نمایشگاهی'],
  },
  {
    id: 'automotive-technician',
    title: 'مکانیک خودرو و عیب‌یابی صنعتی',
    category: 'صنعت و خدمات فنی',
    description: 'تعمیر، عیب‌یابی مکانیکی و الکترونیکی خودروهای سواری و سنگین با ابزارهای کارگاهی.',
    gardnerWeights: { bodily: 0.8, logical: 0.5, spatial: 0.5 },
    compatibleTracks: ['مکانیک خودرو', MainGroups.TVET_INDUSTRY],
    behavioralVector: { structure: 75, social: 30, autonomy: 65, pace: 65, analytical_vs_valuebased: 85, competitiveness: 50 },
    recommendedHighschoolTrack: 'فنی‌وحرفه‌ای (مکانیک خودرو)',
    universityMajors: ['کاردانی و کارشناسی مهندسی مکانیک خودرو'],
    exampleCareers: ['تکنسین عیب‌یاب خودرو', 'مدیر تعمیرگاه تخصصی', 'کارشناس فنی معاینه خودرو'],
  },
  {
    id: 'machining-manufacturing',
    title: 'ماشین‌ابزار و ساخت‌وتولید صنعتی',
    category: 'صنعت و تولید',
    description: 'تراش‌کاری، فرزکاری و تراش قطعات صنعتی دقیق با دستگاه‌های دستی و CNC پیشرفته.',
    gardnerWeights: { bodily: 0.8, spatial: 0.6, logical: 0.5 },
    compatibleTracks: ['ماشین‌ابزار', 'صنایع فلزی', MainGroups.TVET_INDUSTRY],
    behavioralVector: { structure: 85, social: 20, autonomy: 50, pace: 50, analytical_vs_valuebased: 90, competitiveness: 40 },
    recommendedHighschoolTrack: 'فنی‌وحرفه‌ای (ماشین‌ابزار / صنایع فلزی)',
    universityMajors: ['ساخت و تولید', 'قالب‌سازی صنعتی'],
    exampleCareers: ['اپراتور و برنامه‌نویس CNC', 'تکنسین قالب‌سازی', 'سرپرست خط تولید قطعات'],
  },
  {
    id: 'fashion-design',
    title: 'طراحی لباس، دوخت و پوشاک',
    category: 'هنر و پوشاک',
    description: 'طراحی الگوهای خلاقانه پوشاک، انتخاب پارچه، الگوسازی و دوخت سفارشی و صنعتی.',
    gardnerWeights: { spatial: 0.85, bodily: 0.6, intrapersonal: 0.5 },
    compatibleTracks: ['طراحی دوخت (خیاطی)', MainGroups.TVET_ARTS],
    behavioralVector: { structure: 50, social: 45, autonomy: 80, pace: 65, analytical_vs_valuebased: 35, competitiveness: 60 },
    recommendedHighschoolTrack: 'فنی‌وحرفه‌ای (طراحی دوخت)',
    universityMajors: ['طراحی پارچه و لباس', 'مدیریت مزون و پوشاک'],
    exampleCareers: ['طراح لباس', 'الگوساز ارشد', 'مدیر مزون تخصصی'],
  },
  {
    id: 'biotechnology-lab',
    title: 'زیست‌فناوری (بیوتکنولوژی) و علوم آزمایشگاهی',
    category: 'علوم زیستی و تحقیق',
    description: 'تحقیق روی ژنتیک، سلول‌های بنیادی، تولید داروهای زیستی و انجام آزمایش‌های تخصصی تشخیص پزشکی.',
    gardnerWeights: { logical: 0.85, naturalistic: 0.7, intrapersonal: 0.4 },
    compatibleTracks: [MainGroups.EXPERIMENTAL_SCIENCE, 'متالورژی، معدن و صنایع شیمیایی'],
    behavioralVector: { structure: 90, social: 35, autonomy: 60, pace: 50, analytical_vs_valuebased: 90, competitiveness: 55 },
    recommendedHighschoolTrack: 'علوم تجربی یا فنی‌وحرفه‌ای (صنایع شیمیایی)',
    universityMajors: ['زیست‌فناوری (بیوتکنولوژی)', 'علوم آزمایشگاهی', 'میکروبیولوژی'],
    exampleCareers: ['محقق زیست‌فناوری', 'کارشناس آزمایشگاه تشخیص پزشکی', 'متخصص ژنتیک'],
  },
  {
    id: 'veterinary-medicine',
    title: 'دام‌پزشکی و سلامت حیوانات',
    category: 'علوم زیستی و دام‌پزشکی',
    description: 'پیشگیری، بهداشت و درمان بیماری‌های دام، طیور و حیوانات خانگی و نظارت بر سلامت بهداشت غذایی.',
    gardnerWeights: { naturalistic: 0.9, logical: 0.6, bodily: 0.5 },
    compatibleTracks: [MainGroups.EXPERIMENTAL_SCIENCE],
    behavioralVector: { structure: 75, social: 50, autonomy: 70, pace: 60, analytical_vs_valuebased: 70, competitiveness: 45 },
    recommendedHighschoolTrack: 'علوم تجربی',
    universityMajors: ['دکتری حرفه‌ای دام‌پزشکی'],
    exampleCareers: ['دام‌پزشک جراح', 'مشاور سلامت مزارع دام و طیور', 'کلینیک داران حیوانات خانگی'],
  },
  {
    id: 'journalism-media',
    title: 'روزنامه‌نگاری، رسانه و تولید محتوا',
    category: 'علوم انسانی و رسانه',
    description: 'گزارش‌گری، تحلیل رویدادهای اجتماعی، تولید محتوای متنی و مصاحبه‌های خبری در رسانه‌ها.',
    gardnerWeights: { linguistic: 0.9, interpersonal: 0.7, intrapersonal: 0.5 },
    compatibleTracks: [MainGroups.HUMANITIES, 'نمایش و سینما'],
    behavioralVector: { structure: 35, social: 85, autonomy: 75, pace: 85, analytical_vs_valuebased: 45, competitiveness: 65 },
    recommendedHighschoolTrack: 'ادبیات و علوم‌انسانی',
    universityMajors: ['علوم ارتباطات اجتماعی', 'روزنامه‌نگاری', 'روابط عمومی'],
    exampleCareers: ['خبرنگار تحلیلی', 'سردبیر محتوا', 'مدیر روابط عمومی سازمان'],
  },
  {
    id: 'translation-linguistics',
    title: 'مترجمی زبان‌های خارجی و زبان‌شناسی',
    category: 'زبان و ارتباطات بین‌الملل',
    description: 'ترجمه هم‌زمان، تولید محتوای بین‌المللی، تحلیل ساختار زبان‌ها و تسهیل ارتباطات تجاری و علمی.',
    gardnerWeights: { linguistic: 0.95, intrapersonal: 0.5, interpersonal: 0.5 },
    compatibleTracks: [MainGroups.HUMANITIES],
    behavioralVector: { structure: 60, social: 50, autonomy: 70, pace: 45, analytical_vs_valuebased: 60, competitiveness: 40 },
    recommendedHighschoolTrack: 'ادبیات و علوم‌انسانی (یا زبان‌های خارجی)',
    universityMajors: ['مترجمی زبان انگلیسی/فرانسه/آلمانی', 'زبان‌شناسی کاربردی'],
    exampleCareers: ['مترجم هم‌زمان متون و همایش‌ها', 'کارشناس بازرگانی خارجی', 'مدرس زبان تخصصی'],
  },
  {
    id: 'wood-furniture-design',
    title: 'صنایع چوب، مبل‌سازی و طراحی دکوراسیون چوبی',
    category: 'صنعت و صنایع دستی',
    description: 'ساخت سازه‌های چوبی دقیق، کابینت‌سازی پیشرفته، ساخت مبلمان و اجرای ایده‌های نجاری مدرن.',
    gardnerWeights: { bodily: 0.8, spatial: 0.7, logical: 0.4 },
    compatibleTracks: ['صنایع چوب و مبلمان', MainGroups.TVET_INDUSTRY],
    behavioralVector: { structure: 70, social: 30, autonomy: 75, pace: 45, analytical_vs_valuebased: 70, competitiveness: 40 },
    recommendedHighschoolTrack: 'فنی‌وحرفه‌ای (صنایع چوب و مبلمان)',
    universityMajors: ['مهندسی چوب و کاغذ', 'طراحی مبلمان'],
    exampleCareers: ['استادکار صنایع چوبی', 'مدیر کارگاه مبلمان', 'طراح کابینت و دکوراسیون چوبی'],
  },
  {
    id: 'photography-visuals',
    title: 'عکاسی تبلیغاتی، صنعتی و هنری',
    category: 'هنر و تصویربرداری',
    description: 'ثبت لحظات، نورپردازی تخصصی اتلیه‌ای و صنعتی، ادیت نرم‌افزاری و خلق فریم‌های هنری.',
    gardnerWeights: { spatial: 0.9, intrapersonal: 0.6, bodily: 0.4 },
    compatibleTracks: ['صنایع دستی و عکاسی', 'گرافیک و فتوگرافیک', MainGroups.TVET_ARTS],
    behavioralVector: { structure: 40, social: 60, autonomy: 85, pace: 65, analytical_vs_valuebased: 30, competitiveness: 55 },
    recommendedHighschoolTrack: 'فنی‌وحرفه‌ای (عکاسی / فتوگرافیک)',
    universityMajors: ['عکاسی صنعتی و تبلیغاتی', 'هنرهای بصری'],
    exampleCareers: ['عکاس صنعتی و مد', 'مدیر آتلیه عکس', 'ادیتور و ویرایشگر تصویر'],
  },
];

// ---------------------------------------------------------
// Section 1.4 & 1.5: Behavioral Ideal Target Mappings for MBTI & DISC
// ---------------------------------------------------------

export const MBTI_BEHAVIORAL_TARGETS: Record<string, { dimension: keyof BehavioralVector; target: number }> = {
  J: { dimension: 'structure', target: 80 },
  P: { dimension: 'structure', target: 20 },
  E: { dimension: 'social', target: 80 },
  I: { dimension: 'social', target: 20 },
  T: { dimension: 'analytical_vs_valuebased', target: 80 },
  F: { dimension: 'analytical_vs_valuebased', target: 20 },
  N: { dimension: 'pace', target: 80 },
  S: { dimension: 'pace', target: 20 },
};

export const DISC_BEHAVIORAL_TARGETS: Record<string, { dimension: keyof BehavioralVector; target: number }[]> = {
  D: [
    { dimension: 'autonomy', target: 80 },
    { dimension: 'competitiveness', target: 80 },
  ],
  I: [{ dimension: 'social', target: 80 }],
  S: [
    { dimension: 'structure', target: 70 },
    { dimension: 'pace', target: 30 },
  ],
  C: [
    { dimension: 'structure', target: 85 },
    { dimension: 'analytical_vs_valuebased', target: 85 },
  ],
};
