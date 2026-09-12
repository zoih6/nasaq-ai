# U2 — Planning & Handoff Verification

_تاريخ الإغلاق: 12 سبتمبر 2026 — Asia/Aden · الحالة: حزمة التخطيط مكتملة ومنشورة؛ تنفيذ المنتج لم يبدأ_

## القرار

**اكتملت حزمة تعريف وتسليم U2 فقط.** أصبحت الموجة قابلة للبدء من وكيل جديد بعقد canonical، مصفوفة تتبّع واختبار وأدلة، وطلب تنفيذ مستقل. لا يدّعي هذا الإيصال تنفيذ أي مساحة خدمة أو عقد runtime أو fixture أو UI جديد؛ كل متطلبات U2 التنفيذية الـ79 باقية `NOT STARTED`.

## نطاق التسليم

### الملفات الأساسية

| الملف | الغرض | الأسطر | SHA-256 |
|---|---|---:|---|
| [`../01-product/U2-SERVICE-DEPTH.md`](../01-product/U2-SERVICE-DEPTH.md) | عقد النطاق والمعمارية والخدمات والحالات والحدود والمراحل والقبول | 1430 | `6d4eeaaad41d4f6e251840a76bf6fb8db360ed7058dd4dd436ad260e972fe634` |
| [`U2-TRACEABILITY-AND-QA.md`](U2-TRACEABILITY-AND-QA.md) | requirements → implementation surface → tests → evidence، مع browser/release gates | 581 | `b82c38f164fe620a04f08b9880ed2c14641dd689c6975ec8facecda086a00ab3` |
| [`../05-agent-context/U2-IMPLEMENTATION-PROMPT.md`](../05-agent-context/U2-IMPLEMENTATION-PROMPT.md) | طلب restart-ready للوكيل المنفّذ يبدأ بـU2.0 | 266 | `0102730802f91b199ee0ee3adc1849e9f21d40cda644ca20c7af5a807cc78dac` |

### التكامل الوثائقي

- رُبط العقد من Universal Reset وREADME ومستودعات product/design/architecture/delivery/context.
- أضيف إشعار supersession إلى `docs/02-design/DESIGN.md`: Precision Workspace تاريخي عند تعارضه، وUniversal Reset/Luminous/U1.2/U2 تتقدم عليه.
- سُجلت قرارات U2 في `DECISIONS.md`، والعمل في `WORKLOG.md`، ونقطة البدء في `CURRENT-STATE.md` و`HANDOFF.md`.
- `AGENTS.md` يوجه الوكيل إلى العقد والمصفوفة والـprompt، ويمنع بدء التنفيذ خارج U2.0 أو توسيع النطاق إلى Backend/providers.

## ما ثبته العقد

- ست مساحات متخصصة: Learn، Research، Create، Code، Analyze، Explore.
- Ask & Talk بوابة/موجّه عام بتأكيد المستخدم، لا محرر مجال سابع.
- Service Workbench مشترك للحالة والجلسة والحفظ والإيصال والhandoff، مع compositions مستقلة لكل مجال.
- lifecycles منفصلة لـServiceSession/Run/Stage/Artifact/Version، وعقود EvidenceRef/SimulationReceipt/HandoffBundle.
- deterministic event simulator وfixtures عربية/إنجليزية وحالات warning/error/cancel/retry/dense/RTL/storage.
- Truth Contract صريح: لا provider/search/real upload/file processing/code execution/sandbox/DB/auth/external telemetry.
- pure local calculations فقط على Analyze fixtures؛ Code preview/checks ثابتة ولا تنفذ النص؛ local file path metadata-only.
- session-only demo persistence مع disclosure ومسح صريح.
- تنفيذ متسلسل U2.0 ثم U2.1–U2.6 ثم U2.7، مع بوابة commit/push/deploy مستقلة لكل slice.

## البحث والتغطية

استند العقد إلى:

- مصادر رسمية ودراسة منشورة للتعلم، deep research، canvases/artifacts، sandbox/code review، data analysis/chart accessibility، وknowledge maps.
- مستودعات XYFlow/Vega-Lite/CodeMirror/Monaco/Lexical كمراجع لا كقرار dependency.
- مكتبة skills المدققة: source-driven، Interface Design، React composition/best practices، accessibility، Playwright، web quality، security، وresearch synthesis.
- Reddit/Hacker News كإشارات نوعية لمخاطر Socratic mismatch، citations الشكلية، charts غير المتصالحة، code-review noise، وgraph overload؛ لم تُعامل كمعايير أو قياس prevalence.

الروابط والقرارات المستخلصة موجودة في قسم المصادر داخل عقد U2.

## تحقق الاتساق الوثائقي

شُغل فحص محلي على كل ملفات Markdown المتغيرة بعد آخر تعديل:

| الفحص | النتيجة |
|---|---:|
| Acceptance IDs في العقد | **79 unique** |
| Acceptance IDs في المصفوفة | **79/79 مطابقة؛ 0 missing؛ 0 extra** |
| ملفات Markdown المتغيرة المفحوصة | **23** |
| روابط relative مكسورة | **0** |
| بنية H1 | **عنوان H1 واحد لكل ملف** |
| `git diff --check` | **PASS** |
| credential/private-key pattern scan للـstaged files | **0 hits** |

هذه الفحوص لا تثبت صلاحية كل URL خارجي إلى الأبد؛ المصادر الرسمية الأساسية قُرئت أثناء discovery، وتُلزم خطة التنفيذ بإعادة التحقق الموجه عند القرار المعتمد على إصدار.

## بوابات المستودع

### `npm run check`

- ESLint: PASS، دون warnings.
- TypeScript: PASS عبر web/contracts/i18n/mock-api/ui.
- Vitest: **4/4 PASS**.
- Next.js `16.3.4` production build: PASS.
- static generation: **57/57 pages**.

### Security audit

- `npm audit --audit-level=high`: **0 vulnerabilities**.

لم تُعد E2E المحلية في هذا الإغلاق لأن التغيير documentation-only ولم يتغير runtime أو dependency. يبقى baseline U1/U1.1/U1.2 المثبت في إيصالاته نافذًا، ونُفذ HTTP production smoke بعد deployment كما هو موضح أدناه. لا يُستخدم ذلك كدليل قبول لأي requirement في U2.

## GitHub وVercel

### Commit المحتوى

- Commit: `4fc72140f1402c07c40ec0bfefc5d61efcd6db93`
- Message: `docs: specify U2 service depth`
- Branch: `main`
- Push: ناجح، وأصبح `HEAD == origin/main` محليًا بعد الرفع.

### Deployment المطابق

- Vercel deployment: `dpl_FQrq9imwQDPehM4mmn6vGLN3mi83`
- `githubCommitSha`: `4fc72140f1402c07c40ec0bfefc5d61efcd6db93`
- Target: `production`
- State: `READY`
- `errorCode`: `null`
- Aliases المؤكدة عبر API:
  - `nasaq-ai.vercel.app`
  - `nasaq-ai-4zobir89-labs-projects.vercel.app`
  - `nasaq-ai-git-main-4zobir89-labs-projects.vercel.app`

### Production HTTP smoke

| المسار | الحالة |
|---|---:|
| `/ar` | 200 |
| `/en` | 200 |
| `/ar/app/home` | 200 |
| `/en/app/research` | 200 |

هذا deployment يبني التطبيق نفسه لأن Vercel مرتبط بـGitHub، لكنه لا يغير runtime: المحتوى الجديد Markdown/context داخل المستودع.

## الحدود المتبقية

- لا U2.0 contracts/simulator/workbench.
- لا Learn/Research/Create/Code/Analyze/Explore specialized runtime.
- لا Ask routing أو Library artifact integration أو handoffs.
- لا U2 unit/integration/E2E/visual evidence؛ هذه IDs وخطط فقط.
- لا Backend/provider/search/upload/file processing/code execution.

## نقطة البدء التالية

يقرأ الوكيل الجديد [`../05-agent-context/U2-IMPLEMENTATION-PROMPT.md`](../05-agent-context/U2-IMPLEMENTATION-PROMPT.md)، يؤكد أحدث `main` وdeployment، ثم يبدأ **U2.0 Foundation فقط**. لا يُحدّث أي صف إلى `PASS` إلا بدليل جديد بعد التنفيذ.
