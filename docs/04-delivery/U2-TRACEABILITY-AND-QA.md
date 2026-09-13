# U2 — مصفوفة التتبّع والجودة والأدلة

> **الحالة:** خطة تحقق فقط — لم يبدأ تنفيذ U2
> **تاريخ الإعداد:** 12 سبتمبر 2026 — Asia/Aden
> **العقد المرجعي:** [U2 — Service Depth](../01-product/U2-SERVICE-DEPTH.md)
> **خط الأساس:** `main@c71d83a9f422d476134b7e39ee077184fbdd2ae5`
> **تحديث 12 سبتمبر 2026 — `U2.0`:** نُفِّذت شريحة الأساس ونُشرت (`main@4f257124a829202384963510cc3422f58a3c5f6a`) بأدلة حديثة. صفوف `U2-CORE-003..018` لم تعد `NOT STARTED`؛ صفوف `U2.1`–`U2.7` والفحوص البشرية `MAN-*` ما زالت كما هي. التفاصيل في [`U2-0-FOUNDATION-VERIFICATION.md`](U2-0-FOUNDATION-VERIFICATION.md).

الغرض من هذه الوثيقة منع تحوّل «اكتملت U2» إلى تقدير بصري. كل requirement له سطح تنفيذ متوقع، اختبار، ودليل. تبدأ كل الصفوف بـ`NOT STARTED`، ولا تتحول إلى `PASS` إلا بعد دليل حديث جُمع بعد آخر تغيير ذي صلة.

---

## 1. معنى الحالات وقواعد الدليل

| الحالة | المعنى |
|---|---|
| `NOT STARTED` | لم يُنفذ أو لم يُتحقق بعد |
| `IN PROGRESS` | يوجد تنفيذ غير مغلق؛ لا يُعد قبولًا |
| `BLOCKED` | مانع موثق وصاحب قرار وخطوة تالية |
| `FAIL` | اختبار/فحص منفذ وفشل، مع evidence |
| `PASS` | اختبار/فحص حديث مطابق وartifact دليل موجود |
| `UNVERIFIED` | تعذر تنفيذ فحص لازم؛ لا يجوز تعويضه بالحدس |
| `N/A` | غير منطبق مع rationale مكتوب، لا مجرد رغبة في skip |

### قواعد لا تُكسر

1. screenshot لا يثبت behavior، وtest لا يثبت craft؛ يلزم الاثنان في الأسطح المرئية.
2. test قديم قبل آخر meaningful change ليس دليلًا صالحًا.
3. `skipped` ليس `PASS`. كل skip يحتاج سببًا معروفًا ومحدد المحرك/النطاق.
4. Axe يثبت قواعد آلية محددة فقط، ولا يثبت keyboard أو screen reader أو lived experience.
5. WebKit بوابة تفاعل/layout/overflow؛ Axe المرجعي على Chromium وFirefox وفق عقد المشروع الحالي.
6. لا تُلتقط أدلة من dev build إذا كان السلوك/الأداء المقصود production build.
7. لا تُسجل credentials أو prompt/file/source/code خاص في screenshots، traces، logs، أو manifest.
8. كل deployment evidence يربط exact commit SHA بـVercel deployment ID وحالة `READY` والalias.

---

## 2. كتالوج الاختبارات المخطط

هذه IDs ثابتة للتتبّع؛ يجوز توزيعها على ملفات مختلفة، لكن لا تُحذف التغطية دون تحديث هذه الوثيقة.

### 2.1 Unit / contract / pure logic

| Test ID | التغطية |
|---|---|
| `UT-CON-001` | parse ناجح لكل ServiceSession/Run/Stage/Artifact/Version/Evidence/Receipt/Handoff fixture |
| `UT-CON-002` | رفض IDs/status/union combinations غير الصالحة |
| `UT-CON-003` | final run لا يعود active؛ retry ينشئ run جديدًا |
| `UT-CON-004` | event sequence/duplicate/gap/stale-run guards |
| `UT-SIM-001` | deterministic event plan بنفس clock/scenario/IDs |
| `UT-SIM-002` | cancel_requested/cancelled/completion race إلى terminal واحدة |
| `UT-FIX-001` | كل scenarios العامة parse: happy/input/warning/retry/final/cancel/empty/dense/RTL/storage |
| `UT-RCP-001` | SimulationReceipt يطابق performed/simulated/notPerformed/network/storage |
| `UT-STO-001` | memory/session adapters save/load/version/clear |
| `UT-STO-002` | corrupt/unknown version/quota failure recovery |
| `UT-I18N-001` | تساوي مفاتيح ar/en وعدم وجود fallback صامت |
| `UT-I18N-002` | bidi/date/number/unit formatters |
| `UT-ANL-001` | analytics property allowlist/redaction/no content |
| `UT-HND-001` | handoff allowlist/add/remove/one-time consume |
| `UT-ASK-001` | deterministic route suggestion + explanation rules |
| `UT-LRN-001` | diagnostic scoring/path selection |
| `UT-LRN-002` | checks/hints/retries/progress |
| `UT-RSH-001` | plan version and source selection |
| `UT-RSH-002` | claim/evidence coverage، orphan/unsupported/conflict |
| `UT-CRT-001` | document block operations + alternative acceptance |
| `UT-CRT-002` | deck reorder/duplicate/delete guards |
| `UT-CRT-003` | visual variant/alt/version/restore |
| `UT-COD-001` | diff decisions/working-copy versions/reset |
| `UT-COD-002` | fixture preview/check result mapping |
| `UT-ANA-001` | count/sum/avg/min/max/group/filter/trend على expected fixtures |
| `UT-ANA-002` | profile/missing/duplicates/types/range |
| `UT-ANA-003` | result table → chart spec + reconciliation/mismatch |
| `UT-EXP-001` | short/deep path، branch/backtrack/visited |
| `UT-EXP-002` | map/list node-edge equivalence |

