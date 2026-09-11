# مخزون الشاشات — نَسَق AI

| الحقل | القيمة |
|---|---|
| الإصدار | `0.1` |
| الحالة | Baseline للـFrontend prototype |
| آخر تحديث | 11 سبتمبر 2026 |
| المرجع | [PRD](PRD.md) · [Sitemap](SITEMAP.md) |

> هذا الملف هو قائمة التغطية التنفيذية. وجود route وحده لا يعني اكتمال الشاشة؛ يجب أن تنجح أفعالها وحالاتها وبياناتها ومعايير الوصولية المرتبطة بها.

---

## 1. ترميز المخزون

### 1.1 معرف الشاشة

- `PUB-*`: التسويق العام.
- `AUTH-*`: المصادقة والدعوات.
- `ONB-*`: التهيئة.
- `HOME-*`: مركز القيادة.
- `CHAT-*`: المحادثة والمقارنة.
- `PROJ-*`: المشاريع.
- `AGT-*`: تعريف الوكلاء.
- `RUN-*`: التشغيلات والموافقات والمخرجات.
- `FLOW-*`: التدفقات.
- `KNOW-*`: المعرفة.
- `MDL-*`: النماذج والتوجيه.
- `TOOL-*`: الأدوات والمهارات.
- `USG-*`: الاستهلاك والفوترة.
- `TEAM-*`: الفريق.
- `SET-*`: الإعدادات.
- `SYS-*`: الأخطاء والحالات العامة.
- `OVR-*`: overlay أو dialog أو sheet ليس route مستقلًا دائمًا.

### 1.2 حزم الحالات

| الرمز | الحزمة المطلوبة |
|---|---|
| `BASIC` | default + loading + recoverable error |
| `LIST` | BASIC + empty + filtered-empty + pagination/loading-more |
| `RESOURCE` | BASIC + not-found + forbidden + archived/read-only |
| `COST` | BASIC + estimate + actual + quota-low + quota-exhausted |
| `ASYNC` | queued + active + paused/waiting + completed + warning + failed + cancelled |
| `FORM` | pristine + dirty + validating + invalid + saving + saved + conflict |
| `DANGER` | confirmation + typed/explicit confirmation عند اللزوم + in-progress + failure |
| `OFFLINE` | disconnected + reconnecting + recovered + stale |
| `DENSE` | 0، 1، 20، 200+ عنصر لاختبار الكثافة والأداء |
| `ROLE` | owner/admin/builder/member/viewer/billing variations |
| `BIDI` | عربي، إنجليزي، نص مختلط، URL/code/email، وأسماء طويلة |

كل شاشة P0 تشمل `BIDI` ضمنيًا حتى إذا لم يكرر الجدول الرمز.

### 1.3 حقول تعريف الشاشة

لكل شاشة عند التنفيذ يجب أن يتوفر:

- Screen ID وRoute ID.
- الهدف الأساسي والمستخدم/الدور.
- primary action واحد واضح.
- secondary actions محدودة.
- البيانات المطلوبة ومصدرها/fixture.
- الحالات والحواف.
- permission behavior.
- analytics events.
- معايير mobile وkeyboard وscreen reader.

---

## 2. الأسطح العامة

