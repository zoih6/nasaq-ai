# تسليم الجلسة القادمة — U2.2 Research stability gate

> اقرأ هذا الملف أولًا، ثم `docs/01-product/U2-SERVICE-DEPTH.md` §12 و`docs/04-delivery/U2-TRACEABILITY-AND-QA.md` (مصفوفة Research + §13.2/§13.3).
> لا تبدأ أي شريحة جديدة بغير إذن صريح من المستخدم. Research موجودة الآن على `main@f094faa`، والتحقق المحلي مرّ، لكن الشريحة ليست مغلقة بسبب E2E flaky retries ومراجعة accessibility البشرية المفتوحة.

## 1. من أين نبدأ

- `main @ f094faa` (فيه Research code/evidence metadata). الأدلة المحلية في `docs/04-delivery/evidence/u2/u2-2-research/manifest.json`؛ لا تخلطها مع دليل Backend أو بحث حي.
- المصفوفة: `U2-LRN-001..007 = PASS`، `U2-LRN-008 = IN PROGRESS` (الآلي أخضر؛ تبقى مراجعة قارئ الشاشة البشرية `MAN-SR-001`). لا تعِد فتحها إلا إن طلب المستخدم.
- نقطة العمل الحالية: **تثبيت E2E flakiness وإغلاق المراجعة البشرية**. لا تنتقل إلى Create قبل إغلاق U2.2 بإيصال نهائي.

## 2. نطاق Research المطلوب

**المراحل الثمانية:** `rsh_brief` → `rsh_clarify` → `rsh_plan_review` → `rsh_source_activity` → `rsh_source_review` → `rsh_claim_matrix` → `rsh_report_edit` → `rsh_complete`.

**بوابات لا تُكسر:** لا يبدأ run قبل موافقة صريحة على `plan version`؛ أي تعديل بعد التشغيل = version/run جديد أو تأكيد واضح؛ النشاط قابل للإلغاء/التوجيه بلا stale completion؛ استبعاد مصدر يحدّث الـcoverage حتمًا ولا يترك citation يتيمة؛ لا عبارات «بحثت الويب الآن» — المصادر `seeded_fixture` مع «لم تُقرأ في الجلسة».

**وظائف P0:** plan قابلة للتحرير قبل start؛ activity log نموذجي؛ provenance لكل مصدر (النوع/التاريخ/عدم الاسترجاع الحي)؛ citation يفتح locator + excerpt + الادعاءات المرتبطة؛ claim matrix (supports/contradicts/context) وتكشف unsupported؛ تقرير فيه summary/findings/evidence/limitations/sources/receipt؛ استبعاد مصدر يري الادعاءات المتأثرة قبل الاعتماد.

**معايير القبول:** `U2-RSH-001..010` (§12.7) — الاختبارات المطلوبة في المصفوفة: `E2E-RSH-001..003`, `UT-RSH-001..002`, `IT-RSH-001`.

**الحد الأدنى للأدلة:** الحد العام الأربعة (§13.2) **زائد** `claim matrix` و`citation inspector`، بنفس `manifest.json` schema (§13.3) وبوابة الصفوف: لا `PASS` بلا دليل حديث بعد آخر تغيير.

**fixtures المطلوبة (§12.5):** happy evidence pack، zero relevant sources، unavailable source، conflicting evidence، citation locator mismatch، unsupported claim، partial report، cancelled، retryable، source list كثيفة bounded (50) مع filtering، تقرير طويل، mixed bidi URL/title.

## 3. مسار التنفيذ المقترح (نفس نمط Learn)

1. `packages/contracts/src/services/research.ts` — عقود Zod (session/run/artifact/source/claim/evidence/plan versions) + ضمان `networkCalls: 0` و`productAgentRuntime: "not_implemented"`.
2. `packages/mock-api/src/services/research/` — topics/sources/claims/scoring/fixtures/presets + `buildResearchPlan` حتمي (بدون Math.random/Date.now).
3. `packages/i18n/src/services/research-content.ts` — ar/en لكل النصوص + `skipReasons`/`limitations`.
4. `apps/web/features/research/` — `research-reducer.ts` (guards: `plan_not_approved`, `clarify_incomplete`, `source_required`, `claim_unresolved`, `report_incomplete`) + `research-workspace.tsx` + `components/research-surfaces.tsx` + `research-route.tsx` (بلا قراءة storage أثناء render).
5. الأسطح: brief/clarify/plan review/activity/source review/claim matrix/report edit/complete + `citation inspector` (drawer يعيد focus، روابط خارجية بمقصد واضح).
6. تسجيل: `service-registry.ts` (research → `implemented` / `domain_workspace`) و`service-route-renderers.tsx`.
7. الاختبارات بنفس التسمية الموجودة: وحدة للحتمية والبوابات، تكامل مع `ServiceWorkbenchProvider`/`records/restored`، ثم `apps/web/tests/e2e/service-research.spec.ts` (كامل المسار + a11y/RTL/reflow/محرك الحركة/forced-colors).
8. الأدلة أُنشئت بالفعل عبر `tools/research-evidence.mjs` في `docs/04-delivery/evidence/u2/u2-2-research/`; لا تعِد توليدها إلا بعد تغيير ذي صلة، ثم حدّث manifest والمصفوفة معًا.

