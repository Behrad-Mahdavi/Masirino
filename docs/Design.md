# Rokad Design System

**نسخه:** 0.1 · **دامنه:** وب دسکتاپ · **جهت:** RTL (فارسی)

---

## Color Tokens

### Core / Primitive

```json
{
  "color": {
    "teal":    { "50": "#F2FAF9", "100": "#E4F4F2", "200": "#D6EEEB", "500": "#58BDAF", "600": "#52B8AB", "700": "#347E75", "800": "#2E7068" },
    "navy":    { "50": "#F4F5FB", "100": "#D7DBF1", "600": "#202A5A", "700": "#21295A" },
    "pink":    { "50": "#FEFAFB", "100": "#FCE8EF", "500": "#E0195B", "700": "#CE1754" },
    "amber":   { "50": "#FFFDFA", "100": "#FEF7EC", "300": "#FFD641", "500": "#F8A41D", "600": "#E49007", "800": "#A56216" },
    "ink":     { "500": "#525252", "700": "#3D3B3A", "800": "#333230", "900": "#292827" },
    "neutral": { "0": "#FFFFFF", "25": "#FCFCFC", "50": "#F6F6F6", "100": "#EDECEC", "300": "#D0CFCD" }
  }
}
```

### Alpha

```json
{
  "alpha": {
    "white-06": "rgba(255,255,255,0.06)",
    "white-07": "rgba(255,255,255,0.07)",
    "white-15": "rgba(255,255,255,0.15)",
    "white-17": "rgba(255,255,255,0.17)",
    "white-34": "rgba(255,255,255,0.34)",
    "white-58": "rgba(255,255,255,0.58)",
    "white-69": "rgba(255,255,255,0.69)",
    "white-80": "rgba(255,255,255,0.80)",
    "black-19": "rgba(0,0,0,0.19)",
    "navy-47":  "rgba(32,42,90,0.47)"
  }
}
```

### Semantic / Alias

```json
{
  "bg": {
    "page":       "{color.neutral.0}",
    "subtle":     "{color.neutral.50}",
    "brand-soft": "{color.teal.50}",
    "surface":    "{color.neutral.0}",
    "inverse":    "{color.navy.700}"
  },
  "text": {
    "primary":       "{color.ink.900}",
    "secondary":     "{color.ink.500}",
    "accent":        "{color.teal.700}",
    "on-brand":      "{color.neutral.0}",
    "on-inverse":    "{color.neutral.0}",
    "inverse-muted": "{alpha.white-69}"
  },
  "border": {
    "strong":  "{color.ink.900}",
    "default": "{color.neutral.300}",
    "subtle":  "{color.neutral.100}",
    "brand":   "{color.teal.500}",
    "inverse": "{alpha.white-15}"
  },
  "action": {
    "primary-bg":       "{color.teal.800}",
    "primary-bg-hover": "{color.teal.700}",
    "primary-fg":       "{color.neutral.0}",
    "emphasis-bg":      "{color.navy.700}",
    "emphasis-fg":      "{color.neutral.0}",
    "secondary-bg":     "{color.neutral.0}",
    "secondary-border": "{color.ink.900}",
    "secondary-fg":     "{color.ink.900}"
  }
}
```

### Brand Mapping

```css
[data-brand="rokad"] { --brand-accent:#58BDAF; --brand-accent-deep:#347E75; --brand-tint:#F2FAF9; --brand-on-accent:#FFFFFF; }
[data-brand="girl"]  { --brand-accent:#E0195B; --brand-accent-deep:#CE1754; --brand-tint:#FEFAFB; --brand-on-accent:#FFFFFF; }
[data-brand="boy"]   { --brand-accent:#21295A; --brand-accent-deep:#202A5A; --brand-tint:#F4F5FB; --brand-on-accent:#FFFFFF; }
[data-brand="third"] { --brand-accent:#F8A41D; --brand-accent-deep:#A56216; --brand-tint:#FEF7EC; --brand-on-accent:#292827; }
```

---

## Typography Tokens

### Family

```json
{
  "font.family.base":    "IRANSansX, sans-serif",
  "font.family.numeric": "IRANSansXFaNum, IRANSansX, sans-serif"
}
```

`numeric` فقط برای بلوک‌هایی که ارقام فارسی نمایش می‌دهند (`+۲۵۰`، `٪۷۶`، `۱۴۰۵`).