| Screen ID | Route ID | الشاشة | الهدف والفعل الأساسي | الحالات | الإصدار |
|---|---|---|---|---|---|
| `PUB-001` | `R-PUB-001` | الصفحة الرئيسية | فهم Chat → Agent → Flow ثم بدء التجربة | BASIC، mobile، signed-in CTA | Prototype |
| `PUB-009` | `R-PUB-013` | معاينة المنتج التفاعلية | تجربة Chat → Agent → Flow ثم تشغيل وموافقة وإيصال محلي | BASIC، ASYNC، COST، BIDI، mobile، keyboard | Prototype |
| `PUB-002` | `R-PUB-002` | نظرة المنتج | شرح الوحدات والسياق المشترك دون feature dumping | BASIC، long content | Prototype |
| `PUB-003` | `R-PUB-003` | النماذج العامة | معرفة الفئات والمزودين وحالة الدعم | LIST، degraded model | Prototype |
| `PUB-004` | `R-PUB-004` | الوكلاء العامة | شرح الخطة والأدوات والموافقات والإيصالات | BASIC | Prototype |
| `PUB-005` | `R-PUB-005` | Flow العامة | شرح تحويل العمل المتكرر إلى تدفق | BASIC | Prototype |
| `PUB-006` | `R-PUB-006` | الأسعار | فهم الخطط وBYOK + Credits دون أرقام مختلقة | BASIC، monthly/yearly UI، open pricing labels | Prototype |
| `PUB-007` | `R-PUB-007` | الأمان | فصل الضوابط المنفذة عن المخططة | BASIC، disclosure sections | Prototype |
| `PUB-008` | `R-PUB-010..012` | صفحات قانونية | عرض سياسة قابلة للطباعة والإصدار | loading، version/date | قبل Alpha |

### محتوى الصفحة الرئيسية المطلوب

1. Hero بوعد واضح وفعلين فقط.
2. Product proof يوضح انتقال Chat → Agent → Flow.
3. سياق المشروع المشترك.
4. مقارنة النماذج وشفافية التوجيه.
5. الوكلاء مع approval وreceipt.
6. BYOK + Credits.
7. Arabic-first/RTL.
8. CTA ختامي وتسعير أولي صادق.

---

## 3. المصادقة والدعوات

| Screen ID | Route ID | الشاشة | الفعل الأساسي | الحالات | الإصدار |
|---|---|---|---|---|---|
| `AUTH-001` | `R-AUTH-001` | تسجيل الدخول | دخول بالبريد/الطريقة المدعومة | FORM، invalid، rate-limited، session exists | Prototype/Alpha |
| `AUTH-002` | `R-AUTH-002` | إنشاء حساب | إنشاء حساب والموافقة المطلوبة | FORM، email exists، weak password | Prototype/Alpha |
| `AUTH-003` | `R-AUTH-003` | تحقق البريد | تأكيد أو إعادة إرسال | expired، already verified، resend cooldown | Alpha |
| `AUTH-004` | `R-AUTH-004` | نسيت كلمة المرور | طلب رابط دون كشف وجود الحساب | FORM، generic success | Alpha |
| `AUTH-005` | `R-AUTH-005` | إعادة التعيين | تعيين كلمة آمنة | FORM، token expired/used | Alpha |
| `AUTH-006` | `R-AUTH-006` | callback | إكمال الدخول والعودة الآمنة | processing، provider error، invalid returnTo | Alpha |
| `AUTH-007` | `R-AUTH-007` | قبول دعوة | مراجعة الفريق والدور ثم قبول/رفض | valid، expired، revoked، wrong email، signed-out | Prototype/Alpha |

---

## 4. Onboarding

كل الخطوات داخل route واحد مع step state محفوظ، لكن لكل منها Screen ID واختبار مستقل.

| Screen ID | الخطوة | الهدف | الفعل الأساسي | الحالات |
|---|---|---|---|---|
| `ONB-001` | ترحيب ولغة | تأكيد اللغة والاتجاه | متابعة | Arabic/English، العودة من جلسة ناقصة |
| `ONB-002` | الدور والاستخدام | اختيار محترف/فريق ومجالات الاستخدام | اختيار ومتابعة | لا اختيار، custom option |
| `ONB-003` | مساحة العمل | شخصية أو فريق واسم المساحة | إنشاء مساحة | FORM، name conflict، invite flow |
| `ONB-004` | الوصول للنماذج | Credits تجريبية أو BYOK لاحقًا | اختيار مسار | لا يدخل مفتاح حقيقي في Prototype |
| `ONB-005` | بداية موجهة | اختيار Chat starter أو Project template | ابدأ العمل | template loading/error |
| `ONB-006` | اكتمل | تلخيص الإعداد والوصول إلى القيمة | فتح Chat/Project | idempotent completion |

