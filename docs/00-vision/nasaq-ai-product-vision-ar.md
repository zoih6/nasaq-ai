# نَسَق AI — الرؤية الشاملة لمنصة النماذج والوكلاء والتدفقات

**نوع الوثيقة:** Product Vision + UX Blueprint + Technical Direction  
**الإصدار:** 0.1 — تصور أولي قبل التنفيذ  
**الجمهور الأول:** محترفون وفرق عربية صغيرة  
**اللغة:** عربي أولًا مع إنجليزية كاملة  
**نموذج الوصول:** مفاتيح المستخدم BYOK + رصيد موحد من المنصة  
**خطة التنفيذ المختارة:** تصميم Frontend تفاعلي شامل أولًا، ثم ربط الـBackend تدريجيًا

> **الخلاصة:** الفكرة ليست «واجهة دردشة تجمع APIs» فقط، بل **مساحة عمل موحدة للذكاء الاصطناعي** يستطيع المستخدم فيها أن يحاور عدة نماذج، يقارنها، يحول المحادثة إلى مهمة ينفذها وكيل، ثم يحول المهمة المتكررة إلى Flow قابل للتشغيل والمراقبة.

---

## 1. فهمي الدقيق لفكرتك

نعم، فهمت قصدك. تريد منصة SaaS لها ثلاث طبقات مترابطة:

1. **طبقة المحادثة متعددة النماذج:** تجربة مألوفة مثل تطبيقات المحادثة الحديثة، لكن المستخدم يستطيع اختيار نموذج من مزودات مختلفة، التبديل بينها، أو مقارنة أكثر من نموذج داخل السياق نفسه.
2. **طبقة الوكلاء:** المستخدم لا يطلب جوابًا فقط، بل يعطي هدفًا؛ والوكيل يخطط، يستخدم أدوات، يتصفح، يقرأ ملفات، يكتب كودًا أو مستندات، يطلب موافقة عند العمليات الحساسة، ثم يسلم نتائج وملفات وأدلة.
3. **طبقة التدفقات والأتمتة:** المستخدم يحول الخطوات المتكررة إلى Flow بصري يجمع triggers، نماذج، وكلاء، شروطًا، APIs، موافقة بشرية، ومخرجات.

ثم نبدأ **بالمظهر وتجربة الاستخدام والهيكلة كاملة ببيانات تجريبية واقعية**، بحيث يصبح لدينا منتج قابل للنقر والاختبار، وبعد اعتماد التصميم ننتقل إلى المصادقة، قواعد البيانات، AI Gateway، مزودات النماذج، الفوترة، sandboxes، وتشغيل الوكلاء والتدفقات.

هذا ترتيب صحيح بشرط مهم: لا نصمم صفحات جميلة منفصلة عن الواقع؛ سنحدد من البداية **عقود البيانات، الحالات، الصلاحيات، حالات الخطأ، وحدود الوكيل** حتى لا نعيد بناء الواجهة عند وصول الـBackend.

---

## 2. الاسم والهوية المقترحة

### الاسم الأساسي المؤقت: **نَسَق AI — Nasaq AI**

كلمة «نَسَق» تعني التنظيم والترابط ووضع العناصر في نظام واحد، وهذا يطابق المنتج:

- نسق بين النماذج.
- نسق بين الأدوات والوكلاء.
- نسق بين خطوات الـworkflow.
- نسق بين المعرفة والملفات والمشاريع.

### الوعد المختصر

> **كل نماذجك ووكلائك وتدفقاتك، في مساحة عمل واحدة.**

بالإنجليزية:

> **One workspace for models, agents, and flows.**

### أسماء بديلة قبل فحص النطاق والعلامة

| الاسم | الفكرة | الملاحظة |
|---|---|---|
| **Nasaq / نَسَق** | orchestration والتنظيم | اختياري الأول؛ عربي ومميز نسبيًا |
| **Madar / مدار** | النماذج والخدمات تدور حول مساحة واحدة | جميل لكنه مستخدم بكثرة |
| **Masar / مسار** | من المحادثة إلى التنفيذ إلى الأتمتة | واضح لكنه عام |
| **Wasl / وصل** | وصل المزودات والأدوات والبيانات | مناسب للـintegrations |
| **Nexora** | اسم عالمي تقني | أقل ارتباطًا بالهوية العربية |

**تنبيه:** الاسم مؤقت حتى نجري بحث domain/trademark ونتحقق من أسماء التطبيقات والمتاجر والشركات في الأسواق المستهدفة.

### أسماء وحدات المنتج

- **Nasaq Chat** — المحادثة والمقارنة.
- **Nasaq Agents** — الوكلاء وتشغيل المهام.
- **Nasaq Flow** — الأتمتة والتدفقات.
- **Nasaq Knowledge** — الملفات ومصادر المعرفة.
- **Nasaq Gateway** — التوجيه والفوترة للمطورين.

---

## 3. المشكلة التي يحلها المنتج

المستخدم المحترف اليوم موزع بين تطبيقات كثيرة:

- نموذج قوي للكتابة في مكان.
- نموذج آخر للتحليل أو الكود في مكان آخر.
- وكيل ينفذ مهمة في تطبيق منفصل.
- أداة automation منفصلة.
- ملفات وسياق يعاد رفعهما في كل مرة.
- فواتير ومفاتيح API وسجلات استخدام متفرقة.

إذا كان المنتج مجرد «dropdown لاختيار model»، فسيصبح wrapper سهل التقليد. القيمة الحقيقية التي يجب أن يبنيها نَسَق هي:

1. **السياق مرة واحدة:** مشروع واحد يحوي ملفاته ومعرفته ومحادثاته ووكلاءه وتدفقاته.
2. **الاستقلال عن المزود:** المستخدم يختار، يقارن، وينقل المهمة دون نسخ ولصق.
3. **استقلال مضبوط لا أعمى:** الوكيل يوضح خطته وصلاحياته ويطلب موافقة عند الأثر الخارجي.
4. **من العمل اليدوي إلى التكرار:** أي محادثة ناجحة يمكن تحويلها إلى Agent، وأي Agent متكرر إلى Flow.
5. **شفافية التكلفة والأدلة:** تكلفة ووقت ومصادر وعمليات كل run ظاهرة.
6. **عربية أصلية:** ليست ترجمة لاحقة؛ RTL، محتوى عربي، بحث عربي، واختبار فعلي للنماذج في العربية.

---

## 4. التموضع والتميّز

### التموضع المقترح

**مساحة تشغيل AI للمحترفين والفرق العربية الصغيرة**، تجمع المحادثة متعددة النماذج، الوكلاء القابلين للتحكم، والتدفقات القابلة للتكرار.

### لماذا سيستخدمه شخص بدل التنقل بين التطبيقات؟

- يبدأ بنفس تجربة chat المألوفة، فلا يحتاج تدريبًا طويلًا.
- يقارن جوابين أو ثلاثة دون فقدان السياق.
- ينتقل من «أجبني» إلى «نفذ هذه المهمة» بضغطة واحدة.
- يرى ماذا فعل الوكيل، وما الذي فشل، وما الذي يحتاج موافقته.
- يحفظ العمل الناجح كقالب أو Flow.
- يستخدم مفتاحه الخاص أو رصيد المنصة.
- يدير تكلفة النماذج من مكان واحد.
- يعمل بالعربية والإنجليزية بنفس المستوى الوظيفي.

### الخندق التنافسي الممكن

ليس الوصول إلى API بحد ذاته. عناصر الدفاع الحقيقية مع الوقت:

- مكتبة workflows عربية متخصصة وذات نتائج مثبتة.
- model routing مبني على جودة فعلية حسب المهمة واللغة، لا تسويق المزود.
- سياق مشروع منظم قابل للنقل بين النماذج.
- سجل runs وreceipts يساعد الفرق على الثقة والمراجعة.
- نظام permissions وapproval أفضل من الوكلاء «الصناديق السوداء».
- integrations محلية وإقليمية يحتاجها السوق العربي.

---

## 5. المستخدمون الأساسيون

### 5.1 المحترف متعدد الاستخدام

باحث، استشاري، مدير منتج، مسوق أو صانع محتوى يستخدم عدة نماذج يوميًا.

**وظائفه:** البحث، التلخيص، المقارنة، التقارير، تحليل ملفات، إعداد عروض، وصياغة محتوى.

### 5.2 المطور أو الفريق التقني الصغير

يحتاج نماذج للكود، وكيلًا يعمل داخل repo معزول، اختبارات، ومقارنة حلول.

**وظائفه:** فهم codebase، إصلاح bugs، كتابة tests، مراجعة PR، توثيق، وتشغيل مهام متكررة.

### 5.3 فريق عمليات أو شركة صغيرة

يريد ربط البريد، النماذج، CRM، webhooks، المستندات، والتقارير دون بناء نظام كامل.

**وظائفه:** تصنيف الطلبات، استخراج بيانات، إعداد ردود، موافقات، إشعارات، وتقارير دورية.

### من لا نستهدفه أولًا؟

- المؤسسات التي تشترط SSO/SCIM وon-prem واعتمادات امتثال كاملة منذ اليوم الأول.
- المستخدم الذي يريد أرخص chat فقط ولا يحتاج مشاريع أو وكلاء.
- الأتمتة الصناعية الحرجة أو التعامل المالي المستقل بلا مراجعة بشرية.

---

## 6. ركائز المنتج الست

### 6.1 Chat متعدد النماذج

- اختيار نموذج محدد أو وضع Auto Router.
- تبديل النموذج في الرسالة التالية مع استمرار السياق.
- مقارنة 2–3 نماذج في عرض متوازٍ.
- branch من أي رسالة.
- رفع ملفات وصور وصوت حسب قدرة النموذج.
- بحث ويب وأدوات مع citations.
- حفظ prompt أو تحويله إلى template.
- حفظ نتيجة إلى Knowledge أو تصدير Markdown/PDF/DOCX.
- عرض tokens والتكلفة والمدة لكل جواب.
- إعادة المحاولة بنموذج آخر دون نسخ المحادثة.

### 6.2 Projects

المشروع هو حاوية السياق، وليس مجرد folder:

- تعليمات المشروع.
- الملفات ومصادر المعرفة.
- المحادثات.
- الوكلاء والتدفقات المرتبطة.
- أعضاء الفريق وصلاحياتهم.
- budget وسياسة النماذج.
- retention والخصوصية.

### 6.3 Agents

- Agent templates جاهزة.
- Agent Builder لإنشاء وكيل مخصص.
- model strategy: ثابت، fallback، أو router.
- tools وskills وknowledge ومصادر web.
- memory scope واضح.
- budgets وحدود steps/time/cost.
- approvals قبل عمليات write/send/delete/purchase/deploy.
- live run مع plan وخطوات وأدلة.
- artifacts ونسخ versions واختبارات.

### 6.4 Flow

- بناء بصري node-based.
- triggers يدوية أو webhook أو schedule أو form.
- model/agent/tool/API/data nodes.
- شروط وفروع وحلقات محدودة.
- human approval node.
- test run بمدخلات وهمية.
- versioning، replay، retry وlogs.
- قوالب جاهزة حسب المهنة.

### 6.5 Knowledge