## 4. أوامر البيئة (Sandbox)

```bash
# خادم التطوير (لا تشغّل next build هنا: يُقتل بـOOM)
cd apps/web && NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS="--max-old-space-size=560" npx next dev -H 127.0.0.1 -p 3000
# فحوص
npx tsc --noEmit -p apps/web/tsconfig.json
cd apps/web && npx eslint features app tests
npx vitest run --reporter=dot
# E2E: الشكل الوحيد المستقر
bash tools/run-learn-e2e.sh          # يعيد تشغيل الخادم تلقائيًا ويشغّل الدفعات
# أو يدويًا
cd apps/web && PLAYWRIGHT_LOW_MEMORY=1 PLAYWRIGHT_BROWSERS_PATH=/tmp/nasaq-playwright \
  npx playwright test tests/e2e/service-research.spec.ts --project=chromium --reporter=list --workers=1 --retries=1
# الأدلة + hygiene في نهاية كل مهمة
PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium U2_EVIDENCE_PORT=3000 node tools/research-evidence.mjs
bash tools/workspace-hygiene.sh clean --all
```

## 5. مصائد مثبتة (لا تُعِد اكتشافها)

- `next build` يُقتل OOM → `playwright.config.ts` webServer يفشل. الخادم الخلفي هو البديل.
- ذاكرة المتصفح في البيئة سبب كل «flaky»: `page.goto`/`newPage: Target page, context or browser has been closed` أو مهلة 60s. أبقِ `--workers=1 --retries=1`، وأعد أي فشل معزولًا بـ`--grep` قبل أن تصفه بعيب.
- لا تعتمد على التوقيت للتشغيل: الواجهة تحمل `data-hydrated="true"` (عبر `useSyncExternalStore`) وانتظرها قبل النقر.
- حجم اللمس 44px مطلوب فعلًا: `.u2-learn button { min-height: var(--u-touch); }` في `apps/web/app/styles/universal/workbench.css` (المسار الصحيح؛ `features/service-workbench/workbench.css` غير موجود).
- لا تخلط التباين: لا تُخفِ النص بـ`opacity` للتعبير عن حالة (تجاوز فحص axe). استخدم الحدود/الخلفية + نص السبب.
- أي قراءة storage أثناء render = hydration mismatch. النمط: route بلا storage + `resumeFromStorage` + قراءة واحدة في `useEffect` + إجراء `records/restored`.
- `pkill -f chrome-headless-shell` يقتل الصدفة نفسها — استخدم `pkill -f "[c]hrome-headless"`.
- في الدفع: صدّر التوكن أولًا (`export GH_TOKEN=...`) ثم `git push https://x-access-token:${GH_TOKEN}@github.com/zoih6/nasaq-ai.git HEAD:main`؛ بدون `export` يصل المتغير فارغًا ويفشل التوثيق.
- `createInitialWorkbenchState(session, stages, options?)` موضعي؛ ابنِ `ServiceRun` من `buildServiceScenarioFixture` لا يدويًا.
- التوكنات لا توضع في أي ملف أو commit؛ تُستخدم عابرة فقط.

## 6. قواعد ثابتة (من المستخدم)

Frontend-only deterministic simulation · لا Backend/API/DB/مزوّد/بحث حيّ · لا تنفيذ ملفات أو كود · لا أدوات/Skills/ذاكرة دائمة · `ServiceRun ≠ AgentRun ≠ FlowRun` · `SimulationReceipt` ليست `ExecutionReceipt` · لا تعديل على عقود Product Agent لتصبح Backend canonical · الحفاظ على ar/en وRTL/LTR والوصولية والاستجابة · تنفيذ فحوص `U2-PA-001..012` وبوابات U2.0 · لا ادعاء اكتمال بلا دليل حديث · عند أي حدّ يحتاج Backend/مزوّدًا: توقف واسأل · كل مهمة تنتهي `LIGHT`.

## 7. لم يُقرأ بعد (اقرأه قبل التوسّع)

`docs/05-agent-context/AGENT-OPERATING-METHOD.md` · `NASAQ-UNIVERSAL-RESET.md` · ملفات `SCREEN-INVENTORY` / `STATE-MACHINES` / `SITEMAP` · `MOTION-AND-FEEDBACK` · `FRONTEND-ARCHITECTURE` / `CONTRACTS` / `PERMISSIONS`.
