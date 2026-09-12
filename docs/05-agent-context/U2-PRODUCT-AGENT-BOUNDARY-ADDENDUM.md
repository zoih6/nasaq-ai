# ملحق إلزامي لـU2 — فصل Service Workbench عن Product Agent Runtime

> **الحالة:** تعليمات ملزمة لكل تنفيذ U2 يبدأ بعد 12 سبتمبر 2026
>
> **يقرأ مع:** [`U2-IMPLEMENTATION-PROMPT.md`](U2-IMPLEMENTATION-PROMPT.md)
>
> **مرجع القرار:** [تدقيق جاهزية هندسة وكلاء المنتج](../04-delivery/PRODUCT-AGENT-ARCHITECTURE-READINESS-AUDIT.md)
>
> **الأثر:** لا يوسع U2 إلى Backend؛ بل يمنعها من تثبيت افتراضات خاطئة على Backend الوكلاء المستقبلي

---

## 1. القرار الذي لا يجوز تأويله

- U2 تبني **Frontend Service Workbench ومحاكيات خدمات حتمية**.
- U2 لا تبني Agent Runtime، ولا تسد فجوات Persona/Prompt/Context/Memory/Tools/Authorization/Durability/Evals الخاصة بمنتج الوكلاء.
- منهج `AGENT-OPERATING-METHOD.md` يضبط طريقة عمل الوكيل المنفذ، لكنه ليس schema أو orchestrator لوكلاء نَسَق.
- Backend الوكلاء في حالة **NO-GO** حتى إغلاق بوابات `PA-G0..PA-G10` في تقرير التدقيق.
- هذه التعليمات تتقدم على أي استنتاج يوحي بأن «إعداد foundation مشتركة» يسمح بإضافة DB/API/provider/queue/worker/tool executor أو persistent memory.

---

## 2. ترتيب القراءة الإضافي

بعد قراءة `AGENTS.md` و`AGENT-OPERATING-METHOD.md` وملفات السياق، وقبل لمس U2.0، اقرأ:

1. [تقرير التدقيق كاملًا](../04-delivery/PRODUCT-AGENT-ARCHITECTURE-READINESS-AUDIT.md).
2. قسم «المصطلحات والنواميس» في [`U2-SERVICE-DEPTH.md`](../01-product/U2-SERVICE-DEPTH.md).
3. Agent/Run/Approval في [`STATE-MACHINES.md`](../01-product/STATE-MACHINES.md) للمقارنة فقط، لا لإعادة استخدام النوع نفسه.
4. Agent/Tool/Run contracts التصورية في [`CONTRACTS.md`](../03-architecture/CONTRACTS.md) والعقود الفعلية في `packages/contracts/src/index.ts` مع الاعتراف بالفروق.

إذا لم تستطع شرح الفرق بين `ServiceRun` و`AgentRun` و`FlowRun` قبل التعديل، فتوقف ولا تبدأ U2.0.

---

## 3. قاموس الحدود الملزم

| اسم U2 | معناه داخل U2 | ما ليس هو |
|---|---|---|
| `ServiceSession` | حاوية محلية لمقصد المستخدم وruns/artifacts/handoffs ضمن خدمة. | Agent harness session أو conversation/memory دائمة. |
| `ServiceRun` | محاولة محاكاة حتمية واحدة لخدمة، بحالات نهائية لا تعود نشطة. | تشغيل وكيل أو flow خادمي، ولا يحمل ضمانات durability. |
| `ServiceStage` | مرحلة مجال مرئية مثل diagnostic/source review/diff review. | `AgentRunStep` أو tool-call attempt. |
| `ServiceEvent` | event typed من simulator المحلي لتغيير UI. | append-only security/audit event أو resumable server stream. |
| `SimulationReceipt` | إفصاح عن ما حُوكي وما حُسب محليًا وما لم يحدث. | `ExecutionReceipt` موثق، فاتورة، أو سجل audit غير قابل للتلاعب. |
| `HandoffBundle` | بيانات يختارها المستخدم ويعاينها قبل فتح خدمة أخرى. | delegation envelope بين agents أو نقل صلاحية/ذاكرة. |
| `ArtifactVersion` | snapshot محلي/جلسي لمخرج تجريبي. | artifact production immutable في object store. |
| `sessionStorage` adapter | حفظ مؤقت ومعلن في التبويب. | account sync أو memory أو durable run store. |

