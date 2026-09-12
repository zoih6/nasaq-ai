# نَسَق — منصة ذكاء اصطناعي تتكيف معك

> **الحالة:** Universal Experience U1.1 — صقل responsive والتفاعل مكتمل ومتحقق عبر ثلاثة محركات
>
> **المنتج:** منصة عربية/إنجليزية للتعلّم والبحث والصناعة والبرمجة والتحليل والاستكشاف
>
> **النطاق الحالي:** Frontend تفاعلي بمحاكاة صريحة؛ Backend والمزودون مؤجلون

نَسَق لا يبدأ من نموذج أو وكيل أو قائمة إعدادات. يبدأ من سؤال بسيط:

> **ماذا تريد أن تنجز اليوم؟**

ثم يفتح للمستخدم المساحة المناسبة ويحافظ على السياق الذي يختار الاحتفاظ به. يمكن لأي شخص استخدام المنصة، بينما تبقى إمكانات الوكلاء والتدفقات والنماذج متاحة تدريجيًا للمستخدم المتقدم.

## الروابط

- **الإنتاج:** <https://nasaq-ai.vercel.app>
- **العربية:** <https://nasaq-ai.vercel.app/ar>
- **الإنجليزية:** <https://nasaq-ai.vercel.app/en>
- **المساحة المتكيفة:** <https://nasaq-ai.vercel.app/ar/app/home>
- **GitHub:** <https://github.com/zoih6/nasaq-ai> — مستودع خاص
- **قرار إعادة التأسيس:** [NASAQ Universal Reset](docs/00-vision/NASAQ-UNIVERSAL-RESET.md)
- **عقد النشر:** [GitHub and Vercel deployment](docs/04-delivery/DEPLOYMENT.md)

## بوابات نَسَق

| الخدمة | المسار العربي | ما تقدمه الواجهة الحالية |
|---|---|---|
| اسأل وتحدث | `/ar/app/chat` | مساحة تفكير ومحادثة مرنة |
| تعلّم بعمق | `/ar/app/learn` | شرح وخطة واختبارات فهم |
| ابحث ووثّق | `/ar/app/research` | بحث موجه ومخرجات بمصادر |
| اكتب وصمّم | `/ar/app/create` | مستندات وصور ولوحة إبداع |
| برمج وابنِ | `/ar/app/code` | خطة وملفات ومعاينة |
| حلّل وافهم | `/ar/app/analyze` | جداول ورسوم وتحقق بيانات |
| استكشف واكتشف | `/ar/app/explore` | رحلات معرفية وخرائط أفكار |
| مكتبتي | `/ar/app/library` | دروس وتقارير ومستندات ومشاريع |

استبدل `ar` بـ`en` لكل تجربة إنجليزية/LTR.

## ما تغير في Universal Experience U1

- Landing مضيئة ومستقبلية جديدة بدل الهوية المؤسسية السابقة.
- Home يسأل عن الهدف ويكيّف ترتيب الخدمات والبدايات المقترحة.
- تخصيص بالأهداف لا بالمهنة، مع حفظ محلي وتحكم مباشر وشرح «لماذا أرى هذا؟».
- سبع بوابات واضحة بدل وضع Projects / Agents / Flows في مقدمة التجربة.
- كل بوابة لها مساحة تفاعلية ونمط موجه/سريع ومخرج مناسب لطبيعتها.
- مكتبة بصرية للمخرجات بدل تاريخ محادثات طويل فقط.
- App Shell جديد مضيء ومتجاوب مع تنقل هاتف مستقل.
- الإمكانات المتقدمة محفوظة خلف progressive disclosure.
- رسم hero أصلي بلا روبوتات أو أدمغة أو AI clichés.
- العربية RTL والإنجليزية LTR تعملان من نفس البنية.
- كل المحاكاة موسومة بوضوح؛ لا ادعاء بوجود مزود أو بحث أو تنفيذ حقيقي.

### صقل U1.1 للعرض والتفاعل