### 2.2 Component / integration

| Test ID | التغطية |
|---|---|
| `IT-WB-001` | workbench stage/status/focus/live-region behavior |
| `IT-WB-002` | validation/error/retry/cancel/save/receipt overlays |
| `IT-WB-003` | mode switching preserves allowed state |
| `IT-WB-004` | no dead enabled controls + disabled reasons |
| `IT-STO-001` | Library + session adapter + resume/clear/corruption |
| `IT-HND-001` | preview/confirm/cancel/consume across route boundary |
| `IT-LRN-001` | lesson/check/feedback/checkpoint composition |
| `IT-RSH-001` | plan/source/claim/citation/report composition |
| `IT-CRT-001` | three Create editors + dirty/version states |
| `IT-COD-001` | file tree/diff/editor/preview/checks consistency |
| `IT-ANA-001` | profile/plan/table/chart/verification consistency |
| `IT-EXP-001` | map/list/trail/detail shared selection state |
| `IT-SEC-001` | hostile text/URL/file-name/code rendering remains escaped/blocked |

### 2.3 E2E critical journeys

| Test ID | الرحلة |
|---|---|
| `E2E-U2-001` | Ask intent → suggested service → why → preview → confirm → prefilled target |
| `E2E-U2-002` | artifact save → Library → resume → create new version |
| `E2E-U2-003` | ar↔en switch داخل active session مع حفظ IDs/stage/dir |
| `E2E-U2-004` | corrupt/storage failure → explanation/recovery/clear |
| `E2E-U2-005` | cancel race + retry new run + no stale completion |
| `E2E-LRN-001` | Guided diagnostic → path → lesson → wrong/hint/retry → checkpoint → save |
| `E2E-LRN-002` | Fast self-assessed → quick lesson/check → resume |
| `E2E-LRN-003` | Learn warning/error/dense/RTL |
| `E2E-RSH-001` | brief → editable plan → approve → activity → claim/citation → report/save |
| `E2E-RSH-002` | unavailable/conflicting/unsupported source states + recovery |
| `E2E-RSH-003` | steer/cancel/retry prevents stale report |
| `E2E-CRT-001` | document blocks/alternative/version/save |
| `E2E-CRT-002` | deck edit/reorder/duplicate/delete/notes/version |
| `E2E-CRT-003` | visual variants/alt validation/disclosure/save |
| `E2E-CRT-004` | dirty navigation/storage failure/restore |
| `E2E-COD-001` | scope → plan → diff partial accept → checks → receipt/save |
| `E2E-COD-002` | failed checks/reject/reset/retry |
| `E2E-COD-003` | hostile code + unsupported execute/deploy request remains inert |
| `E2E-ANA-001` | sample → profile → question/plan → compute → table/chart → verify/save |
| `E2E-ANA-002` | missing/zero rows/mismatch/recompute recovery |
| `E2E-ANA-003` | local file metadata-only disclosure، no read/upload claim |
| `E2E-EXP-001` | seed → map/list → short trail → branch/backtrack → checkpoint/save |
| `E2E-EXP-002` | mobile list-only completion + Learn handoff |
| `E2E-EXP-003` | no-match/dead-end/disconnected/dense recovery |
| `E2E-XSV-001` | Learn → Research preview/confirm |
| `E2E-XSV-002` | Research → Create preview/confirm |
| `E2E-XSV-003` | Code → Learn preview/confirm |
| `E2E-XSV-004` | Analyze → Create preview/confirm |
| `E2E-XSV-005` | Explore → Learn preview/confirm |
| `E2E-A11Y-001` | keyboard-only primary path لكل خدمة + focus restore |
| `E2E-A11Y-002` | Axe critical states على Chromium/Firefox |
| `E2E-A11Y-003` | forced colors cues على Chromium |
| `E2E-MOT-001` | reduced motion equivalent semantics/geometry |
| `E2E-RSP-001` | 320px routes، no overflow، actions/44px/safe areas |
| `E2E-RSP-002` | 200% reflow + scoped two-dimensional regions |
| `E2E-RSP-003` | tablet transitions/sheets/tabs/focus |
| `E2E-RSP-004` | 1920px readable max widths/main focal region |
| `E2E-REG-001` | full existing U1/U1.1/U1.2 Chromium regression |
| `E2E-REG-002` | affected baseline suites across Chromium/Firefox/WebKit |

### 2.4 Manual / human-required

