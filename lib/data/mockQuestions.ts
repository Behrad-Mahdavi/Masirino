export interface QuestionLikert {
  id: string;
  testCode: 'HOLLAND' | 'GARDNER';
  dimension: string;
  text: string;
}

export interface QuestionBipolar {
  id: string;
  testCode: 'MBTI';
  axis: 'EI' | 'SN' | 'TF' | 'JP';
  leftText: string;
  rightText: string;
}

export interface DiscOption {
  id: string;
  dimension: 'D' | 'I' | 'S' | 'C';
  label: string;
}

export interface QuestionIpsative {
  id: string;
  testCode: 'DISC';
  options: DiscOption[];
}

export const HOLLAND_QUESTIONS: QuestionLikert[] = [
  // Realistic (R)
  { id: 'h-r1', testCode: 'HOLLAND', dimension: 'R', text: 'تعمیر یا ساختن وسایل و قطعات فنی با دست‌هایم برایم لذت‌بخش است.' },
  { id: 'h-r2', testCode: 'HOLLAND', dimension: 'R', text: 'ترجیح می‌دهم به‌جای پشت‌میز نشینی، در محیط کارگاهی یا فضای باز فعالیت کنم.' },
  { id: 'h-r3', testCode: 'HOLLAND', dimension: 'R', text: 'کار با ابزار، ماشین‌آلات و تجهیزات فنی برایم جذابیت دارد.' },
  { id: 'h-r4', testCode: 'HOLLAND', dimension: 'R', text: 'دوست دارم چگونگی کارکرد مکانیکی قطعات مختلف را در عمل آزمایش کنم.' },
  { id: 'h-r5', testCode: 'HOLLAND', dimension: 'R', text: 'در فعالیت‌های عملی و فیزیکی عملکرد بهتری نسبت به کارهای صرفاً کلامی دارم.' },
  { id: 'h-r6', testCode: 'HOLLAND', dimension: 'R', text: 'راه‌اندازی و مونتاژ دستگاه‌های جدید برایم سرگرم‌کننده است.' },

  // Investigative (I)
  { id: 'h-i1', testCode: 'HOLLAND', dimension: 'I', text: 'دوست دارم دلیل و علل علمی پشت پدیده‌های پیچیده را کشف کنم.' },
  { id: 'h-i2', testCode: 'HOLLAND', dimension: 'I', text: 'حل مسائل عمیق ریاضی، منطقی و فکری برایم هیجان‌انگیز است.' },
  { id: 'h-i3', testCode: 'HOLLAND', dimension: 'I', text: 'می‌توانم ساعت‌ها بدون خستگی درباره یک موضوع علمی یا تخصصی تحقیق کنم.' },
  { id: 'h-i4', testCode: 'HOLLAND', dimension: 'I', text: 'تحلیل داده‌ها و یافتن الگوهای پنهان در اطلاعات جذابیت زیادی برایم دارد.' },
  { id: 'h-i5', testCode: 'HOLLAND', dimension: 'I', text: 'مطالعه مقالات علمی و پژوهشی بخشی از علایق همیشگی من است.' },
  { id: 'h-i6', testCode: 'HOLLAND', dimension: 'I', text: 'علاقمندم با روش‌های آزمایشگاهی و فرضیه‌سازی به پاسخ سوالاتم برسم.' },

  // Artistic (A)
  { id: 'h-a1', testCode: 'HOLLAND', dimension: 'A', text: 'بیان احساسات و ایده‌هایم از طریق طراحی، هنر، نوشتن یا موسیقی برایم ارزشمند است.' },
  { id: 'h-a2', testCode: 'HOLLAND', dimension: 'A', text: 'از قوانین سخت و چارچوب‌های تکراری و یکنواخت خسته می‌شوم.' },
  { id: 'h-a3', testCode: 'HOLLAND', dimension: 'A', text: 'دوست دارم کارهایی خلق کنم که متمایز، نوآورانه و حاصل خلاقیت شخصی‌ام باشد.' },
  { id: 'h-a4', testCode: 'HOLLAND', dimension: 'A', text: 'به زیبایی‌شناسی، ترکیب رنگ‌ها و طراحی‌های تجریدی اهمیت زیادی می‌دهم.' },
  { id: 'h-a5', testCode: 'HOLLAND', dimension: 'A', text: 'ترجیح می‌دهم آزادی عمل کاملی در سبک کاری و بیان هنری خود داشته باشم.' },
  { id: 'h-a6', testCode: 'HOLLAND', dimension: 'A', text: 'داستان‌پردازی و خلق ایده‌های بصری جدید حس شادابی به من می‌دهد.' },

  // Social (S)
  { id: 'h-s1', testCode: 'HOLLAND', dimension: 'S', text: 'راهنمایی و آموزش دادن مفاهیم به دیگران حس رضایت عمیقی به من می‌دهد.' },
  { id: 'h-s2', testCode: 'HOLLAND', dimension: 'S', text: 'کمک به حل دغدغه‌ها و مشکلات شخصی یا تحصیلی اطرافیان برایم اولویت دارد.' },
  { id: 'h-s3', testCode: 'HOLLAND', dimension: 'S', text: 'ترجیح می‌دهم در محیط‌های تیمی و در ارتباط مستقیم با انسان‌ها کار کنم.' },
  { id: 'h-s4', testCode: 'HOLLAND', dimension: 'S', text: 'شنونده صبور و همدلی برای رازها و مشکلات دوستانم هستم.' },
  { id: 'h-s5', testCode: 'HOLLAND', dimension: 'S', text: 'فعالیت‌های داوطلبانه و عام‌المنفعه بخش مهمی از روحیه من است.' },
  { id: 'h-s6', testCode: 'HOLLAND', dimension: 'S', text: 'توانایی بالایی در ایجاد صمیمیت و فضای دوستانه در گروه‌ها دارم.' },

  // Enterprising (E)
  { id: 'h-e1', testCode: 'HOLLAND', dimension: 'E', text: 'متقاعد کردن دیگران برای پذیرش ایده‌ها و پروژه‌هایم برایم آسان است.' },
  { id: 'h-e2', testCode: 'HOLLAND', dimension: 'E', text: 'دوست دارم مسئولیت رهبری و مدیریت پروژه را در یک گروه بر عهده بگیرم.' },
  { id: 'h-e3', testCode: 'HOLLAND', dimension: 'E', text: 'ریسک کردن برای به دست آوردن فرصت‌های بزرگ‌تر تجاری من را نگران نمی‌کند.' },
  { id: 'h-e4', testCode: 'HOLLAND', dimension: 'E', text: 'راه‌اندازی کسب‌وکار و مذاکره با افراد مختلف هیجان بالایی برایم دارد.' },
  { id: 'h-e5', testCode: 'HOLLAND', dimension: 'E', text: 'همیشه به دنبال فرصت‌های جدید برای رشد و توسعه در موقعیت‌های مختلف هستم.' },
  { id: 'h-e6', testCode: 'HOLLAND', dimension: 'E', text: 'توانایی هدایت بحث‌ها و تاثیرگذاری بر تصمیم‌گیری جمعی را دارم.' },

  // Conventional (C)
  { id: 'h-c1', testCode: 'HOLLAND', dimension: 'C', text: 'کار با اعداد، جدول‌ها، گزارش‌های مالی و داده‌های منظم را دوست دارم.' },
  { id: 'h-c2', testCode: 'HOLLAND', dimension: 'C', text: 'داشتن رویه‌ها و دستورالعمل‌های شفاف و مشخص حس امنیت شغلی به من می‌دهد.' },
  { id: 'h-c3', testCode: 'HOLLAND', dimension: 'C', text: 'دقت بالا در بایگانی، نظم‌دهی و سازماندهی مستندات از نقاط قوت من است.' },
  { id: 'h-c4', testCode: 'HOLLAND', dimension: 'C', text: 'ترجیح می‌دهم وظایفم بر اساس استانداردهای اداری دقیق تعریف شده باشد.' },
  { id: 'h-c5', testCode: 'HOLLAND', dimension: 'C', text: 'بررسی جزئیات ریز و اطمینان از عدم وجود خطا در آمارها برایم مهم است.' },
  { id: 'h-c6', testCode: 'HOLLAND', dimension: 'C', text: 'برنامه‌ریزی دقیق زمان‌بندی و پایبندی به قوانین ساختاری را ارج می‌نهم.' },
];