### Weight

```json
{
  "font.weight.medium":     500,
  "font.weight.demibold":   600,
  "font.weight.bold":       700,
  "font.weight.black":      900,
  "font.weight.extrablack": 950
}
```

### Size Scale

```json
{
  "text.2xs": "10px", "text.xs":  "12px", "text.sm":  "14px",
  "text.base":"15px", "text.md":  "16px", "text.lg":  "18px",
  "text.xl":  "21px", "text.2xl": "24px", "text.3xl": "32px",
  "text.4xl": "43px", "text.5xl": "53px", "text.6xl": "70px",
  "text.7xl": "77px"
}
```

### Line-height & Tracking

```json
{
  "leading.tight":   1.3,
  "leading.snug":    1.45,
  "leading.normal":  1.6,
  "leading.relaxed": 1.8,
  "tracking.tight":  "-0.01em",
  "tracking.normal": "0"
}
```

`tracking.tight` فقط از `text.5xl` به بالا. برای فارسی letter-spacing مثبت مجاز نیست.

### Type Styles

| توکن | Size | Weight | Leading | Tracking |
|---|---|---|---|---|
| `display/hero` | 77px | extrablack | tight | tight |
| `heading/section` | 53px | extrablack | tight | tight |
| `heading/sub` | 43px | extrablack | tight | tight |
| `heading/card-lg` | 32px | black | snug | normal |
| `heading/card` | 24px | black | snug | normal |
| `heading/card-sm` | 21px | black | snug | normal |
| `display/stat` | 70px | extrablack | 1.0 | normal · family: numeric |
| `body/lead` | 18px | medium | normal | normal |
| `body/default` | 16px | medium | normal | normal |
| `label/nav` | 15px | demibold | 1.35 | normal |
| `label/button` | 15px | black | 1.35 | normal |
| `label/chip` | 15px | bold | 1.35 | normal |
| `caption` | 12px | demibold | normal | normal |

---

## Spacing & Layout Tokens

### Grid

```json
{
  "layout.canvas":       "1440px",
  "layout.container":    "1200px",
  "layout.gutter-outer": "120px",
  "layout.columns":      12,
  "layout.column-gap":   "24px",
  "layout.direction":    "rtl"
}
```

### Spacing Scale

پایه‌ی ۴px.

```json
{
  "space.0":  "0px",  "space.1":  "4px",  "space.2":  "8px",   "space.3":  "12px",
  "space.4":  "16px", "space.5":  "20px", "space.6":  "24px",  "space.8":  "32px",
  "space.10": "40px", "space.12": "48px", "space.16": "64px",  "space.20": "80px",
  "space.24": "96px", "space.30": "120px"
}
```

### Section Rhythm

```json
{
  "section.padding-y":       "{space.24}",
  "section.padding-y-tight": "{space.20}",
  "section.heading-gap":     "{space.6}",
  "section.content-gap":     "{space.16}",
  "section.card-gap":        "{space.6}"
}
```

### Rotation

```json
{
  "rotate.subtle":  "1.5deg",
  "rotate.default": "2.5deg",
  "rotate.strong":  "3deg",
  "rotate.none":    "0deg"
}
```

قاعده: کارت‌های همردیف جهت چرخش متناوب می‌گیرند (`+`، `−`، `+`، `−`). زیر `768px` مقدار `rotate.none` اعمال می‌شود.

### Breakpoints

```json
{
  "screen.sm": "640px",
  "screen.md": "768px",
  "screen.lg": "1024px",
  "screen.xl": "1280px",
  "screen.2xl": "1440px"
}
```

---

## Radius Tokens

```json
{
  "radius.xs":   "3px",
  "radius.sm":   "4px",
  "radius.md":   "8px",
  "radius.lg":   "12px",
  "radius.xl":   "16px",
  "radius.2xl":  "22px",
  "radius.3xl":  "24px",
  "radius.full": "9999px"
}
```

### Leaf Radius

شعاع نامتقارن، فرم امضای سیستم:

```json
{
  "radius.leaf":         "12px 0 12px 0",
  "radius.leaf-inverse": "0 12px 0 12px"
}
```

