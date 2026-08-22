# سند مشخصات فنی و معماری سیستم: موتور هدایت شغلی چندمعیاره
## System Architecture Specification: Multi-Criteria Psychometric Matching Engine (PathEngine V2)

---

### ۱. چکیده اجرایی و فلسفه طراحی سیستم (System Philosophy & Core Design)

سامانه **PathEngine V2** یک موتور تصمیم‌گیری چندمعیاره قطعی (**Deterministic MCDM - Multi-Criteria Decision Making**) و بدون تأخیر (**Zero-Latency Inference Engine**) است که تطابق ابعاد چندگانه روان‌شناختی فرد را با داده‌های استاندارد بازار کار (بر پایه تاکسونومی $O*NET$) در یک فضای پیوسته برداری نگاشت می‌کند.

این سیستم با حذف استنتاج‌های تک‌بعدی سنتی، پروفایل کاربر را به یک بردار ویژگی چندلایه (**Multi-Layer Latent Representation**) تبدیل کرده و از طریق یک خط لوله ۴ مرحله‌ای (Funnel Pipeline)، نمره سازگاری ساختاریافته را همراه با سبد توصیه‌ای مقید به تنوع (**Diversity-Constrained Recommendation Basket**) تولید می‌نماید.

```
+---------------------------------------------------------------------------------------------------+
|                                 USER PSYCHOMETRIC INPUT LAYER                                     |
|  [Holland RIASEC: R^6]    [Gardner: R^8 + Var]    [MBTI: 4-Axis + Intensity]    [DISC: Forced-Ch] |
+---------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+---------------------------------------------------------------------------------------------------+
|                                     PATH ENGINE V2 PIPELINE                                       |
|                                                                                                   |
|  [Phase 1: Directional Cosine Metric] ──► S_Holland ∈ [0, 1]                                      |
|  [Phase 2: Weighted Feasibility + Deficit Penalty] ──► S_Gardner ∈ [0, 1]                         |
|  [Phase 3: Work-Environment Distance Metric] ──► S_MBTI ∈ [0.1, 1]                                |
|  [Phase 4: Behavioral Role Extraction] ──► DISC Contextual Archetype                              |
|                                                                                                   |
|  Convex Score Formulation:                                                                        |
|  MatchScore = round( clamp_{[0,1]}( 0.35*S_H + 0.35*S_G + 0.30*S_M ) * 100 )                     |
+---------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+---------------------------------------------------------------------------------------------------+
|                                DIVERSITY-CONSTRAINED BASKET (K=7)                                 |
|  ├─ Main Path (ArgMax_Global)                                                                     |
|  ├─ 3x Alternative Paths (Intra-Cluster Ranking, Cluster = C_main)                                |
|  └─ 3x Complementary Paths (Inter-Cluster Orthogonal Diversity: C_i ∩ C_j = ∅, C_i ≠ C_main)     |
+---------------------------------------------------------------------------------------------------+
```

---

### ۲. فرمول‌بندی ریاضی و مدل‌سازی لایه‌های محاسباتی

#### ۲.۱. فاز ۱: نگاشت بردار رغبت‌سنجی هالند (Directional Cosine Similarity)
تمایلات شغلی در یک فضای برداری ۶ بعدی $\mathbb{R}^6$ با پایه‌های متعامد $\mathcal{B} = \{R, I, A, S, E, C\}$ تعریف می‌شوند. با فرض بردار کاربر $U \in [0, 100]^6$ و بردار مرجع شغل $J \in [0, 100]^6$:

$$\mathcal{S}_{\text{Holland}}(U, J) = 
\begin{cases} 
0.0 & \text{if } \|U\|_2 = 0 \lor \|J\|_2 = 0 \\
\frac{\langle U, J \rangle}{\|U\|_2 \|J\|_2} = \frac{\sum_{k \in \mathcal{B}} U_k \cdot J_k}{\sqrt{\sum_{k \in \mathcal{B}} U_k^2} \sqrt{\sum_{k \in \mathcal{B}} J_k^2}} & \text{otherwise}
\end{cases}$$

* **ویژگی مهندسی:** استفاده از زاویه بردار به‌جای فاصله اقلیدسی، سیستم را نسبت به سوگیری‌های پاسخ‌دهی (Response Bias / Acquiescence Bias) مقاوم (Scale-Invariant) می‌سازد. محافظ صفر-نُرم مانع از خطای ممیز شناور ($NaN$) در محیط‌های ایزوله اجرایی می‌شود.