- ملفات، روابط، ملاحظات، وصفحات معرفة.
- collections مرتبطة بمشروع أو فريق.
- مزامنة وتاريخ تحديث.
- citations إلى الصفحة/المقطع الأصلي.
- حالة ingestion وفشل parsing.
- صلاحيات على مستوى collection.
- حذف وتصدير واضحان.

### 6.6 Models, Usage & Billing

- كتالوج capabilities لا مجرد شعارات.
- سياق، modalities، tool calling، السرعة، والسعر التقريبي.
- health وحالة المزود.
- BYOK connections.
- wallet ورصيد واستهلاك.
- budgets وتنبيهات.
- تفصيل التكلفة حسب مستخدم/مشروع/نموذج/وكيل/Flow.

---

## 7. الهيكل العام للموقع

### 7.1 صفحات الموقع التسويقي

```text
/
/product/chat
/product/agents
/product/flows
/product/knowledge
/models
/solutions/research
/solutions/developers
/solutions/teams
/pricing
/security
/docs
/status
/sign-in
/sign-up
```

### 7.2 صفحات التطبيق

```text
/app                         الصفحة الرئيسية
/app/chat                    المحادثات
/app/chat/[conversationId]
/app/projects
/app/projects/[projectId]
/app/agents
/app/agents/new
/app/agents/[agentId]
/app/runs/[runId]
/app/flows
/app/flows/new
/app/flows/[flowId]
/app/flow-runs/[runId]
/app/knowledge
/app/models
/app/tools
/app/skills
/app/usage
/app/billing
/app/team
/app/settings
```

### 7.3 لوحة الإدارة الداخلية

ليست للمستخدم العام، لكنها ضرورية لاحقًا:

- provider/model registry.
- أسعار المزودات وهوامش المنصة.
- model health وcircuit breakers.
- routing policies.
- job queues والـsandboxes.
- العملاء والخطط والرصيد.
- abuse/rate limits.
- incidents وaudit logs.
- skill/tool registry والموافقات.

---

## 8. شكل التطبيق وتجربة التنقل

### 8.1 App Shell

**شريط جانبي ثابت قابل للطي:**

- الرئيسية
- محادثة جديدة
- المشاريع
- الوكلاء
- التدفقات
- المعرفة
- ثم مجموعة أصغر: النماذج، الأدوات والمهارات، الاستخدام
- في الأسفل: الفريق، الإعدادات، الحساب

**الشريط العلوي:**

- اسم workspace/project.
- البحث العام.
- Command Palette.
- زر إنشاء سريع: Chat / Agent / Flow / Project.
- notifications وحالة الرصيد.

**منطقة العمل:** تتغير حسب الوحدة.

**لوحة Inspector يمين/يسار حسب اللغة:** قابلة للطي، تعرض model، context، tools، settings، cost وrun details بدل توزيعها في modals كثيرة.

### 8.2 الصفحة الرئيسية داخل التطبيق

ليست dashboard مليئة ببطاقات وهمية. تعرض فقط ما يساعد المستخدم على الاستمرار:

1. مربع «ماذا تريد أن تنجز؟» مع خيارات Chat / Agent / Flow.
2. آخر المشاريع والمحادثات.
3. runs تحتاج موافقة أو فشلت.
4. قوالب مرتبطة بدور المستخدم.
5. الاستخدام والرصيد بصورة صغيرة عملية.
6. onboarding checklist إن لم يكتمل الإعداد.

---

## 9. تجربة Nasaq Chat بالتفصيل

### التخطيط

- **وسط الصفحة:** stream المحادثة.
- **الأعلى:** اسم المحادثة + model/router + project + مشاركة.
- **الأسفل:** composer غني لكن غير مزدحم.
- **Inspector:** system instructions، context، tools، temperature عند الحاجة، usage.

### Model Selector

لا يكون dropdown طويلًا من 100 اسم. يقسم إلى:

- **Auto**: أفضل / أسرع / اقتصادي / خصوصية أعلى.
- المفضلة.
- المزودات المتصلة.
- «قارن النماذج».
- كتالوج كامل داخل نافذة بحث ذات filters.

كل نموذج يظهر capabilities المناسبة، لا وعودًا غامضة:

- نص/صورة/صوت.
- tool calling.
- context تقريبي.
- latency class.
- cost class.
- BYOK أو Credits.

### Compare Mode

- عمودان افتراضيًا وثلاثة كحد أقصى على desktop.
- prompt واحد وسياق موحد، مع إظهار أي اختلاف بسبب capability.
- مدة وتكلفة ومصادر لكل نتيجة.
- إجراءات: «تابع بهذه»، «ادمج الأفضل»، «أنشئ branch»، «احفظ كاختبار».
- لا نخفي إذا فشل نموذج أو استُبدل fallback.

### Composer

- نص وملفات وصور.
- زر أدوات منفصل.
- اختيار scope للذاكرة: هذه المحادثة / المشروع / بدون ذاكرة.
- تقدير تكلفة قبل الإرسال عند المهام الكبيرة.
- زر Stop واضح أثناء streaming.

### حالات لا بد أن تصمم

- محادثة فارغة.
- streaming.
- tool call يعمل.
- مصدر غير موثوق أو citation ناقص.
- model overloaded.
- API key غير صالح.
- رصيد غير كافٍ.
- file parsing جارٍ أو فشل.
- context تجاوز الحد.
- content policy block.
- انقطاع ثم resume.
- fallback إلى model آخر بعد موافقة/سياسة معلنة.

---

## 10. تجربة Nasaq Agents

### 10.1 صفحة الوكلاء

Tabs عملية:

- My Agents
- Templates
- Runs
- تحتاج موافقتي