| کاربرد | توکن |
|---|---|
| بَج، نشانگر ریز | `radius.xs` |
| فلش کنترل، جزئیات | `radius.sm` |
| دکمه، Chip، IconBadge، Avatar | `radius.md` |
| کارت آمار، کارت ویژگی | `radius.leaf` |
| کارت رویداد | `radius.xl` |
| نوار هدر | `radius.2xl` |
| کارت شعبه، Hero | `radius.3xl` |
| Chip قرصی | `radius.full` |

`radius.leaf` مخصوص سطوح اطلاعاتی است؛ روی دکمه، فیلد ورودی و مودال استفاده نمی‌شود.

---

## Elevation & Shadow Tokens

سایه‌ها blur ندارند — آفست توپر هم‌شکل با شعاع کارت.

```json
{
  "elevation.flat":    "none",
  "elevation.sm":      "3px 3px 0 0 var(--shadow-color)",
  "elevation.md":      "4px 4px 0 0 var(--shadow-color)",
  "elevation.lg":      "6px 6px 0 0 var(--shadow-color)",
  "elevation.xl":      "8px 8px 0 0 var(--shadow-color)",
  "elevation.overlay": "0 8px 24px 0 rgba(0,0,0,0.19)",
  "blur.backdrop":     "10px"
}
```

```json
{
  "shadow-color.ink":   "{color.ink.900}",
  "shadow-color.brand": "var(--brand-accent)"
}
```

| سطح | Elevation | Shadow color |
|---|---|---|
| کارت آمار | `md` | `brand` |
| کارت نظر (فعال) | `md` | `brand` |
| کارت ویژگی | `lg` | `ink` |
| دکمه‌ی ثانویه | `lg` | `ink` |
| کارت رویداد | `xl` | `ink` |
| مودال / Popover | `overlay` | — |

### Border Width

بوردر در این سیستم مکمل ساختاری Elevation است.

```json
{
  "border.hairline": "1px",
  "border.default":  "1px",
  "border.thick":    "2px",
  "border.heavy":    "3px"
}
```

`border.thick` پیش‌فرض کارت‌هاست.

### RTL

```css
.elevated { box-shadow: var(--elevation-md); }
[dir="rtl"] .elevated { box-shadow: -4px 4px 0 0 var(--shadow-color); }
```

---

## Iconography Tokens

```json
{
  "icon.grid":     "24x24",
  "icon.stroke":   "2px",
  "icon.linecap":  "round",
  "icon.linejoin": "round",
  "icon.size.sm":  "16px",
  "icon.size.md":  "24px",
  "icon.size.lg":  "32px",
  "icon.size.xl":  "48px",
  "icon.gap":      "{space.2}"
}
```

### Icon Color

```json
{
  "icon.default":    "{color.ink.900}",
  "icon.muted":      "{color.ink.500}",
  "icon.accent":     "var(--brand-accent)",
  "icon.on-brand":   "{color.neutral.0}",
  "icon.on-inverse": "{color.neutral.0}"
}
```

### Icon Badge

```json
{
  "icon-badge.size":      "36px",
  "icon-badge.radius":    "{radius.md}",
  "icon-badge.bg":        "var(--brand-accent)",
  "icon-badge.fg":        "{color.neutral.0}",
  "icon-badge.icon-size": "{icon.size.md}"
}
```

### RTL

آیکون‌های جهت‌دار (`chevron`, `arrow`) توکن `icon.mirror-rtl: true` می‌گیرند و در راست‌چین آینه می‌شوند.

---

## Color System

### سلسله‌مراتب

| رنگ | نقش | دامنه‌ی مجاز |
|---|---|---|
| فیروزه‌ای `teal` | برند مادر | ناوبری، CTA اصلی، کلمه‌ی تأکیدی تیتر، تیتر فوتر |
| صورتی `pink` | زیربرند دخترانه | کارت شعبه، مسیر و محتوای دخترانه |
| سرمه‌ای `navy` | زیربرند پسرانه + رنگ ساختاری | کارت شعبه، فوتر، بَج تأکید |
| کهربایی `amber` | تأکید کمکی | مدال، افتخار، آمار — هرگز CTA |

صورتی و سرمه‌ای فقط در واحد انتخاب شعبه به‌عنوان CTA کنار هم قرار می‌گیرند. در سایر سطوح، CTA همیشه فیروزه‌ای است.

### نسبت استفاده