export const GARDNER_QUESTIONS: QuestionLikert[] = [
  // Linguistic
  { id: 'g-l1', testCode: 'GARDNER', dimension: 'linguistic', text: 'توضیح دادن موضوعات با کلمات دقیق برایم راحت‌تر از سایر روش‌هاست.' },
  { id: 'g-l2', testCode: 'GARDNER', dimension: 'linguistic', text: 'مطالعه کتاب، داستان‌نویسی و یادگیری واژگان جدید برایم لذت‌بخش است.' },
  { id: 'g-l3', testCode: 'GARDNER', dimension: 'linguistic', text: 'به بازی‌های کلماتی، مشاعره و حل جدول علاقه دارم.' },
  { id: 'g-l4', testCode: 'GARDNER', dimension: 'linguistic', text: 'توانایی خوبی در سخنوری و متقاعد کردن دیگران با گفتگو دارم.' },
  { id: 'g-l5', testCode: 'GARDNER', dimension: 'linguistic', text: 'ریتم و معنای دقیق کلمات در نوشته‌ها را به‌خوبی درک می‌کنم.' },

  // Logical-Mathematical
  { id: 'g-m1', testCode: 'GARDNER', dimension: 'logical', text: 'حل کردن معماهای فکری، محاسبات عددی و پازل‌های منطقی برایم جذاب است.' },
  { id: 'g-m2', testCode: 'GARDNER', dimension: 'logical', text: 'همیشه به دنبال دلیل، استدلال و روابط علت و معلولی در اتفاقات هستم.' },
  { id: 'g-m3', testCode: 'GARDNER', dimension: 'logical', text: 'سازماندهی داده‌ها در قالب نمودارها و آمارها کار مورد علاقه من است.' },
  { id: 'g-m4', testCode: 'GARDNER', dimension: 'logical', text: 'از تفکر انتزاعی و مواجهه با الگوریتم‌های پیچیده لذت می‌برم.' },
  { id: 'g-m5', testCode: 'GARDNER', dimension: 'logical', text: 'روش‌های گام‌به‌گام و علمی را برای حل هر مشکلی ترجیح می‌دهم.' },

  // Spatial
  { id: 'g-s1', testCode: 'GARDNER', dimension: 'spatial', text: 'به‌راحتی می‌توانم اشکال و اجسام سه بعدی را در ذهنم تجسم کنم.' },
  { id: 'g-s2', testCode: 'GARDNER', dimension: 'spatial', text: 'نقشه‌خوانی، جهت‌یابی و مسیریابی در محیط‌های جدید برایم ساده است.' },
  { id: 'g-s3', testCode: 'GARDNER', dimension: 'spatial', text: 'به طراحی بصری، نقاشی، عکاسی و چیدمان فضایی علاقه‌مندم.' },
  { id: 'g-s4', testCode: 'GARDNER', dimension: 'spatial', text: 'یادگیری مطالب از طریق نمودارها و تصویرسازی بسیار بهتر انجام می‌شود.' },
  { id: 'g-s5', testCode: 'GARDNER', dimension: 'spatial', text: 'تغییرات جزئی در ظاهر و چیدمان فضاها سریعاً توجه من را جلب می‌کند.' },

  // Bodily-Kinesthetic
  { id: 'g-b1', testCode: 'GARDNER', dimension: 'bodily', text: 'یادگیری کارهای جدید از طریق تمرین عملی بسیار موثرتر از خواندن است.' },
  { id: 'g-b2', testCode: 'GARDNER', dimension: 'bodily', text: 'هماهنگی عصب و عضله بالایی در ورزش یا کارهای ظریف دستی دارم.' },
  { id: 'g-b3', testCode: 'GARDNER', dimension: 'bodily', text: 'هنگام صحبت کردن زیاد از حرکات دست و زبان بدن استفاده می‌کنم.' },
  { id: 'g-b4', testCode: 'GARDNER', dimension: 'bodily', text: 'نشستن طولانی‌مدت پشت میز برایم دشوار است و به تحرک نیاز دارم.' },
  { id: 'g-b5', testCode: 'GARDNER', dimension: 'bodily', text: 'درک خوبی از حس تعادل، سرعت و جهت حرکات بدنی دارم.' },

  // Musical
  { id: 'g-mu1', testCode: 'GARDNER', dimension: 'musical', text: 'تشخیص خارج زدن یا ریتم نادرست در یک قطعه موسیقی برایم آسان است.' },
  { id: 'g-mu2', testCode: 'GARDNER', dimension: 'musical', text: 'ملودی‌ها و ریتم‌های موسیقی سریعاً در ذهنم ماندگار می‌شوند.' },
  { id: 'g-mu3', testCode: 'GARDNER', dimension: 'musical', text: 'هنگام کار یا مطالعه، زمزمه یا ضرب گرفتن با موسیقی به تمرکزم کمک می‌کند.' },
  { id: 'g-mu4', testCode: 'GARDNER', dimension: 'musical', text: 'به نواختن ساز یا خوانندگی علاقمندم یا تمایل زیادی به یادگیری آن دارم.' },
  { id: 'g-mu5', testCode: 'GARDNER', dimension: 'musical', text: 'صداهای محیطی را با جزئیات بالا تفکیک و تحلیل می‌کنم.' },

  // Interpersonal
  { id: 'g-in1', testCode: 'GARDNER', dimension: 'interpersonal', text: 'درک حالات روحی، احساسات و لحن دیگران برایم بسیار راحت است.' },
  { id: 'g-in2', testCode: 'GARDNER', dimension: 'interpersonal', text: 'نقش میانجی و هماهنگ‌کننده را در اختلافات گروهی ایفا می‌کنم.' },
  { id: 'g-in3', testCode: 'GARDNER', dimension: 'interpersonal', text: 'دوستان زیادی دارم و ارتباط‌سازی با افراد جدید برایم انرژی‌بخش است.' },
  { id: 'g-in4', testCode: 'GARDNER', dimension: 'interpersonal', text: 'کار تیمی و تبادل نظر گروهی را به کار فردی ترجیح می‌دهم.' },
  { id: 'g-in5', testCode: 'GARDNER', dimension: 'interpersonal', text: 'به‌خوبی درک می‌کنم چه چیزی باعث انگیزه یا نگرانی اطرافیانم می‌شود.' },

  // Intrapersonal
  { id: 'g-ia1', testCode: 'GARDNER', dimension: 'intrapersonal', text: 'زمان زیادی را صرف تحلیل رفتارها، ارزش‌ها و اهداف شخصی‌ام می‌کنم.' },
  { id: 'g-ia2', testCode: 'GARDNER', dimension: 'intrapersonal', text: 'نقاط قوت، ضعف و حد و مرزهای روحی خودم را به‌خوبی می‌شناسم.' },
  { id: 'g-ia3', testCode: 'GARDNER', dimension: 'intrapersonal', text: 'برای پیشبرد برنامه‌هایم نیازی به ناظر بیرونی ندارم و انگیزه درونی بالایی دارم.' },
  { id: 'g-ia4', testCode: 'GARDNER', dimension: 'intrapersonal', text: 'خلوت و تنهایی برای بازسازی انرژی و تفکر عمیق برایم ضروری است.' },
  { id: 'g-ia5', testCode: 'GARDNER', dimension: 'intrapersonal', text: 'تصمیم‌گیری‌هایم را بر پایه شناخت واقعی از خودم انجام می‌دهم.' },

  // Naturalistic
  { id: 'g-n1', testCode: 'GARDNER', dimension: 'naturalistic', text: 'ارتباط عمیقی با طبیعت، گل‌ها، گیاهان و حیوانات برقرار می‌کنم.' },
  { id: 'g-n2', testCode: 'GARDNER', dimension: 'naturalistic', text: 'طبقه‌بندی پدیده‌های طبیعی، سنگ‌ها یا جانداران برایم جذاب است.' },
  { id: 'g-n3', testCode: 'GARDNER', dimension: 'naturalistic', text: 'حضور در محیط‌های طبیعی حس آرامش و تمرکز فراوانی به من می‌دهد.' },
  { id: 'g-n4', testCode: 'GARDNER', dimension: 'naturalistic', text: 'تغییرات آب‌وهوایی و فصلی را با جزئیات بالا حس می‌کنم.' },
  { id: 'g-n5', testCode: 'GARDNER', dimension: 'naturalistic', text: 'به مسائلی مانند محیط زیست و حفظ حیات وحش اهمیت زیادی می‌دهم.' },
];