كل agent card تعرض الاسم، الغرض، آخر نسخة، tools الحساسة، آخر run، ونسبة الإكمال الفعلية؛ لا تعرض metrics مختلقة.

### 10.2 القوالب الأولى

1. **وكيل البحث:** يبحث، يقارن مصادر، ينتج تقريرًا موثقًا.
2. **محلل الملفات:** يستخرج ويقارن ويلخص مستندات المستخدم.
3. **وكيل المطور:** يعمل في repo/sandbox، يخطط، يعدل، يختبر ويقدم diff.
4. **وكيل المتصفح:** ينفذ خطوات على مواقع مصرح بها مع approval للآثار الخارجية.
5. **وكيل البيانات:** يحلل CSV/XLSX أو SQL read-only ويولد artifact.
6. **وكيل العمليات:** يربط APIs وwebhooks ويجهز تشغيلًا متكررًا.
7. **وكيل مخصص:** يبدأ من وصف المستخدم.

في أول Backend MVP أنصح بتشغيل **وكيل البحث ومحلل الملفات** أولًا؛ أما code execution وbrowser write فهما أعلى مخاطرة ويأتيان بعد sandbox والpermissions.

### 10.3 Agent Builder

Wizard من سبع خطوات:

1. **الهدف والحدود:** ماذا يفعل؟ ماذا لا يفعل؟
2. **Instructions:** مع preview واضح، لا prompt مخفي.
3. **Model policy:** نموذج أساسي، fallback، أو router.
4. **Knowledge:** project/collection/files.
5. **Tools & Skills:** كل أداة مع مصدرها وصلاحياتها.
6. **Permissions & Budgets:** read/write/network، domains، تكلفة، وقت، steps.
7. **Tests & Publish:** حالات نجاح وفشل قبل نشر النسخة.

### 10.4 شاشة تشغيل الوكيل

هذه أهم شاشة تميز المنتج. تقسم إلى:

- **الهدف الحالي.**
- **الخطة:** steps وحالتها.
- **Activity Timeline:** ماذا قرأ؟ أي tool استُدعيت؟ ماذا نتج؟
- **Workspace حي:** tabs للBrowser، Terminal، Files، Preview حسب نوع الوكيل.
- **Approval Queue:** بطاقة واضحة: الفعل، الهدف، البيانات المرسلة، المخاطر، التكلفة، Allow once / Always for scope / Reject.
- **Artifacts:** تقرير، ملف، patch، screenshot، dataset.
- **Run Controls:** Pause، Stop، Resume، Retry step، Branch run.
- **Budget:** تكلفة، وقت، tokens، steps المتبقية.

### 10.5 Receipts

عند الإكمال لا يكتفي الوكيل بعبارة «تم». يسلم:

- summary قصير.
- قائمة actions الفعلية.
- مصادر وروابط.
- test outputs أو screenshots/diffs.
- artifacts.
- assumptions.
- ما لم يستطع التحقق منه.
- التكلفة والمدة.

---

## 11. تجربة Nasaq Flow

### 11.1 تخطيط Flow Builder

- **الوسط:** canvas.
- **لوحة nodes:** جهة البداية.
- **Inspector:** خصائص node المحددة.
- **أسفل الشاشة:** test input، run logs، output.
- **الأعلى:** اسم/version، Draft/Published، Test، Publish، Run.

### 11.2 أنواع العقد

| الفئة | أمثلة |
|---|---|
| Trigger | Manual، Schedule، Webhook، Form، New file |
| AI | Prompt/Model، Structured extraction، Classifier، Summarizer |
| Agent | Run Agent، Wait for Agent، Review Agent Output |
| Data | Map، Filter، Merge، Parse file، Format JSON |
| Logic | If، Switch، Limited loop، Retry، Delay |
| Knowledge | Search collection، Add document، Retrieve citations |
| Integration | HTTP request، Email، Slack/Teams لاحقًا، Database read |
| Governance | Human approval، Policy check، Budget check |
| Output | Save artifact، Send response، Webhook response، Notify |

### 11.3 قواعد أساسية

- كل node لها typed input/output.
- أي loop له max iterations.
- كل HTTP/action node لها timeout وretry/idempotency policy.
- secrets references فقط، لا تُعرض قيمها في canvas أو logs.
- write nodes مميزة بصريًا عن read nodes.
- test mode لا ينفذ side effects افتراضيًا.
- version منشورة immutable؛ التعديل ينشئ draft جديدًا.
- كل run قابل لإعادة العرض step by step.

### 11.4 قوالب Flow أولية للسوق العربي

- رابط/موضوع → بحث عربي/إنجليزي → مصادر → تقرير → مراجعة بشرية → تصدير.
- ملفات عروض → استخراج → تلخيص → مقارنة → brief تنفيذي.
- نموذج عميل → تصنيف → draft reply → موافقة → إرسال.
- Webhook متجر → تحليل طلب/شكوى → route → إشعار.
- تقرير أسبوعي من مصادر متعددة → synthesis → PDF/Email.
- Issue جديد → تحليل → اقتراح plan → موافقة → إنشاء tickets.

---

## 12. الهوية البصرية المقترحة

### المفهوم: **Precision Workspace / غرفة عمل دقيقة**

المنتج يجب أن يشعر بأنه أداة عمل موثوقة، لا صفحة «سحر AI».

### ما سنبتعد عنه

- purple/blue gradients العامة.
- glassmorphism.
- robot heads وmagic sparkles.
- بطاقات ضخمة لكل شيء.
- radius كبير وshadow متوهج.
- dashboard مليء بأرقام غير حقيقية.
- حركة fade-up على كل عنصر.
- نصوص مثل «أطلق إمكاناتك بلا حدود» دون معنى.

### نظام الألوان الأولي