---

#### ۲.۲. فاز ۲: سازگاری شناختی گاردنر با تابع جریمه کسری پیوسته-قطعه‌ای (Piecewise Deficit Penalty)
این فاز قابلیت‌های شناختی کاربر $G \in [1.0, 5.0]^8$ را در برابر اوزان اهمیت شغل $W \in [0.0, 1.0]^8$ ارزیابی می‌کند.

۱. **محاسبه برازش اولیه با نزول وزنی رتبه (Rank-Decay Feasibility):**
$$\mathcal{S}_{\text{Gardner}}^{\text{raw}} = \sum_{r=1}^{3} \omega_r \cdot W_{\pi(r)} \cdot \left(\frac{G_{\pi(r)}}{5.0}\right)$$
که در آن $\pi(r)$ هوش رتبه $r$ام کاربر و $\vec{\omega} = [1.0, 0.7, 0.4]$ با ضریب نرمال‌سازی $\|\vec{\omega}\|_1 = 2.1$ است.

۲. **عملگر جریمه فعال کسری شایستگی (Asymmetric Deficit Penalty):**
اگر شغلی وابستگی بحرانی به یک هوش داشته باشد ($W_k \ge 0.85$)، کسری نمره کاربر ($G_k < 3.0$) موجب فعال شدن جریمه غیرخطی زیر می‌شود:
$$\mathcal{P}_{\text{deficit}} = \sum_{k=1}^{8} \mathbb{I}\Big(W_k \ge 0.85 \land G_k < 3.0\Big) \cdot \left(0.20 \cdot W_k \cdot \frac{3.0 - G_k}{3.0}\right)$$

۳. **نمره نهایی فاز ۲:**
$$\mathcal{S}_{\text{Gardner}} = \max\left(0.0, \min\left(1.0, \frac{\mathcal{S}_{\text{Gardner}}^{\text{raw}}}{2.1} - \mathcal{P}_{\text{deficit}}\right)\right)$$

---

#### ۲.۳. فاز ۳: انطباق ابعاد روان‌شناختی محیط کار O*NET با MBTI
محیط کار در ۶ بعد پیوسته $E \in [0, 100]^6$ (شامل Structure, Social, Autonomy, Pace, Analytical vs. Value-based, Competitiveness) مدل‌سازی می‌شود.

برای هر یک از ۴ محور MBTI ($a \in \{EI, SN, TF, JP\}$):
* بعد متناظر محیط کار $\text{dim}(a)$ و مقدار هدف رفتاری $\tau(a) \in [0, 100]$ مشخص می‌شود.
* درصد قطعیت ترجیح کاربر ($I_a \in [0, 100]$) به‌عنوان وزن جریمه خطای محور عمل می‌کند:

$$\text{WeightFactor}_a = \frac{I_a}{100}$$
$$\text{Penalty}_a = \left( \frac{|E_{\text{dim}(a)} - \tau(a)|}{100} \right) \cdot \text{WeightFactor}_a$$

$$\mathcal{S}_{\text{MBTI}} = \max\left(0.1, \min\left(1.0, 1.0 - \frac{1}{4}\sum_{a \in \{EI, SN, TF, JP\}} \text{Penalty}_a\right)\right)$$

* **مدیریت حالت‌های ارتوگونال / خنثی ($X$):** اگر کاربر در یک بعد خنثی باشد ($I_a = 0$ یا نمره روی Midpoint)، $\text{WeightFactor}_a = 0$ شده و بدون تحمیل جریمه نامتعادل، سیستم رفتار متوازن نشان می‌دهد.

---

#### ۲.۴. فاز ۴: عملگر نمره مرکب و نگاشت رفتاری DISC
نمره نهایی تطابق از ترکیب خطی محدب (Convex Combination) با کلمپ صلب تولید می‌شود:

$$\text{Composite}(U, J) = 0.35 \cdot \mathcal{S}_{\text{Holland}} + 0.35 \cdot \mathcal{S}_{\text{Gardner}} + 0.30 \cdot \mathcal{S}_{\text{MBTI}}$$
$$\text{MatchScore}(U, J) = \text{round}\Big( \max\big(0.0, \min(1.0, \text{Composite}(U, J))\big) \times 100 \Big)$$

