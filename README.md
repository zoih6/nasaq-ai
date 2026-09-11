# نَسَق AI — دليل المشروع

> **الحالة:** Frontend workspace prototype مكتمل، متحقق تقنيًا، ومنشور  
> **المرحلة الحالية:** Backend-ready contracts and interaction handoff  
> **الجمهور الأول:** محترفون وفرق عربية صغيرة

نَسَق مساحة عمل عربية أولًا تجمع **المحادثة → الوكيل → التدفق** مع سياق مشترك، موافقات ظاهرة، وتكلفة قابلة للتفسير.

## الروابط

- **الإنتاج:** <https://nasaq-ai.vercel.app>
- **GitHub:** <https://github.com/zoih6/nasaq-ai> (مستودع خاص)
- **عقد النشر:** [GitHub and Vercel deployment](docs/04-delivery/DEPLOYMENT.md)

## شغّل النموذج

المتطلبات: Node.js `>=20.9.0` وnpm `11.6.4` المعلن في `packageManager`.

```bash
npx -y npm@11.6.4 ci
npx -y npm@11.6.4 run dev
```

ثم افتح:

- `/ar` — Marketing بالعربية وRTL.
- `/en` — Marketing بالإنجليزية وLTR.
- `/ar/preview` — معاينة المنتج الاحترافية والتفاعلية.
- `/ar/app/home` — مركز القيادة.
- `/ar/app/chat` — محادثة تجريبية تفاعلية.
- `/ar/app/projects` → `/agents` → `/flows` → `/runs` — المسار التشغيلي الكامل.
- `/ar/app/knowledge` — مجموعات ومصادر واختبار استرجاع.
- `/ar/app/models`، `/tools`، `/skills` — كتالوج القدرات والمخاطر والمصدر.
- `/ar/app/usage`، `/billing`، `/team`، `/settings` — الإدارة والتكلفة والسياسات.

استبدل `ar` بـ`en` لكل مسار إنجليزي/LTR.

> استخدم npm 11.6.4 في هذه البيئة؛ npm 10.8.2 أصاب خطأ Arborist أثناء peer resolution.

## ما يعمل الآن

- Marketing ثنائي اللغة يشرح مسار Chat → Agent → Flow ويربط إلى جولة المنتج.
- معاينة احترافية مستقلة بثلاثة سيناريوهات، تنقل مرحلي، وكيل مضبوط، تدفق حي، بوابة موافقة وإيصال تكلفة.
- App Shell متجاوب: sidebar، bottom navigation، لوحة أوامر، إشعارات، مساحة عمل، تبديل لغة وحفظ deep link.
- Home Command Center: تشغيلات نشطة، موافقة، رصيد هجين، مشاريع، ونماذج مقترحة.
- Chat محلي تفاعلي: starter prompts، model menu، compare، attachment، streaming، stop/reset، وإيصال تكلفة تجريبي.
- Projects عملية: بحث وفلاتر وإنشاء وسياق يربط الوكلاء والتدفقات والتشغيلات.
- Agent builder متعدد الخطوات: تعليمات، نموذج، أدوات، حدود، حماية واختبار حتمي.
- Flow editor بعقد قابلة للاختيار والسحب واختبار يتوقف عند بوابة موافقة.
- Runs وApprovals: timeline وأحداث ومخرج وتكلفة ودافع وapprove/reject وإيصال JSON.
- Knowledge: collections ومصادر وحالات معالجة وretrieval test يعرض المقاطع المطابقة.
- Models/Tools/Skills: مقارنة، تفاصيل، routing، مخاطر، صلاحيات، provenance وترخيص.
- Usage/Billing: estimate/reserved/actual، ledger، breakdown، رصيد، ميزانيات وتعبئة تجريبية.
- Team/Settings: دعوات وأدوار وBYOK وتكاملات وخصوصية وسجل تدقيق.
- Zod contracts وtyped mock API وdata boundaries وواجهة UI مشتركة وخطوط محلية.
- لا مفاتيح حقيقية، لا دفع، ولا تنفيذ أدوات أو اتصالات مزودين.