| Check ID | الفحص |
|---|---|
| `MAN-CFT-001` | visual hierarchy/signature review لكل خدمة؛ swap/squint/signature/token checks |
| `MAN-KBD-001` | keyboard-only كامل لكل primary flow؛ لا trap وترتيب focus مفهوم |
| `MAN-SR-001` | NVDA/Firefox أو VoiceOver/Safari على Learn + Research + complex visual alternatives |
| `MAN-RTL-001` | قراءة عربية ومصطلحات/URLs/code/equations مختلطة |
| `MAN-200-001` | browser zoom 200% وتكبير نص؛ لا فقد/تغطية/scroll ثنائي غير لازم |
| `MAN-MOB-001` | pointer/touch على 320/390، keyboard viewport، safe area، sheets |
| `MAN-TRUTH-001` | شخص غير مطلع يحدد بدقة ما كان demo وما لم يُنفذ من copy/receipt |
| `MAN-CONTENT-001` | مراجعة بشرية لصحة fixture lesson/claims/citations/calculations |

إذا تعذر قارئ شاشة فعلي، يبقى `MAN-SR-001 = UNVERIFIED` مع خطوات وتاريخ ومحاولة؛ لا يتحول تلقائيًا إلى N/A.

---

### 2.5 مواقع التنفيذ الفعلية (`U2.0`)

| الملف | IDs المغطّاة فعليًا |
|---|---|
| `apps/web/tests/u2-contracts.test.ts` | `UT-CON-001..004`, `UT-FIX-001` |
| `apps/web/tests/u2-simulator.test.ts` | `UT-SIM-001..002` |
| `apps/web/tests/u2-storage.test.ts` | `UT-STO-001..002` |
| `apps/web/tests/u2-i18n.test.ts` | `UT-I18N-001..002` |
| `apps/web/tests/u2-truth.test.ts` | `UT-RCP-001`, `UT-HND-001`, `UT-ANL-001` |
| `apps/web/tests/u2-boundaries.test.ts` | `U2-PA-001..003`, `U2-PA-005`, `U2-PA-008`, `U2-PA-012`, `U2-CORE-001..002`, `U2-CORE-015` |
| `apps/web/tests/e2e/service-depth-core.spec.ts` | `E2E-U2-003..005`، `E2E-A11Y-001..003`، `E2E-MOT-001`، `E2E-RSP-001..002`، وتغطية `IT-WB-002`/`IT-HND-001` جزئيًا |
| `apps/web/tests/e2e/{wave-one,responsive,motion-feedback}.spec.ts` | `E2E-REG-001..002` |

لم تُنفَّذ بعد: `IT-WB-001/003/004`، `IT-STO-001` (نسخة Library)، `IT-SEC-001` الكامل، وكل اختبارات `U2.1`–`U2.7`.

---

## 3. مصفوفة التتبّع — Core

| Requirement | المختصر | سطح التنفيذ المتوقع | الاختبار/الفحص | الدليل المرئي | الحالة |
|---|---|---|---|---|---|
| `U2-CORE-001` | ست compositions متخصصة | registry + six feature workspaces | `IT-*`, all service E2E, `MAN-CFT-001` | `VIS-SVC-01..06` | `NOT STARTED` |
| `U2-CORE-002` | Ask gateway لا خدمة سابعة | Ask route/rules/handoff | `UT-ASK-001`, `E2E-U2-001` | `VIS-XSV-01` | `NOT STARTED` |
| `U2-CORE-003` | عقود Zod المشتركة | `packages/contracts/src/services` | `UT-CON-001..002` | receipt schema sample | `PASS` |
| `U2-CORE-004` | lifecycles/final invariant | transition guards | `UT-CON-003`, `E2E-U2-005` | status/receipt capture | `PASS` |
| `U2-CORE-005` | simulator deterministic/event-driven | mock simulator/clock | `UT-CON-004`, `UT-SIM-001..002` | busy/cancel states | `PASS` |
| `U2-CORE-006` | scenario fixture suite | fixture registry/builders | `UT-FIX-001`, per-service E2E | error/warning/dense captures | `PASS` |
| `U2-CORE-007` | truth disclosure/receipt | badge + receipt overlay | `UT-RCP-001`, `IT-WB-002`, `MAN-TRUTH-001` | `VIS-RCP-*` | `IN PROGRESS` |
| `U2-CORE-008` | no live provider/search/upload/exec | adapters/security boundaries | `IT-SEC-001`, network assertions, source scan | receipt `networkCalls:0` | `IN PROGRESS` |
| `U2-CORE-009` | session-only storage | store adapter + Library copy | `UT-STO-001..002`, `E2E-U2-002..004` | `VIS-LIB-01..03` | `IN PROGRESS` |
| `U2-CORE-010` | no dead controls | action contracts/UI | `IT-WB-004`, per-service E2E | disabled reason/working actions | `IN PROGRESS` |
| `U2-CORE-011` | ar/en + bidi parity | i18n service namespaces | `UT-I18N-001..002`, `E2E-U2-003`, `MAN-RTL-001` | paired ar/en captures | `IN PROGRESS` |
| `U2-CORE-012` | responsive/reflow/touch | service CSS/layouts | `E2E-RSP-001..004`, `MAN-200-001`, `MAN-MOB-001` | mobile/tablet/desktop set | `IN PROGRESS` |
| `U2-CORE-013` | accessibility/alternatives | semantics + alternative views | `E2E-A11Y-001..003`, `MAN-KBD-001`, `MAN-SR-001` | focus/forced-color states | `IN PROGRESS` |
| `U2-CORE-014` | motion baseline محفوظ | motion tokens/feedback | `E2E-MOT-001`, existing motion suite | reduced-motion capture | `PASS` |
| `U2-CORE-015` | feature boundaries/composition | folders/imports/provider API | architecture/source review + lint/typecheck | N/A: source evidence | `PASS` |
| `U2-CORE-016` | analytics allowlist/no telemetry | analytics interface/dev logger | `UT-ANL-001`, network assertions | N/A: event evidence | `PASS` |
| `U2-CORE-017` | baseline regressions | existing app/tests | `E2E-REG-001..002`, `npm run check` | baseline route smoke | `PASS` |
| `U2-CORE-018` | per-slice/prod evidence | receipts/manifests/deployment | closure checklist §12 | proof board + manifests | `PASS` |

