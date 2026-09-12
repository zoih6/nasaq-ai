# U1.2 — Motion & Feedback Language

_الحالة: منفذة ومتحققة محليًا · آخر تحديث 2026-09-12_

## 1. الهدف

لغة الحركة في نَسَق تشرح ما تغيّر، أين حدث، وما الخطوة التالية. لا تُستخدم كزينة مستقلة، ولا تؤخر المستخدم، ولا تصبح حاملًا وحيدًا للمعلومة. يجب أن يبقى المسار المكافئ واضحًا عند تفعيل تقليل الحركة.

المبادئ الأربعة:

1. **وظيفية:** تؤكد الفعل، تربط السبب بالنتيجة، وتحافظ على السياق.
2. **سريعة:** الأفعال المتكررة قصيرة، والمساحات الأكبر لا تتجاوز ما يلزم لفهم الانتقال.
3. **هادئة:** لا bounce أو elastic أو parallax أو حركة واسعة تلقائية.
4. **متكافئة:** النص، الأيقونة، الحالة الدلالية، وlive region تبقى كافية دون الحركة.

## 2. فئات الحركة

| الفئة | الاستخدام | المدة المستهدفة | المسافة القصوى |
|---|---|---:|---:|
| Instant | press، لون، border، indicator صغير | 80ms | 0–2px |
| Fast | hover، tab، toggle، focus feedback | 120ms | 2–4px |
| Moderate | menu، panel، نتيجة داخل السياق | 180ms | 4–8px |
| Slow | drawer، dialog، bottom sheet | 260ms | 8–16px |
| Expressive | اكتمال مهم نادر أو دخول hero أول مرة | 420ms | 8–16px |

الحد الافتراضي للحركة المفيدة في المنتج هو 420ms. عمليات المحاكاة قد تبقى في حالة busy أطول، لكن حركة الدخول نفسها لا تتمدد مع وقت الانتظار.

## 3. Easing

- **Standard productive:** عنصر ظاهر طوال الانتقال؛ layout/width/color المنضبطة.
- **Entrance:** يبدأ سريعًا ويستقر بهدوء عند إضافة عنصر.
- **Exit:** يغادر بسرعة عند الإزالة الدائمة.
- **Emphasized:** لحظة اكتمال نادرة فقط، دون overshoot.
- **Linear:** لا يستخدم إلا لمؤشر نشاط دوري صغير أثناء busy.

القيم المركزية ستعيش في `styles/universal/foundations.css` وتُطبق في `styles/universal/motion.css`.

## 4. عقد الأسطح

### Buttons and links

- تغير اللون/السطح فوري تقريبًا.
- press محدود إلى 1–2% scale أو 1px translation، ولا يُستخدم على عناصر كبيرة.
- الزر أثناء العمل يصبح disabled ويغيّر النص/الأيقونة، وتظهر حالة busy نصية قريبة.

### Tabs, filters, and toggles

- `aria-selected` أو `aria-pressed` هو مصدر الحقيقة.
- اللون والخلفية والأيقونة تؤكد الحالة؛ الحركة ليست الدليل الوحيد.
- لا sliding indicator طويل بين أهداف بعيدة.

### Navigation and route changes

- top-level route يستخدم fade سريعًا فقط؛ لا تحريك صفحة كاملة أفقيًا.
- sidebar/drawer يحافظ على علاقة مكانية واضحة؛ drawer الصغير يدخل من الحافة المنطقية في RTL/LTR.
- reduced motion يستبدل الانتقال المكاني بتغير فوري/opacity عمليًا.

### Menus, panels, and dialogs

- overlay fade؛ dialog أو sheet يتحرك مسافة قصيرة فقط.
- exit أسرع من entrance.
- focus trap وإرجاع التركيز مسؤولية Radix في dialogs.
- المنطقة المغلقة ليست قابلة للتركيز أو النقر.

### Composer and task feedback

تسلسل موحد:

`idle → validation error | working → ready`

- validation error: `role="alert"`، `aria-invalid`, رسالة إصلاح، والتركيز يعود إلى الحقل.
- working: `role="status"`, `aria-live="polite"`, `aria-busy="true"`, نص ثابت، ومؤشر نشاط صغير.
- ready: نص نجاح صريح، عنوان المخرج، وصف، وإجراءات واضحة.
- تغيير النص أو الخدمة يلغي النتيجة القديمة ويعود إلى idle.
- كل التنفيذ محاكاة صريحة؛ لا توحي الحالة بأن مزودًا حقيقيًا عمل.

### Empty and recovery

- empty state يذكر السبب الأقرب ويقدم فعل recovery مباشرًا.
- Library توفر زرًا لمسح البحث والتصفية.
- عدد النتائج live region مهذب وليس إعلانًا متكررًا صاخبًا.

### Completion toast

- لا يختفي تلقائيًا في هذه المرحلة؛ يظل حتى الإغلاق كي لا يفقد المستخدم الرسالة.
- `role="status"`, نص، أيقونة، وزر إغلاق 44px.
- يظهر بعد حفظ أهداف التخصيص محليًا.

## 5. Waiting strategy

- أقل من ثانية: feedback فوري داخل الزر وحالة status صغيرة؛ لا skeleton صفحة.
- تحميل وحدة معزولة غير محدد: spinner/indicator صغير مع نص.
- تحميل صفحة أو بنية متوقعة لعدة ثوانٍ: skeleton يحاكي البنية، لا إطار فارغ.
- أكثر من 10 ثوانٍ أو عمل قابل للقياس: determinate progress مع قيمة ومعنى.
- U1.2 لا تزيف نسبة تقدم رقمية لعملياتها القصيرة؛ تستخدم activity track غير محدد ونصًا صريحًا.

