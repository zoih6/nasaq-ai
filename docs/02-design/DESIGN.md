# نظام التصميم وتجربة الاستخدام — نَسَق AI

| الحقل | القيمة |
|---|---|
| الإصدار | `0.1` |
| الحالة | Design baseline للـFrontend prototype |
| آخر تحديث | 11 سبتمبر 2026 |
| المرجع | [PRD](../01-product/PRD.md) · [Sitemap](../01-product/SITEMAP.md) · [Screen Inventory](../01-product/SCREEN-INVENTORY.md) |
| الاتجاه | **Precision Workspace — هدوء تشغيلي دقيق** |

> **إشعار supersession — 12 سبتمبر 2026:** تمثل هذه الوثيقة baseline تاريخيًا لاتجاه Precision Workspace. في تجربة Universal وU2، تتقدم عليها رؤية [`NASAQ-UNIVERSAL-RESET.md`](../00-vision/NASAQ-UNIVERSAL-RESET.md)، ونظام Luminous المنفذ، وعقد [`U2-SERVICE-DEPTH.md`](../01-product/U2-SERVICE-DEPTH.md)، و[`MOTION-AND-FEEDBACK.md`](MOTION-AND-FEEDBACK.md). لا تُستخدم الفقرات المتعارضة هنا لإعادة التموضع المهني القديم أو إلغاء الاتجاه المضيء المختار.
>
> تبقى القواعد غير المتعارضة حول semantics، الوصولية، RTL/LTR، الحالات، والثقة مرجعًا صالحًا.

---

## 1. الفكرة البصرية

نَسَق مساحة عمل تربط مسارات متعددة وتحوّلها إلى نتيجة منظمة. يجب أن يشعر المستخدم بأنه داخل **أداة مهنية هادئة ودقيقة**، لا عرض تقني مبهر ولا chatbot عام.

### 1.1 الصفات المطلوبة

- منظم.
- واضح.
- موثوق.
- هادئ دون برود.
- كثيف بالمقدار المفيد.
- تقني دون تعقيد لغوي.
- عربي أصيل لا واجهة معكوسة.
- دقيق في الحالات والتكلفة والصلاحيات.

### 1.2 الصفات المرفوضة

- تدرجات بنفسجية/زرقاء افتراضية للـAI.
- glassmorphism أو blur كهوية.
- sparkles وروبوتات وأدمغة وشبكات عصبية كرموز عامة.
- card لكل فقرة أو كل رقم.
- bento grid بلا علاقة بالمحتوى.
- أزرار gradient أو glow مستمر.
- radius ضخم لكل عنصر.
- رسوم 3D زخرفية أو dashboards مختلقة.
- copy مثل «أطلق العنان لقوة الذكاء الاصطناعي».
- animation لا تشرح انتقال حالة.

---

## 2. Design Read

> **نَسَق تبدو كمحرر عمليات معرفية دقيق:** أسطح حجرية دافئة، حبر أخضر داكن، teal للأفعال الموثوقة، amber للانتباه والموافقات، خطوط ومسارات تربط السياق بالتنفيذ، وكثافة تشبه أدوات العمل الاحترافية أكثر من صفحات AI الاستعراضية.

يجب أن يستطيع المصمم أو المطور تبرير كل قرار بصري بأحد الآتي:

1. hierarchy.
2. state.
3. relationship.
4. action priority.
5. trust/risk.
6. readability.

إذا لم يخدم القرار واحدًا منها فهو مرشح للحذف.

---

## 3. مبادئ التصميم

### 3.1 المهمة أولًا

- يظهر الفعل الأساسي قبل التخصيص المتقدم.
- model picker مهم لكنه لا يسبق composer أو هدف المهمة بصريًا.
- Agent Builder يكشف التعقيد تدريجيًا.
- Flow canvas يركز على مسار التنفيذ لا مكتبة عقد ضخمة مفتوحة دائمًا.

### 3.2 الدليل بجوار الادعاء

- citation قرب النص الذي يدعمه.
- model/payer/cost في تفاصيل response وrun.
- permission/risk قرب أداة التنفيذ.
- warning يشرح الأثر وفعل recovery.

### 3.3 كثافة دلالية لا ازدحام

- lists/tables للأسطح التشغيلية المتكررة.
- cards فقط للوحدات المستقلة أو خيارات البداية.
- whitespace يجمع ويفصل؛ لا يستخدم لترك فراغات استعراضية.
- التفاصيل الثانوية تظهر عند hover/focus/expand أو inspector.

### 3.4 الثقة بلا تعطيل

- الحالات عالية المخاطر بارزة؛ المنخفضة لا تتحول إلى confirmation fatigue.
- تقدير التكلفة هادئ قبل التشغيل، واضح عند اقتراب الحد.
- Demo وMock موسومان بصدق دون watermark مزعج.