### شرط التهيئة

يمكن تخطي التفاصيل غير الضرورية، لكن لا يمكن الوصول إلى تطبيق حقيقي دون workspace صالح وlocale محفوظ.

---

## 5. App Shell وHome

| Screen ID | Route ID | الشاشة | الهدف والفعل الأساسي | الحالات |
|---|---|---|---|---|
| `HOME-001` | `R-HOME-001` | Command Center | بدء Chat/Agent/Flow أو استئناف عمل | BASIC، new user، DENSE، ROLE |
| `HOME-002` | state داخل Home | تشغيلات نشطة | معرفة ما يعمل وما ينتظر المستخدم | ASYNC، OFFLINE |
| `HOME-003` | state داخل Home | موافقات معلقة | اتخاذ قرار من سياق كافٍ | zero/pending/expired، ROLE |
| `HOME-004` | state داخل Home | ملخص الاستخدام | رؤية الرصيد والميزانية والاتجاه | COST، ROLE |
| `OVR-001` | global overlay | Workspace switcher | تبديل المساحة أو إنشاؤها | LIST، loading، suspended workspace |
| `OVR-002` | global overlay | Command palette | بحث وتنقل وبدء إجراء | empty query، no results، keyboard-only |
| `OVR-003` | global overlay | Notifications tray | رؤية الأحداث الحديثة | LIST، unread/read، sensitive redaction |
| `OVR-004` | global overlay | Account menu | profile/preferences/sign out | ROLE، keyboard |

---

## 6. Chat والمقارنة

| Screen ID | Route ID | الشاشة | الهدف والفعل الأساسي | الحالات | PRD |
|---|---|---|---|---|---|
| `CHAT-001` | `R-CHAT-001` | سجل المحادثات | العثور على محادثة أو بدء جديدة | LIST، DENSE، archived | `CHAT-001` |
| `CHAT-002` | `R-CHAT-002` | Chat جديد | كتابة وإرسال أول رسالة | BASIC، COST، model unavailable | `CHAT-001..003` |
| `CHAT-003` | `R-CHAT-003` | محادثة نشطة | متابعة العمل على response | ASYNC، OFFLINE، DENSE | `CHAT-004..018` |
| `CHAT-004` | `R-CHAT-003` state | رسالة محررة/branch | مراجعة branch والعودة لمسار سابق | branching، conflict | `CHAT-005` |
| `CHAT-005` | `R-CHAT-004` | نتيجة المقارنة | مقارنة outputs واختيار/متابعة | partial success، one failed، COST | `CHAT-006..007` |
| `OVR-005` | overlay | Model picker | اختيار نموذج أو سياسة | LIST، search، unavailable، capability mismatch | `CHAT-002` |
| `OVR-006` | overlay | إعداد المقارنة | اختيار 2–3 نماذج ورؤية التوافق والتكلفة | invalid count، file mismatch، quota | `CHAT-006` |
| `OVR-007` | panel/sheet | Sources | فحص citations والمقتطفات | loading، broken/unavailable source | `CHAT-008` |
| `OVR-008` | panel/sheet | Response details | النموذج، الزمن، usage، payer، request IDs | estimate/actual، redacted | `CHAT-009,013` |
| `OVR-009` | dialog/page | تحويل إلى Agent | مراجعة الهدف والسياق والمرفقات والميزانية | FORM، sensitive context warning | `CHAT-010` |
| `OVR-010` | drawer | Attachments queue | إدارة الرفع والتوافق | scanning، processing، rejected، duplicate | `CHAT-003,015` |
| `CHAT-006` | `R-CHAT-005` | إعداد المشاركة | تحديد النطاق والمدة وما يظهر | ROLE، disabled by policy | Beta |

### مكونات شاشة المحادثة