---

> الأدلة الفعلية لصفوف `U2.0`: 56 اختبار وحدة (7 ملفات) + 15 اختبار E2E + 9 لقطات في [`evidence/u2/u2-0-foundation/`](evidence/u2/u2-0-foundation/) مع `manifest.json`. `IN PROGRESS` تعني: الأتمتة المذكورة مرّت، وتبقى الفحوص البشرية أو أسطح الشريحة التالية غير مغلقة. `PASS` تعني تحققًا حديثًا بعد آخر تغيير ذي صلة. التفاصيل الكاملة في [`U2-0-FOUNDATION-VERIFICATION.md`](U2-0-FOUNDATION-VERIFICATION.md).

## 4. مصفوفة Learn

| Requirement | المختصر | السطح | الاختبار | الدليل | الحالة |
|---|---|---|---|---|---|
| `U2-LRN-001` | Guided end-to-end | Learn stages/artifact | `E2E-LRN-001` | setup/lesson/check/save | `PASS` |
| `U2-LRN-002` | Fast self-assessed | mode/brief/quick check | `IT-WB-003`, `E2E-LRN-002` | fast disclosure | `PASS` |
| `U2-LRN-003` | deterministic scoring/path | Learn pure logic | `UT-LRN-001` | path rationale | `PASS` |
| `U2-LRN-004` | editable path/no loss | path review/session state | `UT-LRN-001`, `E2E-LRN-001` | reordered path | `PASS` |
| `U2-LRN-005` | feedback/hint/retry/skip | check/feedback | `UT-LRN-002`, `IT-LRN-001`, `E2E-LRN-001` | wrong/recovery | `PASS` |
| `U2-LRN-006` | pause/resume/save | session/Library | `UT-STO-001`, `E2E-LRN-002`, `E2E-U2-002` | resumed checkpoint | `PASS` |
| `U2-LRN-007` | edge fixtures | Learn scenario registry | `UT-FIX-001`, `E2E-LRN-003` | empty/error/dense/RTL | `PASS` |
| `U2-LRN-008` | a11y/responsive/motion | Learn composition | A11Y/RSP/MOT + manual checks | AR mobile + EN desktop | `IN PROGRESS` |

> الأدلة الفعلية لصفوف `U2.1 Learn`: 9 ملفات اختبار (87 اختبارًا، منها `u2-learn-state` و`u2-learn-integration`) + `service-learn.spec.ts` (12 اختبار E2E، كلها خضراء بعد آخر تغيير) + 7 لقطات في [`evidence/u2/u2-1-learn/`](evidence/u2/u2-1-learn/) مع `manifest.json`. `IN PROGRESS` في `U2-LRN-008` تعني: الفحوص الآلية (axe/reflow/reduced-motion/forced-colors عند 320–1280، AR/EN) مرّت مع لقطات، وتبقى مراجعة قارئ الشاشة البشرية (`MAN-SR-001`) `UNVERIFIED` كما تنص القاعدة في الملف.

---

## 5. مصفوفة Research

| Requirement | المختصر | السطح | الاختبار | الدليل | الحالة |
|---|---|---|---|---|---|
| `U2-RSH-001` | brief/clarify/plan modes | Research setup | `u2-research-state`, `u2-research-integration`, `service-research.spec.ts` | `u2-2-01..02` | `PASS` |
| `U2-RSH-002` | plan approval/version gate | plan reducer/run command | `u2-research-state`, `service-research.spec.ts` | `u2-2-02` | `PASS` |
| `U2-RSH-003` | activity cancel/steer/no stale | simulator + Research adapter | `u2-research-state`, `service-research.spec.ts` | E2E batch 3 | `PASS` |
| `U2-RSH-004` | claim/citation/evidence contracts | contracts + matrix | `u2-research-state`, `u2-research-integration`, `service-research.spec.ts` | `u2-2-03..04` | `PASS` |
| `U2-RSH-005` | unsupported/conflict/unavailable | warnings/recovery | `service-research.spec.ts` | E2E batch 2 | `PASS` |
| `U2-RSH-006` | correct locator/excerpt/provenance | source inspector | `u2-research-integration`, `service-research.spec.ts` | `u2-2-03` | `PASS` |
| `U2-RSH-007` | editable report/version/limits/receipt | report artifact | `u2-research-integration`, `service-research.spec.ts` | `u2-2-05` + E2E batch 1 | `PASS` |
| `U2-RSH-008` | exclude source updates coverage | source/claim selectors | `u2-research-state`, `service-research.spec.ts` | E2E batch 2 | `PASS` |
| `U2-RSH-009` | network/search truth | adapter/receipt | `u2-research-integration`, `service-research.spec.ts` | receipt assertions + `u2-2-03..05` | `PASS` |
| `U2-RSH-010` | a11y/responsive/i18n/motion | Research composition | E2E batch 4–5 + manual | `u2-2-01..05` | `IN PROGRESS` |

