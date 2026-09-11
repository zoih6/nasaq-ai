# الصلاحيات والموافقات — نَسَق AI

| الحقل | القيمة |
|---|---|
| الإصدار | `0.1` |
| الحالة | Baseline للـPrototype؛ Alpha يحتاج مراجعة أمنية |
| آخر تحديث | 11 سبتمبر 2026 |
| المرجع | [PRD](../01-product/PRD.md) · [State Machines](../01-product/STATE-MACHINES.md) · [Contracts](CONTRACTS.md) |

> الدور يحدد ما يستطيع الشخص إدارته. **Tool policy** تحدد ما يستطيع الوكيل تنفيذه. **Approval** تفوض فعلًا محددًا مرة واحدة. هذه ثلاث طبقات مختلفة ولا تستبدل إحداها الأخرى.

---

## 1. مبادئ الحوكمة

1. deny by default.
2. server-side authorization لكل request وevent subscription.
3. أقل صلاحية وأضيق scope.
4. الفصل بين قراءة المورد وتشغيله وتعديله ونشره وحذفه.
5. الفصل بين إدارة credential واستخدامها؛ من يستخدم المفتاح لا يراه.
6. approval محددة بفعل وpayload digest ووقت وموافق.
7. permission snapshot في UI للمساعدة فقط.
8. تغيير الدور/السياسة يعاد التحقق منه لحظة side effect.
9. لا silence-as-consent.
10. كل تغيير حساس يسجل في audit log.

---

## 2. الأدوار

| الدور | الوصف |
|---|---|
| `owner` | مالك مساحة العمل؛ الملكية والإغلاق والفوترة والسياسات العليا |
| `admin` | إدارة الأعضاء والمشاريع والسياسات التشغيلية دون نقل الملكية افتراضيًا |
| `builder` | بناء ونشر Agents/Flows واختيار أدوات مسموحة ضمن سياسة المساحة |
| `member` | استخدام Chat والمشاريع وتشغيل موارد مسموحة وإنشاء موارد عادية |
| `viewer` | قراءة موارد ومخرجات مسموحة دون تعديل أو تشغيل مكلف افتراضيًا |
| `billing` | إدارة الدفع والفواتير والميزانيات دون قراءة محتوى المشاريع افتراضيًا |

### Alpha

الأدوار الحقيقية المطلوبة أولًا: `owner`, `admin`, `member`. يظهر `builder`, `viewer`, `billing` في الـPrototype ويكتمل قبل Beta.

---

## 3. أفعال النظام

تستخدم الصلاحيات صيغة:

```text
resource.action
```

أمثلة:

```text
workspace.read
workspace.update
workspace.delete
member.invite
member.role.update
project.create
project.read
project.update
project.archive
conversation.create
conversation.read
conversation.send
agent.create
agent.update
agent.publish
agent.run
flow.create
flow.update
flow.publish
flow.run
approval.resolve
credential.create
credential.use
credential.rotate
credential.revoke
billing.read
billing.manage
budget.manage
audit.read
```

لا تستخدم صلاحية عامة `admin=true` داخل domain code.

---

## 4. مصفوفة الأدوار العليا

الرموز: ✅ مسموح افتراضيًا · ◐ وفق scope/policy · — غير مسموح.

| الفعل | Owner | Admin | Builder | Member | Viewer | Billing |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| قراءة مساحة العمل | ✅ | ✅ | ✅ | ✅ | ✅ | ◐ |
| تعديل إعدادات المساحة | ✅ | ✅ | — | — | — | — |
| نقل الملكية | ✅ | — | — | — | — | — |
| حذف مساحة العمل | ✅ | — | — | — | — | — |
| دعوة/إزالة أعضاء | ✅ | ✅ | — | — | — | — |
| تغيير Owner | ✅ | — | — | — | — | — |
| تغيير الأدوار الأخرى | ✅ | ✅ | — | — | — | — |
| قراءة Audit log | ✅ | ✅ | — | — | — | ◐ مالي فقط |
| إدارة سياسات الأدوات | ✅ | ✅ | ◐ | — | — | — |
| قراءة الفوترة | ✅ | ◐ | — | — | — | ✅ |
| إدارة الدفع | ✅ | — | — | — | — | ✅ |
| إدارة الميزانيات | ✅ | ✅ | — | — | — | ✅ |

`admin` لا يدير طريقة الدفع افتراضيًا إلا إذا منح capability منفصلة.

---

## 5. المشاريع والمحتوى