- Conversation header: العنوان، المشروع، النموذج/الوضع، share/details.
- Message rail: user/model/tool/system notices بفروق دلالية واضحة.
- Artifact rail اختياري على desktop.
- Composer ثابت دون تغطية المحتوى.
- Cost/model strip صغير قابل للتوسيع.
- Jump to latest يظهر عند الابتعاد عن نهاية streaming.

### حالات الرسالة المطلوبة

```text
queued · sending · submitted · streaming · completed
failed_retryable · failed_final · cancelled · blocked · stale
```

---

## 7. المشاريع

| Screen ID | Route ID | الشاشة | الهدف والفعل الأساسي | الحالات |
|---|---|---|---|---|
| `PROJ-001` | `R-PROJ-001` | قائمة المشاريع | فتح/إنشاء/أرشفة مشروع | LIST، DENSE، ROLE |
| `PROJ-002` | `R-PROJ-002` | إنشاء مشروع | اسم ووصف وقالب وسياسة أولية | FORM، template failure |
| `PROJ-003` | `R-PROJ-004` | Overview | فهم نشاط وسياق المشروع | BASIC، empty، DENSE |
| `PROJ-004` | `R-PROJ-005` | محادثات المشروع | بدء/فتح Chat في السياق | LIST |
| `PROJ-005` | `R-PROJ-006` | معرفة المشروع | إدارة المصادر المرتبطة | LIST، async processing |
| `PROJ-006` | `R-PROJ-007` | وكلاء المشروع | اختيار/تشغيل/ربط وكيل | LIST، permission |
| `PROJ-007` | `R-PROJ-008` | تدفقات المشروع | تشغيل/تحرير التدفقات | LIST، draft/published |
| `PROJ-008` | `R-PROJ-009` | تشغيلات المشروع | مراجعة runs والتكلفة | LIST، ASYNC |
| `PROJ-009` | `R-PROJ-010` | إعدادات المشروع | التعليمات والنموذج والسياسة والأرشفة | FORM، ROLE، DANGER |
| `OVR-011` | dialog | نقل محادثة | اختيار مشروع ومعاينة الأثر | LIST، permission، conflict |
| `OVR-012` | dialog | أرشفة/استعادة مشروع | تأكيد الأثر | DANGER |

---

## 8. تعريف الوكلاء

| Screen ID | Route ID | الشاشة | الهدف والفعل الأساسي | الحالات |
|---|---|---|---|---|
| `AGT-001` | `R-AGT-001` | مكتبة الوكلاء | اكتشاف وتشغيل/إنشاء وكيل | LIST، template/user/team filters |
| `AGT-002` | `R-AGT-002` | اختيار نقطة البداية | قالب أو تحويل Chat أو فارغ | BASIC، no templates |
| `AGT-003` | `R-AGT-003` | تفاصيل الوكيل | فهم الهدف والأدوات والإصدار والتشغيلات | RESOURCE، ROLE |
| `AGT-004` | `R-AGT-004` | Builder — الأساس | تحرير الاسم والهدف والتعليمات | FORM |
| `AGT-005` | `R-AGT-004` | Builder — النموذج | سياسة النموذج وfallback والميزانية | FORM، COST، unavailable model |
| `AGT-006` | `R-AGT-004` | Builder — المعرفة | ربط collections والمصادر | LIST، permission |
| `AGT-007` | `R-AGT-004` | Builder — الأدوات | اختيار الأدوات والنطاق | LIST، risk classes، ROLE |
| `AGT-008` | `R-AGT-004` | Builder — الموافقات | تعريف policy حسب الإجراء | FORM، unsafe combination warning |
| `AGT-009` | `R-AGT-004` | Builder — الاختبار | Mock/test run قبل الحفظ | ASYNC، failed validation |
| `AGT-010` | `R-AGT-005` | الإصدارات | compare/restore/inspect | LIST، diff، ROLE |
| `AGT-011` | `R-AGT-006` | تشغيلات الوكيل | فلترة وفتح runs | LIST، ASYNC، DENSE |
| `AGT-012` | `R-AGT-007` | إعداد تشغيل | إدخال الهدف والمدخلات والحدود | FORM، COST، quota |
| `OVR-013` | dialog | حذف/أرشفة وكيل | إظهار الارتباطات بالتدفقات | DANGER، dependency conflict |

