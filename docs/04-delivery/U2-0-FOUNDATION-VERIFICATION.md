# U2.0 — إيصال تنفيذ وتحقق الأساس (Foundation)

_تاريخ الإغلاق: 12 سبتمبر 2026 — Asia/Aden · الحالة: `U2.0` مغلقة بأدلة محلية وإنتاجية؛ الخطوات التالية `U2.1` لم تبدأ_

> خط الأساس قبل التنفيذ: `main@17ddea3d3f80cbbb2c2e5493c18755648f2d24e7`
> commit المحتوى: `4f257124a829202384963510cc3422f58a3c5f6a`
> القيود الملزمة: [`U2-PRODUCT-AGENT-BOUNDARY-ADDENDUM.md`](../05-agent-context/U2-PRODUCT-AGENT-BOUNDARY-ADDENDUM.md) · المصفوفة: [`U2-TRACEABILITY-AND-QA.md`](U2-TRACEABILITY-AND-QA.md)

## 1. القرار

**اكتملت `U2.0 Foundation` فقط**: عقود Zod مشتركة، محاكي أحداث حتمي، تخزين جلسة محلي، تكافؤ عربي/إنجليزي، Service Workbench مشترك، سطح تحقق داخلي، واختبارات وأدلة حديثة. المصفوفة حُدِّثت بهذه النتائج، وبقيت كل صفوف الخدمات `U2.1–U2.7` كما هي.

بيان الحقيقة الملزم: **تشغيل وكلاء المنتج (Backend/Runtime) غير منفّذ في هذه الموجة.** لم يُضف Backend أو API أو قاعدة بيانات أو provider/model أو بحث حي أو رفع/معالجة ملفات أو تنفيذ كود أو sandbox أو memory دائمة أو telemetry خارجية. بوابات `PA-G0..PA-G10` في [`PRODUCT-AGENT-ARCHITECTURE-READINESS-AUDIT.md`](PRODUCT-AGENT-ARCHITECTURE-READINESS-AUDIT.md) لم تتغير: ما زالت `NO-GO`/`PARTIAL`/`NOT STARTED`، وهذا الإيصال لا يغلق أيًا منها.

## 2. النطاق المنفَّذ

| السطح | المحتوى |
|---|---|
| `packages/contracts/src/services/` | session (+`superRefine` للاتساق) · run · stages · artifacts (8 أنواع) · evidence (+`summarizeClaimCoverage`) · receipt (+`describeSimulationReceipt`) · handoff (`canConfirmHandoff`/`consumeHandoff`) · events (15) · transitions (جدول `§8.2`) · `createServiceRetryRun`/`applyServiceEvent` |
| `packages/mock-api/src/services/` | clock (يدوي/مؤقت، أساس `2026-09-12T00:00:00Z`) · ids مبدئية (`ssn_ run_ stg_ art_ av_ evd_ sim_ hnd_`) · plans للسيناريوهات · fixtures عربية/إنجليزية · runner مدفوع بالأحداث · client (‏`deterministic_mock`، `explicit_simulation`، `networkCalls: 0`، `productAgentRuntime: "not_implemented"`) |
| `packages/i18n/src/services/` | قواميس ar/en للخدمات والمراحل والحالات والسيناريوهات · `workbench.notices` (duplicate/gap/staleRun) · رسائل التخزين · منسّقات أرقام/تواريخ |
| `apps/web/features/service-workbench/` | storage (`nasaq:u2:session:v1`، سقف 256KB، الحالات memory/session/corrupt_recovered/quota_exceeded/unavailable) · analytics بقائمة مسموحة · reducer/provider · registry صريح (6 خدمات بحالة `foundation`، وAsk خارج السجل) · shell + primitives + overlays (receipt/storage/handoff) |
| `apps/web/features/service-foundation/` | harness تحقق داخلي يقود السيناريو والتخزين والعرض |
| `apps/web/app/[locale]/preview/service-foundation/` | مسار معاينة `noindex` لا يستبدل أسطح U1 |
| `apps/web/app/styles/universal/workbench.css` | أنماط `u2-*` كاملة، ويُستورد أخيرًا في `universal.css` |
| الاختبارات | 56 اختبار وحدة (7 ملفات) + 15 اختبار E2E في `tests/e2e/service-depth-core.spec.ts` |

