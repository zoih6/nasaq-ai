# U1.2 — Motion & Feedback Verification

_تاريخ التحقق المحلي والإنتاجي: 2026-09-12 · الحالة: مكتملة ومنشورة_

## القرار

**U1.2 مكتملة، مدفوعة إلى `main`، منشورة، ومتحققة على alias الإنتاج.** لا يتضمن هذا التسليم Backend أو مزودًا حقيقيًا؛ جميع حالات العمل محاكاة معلنة.

## ما تم تنفيذه

### Motion foundation

- tokens مركزية للمدد `80 / 120 / 180 / 260 / 420ms`، ودورة النشاط، وتقدم الحالة، وstagger.
- منحنيات standard، entrance، exit، وemphasized، مع مسافات من `2–16px`.
- طبقة مستقلة: `apps/web/app/styles/universal/motion.css`.
- top-level route fade قصير بدل تحريك صفحة كاملة.
- press/hover/focus وانتقالات البطاقات والتبويبات موحدة.

### Panels, navigation, and dialogs

- دخول وخروج قابلان للرؤية للقائمة التسويقية، disclosure المتقدم، drawer، backdrop، notifications، command palette، dialog، وbottom sheet.
- المحتوى المغلق يبقى خارج ترتيب التركيز عبر `tabIndex=-1`, `aria-hidden`, `visibility`, وpointer gating.
- bottom sheets تبقى داخل visual viewport طوال الانتقال ولا تغيّر قياس أهداف اللمس.
- صورة الحساب في topbar مثبتة عند `44×44px`؛ عالجت البوابة انكماشًا إلى 8px عند عرض 1280px.

### Feedback states

- primitive مشترك typed: `ActivityFeedback` و`FeedbackToast`.
- التسلسل الموحد للمؤلف والمساحات: `idle → error | working → success`.
- validation/error مع `role="alert"`, `aria-invalid`, وصف إصلاح، وتركيز الحقل.
- busy مع `role="status"`, `aria-live`, `aria-busy`, نص محاكاة، ومؤشر progress غير رقمي.
- زر الإرسال يصبح disabled ويبدّل النص والأيقونة فورًا أثناء العمل.
- إلغاء timer القديم عند تعديل الطلب أو الخدمة يمنع وصول نتيجة stale.
- success/completion يبقى داخل السياق، مع CTA واضح.
- حفظ أهداف التخصيص يعرض toast ثابتًا لا يختفي تلقائيًا وله زر إغلاق 44px.
- Library empty state تعلن النتيجة وتوفر recovery بنقرة واحدة لمسح البحث والتصفية.
- route loader أصبح `aria-busy` و`aria-atomic`.

### Motion safety

- أزيل floating loop غير المحدود من بطاقات المشهد التسويقي؛ تدخل مرة وتستقر.
- live dot ينفذ دورتين فقط ثم يستقر.
- loop الوحيد في Universal هو مؤشر صغير أثناء busy الفعلي، ويتوقف عند اكتمال الحالة.
- لا parallax أو scroll-jacking أو autoplay video أو bounce/elastic motion.
- `prefers-reduced-motion` يجعل transform/animation غير الأساسية فورية عمليًا، يوقف spinner/progress animation، ويحافظ على النص والحالة الدلالية.
- forced colors يحتفظ بحدود، نص، أيقونة، وفعل recovery مستقل عن اللون.

## بوابات التحقق المحلية

### Repository gate

| البوابة | النتيجة |
|---|---:|
| ESLint | PASS، دون warnings |
| TypeScript strict عبر workspaces | PASS |
| Vitest | **4/4 PASS** |
| Next production build | PASS |
| الصفحات المبنية | **57** |
| npm audit | **0 vulnerabilities** |

الأمر: `npm run check` ثم `npm audit --audit-level=high`.

### Playwright

| البوابة | النتيجة |
|---|---:|
| U1.2 فقط على Chromium | **8/8 PASS** |
| كل E2E على Chromium | **46/46 PASS** |
| U1 + U1.1 + U1.2 عبر Chromium/Firefox/WebKit | **88 PASS / 2 expected skips** من 90 |
| Forced colors | PASS على Chromium؛ skipped عمدًا على Firefox/WebKit لأن emulation gate خاص بـChromium |

اختبارات U1.2 تغطي:

1. القيم المركزية وعدم وجود ambient infinite animation.
2. working/success في demo التسويقي.
3. error/focus/busy/cancellation/success/toast في Home.
4. error/recovery/busy/success/completion في Service Workspace.
5. Library empty/result announcement/recovery.
6. drawer/disclosure/notifications/dialog/command palette وحالات focus/open/closed.
7. reduced motion مع بقاء المعنى والوظيفة.
8. forced colors مع cues غير لونية.