### 3.5 النظام قبل التزيين

- token قبل قيمة خام.
- component variant قبل نسخ markup.
- state pattern قبل تخصيص صفحة.
- نفس الحالة تستخدم نفس اللغة واللون والرمز عبر الوحدات.

---

## 4. الهوية والعلامة

### 4.1 الاسم

- العربية: **نَسَق** بالتشكيل في الشعار والعناوين التسويقية المختارة.
- داخل UI الضيق: **نسق** بلا إلزام التشكيل.
- الإنجليزية: **Nasaq AI**.
- لا تكتب `NASAQ.AI` باستمرار؛ uppercase يستخدم فقط في metadata صغيرة.

### 4.2 فكرة العلامة

خطّان أو أكثر يتحركان من مدخلات منفصلة إلى عقدة تنظيم ثم إلى مخرجات متعددة. يجب أن تبدو كـ**مسارات عمل** لا molecule أو neural network.

### 4.3 استخدام العلامة

- Full lockup في marketing وauth.
- mark فقط في sidebar المطوي وfavicon.
- monochrome mandatory.
- clear space يساوي نصف قطر العقدة المركزية على الأقل.
- لا glow أو دوران أو pulse دائم.

### 4.4 العبارة

> كل نماذجك ووكلائك وتدفقاتك، في مساحة عمل واحدة.

النسخة الإنجليزية المقترحة:

> Your models, agents, and flows — in one workspace.

---

## 5. الألوان

### 5.1 لوحة Light الأساسية

| Token | القيمة | الاستخدام |
|---|---:|---|
| `--color-bg` | `#F3F1EB` | خلفية التطبيق العامة |
| `--color-surface` | `#FFFDF8` | السطح الأساسي |
| `--color-surface-subtle` | `#F8F7F2` | أقسام/صفوف هادئة |
| `--color-surface-raised` | `#FFFFFF` | popover/dialog فقط |
| `--color-text` | `#17201B` | النص الأساسي |
| `--color-text-muted` | `#5C6A62` | النص الثانوي؛ contrast 5.59:1 على surface |
| `--color-text-faint` | `#78837C` | metadata كبيرة نسبيًا، لا نص صغير حرج |
| `--color-border` | `#D8DED9` | الحدود الافتراضية |
| `--color-border-strong` | `#B7C2BB` | حدود controls/selected |
| `--color-forest` | `#123B2F` | brand ink، sidebar، primary dark |
| `--color-forest-hover` | `#0D3026` | hover |
| `--color-teal` | `#08765A` | روابط وفعل أساسي؛ أبيض عليه 5.60:1 |
| `--color-teal-hover` | `#065E48` | hover/pressed |
| `--color-teal-subtle` | `#E5F3ED` | selected/info-success surface |
| `--color-amber` | `#D58B43` | الانتباه والموافقة |
| `--color-amber-subtle` | `#FBF0E4` | warning/approval background |
| `--color-danger` | `#B53A35` | destructive/error؛ أبيض عليه 5.80:1 |
| `--color-danger-subtle` | `#FBEAE8` | error background |
| `--color-info` | `#28667A` | معلومات system/degraded |
| `--color-info-subtle` | `#E8F2F5` | info background |
| `--color-success` | `#237451` | completed/healthy |
| `--color-success-subtle` | `#E7F4EC` | success background |
| `--color-focus` | `#C8791F` | focus ring مع offset واضح |

### 5.2 لوحة Dark

| Token | القيمة |
|---|---:|
| `--color-bg` | `#0E1512` |
| `--color-surface` | `#151E1A` |
| `--color-surface-subtle` | `#1B2722` |
| `--color-surface-raised` | `#202D27` |
| `--color-text` | `#F2F5F1` |
| `--color-text-muted` | `#AEBAB3` |
| `--color-text-faint` | `#89968E` |
| `--color-border` | `#33443C` |
| `--color-border-strong` | `#52665C` |
| `--color-primary` | `#55C49B` |
| `--color-primary-hover` | `#73D3AF` |
| `--color-primary-subtle` | `#193A2F` |
| `--color-warning` | `#E5A45F` |
| `--color-danger` | `#F07C74` |
| `--color-info` | `#72B5C9` |
| `--color-success` | `#68C998` |
| `--color-focus` | `#FFB45D` |

Dark mode جزء من الـPrototype بعد اكتمال Light؛ لا يُنشأ بقيم invert آلية.

### 5.3 قواعد دلالية

- teal = action/selection، لا كل decoration.
- amber = needs attention/approval/warning، لا success.
- red = error/destructive فقط.
- green = completed/healthy، مع text/icon.
- blue = information/degraded/connecting.
- gray = inactive/neutral، لا permission denied وحده.
- model providers لا يفرضون ألوانهم على هيكل الصفحة؛ يمكن استخدام mark صغير موثق.