لم يُعدَّل `packages/contracts/src/index.ts` (عقود Prototype تبقى كما هي)، ولم يُوسَّع `runStatusSchema` المشترك، ولم تُضف أي تبعية جديدة (الفرق: 45 ملفًا، 6003 سطرًا مضافًا، 12 سطرًا محذوفًا).

## 3. ما بقي خارج U2.0

- المساحات المتخصصة الست بتدفقاتها الكاملة: `U2.1` Learn · `U2.2` Research · `U2.3` Create · `U2.4` Code · `U2.5` Analyze · `U2.6` Explore.
- بوابة Ask والتكامل مع Home/Library والـhandoffs الشاملة: `U2.7`.
- الفحوص البشرية `MAN-*` (قراءة بشرية للـcraft، قارئ شاشة، مراجعة RTL دلاليًا)، وميزانية الأداء، واختبارات الخدمات لكل مسار.
- أسطح الإنتاج لكل شريحة: هذا الإيصال يغطي إنتاج `U2.0` فقط.

## 4. حالة متطلبات U2.0

| Requirement | الدليل | الحالة |
|---|---|---|
| `U2-CORE-003` عقود Zod مشتركة | `UT-CON-001..004` / `tests/u2-contracts.test.ts` (12) | `PASS` |
| `U2-CORE-004` lifecycles/final invariant | `UT-CON-003` + E2E «happy run… one terminal state» و«cancel race…» | `PASS` |
| `U2-CORE-005` محاكي حتمي مدفوع بالأحداث | `UT-SIM-001..002` / `tests/u2-simulator.test.ts` (7) | `PASS` |
| `U2-CORE-006` حزمة سيناريوهات | `UT-FIX-001` + محدد السيناريو في harness + لقطات 05/06 | `PASS` |
| `U2-CORE-007` إفصاح الحقيقة والإيصال | `UT-RCP-001` + E2E receipt + `MAN-TRUTH-001` غير منفَّذ بشريًا | `IN PROGRESS` |
| `U2-CORE-008` لا provider/search/upload/exec | source scan + E2E «no outbound network request…» + `networkCalls: 0` | `IN PROGRESS` (الأساس فقط؛ محولات الخدمات لاحقًا) |
| `U2-CORE-009` تخزين الجلسة فقط | `UT-STO-001..002` (8) + E2E corrupt-recovery/clear + `E2E-U2-002..004` جزئيًا | `IN PROGRESS` (نسخة Library في `U2.7`) |
| `U2-CORE-010` لا أزرار ميتة | سطح الأساس كامل الوظائف؛ controls الخدمات لاحقًا | `IN PROGRESS` |
| `U2-CORE-011` تكافؤ ar/en وbidi | `UT-I18N-001..002` (7) + لقطات مقترنة ar/en؛ `MAN-RTL-001` غير منفَّذ بشريًا | `IN PROGRESS` |
| `U2-CORE-012` تجاوب/reflow/لمس | E2E «phone layout 44px…» و«200% reflow…» + لقطات 320/390/1440؛ `MAN-200/MAN-MOB` بشريًا لاحقًا | `IN PROGRESS` |
| `U2-CORE-013` وصولية وبدائل | axe 0 serious/critical على 9 لقطات + E2E «keyboard-only path…»؛ `MAN-KBD/MAN-SR` لاحقًا | `IN PROGRESS` |
| `U2-CORE-014` خط أساس الحركة محفوظ | E2E reduced-motion + suite الحركة القائمة 30/30 (Chromium) و88/2 (متعدد المحركات) | `PASS` |
| `U2-CORE-015` حدود الميزات والتركيب | `tests/u2-boundaries.test.ts` (11) + lint/typecheck + مراجعة بنية المصدر | `PASS` |
| `U2-CORE-016` analytics بقائمة مسموحة | `UT-ANL-001` + تأكيد عدم وجود نداءات شبكة | `PASS` |
| `U2-CORE-017` انحدار baseline | `npm run check` = 0 · baseline Chromium 30/30 · متعدد المحركات 88/2 | `PASS` |
| `U2-CORE-018` أدلة لكل شريحة/إنتاج | `evidence/u2/u2-0-foundation/` + نشر إنتاجي مطابق | `PASS` |
| `U2-CORE-001`, `U2-CORE-002` | — | `NOT STARTED` (خارج U2.0) |