## تحقق الجودة

```bash
npx -y npm@11.6.4 run check
npx playwright install chromium
npx -y npm@11.6.4 run test:e2e
npx -y npm@11.6.4 audit --audit-level=moderate
```

آخر إيصال موثق: [Frontend Prototype Verification](docs/04-delivery/FRONTEND-PROTOTYPE-VERIFICATION.md).

النتيجة الحالية:

- ESLint: ناجح دون warnings.
- TypeScript strict عبر workspaces: ناجح.
- Vitest: 4/4.
- Playwright: **22/22** عبر المعاينة، الانحدار، المسار التشغيلي، ووحدات الإدارة.
- Axe: بلا مخالفات serious/critical على الأسطح والحالات الحرجة المختبرة.
- Mobile 390×844: بلا document-level horizontal overflow في المصفوفة المختبرة.
- Production build: ناجح؛ 43 static pages بالإضافة إلى detail routes الديناميكية.
- npm audit: 0 vulnerabilities.

## الوثائق الأساسية

### الرؤية والمنتج

- [رؤية المنتج — HTML](docs/00-vision/nasaq-ai-product-vision-ar.html)
- [رؤية المنتج — Markdown](docs/00-vision/nasaq-ai-product-vision-ar.md)
- [PRD التنفيذية — HTML](docs/01-product/PRD.html)
- [PRD التنفيذية — Markdown](docs/01-product/PRD.md)
- [Sitemap](docs/01-product/SITEMAP.md)
- [Screen Inventory](docs/01-product/SCREEN-INVENTORY.md)
- [State Machines](docs/01-product/STATE-MACHINES.md)

### التصميم والمعمارية

- [Design System](docs/02-design/DESIGN.md)
- [Frontend Architecture](docs/03-architecture/FRONTEND-ARCHITECTURE.md)
- [Contracts](docs/03-architecture/CONTRACTS.md)
- [Permissions](docs/03-architecture/PERMISSIONS.md)

### التسليم

- [Wave 1 Verification](docs/04-delivery/WAVE-1-VERIFICATION.md)
- [Professional Preview Verification](docs/04-delivery/PROFESSIONAL-PREVIEW-VERIFICATION.md)
- [Frontend Prototype Verification](docs/04-delivery/FRONTEND-PROTOTYPE-VERIFICATION.md)
- [الأدلة البصرية](docs/04-delivery/evidence/)

## القرارات المحسومة

- عربي أولًا مع إنجليزية كاملة وRTL/LTR من route منذ البداية.
- تجربة متكاملة لـChat وProjects وAgents وFlows وKnowledge وModels/Usage.
- Frontend وعقود وmock scenarios قبل Backend وربط المزودين.
- نموذج وصول هجين: مفاتيح المستخدم `BYOK` + رصيد موحد من المنصة.
- هوية **Precision Workspace**: أسطح حجرية دافئة، حبر أخضر، teal للأفعال، amber للموافقات؛ بلا gradients أو glassmorphism أو AI clichés.

## هيكلة المشروع

```text
nasaq-ai/
├── apps/web/               ← Next.js application وE2E
├── packages/
│   ├── contracts/          ← Zod schemas وDTOs
│   ├── i18n/               ← locale/direction/dictionaries
│   ├── mock-api/           ← fixtures متحققة بالعقود
│   ├── ui/                 ← primitives مشتركة
│   └── config/             ← إعدادات مشتركة
├── docs/
│   ├── 00-vision/
│   ├── 01-product/
│   ├── 02-design/
│   ├── 03-architecture/
│   └── 04-delivery/
├── assets/
└── tools/
```

## المرحلة التالية

الواجهة المتكاملة وعقودها أصبحت جاهزة لتسليم Backend. الخطوة التالية هي تنفيذ **session/auth، persistence، event ledger، idempotent approvals، provider router، secrets boundary، وbilling integration** خلف حدود البيانات الحالية، مع إبقاء كل أثر حساس متوقفًا حتى مراجعة أمنية واختبارات عقد مستقلة.