### 5.4 contrast

- body text: 4.5:1 على الأقل.
- large text: 3:1 على الأقل.
- non-text controls/focus/borders اللازمة: 3:1.
- لا يستخدم `text-faint` لنص أقل من 14px أو معلومة لازمة.
- كل token pair يخضع لفحص آلي ويدوي في Light وDark.

---

## 6. Typography

### 6.1 العائلة

**الخيار الأول القابل للتضمين:**

```css
--font-sans-ar: "IBM Plex Sans Arabic", Tahoma, Arial, sans-serif;
--font-sans-latin: "IBM Plex Sans", "Segoe UI", Arial, sans-serif;
--font-mono: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;
```

- تُضمّن ملفات الخط محليًا مع الرخصة؛ لا يعتمد الإنتاج على CDN.
- إذا لم تُضمّن بعد، يستخدم fallback دون تغيير metrics كارثي.
- code/IDs/model slugs لاتجاه LTR مع `unicode-bidi: isolate`.

### 6.2 المقياس

| Token | الحجم/line-height | الاستخدام |
|---|---|---|
| `text-2xs` | `11/16` | metadata غير حرجة |
| `text-xs` | `12/18` | labels، timestamps |
| `text-sm` | `13/20` | dense UI، tables |
| `text-base` | `15/24` | UI/body الافتراضي |
| `text-md` | `17/28` | lead داخل التطبيق |
| `text-lg` | `20/30` | section title |
| `text-xl` | `24/36` | page title |
| `text-2xl` | `30/44` | marketing subhead |
| `text-3xl` | `38/52` | marketing heading |
| `text-4xl` | `52/66` | hero desktop فقط |

العربية تحتاج line-height أوسع من Latin؛ الأرقام السابقة baseline وتفحص بصريًا على الخط الفعلي.

### 6.3 الأوزان

- 400: body.
- 500: controls وmetadata المهمة.
- 600: headings داخل التطبيق.
- 700: marketing emphasis محدود.
- لا يستخدم 800/900 في body أو عناوين عربية طويلة.

### 6.4 الأرقام

- usage/cost/tables تستخدم `font-variant-numeric: tabular-nums`.
- العملة والرقم يعزلان bidi.
- لا تخلط الأرقام العربية واللاتينية داخل الرقم نفسه.
- preference تحدد الشكل، بينما القيمة semantically واحدة.

---

## 7. Spacing, Size & Density

### 7.1 مقياس 4px

```text
0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
```

لا تضاف قيمة جديدة قبل إثبات أنها لا يمكن تكوينها من المقياس.

### 7.2 ارتفاعات controls

| النوع | Desktop | Mobile |
|---|---:|---:|
| compact | 28px | 36px |
| default | 36px | 44px |
| prominent | 44px | 48px |
| icon-only | 36×36 | 44×44 target |

### 7.3 الكثافة

- default داخل التطبيق: compact-comfortable.
- الجداول والقوائم المتكررة: 40–44px row minimum حسب المحتوى.
- marketing: مسافات أكبر، لكن دون أقسام فارغة طويلة.
- خيار density للمستخدم P1؛ ليس سببًا لبناء مكونات منفصلة.

---

## 8. Radius, Borders & Elevation

### 8.1 Radius

| Token | القيمة | الاستخدام |
|---|---:|---|
| `radius-xs` | `3px` | code/tag صغير |
| `radius-sm` | `5px` | buttons/inputs |
| `radius-md` | `8px` | panels/cards |
| `radius-lg` | `12px` | dialogs/sheets |
| `radius-full` | `999px` | avatars/status dots/pills فقط |

لا تستخدم 20–32px لكل panel؛ المنتج أداة لا لعبة.

### 8.2 Borders

- 1px default.
- selected state: border قوي + subtle background، لا 2px يغير layout.
- section separation يفضل line أو spacing قبل shadow.

### 8.3 Elevation

| المستوى | الاستخدام |
|---|---|
| `0` | معظم الصفحة والpanels |
| `1` | sticky composer/header عند التداخل |
| `2` | popover/menu |
| `3` | dialog/sheet |

الظل neutral-green منخفض alpha؛ لا glow ملون.

---

## 9. شبكة التخطيط

### 9.1 Breakpoints

```text
sm  640px
md  768px
lg  1024px
xl  1280px
2xl 1536px
```

التصميم content-driven؛ breakpoint يتغير إذا انكسر المحتوى قبل الرقم.

### 9.2 App Shell

