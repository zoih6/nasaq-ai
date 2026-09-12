# U1.1 — Responsive & Interaction Verification

**تاريخ البوابة المحلية:** 2026-09-12
**الحالة:** ناجحة محليًا؛ يُستكمل إيصال الإنتاج بعد نشر commit التسليم
**النطاق:** Frontend ومحاكاة صريحة فقط؛ لا Backend أو providers حقيقيين

## 1. ما أُغلق في U1.1

- نظام موحد لأحجام ومسافات وخطوط fluid مع حد عملي للمقروئية.
- App Shell بثلاث حالات:
  - Sidebar كامل للشاشات الواسعة.
  - Icon Rail بعرض `76px` بين `821px` و`1180px`.
  - Overlay drawer مع Bottom Navigation حتى `820px`.
- طي Sidebar اليدوي دون بقاء labels مخفية تشغل المساحة، مع titles و`aria-current`.
- إخفاء drawer المغلق بـ`visibility` و`pointer-events` حتى لا تبقى روابطه في مسار لوحة المفاتيح.
- أهداف لمس أساسية لا تقل عن `44×44px`، بما فيها لوحة الأوامر وروابط الأدوات المتقدمة.
- دعم `100dvh` وsafe areas وbottom sheets وvisual viewport القصير عند ظهور لوحة مفاتيح الهاتف.
- نمو تلقائي تدريجي لحقول النص عبر `field-sizing: content` مع fallback وحدود ارتفاع.
- إغلاق قوائم Landing وApp Shell بـEscape، وتنظيف حالة overlay عند الانتقال إلى breakpoint أكبر.
- RTL/LTR، و`prefers-reduced-motion`، و`prefers-contrast`، وforced colors.
- تقسيم CSS إلى وحدات foundations وmarketing وshell وhome وworkspaces وlibrary وresponsive.

## 2. مصفوفة العرض

| الحالة | الحجم | نمط التنقل المتوقع |
|---|---:|---|
| هاتف صغير | `320×568` | Overlay + Bottom Navigation |
| هاتف | `360×800` | Overlay + Bottom Navigation |
| هاتف حديث | `390×844` | Overlay + Bottom Navigation |
| هاتف كبير | `412×915` | Overlay + Bottom Navigation |
| Tablet رأسي | `768×1024` | Overlay + Bottom Navigation |
| Tablet كبير | `820×1180` | Overlay + Bottom Navigation |
| Tablet أفقي | `1024×768` | Icon Rail |
| Laptop | `1280×720` | Sidebar كامل |
| Desktop | `1440×900` | Sidebar كامل |
| Wide desktop | `1920×1080` | Sidebar كامل |

أضيفت بوابة مستقلة عند `640×720` للتحقق من إعادة التدفق المكافئة لتكبير `200%` لواجهة بعرض `1280px`.

## 3. نتائج البوابات

### البوابة البرمجية

```text
npm run check
ESLint                 PASS
TypeScript workspaces  PASS
Vitest                 4/4 PASS
Next production build  PASS — 57 pages
```

### Playwright الكامل

```text
Chromium — جميع ملفات E2E: 38/38 PASS
```

يشمل ذلك اختبارات U1/U1.1 واختبارات القدرات المتقدمة الموجودة، لمنع regressions خارج الأسطح الجديدة.

### بوابة U1.1 متعددة المحركات

```text
Chromium + Firefox + WebKit
U1 الأساسية + Responsive matrix: 66/66 PASS
```

تشمل البوابة:

- الأحجام العشرة من `320×568` إلى `1920×1080`.
- عدم وجود document-level horizontal overflow.
- Sidebar / Rail / Mobile drawer / Bottom Navigation.
- الطي اليدوي وإزالة المساحة الوهمية للـlabels.
- أهداف لمس `44×44px`.
- bottom sheets وvisual viewport بارتفاع `568px` لمحاكاة لوحة المفاتيح.
- RTL/LTR وreduced motion وإعادة تدفق `200%`.
- البحث والتصفية والتخصيص والتنقل بين الخدمات.

### الوصول

- Axe مضبوط على WCAG 2.0 A/AA و2.1 A/AA و2.2 AA.
- لا مخالفات `serious` أو `critical` في بوابة Chromium/Firefox.
- تشغيل axe المحقون داخل Playwright WebKit غير مستقر على بعض الصفحات الطويلة؛ لذلك تبقى بوابة WebKit مخصصة للسلوك والتخطيط والـoverflow، بينما ينفذ محركان مستقلان بوابة WCAG.

## 4. الأدلة البصرية

| الدليل | ما يثبته |
|---|---|
| [`landing-phone-320-ar.png`](evidence/u1-1/landing-phone-320-ar.png) | Landing عربية عند الحد الأدنى `320px` |
| [`home-phone-390-ar.png`](evidence/u1-1/home-phone-390-ar.png) | Home والـcomposer وBottom Navigation على الهاتف |
| [`home-phone-drawer-390-ar.png`](evidence/u1-1/home-phone-drawer-390-ar.png) | Overlay drawer وحجب الخلفية |
| [`research-tablet-768-ar.png`](evidence/u1-1/research-tablet-768-ar.png) | مساحة خدمة على Tablet رأسي |
| [`home-rail-1024-ar.png`](evidence/u1-1/home-rail-1024-ar.png) | Icon Rail على Tablet أفقي |
| [`library-desktop-1440-ar.png`](evidence/u1-1/library-desktop-1440-ar.png) | Library على Desktop عربي/RTL |
| [`home-wide-1920-en.png`](evidence/u1-1/home-wide-1920-en.png) | Home إنجليزية/LTR على Wide desktop |

القياسات الآلية محفوظة في [`visual-metrics.json`](evidence/u1-1/visual-metrics.json): الحالات السبع أعادت HTTP `200`، وبلغ overflow الأفقي `0`، ولم تسجل console أو page errors.

## 5. الأوامر القابلة لإعادة التشغيل

```bash
npx -y npm@11.6.4 run check
npx playwright install chromium firefox webkit
npx -y npm@11.6.4 run test:e2e
npx -y npm@11.6.4 run test:e2e:responsive
npx -y npm@11.6.4 run test:e2e:cross-browser
```

## 6. ما لم يدخل U1.1

- لغة الحركة التعبيرية الموحدة مؤجلة إلى **U1.2 Motion & Feedback Language**.
- Authentication والحفظ السحابي والذاكرة ورفع الملفات مؤجلة.
- Neon/Supabase وmodel providers والبحث الحقيقي وBYOK والرصيد لم تُربط بعد.
- لا تغيّر U1.1 حقيقة أن النتائج الحالية محاكاة Frontend معلّمة بوضوح.

## 7. إيصال النشر

- خط أساس الإنتاج قبل U1.1: `2659133dff4d78e3e0dbc1dd8400799a6060bc80`.
- GitHub: <https://github.com/zoih6/nasaq-ai> — `main`.
- الإنتاج: <https://nasaq-ai.vercel.app>.
- commit وVercel deployment الخاصان بـU1.1 يضافان بعد اكتمال النشر والتحقق الحي.
