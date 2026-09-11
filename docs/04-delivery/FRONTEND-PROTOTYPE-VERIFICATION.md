# إيصال اكتمال Frontend Prototype — نَسَق AI

**التاريخ:** 2026-09-11  
**النطاق:** مساحة المنتج العربية/الإنجليزية كاملة من السياق إلى التفويض والتشغيل والإدارة  
**الحالة:** مكتمل ومتحقق تقنيًا بوصفه Prototype محليًا؛ لا Backend أو دفع أو أدوات خارجية حقيقية

## النتيجة

تحولت جميع صفحات الوحدات داخل App Shell من scaffolds ساكنة إلى أسطح عملية قابلة للبحث والتصفية والنقر والإنشاء والمراجعة. المسار المركزي يعمل طرفًا إلى طرف:

```text
Project context → Agent builder → Flow editor → Run timeline → Approval decision → Receipt
```

وتكتمل حوله وحدات المعرفة، كتالوج النماذج والأدوات والمهارات، الاستخدام والفوترة، الفريق، والإعدادات.

## الأسطح المنفذة

### العمل والتفويض

- **Projects**: مكتبة، بحث، حالة النشاط، اكتمال السياق، إنشاء محلي، وصفحة مشروع تربط السياق والوكلاء والتدفقات والتشغيلات.
- **Agents**: مكتبة وحالات إصدار، ومنشئ متعدد الخطوات للهوية والتعليمات والنموذج والحدود والأدوات والحماية والاختبار الحتمي.
- **Flows**: مكتبة، محرر عقد قابل للسحب والاختيار، إعدادات العقد، validation summary، واختبار يتوقف بأمان عند الموافقة.
- **Runs**: سجل مفلتر، تفاصيل خطة وخطوات وأحداث ومخرجات وتكلفة، قرار approve/reject، وإيصال JSON محلي.

### المعرفة والقدرات

- **Knowledge**: مجموعات ومصادر وحالات processing صريحة، إضافة ملف/URL/نص بمحاكاة آمنة، وصفحة collection مع retrieval test يعرض المقاطع ودرجات المطابقة.
- **Models**: كتالوج بقدرات وسياق وتوفر وسعر وطريقة وصول، مقارنة 2–3 نماذج، تفاصيل نموذج، وسياسة routing أساسي/بديل/دافع بلا انتقالات صامتة.
- **Tools**: كتالوج مخاطر وصلاحيات، مراجعة scope وسياسة الموافقة قبل التوصيل التجريبي.
- **Skills**: مصدر وإصدار وترخيص وصلاحيات وحالة ثقة؛ المهارة غير المراجعة لا يمكن تفعيلها.

### الإدارة والتكلفة

- **Usage**: اتجاه تكلفة، breakdown حسب المشروع/النموذج/الدافع، وledger يميز estimate/reserved/actual/settled ويربط بالتشغيل.
- **Billing**: رصيد منصة، خطة، حدود شهرية وحد كل تشغيل، وطريقة دفع وتعبئة تجريبية معلّمة بوضوح.
- **Team**: أعضاء وأدوار ودعوات، تغيير دور محلي، وسلطة الموافقة ظاهرة.
- **Settings**: Profile، Preferences، Workspace policy، BYOK، Integrations، Data & privacy، وAudit log.

## قرارات UI/UX المثبتة

- عربي أولًا مع إنجليزية كاملة وRTL/LTR على مستوى route؛ لا قلب بصري شكلي فقط.
- **Precision Workspace**: أسطح حجرية دافئة، حبر أخضر، teal للأفعال، amber للموافقة، بلا gradients أو glassmorphism أو زخارف AI عامة.
- حالات النظام لا تعتمد على اللون وحده؛ كل حالة تحمل نصًا وشارة وسياقًا.
- التكلفة والنموذج والأدوات والدافع والسقف وسياسة الموافقة تظهر قبل الفعل الحساس.
- القوائم الكثيفة تتحول إلى cards أو مناطق تمرير محلية على الهاتف، دون horizontal overflow على document.
- الحوارات مبنية بـRadix Dialog مع focus management وEscape واستعادة التركيز.
- الحركة تحترم `prefers-reduced-motion`.

