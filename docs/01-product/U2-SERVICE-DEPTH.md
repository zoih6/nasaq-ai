# U2 — عمق الخدمات (Service Depth)

> **الحالة:** عقد تخطيط وتسليم جاهز لبدء التنفيذ، ولم يبدأ تنفيذ U2 بعد
> **تاريخ العقد:** 12 سبتمبر 2026 — Asia/Aden
> **خط الأساس المقفول:** `main@c71d83a9f422d476134b7e39ee077184fbdd2ae5`
> **النطاق:** Frontend-first، ثنائي اللغة، ومحاكاة صريحة فقط
> **العقد المرافق:** [مصفوفة التتبّع والجودة](../04-delivery/U2-TRACEABILITY-AND-QA.md)
> **طلب التنفيذ المستقل:** [U2 Implementation Prompt](../05-agent-context/U2-IMPLEMENTATION-PROMPT.md)
> **ملحق الحدود الإلزامي:** [فصل Service Workbench عن Product Agent Runtime](../05-agent-context/U2-PRODUCT-AGENT-BOUNDARY-ADDENDUM.md)

هذه الوثيقة هي العقد المرجعي للموجة **U2 — Service Depth**. وجودها لا يعني أن الموجة نُفذت؛ كل معاييرها تبدأ بحالة `NOT STARTED` إلى أن يقدم التنفيذ دليلًا حديثًا مطابقًا لمصفوفة التتبّع.

---

## 0. القرار التنفيذي المختصر

1. تُبنى **ست مساحات عمل متخصصة فعلًا**: Learn، Research، Create، Code، Analyze، Explore.
2. تبقى **Ask & Talk** البوابة العامة وحقل البدء المشترك؛ لا تُبنى لها أداة مجال سابعة. تقترح الوجهة المناسبة وتشرح السبب، ثم لا تنتقل إلا بعد تأكيد المستخدم.
3. يُستبدل القالب العام الحالي بمنظومة **Service Workbench مشتركة للحالة والجلسة والحفظ والإيصال**، فوقها compositions مستقلة لكل خدمة. لا يُسمح بتحويل `ServiceWorkspace` إلى component عملاق مليء بفروع `serviceId === ...`.
4. اختلاف الخدمات لا يثبت باللون والنص، بل باختلاف **المدخلات، التسلسل، سطح العمل، نقاط المراجعة، نوع المخرج، وحالات الفشل**.
5. U2 لا تضيف Backend أو نماذج أو بحث ويب أو رفع/معالجة ملفات حقيقية أو sandbox أو Git أو مزودًا خارجيًا. ما يمكن تنفيذه محليًا بصورة حتمية يُسمّى بوضوح «حساب محلي»، وما عدا ذلك fixture/simulation معلن.
6. لا تُغلق U2 إلا بعد تحقق عربي/إنجليزي، RTL/LTR، 320–1920px، إعادة تدفق 200%، keyboard، reduced motion، forced colors، Axe، ثلاثة محركات، الانحدارات السابقة، وdeployment مطابق للـcommit.

### النتيجة المطلوبة لكل بوابة

| البوابة | المهمة الجوهرية | المخرج طويل العمر | العلامة الفارقة في الواجهة |
|---|---|---|---|
| Ask & Talk | فهم المقصد وتوجيهه أو إجابته سريعًا | موجز/بذرة قابلة للتحويل | موجّه الوجهة وسبب الاقتراح |
| Learn | فهم موضوع وفق المستوى ثم التحقق من الفهم | مسار تعلم + تقدّم + ملاحظات | درس حالي + نقطة تحقق |
| Research | بناء سؤال وخطة ثم فحص الادعاءات والمصادر | تقرير موثق + مصفوفة أدلة | Evidence spine وclaim/source workspace |
| Create | الانتقال من brief إلى بنية ونسخ ومراجعة | مستند/عرض/تصور بصري بإصدارات | Canvas قابل للتحرير + شريط بدائل |
| Code | مراجعة تغيير مقترح قبل قبوله وفحص أثره | مشروع تجريبي + diff + review receipt | Diff-first workbench |
| Analyze | فصل البيانات والحساب والافتراض والتفسير | تحليل قابل لإعادة الفحص + جدول/رسم | Provenance وreconciliation دائمًا مرئيان |
| Explore | الانتقال في موضوع مترابط مع فهم «لماذا هذه الصلة» | رحلة/خريطة معرفة محفوظة | Map + list + trail متدرج |

---

## 1. سلطة الوثيقة وتسوية التعارضات

### 1.1 ترتيب المرجعية

عند التعارض يطبّق الترتيب التالي:

1. طلب المستخدم الصريح و`AGENTS.md`.
2. `docs/00-vision/NASAQ-UNIVERSAL-RESET.md`.
3. هذا العقد ومصفوفة U2 المرافقة.
4. السلوك المنفذ والمتحقق في U1.1/U1.2، خصوصًا `MOTION-AND-FEEDBACK.md` وCSS الفعلي.
5. عقود المنتج والمعمارية الحالية ما لم يوسّعها هذا العقد صراحةً.
6. `docs/02-design/DESIGN.md` فقط في الأجزاء غير المتعارضة.

### 1.2 قرار supersession بصري

`docs/02-design/DESIGN.md` يحمل أجزاء من اتجاه **Precision Workspace** السابق. لا يجوز استخدامه لإعادة المنتج إلى تموضع الفرق/المحترفين، لوحة تشغيل داكنة كثيفة، أو تصميم يناقض **Luminous Adaptive System** الذي اختاره المستخدم ونُفذ بالفعل. U2 توسع النظام المضيء الحالي ولا تعيد تصميم الهوية العامة من الصفر.

### 1.3 تفسير حدود roadmap

تذكر الرؤية «رفع ملفات» و«تشغيل آمن» ضمن U2، بينما تخصص U3 لمعالجة الملفات الحقيقية وU4 للـsandboxes. التفسير الملزم:

- U2 تعرض **رحلة اختيار ملف/مشروع بصورة نموذجية** وتعمل على fixtures مضمّنة.
- يمكنها قراءة metadata محلية محدودة عند اختيار ملف إذا نُفّذ ذلك بأمان، لكن **لا تقرأ المحتوى، لا ترفعه، لا تحلله، ولا تحفظه**.
- معاينة Code نتيجة ثابتة مرتبطة بحالة fixture؛ **لا تنفذ كود المستخدم**.
- المعالجة الحقيقية، البحث الحي، والنماذج والـsandboxes تبقى U3/U4 أو milestone مستقلًا بموافقة صريحة.

---

## 2. المشكلة التي تحلها U2

الوضع الحالي يمرر الخدمات السبع إلى `ServiceWorkspace` واحد. تتغير الأيقونة واللون والنص والأدوات الاسمية، لكن كل طلب ينتقل عبر timeout ثابت إلى المخرج التجريبي نفسه ذي الأقسام الثلاثة. لذلك لا يثبت الـprototype أن:

- التعلم يشخّص ويختبر ويُظهر تقدّمًا.
- البحث يراجع خطة وادعاءات ومصادر.
- الصناعة تحرر مخرجًا وتدير بدائل وإصدارات.
- البرمجة تكشف الملفات والـdiff والاختبارات والأثر.
- التحليل يربط الأرقام بالبيانات والحسابات والافتراضات.
- الاستكشاف يتيح خريطة ومسارًا وتفرعات قابلة للفهم.

**فرضية U2:** عندما يفتح الشخص خدمة، يجب أن يستطيع تمييزها دون قراءة اسمها أو الاعتماد على لونها، وأن يصل إلى أول قيمة خلال أقل من دقيقة من starter واضح، ثم يستطيع مراجعة المخرج وتعديله وحفظه محليًا دون الاعتقاد أن خدمة خارجية عملت.

---

## 3. الأهداف، النطاق، والاستثناءات

### 3.1 أهداف الموجة

- بناء رحلة مكتملة قابلة للاختبار لكل خدمة من setup إلى artifact.
- إعطاء كل خدمة نموذج بيانات وstate machine ومخرجًا متخصصًا.
- توفير shell وعقود ومحاكي مشترك دون محو اختلاف المجال.
- ربط Home/Ask/Library بالخدمات والمخرجات عبر handoff صريح.
- جعل provenance، الافتراضات، التحذيرات، وما لم يُنفذ مفهومًا للمستخدم العام.
- بناء أساس يمكن استبدال محاكيه بBackend لاحقًا دون إعادة كتابة الواجهة.

### 3.2 داخل U2

- React/Next.js Frontend وتفاعلات محلية.
- عقود Zod مشتركة، reducers/transition guards، fixtures عربية وإنجليزية.
- deterministic event simulator بساعة قابلة للحقن والإلغاء وإعادة المحاولة.
- حفظ مؤقت اختياري في `sessionStorage` خلف adapter، مع disclosure ومسح صريح.
- حسابات حتمية على datasets مضمّنة فقط في Analyze.
- تحرير نصي/هيكلي محلي محدود يناسب prototype.
- مصادر وادعاءات وdiffs ورسوم وخرائط نموذجية مع provenance واضح.
- اختبارات unit/integration/E2E وأدلة مرئية وإيصالات تسليم.

### 3.3 خارج U2

- Authentication، حسابات، فرق، مزامنة أجهزة، مشاركة حقيقية.
- قاعدة بيانات أو Neon/Supabase أو تخزين سحابي.
- استدعاء LLM أو image model أو provider أو router.
- بحث ويب أو قراءة URL أو PDF أو مصدر خارجي لحظيًا.
- رفع أو معالجة محتوى ملفات المستخدم، OCR، embeddings، RAG.
- تنفيذ كود أو shell أو package install أو sandbox أو Git/GitHub/Vercel من داخل المنتج.
- إرسال بريد، نشر، دفع، BYOK فعلي، telemetry خارجي.
- collaboration، comments متعددة المستخدمين، تصدير PDF/PPTX/DOCX إنتاجي.
- rich-text/IDE/data-science suite كاملة.

### 3.4 عقد الحقيقة (Prototype Truth Contract)