**موقعیت‌یابی درون‌تیمی DISC:**
بردار بلوک‌های اجباری با تفاضل $\Delta_k = \text{Most}_k - \text{Least}_k$ برای $k \in \{D, I, S, C\}$ استخراج شده و در صورت $\Delta_{\text{primary}} - \Delta_{\text{secondary}} \le 2$، پروفایل دوحرفی هایبرید (نظیر $DC$ یا $ID$) تشکیل و به ماتریس نقش‌های شغلی نگاشت می‌گردد.

---

### ۳. الگوریتم مونتاژ سبد با قید تنوع قطعی (Diversity-Constrained 7-Path Assembler)

برای حل پارادوکس «حباب فیلتر» و ارائه سبد توصیه‌ای جامع، الگوریتم یک مسئله بهینه‌سازی انتخاب مقید را روی مجموعه مرتب تمام مشاغل $\mathcal{J}_{\text{ranked}}$ اجرا می‌کند:

$$\text{Maximize} \sum_{j \in \mathcal{B}} \text{MatchScore}(U, j) \quad \text{subject to:}$$

$$\begin{cases} 
|\mathcal{B}| = 7 \\
\mathcal{B} = \{p_{\text{main}}\} \cup \mathcal{P}_{\text{alt}} \cup \mathcal{P}_{\text{comp}} \\
p_{\text{main}} = \arg\max_{j \in \mathcal{J}} \text{MatchScore}(U, j) \\
\forall p \in \mathcal{P}_{\text{alt}}: \text{Cluster}(p) = \text{Cluster}(p_{\text{main}}), \quad |\mathcal{P}_{\text{alt}}| = 3 \\
\forall p \in \mathcal{P}_{\text{comp}}: \text{Cluster}(p) \neq \text{Cluster}(p_{\text{main}}), \quad |\mathcal{P}_{\text{comp}}| = 3 \\
\forall p_i, p_j \in \mathcal{P}_{\text{comp}} \, (i \neq j): \text{Cluster}(p_i) \neq \text{Cluster}(p_j)
\end{cases}$$

```
+───────────────────────────────────────────────────────────────────────────────────────────+
| ALGORITHM: 7-Path Constrained Diversity Assembly                                          |
+───────────────────────────────────────────────────────────────────────────────────────────+
| Input: J_ranked (Sorted array of CareerEntities by MatchScore desc)                       |
| Output: Basket { mainPath, alternativePaths[3], complementaryPaths[3] }                   |
|                                                                                           |
| 1. mainPath ← J_ranked[0]                                                                 |
| 2. mainCluster ← mainPath.clusterId                                                       |
| 3. usedJobs ← { mainPath.id }, usedClusters ← { mainCluster }                            |
| 4. alternativePaths ← Filter J_ranked WHERE clusterId == mainCluster                      |
|                       EXCLUDING mainPath.id LIMIT 3                                       |
| 5. usedJobs.ADD_ALL(alternativePaths.ids)                                                 |
| 6. complementaryPaths ← []                                                                |
| 7. FOR EACH job IN J_ranked DO:                                                           |
|       IF |complementaryPaths| == 3 THEN BREAK                                             |
|       IF job.id ∉ usedJobs AND job.clusterId ∉ usedClusters THEN                          |
|           complementaryPaths.PUSH(job)                                                    |
|           usedJobs.ADD(job.id)                                                            |
|           usedClusters.ADD(job.clusterId)                                                 |
| 8. IF |complementaryPaths| < 3 THEN [Graceful Fallback Pass]                              |
+───────────────────────────────────────────────────────────────────────────────────────────+
```

---

### ۴. ویژگی‌های قابلیت اطمینان، عملکرد و معماری نرم‌افزار (Enterprise Invariants)