> تحقق U2.2 المحلي على `f094faa`: `35/35` اختبار Vitest متأثر، و`npm run lint` و`npm run typecheck` نجحت. مشغل Research E2E أعاد `exit=0` لكل الدفعات الخمس بعد retries، مع flaky retries ظاهرة في بيئة Chromium؛ لذلك لا تُعد هذه نتيجة استقرار نظيفة. الدليل المرئي في [`evidence/u2/u2-2-research/`](evidence/u2/u2-2-research/) يحتوي 5 سجلات، HTTP 200، overflow=0، وAxe serious/critical=0/0. لا تُعلن U2.2 مغلقة حتى تثبيت سبب flakiness وإغلاق المراجعة البشرية لـ`MAN-SR-001`/keyboard.

---

## 6. مصفوفة Create

| Requirement | المختصر | السطح | الاختبار | الدليل | الحالة |
|---|---|---|---|---|---|
| `U2-CRT-001` | 3 output compositions/types | Create format registry | `IT-CRT-001`, `E2E-CRT-001..003` | doc/deck/visual | `NOT STARTED` |
| `U2-CRT-002` | Guided/Fast editable draft | brief/template flow | `IT-WB-003`, `E2E-CRT-001` | first editable state | `NOT STARTED` |
| `U2-CRT-003` | document block operations | document editor | `UT-CRT-001`, `E2E-CRT-001` | blocks/alternative | `NOT STARTED` |
| `U2-CRT-004` | deck operations/guards | deck editor | `UT-CRT-002`, `E2E-CRT-002` | reordered slide/notes | `NOT STARTED` |
| `U2-CRT-005` | visual variants/alt | visual concept editor | `UT-CRT-003`, `E2E-CRT-003` | variant + validation | `NOT STARTED` |
| `U2-CRT-006` | no silent overwrite | version decisions | `UT-CRT-001..003`, `E2E-CRT-004` | version strip | `NOT STARTED` |
| `U2-CRT-007` | dirty/save/failure/restore | storage/version lifecycle | `UT-STO-*`, `E2E-CRT-004` | dirty/failure/restored | `NOT STARTED` |
| `U2-CRT-008` | no image/export overclaim | disclosure/receipt | `UT-RCP-001`, `MAN-TRUTH-001` | visual/export disclosure | `NOT STARTED` |
| `U2-CRT-009` | a11y/responsive/i18n/motion | Create compositions | A11Y/RSP/MOT + manual | mobile doc/deck/visual | `NOT STARTED` |

---

## 7. مصفوفة Code

| Requirement | المختصر | السطح | الاختبار | الدليل | الحالة |
|---|---|---|---|---|---|
| `U2-COD-001` | full code review journey | Code stages | `E2E-COD-001` | plan/diff/checks/receipt | `NOT STARTED` |
| `U2-COD-002` | tree/diff state consistency | selectors/components | `IT-COD-001`, `UT-COD-001` | file statuses | `NOT STARTED` |
| `U2-COD-003` | accept/reject/apply/reset versions | code reducer | `UT-COD-001`, `E2E-COD-001..002` | partial acceptance | `NOT STARTED` |
| `U2-COD-004` | static preview/deterministic checks | fixture mapping | `UT-COD-002`, `E2E-COD-001` | preview + disclosure | `NOT STARTED` |
| `U2-COD-005` | failed/skipped/partial recovery | checks panel | `E2E-COD-002` | failed check/recovery | `NOT STARTED` |
| `U2-COD-006` | blast-radius receipt | receipt builder | `UT-RCP-001`, `E2E-COD-001` | changed-files receipt | `NOT STARTED` |
| `U2-COD-007` | no eval/html/shell/network/git | security boundary | `IT-SEC-001`, `E2E-COD-003`, source scan | inert hostile code | `NOT STARTED` |
| `U2-COD-008` | diff/tree mobile/a11y/bidi | Code composition | A11Y/RSP + `MAN-KBD-001` | unified mobile diff | `NOT STARTED` |
| `U2-COD-009` | Code→Learn handoff | handoff preview | `UT-HND-001`, `E2E-XSV-003` | payload preview | `NOT STARTED` |

---

## 8. مصفوفة Analyze

| Requirement | المختصر | السطح | الاختبار | الدليل | الحالة |
|---|---|---|---|---|---|
| `U2-ANA-001` | full analysis journey | Analyze stages | `E2E-ANA-001` | profile/table/chart/verify | `NOT STARTED` |
| `U2-ANA-002` | deterministic expected calculations | pure transforms | `UT-ANA-001` | calculation receipt | `NOT STARTED` |
| `U2-ANA-003` | facts vs interpretation separation | contracts/UI labels | `IT-ANA-001`, `MAN-TRUTH-001` | paired labels | `NOT STARTED` |
| `U2-ANA-004` | profile before analysis | profiler | `UT-ANA-002`, `E2E-ANA-001` | quality panel | `NOT STARTED` |
| `U2-ANA-005` | assumptions/filters/units/date visible | plan/inspector | `E2E-ANA-001` | assumptions panel | `NOT STARTED` |
| `U2-ANA-006` | table-derived accessible chart | chart adapter | `UT-ANA-003`, `IT-ANA-001` | chart + table | `NOT STARTED` |
| `U2-ANA-007` | reconciliation states/recompute | verification | `UT-ANA-003`, `E2E-ANA-002` | mismatch/recovery | `NOT STARTED` |
| `U2-ANA-008` | metadata-only local file | sample picker | `E2E-ANA-003`, network/source assertions | no-read disclosure | `NOT STARTED` |
| `U2-ANA-009` | edge fixtures | scenario registry | `UT-FIX-001`, `E2E-ANA-002` | empty/dense/RTL | `NOT STARTED` |
| `U2-ANA-010` | a11y/responsive/forced colors | Analyze composition | A11Y/RSP/MOT + manual | mobile/table/forced | `NOT STARTED` |