## 5. فحوص `U2-PA-001..012`

| الفحص | كيف تحقق | الحالة |
|---|---|---|
| `U2-PA-001` تسمية `Service*`/namespace | `u2-boundaries` «keeps every U2 type inside the service namespace» | `PASS` |
| `U2-PA-002` لا `ServiceRun` = `AgentRun` | `u2-boundaries` «never widens the shared run status enum» + مراجعة العقود | `PASS` |
| `U2-PA-003` لا تضخيم `agentDefinitionSchema` | `git show 4f257124 -- packages/contracts/src/index.ts` = بلا تغيير | `PASS` |
| `U2-PA-004` انتقالات من أحداث معلومة | `UT-SIM-001` «never uses randomness or elapsed time to decide success» + `u2-boundaries` | `PASS` |
| `U2-PA-005` `SimulationReceipt` صريح | `UT-RCP-001` + `u2-receipt-boundary` في كل لوحة إيصال | `PASS` |
| `U2-PA-006` `networkCalls: 0` | E2E «no outbound network request leaves the page» + كل الإيصالات في اللقطات `networkCalls: 0` | `PASS` |
| `U2-PA-007` تخزين مؤقت/محلي آمن | `UT-STO-001..002` (version/clear/corrupt/quota) + إفصاح «session» داخل اللوحة | `PASS` |
| `U2-PA-008` لا تنفيذ كود | `u2-boundaries` «no eval, Function constructor, or executable srcdoc» + «never reads local file content» | `PASS` |
| `U2-PA-009` مصادر Research ذات provenance | لا تنطبق على U2.0 (شريحة Research) | `NOT STARTED` |
| `U2-PA-010` approval موسم بـsimulation | لوحات receipt/handoff منفصلة عن أي لغة تفويض خادمي (لتأكيدها نهائيًا في `U2.2`/`U2.3`) | `PASS` (للأساس) |
| `U2-PA-011` وحدة/E2E تثبت الفصل بالعربية والإنجليزية | `u2-i18n` + `u2-truth` + `u2-boundaries` + لقطات ar/en | `PASS` |
| `U2-PA-012` ذكر عدم تنفيذ Backend/Runtime | `u2-boundaries` «states the product-agent boundary in every workbench receipt panel»؛ النص الحرفي: «تشغيل وكلاء المنتج (Backend/Runtime) غير منفّذ في هذه الموجة.» / «Product Agent Backend/Runtime is not implemented in this wave.» | `PASS` |

## 6. الأوامر والنتائج

البيئة: Node `v20.20.2` · npm `11.6.4` · Next `16.3.4` · Playwright `1.63.0` (Chromium/Firefox/WebKit) · تاريخ التنفيذ 12 سبتمبر 2026.

| الأمر | النتيجة |
|---|---|
| `npm run check` | exit `0` — ESLint 0 errors/0 warnings، typecheck لكل الحزم، Vitest **56/56** (7 ملفات)، Next build ناجح مع prerender لمسار المعاينة في `ar` و`en` |
| `npm audit --audit-level=high` | `0 vulnerabilities` |
| `npx tsc --noEmit` | نظيف |
| `npx playwright test tests/e2e/service-depth-core.spec.ts --project=chromium` | **15 passed** |
| `npx playwright test tests/e2e/{wave-one,responsive,motion-feedback}.spec.ts --project=chromium` | **30 passed** |
| `PLAYWRIGHT_CROSS_BROWSER=1 … service-depth-core.spec.ts` | **42 passed / 3 skipped** (skip: axe على WebKit، forced-colors على Firefox+WebKit) |
| `PLAYWRIGHT_CROSS_BROWSER=1 … {wave-one,responsive,motion-feedback}` | **88 passed / 2 skipped** (skip: forced-colors خارج Chromium) |