| مؤلفه | مشخصه مهندسی | پیاده‌سازی در کد |
| :--- | :--- | :--- |
| **Deterministic Purity** | بدون Side-Effect، ارزیابی توابع خالص (Pure Functions) | با ورودی برداری یکسان، خروجی در تمام محیط‌ها بی کم‌وکاست همسان است. |
| **Computational Complexity** | پیچیدگی زمانی $\mathcal{O}(|\mathcal{J}| \cdot D + |\mathcal{J}| \log |\mathcal{J}|)$ | با دیتابیس فعلی ($|\mathcal{J}|=65, D=8$)، زمان اجرا **کمتر از ۰.۵ میلی‌ثانیه** (بدون نیاز به GPU/WASM). |
| **Memory Allocation** | پروفایل تخصیص بدون فشار به GC | ساختار داده‌ها مسطح (Flat)، بدون رفرنس‌های حلقوی و سازگار با V8 Optimizer. |
| **Fault-Tolerance** | تخریب تدریجی امن (Graceful Degradation) | در صورت نقص در ۱ تا ۳ آزمون، Baseline Priors تزریق شده و اجرای سیستم متوقف نمی‌شود. |
| **Type Safety & Contracts** | سیستم تیپ ایستا با تایپ‌اسکریپت Strict | اعتبارسنجی ۱۰۰٪ ساختارهای ورودی/خروجی در زمان کامپایل (Zero Runtime Type Coercion). |

---

### ۵. ماتریس تفاوت‌های معماری: مقایسه با سیستم‌های مرسوم

```
+──────────────────────────┬──────────────────────────────┬──────────────────────────────+
| بُعد ارزیابی             | موتورهای سنتی ادتک (V1)       | سامانه چندمعیاره پیشرفته (V2) |
+──────────────────────────┼──────────────────────────────┼──────────────────────────────+
| هم‌پوشانی رغبتی          | مقایسه رشته‌ای کد هالند      | کسینوس پیوسته در فضای R^6    |
| توانمندی شناختی          | میانگین ساده نمرات گاردنر     | وزن‌دهی رتبه‌ای + جریمه کسری  |
| تناسب رفتاری             | برچسب‌های متنی صلب           | نگاشت بردار ۶بعدی محیط O*NET |
| حل تعارض در تساوی نمرات | رندوم یا نامشخص               | دترمینستیک ۳ مرحله‌ای (واریانس) |
| تنوع سبد خروجی           | حباب فیلتر (شغل‌های تکراری)   | تفکیک قیدگذاری‌شده بین‌کلاستری |
| مفسرپذیری (XAI)          | خروجی نهایی بدون استدلال      | تولید خودکار دلایل ۴گانه ریاضی|
+──────────────────────────┴──────────────────────────────┴──────────────────────────────+
```

---

---

### ۶. معماری پیاده‌سازی‌شده موتور چندمعیاره پیشرفته (PathEngine V3 Architecture)

```
                       [ PathEngine V3 Complete Pipeline ]
                                       │
     ┌─────────────────────────────────┼─────────────────────────────────┐
     ▼                                 ▼                                 ▼
[Adaptive Priors Layer]       [20D MMR Diversity]           [Orthogonal Dual-Score]
 - Alpha_H (Holland Spread)    - R^20 Multimodal Vector      - PsychometricFit [0..100]
 - Alpha_G (Gardner Variance)  - L2 Unit Normalization       - MarketViabilityScore [0..100]
 - Alpha_M (MBTI Intensity)    - Fast O(1) Dot-Product Sim   - StrategicScore = 0.7*P + 0.3*M
 - Dynamic Re-normalization    - Lambda=0.65 Diversity      - AI Risk & Career Pivot Map
```

#### ۶.۱. لایه وزن‌دهی تطبیقی بر پایه قطعیت کاربر (Confidence-Weighted Adaptive Priors)
به جای اوزان ثابت، ضرایب قابلیت اتکا ($\alpha_k \in [0.3, 1.0]$) به صورت پویا محاسبه می‌شوند:
* **قطعیت هالند ($\alpha_H$):** $\alpha_H = \max\left(0.4, \min\left(1.0, \frac{\text{Score}_{\max} - \text{Score}_{\min}}{100}\right)\right)$
* **قطعیت گاردنر ($\alpha_G$):** $\alpha_G = \max\left(0.4, \min\left(1.0, \frac{\sigma_{\text{Gardner}}^2}{1.5}\right)\right)$
* **قطعیت MBTI ($\alpha_M$):** $\alpha_M = \max\left(0.3, \min\left(1.0, \frac{1}{4}\sum_{a} \frac{I_a}{100}\right)\right)$
* **نرمال‌سازی مجدد:** $W_k^* = \frac{W_k^{\text{base}} \cdot \alpha_k}{\sum_{m \in \{H,G,M\}} W_m^{\text{base}} \cdot \alpha_m}$ با اوزان پایه $[0.35, 0.35, 0.30]$.