| ما يراه المستخدم | ما يحدث فعلًا في U2 | النص/الإيصال المطلوب | المرحلة الحقيقية لاحقًا |
|---|---|---|---|
| «بحث» | أحداث ومصادر fixture مضمّنة | «محاكاة بحث — لم يتم الاتصال بالويب» | U4 |
| «توليد درس/تقرير/نسخة» | اختيار deterministic output من fixture وقواعد محلية | «مخرج تجريبي مُعد مسبقًا» | U4 |
| «إضافة ملف» | sample selector؛ metadata فقط إن اختير ملف محلي | «لم يُرفع أو يُقرأ محتوى الملف» | U3 |
| «تشغيل اختبارات/معاينة» | نتائج ومعاينة fixture، بلا `eval` أو process | «لم يُنفذ الكود» | U4 |
| «تحليل» | حسابات محلية حتمية على dataset مضمّنة + سرد fixture | يفصل «محسوب محليًا» عن «تفسير تجريبي» | U3/U4 |
| «إنشاء صورة» | بدائل SVG/صور محلية معدّة مسبقًا | «تصورات نموذجية، لا توليد صورة» | U4 |
| «حفظ في مكتبتي» | `sessionStorage` في التبويب الحالي | «محفوظ محليًا لهذه الجلسة، بلا حساب أو مزامنة» | U3 |
| «تكلفة/نموذج» | لا طلب مزود ولا تكلفة فعلية | لا تعرض تكلفة أو provider كأنه استُخدم | U4 |

**قاعدة:** كل نتيجة نهائية تملك `SimulationReceipt` قابلًا للفتح يذكر ما حُوكي، وما حُسب محليًا، وما لم يحدث، وما حُفظ، وهل وقع أي اتصال شبكة. لا تكفي شارة صغيرة منفردة إذا كان الفعل قد يُفهم كتنفيذ حقيقي.

---

## 4. مصطلحات ونواميس لا تُكسر

| المصطلح | التعريف الملزم |
|---|---|
| Service | مجال عمل له مدخلات ومراحل ومخرج متخصص، لا skin بصريًا فقط |
| Service session | حاوية مقصد المستخدم، الإعداد، runs، artifacts، وhandoffs ضمن خدمة |
| Service run | محاولة واحدة غير قابلة للعودة من حالة نهائية إلى نشطة |
| Stage | مرحلة مجال مرئية مثل diagnostic أو source review؛ ليست status async عامًا |
| Artifact | المخرج القابل للتحرير/الحفظ، مع نوع وإصدار وprovenance |
| Artifact version | snapshot غير صامت؛ كل revert/branch أو تعديل بعد save ينشئ نسخة معلومة |
| Evidence ref | علاقة قابلة للفحص بين مصدر ومقتطف/locator وادعاء |
| Simulation receipt | كشف آلي/مرئي لحدود التنفيذ المحلي والمحاكاة |
| Handoff | حزمة يراجعها المستخدم قبل فتح خدمة أخرى، ولا تمثل ذاكرة خفية |
| Fixture | بيانات ثابتة مع ID وlocale وscenario وprovenance |

### Invariants

1. لا تنتقل الواجهة إلى success لمجرد انقضاء timeout؛ transition يأتي من event معلوم.
2. كل retry ينشئ `run_` جديدًا يحمل `retryOf`؛ لا يُعاد تنشيط run نهائي.
3. `cancel_requested` لا يساوي `cancelled`، حتى في المحاكي.
4. لا يُستبدل artifact محفوظ بصمت؛ ينشأ version جديد أو يعرض dirty state.
5. لا يُنسب ادعاء بحث إلى مصدر بلا `EvidenceRef` صالح وlocator/مقتطف.
6. لا يُعرض رقم تحليلي باعتباره محسوبًا ما لم ينتج من transform محلي قابل لإعادة التشغيل على fixture محدد.
7. لا ينفذ Code أي نص ككود، HTML، URL، أو command.
8. لا تتجاوز بيانات handoff ما اختاره المستخدم وعاينه.
9. لا يدخل prompt أو source excerpt أو code أو file name في analytics أو URL أو console.
10. اللون والحركة والموقع ليست الوسيلة الوحيدة لأي معنى.
11. كل فعل ظاهر إما يعمل، أو disabled بسبب ظاهر، أو غير معروض؛ لا أزرار ميتة.
12. النص العربي والإنجليزي جزء من نفس definition of done، لا backlog ترجمة.

---

## 5. هندسة المعلومات والمسارات

لا تُنشأ route لكل خطوة. تبقى الجلسة داخل route الخدمة، ويُستخدم state داخلي typed. لا يوضع prompt أو اسم ملف أو artifact content في query string.

| Screen ID | Route ID | المسار | السطح | الفعل الأساسي |
|---|---|---|---|---|
| `U2-ASK-001` | `R-U2-ASK-001` | `/{locale}/app/chat` | Ask & Talk + اقتراح الوجهة | متابعة هنا أو تأكيد handoff |
| `U2-LRN-001` | `R-U2-LRN-001` | `/{locale}/app/learn` | Learn workbench | بدء/متابعة الدرس والتحقق |
| `U2-RSH-001` | `R-U2-RSH-001` | `/{locale}/app/research` | Research workbench | مراجعة الخطة ثم البحث النموذجي |
| `U2-CRT-001` | `R-U2-CRT-001` | `/{locale}/app/create` | Create studio | تحرير المخرج والنسخ |
| `U2-COD-001` | `R-U2-COD-001` | `/{locale}/app/code` | Code workbench | مراجعة/قبول diff ثم checks |
| `U2-ANA-001` | `R-U2-ANA-001` | `/{locale}/app/analyze` | Analyze workbench | تحديد السؤال ثم فحص النتيجة |
| `U2-EXP-001` | `R-U2-EXP-001` | `/{locale}/app/explore` | Explore map/trail | اختيار الصلة التالية |
| `U2-LIB-001` | `R-U2-LIB-001` | `/{locale}/app/library` | مكتبة artifacts والجلسات المحلية | فتح/استئناف/مسح |
| `U2-OVR-001` | state | drawer/sheet | Simulation receipt | فهم ما حدث وما لم يحدث |
| `U2-OVR-002` | state | drawer/sheet | Evidence/source inspector | فحص المصدر والlocator |
| `U2-OVR-003` | state | dialog/sheet | Handoff preview | تحديد البيانات ثم التأكيد |
| `U2-OVR-004` | state | dialog | Local demo storage | فهم التخزين أو مسحه |
| `U2-OVR-005` | state | dialog/sheet | Sample input selector | اختيار fixture/metadata فقط |

### Back/forward واللغة

- تبديل `ar ↔ en` يحافظ على route والخدمة والـIDs والحالة البنيوية، ويبدل النص والاتجاه فقط.
- back من overlay يغلقه ويعيد focus للمشغّل.
- back من الخدمة يعود إلى Home دون إنشاء run أو حذف session بصمت.
- refresh يعيد فقط البيانات المسموح حفظها في session adapter؛ أي محتوى ملف محلي لا يعود لأنه لم يُقرأ أو يُخزن.

---

## 6. معمارية التنفيذ المستهدفة

### 6.1 المبدأ

طبقة مشتركة صغيرة تدير lifecycle، adapter، disclosure، والحفظ، بينما يملك كل مجال reducer ومراحل ومكوّنات صريحة. التركيب أهم من flags.

```text
Route
  → Service registry / explicit workspace variant
    → ServiceWorkbenchProvider (generic interface)
      → DomainWorkspace (Learn | Research | Create | Code | Analyze | Explore)
        → domain reducer + commands
          → typed service client interface
            → deterministic mock adapter
              → Zod-validated fixtures/events
```

### 6.2 بنية مجلدات مقترحة

```text
apps/web/
├── features/
│   ├── service-workbench/
│   │   ├── components/
│   │   ├── state/
│   │   ├── storage/
│   │   └── service-registry.ts
│   ├── learn/
│   ├── research/
│   ├── create/
│   ├── code/
│   ├── analyze/
│   └── explore/
├── components/universal/
│   └── service-workspace.tsx      # يُزال أو يصبح route composition رقيقًا فقط
└── tests/e2e/
    ├── service-depth-core.spec.ts
    ├── service-learn.spec.ts
    ├── service-research.spec.ts
    ├── service-create.spec.ts
    ├── service-code.spec.ts
    ├── service-analyze.spec.ts
    ├── service-explore.spec.ts
    └── service-depth-responsive.spec.ts

packages/
├── contracts/src/services/
├── mock-api/src/services/
└── i18n/src/services/
```

الأسماء قابلة للتكييف بعد فحص المشروع، لكن **حدود الملكية غير قابلة للتفاوض**:

- `contracts`: Zod/types/transitions فقط؛ لا React أو browser.
- `mock-api`: fixtures، event plans، command adapter؛ لا React.
- `i18n`: namespaces عربية/إنجليزية typed؛ لا copy أساسي داخل JSX.
- `service-workbench`: primitives مجال-محايدة وحالة مشتركة.
- كل feature خدمة: stages، reducer، selectors، surface composition، ومكوّناتها الخاصة.
- `app/*`: route composition وmetadata فقط.

### 6.3 API المكوّنات

- استخدم variants صريحة مثل `LearnWorkspace` و`ResearchWorkspace`، لا booleans من نوع `hasSources`, `showDiff`, `isMap`.
- provider المشترك يعرّف interface: `state`, `actions`, `meta`, `adapter`; لا يكشف طريقة التخزين للمكوّنات.
- استخدم native HTML أولًا وRadix المثبت لما يحتاج focus management؛ لا hand-roll لـdialog/tabs/menu.
- لا تضف dependency لمحرر/رسم/خريطة قبل spike صغير وADR يثبت الحاجة، الحجم، الوصولية، الترخيص، والصيانة. الوضع الافتراضي هو primitives الحالية وSVG/HTML محدود.
- لا تُحمّل code/map/chart/editor code في Home أو خدمة أخرى؛ استخدم route-level splitting/dynamic import عند ثبوت الأثر.

### 6.4 التخزين المحلي

`ServiceSessionStore` interface يملك implementation للذاكرة وآخر لـ`sessionStorage`:

- key versioned مثل `nasaq:u2:session:v1`.
- Zod parse عند القراءة؛ عند corruption يُمسح الجزء غير الصالح مع recovery message.
- لا auth token، secret، file bytes، source HTML، أو external URL query.
- الحفظ مؤقت للتبويب الحالي، مع نص دائم في Library وفعل «مسح بيانات التجربة».
- storage quota/error حالة قابلة للاختبار؛ لا success وهمي.
- imported/local file content ليس جزءًا من schema أصلًا.

---

## 7. نموذج العقود المشترك

التنفيذ الفعلي يكون Zod في `@nasaq/contracts`. الجداول التالية عقد حقول لا pseudo-data اختياريًا.

### 7.1 المعرّفات

| الكيان | Prefix fixture المقترح |
|---|---|
| Service session | `ssn_` |
| Service run | `run_` |
| Service stage | `stg_` |
| Artifact | `art_` |
| Artifact version | `av_` |
| Evidence | `evd_` |
| Simulation receipt | `sim_` |
| Handoff | `hnd_` |
| Dataset fixture | `dset_` |
| Code project fixture | `cprj_` |
| Knowledge node | `kn_` |