| الدور | اللون المقترح |
|---|---|
| خلفية عامة | Warm stone `#F5F3EE` |
| Surface | Paper `#FFFDF8` |
| النص | Ink `#17201B` |
| Sidebar الداكن | Forest ink `#123B2F` |
| Primary | Teal `#0B7859` |
| Accent/Attention | Amber `#D58B43` |
| Success | Green `#23845D` |
| Warning | Ochre `#B76A22` |
| Error | Brick `#B8443C` |
| Border | `#D8DED9` |

ليست هذه palette نهائية؛ تُختبر contrast وdark mode قبل اعتمادها.

### الخطوط

- العربية: **IBM Plex Sans Arabic** أو **Noto Sans Arabic** بعد اختبار القراءة والأوزان.
- اللاتينية: **IBM Plex Sans**.
- الكود: **IBM Plex Mono**.
- self-hosting للأداء والخصوصية مع مراجعة الرخص.

### الشعار

علامة هندسية من ثلاثة مسارات تلتقي في عقدة واحدة، أو حرف «ن» مجرد مبني من nodes/paths. لا نستخدم دماغًا أو نجمة سحرية.

### الحركة

- 120–220ms لمعظم transitions.
- الحركة تشرح state أو spatial relationship.
- لا حركة متكررة في command palette أو التنقل السريع.
- `prefers-reduced-motion` إلزامي.
- agent steps تظهر بتغيير حالة واضح، لا animation استعراضية مستمرة.

### فرق الكثافة

- الموقع التسويقي: مساحات أكبر وسرد بصري.
- التطبيق: كثافة متوسطة، حدود رقيقة، معلومات قابلة للمسح.
- Agent/Flow: كثافة أعلى مع hierarchy صارمة.

---

## 13. العربية وRTL من اليوم الأول

- كل المكونات تستخدم logical properties، لا left/right ثابتة.
- اتجاه code وIDs وURLs يبقى LTR داخل حاويات معزولة.
- تبديل اللغة لا يعيد تحميل المشروع.
- تواريخ وأرقام وعملات قابلة لاختيار locale.
- لا تُعكس أيقونات غير اتجاهية؛ تعكس back/forward والتقدم المكاني فقط.
- flow canvas لا يُعكس آليًا بطريقة تربك اتجاه graph؛ نختبر اتجاهين ونختار منطقًا ثابتًا.
- دعم نص عربي طويل وmixed bidi.
- keyboard navigation وscreen readers بالعربية والإنجليزية.
- تصميم mobile عربي حقيقي، لا مجرد قلب CSS.

---

## 14. تجربة الهاتف

المنتج desktop-first لأن Agents وFlow يحتاجان مساحة، لكن الهاتف يدعم:

- Chat كامل.
- رفع ملف وصورة.
- متابعة run.
- approve/reject.
- قراءة artifacts والإشعارات.
- تشغيل Flow جاهز.

ولا نحاول في النسخة الأولى تقديم تحرير flow canvas كامل على شاشة صغيرة؛ نعرضه read-only مع تعديل خصائص بسيطة أو نطلب desktop.

---

## 15. التسعير ونموذج الوصول الهجين

### 15.1 BYOK

المستخدم يربط مفتاح مزوده:

- يدفع للمزود مباشرة.
- نَسَق يفرض اشتراك المنتج أو رسوم بنية واضحة، لا markup مخفيًا.
- المفتاح مشفر ولا يعاد عرضه.
- يمكن تحديده لمستخدم أو workspace أو مشروع.

### 15.2 Managed Credits

- المستخدم يشحن رصيدًا موحدًا.
- نَسَق يدفع للمزودات ويعرض التكلفة الفعلية/المحتسبة بوضوح.
- مناسب لمن لا يريد إنشاء حسابات API كثيرة.
- يحتاج anti-abuse، limits، reserves وledger دقيقًا.

### 15.3 الخطط المبدئية

| الخطة | لمن؟ | تصور المزايا |
|---|---|---|
| Starter | فرد يجرب أو يستخدم BYOK | chats، مشروع محدود، provider connections، agents/runs محدودة |
| Pro | محترف يومي | managed credits، compare، agents أكثر، flows، knowledge أكبر، budgets |
| Team | فريق صغير | shared projects، roles، usage by member، approvals، audit log، centralized keys |
| Enterprise لاحقًا | مؤسسات | SSO/SCIM، retention controls، private networking، contracts وsupport |

لا نحدد أسعارًا نهائية قبل حساب unit economics ورسوم الدفع وشروط إعادة بيع استخدام كل مزود. يجب أن يكون ledger بالعملة الأصغر، immutable، مع reserve قبل الطلب وsettlement بعد usage الفعلي.

---

## 16. استراتيجية المزودات وAI Gateway

### البداية الموصى بها

ربط مباشر مع **ثلاثة مزودين رئيسيين فقط** يمثلون قدرات متنوعة، ثم إضافة long tail لاحقًا. لا نطلق بعشرات النماذج غير المختبرة.

### Provider Adapter موحد

كل adapter ينفذ عقدًا موحدًا لـ:

- model discovery/config.
- streaming responses.
- multimodal content.
- tool calls.
- structured output.
- usage reporting.
- errors/retries/cancellation.
- embeddings أو image/audio عند دعمها.

### Model Registry

لا نخزن أسماء models في الواجهة. الـregistry يحوي:

- provider/model ID.
- capabilities.
- context and output limits.
- pricing version وتاريخ السريان.
- availability/region.
- BYOK/managed eligibility.
- health.
- deprecation date.

### Auto Router

أوضاع واضحة:

- **Best fit:** جودة المهمة أولًا.
- **Fast:** زمن الاستجابة.
- **Economy:** سقف التكلفة.
- **Private policy:** فقط المزودات المتوافقة مع سياسة workspace.
- **Custom:** rule يكتبه الفريق.

