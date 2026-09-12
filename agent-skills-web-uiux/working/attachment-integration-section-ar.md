## 15. دمج البحث المرفق: توسعة المجال والتدقيق التصحيحي

أُضيفت إلى هذا التقرير المادة المرفقة [`AI-Agent-Skills-Comprehensive-Guide-2026.md`](../sources/original/AI-Agent-Skills-Comprehensive-Guide-2026.md). لم تُنسخ ادعاءاتها آليًا؛ استُخدمت كـ**قائمة مرشحين**، ثم فُحصت عينة ممثلة من 21 مستودعًا إضافيًا عبر shallow clones، أشجار Git الفعلية، ملفات `SKILL.md`، الرخص، أسطح التنفيذ، وHEAD SHAs. كما شُغّل `skills-ref` على 35 ملفًا مختارًا: اجتاز 24 وفشل 11، وغالبية الفشل بسبب frontmatter خاص بعميل أو عدم تطابق الاسم والمجلد.

> **قاعدة الدمج:** «مذكور في دليل» لا يعني «موصى به». التصنيف أدناه يفرق بين مهارة قابلة للتثبيت، أداة أو framework مجاور، كتالوج اكتشاف، ومرشح مرفوض أمنيًا.

### 15.1 إضافات موصى بها للتصميم والحركة

#### Emil Kowalski Skills — أفضل إضافة متخصصة للحركة