## 6. Reduced-motion contract

عند `prefers-reduced-motion: reduce`:

- transform/layout animation غير الأساسية تصبح فورية عمليًا (`.01ms`, iteration واحدة).
- smooth scrolling يتوقف.
- ambient loops وdecorative entrance choreography تتوقف.
- busy indicator يصبح ثابتًا، بينما يبقى `aria-busy`, نص الحالة، والـlive region.
- لا zoom، spin، parallax، depth travel، أو bounce.
- لا تتغير الوظيفة، ترتيب التركيز، أو إمكانية recovery.

## 7. Autoplay and loops

- بطاقات المشهد التسويقي تدخل مرة واحدة وتستقر؛ لا floating loop.
- live dot ينفذ نبضتين محدودتين ثم يستقر.
- loop مسموح فقط داخل مؤشر busy صغير ومؤقت، ويتوقف عند اكتمال الحالة ويصبح ثابتًا مع reduced motion.
- لا فيديو autoplay أو carousel أو scroll-jacking ضمن التجربة الحالية.

## 8. RTL/LTR

- اتجاه drawer يعتمد على `inset-inline-start` واتجاه الوثيقة.
- أسهم التنقل تُدار وفق لغة الصفحة كما هو قائم.
- motion الخاص بالدخول العام يستخدم المحور العمودي/opacity حين لا تكون الدلالة الاتجاهية ضرورية.
- الاختبارات تغطي Arabic RTL وEnglish LTR.

## 9. Forced colors and non-motion cues

- state icons وحدود/نصوص صريحة تبقى مرئية في forced-colors.
- لا تعتمد حالات success/error/selected على لون الخلفية وحده.
- animation shadows تُزال ضمن forced colors ولا تحذف الحدود الدلالية.

## 10. Implementation map

- Tokens: `apps/web/app/styles/universal/foundations.css`
- Motion layer: `apps/web/app/styles/universal/motion.css`
- Shared status primitive: `apps/web/components/universal/activity-feedback.tsx`
- Integrations:
  - `universal-marketing.tsx`
  - `adaptive-home.tsx`
  - `service-workspace.tsx`
  - `universal-library.tsx`
  - `app-shell.tsx`
  - route loading CSS
- Contract tests: `apps/web/tests/e2e/motion-feedback.spec.ts`

## 11. مصادر البحث

تمت المراجعة في 2026-09-12. المصادر المعيارية وأنظمة التصميم هي أساس القرار؛ ملاحظات المجتمع أدلة نوعية مساعدة وليست معيارًا.

### Standards and platform guidance

- W3C WCAG 2.2, Animation from Interactions: <https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html>
- MDN, `prefers-reduced-motion`: <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>
- web.dev, accessible motion: <https://web.dev/learn/accessibility/motion>
- Apple HIG, Accessibility: <https://developers.apple.com/design/human-interface-guidelines/foundations/accessibility>

### Design systems and UX research

- Material 3, easing and duration: <https://m3.material.io/styles/motion/easing-and-duration>
- Carbon, Motion: <https://carbondesignsystem.com/elements/motion/overview/>
- Fluent 2, Motion: <https://fluent2.microsoft.design/motion>
- Nielsen Norman Group, animation execution: <https://www.nngroup.com/articles/animation-duration/>
- Nielsen Norman Group, skeleton screens: <https://www.nngroup.com/articles/skeleton-screens/>

### Libraries, skills, and repositories evaluated

- Motion accessibility guidance: <https://motion.dev/docs/react-accessibility>
- Motion presence guidance: <https://motion.dev/docs/react-animate-presence>
- Motion repository: <https://github.com/motiondivision/motion>
- Motion Primitives repository: <https://github.com/ibelick/motion-primitives>
- Animate UI repository: <https://github.com/imskyleen/animate-ui>
- Carbon motion package: <https://github.com/carbon-design-system/carbon/tree/main/packages/motion>

The repositories were evaluated as implementation references. U1.2 intentionally avoids adding a runtime animation dependency because the present interactions do not require shared-layout interpolation, gestures, or physics.

### Community signals

- UI Design discussion on restrained micro-interactions: <https://www.reddit.com/r/UI_Design/comments/1rpkdpd/micro_interactions_design_that_doesnt_feel/>
- Accessibility discussion on loading under reduced motion: <https://www.reddit.com/r/accessibility/comments/1lbn2cz/how_to_indicate_loading_for_reduced_motion/>
- Reduce Motion behavior discussion: <https://www.reddit.com/r/iOSBeta/comments/1ne12jr/ios_26_rc_accessibility_reduce_motion_replaced/>
- NN/g social summary on loading indicators: <https://x.com/NNgroup/status/1834298272694886578>

## 12. Definition of done

- All specified surfaces use centralized motion semantics.
- Loading, success, validation/error, retry, empty, recovery, and completion are visibly and semantically testable.
- No unbounded ambient decorative loop remains in Universal.
- Reduced motion preserves meaning and passes computed-style/interaction checks.
- RTL/LTR, responsive, keyboard, screen-reader semantics, forced colors, and three browser engines pass.
- `npm run check` and audit pass.
- Verification receipt, commit, push, Vercel `READY`, and production smoke are recorded.