| نقش | توکن | سهم |
|---|---|---|
| زمینه | `bg.page`, `bg.brand-soft` | ~۶۰٪ |
| متن و ساختار | `text.primary`, `text.secondary`, `border.strong` | ~۳۰٪ |
| برند و تأکید | `--brand-accent` | ~۱۰٪ |

سطوح تمام‌رنگ (Hero، فوتر) این نسبت را عمداً معکوس می‌کنند تا مرز فصل‌های صفحه را بسازند.

### جفت‌های مجاز

| زمینه | متن | Chip | بوردر | سایه |
|---|---|---|---|---|
| `neutral.0` | `ink.900` | `neutral.0` + بوردر accent | `ink.900` | `ink.900` |
| `teal.50` | `teal.800` | `neutral.0` + بوردر `teal.800` | `teal.500` | `teal.500` |
| `navy.50` | `navy.600` | `neutral.0` + بوردر `navy.600` | `navy.700` | `navy.600` |
| `pink.50` | `pink.700` | `neutral.0` + بوردر `pink.700` | `pink.500` | `pink.500` |
| `amber.100` | `amber.800` | `neutral.0` + بوردر `amber.800` | `amber.600` | `amber.600` |
| `navy.700` | `neutral.0` | — | `alpha.white-15` | — |

### قانون رنگ متن

سایه‌های `500` فیروزه‌ای و کهربایی **توکن سطح‌اند، نه توکن متن**. برای متن از `teal.700+` و `amber.800` استفاده می‌شود.

| رنگ | کنتراست روی سفید | متن معمولی | متن بزرگ |
|---|---|---|---|
| `ink.900` | 15.3:1 | ✅ | ✅ |
| `navy.700` | 13.1:1 | ✅ | ✅ |
| `ink.500` | 7.9:1 | ✅ | ✅ |
| `teal.800` | 5.9:1 | ✅ | ✅ |
| `pink.700` | 5.6:1 | ✅ | ✅ |
| `teal.700` | 4.9:1 | ✅ | ✅ |
| `amber.800` | 4.9:1 | ✅ | ✅ |
| `pink.500` | 4.8:1 | ✅ | ✅ |
| `amber.600` | 2.8:1 | ❌ | ❌ |
| `teal.500` | 2.2:1 | ❌ | ❌ |
| `amber.500` | 2.2:1 | ❌ | ❌ |

استثنا: `teal.500` روی `navy.700` کنتراست ۵.۹:۱ دارد و به‌عنوان متن فوتر مجاز است.

### Dark Theme

```css
[data-theme="dark"] {
  --bg-page: #17161A;
  --bg-subtle: #1F1E23;
  --bg-surface: #1F1E23;
  --text-primary: #F6F6F6;
  --text-secondary: #A8A6A3;
  --border-strong: #F6F6F6;
  --shadow-color-ink: var(--brand-accent);
}
```

در تم تاریک، رنگ سایه از `ink` به `--brand-accent` تغییر می‌کند تا Elevation قابل رؤیت بماند.

---

## Components

### Atoms

#### Button

```ts
interface ButtonProps {
  variant: 'primary' | 'emphasis' | 'secondary' | 'brand';
  size?: 'sm' | 'md' | 'lg';
  brand?: 'rokad' | 'girl' | 'boy';   // فقط با variant='brand'
  rotated?: boolean;                   // default: false
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}
```

| Variant | زمینه | متن | بوردر | Radius | Elevation |
|---|---|---|---|---|---|
| `primary` | `action.primary-bg` | `neutral.0` | — | `md` | `flat` |
| `emphasis` | `navy.700` | `neutral.0` | — | `xs` | `flat` |
| `secondary` | `neutral.0` | `ink.900` | `2px ink.900` | `md` | `lg` |
| `brand` | `var(--brand-accent)` | `var(--brand-on-accent)` | — | `md` | `flat` |

| Size | Padding | Type style |
|---|---|---|
| `sm` | `8px 12px` | `label/chip` |
| `md` | `10px 24px` | `label/button` |
| `lg` | `14px 32px` | `label/button` |

**States**

| State | رفتار |
|---|---|
| `hover` | آفست سایه از `lg` به `sm` + جابه‌جایی هم‌اندازه‌ی کارت (افکت فشرده‌شدن) |
| `active` | `elevation.flat` + جابه‌جایی کامل به آفست |
| `focus-visible` | `outline: 3px solid var(--brand-accent); outline-offset: 2px` |
| `disabled` | `opacity: 0.45`، `pointer-events: none`، `elevation.flat` |
| `loading` | اسپینر `icon.size.sm`، متن حفظ می‌شود، `aria-busy="true"` |