### 7.2 ServiceSession

```text
id
serviceId              learn | research | create | code | analyze | explore
locale                  ar | en
mode                    guided | fast
status                  drafting | configured | active | paused | saved | archived
currentStageId
input                    discriminated union حسب الخدمة
runIds[]
artifactIds[]
handoffInId?
handoffOutIds[]
storage                   memory | session
createdAt / updatedAt
version
```

### 7.3 ServiceRun

```text
id
sessionId
serviceId
status                  validating | needs_input | queued | running | review_ready
                        | completed | completed_with_warnings
                        | failed_retryable | failed_final
                        | cancel_requested | cancelled
stageId
scenarioId
retryOf?
sequence
warningCodes[]
artifactIds[]
simulationReceiptId
createdAt / startedAt? / completedAt?
```

### 7.4 Artifact وArtifactVersion

```text
Artifact
  id, serviceId, sessionId, kind, title, status
  status: draft | ready_for_review | editing | saved | superseded
  currentVersionId, versionIds[], provenance, warningCodes[]
  createdAt, updatedAt

ArtifactVersion
  id, artifactId, versionNumber, parentVersionId?
  createdBy: user | simulator | local_transform
  content: discriminated union حسب kind
  changeSummary
  createdAt
```

`kind` الأساسية:

```text
learning_path
research_report
creative_document
creative_deck
visual_concept
code_project
analysis_report
discovery_trail
```

### 7.5 EvidenceRef

```text
id
sourceId
sourceTitle
origin                  seeded_fixture | user_provided_metadata
locator                  section | paragraph | page | table_row | url_fragment
locatorValue
excerpt
claimIds[]
stance                   supports | contradicts | context
availability             available | unavailable | fixture_only
provenanceLabel
```

وجود URL اختياري لا يعني أن نَسَق فتحه. إن استُخدم رابط حقيقي في fixture فيحمل `seeded_fixture` وعبارة «لم يُسترجع في هذه الجلسة».

### 7.6 SimulationReceipt

```text
id, runId, serviceId
mode                     explicit_simulation
fixtureIds[]
performedLocally[]       مثال: deterministic aggregation على dset_sales_q3
simulated[]              مثال: source discovery, AI drafting
notPerformed[]           web access, model call, upload, code execution...
networkCalls             0
persistentStorage        none | session_storage
userDataRead[]
warnings[]
createdAt
```

### 7.7 HandoffBundle

```text
id
fromServiceId?           ask مسموح كمصدر دون ServiceSession كامل
toServiceId
sourceSessionId?
selectedArtifactRefs[]
intentSummary
selectedFields[]         allowlisted ومراجَعة
excludedFields[]
status                   preview | confirmed | cancelled | consumed | failed
createdAt / confirmedAt?
```

لا يحتوي prompt كاملًا تلقائيًا، ولا source excerpts أو code/data ما لم يحددها المستخدم صراحة في preview.

---

## 8. آلات الحالة والمحاكي

### 8.1 فصل lifecycle عن stage

- **Session status** يصف عمر مساحة المستخدم.
- **Run status** يصف محاولة async واحدة.
- **Stage** يصف أين يقف workflow داخل المجال.
- **Artifact status** يصف قابلية المخرج للمراجعة والتحرير والحفظ.

لا يُضغط ذلك كله في `idle/working/ready/error`.

### 8.2 الانتقالات المشتركة

```text
Session
  drafting → configured → active ↔ paused
  active → saved → active (عند إنشاء version/متابعة جديدة)
  saved → archived

Run
  validating → needs_input → validating
  validating → queued → running → review_ready
  review_ready → completed | completed_with_warnings
  running → cancel_requested → cancelled
  validating | queued | running → failed_retryable | failed_final
  failed_retryable → [run جديد يحمل retryOf]

Artifact
  draft → ready_for_review → editing → saved
  saved → editing (ينشئ version جديدًا عند الحفظ التالي)
  saved → superseded
```

### 8.3 أحداث المحاكي

```text
service.session.created
service.session.updated
service.run.created
service.run.status_changed
service.stage.started
service.stage.completed
service.input.requested
service.warning.added
service.evidence.added
artifact.created
artifact.version_created
artifact.saved
handoff.previewed
handoff.confirmed
simulation.receipt.created
```

كل envelope يحمل `eventId`, `streamId`, `sequence`, `occurredAt`, وpayload متحققًا. duplicate يهمل، gap يدخل recovery، وevent من run قديم لا يغيّر run جديدًا.

### 8.4 سيناريوهات fixtures الإلزامية

| السيناريو | المعنى |
|---|---|
| `happy` | الرحلة الأساسية كاملة |
| `needs_input` | نقص يمكن إصلاحه في الحقل/المرحلة |
| `warning` | artifact صالح مع قيد ظاهر |
| `failed_retryable` | فشل مؤقت، retry ينشئ run جديدًا |
| `failed_final` | مدخل/طلب خارج قدرة النموذج التجريبي |
| `cancel_race` | طلب إلغاء يتسابق مع completion ويصل إلى terminal واحدة |
| `empty` | لا artifacts/sources/results بعد |
| `dense` | أقصى عدد bounded في المجال |
| `rtl_stress` | نص عربي طويل + English/URL/code/numbers |
| `storage_failure` | quota/corrupt data/rejected save |

إضافة سيناريو خدمة خاص مسموحة، لكن لا يحل محل هذه الحزمة. ممنوع `Math.random()`؛ clock والـIDs والevent timing قابلة للحقن والتسريع في الاختبارات.

---

## 9. Service Workbench المشترك

### 9.1 ما هو مشترك

- هوية الخدمة والعنوان وحالة الجلسة.
- تبديل Guided/Fast مع شرح أثره.
- Simulation badge وreceipt.
- stage navigation/status semantics.
- run cancel/retry/recovery.
- artifact version/save state.
- local-session disclosure.
- handoff preview.
- focus/error/live-region primitives.

### 9.2 ما ليس مشتركًا قسرًا

- توزيع الأعمدة.
- نوع المدخل.
- أسماء المراحل.
- المحرر، الخريطة، الجدول، الرسم، أو diff.
- inspector ومحتواه.
- مسار review والـartifact content.

### 9.3 الأفعال العامة

| الفعل | السلوك المطلوب |
|---|---|
| جلسة جديدة | يحذر من dirty edits إن وجدت؛ لا يحذف بصمت |
| بدء | validation ثم run معلوم؛ يمنع double-submit |
| إلغاء | `cancel_requested` ثم terminal event؛ يحتفظ بالعمل الجزئي عند ملاءمته |
| Retry | run جديد + رابط إلى السابق + نفس المدخل بعد مراجعة المستخدم |
| حفظ | session storage صريح؛ success فقط بعد adapter confirmation |
| نسخة جديدة | ArtifactVersion جديدة؛ لا overwrite صامت |
| افتح المخرج | ينقل focus/scroll إلى artifact الفعلي أو يفتح viewer؛ ليس زرًا ميتًا |
| افتح الإيصال | drawer/sheet قابل للوحة المفاتيح ويعيد focus |
| نقل إلى خدمة | preview allowlist ثم confirmation ثم target route |

### 9.4 المرفقات والصوت

- الصوت خارج U2؛ لا يظهر زر enabled يوحي بالتسجيل. يُخفى أو يعطّل مع سبب «غير متاح في هذا النموذج».
- المرفقات تظهر فقط حيث توجد رحلة sample input. لا زر paperclip عام بلا نتيجة.
- local file picker، إن وُجد، يقرأ metadata اللازمة للعرض فقط؛ لا `FileReader`, `arrayBuffer`, `text`, upload، preview URL، أو persistence للمحتوى.
- primary demo path دائمًا fixture واضح مثل «استخدم ملف المبيعات النموذجي».

---

## 10. التصميم والاستجابة والحركة

### 10.1 اتجاه بصري واحد، تراكيب متخصصة

يحافظ U2 على Luminous Adaptive System والتوكنز الحالية. لون الخدمة wayfinding فقط، بينما التوقيع البنيوي هو:

| الخدمة | التوقيع البنيوي | العنصر البؤري |
|---|---|---|
| Learn | Path ribbon + lesson/check canvas | السؤال/الدرس الحالي |
| Research | Evidence spine بين claim والمصدر | الادعاء قيد الفحص |
| Create | Canvas + structure rail + variants/version strip | المخرج القابل للتحرير |
| Code | File tree + diff/editor + checks receipt | التغيير المقترح قبل قبوله |
| Analyze | Data profile + result + provenance/reconciliation | النتيجة واصلها الحسابي |
| Explore | Bounded constellation + equivalent list + trail | الصلة التالية وسببها |

ممنوع إنتاج ست نسخ من layout واحد ببطاقات متطابقة. وممنوع أيضًا اختراع ست هويات بصرية منفصلة تفكك المنتج.

### 10.2 hierarchy والكثافة

- لكل state focal action واحد.
- setup رحب وبسيط؛ active workbench يمكن أن يصبح أكثر كثافة دون أن يتحول إلى dashboard احترافي مغلق.
- اللون محدود لهوية الخدمة والحالة، لا للزينة.
- الأسطح تستخدم semantic tokens الحالية؛ لا hex عشوائي داخل JSX.
- code/data/source detail تسمح كثافة أعلى من Learn/Create، مع hierarchy نصي واضح.

### 10.3 responsive contract

| النطاق | العقد |
|---|---|
| `1280–1920` | يمكن عرض 2–3 مناطق حين تخدم المهمة؛ main يبقى المهيمن |
| `768–1279` | منطقتان كحد أقصى؛ inspector يصبح tab/drawer عند الحاجة |
| `320–767` | مسار خطي، tabs/sheets بدل split panes، primary action reachable فوق safe area |
| 200% reflow | لا document horizontal overflow أو فقد أفعال؛ المناطق ثنائية الأبعاد فقط لها scroll داخلي مسمى |

- Code diff على الهاتف unified view لا side-by-side إجباري.
- Explore يبدأ List/Trail على الهاتف؛ الخريطة عرض ثانوي.
- Analyze يوفر table region قابلة للتمرير وملخصًا/جدولًا مكافئًا للرسم.
- Create deck يستخدم slide list خطية وأزرار تحريك، لا drag-only.
- كل touch target أساسي `44×44px` على الأقل طوال الحركة.

### 10.4 الحركة والتغذية الراجعة