---

## 9. مصفوفة Explore

| Requirement | المختصر | السطح | الاختبار | الدليل | الحالة |
|---|---|---|---|---|---|
| `U2-EXP-001` | full explore journey | Explore stages | `E2E-EXP-001` | map/list/node/trail | `NOT STARTED` |
| `U2-EXP-002` | map/list equivalence | shared model/selectors | `UT-EXP-002`, `IT-EXP-001` | same selected node | `NOT STARTED` |
| `U2-EXP-003` | short/deep/branch/backtrack | path reducer | `UT-EXP-001`, `E2E-EXP-001` | branched trail | `NOT STARTED` |
| `U2-EXP-004` | edge reason/provenance | graph contracts/detail | contract tests + `E2E-EXP-001` | why-connected panel | `NOT STARTED` |
| `U2-EXP-005` | bookmark/note/visited resume | artifact/storage | `UT-STO-001`, `E2E-U2-002` | resumed trail | `NOT STARTED` |
| `U2-EXP-006` | recovery edge states | scenarios | `E2E-EXP-003` | no-match/dead-end | `NOT STARTED` |
| `U2-EXP-007` | mobile full flow without gestures | list/trail mobile | `E2E-EXP-002`, `MAN-MOB-001` | 320 list-first | `NOT STARTED` |
| `U2-EXP-008` | a11y/reflow/forced/motion | Explore composition | A11Y/RSP/MOT + manual | list/map forced colors | `NOT STARTED` |
| `U2-EXP-009` | Explore→Learn handoff | handoff preview | `UT-HND-001`, `E2E-XSV-005` | selected nodes payload | `NOT STARTED` |

---

## 10. مصفوفة Ask/Library/Handoffs

| Requirement | المختصر | السطح | الاختبار | الدليل | الحالة |
|---|---|---|---|---|---|
| `U2-XSV-001` | deterministic Ask route suggestion | Ask composer/rules | `UT-ASK-001`, `E2E-U2-001` | suggestion + why | `NOT STARTED` |
| `U2-XSV-002` | allowlisted preview controls | handoff dialog/sheet | `UT-HND-001`, `IT-HND-001` | add/remove/cancel | `NOT STARTED` |
| `U2-XSV-003` | one-time consume/no duplicate run | target adapter | `UT-HND-001`, all `E2E-XSV-*` | consumed receipt | `NOT STARTED` |
| `U2-XSV-004` | Library all services/save/resume | Library/store | `IT-STO-001`, `E2E-U2-002` | filters + artifacts | `NOT STARTED` |
| `U2-XSV-005` | clear/corrupt/storage recovery | Library/store | `UT-STO-002`, `E2E-U2-004` | recovery states | `NOT STARTED` |
| `U2-XSV-006` | locale parity/state preservation | i18n/session | `UT-I18N-*`, `E2E-U2-003` | before/after pair | `NOT STARTED` |

---

## 11. مصفوفة البيئات والتغطية

### 11.1 Viewports

لا تجمع كل viewports في test بصري واحد. كل حالة test مستقلة أو parameterized case مستقلة لتحديد الفشل.

| Viewport | الاستخدام الإلزامي |
|---|---|
| `320×568` | minimum mobile؛ كل route، no document overflow، primary flow قابل للإكمال |
| `390×844` | mobile/sheet/safe area؛ أدلة خدمة ممثلة |
| `768×1024` | portrait tablet؛ collapse إلى tabs/drawers |
| `1024×768` | landscape/tablet rail transition |
| `1280×720` | short desktop/vertical pressure |
| `1440×900` | desktop primary visual evidence |
| `1920×1080` | wide desktop/max width/readability |
| 200% zoom equivalent | كل خدمة مرة على الأقل؛ Code/Analyze/Explore أولوية |

بالإضافة إلى ذلك تبقى مصفوفة viewports العشر الحالية في `responsive.spec.ts` بوابة انحدار لا تُستبدل.

### 11.2 Local browser matrix

| النطاق | Chromium | Firefox | WebKit |
|---|---:|---:|---:|
| كل U2 unit/integration | N/A (Node) | N/A | N/A |
| كل E2E U2 | كامل | primary journeys + critical errors | primary journeys + interaction/layout/overflow |
| Axe | كامل للحالات الحرجة | كامل للحالات الحرجة | لا يُحقن؛ skip مبرر فقط |
| forced colors | كامل ممثلًا | إن دعمت البيئة بثبات وإلا manual | لا ادعاء emulation |
| reduced motion | كامل | primary | primary |
| visual capture | Chromium أساسًا | عند اختلاف محرك معلوم | لا full-page screenshots |

