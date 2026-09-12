# نَسَق — منصة ذكاء اصطناعي تتكيف معك

> **الحالة:** U1.2 مكتملة ومتحققة؛ عقد U2 Service Depth جاهز للتنفيذ ولم يبدأ كود U2 بعد
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
- **عقد U2:** [Service Depth](docs/01-product/U2-SERVICE-DEPTH.md)
- **مصفوفة U2:** [Traceability, QA, and Evidence](docs/04-delivery/U2-TRACEABILITY-AND-QA.md)
- **طلب الوكيل التالي:** [U2 Implementation Prompt](docs/05-agent-context/U2-IMPLEMENTATION-PROMPT.md)
- **إيصال التخطيط:** [U2 Planning Verification](docs/04-delivery/U2-PLANNING-VERIFICATION.md)

## منهج تشغيل الوكلاء

يحمل المستودع طبقة تشغيل قابلة لإعادة الاستخدام مع أي مشروع، كي يبدأ الوكيل من السياق والأدلة بدل القفز من الطلب إلى الكود:

- [`AGENTS.md`](AGENTS.md) — نقطة الدخول وقواعد نَسَق الخاصة.
- [`AGENT-OPERATING-METHOD.md`](AGENT-OPERATING-METHOD.md) **v2.0** — منهج محايد شامل: تحليل المتطلبات، هندسة السياق والتعليمات والأوامر، المعمارية، تقسيم العمل، تنظيم الكود، الاختبارات والتقييمات، الأمن، الصيانة، دورة حياة الوكيل، التحقق، والتسليم بالأدلة.
- [`.agents/skills/evidence-led-agent-workflow/SKILL.md`](.agents/skills/evidence-led-agent-workflow/SKILL.md) **v2.0.0** — Skill محمولة ومتوافقة مع مواصفة Agent Skills لتفعيل المنهج الكامل دون تكرار المصدر الأساسي.
- [`agent-skills-web-uiux/`](agent-skills-web-uiux/) — مكتبة البحث والتقرير العربي والمقتطفات والتدقيقات الخاصة بالـAgent Skills والتصميم وUI/UX والويب.
- [`CLAUDE.md`](CLAUDE.md) و[`GEMINI.md`](GEMINI.md) و[تعليمات Copilot](.github/copilot-instructions.md) — ملفات اكتشاف خفيفة تشير إلى المصدر الأساسي دون إنشاء قواعد متعارضة.
- [إيصال تحقق v2.0](docs/04-delivery/AGENT-OPERATING-METHOD-V2-VERIFICATION.md) — البحث، المراجعة الشاملة، validator، البوابات، commit، وdeployment.
- [إيصال الإصدار الأول](docs/04-delivery/AGENT-OPERATING-METHOD-VERIFICATION.md) — سجل التحقق التاريخي السابق.

تكامل المنهج والمكتبة في commit `b225c5cb2508b4191b92ad43999de3ee6145f983` ونُشر عبر Vercel deployment `dpl_9QEhikhxnXoWj2rhCtypwK9AFZAD` بالحالة `READY`.

المكتبة لقطة بحث مؤرخة، وليست إذنًا آليًا لتشغيل أكواد الجهات الخارجية. يجب قراءة التقرير وتدقيق المصدر والإصدار والترخيص والسكربتات والـhooks والصلاحيات، ثم تحميل المهارات المناسبة فقط وفق progressive disclosure.

## بوابات نَسَق

| الخدمة | المسار العربي | وعد البوابة — عمق U2 مخطط ولم يُنفذ بعد |
|---|---|---|
| اسأل وتحدث | `/ar/app/chat` | مساحة تفكير ومحادثة مرنة |
| تعلّم بعمق | `/ar/app/learn` | شرح وخطة واختبارات فهم |
| ابحث ووثّق | `/ar/app/research` | بحث موجه ومخرجات بمصادر |
| اكتب وصمّم | `/ar/app/create` | مستندات وصور ولوحة إبداع |
| برمج وابنِ | `/ar/app/code` | خطة وملفات ومعاينة |
| حلّل وافهم | `/ar/app/analyze` | جداول ورسوم وتحقق بيانات |
| استكشف واكتشف | `/ar/app/explore` | رحلات معرفية وخرائط أفكار |
| مكتبتي | `/ar/app/library` | دروس وتقارير ومستندات ومشاريع |

استبدل `ar` بـ`en` لكل تجربة إنجليزية/LTR. المسارات موجودة حاليًا، لكنها ما زالت تستخدم workspace عامًا ونتيجة محاكاة مشتركة؛ عقد U2 أعلاه هو الذي يحولها إلى workflows وartifacts متخصصة.

## ما تغير في Universal Experience U1