### أقسام Builder

تظهر كخطوات أو navigation داخلي، لا صفحات منفصلة في URL أولًا. حالة `section` يمكن حفظها في query عند الحاجة دون فقد draft.

---

## 9. التشغيلات والموافقات والمخرجات

| Screen ID | Route ID | الشاشة | الهدف والفعل الأساسي | الحالات |
|---|---|---|---|---|
| `RUN-001` | `R-RUN-001` | كل التشغيلات | مراقبة وفرز وفتح run | LIST، ASYNC، DENSE |
| `RUN-002` | `R-RUN-002` | Run overview | فهم الحالة والهدف والخطة والتكلفة | ASYNC، OFFLINE، RESOURCE |
| `RUN-003` | `R-RUN-002` tab | Timeline | تتبع الخطوات والأدوات والأحداث | 1/20/200+ events، redacted logs |
| `RUN-004` | `R-RUN-002` tab | Artifacts | معاينة وتنزيل/حفظ المخرجات | empty، generating، failed preview |
| `RUN-005` | `R-RUN-002` tab | Receipt | مراجعة النموذج والأدوات والموافقات والusage | partial، redacted، adjustment |
| `RUN-006` | `R-RUN-002` state | سؤال توضيحي | إدخال جواب واستئناف | pending، expired، answered elsewhere |
| `APR-001` | `R-APR-001` | صندوق الموافقات | معالجة pending approvals | LIST، ROLE، expired |
| `APR-002` | `R-APR-002` | تفاصيل الموافقة | مراجعة action preview واتخاذ قرار | pending/approved/denied/edited/expired |
| `OVR-014` | dialog | إلغاء تشغيل | شرح ما يمكن إيقافه وما قد فُوتر | DANGER، cancel requested |
| `OVR-015` | dialog | إعادة محاولة | اختيار نقطة الإعادة والتكلفة المتوقعة | COST، side-effect warning |
| `OVR-016` | viewer | Artifact preview | قراءة/تنزيل/إضافة إلى مشروع | loading، unsupported type، permission |

### layout التشغيل

- Header ثابت: status، elapsed، cost، pause/cancel.
- Main: plan/timeline.
- Side panel: artifacts أو approval أو details.
- Mobile: tabs مع status sticky، دون split panes متزاحمة.

---

## 10. Flow

| Screen ID | Route ID | الشاشة | الهدف والفعل الأساسي | الحالات |
|---|---|---|---|---|
| `FLOW-001` | `R-FLOW-001` | مكتبة التدفقات | اكتشاف/إنشاء/تشغيل Flow | LIST، draft/published/failed |
| `FLOW-002` | `R-FLOW-002` | نقطة البداية | قالب/Run سابق/فارغ | BASIC |
| `FLOW-003` | `R-FLOW-003` | تفاصيل Flow | رؤية النسخة والحالة والتشغيلات | RESOURCE، ROLE |
| `FLOW-004` | `R-FLOW-004` | Canvas editor | تركيب العقد والاتصالات | FORM، DENSE، zoom/pan |
| `FLOW-005` | `R-FLOW-004` panel | Node inspector | إعداد عقدة محددة | FORM، invalid/missing inputs |
| `FLOW-006` | `R-FLOW-004` panel | Validation | إصلاح الأخطاء والتحذيرات | zero/errors/warnings |
| `FLOW-007` | `R-FLOW-004` mode | Test run | مشاهدة المسار والنتائج الوهمية | ASYNC، partial failure |
| `FLOW-008` | `R-FLOW-005` | Versions | compare/publish/deprecate | LIST، DANGER |
| `FLOW-009` | `R-FLOW-006` | Runs | مراجعة التشغيلات | LIST، ASYNC |
| `FLOW-010` | `R-FLOW-007` | Manual run setup | إدخال البيانات ورؤية التكلفة | FORM، COST |
| `FLOW-011` | mobile state | عرض خطوات Flow | القراءة والموافقة دون canvas edit كامل | BASIC، screen reader order |
| `OVR-017` | dialog | Publish Flow | ملخص التغييرات والصلاحيات | validation failed، DANGER |
| `OVR-018` | dialog | تحويل Run إلى Flow | مراجعة العقد والقيم الحساسة | FORM، secret detection warning |