- يظل `MOTION-AND-FEEDBACK.md` نافذًا.
- لا parent opacity على نتائج نصية؛ لا تعريض contrast للفشل أثناء entrance.
- لا loops إلا مؤشر نشاط صغير أثناء busy الفعلي ثم يتوقف.
- no bounce/parallax/scroll-jacking/autoplay.
- reduced motion يلغي الحركة المكانية غير الضرورية ويبقي الحالة نصيًا ودلاليًا.
- تغيير stage لا يقفز بالscroll دون قصد؛ focus ينتقل إلى heading/خطأ مناسب.

---

## 11. عقد Learn — تعلّم بعمق

### 11.1 Job story والنتيجة

> عندما أريد فهم موضوع، أريد مسارًا يناسب معرفتي ووقتي، يشرح ثم يجعلني أطبّق ويخبرني أين أخطأت، كي أعرف أنني تعلمت لا أنني قرأت جوابًا فقط.

**Artifact:** `learning_path` ويضم الهدف، المستوى، الوحدات، الدرس الحالي، check attempts، feedback، confidence، الملاحظات، والتقدّم.

### 11.2 الأنماط

- **Guided:** 3–5 أسئلة تشخيصية قصيرة، ثم path قابل للمراجعة، درس، check، feedback.
- **Fast:** يختار الشخص مستوى ذاتيًا ويبدأ بشرح مختصر؛ يبقى quick check متاحًا ولا يدّعي التكيف التشخيصي.
- يمكن التبديل من Fast إلى Guided مع حفظ ما أُنجز؛ التبديل بالعكس لا يحذف نتائج التشخيص.

### 11.3 المراحل

| Stage ID | المرحلة | السطح والفعل | بوابة الانتقال |
|---|---|---|---|
| `lrn_brief` | الهدف والوقت | topic، لماذا يتعلم، 5/15/30 دقيقة | topic صالح + goal |
| `lrn_diagnostic` | تشخيص | سؤال واحد في كل مرة + «لا أعرف» | اكتمال حد أدنى أو skip صريح |
| `lrn_path_review` | مراجعة المسار | وحدات، سبب الترتيب، تعديل/تخطي | user confirms |
| `lrn_lesson` | درس | شرح + مثال + سؤال نشط + المصدر النموذجي | تفاعل واحد على الأقل |
| `lrn_check` | تحقق | اختيار/إجابة قصيرة، hint، submit | إجابة أو «تجاوز الآن» |
| `lrn_feedback` | تغذية راجعة | الصحيح، سبب الخطأ، مثال مضاد، retry | acknowledge/retry |
| `lrn_checkpoint` | نقطة تقدّم | ملخص gap/confidence والخطوة التالية | continue/save |
| `lrn_complete` | نهاية الوحدة/المسار | artifact + resume/save/handoff | run terminal |

### 11.4 وظائف P0

- starter topics ثابتة ثنائية اللغة؛ fixture رئيسي واحد على الأقل قابل لإكمال الرحلة كلها.
- scoring حتمي موثق؛ لا «تقييم AI» مزعوم.
- تعديل ترتيب الوحدات أو تخطي وحدة مع سبب ظاهر.
- hint لا يكشف الجواب فورًا؛ retry يحتفظ بعدد المحاولات.
- feedback يشرح الخطأ باحترام ولا يعتمد على أحمر/أخضر فقط.
- progress نصي مثل «2 من 5» إضافة إلى أي رسم.
- pause/resume من Library في stage الصحيح.
- «ابحث أكثر» يبني Research handoff preview من السؤال المختار.

### 11.5 حالات وfixtures

- correct، partially correct، wrong، `I don’t know`، skipped diagnostic.
- incomplete brief، unsupported topic fixture، retryable simulator failure.
- no progress، unit complete، path complete، needs review، dense path (12 وحدة bounded).
- نص مختلط: معادلة LTR داخل RTL، أرقام، ومصطلح إنجليزي.

### 11.6 الوصولية

- كل مجموعة سؤال `fieldset/legend` أو بنية مكافئة صحيحة.
- لا timer تلقائي ولا auto-advance؛ المستخدم يتحكم.
- feedback يعلن مرة واحدة دون قراءة الدرس كاملًا.
- التركيز ينتقل إلى الخطأ أو heading المرحلة، لا إلى body عشوائيًا.
- progress له نص؛ ترتيب DOM يطابق القراءة في RTL/LTR.

### 11.7 معايير القبول

- `U2-LRN-001`: Guided flow مكتمل من brief إلى saved learning path.
- `U2-LRN-002`: Fast flow يصرّح أنه self-assessed ويصل إلى lesson + quick check.
- `U2-LRN-003`: diagnostic scoring/path deterministic ومغطى unit tests.
- `U2-LRN-004`: path قابل للمراجعة والتعديل دون فقد الإجابات.
- `U2-LRN-005`: correct/wrong/hint/retry/skip تنتج feedback وتقدّمًا صحيحين.
- `U2-LRN-006`: pause/resume والحفظ المحلي يعيدان stage والتقدّم الصحيحين.
- `U2-LRN-007`: empty/error/warning/dense/RTL fixtures قابلة للوصول من test adapter.
- `U2-LRN-008`: keyboard، semantics، mobile/reflow، Axe، وreduced motion تمر بلا blocker.

---

## 12. عقد Research — ابحث ووثّق

### 12.1 Job story والنتيجة

> عندما أحتاج إجابة يمكن الاعتماد عليها، أريد تثبيت السؤال والنطاق، مراجعة خطة البحث، ثم رؤية كل ادعاء مع دليله وحدوده، كي لا أثق بتقرير جميل لا تدعمه المصادر.

**Artifact:** `research_report` ويضم brief، plan versions، activity، sources، claims، evidence matrix، report sections، limitations، وreceipt.

### 12.2 الأنماط

- **Guided:** outcome → audience → scope/date/source preferences → clarification → editable plan.
- **Fast:** سؤال + نمط تقرير + fixture source pack مناسب؛ يعرض plan مختصرة للموافقة قبل التشغيل رغم السرعة.

### 12.3 المراحل

| Stage ID | المرحلة | السطح والفعل | بوابة الانتقال |
|---|---|---|---|
| `rsh_brief` | سؤال البحث | question، decision، audience، scope | سؤال قابل للبحث |
| `rsh_clarify` | توضيح | 1–3 أسئلة bounded | إجابة/اختيار default ظاهر |
| `rsh_plan_review` | خطة | محاور، أنواع مصادر، تضمين/استبعاد، زمن | user approves version |
| `rsh_source_activity` | نشاط نموذجي | event log قابل للإلغاء/التوجيه | simulator terminal/paused |
| `rsh_source_review` | مراجعة المصادر | provenance، تاريخ، نوع، availability، relevance | select/exclude |
| `rsh_claim_matrix` | الادعاءات والأدلة | supported/conflicted/unsupported | resolve/acknowledge |
| `rsh_report_edit` | التقرير | outline/sections/citations/limitations | review complete |
| `rsh_complete` | الإيصال والحفظ | artifact + handoff | run terminal |

### 12.4 وظائف P0

- plan قابلة للتحرير قبل start؛ أي تعديل بعد التشغيل ينشئ plan version/run جديدًا أو يطلب تأكيدًا واضحًا.
- source activity تعرض أنها fixture ولا تستخدم عبارات «بحثت الويب الآن».
- كل source record يوضح `seeded_fixture`, النوع، التاريخ المعروف، وتاريخ عدم الاسترجاع الحي.
- النقر على citation يفتح المصدر والـlocator والمقتطف والادعاءات المرتبطة.
- claim matrix تعرض supports/contradicts/context، وتكشف unsupported claim.
- التقرير يحتوي summary، findings، evidence/uncertainty، limitations، sources، وactivity receipt.
- المستخدم يستطيع استبعاد مصدر ورؤية الادعاءات المتأثرة قبل اعتماد التغيير.
- steering أثناء run يوقف/يعدّل المحاكاة دون اكتمال stale run.

### 12.5 حالات وfixtures

- happy evidence pack، zero relevant sources، unavailable source، conflicting evidence.
- citation locator mismatch، unsupported claim، partial report، cancelled، retryable.
- source list كثيفة bounded (50) مع filtering؛ report طويل؛ mixed bidi URL/title.
- fixture URLs إن وُجدت روابط حقيقية تفتح خارجيًا بأمان وتبقى موسومة بأنها لم تُقرأ في الجلسة.

### 12.6 الوصولية

- citation markers أسماء مفهومة لا أرقام معزولة فقط.
- source/claim relation متاحة كجدول/قائمة، لا خطوط بصرية فقط.
- activity updates لا تغرق live region؛ يعلن تغير المرحلة والنتيجة المهمة فقط.
- drawer يعيد focus، والروابط الخارجية تحمل مقصدًا واضحًا.

### 12.7 معايير القبول

- `U2-RSH-001`: brief/clarification/plan review تعمل في Guided وFast.
- `U2-RSH-002`: لا يبدأ run قبل موافقة صريحة على plan version.
- `U2-RSH-003`: source activity deterministic وقابلة للإلغاء/التوجيه بلا stale completion.
- `U2-RSH-004`: كل claim/citation/evidence relation متحقق بعقد واختبارات.
- `U2-RSH-005`: unsupported/conflicted/unavailable حالات مرئية وقابلة للإصلاح أو الإقرار.
- `U2-RSH-006`: citation تفتح locator/excerpt الصحيح وprovenance واضحًا.
- `U2-RSH-007`: report قابل للتحرير والإصدار والحفظ، ويحتوي limitations وreceipt.
- `U2-RSH-008`: استبعاد مصدر يحدّث coverage بصورة حتمية ولا يترك citation يتيمة.
- `U2-RSH-009`: لا network/search/provider claim؛ receipt يسجل `networkCalls: 0`.
- `U2-RSH-010`: keyboard/mobile/reflow/Axe/RTL/LTR/reduced-motion تمر بلا blocker.

---

## 13. عقد Create — اكتب وصمّم

### 13.1 Job story والنتيجة

> عندما أريد صنع شيء، أريد brief واضحًا ثم بنية وبدائل أستطيع تحريرها ومقارنتها وإصدارها، بدل أن أحصل على رسالة نهائية لا يمكن البناء عليها.

**Artifacts:** `creative_document`, `creative_deck`, `visual_concept`.

U2 لا تبني Word/Canva/Figma. تبني ثلاث compositions محدودة لكن كاملة في أفعالها الأساسية.

### 13.2 الأنماط

- **Guided:** نوع المخرج → الهدف والجمهور → constraints/tone → outline/concepts → variants.
- **Fast:** starter/template + brief مختصر → draft fixture قابل للتحرير فورًا.

### 13.3 المراحل