- **الرابط:** [emilkowalski/skills](https://github.com/emilkowalski/skills)
- **اللقطة المدققة:** 12 مهارة، MIT، HEAD `d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7` بتاريخ 21 أغسطس 2026.
- **الأبرز:** `emil-design-eng`، `animate`، `animate-expo`، `review-animations`، `improve-animations`، `find-animation-opportunities`، `animation-vocabulary`، `prototype` و`pick-ui-library`.
- **القيمة:** لا يبدأ من «أضف animation» بل يسأل هل ينبغي أن تتحرك الواجهة أصلًا، ثم يقرر الغرض وcurve والمدة والـinterruptibility. كما يميز بين تفاعل متكرر يجب أن يبقى فوريًا وبين لحظة نادرة يمكن أن تحمل delight.
- **نتيجة النقل:** اجتاز `animate` و`emil-design-eng` validator الصارم؛ فشلت بعض الأوامر المخصصة مثل `review-animations` بسبب `disable-model-invocation` الخاص بالـhost.
- **الحد:** ملف `emil-design-eng` نحو 675 سطرًا وله آراء قوية ومطلقة أحيانًا. استخدم مهارة فرعية واحدة للحركة بعد حسم IA والوصولية، ولا تجعل motion يغطي خطأً وظيفيًا أو يخرق `prefers-reduced-motion`.

**موضعه الصحيح في الحزمة:** مهارة ذوق أساسية واحدة → تنفيذ الحالات → **مهارة حركة واحدة من Emil** → Playwright وreduced-motion/performance. لا تشغّله كمنافس ثانٍ يعيد تصميم السطح كله.

### 15.2 بدائل anti-slop أضافها البحث المرفق

| المرشح | ما ثبت في التدقيق | النقل/التنفيذ | الحكم |
|---|---|---|---|
| [no-slop-ui](https://github.com/LeoStehlik/no-slop-ui) | مهارة رئيسية قصيرة (نحو 75 سطرًا) + banned patterns/palettes/checklist، MIT | اجتاز validator؛ التنفيذ الوحيد الظاهر validator محلي للمستودع | جيد كـguardrail محافظ للمنتجات الداخلية؛ حظره المطلق للخطوط والحركة والـradius ليس قاعدة عالمية، فاجعل design system أعلى منه |
| [unslop-ui-skill](https://github.com/claudiusararu/unslop-ui-skill) | مهارة `no-ai-slop` قصيرة + كتالوج يقارب 100 tell، MIT، بلا scripts | اجتاز validator | مرجع كشف خفيف؛ مناسب للمراجعة، لكنه لا يستبدل brief أو اختبار pixels |
| [avoid-ai-design](https://github.com/funboy322/avoid-ai-design) | أوضاع detect/rewrite، يفصل code-certain عن pixel/inferred، ويمنع استبدال cliché بآخر، MIT | instruction-only؛ فشل strict بسبب `version` أعلى | من أفضل إضافات المرفق مفهوميًا؛ شغله في detect أولًا ثم وافق على اتجاه واحد قبل rewrite |
| [anti-ui-slop في Awesome Copilot](https://github.com/github/awesome-copilot/tree/main/skills/anti-ui-slop) | router من 59 سطرًا إلى ستة playbooks، ومراجع UIZZE اختيارية؛ اجتاز validator | النسخة المجانية instruction-only؛ MCP التجاري اختياري | مفيد لمن يريد grounding بمراجع حقيقية، لكن راجع ترخيص الحزمة: frontmatter يقول MIT بينما `LICENSE` و`MANIFEST` المرفقان يشيران إلى Apache‑2.0 |
| [Vanszs/Anti-AI-UI](https://github.com/Vanszs/Anti-AI-UI) | ثلاث ملفات معلنة: فلتر، component reference، ونسخة UI UX Pro Max | لم يجتز أي من الملفات الثلاثة strict validation؛ اثنان بأسماء غير معيارية والثالث بلا frontmatter | لا أفضلية على upstream الأصلي؛ تجنب النسخ المركبة أو المتقادمة عندما يمكن تثبيت المصدر المباشر |
| [Rosmarinus…/anti-slop](https://github.com/Rosmarinusofficinalispoloneck995/anti-slop) | **لا يوجد `SKILL.md` في HEAD المدقق**؛ المستودع يوزع `assets/v2.4.zip` | الأرشيف يحوي `Application.bat` يشغّل `exbin.exe` مع ملف payload مشوش، وREADME يطلب تجاوز تحذير Windows | **مرفوض: لا تثبته ولا تشغله.** SHA‑256 للأرشيف المدقق: `066e141e9c7fe3433e15250c8a0f2d71677e60601d082dbb3b928b8ffb36ad46` |

النتيجة: يضيف البحث المرفق ثلاثة بدائل تعليمية نافعة (`no-slop-ui` و`no-ai-slop` و`avoid-ai-design`)، لكنه يؤكد أيضًا أن كلمة anti-slop ليست إشارة ثقة. افحص الشجرة قبل أي clone أو install، ولا تشغّل binary لأن README يقول إنه «طبيعي» أن يحذّر النظام منه.

### 15.3 Figma: جاهزية الملف مقابل التحكم الكامل

#### Agent Ready

- **الرابط:** [Owl-Listener/agent-ready](https://github.com/Owl-Listener/agent-ready)
- **المحتوى:** 13 فحصًا بأربع درجات أثر: descriptions/layer names/component props/Code Connect؛ ثم auto-layout/token binding/content/states؛ ثم coverage/naming/depth/pages؛ وأخيرًا accessibility annotations.
- منذ v0.3.0 يضم `shared/checks.js` و`shared/report.js` لتنفيذ checks على node tree خام وإصدار كتلة `@agent-ready-report` تسجل ما شوهد وما استُنتج ودرجة الثقة.
- **القيمة:** يحول سؤال «لماذا كود Figma رديء؟» إلى جودة ملف قابلة للفحص قبل لوم النموذج.
- **الحدود:** لا يوجد LICENSE جذري في اللقطة، و`version` أعلى جعل validator الصارم يرفضه. كما يعتمد أسماء أدوات Figma MCP محددة؛ تحقق من توافقها مع الخادم الفعلي. لذلك هو مرجع قوي أو تجربة داخلية، لا اعتماد مؤسسي بلا إذن ترخيص واضح.

#### Figma AI Bridge

- **الرابط:** [renfei-design/Figma-AI-Bridge](https://github.com/renfei-design/Figma-AI-Bridge)
- **المحتوى:** ست مهارات لـa11y/content/docs/slides/research/diagrams، مع Figma plugin + Node MCP server + WebSocket relay على المنفذ 3055، وعمليات read/create/edit/delete/export واسعة.
- **نتيجة العينة:** `a11y-audit` و`figma-doc` اجتازا validator، والمستودع MIT.
- **سطح التنفيذ:** `npm run setup` و`postinstall` يثبتان تبعيات server؛ الخادم والplugin يستطيعان الكتابة والحذف داخل ملف Figma. توجد أيضًا بقايا provenance: أوامر clone و`package.json.repository` تشير إلى مالك/اسم قديم مختلف عن URL الحالي.
- **الحكم:** استخدم [مهارات Figma الرسمية](https://github.com/figma/mcp-server-guide/tree/main/skills) أولًا. استخدم Bridge فقط إذا احتجت write automation غير المتاحة رسميًا، داخل ملف تجريبي وبـchannel محلي وصلاحيات محدودة وبعد مراجعة `plugin/` و`server/` وlockfile.

### 15.4 الاختبار والواجهات ثلاثية الأبعاد

#### TestDino Playwright Skill Guides

- **الرابط:** [testdino-hq/playwright-skill](https://github.com/testdino-hq/playwright-skill)
- **اللقطة:** ستة مداخل `SKILL.md` و70 guide معلنة لـcore/CI/CLI/POM/migration، MIT، HEAD `400e4256cd22669ad69c18d31d3e5541e4e1c2a3`.
- يغطي locators، auth، network mocking، visual regression، accessibility، traces، flaky tests، frameworks، CI، i18n وWebGL.
- اجتاز المدخل الجذري و`playwright-cli`؛ فشلت مجلدات مثل `core` و`ci` strict لأن `name` هو `playwright-core`/`playwright-ci` ولا يطابق اسم المجلد.
- **الحكم:** أبقِ [Microsoft Playwright CLI Skill](https://github.com/microsoft/playwright/tree/main/packages/playwright-core/src/tools/skills/playwright-cli) مرجع التشغيل الأول. استخدم TestDino كقاعدة وصفات أوسع بعد مطابقة إصدار Playwright، لا كدليل أن 70 وصفة كلها مناسبة لمشروعك.

تعذر استنساخ `testmu-ai/playwright-skill` المذكور في المرفق من URL العام في لقطة التدقيق؛ لذلك لم يُرقَّ إلى توصية. لا تخلط بين اسم شركة ظاهر في كتالوج وبين مستودع عام قابل للمراجعة.

#### Three.js Skills

- **الرابط:** [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills)
- عشر مهارات تعليمية صغيرة: fundamentals، geometry، materials، textures، lighting، animation، loaders، interaction، postprocessing وshaders.
- اجتازت عينات fundamentals/interaction/shaders validator ولا توجد scripts في الشجرة.
- **الحد:** لا يظهر LICENSE، والمصدر مجتمعي وليس مستودع Three.js الرسمي. استخدمه كفهرس تعلم، ثم تحقق من API في وثائق Three.js المطابقة للإصدار قبل التنفيذ.

### 15.5 مهارات بناء المهارات، البحث، والـprompt engineering

#### مهارات meta الرسمية

- [Anthropic `skill-creator`](https://github.com/anthropics/skills/tree/main/skills/skill-creator): ليس قالب كتابة فقط؛ يحوي scripts لتشغيل evals ومقارنة baseline وتجميع benchmark وتحسين description وتغليف skill. راجع scripts قبل تشغيلها.
- [Anthropic `mcp-builder`](https://github.com/anthropics/skills/tree/main/skills/mcp-builder): تصميم الأدوات، TypeScript/Python، transports، الاختبار والتقييم. استخدم معه مواصفة MCP ووثائق SDK الحية.
- **تصحيح:** `writing-skills` في لقطة الشجرة الحالية موجود داخل [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/writing-skills)، وليس داخل `anthropics/skills` كما ورد في المرفق.

#### Matt Pocock Skills

- **الرابط:** [mattpocock/skills](https://github.com/mattpocock/skills)
- **اللقطة:** 37 ملف `SKILL.md` فعليًا، MIT، HEAD `3cca18b368ae95cdbdebbff572ccafa662551015`.
- الإضافات المفيدة: `grill-with-docs` و`grill-me`، `research` بالمصادر الأولية، TDD، diagnosing bugs، domain modeling، codebase design، code review، specs/tickets/handoff.
- `research` و`tdd` و`writing-for-agents` اجتازت validator؛ `grill-me` الحالي router صغير ويستخدم `disable-model-invocation` الخاص بالـhost.
- **التصحيح:** لا يوجد `andrej-karpathy-skills` في الشجرة الحالية، ولا ينبغي نسبة Superpowers أو هذه الحزمة إلى Anthropic. كما أن `caveman` الذي كان في هذا المستودع أزيل وفق CHANGELOG لأنه كان duplicate تجريبيًا.

#### Prompt Architect وPromptfoo

- [Prompt Architect](https://github.com/ckelsoe/prompt-architect) مهارة MIT اجتازت validator، وتحوّل prompt مبهمًا باستخدام 31 framework في سبع فئات intent. قيمتها الكبرى هي الأسئلة والـplaceholders وعدم اختلاق حقائق المستخدم، لا أسماء الاختصارات نفسها.
- المثبّت npm يشغل `postinstall`; للحد الأدنى من الثقة اعرض `skills/prompt-architect/` وثبّت commit `6c7a2c7b5a15cbb918828c7878c226a592985702` بدل تشغيل installer عائم بلا مراجعة.
- [Promptfoo](https://github.com/promptfoo/promptfoo) **أداة eval/red-team مجاورة وليست Skill**: اختبارات prompts عبر providers، assertions، CI، واختبارات adversarial للوكلاء وRAG/MCP. نتائج eval متكررة أهم من اختيار CO‑STAR أو RISEN بالاسم.
- أطر CO‑STAR/RISEN/RACE/APE وغيرها مفيدة كذاكرة تنظيمية، لكنها ليست ضمانًا للجودة. لكل prompt إنتاجي عرّف: **المهمة، السياق، مدخلات موثوقة، قيود، عقد إخراج، أمثلة، حالات سلبية، واختبارات قبول**.
- لا تطلب من النموذج كشف «سلسلة تفكيره» الخاصة. اطلب **خلاصة أسباب، افتراضات، مصادر، خطوات تحقق وreceipts قابلة للمراجعة**. هذا أكثر قابلية للتدقيق وأقل اعتمادًا على سرد داخلي غير موثوق.

### 15.6 DevOps، البيانات، الأحداث، والأمان المضاف

| المجال | المصدر المضاف | لماذا يهم | حدود التشغيل |
|---|---|---|---|
| Terraform/OpenTofu | [antonbabenko/terraform-skill](https://github.com/antonbabenko/terraform-skill) | diagnose-first، version floors، state، plan artifact، rollback، CI، tests، ومنع destroy بلا preview/approval | اجتاز validator، Apache‑2.0؛ تشغيل plan/scanners/cloud يحتاج أسرارًا وsandbox وسياسة apply منفصلة |
| Neon | [neondatabase/agent-skills](https://github.com/neondatabase/agent-skills) | سبع مهارات source-of-truth للمنصة: Neon، Postgres، branches، egress، Object Storage، AI Gateway وFunctions | plugin الكامل يضيف Neon MCP وOAuth؛ ثبّت skill فقط إن لم تحتج إدارة حساب/موارد |
| Webhooks | [hookdeck/agent-skills](https://github.com/hookdeck/agent-skills) | ثلاث مهارات لـEvent Gateway وOutpost وrouter، مع verification/local replay/operations | الملفات الثلاثة اجتازت validator؛ المستودع يحوي أمثلة وتبعيات كثيرة، فلا تثبت الأمثلة كلها بلا حاجة |
| تدقيق أمني كامل | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) | recon → coverage-led hunting → fresh validation → structured findings → independent verification → report | قوي لكنه ثقيل ويتطلب subagents وNode validators وOS-enforced sandbox؛ إذا غابت الضوابط يجب إبقاء النتيجة `needs_validation` |
| خط أساس OWASP | [agamm/claude-code-owasp](https://github.com/agamm/claude-code-owasp) | OWASP Top 10:2025 وASVS 5.0 وLLM/agentic risks مع قاعدة source→sink→impact | اجتاز validator وMIT؛ checklist تعليمي، لا يعادل scanner أو threat model أو exploit validation |

**Cloudflare security-audit مقابل Trail of Bits:** الأول orchestrator تدقيق source-first كامل لمستودع واحد؛ الثاني صندوق أدوات أوسع لـCodeQL/Semgrep/differential/supply-chain ومجالات أمنية متعددة. يمكن جمعهما، لكن لا تعطِ كليهما صلاحية تنفيذ غير محدودة؛ اختر أداة التحليل داخل sandbox ثم مرر findings إلى تحقق مستقل.

### 15.7 المنصات والـframeworks ليست Skills

المرفق يجمع في قائمة واحدة ملفات `SKILL.md` ومنصات أتمتة وأطر بناء وكلاء. هذه طبقات مختلفة:

| الطبقة | أمثلة من المرفق | القرار الصحيح |
|---|---|---|
| **Agent Skill** | frontend-design، Terraform، Neon، Hookdeck، security-audit | تعليمات/مراجع تُحمّل عند المهمة؛ افحصها وثبّتها project-scoped |
| **MCP أو أداة** | Figma AI Bridge، Promptfoo، browser tooling | قدرة تنفيذ/قياس؛ تحتاج threat model وصلاحيات واتصالًا واضحًا |
| **Agent framework/runtime** | [LangGraph](https://github.com/langchain-ai/langgraph)، [CrewAI](https://github.com/crewAIInc/crewAI)، [Microsoft AutoGen](https://github.com/microsoft/autogen) | مكتبة تطبيق واعتماد runtime، لا «مهارة» تُسقط في مجلد؛ اخترها حسب state/durability/HITL/tool governance |
| **منصة مرئية** | [Dify](https://github.com/langgenius/dify)، [Langflow](https://github.com/langflow-ai/langflow)، [Flowise](https://github.com/FlowiseAI/Flowise) | نظام تشغيل/نشر له أسرار وبيانات وسياسات؛ قيّمه كمنتج كامل |
| **منصة automation** | [n8n](https://n8n.io)، [Zapier](https://zapier.com)، [Make](https://make.com)، [Activepieces](https://github.com/activepieces/activepieces) | اخترها لتكاملات workflow؛ المهارة الخاصة بها لا تمنح تلقائيًا أمان webhooks أو idempotency |
| **وكيل/منتج برمجة** | [OpenHands](https://github.com/All-Hands-AI/OpenHands)، [SWE-agent](https://github.com/princeton-nlp/SWE-agent)، [browser-use](https://github.com/browser-use/browser-use) | agent harness مستقل؛ قيّم sandbox، secrets، network، replay والـobservability |

لا يُنصح باختيار framework بحسب النجوم. للعمليات طويلة العمر اسأل عن durability وidempotency/resume؛ للعمليات الحساسة اسأل عن human approval وaudit trail؛ ولأي أداة لها side effects افصل read عن write وحدد budget وtimeout وkill switch.

### 15.8 الكتالوجات: للاكتشاف لا للتثبيت الجماعي

- [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) كتالوج links لا حزمة مهارات؛ الشجرة المدققة تحوي أربعة ملفات فقط ولا تحوي `SKILL.md`. يعلن README الحالي 1497+ إدخالًا، لكن كل مصدر يحتاج تدقيقًا مستقلًا.
- [github/awesome-copilot](https://github.com/github/awesome-copilot) يحوي 435 ملف `SKILL.md` في لقطة الشجرة إضافة إلى agents/extensions/hooks. الرخصة والأمان والـportability تختلف لكل مجلد؛ استخدم exact path ولا تثبّت الكتالوج كله.
- [skills.sh](https://www.skills.sh/docs) دليل ومثبّت؛ عدد installations يقيس adoption عبر CLI، لا uniqueness أو جودة أو أمان.
- المستودعات الكبيرة الأخرى المذكورة في المرفق (`alirezarezvani/claude-skills`، toolkits، وسلال Antigravity) تبقى **مصادر اكتشاف** إلى أن يُفحص skill المقصود وSHA والرخصة وسطح التنفيذ.
- [Caveman](https://github.com/JuliusBrussee/caveman) ليس مجرد prompt لتقليل الكلمات: الشجرة المدققة كبيرة (نحو 1388 ملفًا و24 مدخل `SKILL.md`) ولها MIT + BSL وأدوات wrapping/telemetry/optimization؛ لا تدخله لمجرد claim عن خفض tokens دون benchmark خاص بك ومراجعة التنفيذ.
- [Graphify](https://github.com/safishamsi/graphify) أداة لفهم codebase graph، ولا تحوي `SKILL.md` في HEAD المدقق؛ تعامل معها كمنتج مجاور لا كمهارة محمولة.

### 15.9 أهم تصحيحات التعارض مع المرفق

| ما ورد أو فُهم من المرفق | الحالة بعد الدمج المدقق |
|---|---|
| رابط Anthropic `.../tree/main/frontend-design` | المسار الحالي الصحيح هو [`skills/frontend-design`](https://github.com/anthropics/skills/tree/main/skills/frontend-design) |
| Impeccable لديه 59 قاعدة | README في اللقطة المدققة يعلن **61** قاعدة detector |
| Hallmark لديه 57 gate | الإعلان ما زال 57 في موضع، لكن عقد `SKILL.md` الحالي يطلب **58/58**؛ سُجل ذلك كdocumentation drift |
| UI UX Pro Max: 161 قاعدة و9 stacks | اللقطة الحالية في التقرير: 119 UX guideline و22 stack، مع مخازن أخرى منفصلة؛ لا تخلط المقاييس |
| `next-best-practices` القديمة خيار Full-stack | المستودع القديم يعلن الإزالة؛ استخدم docs المضمنة المطابقة لإصدار Next.js وskills الحالية في `vercel/next.js` |
| Superpowers مكتبة Anthropic عامة | خطأ نسبة؛ الناشر `obra`، والمستودع MIT ومستقل |
| `writing-skills` من Anthropic | موجودة حاليًا في Superpowers؛ `skill-creator` و`mcp-builder` هما إضافتا Anthropic المثبتتان في الشجرة المدققة |
| `andrej-karpathy-skills` ضمن Matt Pocock | لا يوجد بهذا الاسم في HEAD الحالي؛ لا يُنصح بأمر تثبيته المذكور بلا مصدر مطابق |
| حزم TestMu العامة المذكورة | `testmu-ai/playwright-skill` لم يكن قابلاً للاستنساخ من URL المذكور؛ بقي خارج التوصيات |
| `firebase/skills` | المستودع الرسمي المدقق هو [`firebase/agent-skills`](https://github.com/firebase/agent-skills) |
| كل أسماء LangChain/CrewAI/n8n/AutoGPT «مهارات» | هي frameworks أو منصات أو منتجات؛ لا تتبع عقد `SKILL.md` بالضرورة |
| clone إلى user/global كإعداد افتراضي | الأصل project scope + preview + commit SHA؛ global استثناء واعٍ بعد المراجعة |
| النجوم والتركيبات تقيس الأفضلية | أرقام زمنية وقابلة للتضخم، وبعض أرقام المرفق قديمة أو تختلط فيها النجوم مع installations؛ لا تُستخدم كscore |
| اطلب Chain-of-Thought لتحسين المنطق | اطلب نتيجة قابلة للتحقق، أسبابًا موجزة وافتراضات ومصادر واختبارات؛ لا تعتمد على كشف reasoning داخلي |
| `Rosmarinus…/anti-slop` مهارة 36 قاعدة | HEAD المدقق بلا `SKILL.md` ويحتوي binary/payload مشوشًا؛ استُبعد أمنيًا |

### 15.10 لقطة المستودعات الجديدة المدققة

| المستودع | HEAD المدقق | تاريخ HEAD | ملفات skill الفعلية | الرخصة الظاهرة | الخلاصة |
|---|---|---:|---:|---|---|
| `emilkowalski/skills` | `d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7` | 2026-08-21 | 12 | MIT | موصى به للحركة، انتقائيًا |
| `LeoStehlik/no-slop-ui` | `3c8f9e5ef5ca18f5632f7b9ad8f95e2d68188bcf` | 2026-08-31 | 1 | MIT | guardrail محافظ؛ اجتاز validator |
| `claudiusararu/unslop-ui-skill` | `f954aaf0d21c47d66bfc318b1aab904cf650c109` | 2026-06-28 | 1 | MIT | كتالوج tells خفيف؛ اجتاز |
| `funboy322/avoid-ai-design` | `8337060636a8cf12e32e883eb367becd702aa526` | 2026-06-18 | 1 | MIT | جيد مفهوميًا؛ `version` غير strict |
| `github/awesome-copilot` | `7568a482ce2df38f8965ab5336a3220db796a4ba` | 2026-09-09 | 435 | حسب المجلد | `anti-ui-slop` اجتاز؛ راجع تعارض الرخصة داخله |
| `Owl-Listener/agent-ready` | `84ae3cd15de7c89b34cc72270dc4af049af79028` | 2026-05-13 | 1 | غير ظاهر | 13 check مفيدة؛ ترخيص وfrontmatter يحتاجان حلًا |
| `renfei-design/Figma-AI-Bridge` | `9570c3c48977406559fd2293d059cd03d9b215c0` | 2026-02-28 | 6 | MIT | قوي وعالي الصلاحيات؛ الرسمي أولًا |
| `testdino-hq/playwright-skill` | `400e4256cd22669ad69c18d31d3e5541e4e1c2a3` | 2026-09-06 | 6 | MIT | مرجع مكمل؛ portability مختلطة |
| `CloudAI-X/threejs-skills` | `b1c623076c661fc9b03dac19292e825a5d106823` | 2026-01-20 | 10 | غير ظاهر | عينات portable؛ تحقق من docs والرخصة |
| `mattpocock/skills` | `3cca18b368ae95cdbdebbff572ccafa662551015` | 2026-09-04 | 37 | MIT | toolbox هندسي بديل؛ ثبّت انتقائيًا |
| `ckelsoe/prompt-architect` | `6c7a2c7b5a15cbb918828c7878c226a592985702` | 2026-07-24 | 1 | MIT | اجتاز؛ تجنب postinstall العائم |
| `antonbabenko/terraform-skill` | `0a3a4a66e99001347d36a41e10260a825be3ab62` | 2026-07-03 | 1 | Apache‑2.0 | موصى به مع ضوابط IaC |
| `neondatabase/agent-skills` | `2e0da3a1653bcdd227565ac14bb3e9e453a8b854` | 2026-09-04 | 7 مصدرية/15 مع النسخ | Apache‑2.0 | رسمي؛ مهارات العينة اجتازت |
| `hookdeck/agent-skills` | `fb16bab9e6b8255c32d10dea9ca12690c435d682` | 2026-08-19 | 3 | MIT | رسمي للwebhooks؛ الثلاث اجتازت |
| `cloudflare/security-audit-skill` | `d24bc269171a9171fac58493e0ffba511d571a4a` | 2026-09-10 | 1 | MIT | ترشيح قوي للتدقيق الكامل؛ اجتاز |
| `agamm/claude-code-owasp` | `bfaf257b2859986a6a84d2b7491e1fab2218cd53` | 2026-07-27 | 1 | MIT | baseline تعليمي؛ اجتاز |
| `Vanszs/Anti-AI-UI` | `fd2a142e52e0f33002bb3c9cf966f0e878d31dfa` | 2026-06-19 | 3 | MIT | 0/3 strict؛ upstream أفضل |
| `VoltAgent/awesome-agent-skills` | `8873794bcb26ff5dcf9cd518c87cf5638ca44b92` | 2026-09-07 | 0 | MIT | كتالوج روابط فقط |
| `Rosmarinus…/anti-slop` | `6627175c60588d8c43943b9d872c37baed824891` | 2026-09-10 | 0 | MIT ظاهر | **مرفوض أمنيًا؛ لا تشغّل الأرشيف** |

### 15.11 خلاصة الدمج

أقوى ما أضافه البحث المرفق إلى الحزمة السابقة هو:

1. **Emil Skills** كطبقة حركة وصقل متخصصة.
2. **no-slop-ui / unslop / avoid-ai-design** كخيارات مراجعة خفيفة بدل إضافة نظام شامل دائمًا.
3. **Agent Ready** كمفهوم عملي لجودة Figma قبل code generation، مع تحفظ الترخيص.
4. **TestDino** كمرجع Playwright موسع بعد المصدر الرسمي.
5. **Matt Pocock Skills** كمنهج هندسي modular بديل لـSuperpowers/Addy.
6. **Prompt Architect + Promptfoo** للفصل بين صياغة prompt واختباره فعليًا.
7. **Terraform، Neon، Hookdeck، وCloudflare security-audit** لتوسيع المرجع إلى البنية والبيانات والأحداث والأمن.
8. **درس supply-chain واضح:** بعض ما يُسوّق كـskill قد يكون كتالوجًا، منصة كاملة، أو binary غير موثوق؛ الشجرة وSHA والرخصة أهم من الاسم والوصف.

---