## 7. العيوب المكتشفة والمعالجة

1. **تجاوز أفقي عند 320px (RTL)**: عنصر `.u2-visually-hidden` مطلق بلا أصل موضَّع داخل `.u2-stages li` وسّع المستند. المعالجة: `.u2-stages{overflow:hidden}` + `.u2-stages li{position:relative}`. التحقق: E2E «phone layout…» و«200% reflow…» + `documentOverflowPx: 0` في 9 لقطات.
2. **axe serious `scrollable-region-focusable`** على قائمة المراحل `ol` عندما تكون أزرار المراحل معطّلة. المعالجة: `tabIndex=0` + `aria-label` + `data-scrollable` عند غياب التفاعل، و`:focus-visible` في `workbench.css`. التحقق: axe `pass/0` في 9 لقطات وفي فحص مستقل من 5 حالات.
3. **دلالات المحاكي**: ترتيب الأحداث (artifact/version/receipt/`session.updated` قبل الحالة النهائية)، إعادة فحص الإلغاء بعد كل حدث، `needs_input` من `validating` لا من `queued`، و`failed_retryable` لا يتكرر عند وجود `retryOf` (إعادة المحاولة تنجح في run جديد). المعالجة في `plans.ts`/`runner.ts` مع اختبارات `u2-simulator` وE2E.
4. **استعادة التركيز بعد إغلاق اللوحات**: `DialogFrame` يستعيد التركيز إلى عنصر الإطلاق عبر `returnFocusTestId`. التحقق: E2E «keyboard-only path…» في المتصفحات الثلاثة.
5. **حواجز التحقق**: تثبيت متصفحات Playwright وتوابع النظام، وإزالة تحذيري lint المتبقيين (0 warnings)، وتثبيت قاعدة `.default([])` لمصفوفات `handoff` الاختيارية.

## 8. الأدلة البصرية والـmanifest

المجلد: [`evidence/u2/u2-0-foundation/`](evidence/u2/u2-0-foundation/) — 9 لقطات + `manifest.json` (SHA-256 للـmanifest: `89d2bd43550566215438ca375e717ff790ccde945fdd2bd8e2566c0834a320d0`).

| # | الملف | requirementIds | السياق | النتيجة |
|---:|---|---|---|---|
| 01 | `u2-0-01-foundation-setup-ar-320.png` | `U2-CORE-003,006,012,013` | ar / 320 / setup | http 200 · overflow 0 · axe 0 |
| 02 | `u2-0-02-run-active-en-1440.png` | `U2-CORE-004,005,010` | en / 1440 / run active | http 200 · overflow 0 · axe 0 |
| 03 | `u2-0-03-artifact-ready-ar-1440.png` | `U2-CORE-004,006` | ar / 1440 / artifact ready | http 200 · overflow 0 · axe 0 |
| 04 | `u2-0-04-receipt-truth-ar-1440.png` | `U2-CORE-007,008,016` | ar / 1440 / receipt | http 200 · overflow 0 · axe 0 |
| 05 | `u2-0-05-needs-input-en-390.png` | `U2-CORE-005,006,010` | en / 390 / needs_input | http 200 · overflow 0 · axe 0 |
| 06 | `u2-0-06-failed-retryable-en-390.png` | `U2-CORE-004,005,006` | en / 390 / failed_retryable | http 200 · overflow 0 · axe 0 |
| 07 | `u2-0-07-storage-recovery-ar-390.png` | `U2-CORE-009,` `U2-PA-007` | ar / 390 / storage corrupt-recovery | http 200 · overflow 0 · axe 0 |
| 08 | `u2-0-08-forced-colors-ar-390.png` | `U2-CORE-013` | ar / 390 / forced colors | http 200 · overflow 0 · axe 0 |
| 09 | `u2-0-09-reduced-motion-en-1440.png` | `U2-CORE-014` | en / 1440 / reduced motion + receipt | http 200 · overflow 0 · axe 0 |