| الفعل | Owner | Admin | Builder | Member | Viewer | Billing |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| إنشاء مشروع | ✅ | ✅ | ✅ | ✅ | — | — |
| قراءة مشروع مسموح | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| تعديل وصف/تعليمات | ✅ | ✅ | ✅ | ◐ owner/editor | — | — |
| أرشفة | ✅ | ✅ | ◐ editor | ◐ owner/editor | — | — |
| طلب حذف نهائي | ✅ | ✅ | — | — | — | — |
| إنشاء Chat | ✅ | ✅ | ✅ | ✅ | — | — |
| إرسال رسالة مكلفة | ✅ | ✅ | ✅ | ✅ ضمن budget | — | — |
| قراءة artifacts | ✅ | ✅ | ✅ | ✅ | ◐ shared | — |
| تصدير content | ✅ | ✅ | ◐ | ◐ | ◐ policy | — |

### Resource-level grants

قبل Beta يمكن إضافة grant:

```text
resourceId + principalId + view|run|edit|manage
```

لكن لا يستخدم لتجاوز workspace membership أو tool policy.

---

## 6. Agents وFlows

| الفعل | Owner | Admin | Builder | Member | Viewer | Billing |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| إنشاء Agent/Flow | ✅ | ✅ | ✅ | ◐ policy | — | — |
| تعديل draft مملوك/مسموح | ✅ | ✅ | ✅ | ◐ | — | — |
| نشر إصدار | ✅ | ✅ | ✅ ضمن policy | — افتراضيًا | — | — |
| تشغيل مورد منشور | ✅ | ✅ | ✅ | ✅ ضمن grants/budget | — افتراضيًا | — |
| تشغيل draft | ✅ | ✅ | ✅ | ◐ owner only | — | — |
| ربط knowledge | ✅ | ✅ | ◐ حسب access | ◐ حسب access | — | — |
| منح tool operation | ✅ | ✅ | ◐ allowlist فقط | — | — | — |
| اختيار credential | ✅ | ✅ | ◐ usable refs | — | — | — |
| أرشفة تعريف | ✅ | ✅ | ◐ editor | ◐ owner | — | — |
| حذف نهائي | ✅ | ✅ | — | — | — | — |

### Invariant

القدرة على تعديل Agent لا تمنح تلقائيًا القدرة على استخدام credential أو tool operation. validation يفحص التقاطع وقت النشر والتشغيل.

---

## 7. Knowledge

| الفعل | Owner | Admin | Builder | Member | Viewer | Billing |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| إنشاء collection | ✅ | ✅ | ✅ | ✅ | — | — |
| إضافة مصدر | ✅ | ✅ | ✅ | ✅ ضمن project | — | — |
| قراءة المصدر | ✅ | ✅ | ◐ grant | ◐ grant | ◐ grant | — |
| retrieval test | ✅ | ✅ | ✅ | ◐ editor | — | — |
| ربط Agent/Flow | ✅ | ✅ | ✅ | ◐ | — | — |
| حذف مصدر | ✅ | ✅ | ◐ editor | ◐ owner | — | — |
| تغيير retention | ✅ | ✅ policy | — | — | — | — |

لا يستطيع Agent استرجاع passage لا يستطيع runtime principal الوصول إلى مصدره، حتى إذا كان collection ID معروفًا.

---

## 8. Credentials / BYOK

### القدرات المنفصلة

| capability | المعنى |
|---|---|
| `credential.metadata.read` | رؤية المزود والlabel والحالة والنطاق وآخر استخدام |
| `credential.create` | إضافة سر جديد |
| `credential.test` | اختبار connection بطريقة مقيدة |
| `credential.use` | الإشارة إلى credential في request مسموح |
| `credential.rotate` | استبدال السر |
| `credential.revoke` | إلغاء الاستخدام |
| `credential.assign` | تغيير النطاق أو ربطه بسياسة |

### المصفوفة الافتراضية

| الفعل | Owner | Admin | Builder | Member | Viewer | Billing |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| credential شخصية | ✅ | ✅ لنفسه | ✅ لنفسه | ✅ لنفسه | — | — |
| إنشاء credential للمساحة | ✅ | ✅ | — | — | — | — |
| رؤية metadata للمساحة | ✅ | ✅ | ◐ usable only | — | — | — |
| استخدام credential للمساحة | ✅ | ✅ | ◐ policy | ◐ policy | — | — |
| rotate/revoke للمساحة | ✅ | ✅ | — | — | — | — |
| رؤية القيمة النصية بعد الحفظ | — | — | — | — | — | — |

### قواعد