## العقود وحدود البيانات

أضيفت Zod contracts وfixtures متحققة للآتي:

- Agent / Flow / Run / Approval / Receipt / Operations.
- Knowledge collections and sources.
- Catalog models, tools, and skills.
- Usage ledger events.
- Team members.
- Workspace administration snapshot.

تمر الصفحات عبر data boundaries في `apps/web/lib/data/operations.ts`، لذلك يمكن استبدال mock API بخدمات حقيقية دون ربط المكونات مباشرة بالمزود.

## تحقق الجودة النهائي

الأوامر المنفذة:

```bash
npx -y npm@11.6.4 run check
cd apps/web && PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npx playwright test --reporter=list
npx -y npm@11.6.4 audit --audit-level=moderate
```

النتائج:

- ESLint: **ناجح دون warnings**.
- TypeScript strict: **ناجح عبر جميع workspaces**.
- Vitest: **4/4**.
- Next.js production build: **ناجح**؛ ولّد 43 static pages ضمن مصفوفة المسارات بالإضافة إلى detail routes الديناميكية.
- Playwright الكامل: **22/22**.
  - Professional preview: 3.
  - Wave 1 regression: 6.
  - Project → Agent → Flow → Run/Approval: 6.
  - Knowledge/Models/Tools/Skills/Usage/Team/Settings: 7.
- Axe: **لا مخالفات serious أو critical** على الأسطح والحالات الحرجة المختبرة.
- Mobile `390×844`: **لا document-level horizontal overflow** في أسطح التشغيل والإدارة المختبرة.
- Runtime route sweep: عربي وإنجليزي بلا page errors.
- npm audit: **0 vulnerabilities**.

## الأدلة البصرية

- [لوحة إثبات Frontend Prototype الكاملة](evidence/frontend-prototype-proof-board.jpg)

### المسار التشغيلي

- [`evidence/wave-two/projects-ar.png`](evidence/wave-two/projects-ar.png)
- [`evidence/wave-two/agent-builder-tested-ar.png`](evidence/wave-two/agent-builder-tested-ar.png)
- [`evidence/wave-two/flow-to-run-ar.png`](evidence/wave-two/flow-to-run-ar.png)
- [`evidence/wave-two/approval-receipt-ar.png`](evidence/wave-two/approval-receipt-ar.png)
- [`evidence/wave-two/operations-mobile-ar.png`](evidence/wave-two/operations-mobile-ar.png)

### المعرفة والإدارة

- [`evidence/wave-three/knowledge-ar.png`](evidence/wave-three/knowledge-ar.png)
- [`evidence/wave-three/knowledge-retrieval-tested-ar.png`](evidence/wave-three/knowledge-retrieval-tested-ar.png)
- [`evidence/wave-three/models-ar.png`](evidence/wave-three/models-ar.png)
- [`evidence/wave-three/usage-ar.png`](evidence/wave-three/usage-ar.png)
- [`evidence/wave-three/team-invite-ar.png`](evidence/wave-three/team-invite-ar.png)
- [`evidence/wave-three/settings-providers-ar.png`](evidence/wave-three/settings-providers-ar.png)
- [`evidence/wave-three/admin-mobile-ar.png`](evidence/wave-three/admin-mobile-ar.png)

## الحدود الصادقة

- كل البيانات والإجراءات حتمية ومحلية أو fixtures typed.
- لا تُرسل رسائل أو بريد أو دعوات.
- لا تُرفع ملفات ولا تُجلب URLs.
- لا تُخزن مفاتيح مزودين ولا تُختبر مع API.
- لا يُخصم رصيد ولا تُنفذ دفعة.
- لا توجد مصادقة أو صلاحيات Server-side بعد؛ الواجهات تثبت السلوك المطلوب قبل ربط Backend آمن.

المرحلة التالية ليست إعادة تصميم الواجهة، بل بناء Backend آمن خلف العقود الحالية: session/auth، persistence، event ledger، idempotent approvals، provider router، secrets boundary، وعمليات الدفع الحقيقية بعد مراجعة أمنية منفصلة.