| العنصر | القياس |
|---|---:|
| Sidebar مفتوح | `248px` |
| Sidebar مطوي | `68px` |
| Topbar | `56px` |
| Context/project bar | `44px` عند الحاجة |
| Inspector | `320–384px` |
| Artifact panel | `360–520px` |
| Page max للعمل العام | `1440px` مع gutters |
| Reading max | `760px` |
| Chat content max | `880px` |
| Marketing content max | `1200px` |

### 9.3 Page anatomy

```text
Page header
  ├── eyebrow/context optional
  ├── title + concise description
  ├── primary action
  └── contextual actions
Filter/action rail (when needed)
Main content
Contextual inspector/aside (only when useful)
```

- لا يوضع hero تسويقي داخل التطبيق.
- page title لا يتجاوز سطرين.
- primary action واحد؛ الأفعال الأخرى secondary/menu.

---

## 10. التنقل

### Sidebar

- sections بحسب Sitemap.
- icon + label؛ tooltip عند الطي.
- active marker: 3px inline bar + weight/background subtle.
- badges للأرقام ذات الإجراء فقط، مثل approvals؛ لا badges زخرفية.
- workspace switcher أعلى، usage/settings أسفل.

### Topbar

- breadcrumb/context في جهة البداية المنطقية.
- command search في الوسط أو trigger مرن.
- run status، notifications، account في جهة النهاية.
- لا يكرر sidebar navigation.

### Mobile

- bottom nav من خمسة عناصر.
- More sheet منظم بعناوين.
- topbar يركز على back/context/action واحد.
- safe-area insets mandatory.

---

## 11. الأيقونات

- مجموعة أساسية: Lucide أو مجموعة stroke موحدة مرخصة.
- stroke غالبًا `1.75px` عند 20–24px.
- أحجام: 14، 16، 18، 20، 24.
- icon-only يحتاج accessible name وtooltip على desktop.
- لا emoji كأيقونة نظام.
- provider logos أصل موثق ولا يعاد رسمه اعتباطيًا.

### 11.1 Mirroring في RTL

**يعكس:** back/forward، undo/redo المكاني، indent/outdent، مسار تقدم أفقي، send arrow إذا كان اتجاهيًا فعلًا.

**لا يعكس:** search، plus، settings، play/pause، download/upload، logos، check، external link غالبًا.

يحدد كل icon directional metadata بدل `transform: scaleX(-1)` العام.

---

## 12. الأزرار والإجراءات

### الأنواع

| Variant | الاستخدام |
|---|---|
| `primary` | الفعل الأساسي الواحد في السطح |
| `secondary` | فعل مهم غير أساسي |
| `quiet` | أدوات سياقية متكررة |
| `outline` | بديل/إلغاء ذو وزن متوسط |
| `danger` | تنفيذ destructive فقط |
| `link` | انتقال نصي وليس إجراءً شبيهًا بالزر |

### الحالات

`default · hover · active · focus-visible · disabled · loading · success transient`

- loading يحافظ على العرض ويعرض نصًا مفهومًا عند طول العملية.
- disabled يحتاج سببًا عند عدم الوضوح؛ tooltip/help لا `title` فقط.
- لا تستخدم primary مرتين في dialog واحد.
- زر approve لا يلون أخضر دائمًا إذا كان الفعل نفسه خطرًا؛ لون المخاطر يتبع الأثر.

---

## 13. النماذج والإدخال

- label دائم فوق الحقل؛ placeholder مثال لا label.
- description قبل الخطأ؛ error مرتبط بـ`aria-describedby`.
- validation عند blur/submit، لا ضوضاء حمراء أثناء أول حرف.
- dirty/saving/saved status واضح في builders.
- secret input يمنع copy reveal غير المقصود، ولا يعيد القيمة بعد الحفظ.
- JSON/code editor LTR مستقل مع lint، ولا يستخدم textarea عاديًا للإنتاج لاحقًا.
- multi-select يعرض أهم العناصر وعدد البقية دون ارتفاع غير محدود.

### Composer

- auto-grow بحد أقصى ثم scroll داخلي.
- attachments كصف مستقل قابل للوصول.
- model/payer/cost options قرب الإرسال لكن secondary.
- send وstop في الموضع نفسه لمنع الحركة.
- keyboard: Enter يرسل وShift+Enter سطر جديد، مع preference وإعلان واضح.

---

## 14. القوائم والجداول والبطاقات

### Lists

الخيار الافتراضي لـProjects/Runs/Agents/Flows/Knowledge. تتضمن:

- اسم ووصف محدود.
- status وowner/updated.
- cost أو scope عندما يلزم.
- quick action واحد + overflow.

### Tables

تستخدم للاستخدام والفواتير والسجل والأعضاء عندما المقارنة عبر الأعمدة مهمة.

- header sticky عند الطول.
- ترتيب وفرز accessible.
- horizontal overflow مع تثبيت عمود الهوية إذا لزم.
- mobile يتحول إلى list structured، لا table مكسورة.