كل قرار route يسجل السبب المختصر. لا نبدل model بصمت إذا كان ذلك يغير التكلفة أو الخصوصية أو capability.

### direct مقابل aggregator

- direct لأهم المزودات: تحكم، شفافية، ودعم أفضل.
- aggregator اختياري للـlong tail أو fallback بعد مراجعة الشروط.
- architecture لا تجعل aggregator مصدر الحقيقة الوحيد.

قبل العرض التجاري نراجع API terms، استخدام العلامات والشعارات، سياسات البيانات، القيود الجغرافية، وحق تمرير التكلفة للمستخدم.

---

## 17. الأمان والثقة — جزء من UX لا صفحة قانونية فقط

### مفاتيح المزودات

- تشفير server-side عبر KMS/secret manager.
- لا تعاد القيمة إلى browser بعد الحفظ.
- secret references في DB، لا raw key.
- فصل tenant/workspace.
- rotation/revoke/test connection.
- audit لمن استخدم المفتاح ومتى، دون تسجيل قيمته.

### الوكلاء والأدوات

- deny by default.
- read وwrite صلاحيتان منفصلتان.
- network allowlist.
- sandbox مؤقت لكل run عالي المخاطر.
- لا وصول إلى browser profile الشخصي أو SSH/cloud credentials.
- confirmation للعمليات الحساسة.
- budget/timeout/max steps/kill switch.
- untrusted web/DOM/tool output يعامل كبيانات لا تعليمات.

### Skill Supply Chain

كل skill داخل المنصة تعرض:

- source repository.
- publisher.
- commit SHA/version.
- license.
- files/scripts/hooks/MCP.
- permissions المطلوبة.
- آخر مراجعة داخلية.
- diff عند التحديث.

لا يوجد install global افتراضيًا، ولا `@latest` في الإنتاج، ولا binary مجهول.

### البيانات والمعرفة

- RLS/tenant isolation.
- retention configurable.
- export/delete.
- PII redaction options.
- لا cross-project memory بلا تصريح.
- citations وsource access checks.
- مزود التخزين والمنطقة معلنان.

### التدفقات والـwebhooks

- توقيع webhooks.
- idempotency keys.
- replay protection.
- secret redaction في logs.
- separate test/live credentials.
- immutable published versions.
- audit لكل side effect.

لا ندعي «GDPR compliant» أو «zero retention» إلا بعد وجود ضوابط وعقود واختبار فعلي؛ نعرض بدقة ما يحدث للبيانات مع كل مزود.

---

## 18. خطة Frontend-first الدقيقة

### الهدف

إنشاء **منتج تفاعلي كامل بصريًا ووظيفيًا من جهة الواجهة** باستخدام mock contracts، وليس صور Figma لا تعمل. بعد اعتماده نستبدل mock services بالـAPIs الحقيقية تدريجيًا.

### المرحلة F0 — Product Contract

قبل أي مكون:

- `PRD.md`: الجمهور، المشكلة، scope، وعدم الأهداف.
- `DESIGN.md`: الهوية، التوكنز، الكثافة، الحركة، RTL والوصولية.
- sitemap وroute map.
- entities وstate machines.
- permission matrix.
- API contracts الأولية.
- content inventory بالعربية والإنجليزية.

### المرحلة F1 — Design System

نبني:

- color/type/spacing/radius/elevation/motion tokens.
- Button، Input، Select، Tabs، Dialog، Drawer، Tooltip.
- Sidebar، Command Palette، Data Table، Empty State.
- Model Badge، Provider Connection، Cost Badge.
- Run Status، Step Timeline، Approval Card، Artifact Card.
- Flow Node، Edge، Inspector Field، Log Row.
- حالات focus/error/loading/disabled/skeleton.
- light وdark themes.
- RTL/LTR stories.

### المرحلة F2 — الموقع التسويقي

- Landing page.
- Chat/Agents/Flow pages.
- Models directory.
- Pricing.
- Security.
- Sign in/up.

نستخدم screenshots حقيقية من prototype نفسه، لا fake browser UI.

### المرحلة F3 — App Shell وOnboarding

- account/workspace mock.
- اختيار اللغة والاستخدام.
- ربط provider وهمي أو اختيار credits.
- home/recent work.
- command palette.
- notifications.

### المرحلة F4 — Chat Prototype

- streaming simulation.
- model switch.
- compare mode.
- branching.
- files/tool/citation states.
- cost and errors.
- mobile chat.

### المرحلة F5 — Agents Prototype

- agent list/templates.
- builder wizard.
- live run timeline.
- browser/terminal/files mock panels.
- approvals.
- artifacts وreceipts.
- pause/stop/retry states.

### المرحلة F6 — Flow/Knowledge/Usage

- visual flow builder.
- typed nodes and inspector.
- test run simulation.
- knowledge collections/status.
- model catalog.
- BYOK vault UI.
- usage/billing/team/settings.

### Definition of Done للـFrontend

- جميع المسارات الرئيسية قابلة للنقر من البداية للنهاية.
- لا يوجد زر أساسي بلا سلوك أو حالة مقصودة.
- desktop/tablet/mobile وفق استراتيجية كل شاشة.
- العربية والإنجليزية كاملتان في المسارات الأساسية.
- keyboard/focus/zoom/reduced-motion.
- automated a11y + manual checks.
- Playwright للمسارات الحرجة.
- visual regression للـRTL/LTR وlight/dark.
- fixtures واقعية بلا عملاء أو metrics مختلقة.
- component documentation.
- عقود TypeScript جاهزة لاستبدال mocks بالـBackend.

