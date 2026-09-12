# خريطة الموقع والمسارات — نَسَق AI

| الحقل | القيمة |
|---|---|
| الإصدار | `0.1` |
| الحالة | Baseline للـFrontend prototype |
| آخر تحديث | 11 سبتمبر 2026 |
| المرجع | [PRD](PRD.md) |
| قاعدة اللغة | كل رابط قابل للمشاركة يبدأ بـ`/{locale}`؛ القيم المدعومة أولًا `ar` و`en` |

> هذه الخريطة تحدد **مكان كل تجربة وكيف يصل إليها المستخدم**. التفاصيل الدقيقة لكل شاشة في [SCREEN-INVENTORY.md](SCREEN-INVENTORY.md)، وحالاتها في [STATE-MACHINES.md](STATE-MACHINES.md).
>
> **ملحق U2:** تبقى routes الخدمات الحالية canonical، ويضيف [عقد U2](U2-SERVICE-DEPTH.md#5-هندسة-المعلومات-والمسارات) Screen/Route IDs وحالات overlays دون إنشاء route لكل خطوة.

---

## 1. قرارات التوجيه

1. `/` يختار locale محفوظًا أو لغة المتصفح، ثم يعيد التوجيه إلى `/ar` افتراضيًا عند غياب تفضيل صالح.
2. اللغة جزء من الرابط لضمان deep links ثابتة وصفحات عامة قابلة للفهرسة والمشاركة.
3. كل أسطح التطبيق تبدأ بـ`/{locale}/app`.
4. معرف مساحة العمل لا يظهر في الرابط في النسخة الأولى؛ يُحفظ workspace النشط في session ويُتحقق من عضوية كل مورد في الخادم. إذا أثبتت تعدد المساحات حاجة إلى روابط متوازية، يمكن الانتقال لاحقًا إلى `/app/w/{workspaceSlug}` عبر redirect مدروس.
5. المشروع يظهر في الرابط عندما يكون السياق خاصًا به: `/app/projects/{projectId}`.
6. التشغيلات تستخدم سطحًا موحدًا `/app/runs/{runId}` سواء بدأت من Agent أو Flow؛ النوع يأتي من البيانات لا من URL.
7. create/edit يملكان URL ثابتًا حتى إذا ظهرا بصريًا كـdrawer على desktop أو صفحة على mobile.
8. tabs ذات قيمة مشاركة أو صلاحيات مختلفة تستخدم route segments؛ الفلاتر والترتيب والحالة البصرية تستخدم query parameters.
9. لا توضع مفاتيح أو prompts أو أسماء ملفات حساسة في URL.
10. UUID/ULID داخلي وليس اسم المستخدم هو المعرف المعتمد؛ slugs وصفية اختيارية ولا تستخدم للتحقق من الصلاحية.

---

## 2. طبقات التخطيط

| Layout | المسار | المحتوى الثابت |
|---|---|---|
| `MarketingLayout` | `/{locale}/…` | شريط عام، تبديل اللغة، CTA، footer |
| `AuthLayout` | `/{locale}/auth/…` | علامة نَسَق، مساعدة، لغة، نموذج مركزي |
| `AppLayout` | `/{locale}/app/…` | Sidebar، Topbar، workspace switcher، command trigger، notifications |
| `ProjectLayout` | `/{locale}/app/projects/{projectId}/…` | Project header، tabs، context actions |
| `BuilderLayout` | Agent/Flow edit | canvas/editor، inspector، validation/status bar |
| `RunLayout` | `/app/runs/{runId}` | run status، timeline، cost، controls، artifact panel |
| `SettingsLayout` | `/app/settings/…` | settings navigation، scope indicator: personal/workspace |

---

## 3. شجرة المسارات العليا

```text
/{locale}
├── preview                      [Interactive product tour]
├── product
├── models
├── agents
├── flows
├── pricing
├── security
├── docs                         [Beta]
├── changelog                    [P2]
├── auth/
│   ├── sign-in
│   ├── sign-up
│   ├── verify
│   ├── forgot-password
│   ├── reset-password
│   ├── callback
│   └── invite/{token}
└── app/
    ├── onboarding
    ├── home
    ├── chat/
    ├── projects/
    ├── agents/
    ├── flows/
    ├── runs/
    ├── approvals/
    ├── knowledge/
    ├── models/
    ├── tools/
    ├── skills/
    ├── usage/
    ├── billing/
    ├── team/
    └── settings/
```

---

## 4. المسارات العامة

| Route ID | المسار | الصفحة | الوصول | الإصدار |
|---|---|---|---|---|
| `R-PUB-001` | `/{locale}` | الصفحة الرئيسية | عام | Prototype |
| `R-PUB-013` | `/{locale}/preview` | جولة تفاعلية: Chat → Agent → Flow → Approval | عام | Prototype |
| `R-PUB-002` | `/{locale}/product` | نظرة المنتج: Chat → Agent → Flow | عام | Prototype |
| `R-PUB-003` | `/{locale}/models` | النماذج والمزودون المدعومون | عام | Prototype |
| `R-PUB-004` | `/{locale}/agents` | قدرات الوكلاء وضوابطهم | عام | Prototype |
| `R-PUB-005` | `/{locale}/flows` | التدفقات والأتمتة | عام | Prototype |
| `R-PUB-006` | `/{locale}/pricing` | الخطط وBYOK + Credits | عام | Prototype |
| `R-PUB-007` | `/{locale}/security` | الأمان والخصوصية والضوابط المنفذة/المخططة | عام | Prototype |
| `R-PUB-008` | `/{locale}/docs` | مركز الوثائق | عام | Beta |
| `R-PUB-009` | `/{locale}/changelog` | سجل الإصدارات | عام | P2 |
| `R-PUB-010` | `/{locale}/legal/privacy` | الخصوصية | عام | قبل Alpha الخارجي |
| `R-PUB-011` | `/{locale}/legal/terms` | الشروط | عام | قبل Alpha الخارجي |
| `R-PUB-012` | `/{locale}/legal/subprocessors` | مزودو المعالجة | عام | قبل Alpha الخارجي |

### سلوك الزائر المسجل

- CTA «ابدأ الآن» ينقله إلى `/app/home` إذا كانت جلسة صالحة وonboarding مكتملًا.
- إذا لم يكتمل onboarding، ينقله إلى `/app/onboarding` مع `returnTo` آمن داخليًا.
- صفحات marketing تبقى متاحة للمستخدم المسجل ولا تعيد توجيهه قسرًا.

---

## 5. المصادقة والتهيئة

| Route ID | المسار | الصفحة | Guard | الإصدار |
|---|---|---|---|---|
| `R-AUTH-001` | `/{locale}/auth/sign-in` | تسجيل الدخول | Guest-preferred | Prototype/Alpha |
| `R-AUTH-002` | `/{locale}/auth/sign-up` | إنشاء الحساب | Guest-preferred | Prototype/Alpha |
| `R-AUTH-003` | `/{locale}/auth/verify` | تحقق البريد | Session pending | Alpha |
| `R-AUTH-004` | `/{locale}/auth/forgot-password` | طلب الاستعادة | Guest | Alpha |
| `R-AUTH-005` | `/{locale}/auth/reset-password` | تعيين كلمة جديدة | Signed token | Alpha |
| `R-AUTH-006` | `/{locale}/auth/callback` | OAuth/magic callback | Transient | Alpha |
| `R-AUTH-007` | `/{locale}/auth/invite/{token}` | قبول دعوة فريق | Token + optional auth | Prototype/Alpha |
| `R-ONB-001` | `/{locale}/app/onboarding` | التهيئة متعددة الخطوات | Auth + not complete | Prototype/Alpha |

### قواعد `returnTo`

- يقبل مسارات داخلية relative فقط.
- يمنع open redirect وعناوين schemes الخارجية.
- يسقط المسار إذا لم يملك المستخدم صلاحية الوجهة.

---

## 6. Home والتنقل التشغيلي

| Route ID | المسار | الصفحة | Guard | الإصدار |
|---|---|---|---|---|
| `R-APP-001` | `/{locale}/app` | redirect إلى `/app/home` | Member | Prototype |
| `R-HOME-001` | `/{locale}/app/home` | Command Center | Member | Prototype |
| `R-RUN-001` | `/{locale}/app/runs` | كل التشغيلات | Member | Prototype |
| `R-RUN-002` | `/{locale}/app/runs/{runId}` | تفاصيل تشغيل موحدة | Resource access | Prototype |
| `R-APR-001` | `/{locale}/app/approvals` | صندوق الموافقات | Member/Approver | Prototype |
| `R-APR-002` | `/{locale}/app/approvals/{approvalId}` | تفاصيل الموافقة | Approver/resource access | Prototype |
| `R-NOT-001` | `/{locale}/app/notifications` | مركز الإشعارات الكامل | Member | Beta |

---

## 7. Chat

| Route ID | المسار | الصفحة/الوضع | Guard | الإصدار |
|---|---|---|---|---|
| `R-CHAT-001` | `/{locale}/app/chat` | قائمة/redirect إلى Chat جديد | Member | Prototype |
| `R-CHAT-002` | `/{locale}/app/chat/new` | محادثة جديدة | Member + usage allowed | Prototype |
| `R-CHAT-003` | `/{locale}/app/chat/{conversationId}` | المحادثة | Resource access | Prototype |
| `R-CHAT-004` | `/{locale}/app/chat/{conversationId}/compare/{comparisonId}` | مقارنة محفوظة | Resource access | Prototype |
| `R-CHAT-005` | `/{locale}/app/chat/{conversationId}/share` | إعداد المشاركة | Owner/editor | Beta |

### Query parameters المعتمدة

| المعامل | الاستخدام | مثال |
|---|---|---|
| `project` | بدء Chat في سياق مشروع | `?project=prj_…` |
| `model` | preselect نموذج صالح | `?model=mdl_…` |
| `mode` | `single` أو `compare` عند البدء | `?mode=compare` |
| `promptTemplate` | تحميل قالب دون محتوى حساس في URL | `?promptTemplate=tpl_…` |
| `panel` | فتح details/sources/artifacts | `?panel=sources` |

لا يوضع نص prompt نفسه في query string.

---

## 8. Projects

| Route ID | المسار | الصفحة | Guard | الإصدار |
|---|---|---|---|---|
| `R-PROJ-001` | `/{locale}/app/projects` | قائمة المشاريع | Member | Prototype |
| `R-PROJ-002` | `/{locale}/app/projects/new` | إنشاء مشروع | Member | Prototype |
| `R-PROJ-003` | `/{locale}/app/projects/{projectId}` | redirect إلى overview | Resource access | Prototype |
| `R-PROJ-004` | `…/{projectId}/overview` | نظرة المشروع | Resource access | Prototype |
| `R-PROJ-005` | `…/{projectId}/chat` | محادثات المشروع | Resource access | Prototype |
| `R-PROJ-006` | `…/{projectId}/knowledge` | معرفة المشروع | Resource access | Prototype |
| `R-PROJ-007` | `…/{projectId}/agents` | وكلاء المشروع | Resource access | Prototype |
| `R-PROJ-008` | `…/{projectId}/flows` | تدفقات المشروع | Resource access | Prototype |
| `R-PROJ-009` | `…/{projectId}/runs` | تشغيلات المشروع | Resource access | Prototype |
| `R-PROJ-010` | `…/{projectId}/settings` | تعليمات وسياسات وأرشفة | Project editor/admin | Prototype |

---

## 9. Agents

| Route ID | المسار | الصفحة | Guard | الإصدار |
|---|---|---|---|---|
| `R-AGT-001` | `/{locale}/app/agents` | مكتبة الوكلاء | Member | Prototype |
| `R-AGT-002` | `/{locale}/app/agents/new` | اختيار قالب/بداية فارغة | Builder/member policy | Prototype |
| `R-AGT-003` | `/{locale}/app/agents/{agentId}` | تفاصيل الوكيل | Resource access | Prototype |
| `R-AGT-004` | `/{locale}/app/agents/{agentId}/edit` | Agent Builder | Editor/builder | Prototype |
| `R-AGT-005` | `/{locale}/app/agents/{agentId}/versions` | سجل الإصدارات | Editor | Beta |
| `R-AGT-006` | `/{locale}/app/agents/{agentId}/runs` | تشغيلات الوكيل | Resource access | Prototype |
| `R-AGT-007` | `/{locale}/app/agents/{agentId}/run` | إعداد تشغيل جديد | Run permission | Prototype |

بعد بدء التشغيل ينتقل المستخدم إلى `/app/runs/{runId}`.

---

## 10. Flow

| Route ID | المسار | الصفحة | Guard | الإصدار |
|---|---|---|---|---|
| `R-FLOW-001` | `/{locale}/app/flows` | مكتبة التدفقات | Member | Prototype |
| `R-FLOW-002` | `/{locale}/app/flows/new` | قالب/تدفق فارغ | Builder/member policy | Prototype |
| `R-FLOW-003` | `/{locale}/app/flows/{flowId}` | تفاصيل التدفق | Resource access | Prototype |
| `R-FLOW-004` | `/{locale}/app/flows/{flowId}/edit` | Flow Builder | Editor/builder | Prototype |
| `R-FLOW-005` | `/{locale}/app/flows/{flowId}/versions` | النسخ المنشورة | Editor | Beta |
| `R-FLOW-006` | `/{locale}/app/flows/{flowId}/runs` | تشغيلات التدفق | Resource access | Prototype |
| `R-FLOW-007` | `/{locale}/app/flows/{flowId}/run` | إدخال وتشغيل يدوي | Run permission | Prototype/Alpha |

---

## 11. Knowledge

| Route ID | المسار | الصفحة | Guard | الإصدار |
|---|---|---|---|---|
| `R-KNOW-001` | `/{locale}/app/knowledge` | كل collections والمصادر | Member | Prototype |
| `R-KNOW-002` | `/{locale}/app/knowledge/new` | إضافة مصدر/collection | Editor | Prototype |
| `R-KNOW-003` | `/{locale}/app/knowledge/{collectionId}` | تفاصيل collection | Resource access | Prototype |
| `R-KNOW-004` | `/{locale}/app/knowledge/{collectionId}/test` | Retrieval test | Editor | Prototype/Beta |
| `R-KNOW-005` | `/{locale}/app/knowledge/sources/{sourceId}` | المصدر والمعالجة والاستخدام | Resource access | Prototype |

---

## 12. Models, Tools & Skills

| Route ID | المسار | الصفحة | Guard | الإصدار |
|---|---|---|---|---|
| `R-MDL-001` | `/{locale}/app/models` | كتالوج النماذج | Member | Prototype |
| `R-MDL-002` | `/{locale}/app/models/{modelId}` | تفاصيل النموذج | Member | Prototype |
| `R-MDL-003` | `/{locale}/app/models/routing` | سياسات التوجيه | Admin/builder | Prototype/Beta |
| `R-TOOL-001` | `/{locale}/app/tools` | كتالوج الأدوات والاتصالات | Member | Prototype |
| `R-TOOL-002` | `/{locale}/app/tools/{toolId}` | تفاصيل الأداة وصلاحياتها | Member | Prototype |
| `R-SKILL-001` | `/{locale}/app/skills` | كتالوج المهارات | Member | Prototype |
| `R-SKILL-002` | `/{locale}/app/skills/{skillId}` | المصدر والإصدار والمراجعة | Member | Prototype |

---

## 13. Usage & Billing

| Route ID | المسار | الصفحة | Guard | الإصدار |
|---|---|---|---|---|
| `R-USG-001` | `/{locale}/app/usage` | نظرة الاستهلاك | Member; scoped | Prototype |
| `R-USG-002` | `/{locale}/app/usage/events/{usageEventId}` | تفاصيل حدث تكلفة | Resource access | Prototype |
| `R-BILL-001` | `/{locale}/app/billing` | الرصيد والخطة والفواتير | Owner/Admin/Billing | Prototype |
| `R-BILL-002` | `/{locale}/app/billing/credits` | تعبئة وإدارة الرصيد | Owner/Billing | Prototype UI; Alpha real |
| `R-BILL-003` | `/{locale}/app/billing/payment-methods` | طرق الدفع | Owner/Billing | Alpha |
| `R-BILL-004` | `/{locale}/app/billing/invoices` | الفواتير | Owner/Billing | Beta |
| `R-BILL-005` | `/{locale}/app/billing/budgets` | الميزانيات والتنبيهات | Owner/Admin/Billing | Prototype |

---

## 14. Team & Settings

| Route ID | المسار | الصفحة | Guard | الإصدار |
|---|---|---|---|---|
| `R-TEAM-001` | `/{locale}/app/team` | الأعضاء والدعوات | Admin | Prototype |
| `R-TEAM-002` | `/{locale}/app/team/roles` | الأدوار والصلاحيات | Owner/Admin | Prototype/Beta |
| `R-SET-001` | `/{locale}/app/settings/profile` | الحساب والملف الشخصي | Auth |
| `R-SET-002` | `/{locale}/app/settings/preferences` | اللغة والمظهر والإشعارات | Auth |
| `R-SET-003` | `/{locale}/app/settings/workspace` | اسم المساحة وسياساتها | Admin |
| `R-SET-004` | `/{locale}/app/settings/providers` | BYOK وبيانات اعتماد المزودين | Authorized only |
| `R-SET-005` | `/{locale}/app/settings/integrations` | الاتصالات الخارجية | Admin/builder policy |
| `R-SET-006` | `/{locale}/app/settings/data` | التصدير والحذف والاحتفاظ | Owner/admin by scope |
| `R-SET-007` | `/{locale}/app/settings/audit` | سجل التدقيق | Owner/Admin | Alpha |

---

## 15. صفحات النظام والأخطاء

| Route ID | الحالة | السلوك |
|---|---|---|
| `R-SYS-001` | 404 | يميز بين رابط عام مفقود ومورد تطبيق غير موجود دون تسريب وجود مورد خاص |
| `R-SYS-002` | 403 | يشرح نقص الصلاحية ويتيح العودة/طلب الوصول حيث ينطبق |
| `R-SYS-003` | Session expired | يحفظ intent آمنًا ويطلب الدخول ثم يعود إذا بقيت الصلاحية |
| `R-SYS-004` | Workspace suspended | يمنع العمليات المكلفة ويعرض جهة التواصل والخطوة التالية |
| `R-SYS-005` | Maintenance/degraded | يوضح الوحدات المتأثرة والبدائل دون تعطيل التطبيق كله إذا أمكن |
| `R-SYS-006` | Offline | يحفظ المدخل غير المرسل محليًا ويمنع ادعاء الإرسال |
| `R-SYS-007` | Global error boundary | معرف تتبع، إعادة محاولة آمنة، وعدم عرض stack أو أسرار |

---

## 16. خريطة التنقل على سطح المكتب

### المجموعة الرئيسية

1. Home
2. Chat
3. Projects
4. Agents
5. Flow
6. Knowledge

### مجموعة التشغيل

- Runs
- Approvals مع badge عددي للحالات المعلقة فقط.

### مجموعة الإدارة/الاكتشاف

- Models
- Tools & Skills
- Usage
- Team
- Settings

### قواعد العرض

- لا يزيد المستوى الدائم الأول عن 10 عناصر؛ العناصر الأقل استخدامًا تدخل مجموعة «المزيد/الإدارة».
- Sidebar مفتوح `248px` ومطوي `68px` وفق `DESIGN.md`.
- العنصر النشط يحدد نصيًا وبصريًا، لا بلون الخلفية وحده.
- Project context يظهر في header وليس نسخة ثانية كاملة من sidebar.

---

## 17. خريطة الهاتف

### Bottom navigation

1. Home
2. Chat
3. Projects
4. Runs
5. More

### داخل More

- Agents
- Flow
- Knowledge
- Models
- Usage
- Team/Settings حسب الدور

### قواعد الهاتف

- الموافقات تظهر في Runs وHome مع badge، ولا تحتاج تبويبًا سادسًا.
- Flow edit يفتح عرض خطوات منظمًا؛ desktop CTA يشرح أن التحرير الكامل أفضل على شاشة كبيرة.
- panels تتحول إلى sheets أو صفحات، ويظل زر back مطابقًا لسجل المتصفح.

---

## 18. Breadcrumbs والسياق

| السطح | breadcrumb المقترح |
|---|---|
| Project knowledge source | المشاريع / اسم المشروع / المعرفة / اسم المصدر |
| Agent run | الوكلاء / اسم الوكيل / التشغيلات / تشغيل #… |
| Flow editor | التدفقات / اسم التدفق / تحرير المسودة |
| Usage event | الاستخدام / سبتمبر 2026 / الحدث |
| Provider key | الإعدادات / المزودون / اسم المزود |

- لا تعرض breadcrumbs في Chat الضيق إذا كانت تكرر عنوان المحادثة.
- كل crumb قابل للنقر عدا الحالي، ويحافظ على locale.
- الأسماء الطويلة تختصر بصريًا مع الاسم الكامل accessible.

---

## 19. Query state المسموح

| الفئة | المعاملات |
|---|---|
| القوائم | `q`, `status`, `type`, `owner`, `project`, `sort`, `page` أو `cursor` |
| الزمن | `from`, `to`, `range` |
| العرض | `view=list|grid`, `panel`, `tab` فقط عندما لا يستحق tab route مستقلًا |
| builder | `node`, `step`, `mode=test`؛ لا تحفظ draft data في URL |
| Chat | `panel`, `message`, `mode`; لا prompt text |

كل query value يمر schema validation، والقيم غير الصالحة تعود إلى default آمن دون crash.

---

## 20. Redirects وcanonical behavior

1. أي locale غير مدعوم يعاد إلى locale افتراضي مع الحفاظ على بقية المسار إن كان صالحًا.
2. `/app/chat/{id}` لعنصر مؤرشف يفتح read-only مع banner، لا 404.
3. مورد محذوف أو غير مصرح يعيد صفحة عامة موحدة لا تكشف وجوده.
4. الروابط القديمة تحفظ في redirect registry عند تغيير route؛ لا تعدّل بشكل عشوائي.
5. صفحات marketing تملك canonical وhreflang للعربية والإنجليزية.
6. صفحات التطبيق `noindex`.

---

## 21. معايير قبول الخريطة

- [ ] كل شاشة في `SCREEN-INVENTORY.md` لها Route ID أو مبرر بأنها modal/state فقط.
- [ ] كل Route ID له guard وlayout واضحان.
- [ ] لا يوجد مساران يؤديان الوظيفة نفسها دون redirect مقصود.
- [ ] لا يحتوي أي route على سر أو prompt أو اسم ملف حساس.
- [ ] deep links تبقى على locale الصحيح بعد auth وworkspace switch.
- [ ] back/forward يعمل في builders والpanels والcompare دون فقد غير متوقع.
- [ ] desktop وmobile navigation يصلان إلى كل P0 screen في ثلاث حركات معقولة أو أقل من Home، باستثناء إعدادات عميقة.
- [ ] حالات 403/404/session expiry/offline معرفة.