1. `credential.use` يعيد reference داخليًا؛ لا ينقل السر إلى client/agent prompt.
2. Builder يرى أن credential متاحة وحالتها فقط إذا سمحت policy.
3. test endpoint allowlisted ولا يسمح URL/payload اعتباطي.
4. revoke يعاد authorization ويكتب audit event.
5. export/clone Agent أو Flow يحذف credential IDs أو يحولها إلى required bindings.

---

## 9. Billing وUsage

| الفعل | Owner | Admin | Builder | Member | Viewer | Billing |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| رؤية usage الشخصي | ✅ | ✅ | ✅ | ✅ | ◐ | ◐ aggregation |
| رؤية usage كل الأعضاء | ✅ | ✅ | — | — | — | ✅ دون content |
| رؤية prompts من usage event | حسب content grant | حسب content grant | حسب content grant | own/grant | grant | — |
| إدارة budget | ✅ | ✅ | — | — | — | ✅ |
| تعبئة رصيد | ✅ | — | — | — | — | ✅ |
| إدارة طريقة الدفع | ✅ | — | — | — | — | ✅ |
| تنزيل فاتورة | ✅ | ◐ | — | — | — | ✅ |
| تعديل ledger | — | — | — | — | — | — |

Ledger يصحح بـadjustment service command محمي، لا UI تعديل يدوي.

---

## 10. Approvals

### من يستطيع الموافقة؟

يجب تحقق الشروط كلها:

1. workspace membership active.
2. `approval.resolve`.
3. approver role مطابق للpolicy.
4. access إلى المورد/المشروع.
5. الصلاحية للفعل المستهدف أو capability تفويض خاصة.
6. approval pending وغير منتهية.
7. action digest مطابق.
8. re-auth/MFA إذا طلب risk level.

### قواعد الفصل

- المنشئ قد يوافق على read/write_internal وفق السياسة.
- destructive/financial يمكن أن يتطلب شخصًا مختلفًا لاحقًا.
- Alpha لا يدعي four-eyes إن لم ينفذه.
- Owner override يسجل ولا يتجاوز policy قانونية/أمنية hard deny.

### قرار الموافقة

```text
approve      → payload كما هو
edit+approve → تغييرات allowlisted + digest جديد موثق
reject       → سبب اختياري/مطلوب حسب policy
```

approval لا يمنح صلاحية عامة مستقبلية إلا عبر فعل منفصل واضح «تحديث السياسة».

---

## 11. Tool risk policy

| Risk | افتراضي Alpha | مثال |
|---|---|---|
| `read` | allow إذا scope صالح؛ receipt | بحث ويب، قراءة ملف مشروع |
| `write_internal` | require approval أول مرة أو حسب Agent policy | حفظ artifact، تحديث مسودة داخلية |
| `external_side_effect` | require approval لكل فعل | إرسال بريد، إنشاء ticket |
| `destructive` | deny أو approval + re-auth | حذف، نشر نهائي، إلغاء مورد |
| `secret_access` | policy + scoped binding؛ لا كشف السر | استدعاء API بمفتاح |
| `financial` | deny في Alpha إلا حالة محددة جدًا | شراء/دفع/إنفاق فوق حد |

### Scope أمثلة

```text
web.search: domains allow/deny + max requests
knowledge.read: collection IDs
email.send: approved recipients/domains
project.write: project ID + artifact folder
http.request: method + host allowlist + path pattern
```

Wildcard عالمي ممنوع للأدوات عالية الأثر.

---

## 12. Policy evaluation order

```text
1. system hard deny
2. legal/security/tenant policy
3. workspace policy
4. project policy
5. resource grant
6. role baseline
7. Agent/Flow tool grant
8. run budget and approval policy
9. action-specific approval
```

الأكثر تقييدًا يفوز. لا يستطيع lower layer توسيع hard deny أعلى.

---

## 13. UI behavior

### Hidden مقابل Disabled

**Hidden:**

- الفعل لا يخص الدور ولن يفيده معرفة وجوده.
- رؤية وجوده قد تكشف capability أو resource حساسًا.

**Disabled مع سبب:**

- الفعل معروف لكن يحتاج ترقية role أو budget أو إعدادًا.
- المورد read-only/archived.
- model/tool degraded مؤقتًا.

**Visible ويعيد 403 race:**

- تعرض الواجهة أن الصلاحية تغيرت، تحفظ draft، وتحدث permission snapshot.

### Permission copy

جيد:

> لا يمكنك نشر هذا التدفق. اطلب من مسؤول المساحة دور Builder أو صلاحية التحرير.