- Landing مضيئة ومستقبلية جديدة بدل الهوية المؤسسية السابقة.
- Home يسأل عن الهدف ويكيّف ترتيب الخدمات والبدايات المقترحة.
- تخصيص بالأهداف لا بالمهنة، مع حفظ محلي وتحكم مباشر وشرح «لماذا أرى هذا؟».
- سبع بوابات واضحة بدل وضع Projects / Agents / Flows في مقدمة التجربة.
- كل بوابة لها هوية ومساحة تمهيدية ونمط موجه/سريع؛ عمق workflow والمخرج المتخصص محدد للتنفيذ في U2.
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

### لغة U1.2 للحركة والتغذية الراجعة

- motion tokens مركزية للمدة، easing، المسافة، الدخول، الخروج، progress، ودورة النشاط.
- حركة وظيفية قصيرة للضغط والتبويبات والتنقل والبطاقات وroute changes، دون bounce أو parallax.
- دخول وخروج منضبط للقوائم وdrawer وnotifications وcommand palette والحوارات وbottom sheets.
- حالات مشتركة وواضحة لـvalidation/error، working/progress، success/completion، empty، وrecovery.
- المؤلف ومساحات الخدمات تلغي timer القديم عند تعديل الطلب، فلا تصل نتيجة stale خارج سياقها.
- toast حفظ التخصيص ثابت حتى يغلقه المستخدم، وLibrary تقدم مسح البحث والتصفية بنقرة واحدة.
- أزيلت الحلقات الزخرفية المفتوحة؛ الحركة الدورية الوحيدة مؤشر صغير أثناء busy الفعلي.
- `prefers-reduced-motion` يزيل الحركة المكانية والنشاط البصري غير الضروري مع بقاء النص والدلالة والوظيفة.
- forced colors، keyboard، screen-reader semantics، RTL/LTR، responsive، وثلاثة محركات ضمن بوابة الاختبار.

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

نتيجة U1.2 المحلية والإنتاجية في 2026-09-12:

- ESLint: ناجح دون warnings.
- TypeScript strict عبر workspaces: ناجح.
- Vitest: **4/4**.
- Playwright الكامل على Chromium: **46/46**.
- مصفوفة U1 وU1.1 وU1.2 على Chromium وFirefox وWebKit: **88 ناجحًا + تجاوزان متوقعان** لاختبار forced-colors خارج Chromium، من أصل 90.
- Production build: ناجح؛ **57 static pages** مع detail routes الديناميكية.
- Axe WCAG 2.0/2.1/2.2 A/AA: بلا مخالفات serious أو critical في بوابة Chromium/Firefox.
- عشرة أحجام أساسية، وإعادة تدفق مكافئة لتكبير `200%`: بلا document-level horizontal overflow.
- تسع حالات مرئية لـU1.2: HTTP `200`، أخطاء console/page تساوي `0`، وoverflow أفقي يساوي `0`.
- npm audit: **0 vulnerabilities**.
- بوابة U1.2 مباشرة على alias الإنتاج عبر المحركات الثلاثة: **22 ناجحًا + تجاوزان متوقعان** من 24.
- بوابة الانحدار U1/U1.1 مباشرة على الإنتاج في Chromium: **22/22**.
- Vercel deployment المطابق لتنفيذ U1.2: `dpl_HWsQ7JrCqrFZFQY4tbahjyfCwF39` بالحالة `READY`.

تفاصيل U1.2 والأدلة: [U1.2 Motion & Feedback Verification](docs/04-delivery/U1-2-MOTION-VERIFICATION.md). baseline السابق: [U1.1 Responsive Verification](docs/04-delivery/U1-1-RESPONSIVE-VERIFICATION.md).

## الهيكلة

```text
nasaq-ai/
├── AGENTS.md                       ← نقطة دخول الوكلاء وقواعد المشروع
├── AGENT-OPERATING-METHOD.md       ← المنهج التشغيلي المحمول
├── .agents/skills/                 ← Skill لاكتشاف المنهج تدريجيًا
├── agent-skills-web-uiux/          ← مكتبة البحث والتدقيق والمهارات
├── apps/web/
│   ├── components/universal/       ← التجربة + feedback primitives
│   ├── components/app-shell/       ← التنقل المتكيف الجديد
│   ├── lib/universal-content.ts    ← خدمات ومحتوى عربي/إنجليزي
│   ├── app/universal.css           ← entrypoint مرتب لنظام الواجهة
│   └── app/styles/universal/       ← Luminous System + motion layer
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
    ├── 04-delivery/
    └── 05-agent-context/
```

## المرحلة التالية

حزمة تخطيط **U2 Service Depth** مكتملة في [العقد](docs/01-product/U2-SERVICE-DEPTH.md) و[مصفوفة القبول](docs/04-delivery/U2-TRACEABILITY-AND-QA.md). يبدأ الوكيل التالي بـ`U2.0` للعقود والمحاكي وService Workbench، ثم Learn وResearch وCreate وCode وAnalyze وExplore، وأخيرًا Ask/Library/handoffs والتقوية. يستمر العقد الحالي: Frontend ومحاكاة صريحة أولًا؛ لا Backend أو بحث حي أو معالجة ملفات أو تنفيذ كود أو ربط مزودين إلا في milestone معتمد مستقل.