---

## 19. التقنية المقترحة للـFrontend

### Stack

- **Next.js App Router** بالإصدار الحالي وقت البناء، مع docs المطابقة للإصدار.
- **TypeScript strict**.
- **Tailwind CSS + CSS variables** للتوكنز، أو CSS Modules حيث يلزم.
- **Radix/shadcn primitives** للوصولية، مع هوية مخصصة لا defaults المرئية.
- **@xyflow/react** للـFlow canvas بعد prototype صغير للأداء وRTL.
- **next-intl** أو طبقة i18n مماثلة.
- **Zod** لعقود البيانات والنماذج.
- **TanStack Query** عند بدء الربط؛ mocks في البداية.
- **Zustand** لحالة UI المحلية فقط، لا كقاعدة بيانات.
- **MSW** أو mock adapter لعقود API.
- **Storybook** لمكونات النظام والحالات.
- **Playwright + axe** للوظيفة والوصولية.

### بنية المشروع الأولى

```text
apps/
  web/
packages/
  ui/             design system
  contracts/      types + zod schemas
  mock-api/       fixtures + handlers
  i18n/           ar/en messages
  config/         shared lint/ts settings
```

ثم يضاف لاحقًا دون تغيير عقود الواجهة:

```text
apps/
  gateway/
  agent-worker/
  workflow-worker/
packages/
  provider-adapters/
  agent-core/
  billing-core/
```

---

## 20. تصور الـBackend عندما نصل إليه

### الخدمات المنطقية

1. **Identity & Workspaces:** users، memberships، roles، sessions.
2. **AI Gateway:** provider adapters، model registry، routing، streaming، limits.
3. **Conversation Service:** messages، branches، attachments، citations.
4. **Agent Orchestrator:** plans، steps، tools، approvals، resume.
5. **Sandbox Manager:** code/browser environments المعزولة.
6. **Workflow Engine:** durable runs، retries، schedules، webhooks.
7. **Knowledge Service:** ingestion، parsing، embeddings، retrieval، ACL.
8. **Usage & Billing:** events، pricing، wallet ledger، invoices، budgets.
9. **Audit & Observability:** traces، logs، metrics، security events.

قد تبدأ كـmodular monolith وخدمات workers منفصلة، لا microservices كثيرة منذ اليوم الأول.

### التخزين المتوقع

- PostgreSQL للبيانات الأساسية والـledger.
- pgvector أو vector store مدروس للمعرفة.
- S3-compatible storage للملفات والartifacts.
- Redis/Valkey للكاش والrate limits والqueues القصيرة.
- durable workflow engine للمهام الطويلة؛ لا نبني resume/retry engine حساسًا من الصفر.

### Streaming

- SSE للمحادثات وrun events أحادية الاتجاه.
- WebSocket فقط عندما نحتاج terminal/browser interaction ثنائي الاتجاه.
- event IDs وresume من آخر حدث.

---

## 21. الكيانات التي يجب أن يعرفها الـFrontend من الآن

- `User`
- `Workspace`
- `Membership`
- `Project`
- `Conversation`
- `Message`
- `Attachment`
- `Citation`
- `ProviderConnection`
- `ModelDefinition`
- `RoutingPolicy`
- `AgentDefinition`
- `AgentVersion`
- `AgentRun`
- `RunStep`
- `ToolCall`
- `ApprovalRequest`
- `Artifact`
- `SkillDefinition`
- `ToolDefinition`
- `FlowDefinition`
- `FlowVersion`
- `FlowRun`
- `KnowledgeCollection`
- `KnowledgeDocument`
- `UsageEvent`
- `WalletTransaction`
- `AuditEvent`

### حالات التشغيل الأساسية

```text
AgentRun:
draft → queued → planning → running → waiting_approval → running
      → paused | completed | failed | cancelled

FlowRun:
queued → running → waiting_input/approval → running
       → completed | failed | cancelled

Message generation:
queued → streaming → completed | failed | cancelled
```

هذه الحالات تظهر في mocks من البداية حتى لا نصمم happy path فقط.

---

## 22. الـMVP الحقيقي بعد اكتمال التصميم

رغم أن الـFrontend سيعرض الرؤية كلها، أول نسخة Backend قابلة للإطلاق ينبغي أن تحتوي فقط على:

1. Auth + workspace + project.
2. Chat مع ثلاثة مزودات مباشرة.
3. BYOK + managed credits.
4. history، files أساسية، streaming، stop/retry.
5. model switching وcompare محدود.
6. usage/cost ledger.
7. وكيل بحث واحد بأدوات web/files وcitations وbudget.
8. approval وreceipts وartifacts.
9. Flow بسيط: manual/webhook → model/agent → condition → approval → output.
10. logs، rate limits، audit وadmin model health.

### ما يؤجل

- وكيل code كامل بصلاحيات واسعة.
- computer-use على حسابات المستخدم الشخصية.
- marketplace عام للمهارات.
- عشرات المزودات.
- native mobile apps.
- fine-tuning.
- autonomous multi-agent swarms.
- arbitrary code node خارج sandbox.
- enterprise SSO/on-prem قبل وجود طلب حقيقي.

---

## 23. مراحل المشروع

| المرحلة | المخرج |
|---|---|
| 0. Discovery | PRD.md، journeys، scope، risks، naming research |
| 1. Design Foundation | DESIGN.md، tokens، component inventory، IA |
| 2. Frontend Shell | marketing + app shell + onboarding |
| 3. Chat UI | chat/compare/files/states/mocks |
| 4. Agent UI | builder/run/approval/artifacts |
| 5. Flow UI | canvas/nodes/test/logs |
| 6. Platform UI | knowledge/models/usage/billing/team/admin |
| 7. Frontend QA | RTL/LTR، a11y، responsive، Playwright، visual QA |
| 8. Backend Foundation | auth/data/secrets/gateway/metering |
| 9. Provider Integration | adapters/streaming/router/errors |
| 10. Agent Runtime | queue/sandbox/tools/approvals/receipts |
| 11. Workflow Runtime | triggers/durable state/retries/versioning |
| 12. Private Beta | telemetry، support، pricing validation، hardening |