### Cards

تستخدم لـ:

- templates.
- plans/pricing.
- independent artifacts.
- onboarding choices.

لا تستخدم لكل row أو setting.

---

## 15. حالات الحالة Status

### الشكل

- status dot/icon + label.
- pill فقط عند الحاجة إلى فصل قوي داخل جدول.
- النص يصف النتيجة: «ينتظر موافقتك»، لا «Pending» فقط.

### الخريطة

| الحالة | اللون | الرمز/النمط |
|---|---|---|
| queued | neutral/info | clock |
| connecting/running | info/teal | spinner أو progress، يحترم reduced motion |
| waiting input | amber | question/message |
| waiting approval | amber أقوى | shield/check request |
| completed | success | check |
| completed with warnings | amber | check + warning |
| failed | danger | alert |
| cancelled | neutral | stop |
| paused | neutral/info | pause |
| degraded | info/amber حسب الأثر | status icon |

---

## 16. Chat visual grammar

### الرسائل

- response المساعد ليس bubble ضخمة؛ يظهر ككتلة محتوى في مسار القراءة.
- رسالة المستخدم يمكن أن تكون سطحًا subtle محدود العرض لتمييز المدخل.
- أسماء النماذج metadata صغيرة؛ لا avatar روبوت متكرر.
- markdown مضبوط: headings أصغر من page title، tables scroll، code LTR، citations inline.
- tool/system events collapsed rows داخل timeline، لا رسائل محادثة مزيفة.

### Citations

- marker قصير بعد الادعاء.
- hover/focus preview مع title/domain/locator.
- Sources panel يعرض كل مصدر وحالته.
- broken source لا يختفي؛ يظهر unavailable.

### Compare

- desktop: أعمدة متساوية مع header sticky لكل نموذج.
- لا horizontal scroll لأكثر من ثلاثة؛ الحد 3 في المنتج الأول.
- mobile: tabs مع summary bar ثابت يوضح التقدم والتكلفة.
- الاختيار يستخدم border/icon/label، لا green glow.

---

## 17. Agent visual grammar

### Agent Card/List row

يعرض:

- الاسم والغرض.
- tools count/risk.
- model policy.
- آخر تشغيل وحالته.
- scope: شخصي/مشروع/فريق.

### Builder

- navigation مرحلي: الأساس، النموذج، المعرفة، الأدوات، الموافقات، الاختبار.
- summary rail يعرض validation/budget/risk دائمًا.
- advanced settings collapsed مع search/help.
- unsaved indicator نصي.

### Run timeline

- خط عمودي/مسار دلالي، وليس فقاعات chat.
- كل step: status، عنوان، duration، tool/model، cost عند الحاجة.
- التفاصيل collapsed؛ errors expanded تلقائيًا بقدر مناسب.
- current step واضح دون pulse دائم.
- plan changes تسجل كحدث، لا تعدل الماضي بصمت.

### Approval card

- شريط amber/red بحسب الخطر.
- يبدأ بالفعل والهدف، ثم البيانات/النطاق والتكلفة.
- preview قبل الأزرار.
- approve/deny/edit بترتيب منطقي، وfocus لا يبدأ على approve الخطر تلقائيًا.

---

## 18. Flow visual grammar

### Canvas

- خلفية surface بنقاط/شبكة subtle جدًا؛ لا sci-fi grid.
- connections 2px، active path teal، error red، inactive border gray.
- minimap monochrome وظيفية.
- selection لا تعتمد على glow.

### Nodes

```text
Header: type icon + name + status
Body: essential config/summary only
Ports: typed and labeled where ambiguity exists
Footer: cost/model/tool/risk metadata
```

- أنواع العقد تتميز بأيقونة/label وشريط صغير، لا rainbow كاملة.
- width baseline 240–280px.
- error يظهر على node وفي validation list.
- port target لا يقل عن مساحة لمس قابلة للاستخدام حتى إذا كانت العلامة أصغر.

### Inspector

- يتبع selection.
- sections قابلة للطي دون nesting عميق.
- validation inline + summary عام.
- mobile يتحول إلى full-height sheet/page.

### البديل البنيوي

قائمة مرتبة للعقد والاتصالات والحالات متاحة للوحة المفاتيح وقارئ الشاشة. لا يُعد canvas وحده واجهة مكتملة.

---

## 19. Knowledge visual grammar

- collections كقائمة hierarchy بسيطة.
- source status هو أهم metadata بعد الاسم.
- processing لا يعرض نسبة إذا لم تكن حقيقية؛ يعرض stage.
- retrieval test يفصل query، retrieved passages، metadata، والسبب/score إذا كان موثوقًا.
- source preview يحافظ على locator ويبرز النص المسترجع دون تزوير الأصل.

---

## 20. Usage & Billing visual grammar