| Stage ID | المرحلة | السطح والفعل | بوابة الانتقال |
|---|---|---|---|
| `crt_format` | نوع المخرج | مستند/عرض/تصور بصري | اختيار واحد |
| `crt_brief` | brief | الهدف، الجمهور، النبرة، الطول، constraints | fields الأساسية |
| `crt_structure` | بنية | outline/slides/concept attributes | user confirms |
| `crt_variants` | بدائل | مقارنة 2–4 بدائل مع سبب الاختلاف | select/branch |
| `crt_edit` | تحرير | canvas خاص بالنوع + dirty state | review request |
| `crt_review` | مراجعة | suggestions، before/after، accept/reject | resolve/acknowledge |
| `crt_version` | إصدار | name/version/restore/duplicate | save confirmation |
| `crt_complete` | حفظ/إيصال | artifact + handoff | terminal |

### 13.4 وظائف P0 حسب النوع

#### المستند

- عنوان وoutline وblocks نصية قابلة للتعديل.
- إضافة/حذف/تحريك block بأزرار؛ لا drag-only.
- بديل واحد على الأقل لقسم، مع accept/reject.
- preview للقراءة منفصلة عن edit state.

#### العرض

- 5 slides fixture على الأقل، slide rail، title/body/notes edit.
- تحريك لأعلى/أسفل، duplicate، delete مع guard لآخر slide.
- اختيار alternate slide لا يستبدل النسخة بصمت.
- mobile يعرض slide واحدًا وقائمة خطية.

#### التصور البصري

- 4 variants محلية واضحة أنها demo assets، لا image generation.
- ratio/palette/concept labels مع اختيار واحد ومقارنة.
- caption وalt text قابلان للتحرير؛ alt مطلوب قبل ready state.
- لا crop/render/export مزعوم.

### 13.5 الإصدارات والحفظ

- dirty/saving/saved/storage_failed حالات حقيقية.
- كل save بعد saved ينشئ `ArtifactVersion` جديدة.
- restore ينشئ version جديدة مبنية على القديمة ولا يمحو التاريخ.
- branch/duplicate لهما عنوان وعلاقة parent.
- «معاينة التصدير» إن ظهرت تشرح أن PDF/PPTX/image export غير منفذ؛ لا زر تنزيل كاذب.

### 13.6 حالات وfixtures

- blank brief، invalid length، no variant، conflicting constraints.
- dirty navigation، storage failure، restored version، dense document/slides.
- long Arabic headings، mixed English brand name، no image alt.

### 13.7 الوصولية

- المحرر يستخدم controls أصلية وlabels؛ لا `contenteditable` مع semantics ناقصة دون سبب موثق.
- slide/order controls keyboard-complete.
- visual variants لها alt ووصف الفروق، لا thumbnail فقط.
- status لا يعتمد على لون حدود canvas.

### 13.8 معايير القبول

- `U2-CRT-001`: اختيار الأنواع الثلاثة ينتج composition ومخطط artifact مختلفين.
- `U2-CRT-002`: Guided/Fast يصلان إلى draft قابل للتحرير دون dead controls.
- `U2-CRT-003`: document blocks add/edit/delete/reorder + alternative تعمل حتميًا.
- `U2-CRT-004`: deck slides edit/reorder/duplicate/delete/notes تعمل مع guard صحيح.
- `U2-CRT-005`: visual variants selection/caption/required alt تعمل مع disclosure.
- `U2-CRT-006`: variants وaccept/reject لا تستبدل content دون version معلوم.
- `U2-CRT-007`: dirty/save/failure/retry/version/restore حالات مغطاة.
- `U2-CRT-008`: لا ادعاء image generation أو production export؛ receipt كامل.
- `U2-CRT-009`: keyboard/mobile/reflow/Axe/RTL/LTR/reduced-motion تمر بلا blocker.

---

## 14. عقد Code — برمج وابنِ

### 14.1 Job story والنتيجة

> عندما أريد بناء أو إصلاح شيء، أريد رؤية النطاق والخطة والملفات والتغيير المقترح، ثم أقرر ما أقبله وأفحص نتيجة واختبارات واضحة، بدل الوثوق بكود مخفي أو ادعاء «تم التشغيل».

**Artifact:** `code_project` ويضم fixture snapshot، proposed changes، decisions، working-copy version، static preview state، checks، وSimulationReceipt.

### 14.2 الأنماط

- **Guided:** task type → project fixture → scope/constraints → plan review → diff.
- **Fast:** starter task known to the fixture → proposed diff مباشرة مع plan مختصرة ظاهرة.

### 14.3 المراحل

| Stage ID | المرحلة | السطح والفعل | بوابة الانتقال |
|---|---|---|---|
| `cod_scope` | النطاق | build/fix/learn/review + project fixture | task supported |
| `cod_plan` | الخطة | files affected، intent، risk/limits | user approves |
| `cod_proposal` | اقتراح التغيير | file tree + proposed files | proposal ready |
| `cod_diff_review` | مراجعة diff | unified/side-by-side، accept/reject per file | decisions complete |
| `cod_working_copy` | نسخة العمل | editor محدود + dirty indicators | request checks |
| `cod_preview_checks` | preview/checks | static preview + deterministic tests | review results |
| `cod_receipt` | إيصال المراجعة | changed files، tests، limitations | save/complete |

### 14.4 وظائف P0

- project fixture واحد مكتمل على الأقل وfixture ثانٍ لحالة failure.
- file tree قابلة للوحة المفاتيح وتكشف modified/added/deleted نصيًا.
- diff موحد هو baseline؛ side-by-side تحسين desktop فقط.
- accept/reject لكل file؛ «Apply all» يحتاج summary ولا يعمل مرتين.
- working copy محلية فقط؛ reset/undo decision واضحان.
- preview مكوّن معد مسبقًا keyed إلى fixture state، وليس تنفيذًا للنص.
- checks deterministic؛ تعرض passed/failed/skipped وسبب كل واحد.
- review receipt يربط الهدف بالخطة والملفات والقرارات والchecks وما لم يُنفذ.
- الطلبات مثل install/deploy/shell/network تُرفض كقدرة غير متاحة مع بديل demo آمن.

### 14.5 حدود أمنية

- ممنوع `eval`, `new Function`, dynamic import من user text، shell، WebContainer، iframe `srcdoc` من code، أو injection إلى DOM.
- يعرض code كنص escaped.
- لا كتابة إلى repository/Git من داخل المنتج.
- preview لا يرسل network ولا يفتح user URL.
- «Run» تسمى «شغّل الفحوص النموذجية» أو ما يعادلها؛ لا تدعي التنفيذ الحقيقي.

### 14.6 حالات وfixtures

- added/modified/deleted file، rejected file، partial acceptance، conflict.
- test failed، preview unavailable، unsupported language/task، cancelled run.
- 1/20/100 files bounded، long lines، Arabic comments + LTR code.

### 14.7 الوصولية

- additions/deletions تحمل labels ونصًا، لا لونًا فقط.
- line numbers ليست accessible name للمحتوى.
- code region قابلة للتمرير داخليًا مع label؛ لا document overflow.
- Tab يبقى للتنقل افتراضيًا؛ لا يحتجزه editor prototype.
- mobile unified diff + tabs بين Files/Change/Preview/Checks.

### 14.8 معايير القبول

- `U2-COD-001`: scope/plan/proposal/diff/checks/receipt رحلة كاملة.
- `U2-COD-002`: file tree وdiff تعكسان العقود والحالة نفسها بلا تناقض.
- `U2-COD-003`: accept/reject/apply/reset ينتج working-copy versions حتمية.
- `U2-COD-004`: preview/checks مرتبطة بالfixture والقرارات ولا تنفذ code.
- `U2-COD-005`: failed/skipped checks وpartial acceptance لها recovery واضح.
- `U2-COD-006`: receipt يعرض blast radius وما تم/لم يتم.
- `U2-COD-007`: security assertions تمنع eval/HTML/shell/network/Git claims.
- `U2-COD-008`: diff/tree/editor keyboard/mobile/reflow/Axe/RTL/LTR تمر بلا blocker.
- `U2-COD-009`: Code → Learn handoff يراجع concept/files المختارة قبل النقل.

---

## 15. عقد Analyze — حلّل وافهم

### 15.1 Job story والنتيجة

> عندما أحلل بيانات، أريد معرفة ما دخل، وما مشكلاته، وكيف حُسبت النتيجة، وما الافتراضات والفلاتر، ثم أراجع جدولًا ورسمًا ومصالحة رقمية قبل أن أثق بالتفسير.

**Artifact:** `analysis_report` ويضم dataset fixture metadata، profile، quality issues، question، operations، result table، chart spec، reconciliation، assumptions، interpretation fixture، وreceipt.

### 15.2 الأنماط

- **Guided:** dataset sample → profile/quality → question → measures/dimensions/filters → plan → result.
- **Fast:** dataset + سؤال starter يدعمه محرك التحويل المحلي → result مع assumptions قبل summary.

### 15.3 المراحل

| Stage ID | المرحلة | السطح والفعل | بوابة الانتقال |
|---|---|---|---|
| `ana_source` | المصدر | اختيار dataset fixture أو metadata-only local file | usable fixture selected |
| `ana_profile` | profile | rows/columns/types/missing/duplicates/range | issues reviewed |
| `ana_question` | السؤال | metric، group، filter، unit/date | operation supported |
| `ana_plan` | خطة الحساب | input → transforms → output + assumptions | user approves |
| `ana_compute` | حساب محلي | deterministic transform events | local function result |
| `ana_result` | النتيجة | summary + table + chart | review |
| `ana_verify` | تحقق | row count، totals، filters، missing، reconciliation | pass/ack warning |
| `ana_complete` | حفظ/إيصال | artifact + Create handoff | terminal |

### 15.4 العمليات المدعومة P0

على datasets مضمّنة صغيرة فقط:

- `count`, `sum`, `average`, `min`, `max`.
- group by dimension واحدة.
- filter واحد أو مجموعة bounded من filters allowlisted.
- trend زمني بسيط بعد parse حتمي معروف للfixture.
- null/missing count وduplicate count.

لا arbitrary SQL، joins، formulas حرة، forecast، statistical significance، أو استنتاج سببي.

### 15.5 عقد الحساب والتفسير

- كل رقم في table/chart يحمل lineage إلى operation وfixture ID.
- transform functions pure ومغطاة unit tests مع expected totals.
- narrative interpretation fixture منفصلة بصريًا وعقديًا عن computed facts.
- assumptions تظهر قبل النتيجة ويمكن تعديل المدعوم منها ثم recompute.
- reconciliation تقارن grand total/row counts قبل وبعد وتكشف mismatch fixture.
- chart لا يُبنى من أرقام سردية؛ يُشتق من result table نفسه.

### 15.6 الملفات والخصوصية