---

## 24. مؤشرات النجاح

### المنتج

- الوقت حتى أول محادثة ناجحة.
- نسبة من يربط مفتاحًا أو يشحن رصيدًا.
- نسبة المحادثات التي تستخدم model switch/compare.
- الوقت حتى أول Agent run مكتمل.
- نسبة runs المكتملة مع receipt صالح.
- نسبة workflows التي يعاد تشغيلها، لا مجرد إنشائها.
- retention حسب persona.

### الجودة

- provider request success وlatency.
- cancellation/resume correctness.
- تكلفة الخطأ أو retry.
- citation validity في البحث.
- accessibility failures.
- user-reported wrong side effects.

### الأعمال

- تكلفة المزود مقابل الإيراد.
- gross margin للرصيد المُدار.
- BYOK إلى paid conversion.
- تكلفة sandbox/agent run.
- support burden لكل 100 مستخدم.

لا نضع نسبًا دعائية قبل baseline. هدف أمني ثابت: **صفر side effects غير مصرح بها**.

---

## 25. المخاطر وكيف نقللها

| الخطر | المعالجة |
|---|---|
| المنتج يصبح chat wrapper | Projects + agents + flows + receipts + Arabic workflows |
| اتساع scope يمنع الإطلاق | Frontend vision كاملة، Backend MVP ضيق ومتدرج |
| تكلفة APIs وإساءة الاستخدام | hybrid BYOK، budgets، reserves، rate limits، abuse detection |
| اختلاف APIs | provider adapter + capability registry + contract tests |
| agent يسبب ضررًا | least privilege، sandbox، approvals، audit، kill switch |
| prompt injection من الويب | فصل التعليمات عن البيانات، allowlists، output validation |
| فقدان الثقة بسبب fallback | إفصاح صريح عن model route والفشل والتكلفة |
| نتائج عربية ضعيفة | eval set عربي حسب المهمة، لا الاعتماد على benchmark إنجليزي |
| vendor lock-in | canonical internal schema وexportable projects/artifacts |
| مشاكل قانونية/خصوصية | terms review، DPA، retention controls، region disclosure |
| تصميم مزدحم | progressive disclosure وInspector قابل للطي واختبار مستخدمين |

---

## 26. تصور الصفحة الرئيسية التسويقية

### Hero

**العنوان:**

> كل نماذجك ووكلائك وتدفقاتك. مساحة واحدة للعمل الفعلي.

**الوصف:**

> حاور أفضل النماذج، قارن النتائج، حوّل المحادثة إلى وكيل ينفذ المهمة، ثم احفظ العمل المتكرر كتدفق قابل للتشغيل والمراجعة — بالعربية والإنجليزية.

**الأزرار:**

- ابدأ مساحة عملك
- شاهد كيف ينفذ الوكيل مهمة

**المشهد البصري:** واجهة المنتج الحقيقية في وضع split: chat على جانب، وrun timeline/artifact على الجانب الآخر. لا fake metrics ولا browser chrome مزيف.

### بقية الصفحة

1. شريط capabilities والمزودات المدعومة بصياغة قانونية دقيقة.
2. «ابدأ بسؤال، انتهِ بنتيجة قابلة للتسليم» — رحلة Chat → Agent → Flow.
3. مقارنة النماذج مع شفافية الوقت والتكلفة.
4. الوكيل مع plan/approval/receipts.
5. Flow builder مع human checkpoint.
6. العربية وRTL والبحث ثنائي اللغة.
7. مفاتيحك أو رصيد موحد.
8. security controls.
9. use cases حقيقية.
10. pricing وFAQ وCTA أخير.

---

## 27. القرار المقترح

أوصي باعتماد **نَسَق AI** اسمًا مؤقتًا والعمل على المنتج كالتالي:

- **الرؤية كاملة:** Chat + Projects + Agents + Flow + Knowledge + Models/Usage.
- **التصميم:** عربي أولًا، احترافي، كثيف باعتدال، بعيد عن AI slop.
- **الـFrontend:** prototype تفاعلي كامل بكل الحالات والعقود.
- **الإطلاق التقني الأول:** Chat متعدد المزودات + hybrid billing + Research Agent + Flow محدود.
- **التوسع:** code/browser agents وintegrations وteam governance بعد إثبات الاستخدام والأمان.

أهم قرار: لا نقلد ChatGPT أو Gemini أو Manus بصريًا. نستعير الأنماط المألوفة التي تقلل التعلم، لكن نبني هوية نَسَق حول **التحكم، الشفافية، والانتقال من المحادثة إلى التنفيذ والتكرار**.

---

## 28. الخطوة التالية المباشرة

قبل كتابة الواجهة، ننشئ حزمة تأسيس صغيرة:

1. `PRD.md` النهائي مع الـMVP وعدم الأهداف.
2. `DESIGN.md` بالتوكنز والهوية والـRTL.
3. sitemap وscreen inventory.
4. user journeys الثلاث الأساسية.
5. data contracts وmock fixtures.
6. permission matrix للوكلاء.
7. monorepo وDesign System.

ثم نبدأ عمليًا بهذا الترتيب:

> **Landing + App Shell → Chat → Agent Run → Agent Builder → Flow Builder → Knowledge/Models/Usage → QA كامل.**