---

#### ۶.۲. بردار تعبیه‌سازی چندوجهی ۲۰ بعدی و تنوع بیشینه حاشیه‌ای (20D Multimodal MMR)
هر شغل $j$ در یک فضای برداری ۲۰ بعدی $\mathbb{R}^{20}$ مدل‌سازی می‌شود:
$$V_j^{\text{raw}} = \Big[ 0.45 \cdot \hat{v}_{\text{RIASEC}} (\mathbb{R}^6) \parallel 0.35 \cdot \hat{v}_{\text{Gardner}} (\mathbb{R}^8) \parallel 0.20 \cdot \hat{v}_{\text{WorkEnv}} (\mathbb{R}^6) \Big]$$
با نرمال‌سازی واحد به طول اقلیدسی:
$$V_j = \frac{V_j^{\text{raw}}}{\|V_j^{\text{raw}}\|_2} \implies \|V_j\|_2 = 1.0$$
که در نتیجه شباهت کسینوسی میان دو شغل صرفاً با ضرب داخلی (Dot Product) در زمان $\mathcal{O}(1)$ محاسبه می‌شود:
$$\text{Sim}(j_1, j_2) = \langle V_{j_1}, V_{j_2} \rangle$$

انتخاب ۳ مسیر مکمل سبد با تابع بهینه‌سازی MMR با ضریب $\lambda = 0.65$ و قید کلاسترهای غیرتکراری انجام می‌پذیرد:
$$\text{MMR}(c) = 0.65 \cdot \left(\frac{\text{MatchScore}(c)}{100}\right) - 0.35 \cdot \max_{s \in \mathcal{B}} \langle V_c, V_s \rangle$$

---

#### ۶.۳. رویکرد دو محوره مستقل و نمره راهبردی (Dual-Score & Strategic Viability)
برای جلوگیری از مخدوش شدن استعداد ذاتی فرد، نمره روان‌سنجی از ارزیابی بازار کار تفکیک می‌شود:
* **نمره شایستگی روان‌سنجی ($\text{PsychometricFit} \in [0, 100]$):** برآیند هالند، گاردنر و MBTI با اوزان تطبیقی.
* **شاخص پایداری بازار کار ($\text{MarketViabilityScore} \in [10, 100]$):**
  $$\text{MarketViabilityScore} = \text{round}\Big( 0.40 \cdot (100 - \text{AutomationRisk}) + 0.35 \cdot \text{DemandScore} + 0.25 \cdot \text{RemoteScore} \Big)$$
* **نمره راهبردی تلفیقی V3 ($\text{StrategicScore} \in [0, 100]$):**
  $$\text{StrategicScore} = \text{round}\Big( 0.70 \cdot \text{PsychometricFit} + 0.30 \cdot \text{MarketViabilityScore} \Big)$$

---

#### ۶.۴. ساختار افشای تدریجی اطلاعات در رابط کاربری (Progressive Disclosure UI)
* **لایه ۱ (Card Glance):** نمایش سریع نمرات دوگانه، برچسب‌های پایداری بازار، شاخه نهم به دهم و نقش رفتاری.
* **لایه ۲ (4-Tab Interactive Dossier Modal):**
  * **تب ۱: مفسرپذیری روان‌سنجی (XAI):** تفکیک نمرات ۴گانه و دلایل ساختاریافته ریاضی برای هر آزمون.
  * **تب ۲: نقشه راه تحصیلی:** هدایت پایه نهم به دهم، گرایش‌های دانشگاهی تا تحصیلات تکمیلی، و گواهینامه‌های کلیدی رزومه‌ساز.
  * **تب ۳: بازار کار و ریسک هوش مصنوعی:** رنج حقوقی ماهیانه بازار ایران، درصد امکان دورکاری، و مسیرهای مجاور جهت پیوت شغلی (`adjacentCareerIds`).
  * **تب ۴: جایگاه درون‌تیمی (DISC):** تبیین عنوان نقش سازمانی، نقاط قوت عملیاتی و راهکارهای رشد رفتاری.