---

## 11. Knowledge

| Screen ID | Route ID | الشاشة | الهدف والفعل الأساسي | الحالات |
|---|---|---|---|---|
| `KNOW-001` | `R-KNOW-001` | مكتبة المعرفة | رؤية collections والمصادر | LIST، processing summary |
| `KNOW-002` | `R-KNOW-002` | إضافة مصدر | ملف/URL/نص أو collection | FORM، upload states، SSRF-style invalid URL UI |
| `KNOW-003` | `R-KNOW-003` | Collection | إدارة المصادر والارتباطات | RESOURCE، LIST، ROLE |
| `KNOW-004` | `R-KNOW-004` | Retrieval test | إدخال سؤال وفحص المقاطع | FORM، results/no results/error |
| `KNOW-005` | `R-KNOW-005` | تفاصيل المصدر | الحالة والمعاينة والاستخدام والحذف | ASYNC، stale، failed، DANGER |
| `KNOW-006` | panel | Source usage | أين يستخدم المصدر | LIST، permission-redacted references |
| `KNOW-007` | panel | Processing details | مراحل الفحص والاستخراج والفهرسة | ASYNC، retryable/final error |
| `OVR-019` | dialog | حذف مصدر | أثر الحذف على Agents/Flows | DANGER، dependency list |

---

## 12. Models & Routing

| Screen ID | Route ID | الشاشة | الهدف والفعل الأساسي | الحالات |
|---|---|---|---|---|
| `MDL-001` | `R-MDL-001` | كتالوج النماذج | البحث والمقارنة والاختيار | LIST، availability، BYOK/platform |
| `MDL-002` | `R-MDL-002` | تفاصيل النموذج | فهم القدرات والقيود والسعر والحالة | RESOURCE، retirement notice |
| `MDL-003` | `R-MDL-003` | سياسات التوجيه | تعريف manual/smart/fallback | FORM، ROLE، unsafe fallback |
| `OVR-020` | overlay | Model compare sheet | مقارنة خصائص 2–4 نماذج | selected limit، unavailable |
| `OVR-021` | dialog | تغيير default model | معاينة الأسطح المتأثرة | FORM، dependency warning |

---

## 13. Tools & Skills

| Screen ID | Route ID | الشاشة | الهدف والفعل الأساسي | الحالات |
|---|---|---|---|---|
| `TOOL-001` | `R-TOOL-001` | كتالوج الأدوات | اكتشاف أداة وفهم مخاطرها | LIST، risk/status filters |
| `TOOL-002` | `R-TOOL-002` | تفاصيل الأداة | العمليات والصلاحيات والاتصال | RESOURCE، disconnected/degraded |
| `SKILL-001` | `R-SKILL-001` | كتالوج المهارات | اكتشاف skill ومصدرها | LIST، trusted/review-needed |
| `SKILL-002` | `R-SKILL-002` | تفاصيل skill | source/SHA/license/permissions/review | RESOURCE، provenance warning |
| `OVR-022` | dialog | تفعيل أداة | اختيار scope وسياسة الموافقة | ROLE، risk warning |
| `OVR-023` | dialog | تعطيل أداة | إظهار Agents/Flows المتأثرة | DANGER، dependency list |

---

## 14. Usage, Credits & Billing

