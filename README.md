# نَسَق — منصة ذكاء اصطناعي تتكيف معك

> **الحالة:** Universal Experience U1 — واجهة جديدة متكيفة ومتحققة تقنيًا
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

## التشغيل المحلي

المتطلبات: Node.js `>=20.9.0` وnpm `11.6.4`.

```bash
npx -y npm@11.6.4 ci
npx -y npm@11.6.4 run dev
```

## بوابات الجودة

```bash
npx -y npm@11.6.4 run check
npx playwright install chromium
npx -y npm@11.6.4 run test:e2e
npx -y npm@11.6.4 audit --audit-level=moderate
```

نتيجة U1 الحالية:

- ESLint: ناجح دون warnings.
- TypeScript strict عبر workspaces: ناجح.
- Vitest: **4/4**.
- Playwright: **23/23** تشمل التجربة العامة والقدرات المتقدمة.
- Production build: ناجح؛ **57 static pages** مع detail routes الديناميكية.
- فحص المتصفح الأساسي: بلا أخطاء console أو page errors.
- Desktop وMobile: بلا document-level horizontal overflow في الأسطح الجديدة المختبرة.
- npm audit: 0 vulnerabilities.

## الهيكلة

```text
nasaq-ai/
├── apps/web/
│   ├── components/universal/       ← Universal Experience U1
│   ├── components/app-shell/       ← التنقل المتكيف الجديد
│   ├── lib/universal-content.ts    ← خدمات ومحتوى عربي/إنجليزي
│   └── app/universal.css           ← Luminous Adaptive System
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

الموجة U2 تعمّق كل خدمة بدل إضافة بطاقات سطحية: تشخيص ومستويات للتعلّم، خطة ومصادر للبحث، محرر للصناعة، ملفات ومعاينة للبرمجة، جداول ورسوم للتحليل، وخرائط معرفة للاستكشاف. يلي ذلك Auth والحفظ والذاكرة الصريحة ورفع الملفات، ثم ربط المزودين وBYOK والرصيد والأدوات خلف حدود أمنية واضحة.