**Primary journey** يعني على الأقل: Ask handoff، رحلة واحدة لكل خدمة، Library resume، locale switch، cancel/retry.

### 11.3 Locale matrix

- كل service happy flow مرة كاملة بالعربية ومرّة كاملة بالإنجليزية عبر مجموع suite.
- setup/output/error على الأقل لكل خدمة في اللغتين.
- mixed bidi fixture لكل خدمة، لا Research/Code فقط.
- لا قبول screenshot عربي وحده كدليل parity.

### 11.4 Production matrix

بعد Vercel `READY` على exact commit:

1. HTTP 200 لكل routes العربية والإنجليزية.
2. Chromium: كل U2 primary journeys + existing critical regression.
3. Firefox/WebKit: Ask + رحلة أساسية لكل خدمة + Library resume + locale switch.
4. overflow/console/page errors على mobile/desktop ممثلين.
5. Axe على Chromium/Firefox في حالات ready/error المعقدة.
6. receipt truth/network assertions على Research/Code/Analyze.
7. لا تستخدم deployment URL غير المرتبط بالalias النهائي كبديل عن smoke الـalias.

---

## 12. بوابات الأوامر

يجب اكتشاف الإصدارات والـscripts الفعلية أولًا وعدم نسخ أوامر عمياء. baseline المتوقع:

```bash
cd /home/user/projects/nasaq-ai
git status --short --branch
git log -5 --oneline
node --version
npx npm@11.6.4 --version
```

إذا كانت dependencies غير مستعادة:

```bash
npx npm@11.6.4 ci
```

بوابة المستودع:

```bash
npm run check
npm audit --audit-level=high
```

بوابات U2 المستهدفة بعد إنشاء suites:

```bash
npm run test:e2e --workspace=@nasaq/web -- \
  tests/e2e/service-depth-core.spec.ts \
  tests/e2e/service-learn.spec.ts \
  tests/e2e/service-research.spec.ts \
  tests/e2e/service-create.spec.ts \
  tests/e2e/service-code.spec.ts \
  tests/e2e/service-analyze.spec.ts \
  tests/e2e/service-explore.spec.ts \
  tests/e2e/service-depth-responsive.spec.ts

PLAYWRIGHT_CROSS_BROWSER=1 npm run test:e2e --workspace=@nasaq/web -- \
  tests/e2e/service-depth-core.spec.ts \
  tests/e2e/service-learn.spec.ts \
  tests/e2e/service-research.spec.ts \
  tests/e2e/service-create.spec.ts \
  tests/e2e/service-code.spec.ts \
  tests/e2e/service-analyze.spec.ts \
  tests/e2e/service-explore.spec.ts
```

بوابة الانحدار القائمة تبقى:

```bash
npm run test:e2e --workspace=@nasaq/web -- \
  tests/e2e/wave-one.spec.ts \
  tests/e2e/responsive.spec.ts \
  tests/e2e/motion-feedback.spec.ts

PLAYWRIGHT_CROSS_BROWSER=1 npm run test:e2e --workspace=@nasaq/web -- \
  tests/e2e/wave-one.spec.ts \
  tests/e2e/responsive.spec.ts \
  tests/e2e/motion-feedback.spec.ts
```

للإنتاج يستخدم `PLAYWRIGHT_BASE_URL=https://nasaq-ai.vercel.app` وفق config الحالي. إذا شغّل config خادمًا محليًا أيضًا، لا تعتبر وجوده دليلًا أن الاختبارات استهدفت الإنتاج؛ سجل base URL الفعلي في receipt.

---

## 13. أدلة الصور والـmanifest

### 13.1 بنية المجلد

```text
docs/04-delivery/evidence/u2/
├── u2-0-foundation/
├── u2-1-learn/
├── u2-2-research/
├── u2-3-create/
├── u2-4-code/
├── u2-5-analyze/
├── u2-6-explore/
├── u2-7-integration/
└── proof-board.jpg
```

### 13.2 الحد الأدنى لكل خدمة

1. setup أو brief — عربي mobile.
2. active core workspace — إنجليزي desktop.
3. artifact/review state — عربي desktop.
4. warning/error/recovery أو reduced/forced-colors state — viewport مناسب.

Create يحتاج evidence مستقلًا للأنواع الثلاثة. Analyze يحتاج chart + table. Explore يحتاج map + list/mobile. Code يحتاج unified diff mobile. Research يحتاج claim matrix وcitation inspector.

### 13.3 manifest schema

كل slice تملك `manifest.json` يحتوي لكل capture:

```text
id
requirementIds[]
commitSha
route
baseUrlKind             local_production | production_alias
locale / direction
viewport
browser
scenarioId / stageId
reducedMotion / forcedColors
httpStatus
documentOverflowPx
consoleErrors[]
pageErrors[]
axe                     pass | fail | not_run + counts
file
sha256
capturedAt
```

- كل صورة تحمل alt/description في receipt.
- لا full-page WebKit screenshot.
- `consoleErrors: []` و`pageErrors: []` مطلوبان، أو rationale/fix قبل PASS.
- screenshots لا تستخدم بيانات خاصة؛ fixtures فقط.

---

## 14. إيصالات المراحل

المسارات المتوقعة:

```text
docs/04-delivery/U2-0-FOUNDATION-VERIFICATION.md
docs/04-delivery/U2-1-LEARN-VERIFICATION.md
docs/04-delivery/U2-2-RESEARCH-VERIFICATION.md
docs/04-delivery/U2-3-CREATE-VERIFICATION.md
docs/04-delivery/U2-4-CODE-VERIFICATION.md
docs/04-delivery/U2-5-ANALYZE-VERIFICATION.md
docs/04-delivery/U2-6-EXPLORE-VERIFICATION.md
docs/04-delivery/U2-7-INTEGRATION-VERIFICATION.md
docs/04-delivery/U2-SERVICE-DEPTH-VERIFICATION.md
```

كل receipt يضم:

- exact scope وما بقي خارج المرحلة.
- files/architecture summary دون ادعاءات عامة.
- acceptance IDs المغلقة وحالتها.
- commands + exit results + counts + date/environment.
- manual checks وlimitations.
- evidence paths/manifest checksum.
- defects المكتشفة وكيف عولجت.
- commit SHA، GitHub branch، Vercel deployment ID/status/aliases.
- production commands/results/base URL.
- truth statement: لا Backend/provider/search/upload/exec إذا ظل ذلك صحيحًا.

---

## 15. بوابة الأداء والجودة البصرية

### الأداء

- production build فقط عند قياس route behavior.
- لا تحميل map/chart/editor feature في Home أو خدمات أخرى بلا حاجة.
- مقارنة build output قبل/بعد كل slice؛ أي تضخم غير متوقع يشرح ويعالج.
- لا dependency جديدة بلا ADR ومراجعة lockfile/audit/provenance/license.
- lists bounded؛ virtualization لا تضاف إلا بعد قياس فعلي يثبت الحاجة.
- لا long tasks ملحوظة في interactions الأساسية؛ استخدم trace عند الشك.
- Lighthouse/aggregate score إشارة، لا دليل وحيد.

### craft review

لكل خدمة يجيب المراجع:

1. ما focal point في setup/active/review؟
2. هل يمكن تمييز الخدمة دون اللون أو اسمها؟
3. هل hierarchy تبقى واضحة عند squint؟
4. هل signature تظهر في خمسة تفاصيل فعلية لا في prose؟
5. هل density تخدم المهمة أم تبدو كـdashboard عام؟
6. هل أي card/border/gradient لا يحمل معنى؟
7. هل mobile إعادة تركيب أم desktop مصغر؟
8. هل كل state polished: default/hover/focus/disabled/loading/empty/error/warning/success؟

إذا فشلت signature/swap test فـ`MAN-CFT-001 = FAIL` حتى لو مر E2E.

---

## 16. بوابة أمنية قبل كل push

- source scan: لا `eval(`، `new Function`, user `srcdoc`, raw HTML، أو code execution path.
- network inspection في Research/Code/Analyze يثبت عدم outbound provider/upload/search calls.
- fixture/source/user strings escaped، schemes allowlisted.
- analytics events لا تحمل content.
- session storage لا يحمل file bytes/secrets/auth.
- duplicate/race/hostile input tests تمر.
- `npm audit --audit-level=high` مع triage؛ لا `audit fix --force` تلقائي.
- `git diff --cached` وstatus يفحصان secrets وgenerated noise.
- لا credentials في docs/logs/screenshots/traces.

إذا ظهر secret في Git، الأولوية rotate/revoke ثم التنظيف؛ حذف السطر وحده غير كافٍ.

---

## 17. Release closure checklist

لا يُعلن slice أو U2 مكتملة حتى تكون كل الخانات المعنية موثقة:

### Contract & behavior

- [ ] كل requirement row إما PASS أو limitation وافق عليها المستخدم صراحة.
- [ ] كل fixtures parse وكل transition invariants تمر.
- [ ] لا dead controls أو success قائم على timeout وحده.
- [ ] truth receipts دقيقة ويمكن لشخص عام فهمها.

### Product quality

- [ ] Arabic/English + RTL/LTR + mixed bidi.
- [ ] 320–1920 + 200% + 44px + safe areas + no document overflow.
- [ ] keyboard/focus/overlays/alternatives.
- [ ] reduced motion/forced colors.
- [ ] no serious/critical Axe في النطاق المتحقق.
- [ ] craft/manual visual review.

### Engineering

- [ ] `npm run check` PASS.
- [ ] audit triaged، لا reachable high/critical غير معالج.
- [ ] U2 suites PASS محليًا.
- [ ] U1/U1.1/U1.2 regressions PASS.
- [ ] three-engine gate وفق المصفوفة.
- [ ] source/security/network/storage assertions PASS.

### Evidence & delivery

- [ ] screenshots + manifest + checksums.
- [ ] receipt/context/decision/worklog/handoff محدثة.
- [ ] clean reviewed diff، لا secrets.
- [ ] commit pushed إلى `main`.
- [ ] matching Vercel deployment `READY` بلا `errorCode`.
- [ ] production alias routes/flows/a11y/overflow/console checks PASS.
- [ ] exact SHA/deployment/alias/results مسجلة.

**قاعدة الإغلاق:** إذا بقيت خلية `NOT STARTED`, `IN PROGRESS`, `FAIL`, `BLOCKED`, أو `UNVERIFIED` في requirement P0، لا تُغلق U2 ولا يُعاد تسميتها «مكتملة تقريبًا».