Axe WCAG 2.0/2.1/2.2 A/AA لم يجد مخالفات serious أو critical في حالات U1.2 المختبرة على Chromium وFirefox. WebKit بقي بوابة تفاعل/layout/overflow كما ينص عقد المشروع.

## الأدلة

المسار: [`evidence/u1-2/`](evidence/u1-2/)

- `01-marketing-ready-ar.png`
- `02-home-validation-ar.png`
- `03-home-ready-ar.png`
- `04-service-working-en.png`
- `05-service-ready-en.png`
- `06-library-empty-en.png`
- `07-dialog-mobile-ar.png`
- `08-reduced-motion-working-en.png`
- `09-personalization-toast-ar.png`
- `manifest.json`

نتيجة manifest:

- 9 حالات مرئية.
- HTTP `200` لكل route.
- document-level horizontal overflow: `0` لكل حالة.
- console/page errors: `[]` لكل حالة.
- dialog الهاتف: `390×832` داخل viewport `390×844`.
- reduced motion: مدة feedback المحسوبة `1e-05s`؛ icon/progress animation تساوي `none`.

## المشكلات التي كشفتها البوابة وعولجت

1. bottom sheet كان يتجاوز أسفل viewport بنحو 12px في أول إطار دخول. استُبدل scale/translation على الهاتف بـopacity transition يحافظ على geometry ثابتة.
2. scale على sheet خفّض هدف command close إلى `43.69px` أثناء الحركة. إزالة scale أعادت عقد `44px` طوال الانتقال.
3. avatar في topbar كان قابلًا للانكماش حتى 8px عند 1280px. أصبح `flex: 0 0 44px`، وأُخفي prototype badge في المقاسات الأضيق.
4. timers السابقة كانت قادرة نظريًا على إظهار نتيجة بعد تعديل الطلب. أضيف إلغاء صريح واختبار يمنع stale completion.

## المراجع

المواصفة، rationale، وروابط Material/Carbon/Fluent/Apple/W3C/MDN/NN/g/Motion والمستودعات والمجتمع موجودة في [Motion & Feedback Language](../02-design/MOTION-AND-FEEDBACK.md).

## التحقق الإنتاجي

- Commit التنفيذ: `89ed5294637ca455636496c9e3bc88a1a7a2ec22`
- GitHub branch: `main`
- Vercel deployment: `dpl_HWsQ7JrCqrFZFQY4tbahjyfCwF39`
- الحالة: `READY`، دون `errorCode`
- Production alias: <https://nasaq-ai.vercel.app>
- Aliases المؤكدة: `nasaq-ai.vercel.app`، `nasaq-ai-4zobir89-labs-projects.vercel.app`، `nasaq-ai-git-main-4zobir89-labs-projects.vercel.app`

### بوابة U1.2 الحية

شُغلت `motion-feedback.spec.ts` مباشرة على alias الإنتاج عبر المحركات الثلاثة:

- Chromium: **8/8 PASS**.
- Firefox: **7/7 PASS** + forced-colors skip متوقع.
- WebKit: **7/7 PASS** + forced-colors skip متوقع.
- الإجمالي: **22 PASS + 2 expected skips** من 24.

### بوابة الانحدار الحية

شُغلت `wave-one.spec.ts` و`responsive.spec.ts` مباشرة على alias الإنتاج في Chromium:

- **22/22 PASS**.
- عشرة viewports من `320×568` إلى `1920×1080`.
- reflow مكافئ لـ200%، shell modes، 44px targets، bottom sheets، RTL/LTR، reduced motion، التدفقات الأساسية، وAxe.

أول تشغيل بعيد كشف سباقًا في قياس حالة working القصيرة على WebKit: كان بروتوكول الاختبار ينهي round-trip بعد اكتمال محاكاة 760ms. ثُبت الاختبار بأخذ snapshot للحالة المؤقتة داخل browser task واحدة؛ أعيدت البوابة كاملة ونجحت **22 + 2 skips**. لم يتطلب ذلك تغييرًا في سلوك المنتج.

### تقوية contrast بعد التسليم

كشف smoke لاحق متكرر أن Axe قد يفحص نتيجة workspace أثناء `opacity` entrance، فيرى ألوان النص والخلفية بعد compositing بنسبة `4.25–4.44:1` رغم أن الحالات الساكنة تمر. استُبدل لون الخطوة النشطة بـ`--service-deep`، وأزيل `opacity` من حاوية `universal-result-in` مع بقاء cue مكاني صغير ومسار reduced-motion. أضيف assertion للون الدلالي، وثُبت التقاط الحالة المؤقتة عبر WebKit بإشارة React فعلية وMutationObserver داخل المتصفح بدل سباق protocol. نجحت البوابة المحلية بعد الإصلاح: **20/20** للتدفق المستهدف، **8/8** على Chromium، **10/10** لتكرار reduced-motion على WebKit، و**22 pass + 2 expected skips** عبر المحركات، مع `npm run check` ناجح وaudit يساوي صفرًا.