- الرقم الأساسي + الفترة + مقارنة مفهومة، لا صف من vanity metrics.
- chart واحد رئيسي لكل سؤال.
- legend مباشر وقابل للوحة المفاتيح.
- BYOK وPlatform credits منفصلان بصريًا ونصيًا.
- estimate خط متقطع/label؛ actual خط/قيمة ثابتة؛ adjustment حدث مستقل.
- اللون لا يساوي provider؛ يستخدم provider mark/label عند الحاجة.

### الرسوم

- line/area للزمن.
- stacked bars لمصدر الدفع/النموذج إذا كانت المقارنة هي السؤال.
- horizontal bars للترتيب.
- لا pie بأكثر من خمس فئات.
- table بديل لكل chart.

---

## 21. Overlays

### Popover

خيارات سريعة، model picker المختصر، filter. يغلق بـEscape ويعيد focus.

### Drawer/Sheet

تفاصيل sources/artifacts/settings على desktop، ويتحول إلى page/sheet على mobile.

### Dialog

قرار صغير محدد فقط؛ لا form متعدد الأقسام داخل modal ضيق.

### Alert dialog

destructive أو irreversible. يذكر الكيان والأثر ولا يستخدم copy عام «هل أنت متأكد؟» فقط.

### قواعد

- nesting dialog فوق dialog ممنوع غالبًا.
- URL يتغير للسطح القابل للمشاركة أو العودة.
- focus trap، inert background، scroll lock، restore focus.

---

## 22. Feedback & Notifications

### Toast

- نجاح بسيط قابل للعكس أو إشعار غير حرج.
- 1–2 سطر، فعل واحد.
- لا يستخدم لخطأ يحتاج إصلاحًا داخل form أو run.
- لا يختفي critical message تلقائيًا.

### Inline banner

- provider degraded، offline، quota، policy.
- مرتبط بالسطح المتأثر.
- يشرح scope والزمن/الحالة إن توفرت.

### Notification center

- grouping حسب run/resource.
- unread ليس لونًا فقط.
- sensitive content redacted في preview.

---

## 23. الحركة

### مدد

| Token | المدة | الاستخدام |
|---|---:|---|
| `motion-instant` | `0ms` | reduced motion/critical response |
| `motion-fast` | `120ms` | hover، small state |
| `motion-base` | `180ms` | popover، tab، small panel |
| `motion-slow` | `240ms` | drawer/dialog |
| `motion-layout` | `280ms` max | panel resize/large transition |

### Curves

```css
--ease-out: cubic-bezier(.16, 1, .3, 1);
--ease-in-out: cubic-bezier(.65, 0, .35, 1);
```

### قواعد

- transform/opacity أولًا؛ تجنب animation layout المكلف.
- drag في Flow يمكن أن يستخدم spring خفيف بلا bounce زخرفي.
- streaming cursor لا يومض بسرعة مزعجة.
- progress المستمر يتوقف/يبسط مع reduced motion.
- لا stagger لأكثر من عدد صغير من العناصر.
- animation لا تؤخر ظهور action أو error.

---

## 24. Loading, Empty & Error

### Loading

- skeleton فقط عندما نعرف شكل المحتوى.
- spinner للأمر المحلي القصير.
- stage text للعمليات الطويلة.
- لا skeleton يشبه بيانات فعلية حساسة.

### Empty

يتضمن:

1. ما هذا السطح؟
2. لماذا هو فارغ؟
3. فعل أول واحد.
4. مثال/قالب فقط إذا يساعد المهمة.

لا illustration ضخمة عامة.

### Error

يتضمن:

- ماذا لم يكتمل.
- ما الذي حُفظ.
- recovery action.
- details/correlation ID عند الحاجة.

لا تعرض raw stack/provider payload.

---

## 25. اللغة ونبرة المحتوى

### النبرة

- مباشرة.
- مهنية.
- هادئة.
- لا anthropomorphism مبالغ: «الوكيل يحلل» مقبول؛ «أنا متحمس» غير مطلوب.
- لا وعود مطلقة.

### الأفعال

استخدم أفعالًا محددة:

- «ابدأ تشغيلًا» لا «انطلق».
- «أضف مصدرًا» لا «عزّز معرفتك».
- «راجع ووافق» لا «دع نَسَق يتولى الأمر».
- «قيد التسوية» لا «تقريبًا جاهز» في الفوترة.

### المصطلحات

| English | العربية |
|---|---|
| Workspace | مساحة العمل |
| Project | مشروع |
| Chat | محادثة / Chat عند الاسم التجاري |
| Agent | وكيل |
| Run | تشغيل |
| Flow | تدفق / Flow عند اسم الوحدة |
| Knowledge | المعرفة |
| Tool | أداة |
| Skill | مهارة |
| Approval | موافقة |
| Artifact | مخرج |
| Receipt | إيصال تنفيذ |
| Routing | توجيه |
| Credits | رصيد |
| Usage | استخدام/استهلاك حسب السياق |