- نظام fluid موحد للأحجام والمسافات والخطوط، مع حد أدنى عملي للمقروئية.
- App Shell بثلاث حالات: Sidebar كامل، وIcon Rail بين `821–1180px`، وOverlay مع Bottom Navigation حتى `820px`.
- أهداف لمس أساسية لا تقل عن `44×44px`، وحالات focus/pressed/disabled و`aria-current` واضحة.
- دعم `100dvh` وsafe areas، وbottom sheets، وقِصر نافذة العرض عند ظهور لوحة مفاتيح الهاتف.
- إعادة تدفق مكافئة لتكبير `200%`، ومنع overflow عند عشرة أحجام من `320×568` إلى `1920×1080`.
- نمو تدريجي تلقائي لحقول النص مع fallback، وقوائم تغلق بـEscape وعند الانتقال بين breakpoints.
- RTL/LTR كاملان، و`prefers-reduced-motion` وhigh contrast وforced colors.
- CSS مقسم حسب المسؤولية إلى foundations وmarketing وshell وhome وworkspaces وlibrary وresponsive.

## التشغيل المحلي

المتطلبات: Node.js `>=20.9.0` وnpm `11.6.4`.

```bash
npx -y npm@11.6.4 ci
npx -y npm@11.6.4 run dev
```

## بوابات الجودة

```bash
npx -y npm@11.6.4 run check
npx playwright install chromium firefox webkit
npx -y npm@11.6.4 run test:e2e
npx -y npm@11.6.4 run test:e2e:responsive
npx -y npm@11.6.4 run test:e2e:cross-browser
npx -y npm@11.6.4 audit --audit-level=moderate
```

نتيجة U1.1 المحلية في 2026-09-12:

- ESLint: ناجح دون warnings.
- TypeScript strict عبر workspaces: ناجح.
- Vitest: **4/4**.
- Playwright الكامل على Chromium: **38/38**.
- مصفوفة U1.1 وU1 الأساسية على Chromium وFirefox وWebKit: **66/66**.
- Production build: ناجح؛ **57 static pages** مع detail routes الديناميكية.
- Axe WCAG 2.0/2.1/2.2 A/AA: بلا مخالفات serious أو critical في بوابة Chromium/Firefox.
- عشرة أحجام أساسية، وإعادة تدفق مكافئة لتكبير `200%`: بلا document-level horizontal overflow.
- سبع لقطات تسليم نهائية: HTTP `200`، أخطاء console/page تساوي `0`، وoverflow أفقي يساوي `0`.
- npm audit: 0 vulnerabilities في آخر بوابة U1؛ يعاد تشغيله عند كل تحديث للاعتمادات.

تفاصيل التحقق والأدلة: [U1.1 Responsive Verification](docs/04-delivery/U1-1-RESPONSIVE-VERIFICATION.md).

## الهيكلة

```text
nasaq-ai/
├── apps/web/
│   ├── components/universal/       ← Universal Experience U1
│   ├── components/app-shell/       ← التنقل المتكيف الجديد
│   ├── lib/universal-content.ts    ← خدمات ومحتوى عربي/إنجليزي
│   ├── app/universal.css           ← entrypoint مرتب لنظام الواجهة
│   └── app/styles/universal/       ← وحدات Luminous Adaptive System
├── packages/
│   ├── contracts/
│   ├── i18n/
│   ├── mock-api/
│   └── ui/
└── docs/
    ├── 00-vision/
    ├── 01-product/
    ├── 02-design/
    ├── 03-architecture/
    └── 04-delivery/
```

## المرحلة التالية

**U1.2 Motion & Feedback Language** هي الخطوة التالية المعتمدة: لغة حركة وظيفية، انتقالات وحالات loading/success/error متسقة، مع بقاء reduced motion مسارًا كاملًا. لا تبدأ U2 قبل إغلاق U1.2. بعد ذلك تعمّق U2 كل خدمة: تشخيص ومستويات للتعلّم، خطة ومصادر للبحث، محرر للصناعة، ملفات ومعاينة للبرمجة، جداول ورسوم للتحليل، وخرائط معرفة للاستكشاف.