`rotated` مقدار `rotate.strong` منفی می‌گیرد و زیر `screen.md` خنثی می‌شود.

#### Chip

```ts
interface ChipProps {
  variant: 'outline' | 'pill' | 'badge' | 'label';
  brand?: 'rokad' | 'girl' | 'boy' | 'third';
  dot?: boolean;
}
```

| Variant | ساختار |
|---|---|
| `outline` | `neutral.0` + `1px` بوردر accent + `radius.md` + `label/chip` به رنگ accent |
| `pill` | نیم‌شفاف + `blur.backdrop` + `radius.full` + نقطه‌ی رنگی + متن سفید |
| `badge` | `navy.700` توپر + متن سفید + `radius.xs` + `rotate.strong` منفی |
| `label` | `neutral.0` + بوردر + `radius.md`، برای برچسب بالای کارت |

Padding: `8px 12px` · gap آیکون/نقطه تا متن: `icon.gap`.

#### IconBadge

مربع `36px`، `radius.md`، زمینه‌ی `var(--brand-accent)`، آیکون `icon.size.md` با `icon.on-brand`.

#### Avatar

```ts
interface AvatarProps { initials?: string; src?: string; size?: 'sm' | 'md'; brand?: BrandKey; }
```

مربع با `radius.md`، زمینه‌ی accent، حروف اول با `label/button` سفید. `sm: 32px`، `md: 40px`.

#### Divider

| Variant | استایل |
|---|---|
| `solid` | `1px solid {border.subtle}` |
| `inverse` | `1px solid {alpha.white-15}` |
| `dashed` | `2px dashed var(--brand-accent)` |

---

### Molecules

#### SectionHeading

```ts
interface SectionHeadingProps {
  parts: Array<{ text: string; accent?: boolean }>;
  subtitle?: string;
  align?: 'center' | 'start';
  playful?: boolean;   // چرخش متناوب rotate.subtle روی هر بخش
}
```

تیتر با `heading/section` در `text.primary`؛ بخش‌های `accent` با `text.accent`. زیرعنوان `body/lead` در `text.secondary` با فاصله‌ی `section.heading-gap` و حداکثر عرض `600px`.

خروجی سمانتیک همیشه یک `<h2>` واحد با `<span>` داخلی است؛ بخش‌ها به عنصر جدا شکسته نمی‌شوند.

#### StatCard

```ts
interface StatCardProps {
  label: string;
  value: string;
  title: string;
  caption?: string;
  brand: 'rokad' | 'girl' | 'boy' | 'third';
  rotation?: 'left' | 'right';
}
```

عرض `264px` × ارتفاع `210px` · `radius.leaf` · زمینه `var(--brand-tint)` · بوردر `border.thick` به رنگ accent · `elevation.md` با `shadow-color.brand` · `rotate.default`.

ترکیب داخلی: Chip `outline` بالا → `display/stat` به رنگ `--brand-accent-deep` → `title` با `heading/card-sm` → `caption` با `caption`.

#### FeatureCard

```ts
interface FeatureCardProps {
  index: string;      // شماره‌ی ترتیبی فارسی
  title: string;
  body: string;
  icon: ReactNode;
  brand: BrandKey;
  rotation?: 'left' | 'right';
}
```

زمینه `bg.subtle` · بوردر `border.thick` به `border.strong` · `elevation.lg` با `shadow-color.ink` · `radius.lg` · `rotate.default`.
ترکیب: شماره در یک گوشه با `heading/card-lg` در `neutral.300`، IconBadge در گوشه‌ی مقابل، `heading/card` و متن `caption`.

#### TestimonialCard

```ts
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  brand: BrandKey;
  state?: 'active' | 'stacked';
}
```

زمینه `bg.surface` · بوردر `border.thick` (accent در `active`، `border.strong` در `stacked`) · `elevation.md` · `radius.lg`.
ترکیب: علامت نقل‌قول با `heading/card-lg` در accent → متن `body/lead` → Divider `dashed` → ردیف نویسنده (Avatar + `label/button` + `caption`).
`stacked` مقدار `rotate.default` و `opacity: 0.6` می‌گیرد.