| Screen ID | Route ID | الشاشة | الهدف والفعل الأساسي | الحالات |
|---|---|---|---|---|
| `USG-001` | `R-USG-001` | لوحة الاستخدام | فهم الاستهلاك والتكلفة والاتجاه | COST، LIST، DENSE، ROLE |
| `USG-002` | `R-USG-002` | حدث استهلاك | trace إلى message/run مع التسوية | estimate/reserved/actual/adjusted |
| `USG-003` | state | Breakdown | حسب مشروع/نموذج/عضو/وحدة/payer | no data، partial permissions |
| `BILL-001` | `R-BILL-001` | Overview | الخطة والرصيد والفاتورة التالية | COST، ROLE |
| `BILL-002` | `R-BILL-002` | Credits | تعبئة/سجل adjustments | FORM، payment mocked، low balance |
| `BILL-003` | `R-BILL-003` | طرق الدفع | إضافة/إزالة/افتراضي | FORM، DANGER، 3DS/pending لاحقًا |
| `BILL-004` | `R-BILL-004` | الفواتير | عرض وتنزيل | LIST، failed payment |
| `BILL-005` | `R-BILL-005` | الميزانيات | limits وتنبيهات حسب scope | FORM، exceeded، conflicting limits |
| `OVR-024` | dialog | Cost details | estimate مقابل actual ورسوم المنصة | COST، reconciliation pending |

---

## 15. Team & Roles

| Screen ID | Route ID | الشاشة | الهدف والفعل الأساسي | الحالات |
|---|---|---|---|---|
| `TEAM-001` | `R-TEAM-001` | الأعضاء | دعوة/تغيير دور/إزالة | LIST، ROLE، pending invitations |
| `TEAM-002` | `R-TEAM-002` | الأدوار | فهم/تعديل الصلاحيات المتاحة | ROLE، read-only in Alpha |
| `OVR-025` | dialog | دعوة عضو | بريد ودور ورسالة | FORM، duplicate/expired policy |
| `OVR-026` | dialog | تغيير دور | معاينة الوصول المكتسب/المفقود | ROLE، last owner guard |
| `OVR-027` | dialog | إزالة عضو | أثر الإزالة ونقل موارد شخصية إن وجدت | DANGER |
| `OVR-028` | dialog | نقل الملكية | تأكيد ثنائي وحالة المالك الجديد | DANGER، re-auth |

---

## 16. الإعدادات

| Screen ID | Route ID | الشاشة | الهدف والفعل الأساسي | الحالات |
|---|---|---|---|---|
| `SET-001` | `R-SET-001` | Profile | الاسم والصورة والحساب | FORM |
| `SET-002` | `R-SET-002` | Preferences | اللغة والمظهر والكثافة والإشعارات | FORM، instant preview |
| `SET-003` | `R-SET-003` | Workspace | الاسم والسياسات والافتراضيات | FORM، ROLE |
| `SET-004` | `R-SET-004` | Provider credentials | إضافة/اختبار/revoke BYOK | LIST، secret-safe FORM، ROLE |
| `SET-005` | `R-SET-005` | Integrations | الاتصالات الخارجية | LIST، connected/error/re-auth |
| `SET-006` | `R-SET-006` | Data & privacy | export/delete/retention | DANGER، processing request |
| `SET-007` | `R-SET-007` | Audit log | فلترة الأحداث الحساسة | LIST، DENSE، ROLE |
| `OVR-029` | dialog | إضافة BYOK | إدخال آمن واختبار ونطاق/fallback | Demo-only in Prototype، invalid/revoked |
| `OVR-030` | dialog | Revoke key | إظهار التشغيلات/الdefaults المتأثرة | DANGER |
| `OVR-031` | dialog | حذف workspace | typed confirmation + re-auth | DANGER، last owner |

---

## 17. صفحات النظام