export const MBTI_QUESTIONS: QuestionBipolar[] = [
  // E / I
  {
    id: 'm-ei1',
    testCode: 'MBTI',
    axis: 'EI',
    leftText: 'پس از یک روز شلوغ، حضور در جمع دوستان و گفت‌وگو انرژی‌ام را برمی‌گرداند.',
    rightText: 'پس از یک روز شلوغ، تنها بودن در فضایی آرام انرژی‌ام را بازسازی می‌کند.',
  },
  {
    id: 'm-ei2',
    testCode: 'MBTI',
    axis: 'EI',
    leftText: 'معمولاً افکارم را حین صحبت کردن با دیگران شکل می‌دهم و بیان می‌کنم.',
    rightText: 'معمولاً ابتدا موضوع را کاملاً در ذهنم پردازش می‌کنم، سپس آن را به زبان می‌آورم.',
  },
  {
    id: 'm-ei3',
    testCode: 'MBTI',
    axis: 'EI',
    leftText: 'دایره دوستان گسترده‌ای دارم و شروع ارتباط با افراد جدید برایم آسان است.',
    rightText: 'روابط عمیق با تعداد محدودی از دوستان نزدیک را ترجیح می‌دهم.',
  },
  {
    id: 'm-ei4',
    testCode: 'MBTI',
    axis: 'EI',
    leftText: 'در رویدادها و گروه‌ها تمایل دارم مرکز توجه یا فعال در گفت‌وگوها باشم.',
    rightText: 'در گروه‌ها ترجیح می‌دهم بیشتر شنونده و مشاهده‌گر باشم.',
  },
  {
    id: 'm-ei5',
    testCode: 'MBTI',
    axis: 'EI',
    leftText: 'فعالیت‌های تیمی و محیط‌های پرشور شغلی به من انگیزه مضاعف می‌دهد.',
    rightText: 'فعالیت‌های فردی مستقل در محیطی آرام با تمرکز بالا را ترجیح می‌دهم.',
  },
  {
    id: 'm-ei6',
    testCode: 'MBTI',
    axis: 'EI',
    leftText: 'تمایل دارم نظراتم را بلافاصله با دیگران به اشتراک بگذارم.',
    rightText: 'ترجیح می‌دهم تحلیلم را نزد خودم نگه دارم مگر زمانی که لازم باشد.',
  },

  // S / N
  {
    id: 'm-sn1',
    testCode: 'MBTI',
    axis: 'SN',
    leftText: 'به جزئیات ملموس، شواهد عینی و واقعیت‌های موجود توجه بیشتری دارم.',
    rightText: 'به مفاهیم انتزاعی، الگوهای پنهان و امکانات آینده توجه بیشتری دارم.',
  },
  {
    id: 'm-sn2',
    testCode: 'MBTI',
    axis: 'SN',
    leftText: 'روش‌های امتحان‌شده و دستورالعمل‌های گام‌به‌گام عملی را ترجیح می‌دهم.',
    rightText: 'کشف راه‌حل‌های نوآورانه و ایده‌پردازی خلاقانه را ترجیح می‌دهم.',
  },
  {
    id: 'm-sn3',
    testCode: 'MBTI',
    axis: 'SN',
    leftText: 'فردی واقع‌بین هستم و به زمان حال و کاربرد مستقیم کارهایت توجه دارم.',
    rightText: 'فردی دوراندیش و آرمان‌گرا هستم و به ایده‌های بزرگ فردا فکر می‌کنم.',
  },
  {
    id: 'm-sn4',
    testCode: 'MBTI',
    axis: 'SN',
    leftText: 'توضیحات دقیق و آمار واقعی برای من متقاعدکننده‌تر است.',
    rightText: 'استعاره‌ها، نمادها و چشم‌انداز کلی برای من متقاعدکننده‌تر است.',
  },
  {
    id: 'm-sn5',
    testCode: 'MBTI',
    axis: 'SN',
    leftText: 'دوست دارم تجربیات گذشته را مبنای تصمیم‌گیری جدید قرار دهم.',
    rightText: 'دوست دارم مسیرهای نرفته و پتانسیل‌های تازه را امتحان کنم.',
  },
  {
    id: 'm-sn6',
    testCode: 'MBTI',
    axis: 'SN',
    leftText: 'تمرکز بر روی جزئیات اجرایی کار برایم راحت‌تر است.',
    rightText: 'درک تصویر بزرگ (Big Picture) برایم راحت‌تر است.',
  },

  // T / F
  {
    id: 'm-tf1',
    testCode: 'MBTI',
    axis: 'TF',
    leftText: 'تصمیم‌هایم را عمدتاً بر پایه منطق، تحلیل بی‌طرفانه و ملاک‌های عینی می‌گیرم.',
    rightText: 'تصمیم‌هایم را عمدتاً بر پایه ارزش‌های انسانی، احساسات و تاثیر بر افراد می‌گیرم.',
  },
  {
    id: 'm-tf2',
    testCode: 'MBTI',
    axis: 'TF',
    leftText: 'در ارزیابی کارها، صراحت و عدالت منطقی برایم اولویت اول است.',
    rightText: 'در ارزیابی کارها، همدلی و حفظ روابط صمیمانه برایم اولویت اول است.',
  },
  {
    id: 'm-tf3',
    testCode: 'MBTI',
    axis: 'TF',
    leftText: 'ارائه نقد سازنده صریح را برای بهبود کیفیت کار لازم و بی‌اشکال می‌دانم.',
    rightText: 'قبل از بیان نقد، نگران جریحه‌دار شدن احساسات طرف مقابل هستم.',
  },
  {
    id: 'm-tf4',
    testCode: 'MBTI',
    axis: 'TF',
    leftText: 'حقیقت تلخ منطقی را بر مصلحت‌سنجی احساسی ترجیح می‌دهم.',
    rightText: 'مراعاة حال دیگران و صلح گروهی را بر حرف حق بی‌رحمانه ترجیح می‌دهم.',
  },
  {
    id: 'm-tf5',
    testCode: 'MBTI',
    axis: 'TF',
    leftText: 'منطقی بودن و استدلال قوی بزرگ‌ترین تعریف از یک فرد است.',
    rightText: 'مهربان بودن و درک والای انسانی بزرگ‌ترین تعریف از یک فرد است.',
  },
  {
    id: 'm-tf6',
    testCode: 'MBTI',
    axis: 'TF',
    leftText: 'در موقعیت‌های بحرانی، ذهن کلامی و تحلیل منسجم من فعال می‌شود.',
    rightText: 'در موقعیت‌های بحرانی، حمایت عاطفی از همکارانم فعال می‌شود.',
  },

  // J / P
  {
    id: 'm-jp1',
    testCode: 'MBTI',
    axis: 'JP',
    leftText: 'داشتن برنامه دقیق و مشخص برای کارها حس امنیت و آرامش به من می‌دهد.',
    rightText: 'ترجیح می‌دهم گزینه‌هایم باز بماند و به‌صورت شناور و لحظه‌ای تصمیم بگیرم.',
  },
  {
    id: 'm-jp2',
    testCode: 'MBTI',
    axis: 'JP',
    leftText: 'دوست دارم کارها را زوتر از ددلاین به پایان برسانم تا پرونده‌شان بسته شود.',
    rightText: 'معمولاً در نزدیک‌ترین زمان به مهلت نهایی (ددلاین) بهترین کارایی را دارم.',
  },
  {
    id: 'm-jp3',
    testCode: 'MBTI',
    axis: 'JP',
    leftText: 'زندگی هدفمند و چارچوب‌دار را نسبت به کارهای بدون پیش‌بینی ترجیح می‌دهم.',
    rightText: 'انعطاف‌پذیری، بداهه‌پردازی و اتفاقات غیرمنتظره برایم جذاب است.',
  },
  {
    id: 'm-jp4',
    testCode: 'MBTI',
    axis: 'JP',
    leftText: 'محیط کار و اتاق من همیشه مرتب، دسته‌بندی‌شده و مشخص است.',
    rightText: 'ترجیح می‌دهم همه‌چیز در دسترس باشد و سخت‌گیری در نظم ثابت ندارم.',
  },
  {
    id: 'm-jp5',
    testCode: 'MBTI',
    axis: 'JP',
    leftText: 'قبل از شروع سفر یا پروژه، تمام جزئیات برنامه‌ریزی می‌شود.',
    rightText: 'بدون برنامه سخت‌گیرانه حرکت می‌کنم و در مسیر تصمیم می‌گیرم.',
  },
  {
    id: 'm-jp6',
    testCode: 'MBTI',
    axis: 'JP',
    leftText: 'بلاتکلیفی و تغییرات مداوم برنامه باعث کلافگی من می‌شود.',
    rightText: 'دستورالعمل‌های ثابت و عدم انعطاف باعث دلزدگی من می‌شود.',
  },
];