#### EventCard

```ts
interface EventCardProps {
  title: string;
  date: string;
  tag: string;
  body: string;
  index: string;
  image: string;
  ctaLabel: string;
  brand: BrandKey;
}
```

ابعاد `800×330` · `radius.xl` · بوردر `border.thick` به `border.strong` · `elevation.xl`.
دو ناحیه: تصویر و پنل متنی روی `bg.subtle`. پنل شامل `heading/card`، تاریخ با `caption`، Chip `outline`، متن `body/default`، شماره‌ی بزرگ نیم‌شفاف و Button با `variant="brand"`.

#### BranchCard

```ts
interface BranchCardProps {
  brand: 'girl' | 'boy';
  title: string;
  address: string;
  features: string[];
  ctaLabel: string;
  illustration: string;
}
```

ابعاد `580×355` · `radius.3xl` · زمینه‌ی توپر `var(--brand-accent)`.
ترکیب: Chip `label` بالا → `heading/card-lg` سفید → آدرس با `body/default` در `alpha.white-69` → Chipهای `pill` → Button `secondary`.
کل کارت ناحیه‌ی کلیک است، نه فقط دکمه.

---

### Organisms

#### Header

نوار `container × 112px` با `top: {space.8}` (شناور) · زمینه `bg.brand-soft` · `radius.2xl`.
ترتیب RTL: لوگو → Chip `badge` → لینک‌های ناوبری (`label/nav` در `navy.700`، gap `space.8`) → Button `primary`.

| State | رفتار |
|---|---|
| `sticky` | ارتفاع به `72px` + `elevation.overlay` |
| لینک `hover` | `text.accent` |
| لینک `active` | `text.accent` + زیرخط `2px` |
| `mobile` (< `screen.md`) | منوی همبرگری تمام‌صفحه |

#### Carousel

```ts
interface CarouselProps {
  variant: 'peek' | 'stack';
  controls: 'top' | 'sides';
  pagination?: boolean;
  autoplay?: boolean;
}
```

- کنترل: مربع `48px` · `bg.surface` · بوردر `border.hairline` به `navy.700` · `radius.sm` · آیکون `icon.size.md` با `mirror-rtl`.
- Pagination: نوار `40×6px` · فعال `ink.900` · غیرفعال `neutral.100`.
- `peek`: اسلایدهای کناری بریده نمایش داده می‌شوند.
- `stack`: اسلایدهای غیرفعال با `rotate.default` و `opacity` کمتر پشت اسلاید فعال.
- الزامات: ناوبری کیبورد با `ArrowRight`/`ArrowLeft` (معکوس در RTL)، `aria-live="polite"` روی ناحیه‌ی فعال، توقف `autoplay` در `hover` و `focus`.

#### Hero

بلوک `canvas × 633px` · `radius.3xl` · زمینه `teal.500`.
تصویر شخصیت در یک سمت، `display/hero` سفید در سمت مقابل، زیرعنوان `heading/sub`.
نوار CTA دوتایی چسبیده به لبه‌ی پایین با فرم زاویه‌دار (`clip-path`): بخش اول `navy.700`، بخش دوم `neutral.0`.

#### Footer

زمینه `bg.inverse` · ارتفاع `397px` · چهار ستون روی `layout.container`.
عنوان ستون: `heading/card` در `teal.500`. لینک‌ها: `body/default` در `text.on-inverse` با فاصله‌ی عمودی `space.5`.
ردیف پایین پس از Divider `inverse`: کپی‌رایت با `caption` در `text.inverse-muted` + آیکون‌های اجتماعی `icon.size.lg`.

---

## Component API Rules

- Variantها بسته و صریح‌اند؛ prop آزاد رنگ (`color: string`) تعریف نمی‌شود.
- تم و زیربرند از طریق `data-brand` و `data-theme` روی کانتینر منتقل می‌شود، نه از طریق prop روی هر Atom.
- هر کامپوننت تعاملی باید هر پنج حالت `default / hover / focus-visible / disabled / loading` را پوشش دهد.
- `rotate` روی کانتینر تزئینی اعمال می‌شود، نه روی عنصر متنی.
- زیر `screen.md`: `rotate.none`، `layout.gutter-outer` به `space.4`، و `text.5xl`/`text.7xl` یک پله در مقیاس پایین می‌آیند.