| Screen ID | Route ID | الشاشة | الفعل الأساسي | الحالات |
|---|---|---|---|---|
| `SYS-001` | `R-SYS-001` | 404 | العودة/البحث | public/app variants |
| `SYS-002` | `R-SYS-002` | 403 | العودة أو طلب وصول | resource existence redacted |
| `SYS-003` | `R-SYS-003` | Session expired | تسجيل الدخول والعودة | unsent draft preserved |
| `SYS-004` | `R-SYS-004` | Workspace suspended | التواصل/تبديل مساحة | read-only possibility |
| `SYS-005` | `R-SYS-005` | Degraded service | استخدام بديل أو المحاولة لاحقًا | provider/tool-specific |
| `SYS-006` | `R-SYS-006` | Offline banner/page | إعادة الاتصال وحفظ المسودة | OFFLINE |
| `SYS-007` | `R-SYS-007` | Error boundary | إعادة المحاولة/نسخ معرف التتبع | safe details only |

---

## 18. الأولويات التنفيذية للشاشات

### Wave 1 — Shell والقيمة الأولى

- `PUB-001`, `PUB-006`, `PUB-007`
- `AUTH-001`, `AUTH-002`
- `ONB-001..006`
- `HOME-001..004`
- `CHAT-001..003`
- `OVR-001`, `OVR-005`, `OVR-010`

### Wave 2 — المقارنة والمشاريع

- `CHAT-004..005`, `OVR-006..009`
- `PROJ-001..009`
- `USG-001`, `BILL-001`, `BILL-005`

### Wave 3 — الوكلاء والتشغيلات

- `AGT-001..012`
- `RUN-001..006`
- `APR-001..002`
- overlays المرتبطة بالموافقة والإلغاء والمخرجات.

### Wave 4 — Flow والمعرفة

- `FLOW-001..011`
- `KNOW-001..007`

### Wave 5 — الإدارة والتغطية

- Models/Tools/Skills.
- Billing الكامل.
- Team/Settings.
- System states، responsive، a11y، وvisual regression.

---

## 19. مسارات Playwright الحرجة

| Test ID | المسار |
|---|---|
| `E2E-001` | زائر → تسجيل → onboarding → Chat أول → حفظ إلى مشروع |
| `E2E-002` | Chat جديد → اختيار نموذج → streaming → stop → retry |
| `E2E-003` | ملف + Compare → نموذج يفشل والآخر ينجح → اختيار نتيجة |
| `E2E-004` | Conversation → Convert to Agent → review → mock run |
| `E2E-005` | Agent run → approval pending → approve → artifact + receipt |
| `E2E-006` | Run completed → Convert to Flow → validate → test → publish mock |
| `E2E-007` | Knowledge source → processing → failed → retry → ready → retrieval test |
| `E2E-008` | BYOK demo → invalid → valid → set scope → revoke |
| `E2E-009` | Viewer يحاول edit/run عالي التكلفة → 403/disabled explanation |
| `E2E-010` | تبديل ar/en في Chat وFlow والحفاظ على route والحالة |
| `E2E-011` | keyboard-only: model picker → send → sources → approval |
| `E2E-012` | mobile: Home → Chat → Runs → Approval → Artifact |

---

## 20. معايير اكتمال المخزون

- [ ] كل P0 screen لها fixture وحالات موثقة.
- [ ] كل route في Sitemap مرتبط بشاشة أو redirect مقصود.
- [ ] كل primary action مرتبط بحدث أو transition في `STATE-MACHINES.md`.
- [ ] overlays تحافظ على back/forward وfocus restore.
- [ ] لا تستخدم screens مختلفة أشكال بيانات متعارضة للكيان نفسه.
- [ ] لكل قائمة حالة empty وfiltered-empty وerror وكثافة عالية.
- [ ] لكل عملية مكلفة payer/cost/quota state.
- [ ] لكل فعل حساس permission وconfirmation وaudit behavior.
- [ ] العربية والإنجليزية والنص المختلط موجودة في fixtures.
- [ ] desktop/mobile/keyboard/screen-reader acceptance محددة للمسارات الحرجة.