- primary path: sample datasets واضحة.
- local file control اختياري للعرض فقط: name/type/size metadata، ثم رسالة أن المحتوى لم يُقرأ، مع CTA لاستخدام sample مشابه.
- لا FileReader/content parsing/upload/persistence في U2.
- analytics لا تحمل file name أو values.

### 15.7 الرسوم والوصولية

- P0: bar وline على الأقل؛ scatter اختياري إذا كان fixture مناسبًا.
- كل chart له title، units، legend عند الحاجة، text takeaway، وجدول بيانات مكافئ.
- SVG marks إن استُخدمت تحمل descriptions؛ لا canvas-only.
- لا يعتمد series/status على اللون؛ patterns/labels/shape/text عند الحاجة.
- keyboard يصل إلى table/filter/summary دون الحاجة للتنقل داخل كل pixel mark.

### 15.8 حالات وfixtures

- clean، missing values، duplicates، wrong inferred type، zero-row filter.
- unsupported question، reconciliation mismatch، local compute error، warning result.
- wide table، 200 rows bounded، long Arabic labels، mixed units.

### 15.9 معايير القبول

- `U2-ANA-001`: sample selection/profile/question/plan/result/verify/save رحلة كاملة.
- `U2-ANA-002`: supported transforms pure/deterministic ومختبرة بأرقام متوقعة.
- `U2-ANA-003`: computed facts منفصلة عن simulated interpretation في العقد والواجهة.
- `U2-ANA-004`: profile يكشف types/missing/duplicates/range قبل التحليل.
- `U2-ANA-005`: assumptions/filters/units/date range ظاهرة وقابلة للمراجعة.
- `U2-ANA-006`: chart مشتق من result table وله table/text equivalent.
- `U2-ANA-007`: reconciliation pass/warning/mismatch وrecovery تعمل.
- `U2-ANA-008`: local file path لا يقرأ أو يرفع أو يحفظ المحتوى ويصرح بذلك.
- `U2-ANA-009`: empty/error/dense/RTL fixtures مغطاة.
- `U2-ANA-010`: keyboard/mobile/reflow/Axe/forced-colors/reduced-motion تمر بلا blocker.

---

## 16. عقد Explore — استكشف واكتشف

### 16.1 Job story والنتيجة

> عندما أستكشف موضوعًا، أريد رؤية عدد صغير من المسارات ذات الصلة مع سبب الصلة، ثم أختار رحلة قصيرة أو عميقة وأتفرع وأعود دون أن أضيع في graph ضخم.

**Artifact:** `discovery_trail` ويضم seed، mode، nodes، edges/reasons، selected path، visited/bookmarked nodes، source refs، checkpoints، وhandoff.

### 16.2 الأنماط

- **Guided:** موضوع + ما أعرفه + نوع الفضول + الوقت → اقتراح trail مع تفسير.
- **Fast:** seed topic → map/list bounded فورًا → اختيار Short (3 عقد) أو Deep (حتى 7).

### 16.3 المراحل

| Stage ID | المرحلة | السطح والفعل | بوابة الانتقال |
|---|---|---|---|
| `exp_seed` | البذرة | topic، time، breadth/depth | known fixture/topic |
| `exp_map` | الخريطة/القائمة | 6–12 عقدة + سبب كل edge | choose node/trail |
| `exp_node` | تفاصيل العقدة | summary، why connected، sources، uncertainty | continue/back/bookmark |
| `exp_trail` | الرحلة | current/visited/next، branch/backtrack | checkpoint |
| `exp_checkpoint` | نقطة توقف | ما اكتشف، مفاجأة، سؤال تالٍ | continue/save/learn |
| `exp_complete` | حفظ/تحويل | trail artifact + Learn handoff | terminal |

### 16.4 وظائف P0

- map مرئية bounded؛ لا infinite graph أو auto-layout متغير بين التشغيلات.
- list/tree view مكافئة بالكامل تعرض كل node وrelationship وreason.
- short/deep paths مختلفة فعلًا في العدد وكمية التفاصيل.
- branch/backtrack لا يمحو visited path؛ breadcrumbs/trail مرئية.
- bookmark/note بسيطان ويحفظان داخل artifact.
- كل recommendation تحمل «لماذا هذه؟» وsource/provenance fixture.
- «حوّلها إلى مسار تعلم» يفتح Learn handoff preview بالعقد المختارة.

### 16.5 responsive والوصولية

- الهاتف يبدأ List/Trail؛ map اختيارية وليست شرطًا لإكمال الرحلة.
- map nodes أزرار DOM أو semantics مكافئة؛ edges الزخرفية `aria-hidden` والعلاقات في القائمة.
- ترتيب keyboard منطقي ومستقل عن إحداثيات الرسم.
- zoom/pan، إن أضيفا، ليسا الطريق الوحيد ولا يكسران 44px/focus.
- forced colors يبقي selected/current/visited عبر border/icon/text.

### 16.6 حالات وfixtures

- no match، one path، branch، dead end، disconnected node، unavailable source.
- dense bounded map، long labels، mixed RTL/LTR، short/deep completed.
- warning عند عدم يقين أو source fixture محدود.

### 16.7 معايير القبول

- `U2-EXP-001`: seed → map/list → node → trail → checkpoint → save رحلة كاملة.
- `U2-EXP-002`: map/list متكافئتان في العقد والعلاقات والأفعال.
- `U2-EXP-003`: short/deep وbranch/backtrack تنتج paths حتمية صحيحة.
- `U2-EXP-004`: every edge/recommendation تملك reason وprovenance.
- `U2-EXP-005`: bookmarks/notes/visited path تحفظ في artifact وتستأنف.
- `U2-EXP-006`: no-match/dead-end/disconnected/dense/warning لها recovery.
- `U2-EXP-007`: mobile يمكنه إكمال كل الرحلة بلا map gestures.
- `U2-EXP-008`: keyboard/reflow/Axe/RTL/LTR/forced-colors/reduced-motion تمر بلا blocker.
- `U2-EXP-009`: Explore → Learn handoff يرسل العقد المختارة فقط بعد confirmation.

---

## 17. Ask، Home، Library، والروابط بين الخدمات

### 17.1 Ask & Talk

Ask لا يتحول إلى محرر سابع. دوره في U2:

1. يقبل مقصدًا عامًا.
2. يعرض اقتراح خدمة واحدًا أساسيًا وبديلًا عند الغموض.
3. يشرح «لماذا هذا المسار؟» بقاعدة ظاهرة مثل وجود بيانات/مصادر/تعلم.
4. يتيح «تابع هنا» أو «افتح المساحة»؛ لا نقل تلقائي.
5. يعرض handoff preview ويتيح إزالة أي جزء قبل التأكيد.
6. لا يدّعي routing model؛ decision rules محلية deterministic.

### 17.2 قواعد التوجيه المحلية P0

| الإشارة | الوجهة المقترحة | ملاحظة |
|---|---|---|
| تعلّم/اشرح/اختبرني | Learn | إذا طلب جوابًا سريعًا يبقى Ask بديلًا |
| ابحث/مصادر/قارن الأدلة | Research | يوضح أن البحث في U2 نموذج فقط |
| اكتب/عرض/تصميم/نسخة | Create | يطلب نوع المخرج إن لزم |
| كود/خطأ/مكوّن/اختبار | Code | يوضح عدم التنفيذ الحقيقي |
| جدول/بيانات/رسم/متوسط | Analyze | يقترح sample dataset |
| استكشف/ما العلاقة/رحلة | Explore | يطلب الوقت/العمق لاحقًا |

### 17.3 Library

- filters تغطي الأنواع الثمانية، والخدمات الست، وdraft/saved.
- بطاقة artifact تعرض النوع، الخدمة، آخر version، stage/حالة، disclosure «محلي لهذه الجلسة».
- Open/Resume يعملان ويعيدان route/session.
- empty، filtered-empty، corrupt storage، storage unavailable، dense حالات.
- «مسح بيانات التجربة» يشرح الأثر ويحتاج confirmation ثم يحدّث الواجهة.
- لا تعرض Library «متزامن» أو «محفوظ في الحساب».

### 17.4 Handoffs المدعومة في U2

| المصدر → الهدف | payload allowlist | النتيجة |
|---|---|---|
| Ask → أي خدمة | intent summary + selected starter only | setup prefilled |
| Learn → Research | question/gap + selected lesson topic | research brief |
| Research → Create | selected claims + outline + citation refs | document/deck brief |
| Code → Learn | selected concept + file labels + diff summary، بلا full code افتراضيًا | learning brief |
| Analyze → Create | selected findings + chart/table artifact refs + assumptions | report/deck brief |
| Explore → Learn | selected nodes + trail question + source refs | learning path brief |

أي اتجاه آخر خارج P0؛ لا generic «نقل لأي خدمة» يخفي payload غير مضبوط.

### 17.5 معايير القبول العابرة

- `U2-XSV-001`: Ask يقترح وجهة بقواعد deterministic ويشرحها ويطلب confirmation.
- `U2-XSV-002`: كل handoff يفتح preview allowlisted مع add/remove/cancel/confirm.
- `U2-XSV-003`: target يستهلك bundle مرة واحدة ولا يكرر run عند refresh/back.
- `U2-XSV-004`: Library تعرض وتحفظ وتستأنف artifacts من الخدمات الست مع disclosure صحيح.
- `U2-XSV-005`: clear/corrupt/storage-failure حالات لا تفقد أو تدعي حفظًا بصمت.
- `U2-XSV-006`: locale switch يحافظ على IDs/stage/artifact ولا يخلط النصوص أو الاتجاه.

---

## 18. i18n وRTL/LTR

- تضيف `@nasaq/i18n` namespaces typed لكل service وworkbench؛ لا كتل `isArabic ? {...} : {...}` ضخمة داخل المكونات.
- completeness test يثبت تساوي مفاتيح ar/en وعدم وجود fallback صامت.
- أسماء IDs/status/events تبقى إنجليزية ثابتة؛ copy يترجم في العرض.
- code، URL، email، equations، source titles المختلطة تستخدم bidi isolation (`bdi`, `dir="auto"`) حسب الحاجة.
- CSS logical properties؛ لا قلب icons الدلالية بلا معنى.
- الأرقام/الوحدات/التواريخ عبر formatters للlocale، مع tabular numbers حيث تتغير.
- لا تستخدم الترجمة الآلية كدليل جودة؛ يراجع النصان في الواجهة والسياق.

---

## 19. الوصولية

### 19.1 baseline الملزم