سيئ:

> Unauthorized 403.

لا تكشف اسم مالك مورد خاص لمستخدم لا يراه.

---

## 14. مشاركة وتصدير

### المشاركة الداخلية

- view/run/edit منفصلة.
- تنتهي عند إزالة العضوية.
- لا تنقل credential/tool grants تلقائيًا.

### رابط خارجي — Beta أو لاحقًا

- disabled افتراضيًا.
- scope/expiry/revocation.
- لا prompts/sources/private metadata دون اختيار.
- robots noindex.
- download منفصل.
- audit event لكل إنشاء/إلغاء ووصول مهم عند الإمكان.

### التصدير

- content export لا يتضمن secrets.
- Agent/Flow export يستبدل credentials بـbindings placeholders.
- license/provenance للskills محفوظ.
- Billing role يصدر فواتير لا محتوى.

---

## 15. تغييرات العضوية أثناء العمليات

| الحدث | السلوك |
|---|---|
| إزالة عضو أرسل request | request المقبول يكمل حسب policy؛ side effect يعاد authorization |
| خفض role أثناء approval | القرار الجديد يمنع؛ pending يعاد تقييمها |
| إزالة access للمشروع أثناء run | retrieval/tools المستقبلية تمنع؛ run warning/failure مضبوط |
| revoke credential | لا استخدام جديد؛ الحالي وفق kill policy |
| archive project | runs النشطة لا تتوقف صامتًا؛ policy وbanner |
| suspend workspace | تمنع عمليات جديدة وتوقف/تعزل النشطة وفق incident policy |

---

## 16. Audit events المطلوبة

```text
workspace.created
workspace.updated
workspace.deletion_requested
ownership.transferred
member.invited
member.joined
member.role_changed
member.removed
project.archived
project.deletion_requested
agent.published
flow.published
tool.enabled
tool.disabled
credential.created
credential.tested
credential.rotated
credential.revoked
budget.created
budget.updated
approval.approved
approval.edited
approval.denied
external_action.executed
export.requested
```

كل حدث: actor، action، resource، outcome، timestamp، requestId، safe summary. لا secret/prompt body.

---

## 17. اختبارات الصلاحيات

### Matrix tests

- كل action × role × resource scope.
- owner/admin/member Alpha أولًا.
- personal مقابل workspace credential.
- project grant/inheritance.
- archived/deleted/suspended.

### Adversarial

- تغيير resource ID يدويًا.
- قراءة stream/run لworkspace أخرى.
- approve token بعد expiry أو مرتين.
- تعديل payload بعد approval.
- member removed between authorize/execute.
- viewer calls API مباشرة.
- billing role يحاول قراءة prompt.
- Builder يصدر Flow ويحصل على secret.
- wildcard tool scope.
- stale permission snapshot في client.

### واجهة

- keyboard يصل إلى سبب disabled.
- 403 لا يمسح form.
- viewer fixture لا يرى dead CTAs.
- role switch development tool يغير العرض فقط ولا يدعي auth حقيقيًا.

---

## 18. قرارات مفتوحة

1. هل `member` ينشئ Agents/Flows أم يشغل المنشور فقط؟ Prototype يعرض policy قابلة للتغيير.
2. هل Admin يدير billing read فقط أم لا يرى شيئًا افتراضيًا؟
3. هل approvals destructive تحتاج شخصين في Beta؟
4. ما tool operations الأولى خارج read-only Research Agent؟
5. هل project-level custom roles مطلوبة قبل Beta؟
6. ما سياسة runs النشطة عند revoke/suspend؟
7. هل مشاركة خارجية تدخل Beta أم تؤجل؟

---

## 19. معايير القبول

- [ ] كل CTA حساس مرتبط بـaction معرف.
- [ ] مصفوفة owner/admin/member منفذة ومختبرة في Alpha.
- [ ] UI permission snapshot لا يستخدم كحكم أمني.
- [ ] credentials لا تُقرأ نصيًا بأي role.
- [ ] Billing لا يرى content افتراضيًا.
- [ ] Agent/Flow grants لا تتجاوز workspace/project policy.
- [ ] approvals مرتبطة بـdigest وأحادية الاستخدام ومنتهية الصلاحية.
- [ ] side effects تعيد authorization لحظة التنفيذ.
- [ ] role/credential/project races لها سلوك معلوم.
- [ ] audit events لكل تغيير حساس.
- [ ] export/clone لا يحمل secrets.
- [ ] اختبارات adversarial الأساسية تمر قبل Alpha.