كل لقطة سُجلت بـ`sha256`، `consoleErrors: []`، `pageErrors: []`، و`axe: pass/0`. الالتقاط جرى من build إنتاجي محلي (`npm run build && npm run start` على `127.0.0.1:3000`) من الشجرة نفسها التي نُشرت كـ`4f257124`؛ الـmanifest يوثّق `captureBaseCommit = 17ddea3` و`commitSha = 4f257124`.

## 9. الفحوص اليدوية والقيود

- لم تُنفَّذ أي من فحوص `MAN-*` البشرية (craft review، قارئ شاشة، مراجعة RTL دلاليًا، تجربة لمس حقيقية)؛ لذلك بقيت الصفوف المرتبطة بها `IN PROGRESS` لا `PASS`.
- axe يغطي القواعد الآلية فقط ولا يثبت لوحة المفاتيح أو قارئ الشاشة؛ فحص WebKit axe مُتخطّى بقرار موثق ويبقى WebKit بوابة تفاعل/layout/overflow.
- لا فحوص أداء (Lighthouse/budget) ولا مقارنة بصرية آلية للـcraft في هذه الشريحة.
- لا coverage thresholds معرّفة في المشروع؛ الأعداد المذكورة هي اختبارات عابرة/راسبة فعليًا.
- GitHub Actions غير موجود في المستودع (`.github/workflows/` غائب)، فالبوابات تُدار يدويًا.

## 10. GitHub وVercel

- الفرع: `main` · commit المحتوى: `4f257124a829202384963510cc3422f58a3c5f6a` (تم الدفع: `17ddea3..4f25712`).
- النشر المطابق للمصدر: `dpl_66T9CeDnMz6D1YhRkQ7wMGQ1QRo3` مرتبط بـcommit `4f257124` عبر حالة نشر Vercel: `success` — «Deployment has completed».
- التحقق من الإنتاج (alias الأساسي <https://nasaq-ai.vercel.app>): HTTP **200** على `/ar`، `/en`، `/ar/app/home`، `/en/app/research`، `/ar/preview/service-foundation`، `/en/preview/service-foundation`.
- بصمة محتوى تثبت أن الإنتاج يخدم هذا الـcommit تحديدًا: صفحة المعاينة في الإنتاج تحتوي `u2-harness` و`noindex`، وملف CSS الإنتاجي يحتوي القاعدة `u2-stages ol:focus-visible` التي أُضيفت في هذا الـcommit فقط.
- طريقة التحقق الموثقة: معرّف النشر وحالته قُرِئا من حالة نشر Vercel المعلّقة على الـcommit نفسه؛ alias الأساسي عاد 200 بمحتوى هذا الـcommit. لم يُستعلم Vercel REST API هذه الجلسة (يتطلب token)، لذلك حقول `target`/قائمة الـaliases الموثقة سابقًا لم تُعَد قراءتها آليًا؛ aliases الفريق (`nasaq-ai-4zobir89-…`, `nasaq-ai-git-main-…)` تعيد تحويلًا إلى دخول Vercel (حماية النشر) كما هو ملاحظ.
- قد يتبع هذا الإيصال commit توثيقي مغلق (context/receipt-only)؛ على أي وكيل عند الاستئناف قراءة `HEAD` و`origin/main` وأحدث نشر لا افتراض أن نشر الـcontent هو الأحدث.

## 11. الخطوة التالية

`U2.1` Learn هي الشريحة التالية المعتمدة في التسلسل، وتتطلب قراءة قسم Learn في [`U2-SERVICE-DEPTH.md`](../01-product/U2-SERVICE-DEPTH.md) وصفوف `U2-LRN-001..008`، ثم تنفيذ المساحة المتخصصة فوق أساس `U2.0` مع إيصال ونشر مطابق. لا يبدأ `U2.1` ضمن هذا الإيصال، ولا يُعلن أي متطلب Learn مقبولًا قبل دليله.