- WCAG 2.2 AA كهدف هندسي؛ automated tools لا تثبت المطابقة الكاملة.
- semantic landmarks/headings/forms/buttons/links قبل ARIA.
- no keyboard trap؛ focus visible؛ overlays تعيد focus.
- errors مرتبطة بالحقول، تشرح المشكلة وطريقة الإصلاح.
- `aria-live` محدود لتغيرات الحالة المهمة، لا stream كل تفاصيل النشاط.
- 44px touch targets، عدم الاعتماد على اللون، forced-colors cues.
- reduced motion مسار مكافئ.
- no serious/critical Axe في Chromium/Firefox للحالات الحرجة.

### 19.2 بدائل الأسطح المعقدة

| السطح | البديل/العقد |
|---|---|
| Research claim graph | جدول claim × evidence كامل |
| Create visual variant | اسم ووصف وalt والفروق نصيًا |
| Code diff | unified text diff مع labels added/deleted/context |
| Analyze chart | data table + summary + units |
| Explore map | list/tree/trail كامل الوظائف |
| Progress/activity | نص status/step count، لا animation أو لون فقط |

### 19.3 التحقق البشري

يجب تنفيذ keyboard-only manual pass لكل خدمة. إذا لم تتوفر بيئة قارئ شاشة فعلية، يُسجل ذلك `UNVERIFIED — HUMAN REQUIRED` مع خطوات NVDA/VoiceOver المحددة؛ لا تُدّعى «screen-reader verified» استنادًا إلى Axe فقط.

---

## 20. Analytics والخصوصية

لا يُربط مزود analytics خارجي في U2. يُستخدم dev/test logger خلف interface للتحقق من العقود فقط.

### 20.1 الأحداث المسموحة

```text
service_session_started
service_mode_changed
service_stage_started
service_stage_completed
service_validation_failed
service_run_cancel_requested
service_run_cancelled
service_run_retried
artifact_created
artifact_version_created
artifact_saved
artifact_save_failed
simulation_receipt_opened
evidence_opened
handoff_previewed
handoff_confirmed
handoff_cancelled
demo_storage_cleared
```

### 20.2 properties allowlist

```text
serviceId, mode, stageId, scenarioId, fixtureId, artifactKind,
locale, direction, viewportClass, status, warningCode, sourceKind,
handoffFrom, handoffTo, storageMode
```

### 20.3 ممنوع

- prompt/answer/lesson/report/code text.
- file name/content/size الدقيق إذا يمكن أن يكون identifying؛ استخدم size bucket فقط عند الحاجة.
- source excerpt أو user URL.
- dataset values أو chart labels المستمدة من المستخدم.
- email، secret، token، sessionStorage payload.
- full route query أو DOM snapshot.

كل event يملك unit test للredaction/allowlist، وأي property جديدة تحتاج تعديل العقد أولًا.

---

## 21. الأمن ونموذج التهديد

### 21.1 الصلاحيات والموافقات في U2

- لا تضيف U2 تسجيل دخول أو أدوارًا أو authorization خادميًا؛ كل الجلسات demo محلية، ولا يجوز إظهار فريق/مالك/صلاحية مزعومة.
- كل الأفعال المنفذة محليًا إما قراءة fixture أو تعديل state/artifact في الجلسة. لا يوجد external side effect يحتاج approval token حقيقيًا.
- confirmation واجب قبل مسح بيانات التجربة، ترك dirty artifact، استبدال/استعادة version، تطبيق كل ملفات diff دفعة واحدة، أو handoff إلى خدمة أخرى.
- file metadata لا تُلتقط قبل اختيار المستخدم الصريح، ولا تتحول الموافقة على picker إلى إذن لقراءة المحتوى.
- يمكن الحفاظ على interface مستقبلية لـ`can(action, resource)`، لكن لا تُبنى أدوار وهمية ولا تُعامل نتيجة client كحد أمني.
- أي زر يتطلب Backend/permission حقيقية يُخفى أو يعطّل بسبب ظاهر؛ لا يُعرض approval UI يوحي بأن فعلًا خارجيًا سينفذ.

### 21.2 حدود التهديد

| الحد | الخطر | ضابط U2 |
|---|---|---|
| user text → DOM | XSS/HTML injection | React escaping؛ لا raw HTML/dangerouslySetInnerHTML |
| code text → preview | arbitrary execution | static fixture preview؛ لا eval/new Function/srcdoc/import |
| local file selection | data disclosure | metadata-only؛ لا read/upload/persist؛ disclosure |
| source fixture/link | malicious URL/content | schemes allowlist، escaped excerpt، safe external link |
| session storage | local privacy/corruption | versioned schema، minimization، clear action، parse/recovery |
| simulator events | stale/duplicate/race | run ID + sequence + abort + duplicate/gap guards |
| new dependency | supply chain/bundle | لا إضافة افتراضيًا؛ ADR + lockfile/audit/provenance/license |
| analytics/logger | content leakage | allowlist only؛ no content fields؛ tests |
| handoff | hidden context spill | preview + field allowlist + explicit confirmation |

### 21.3 Abuse cases الإلزامية

- prompt يحمل `<script>`, `javascript:`, bidi overrides، ونصًا طويلًا جدًا.
- file name خبيث/طويل أو نوع غير مدعوم.
- source URL scheme غير آمن.
- user code يحاول إغلاق `<pre>` أو إدخال HTML.
- duplicate start/cancel/save/confirm.
- storage payload معدل أو من version مجهول.
- completion قديم يصل بعد reset/new run.
- handoff يُستهلك مرتين.

لا secrets في source/docs/logs/screenshots/Git. لا تستخدم اعتمادات GitHub/Vercel إلا مؤقتًا عبر البيئة الآمنة المتاحة، ولا تكتب قيمها في أي ملف.

---

## 22. معايير القبول المشتركة

- `U2-CORE-001`: المساحات الست compositions متخصصة وليست نتيجة عامة ملونة.
- `U2-CORE-002`: Ask يبقى gateway مع توجيه وتأكيد، لا محرر مجال سابع.
- `U2-CORE-003`: ServiceSession/Run/Stage/Artifact/Version/Evidence/Receipt/Handoff عقود Zod مشتركة.
- `U2-CORE-004`: lifecycle طبقي ولا توجد final → active transition على run نفسه.
- `U2-CORE-005`: simulator deterministic، event-driven، قابل للإلغاء والتسريع، ويمنع stale events.
- `U2-CORE-006`: happy/needs-input/warning/retry/final/cancel/empty/dense/RTL/storage fixtures parse وتُختبر.
- `U2-CORE-007`: كل artifact/نتيجة تعرض truth disclosure وSimulationReceipt دقيقًا.
- `U2-CORE-008`: لا live search/model/upload/file processing/code execution/network side effect مزعوم أو منفذ.
- `U2-CORE-009`: session storage خلف adapter، versioned، قابل للمسح، ولا يدعي حسابًا/مزامنة.
- `U2-CORE-010`: لا dead controls؛ attach/voice/export/run أفعال صادقة أو hidden/disabled بسبب واضح.
- `U2-CORE-011`: ar/en typed copy مكتملة، RTL/LTR متكافئان، وmixed bidi آمن.
- `U2-CORE-012`: 320–1920px، 200% reflow، 44px، safe areas، no document overflow.
- `U2-CORE-013`: keyboard/focus/semantics/alternatives/forced colors/Axe بلا serious أو critical في النطاق المتحقق.
- `U2-CORE-014`: U1.2 motion/reduced-motion/feedback invariants لا تنكسر.
- `U2-CORE-015`: architecture boundaries تمنع giant conditional component وfixture imports من الشاشات.
- `U2-CORE-016`: analytics allowlist لا يسرب content، ولا يوجد external telemetry في U2.
- `U2-CORE-017`: كل U1/U1.1/U1.2 gates ذات الصلة تبقى ناجحة بلا حذف/skip غير مبرر.
- `U2-CORE-018`: كل slice مكتملة لها receipt، screenshots/manifest، commit، push، Vercel READY، وproduction smoke مطابق.

---

## 23. خطة التنفيذ المرحلية

كل مرحلة vertical slice قابلة للنشر. لا يُسمح بترك `main` بحالة وسطية مكسورة. بعد تحقق كل slice مكتملة: تحديث السياق، commit، push، انتظار Vercel `READY`، ثم production smoke. لا يُدفع code غير متحقق لمجرد إظهار تقدم.

### U2.0 — Foundation

**المخرجات:**

- توسيع docs الأساسية أو الإشارة إلى هذا العقد من Screen Inventory/State Machines/Contracts.
- Zod domain contracts والـID/status/event schemas.
- fixture builders وscenario registry وinjectable clock/event simulator.
- Workbench provider/interface/primitives + SimulationReceipt.
- i18n namespaces typed.
- memory/session storage adapters والـprivacy disclosure.
- route registry صريح مع بقاء الصفحات الحالية سليمة حتى استبدال كل خدمة.
- unit/contract/core E2E skeleton.

**بوابة التوقف:** لا تبدأ Learn قبل أن parse كل fixture، تمر transition/race/storage tests، ويبقى U1 regression ناجحًا.

### U2.1 — Learn

تنفيذ عقد القسم 11 كاملًا. استبدال route Learn فقط بعد نجاح acceptance الخاص بها. حفظ artifact في Library يمكن أن يكون تدريجيًا لكن يجب أن يعمل لهذه الخدمة قبل الإغلاق.

### U2.2 — Research

تنفيذ plan/source activity/evidence/claim/report. لا تُقبل citations شكلية؛ locator/coverage والـunsupported state بوابة إلزامية.

### U2.3 — Create

تنفيذ الأنواع الثلاثة بالحدود المحددة، versions وdirty/storage states. لا توسع إلى محرر إنتاجي أو image generation.

### U2.4 — Code

تنفيذ fixture project/file tree/diff/working copy/static preview/checks/receipt. أي حاجة لتنفيذ arbitrary code توقف المرحلة ولا تُحل بـ`eval` أو iframe.

### U2.5 — Analyze

تنفيذ sample data/profile/pure transforms/table/chart/reconciliation. لا معالجة ملفات حقيقية أو أرقام مولّدة غير قابلة للتتبع.

### U2.6 — Explore

تنفيذ bounded map + equivalent list/trail، short/deep، branch/backtrack، provenance، وmobile list-first.

### U2.7 — Integration & Hardening

- Ask rules + confirmations.
- handoffs الستة المحددة.
- Library موحدة، resume، clear/corrupt/storage states.
- Home starters/recent artifacts بما لا يزحم الصفحة.
- full locale/responsive/a11y/motion/security/performance regression.
- كل receipts/evidence/traceability إلى `PASS` أو limitation صريحة.
- final production deployment والـalias gate.

### ترتيب العمل داخل كل slice