`CONTENT.md` اللاحق يحدد الجمل الفعلية ونبرة الرسائل.

---

## 26. RTL وBidi

### قواعد CSS

- `dir` على root document.
- logical properties فقط افتراضيًا: `margin-inline`, `padding-block`, `inset-inline-start`.
- flex/grid order يتبع DOM منطقيًا؛ لا تعكس DOM بصريًا بصورة تكسر tab order.
- `text-align: start` لا left/right.
- code، IDs، URLs، emails وtimestamps المعقدة داخل `dir="ltr"` و`unicode-bidi:isolate`.

### النص المختلط

- user-generated text يستخدم `dir="auto"` حيث يلائم.
- punctuation والرقم/عملة ضمن wrappers معزولة.
- truncation يحافظ على الجزء الدال؛ file extension يمكن عزله.
- copy buttons لا تغير النص.

### الرسوم والمسارات

- timeline الزمني الرأسي لا يحتاج عكسًا.
- flow logic لا يعكس البيانات عند تبديل اللغة؛ يغير viewport/start side فقط وفق قرار UX.
- charts الزمنية يجب أن تظل chronology واضحة؛ الاتجاه يحدد صراحة في component spec.

---

## 27. الوصولية

### Keyboard

- skip link إلى main.
- tab order مطابق للقراءة.
- roving tabindex للقوائم/menus عند النمط المناسب.
- command palette وmodel picker وnode list تعمل بلوحة المفاتيح.
- Escape يغلق أعلى overlay فقط.
- shortcuts لا تتعارض مع الكتابة العربية والمتصفح؛ قابلة للاكتشاف والتعطيل.

### Screen reader

- landmarks: header/nav/main/aside.
- page title يتغير عند route.
- streaming لا يعلن كل token؛ يعلن البدء والحالة/الاكتمال ويتيح قراءة المحتوى طبيعيًا.
- run updates في live region polite مختصر.
- charts لها summary وtable.
- canvas له list/tree بديل.

### Focus

- ring 2px + offset 2px بتباين 3:1.
- لا إزالة outline دون بديل.
- بعد delete يعود focus لعنصر منطقي.
- بعد route client transition ينتقل إلى h1/main بحسب النمط.

### Touch/Zoom/Motion

- target فعلي 44px للأفعال الأساسية على mobile.
- 200% zoom لا يخفي actions.
- 400% لمسارات WCAG الحرجة حيث يلزم reflow.
- reduced motion.

---

## 28. Responsive behavior بحسب الوحدة

| الوحدة | Desktop | Tablet | Mobile |
|---|---|---|---|
| Chat | content + optional artifact panel | panel overlay | full-width + sheets |
| Compare | 2–3 columns | 2 columns/scroll controlled | tabs/stack |
| Project | tabs + overview grid restrained | tabs scroll | sections/list |
| Agent Builder | nav + form + summary rail | rail collapses | step pages |
| Agent Run | timeline + side panel | collapsible panel | tabs + sticky status |
| Flow Builder | canvas + inspector | inspector sheet | structural read/run only |
| Knowledge | split collection/source | collapsible split | list → page |
| Usage | chart + table | stacked | summary + list/table cards |
| Team | table | responsive table | member list |

---

## 29. Theme & Preferences

### Prototype

- Light default.
- Dark complete بعد تثبيت Light.
- System preference.
- Locale.
- reduced motion من النظام، مع override اختياري لاحقًا.
- density preference P1.

### قواعد

- theme switch لا يسبب flash؛ server/cookie preference.
- charts/code/editors تدعم theme نفسه.
- provider/brand images لها variants أو containers مناسبة.
- لا تخزن preference حساسة.

---

## 30. مكونات المجال الأساسية

يجب أن تكون domain components فوق primitives العامة:

```text
ModelBadge
ProviderMark
PayerBadge
CostEstimate
UsageAmount
BudgetMeter
StatusLabel
RunStatus
RunTimeline
RunStep
ApprovalRequest
ActionPreview
ArtifactCard
ArtifactViewer
CitationMarker
SourcePreview
AgentSummary
ToolPermission
RiskLabel
FlowNode
FlowPort
FlowValidationList
KnowledgeSourceStatus
CredentialStatus
DemoBadge
```

كل مكون يملك:

- anatomy.
- variants.
- states.
- accessibility contract.
- RTL behavior.
- responsive behavior.
- test cases.

---

## 31. Design tokens المقترحة

```text
color.*
typography.family.*
typography.size.*
typography.weight.*
space.*
size.control.*
radius.*
border.width.*
shadow.*
motion.duration.*
motion.easing.*
zIndex.*
layout.sidebar.*
layout.inspector.*
```