export const DISC_BLOCKS: QuestionIpsative[] = [
  {
    id: 'd-b1',
    testCode: 'DISC',
    options: [
      { id: 'd-b1-d', dimension: 'D', label: 'سریع تصمیم می‌گیرم و مسئولیت نتایج آن را صریحاً می‌پذیرم.' },
      { id: 'd-b1-i', dimension: 'I', label: 'با انرژی و اشتیاق بالا دیگران را با پروژه‌ها همراه می‌کنم.' },
      { id: 'd-b1-s', dimension: 'S', label: 'صبورانه به حرف‌های اعضای تیم گوش داده و ثبات کار را حفظ می‌کنم.' },
      { id: 'd-b1-c', dimension: 'C', label: 'قبل از هر اقدامی، تمام جزئیات و محاسبات دقیق را بررسی می‌کنم.' },
    ],
  },
  {
    id: 'd-b2',
    testCode: 'DISC',
    options: [
      { id: 'd-b2-d', dimension: 'D', label: 'در مواجهه با موانع، قاطعانه چالش‌ها را از سر راه برمی‌دارم.' },
      { id: 'd-b2-i', dimension: 'I', label: 'با خوش‌بینی و روابط عمومی قوی فضایی شاداب ایجاد می‌کنم.' },
      { id: 'd-b2-s', dimension: 'S', label: 'محیطی آرام، قابل پیش‌بینی و عاری از تشنج را ترجیح می‌دهم.' },
      { id: 'd-b2-c', dimension: 'C', label: 'استانداردهای بالا و رعایت دقیق ضوابط کیفی را تضمین می‌کنم.' },
    ],
  },
  {
    id: 'd-b3',
    testCode: 'DISC',
    options: [
      { id: 'd-b3-d', dimension: 'D', label: 'مستقیم و صریح به سراغ اصل مطلب می‌روم بدون حاشیه.' },
      { id: 'd-b3-i', dimension: 'I', label: 'تعاملات صمیمانه، گفتگو و تشویق دیگران را اولویت می‌دانم.' },
      { id: 'd-b3-s', dimension: 'S', label: 'همراهی وفادارانه و پشتیبانی دائمی از تیم ارائه می‌دهم.' },
      { id: 'd-b3-c', dimension: 'C', label: 'توضیحات منطقی بر پایه آمار و شواهد دقیق ارائه می‌کنم.' },
    ],
  },
  {
    id: 'd-b4',
    testCode: 'DISC',
    options: [
      { id: 'd-b4-d', dimension: 'D', label: 'رقابت‌جویی و رسیدن به برتری هدف اصلی من است.' },
      { id: 'd-b4-i', dimension: 'I', label: 'محبوبیت در بین همکاران و ایجاد شبکه ارتباطی برایم مهم است.' },
      { id: 'd-b4-s', dimension: 'S', label: 'همکاری هماهنگ و جلوگیری از تعارض‌های گروهی برایم اولویت دارد.' },
      { id: 'd-b4-c', dimension: 'C', label: 'عدم وجود خطای محاسباتی و صحت اطلاعات برایم حاتی است.' },
    ],
  },
  {
    id: 'd-b5',
    testCode: 'DISC',
    options: [
      { id: 'd-b5-d', dimension: 'D', label: 'ریسک‌پذیری بالا برای رسیدن به اهداف بزرگ خصلت من است.' },
      { id: 'd-b5-i', dimension: 'I', label: 'ایده‌پردازی‌های پرشور و انگیزه دادن به دیگران هنر من است.' },
      { id: 'd-b5-s', dimension: 'S', label: 'ثبات قدم، انجام منظم امور و صبوری نقطه قوت من است.' },
      { id: 'd-b5-c', dimension: 'C', label: 'دقت در جزئیات فنی و نظم ساختاری توانمندی من است.' },
    ],
  },
  {
    id: 'd-b6',
    testCode: 'DISC',
    options: [
      { id: 'd-b6-d', dimension: 'D', label: 'در فشار کاری، فرماندهی قاطع کارها را به دست می‌گیرم.' },
      { id: 'd-b6-i', dimension: 'I', label: 'در فشار کاری، با طنز و انرژی مثبت روحیه تیم را حفظ می‌کنم.' },
      { id: 'd-b6-s', dimension: 'S', label: 'در فشار کاری، با ارامش از همکارانم پشتیبانی روحی می‌کنم.' },
      { id: 'd-b6-c', dimension: 'C', label: 'در فشار کاری، قوانین و چک‌لیست‌ها را دقیق‌تر اعمال می‌کنم.' },
    ],
  },
];