```text
Preflight + source/version verification
→ contract/fixture tests
→ pure reducer/transform tests
→ component/composition
→ service E2E happy + error/retry/cancel
→ ar/en + mobile/desktop + keyboard/Axe
→ visual review and evidence
→ full affected regressions + audit/build
→ context/receipt
→ commit/push/Vercel READY/production smoke
```

---

## 24. بوابات توقف إلزامية

يتوقف الوكيل ويشرح قبل التوسع إذا:

1. احتاج Backend، database، provider، live search، real upload، أو sandbox.
2. احتاج dependency جديدة؛ يقدم ADR صغيرًا ولا يثبتها تلقائيًا.
3. تعارض طلب جديد مع Truth Contract أو roadmap.
4. لم يستطع جعل الفعل صادقًا دون UI مضلل؛ يعيد تصميم الفعل ولا يزيّف success.
5. فشلت بوابة baseline ولم يُعرف السبب.
6. اكتشف secret أو credential في file/log/history؛ يتوقف عن النشر ويعالج التسرب وفق السياسة.
7. لم تتوفر أداة تحقق مطلوبة؛ يسجل limitation ولا يدعي pass.
8. تجاوزت الخدمة حدود P0 المحددة إلى suite إنتاجية كاملة.
9. ظهر أن fixture أو citation أو calculation غير صحيح؛ يصلحه قبل polish.
10. لم يطابق deployment الـcommit المقصود أو لم يصل `READY`.

---

## 25. المخاطر والمعالجات

| الخطر | الأثر | المعالجة/بوابة المنع |
|---|---|---|
| الموجة واسعة جدًا | ست شاشات سطحية | vertical slices؛ لا إغلاق خدمة قبل رحلة كاملة |
| giant conditional component | صيانة واختبارات هشة | explicit compositions + feature boundaries |
| المحاكاة تبدو حقيقية | فقد الثقة | disclosure عند الفعل والنتيجة + receipt |
| citations لا تدعم الادعاء | تقرير مقنع لكنه خاطئ | locator/excerpt/claim matrix/unsupported state |
| chart مقنع وحسابه خاطئ | قرار خاطئ | pure transforms + table-derived chart + reconciliation |
| code preview ينفذ محتوى | ثغرة أمنية | static fixtures فقط + security assertions |
| file picker يسرب بيانات | خصوصية | metadata-only/no read/no upload/no persistence |
| graph مربك أو غير متاح | فشل mobile/a11y | bounded nodes + list-first/equivalent view |
| editors تضخم bundle | بطء وتعقيد | no-new-dependency default + dynamic imports/ADR |
| تخزين محلي يفهم كحساب | توقعات خاطئة | session-only copy + clear action + receipt |
| RTL يصلح شكليًا فقط | فقد وظائف | mixed-bidi fixtures + parity E2E |
| transient timers تسبب flakes | نتائج stale وفشل WebKit | injected clock/events/browser-local transient assertions |
| DESIGN القديم يعيد الاتجاه المرفوض | تراجع بصري/منتجي | supersession وترتيب مرجعية صريح |
| test matrix تنفجر | بطء وعدم استقرار | توزيع مخطط في مصفوفة QA، لا دمج viewports في test واحد |
| overclaim للنشر | تسليم غير مثبت | exact SHA/deployment/alias evidence |

---

## 26. Definition of Ready لكل خدمة

لا يبدأ code خدمة حتى يتوفر:

- contract fields وstage transitions وartifact kind.
- fixture رئيسي عربي/إنجليزي وحالات failure/warning/dense/RTL.
- primary mobile/desktop composition مرسومة نصيًا أو prototype صغيرًا.
- قائمة أفعال P0 والاستثناءات.
- unit/E2E IDs مرتبطة بمعايير القبول.
- truth copy وreceipt fields.
- threat/abuse cases الخاصة بها.
- تأكيد عدم الحاجة إلى dependency/provider/backend غير موافق عليه.

## 27. Definition of Done لكل خدمة

- كل acceptance ID للخدمة `PASS` بدليل حديث.
- لا TODO/P0 مخفي، no dead controls، ولا console/page error.
- contracts/fixtures/transitions/pure logic tests ناجحة.
- happy + validation + warning/error + cancel/retry + save/resume مغطاة حسب الملاءمة.
- ar/en وRTL/LTR وmobile/desktop وkeyboard/Axe/reduced-motion متحققة.
- visual evidence + manifest + receipt.
- U1 regressions ذات الصلة ناجحة.
- commit pushed وVercel deployment مطابق `READY` وproduction smoke ناجح.

لا تعني Done الخدمة اكتمال U2؛ U2 كاملة فقط بعد U2.7 وإغلاق المصفوفة كلها.

---

## 28. مصادر القرار

### 28.1 مصادر رسمية ودراسات

- OpenAI Study Mode — التشخيص، scaffolding، المشاركة النشطة، checks، feedback، وتبديل النمط: <https://openai.com/index/chatgpt-study-mode/>
- Learn Your Way study — تعدد التمثيلات، quizzes، progress، gaps، mind map، والعودة للمصدر: <https://pmc.ncbi.nlm.nih.gov/articles/PMC13008931/>
- OpenAI Deep Research — outcome/constraints، clarifications، خطة قابلة للمراجعة، progress/steering، citations/activity: <https://help.openai.com/en/articles/10500283-deep-research-in-chatgpt>
- Google AI Mode Canvas — مساحة مستمرة قابلة للتحسين واختبار prototypes بدل جواب نهائي فقط: <https://blog.google/products-and-platforms/products/search/ai-mode-canvas-writing-coding/>
- Anthropic Artifacts — مخرج منفصل قابل للبناء والتحرير بجانب الحوار: <https://www.anthropic.com/news/claude-3-5-sonnet>
- GitHub responsible use for coding agents — diff/CI/security evidence ومراجعة بشرية قبل الدمج: <https://docs.github.com/en/copilot/responsible-use/agents>
- OpenAI sandboxing — فصل حدود sandbox عن approval وأضيق scope: <https://learn.chatgpt.com/docs/sandboxing>
- OpenAI Data Analysis — profile، tables/charts، calculations، assumptions، وقيود الملفات: <https://help.openai.com/en/articles/8437071-data-analysis-with-chatgpt>
- Tableau accessibility — keyboard/AT، نص/جدول مكافئ، تباين، وعدم الاعتماد على اللون: <https://help.tableau.com/current/pro/desktop/en-us/accessibility_overview.htm>
- Vega-Lite encoding — descriptions دلالية لـSVG marks: <https://vega.github.io/vega-lite/docs/encoding.html>
- Harvard Open Knowledge Maps — خريطة موضوعات مترابطة مع مصادر قابلة للفحص: <https://library.harvard.edu/services-tools/open-knowledge-maps>
- WCAG 2.2: <https://www.w3.org/TR/WCAG22/>
- Next.js AI Coding Agents/version-matched docs: <https://nextjs.org/docs/app/guides/ai-agents>

### 28.2 مستودعات مرجعية — لا تعني قرار اعتماد

- XYFlow/React Flow: <https://github.com/xyflow/xyflow>
- Vega-Lite: <https://github.com/vega/vega-lite>
- CodeMirror: <https://github.com/codemirror/dev>
- Monaco Editor: <https://github.com/microsoft/monaco-editor>
- Lexical: <https://github.com/facebook/lexical>

أي استخدام فعلي يحتاج فحص الإصدار المثبت، الـbundle، الوصولية، الترخيص، والصيانة. وجود repository في القائمة ليس إذنًا لإضافة dependency.

### 28.3 Skills المختارة للوكيل المنفّذ

تُقرأ extracts المحلية المدققة أولًا، وتُراجع upstream عند القرار المعتمد على إصدار:

- Source-driven development — <https://github.com/addyosmani/agent-skills>
- Interface Design — <https://github.com/Dammyjay93/interface-design>
- Research synthesis — <https://github.com/anthropics/knowledge-work-plugins/tree/main/design/skills/research-synthesis>
- React best practices — <https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices>
- React composition patterns — <https://github.com/vercel-labs/agent-skills/tree/main/skills/composition-patterns>
- AccessLint skills — <https://github.com/AccessLint/skills>
- KreerC accessibility baseline — <https://github.com/KreerC/ACCESSIBILITY.md>
- Microsoft Playwright CLI — <https://github.com/microsoft/playwright/tree/main/packages/playwright-core/src/tools/skills/playwright-cli>
- Web Quality Skills — <https://github.com/addyosmani/web-quality-skills>
- Trail of Bits security skills — <https://github.com/trailofbits/skills>

### 28.4 إشارات مجتمع نوعية، لا أدلة معيارية

- نقاش Study Mode أظهر قيمة Socratic guidance وأيضًا خطر سؤال المتعلم عن مادة لم تُشرح؛ لذلك يربط Learn كل check بمحتوى سابق: <https://www.reddit.com/r/singularity/comments/1mchrs2/openai_introducing_study_mode_a_new_way_to_learn/>
- نقاش citations أظهر أن شكل المرجع أو DOI وحده لا يثبت دعمه للادعاء؛ لذلك نستخدم claim/locator/excerpt: <https://www.reddit.com/r/MachineLearning/comments/1kzh8t7/d_why_are_2025_sota_llms_such_as_claude_and_gpt/>
- تجربة chart مقنع بأرقام غير متصالحة دعمت الفصل بين العرض والحساب ووجود reconciliation: <https://www.reddit.com/r/analytics/comments/1rb7ffi/i_trusted_aigenerated_charts_in_a_report_i_sent/>
- نقاش AI code review أكد signal/noise، diff context، والحاجة إلى tests/human review بدل الثقة في التعليق وحده: <https://news.ycombinator.com/item?id=46766961>
- نقاش mind maps أظهر أن graph الكبير يصعب عرضه بكثافة، وأن outline/list ليست بديلًا أدنى بل مسارًا ضروريًا: <https://news.ycombinator.com/item?id=20903273>

هذه الإشارات تساعد في اكتشاف الألم ولا تُستخدم لإثبات prevalence أو معيار تقني.

---

## 29. سؤال الإغلاق الوحيد

عند اكتمال U2 يجب أن يستطيع المراجع الإجابة بـ«نعم» مع دليل على السؤال التالي:

> هل أصبحت كل خدمة مساحة عمل يمكن تمييز منطقها ومخرجها ومخاطرها ومراجعتها دون الاسم أو اللون، مع بقاء التجربة عربية/إنجليزية، صادقة، قابلة للوصول، ومتوافقة مع Frontend-only prototype؟

إذا كانت الإجابة تعتمد على screenshots جميلة فقط، أو على شارة «Demo» مع أفعال مضللة، أو على اختبارات لم تُشغل بعد آخر تغيير، فالموجة ليست مكتملة.