---

## 4. قواعد العقود والأسماء

1. استخدم أسماء محددة بالسياق: `ServiceRunStatus` لا `RunStatus` عام جديد، و`ServiceEvent` لا `RunEvent` عام.
2. لا توسع `runStatusSchema` الحالي كي يخدم Service وAgent وFlow في enum واحد.
3. لا تجعل `ServiceRun` union فرعيًا من `AgentRun` أو العكس.
4. لا تعرّف type باسم `AgentSession`, `AgentRuntime`, `PromptBundle`, `MemoryPolicy`, `ToolGrant`, أو `ExecutionReceipt` ضمن U2 إلا إذا كان مجرد interface وهمي موثق ومطلوب بعقد منفصل؛ الأصل هو **عدم إضافتها**.
5. لا تعتبر `agentDefinitionSchema` الحالي canonical. هو shape مستخدم للـPrototype، وأضيق من `CONTRACTS.md` ومن متطلبات runtime.
6. لا تضف fields «احتياطية للمستقبل» إلى agent contracts دون design gate ومستهلك واختبار ومخطط migration.
7. ضع U2 schemas في namespace/module يوضح ملكيتها للخدمات، لا في مساحة عامة توحي بأنها domain model لكل runs.
8. إذا احتاج UI adapter مشتركًا، اجعله يستهلك interface صغيرة domain-neutral ولا يطمس semantics الخاصة بكل خدمة.
9. لا تسمّ `SimulationReceipt` أو حدثًا محليًا «verified», «authorized», «durable», «executed», أو «audit proof».
10. كل schema مخزنة في `sessionStorage` تحمل version وتتعامل مع unknown/corrupt data دون تنفيذ أو parsing غير آمن.

---

## 5. قواعد السلوك والتنفيذ

### مسموح داخل U2

- reducers وtransition guards pure.
- injectable clock وdeterministic event simulator.
- fixtures ثابتة متحققة بـZod.
- حساب محلي pure على datasets مضمّنة في Analyze.
- static Code diff/preview/check outcomes من fixtures.
- session-only storage خلف adapter مع disclosure ومسح.
- UI approvals/reviews بوصفها **خطوة محاكاة** لا authorization.

### ممنوع داخل U2

- API route أو Server Action ينفذ model/tool أو يحفظ AgentRun.
- DB schema/migration أو queue/worker/durable engine.
- provider SDK أو gateway أو live web/file retrieval.
- credentials/vault/BYOK حقيقي.
- persistent/cross-session memory أو embeddings/vector store.
- MCP/tool/skill execution أو تثبيت scripts.
- code/shell/browser execution أو sandbox.
- external telemetry تحمل prompt/source/code/file data.
- وصف local timer/state بأنه worker، durable resume، policy engine، أو approval enforcement.

---

## 6. بوابة U2.0 الإضافية

لا تعتبر U2.0 مغلقة حتى يثبت receipt الخاص بها البنود التالية:

| ID | الفحص المطلوب |
|---|---|
| `U2-PA-001` | كل أنواع session/run/stage/event/receipt الجديدة تحمل `Service*` أو namespace خدمة واضحًا. |
| `U2-PA-002` | لا type أو import يجعل ServiceRun هو AgentRun/FlowRun canonical. |
| `U2-PA-003` | لا تعديل يرفع `agentDefinitionSchema` الحالي إلى عقد Backend ضمني. |
| `U2-PA-004` | simulator transitions تأتي من event معلوم، لا timeout-only success أو `Math.random()`. |
| `U2-PA-005` | كل نتيجة تعرض `SimulationReceipt` صريحًا، ولا تدعي network/model/tool execution. |
| `U2-PA-006` | `networkCalls: 0` صحيح ومختبر في السيناريوهات المستهدفة. |
| `U2-PA-007` | session storage موصوف كمؤقت ومحلي، مع version/clear/corrupt fallback؛ لا secrets/file bytes. |
| `U2-PA-008` | Code لا يستخدم `eval`, `new Function`, executable `srcdoc`, process، أو dynamic import لمحتوى المستخدم. |
| `U2-PA-009` | Research sources وclaims fixtures ذات provenance، ولا تُقدّم كبحث ويب حي. |
| `U2-PA-010` | approval/review في U2 موسومة simulation ولا تستخدم لغة توحي بتفويض خادمي. |
| `U2-PA-011` | unit/E2E يثبتان الفصل الاصطلاحي وحقيقة المحاكاة بالعربية والإنجليزية. |
| `U2-PA-012` | receipt يذكر صراحةً: «Product Agent Backend/Runtime not implemented». |

هذه IDs إضافية ملزمة للـreceipt، لكنها لا تغيّر حقيقة أن صفوف U2 الأصلية تبقى `NOT STARTED` حتى يوجد تنفيذ ودليل.

---

## 7. التعامل مع العقود الحالية المتضاربة

إذا احتاجت U2 نوعًا يصطدم مع `packages/contracts/src/index.ts`:

1. وثّق الاصطدام قبل التعديل.
2. فضّل type جديدًا محددًا بالخدمة بدل توسيع type agent/flow عام.
3. حافظ على API سطح الـPrototype القديم عبر adapter إن لزم.
4. أضف tests تمنع التحويل الضمني أو فقدان الحالات.
5. لا «توحد» الأنواع بحذف semantics من أحد المجالين.
6. سجل أي migration محتملة في decision log، لكن لا تنفذ Backend migration.

مثال صحيح:

```text
ServiceRunStatus (U2 simulator)  ≠  AgentRunStatus (future durable runtime)
SimulationReceipt               ≠  ExecutionReceipt
ServiceEvent                    ≠  AgentRunEvent
```

مثال مرفوض:

```text
RunStatus = كل حالات الخدمات والوكلاء والتدفقات في enum واحد
```

---

## 8. متى تتوقف وتسأل

توقف قبل التعديل إذا كان الحل المقترح يحتاج أحد الآتي:

- إزالة prefix/namespace لتوحيد ServiceRun مع AgentRun.
- تعديل agent/approval/tool schemas لأجل Backend مستقبلي غير معتمد.
- إضافة provider/DB/worker/queue/vault/sandbox/memory/telemetry dependency.
- اختبار حقيقي بمفتاح أو مصدر خارجي.
- تخفيف Truth Contract أو إخفاء simulation disclosure.
- ادعاء أن U2 أغلقت بوابة من `PA-G0..PA-G10` دون artifact ومراجعة مستقلة.

صِغ السؤال بقرار محدد وخيارات وأثر، ولا توسّع النطاق من تلقاء نفسك.

---

## 9. صيغة التسليم المطلوبة من وكيل U2

في كل تحديث/receipt متأثر، أضف قسمًا قصيرًا:

```text
Product-agent boundary
- Service bounded context used:
- Agent/Flow runtime contracts changed: yes/no (expected: no)
- Backend/provider/tool/memory capabilities added: yes/no (expected: no)
- Simulation disclosure verified in ar/en:
- U2-PA checks exercised:
- Product Agent Runtime remains: NOT IMPLEMENTED / NO-GO
```

لا تستخدم هذا الملحق لتأخير U2 بتصميم Backend؛ استخدمه فقط لمنع collision والتوسع غير المصرح.