### قواعد token

1. primitive → semantic → component.
2. component token لا يشير إلى hex مباشرة إذا semantic مناسب.
3. لا اسم لوني في semantic مثل `buttonGreen`؛ استخدم `actionPrimaryBg`.
4. dark mode يعيد تعيين semantic، لا component واحدًا واحدًا.
5. tokens تصدر CSS variables وTypeScript types من مصدر واحد لاحقًا.

---

## 32. Layering وz-index

| Token | القيمة المرجعية |
|---|---:|
| base | 0 |
| sticky | 10 |
| dropdown | 30 |
| overlay | 40 |
| dialog | 50 |
| toast | 60 |
| critical system | 70 |

لا تستخدم أرقامًا عشوائية مثل `99999`. Portal ownership وnesting موثقان في primitives.

---

## 33. الصور والرسوم

- screenshots حقيقية/Prototype صادقة فقط.
- لا mock browser chrome مزيف إلا لشرح screenshot واضح.
- لا metrics أو logos أو testimonials مختلقة.
- illustrations إن استخدمت: خطوط ومسارات هندسية بسيطة مرتبطة بنَسَق.
- أي أصل خارجي يحفظ المصدر والترخيص وتاريخ الجلب في `assets/README.md` أو manifest.
- alt text يصف الغرض لا كل التفاصيل الزخرفية.

---

## 34. Anti-slop checklist

قبل اعتماد أي شاشة:

- [ ] هل hierarchy يوضح المهمة والفعل الأول؟
- [ ] هل استُخدمت cards لأن المحتوى مستقل فعلًا؟
- [ ] هل يمكن حذف زخرفة دون فقد معنى؟ احذفها.
- [ ] هل المحتوى واقعي ومتسق مع fixture story؟
- [ ] هل يوجد state حقيقي بدل dashboard دائمًا ممتلئ؟
- [ ] هل component موجود أُعيد استخدامه؟
- [ ] هل اللون دلالي؟
- [ ] هل radius/shadow مبرران؟
- [ ] هل النص يمكن أن يخص أي AI startup؟ أعد كتابته.
- [ ] هل السطح يعمل بالعربية الطويلة والنص المختلط؟
- [ ] هل keyboard/focus/error/permission/cost حالات فعلية؟
- [ ] هل screen كثيفة أو فارغة عمدًا لا نتيجة template؟

---

## 35. Design QA

### المقاسات المرجعية

- 360×800.
- 390×844.
- 768×1024.
- 1280×800.
- 1440×900.
- 1920×1080 للكثافة لا لتوسيع السطر بلا حد.

### matrix

- ar/light.
- en/light.
- ar/dark.
- en/dark.
- reduced motion.
- 200% zoom.
- keyboard.
- empty/loading/error/dense.
- owner/member/viewer.

### الأدلة

- screenshot لكل حالة حرجة.
- Playwright trace للفشل.
- axe/automated report.
- فحص يدوي للfocus وscreen reader.
- browser console/network.
- مقارنة قبل/بعد عند إصلاح regression.

---

## 36. بوابات الاعتماد

### Gate A — Foundation

- [ ] logo/wordmark اتجاه أولي.
- [ ] palette contrast.
- [ ] typography metrics بالعربية/الإنجليزية.
- [ ] spacing/radius/elevation.
- [ ] app shell grids.
- [ ] primitives الأساسية.

### Gate B — Core product

- [ ] Home/Projects/Chat/Compare.
- [ ] Model/Payer/Cost patterns.
- [ ] جميع states الأساسية.
- [ ] mobile/RTL/a11y.

### Gate C — Execution

- [ ] Agent Builder/Run/Approval/Artifact.
- [ ] Flow canvas + structural alternative.
- [ ] Knowledge processing/retrieval.

### Gate D — Admin & polish

- [ ] Usage/Billing/Team/Settings.
- [ ] Dark mode.
- [ ] visual regression.
- [ ] usability fixes.

---

## 37. القرار النهائي للتنفيذ

يبدأ الـFrontend من **system tokens + App Shell + domain status components**، لا من Landing hero ولا من صفحة Chat منعزلة. التسلسل:

1. tokens والخطوط والthemes.
2. primitives والوصولية.
3. App Shell والتنقل.
4. statuses/cost/model/permission components.
5. Home/Projects.
6. Chat/Compare.
7. Agents/Runs/Approvals.
8. Flow/Knowledge.
9. Usage/Team/Settings.
10. marketing مبني من النظام نفسه دون تحويله إلى dashboard.

بهذا يبقى شكل نَسَق متسقًا عندما تنتقل من محادثة بسيطة إلى تشغيل وكيل وتدفق معقد.
