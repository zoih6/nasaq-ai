# إيصال المعاينة الاحترافية — نَسَق AI

**التاريخ:** 2026-09-11  
**المساران:** `/ar/preview` و`/en/preview`  
**الهدف:** إثبات تجربة المنتج بصريًا وتفاعليًا عبر Chat → Agent → Flow → Approval/Receipt، لا عرض mockup ساكن.

## ما بُني

- Hero تحريري واضح مع وعد المنتج وحدود المعاينة.
- إطار منتج عالي الدقة يضم مساحة العمل والسياق والمراحل وشفافية التشغيل.
- ثلاثة سيناريوهات قابلة للتبديل:
  - إطلاق سوق.
  - مراجعة مستند.
  - عمليات محتوى.
- Chat يعرض الطلب وإجابة منظمة وإشارات قرار موسومة كتجريبية.
- Agent يعرض الخطة وأدوات القراءة وحد التكلفة وسياسة الأثر الخارجي قبل التشغيل.
- Flow بخمس عقد وحالات `ready/running/approval/paused/completed`.
- تشغيل حتمي محلي يتوقف عند بوابة موافقة فعلية داخل الواجهة.
- خياران واضحان عند البوابة: موافقة تجريبية أو إبقاء الإجراء متوقفًا.
- سجل حي، progressbar للتكلفة، وسياسة تنفيذ وإيصال ثابت.
- تبديل عربي/إنجليزي يحفظ مسار المعاينة.
- ربط CTA «استكشف التجربة» من Marketing بالمعاينة الجديدة.

## قرارات UI/UX

- تطبيق اتجاه **Precision Workspace**: حجر دافئ، حبر أخضر، teal للفعل، amber للموافقة.
- لا gradients، لا glassmorphism، لا زخارف AI عامة، ولا تأثيرات تخفي الحالة.
- كثافة معلومات منظمة بمستويات: سياق → مرحلة → محتوى → inspector.
- فعل أساسي واحد في كل مرحلة، مع تفسير لما سيحدث قبل الانتقال.
- التكلفة، مصدر الدفع، حدود الأدوات والأثر الخارجي ظاهرة وليست في tooltip مخفي.
- حالات التشغيل لا تعتمد على اللون وحده؛ لكل حالة نص وأيقونة وحدود مميزة.
- دعم `prefers-reduced-motion`، وترتيب منطقي في RTL/LTR.

## التحقق

- ESLint: ناجح.
- TypeScript strict: ناجح عبر جميع workspaces.
- Production build: ناجح؛ المساران العربي والإنجليزي prerendered.
- Playwright للمعاينة: **3/3**، ومصفوفة الانحدار الكاملة: **9/9**.
  - المسار الكامل Chat → Agent → Flow → Approval → Paused/Rerun → Completed.
  - تنقل tabs بالأسهم وتبديل locale.
  - Mobile `390×844` بلا horizontal overflow.
- Axe: لا مخالفات `serious` أو `critical` في الحالات العربية والإنجليزية والهاتف وحالة الموافقة.
- لا page errors أثناء الاختبار.

## الأدلة البصرية

- [`evidence/professional-preview-chat-ar.png`](evidence/professional-preview-chat-ar.png)
- [`evidence/professional-preview-flow-approval-ar.png`](evidence/professional-preview-flow-approval-ar.png)
- [`evidence/professional-preview-mobile-ar.png`](evidence/professional-preview-mobile-ar.png)

## حدود صادقة

المعاينة محاكاة Frontend محلية. لا تستخدم مفاتيح حقيقية، لا تتصل بمزود، ولا ترسل أو تنشر أي محتوى. الأسماء والتكلفة والمصادر المعروضة fixtures تجريبية هدفها إثبات بنية التجربة.
