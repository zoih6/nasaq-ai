# 🚀 الدليل الشامل لأفضل مهارات وكلاء الذكاء الاصطناعي (AI Agent Skills)
## المرجع النهائي للمطورين والمصممين والباحثين - 2026

---

## 📋 جدول المحتويات

1. [مقدمة عن مهارات الوكلاء](#مقدمة)
2. [مهارات التصميم واجهة المستخدم (UI/UX)](#uiux)
3. [مهارات تطوير الويب والبرمجة](#webdev)
4. [مهارات إزالة الأنماط الآلية (Anti-Slop)](#antislop)
5. [مهارات الأتمتة وأتمتة سير العمل](#automation)
6. [مهارات هندسة البرومبتات](#prompt)
7. [مهارات توجيه الوكلاء وهندستها](#agents)
8. [مهارات DevOps والبنية التحتية](#devops)
9. [مهارات الأمان ومراجعة الكود](#security)
10. [مهارات قواعد البيانات](#database)
11. [أدوات وإطارات عمل الوكلاء](#frameworks)
12. [مستودعات شاملة ومكتبات المهارات](#libraries)
13. [كيفية التركيب والاستخدام](#installation)
14. [الخطة الموصى بها للبدء](#roadmap)

---

## <a name="مقدمة"></a>📚 1. مقدمة عن مهارات الوكلاء (Agent Skills)

### ما هي مهارات الوكلاء؟
مهارات الوكلاء هي ملفات تعليمية ذاتية الاكتفاء (SKILL.md) تُعلم وكلاء الذكاء الاصطناعي كيفية أداء مهام متخصصة. كل مهارة تحتوي على:
- **YAML frontmatter**: البيانات الوصفية (الاسم، الوصف، المُحفزات)
- **تعليمات Markdown**: خطوات العمل والممارسات الأمثل
- **موارد مرجعية**: أمثلة وقوالب وأدوات مساعدة

### لماذا نحتاج مهارات الوكلاء؟
- **تحسين جودة المخرجات**: بدلاً من الاعتماد على بيانات التدريب العامة
- **标准化 سير العمل**: ضمان اتساق النتائج عبر المشاريع
- **تقليل الأخطاء**: تجنب الأخطاء الشائعة في البرمجة والتصميم
- **تسريع التطوير**: إعادة استخدام الخبرات المُوثقة

### الأدوات المتوافقة مع المهارات
| الأداة | مسار المشروع | المسار العام | التوثيق الرسمي |
|--------|--------------|--------------|----------------|
| **Claude Code** | `.claude/skills/` | `~/.claude/skills/` | [التوثيق](https://code.claude.com/docs/en/skills) |
| **Codex (OpenAI)** | `.agents/skills/` | `~/.agents/skills/` | [التوثيق](https://developers.openai.com) |
| **Cursor** | `.cursor/skills/` | `~/.cursor/skills/` | [التوثيق](https://cursor.sh) |
| **GitHub Copilot** | `.github/skills/` | `~/.copilot/skills/` | [التوثيق](https://docs.github.com) |
| **Gemini CLI** | `.gemini/skills/` | `~/.gemini/skills/` | [التوثيق](https://geminicli.com) |
| **Windsurf** | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` | [التوثيق](https://codeium.com) |
| **Antigravity** | `.agents/skills/` | `~/.gemini/config/skills/` | [التوثيق](https://antigravity.google) |
| **Kiro** | `.kiro/skills/` | - | [التوثيق](https://kiro.dev) |

---

## <a name="uiux"></a>🎨 2. مهارات التصميم واجهة المستخدم (UI/UX)

### 2.1 مهارات التصميم الأساسية

#### ⭐ frontend-design (Anthropic)
**أفضل مهارة أساسية للتصميم**
- **المستودع**: [anthropics/skills](https://github.com/anthropics/skills/tree/main/frontend-design)
- **النجوم**: 171.9K+ ⭐
- **التركيبات**: 277K+
- **الوصف**: إنشاء واجهات مميزة وعالية الجودة تتجنب "النمطية الآلية"
- **المميزات**:
  - حلقة نقد ذاتي تمنع الجماليات الافتراضية للذكاء الاصطناعي
  - قواعد صارمة للألوان والطباعة والحركة
  - دعم React وHTML/CSS وTailwind
- **التركيب**:
```bash
npx skills add anthropics/skills -s frontend-design
```

#### ⭐ ui-ux-pro-max
**نظام ذكاء تصميم شامل**
- **المستودع**: [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- **النجوم**: 125K+ ⭐
- **التركيبات**: 346K+
- **الوصف**: 50+ نمط تصميم، 97 لوحة ألوان، 9 أكواد تقنية
- **المميزات**:
  - 161 قاعدة تصميم مع تحقق من التباين
  - مولد أنظمة تصميم مخصص حسب الصناعة
  - ملف MASTER.md قابل للحفظ
- **التركيب**:
```bash
npx skills add nextlevelbuilder/ui-ux-pro-max-skill
```

#### ⭐ emil-design-eng (Emil Kowalski)
**الحركة والصقل**
- **المستودع**: [emilkowalski/skills](https://github.com/emilkowalski/skills)
- **النجوم**: 32.8K+ ⭐
- **التركيبات**: 967K+
- **الوصف**: قواعد الحركة والتفاعل والتلميع البصري
- **المميزات**:
  - قواعد التسهيل (easing) للحركات
  - مدد انتقال محسوبة
  - تفاعلات دقيقة وسلسة
- **التركيب**:
```bash
npx skills add emilkowalski/skills
```

#### ⭐ taste-skill
**إطار عمل مضاد للنمطية**
- **المستودع**: [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
- **النجوم**: 81.1K+ ⭐
- **الوصف**: يعطي الذكاء الاصطناعي "ذوقاً" مع قابلية ضبط التباين والحركة والكثافة البصرية
- **التركيب**:
```bash
npx skills add Leonxlnx/taste-skill
```

#### ⭐ Impeccable
**ضمان الجودة الحتمية**
- **المستودع**: [pbakaus/impeccable](https://github.com/pbakaus/impeccable)
- **النجوم**: 63K+ ⭐
- **التركيبات**: 142K
- **الوصف**: 59 قاعدة حتمية ضد "الثرثرة الآلية"
- **التركيب**:
```bash
npx impeccable install
```

### 2.2 مهارات تصميم الويب المتخصصة

#### web-design-guidelines (Vercel)
- **المستودع**: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- **النجوم**: 19.5K+ ⭐
- **التركيبات**: 112.7K
- **الوصف**: 100+ قاعدة لفحص واجهات الويب (الطباعة، التباعد، الاستجابة، إمكانية الوصول)
- **التركيب**:
```bash
npx skills add vercel-labs/agent-skills -s web-design-guidelines
```

#### react-best-practices (Vercel)
- **التركيبات**: 148.9K
- **الوصف**: 40+ قاعدة لتحسين أداء React وNext.js
- **المجالات**: الخطافات، أنماط التكوين، تحسين الأداء، تقليل الحزم
- **التركيب**:
```bash
npx skills add vercel-labs/agent-skills -s react-best-practices
```

#### composition-patterns (Vercel)
- **التركيبات**: 48.4K
- **الوصف**: أنماط تكوين المكونات القابلة للتطوير
- **التركيب**:
```bash
npx skills add vercel-labs/agent-skills -s composition-patterns
```

#### next-best-practices (Vercel)
- **التركيبات**: 15.9K
- **الوصف**: أفضل ممارسات Next.js (App Router، Server Components، جلب البيانات)
- **التركيب**:
```bash
npx skills add vercel-labs/next-skills -s next-best-practices
```

### 2.3 مهارات تصميم Figma وتطوير المنتجات

#### figma-ai-bridge
- **المستودع**: [renfei-design/Figma-AI-Bridge](https://github.com/renfei-design/Figma-AI-Bridge)
- **الوصف**: التحكم في Figma وأتمتة سير عمل التصميم
- **المميزات**: تدقيق إمكانية الوصول، مراجعة المحتوى، توثيق، توليد عروض تقديمية

#### agent-ready
- **المستودع**: [Owl-Listener/agent-ready](https://github.com/Owl-Listener/agent-ready)
- **الوصف**: تقييم ما إذا كانت ملفات التصميم جاهزة لسير عمل الذكاء الاصطناعي

### 2.4 مهارات تصميم خاصة بالمنصات

#### react-native-skills (Vercel)
- **التركيبات**: 34.3K
- **الوصف**: أداء React Native والهندسة المعمارية وأنماط الملاحة

#### expo-app-design
- **التركيبات**: 11.2K
- **الوصف**: هيكل مشروع Expo والتصميم الصحيح

#### threejs-skills
- **المستودع**: [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills)
- **الوصف**: عناصر Three.js ثلاثية الأبعاد وتجارب تفاعلية

---

## <a name="webdev"></a>💻 3. مهارات تطوير الويب والبرمجة

### 3.1 مهارات البنية الأساسية

#### ⭐ Superpowers (obra)
**أفضل مهارة لسير عمل التطوير الكامل**
- **المستودع**: [obra/superpowers](https://github.com/obra/superpowers)
- **النجوم**: 217K+ ⭐
- **الوصف**: يفرض التخطيط قبل الكود مع TDD وتصحيح الأخطاء المنهجي
- **المهارات الفرعية الرئيسية**:
  - **verification-before-completion**: يمنع الإعلان عن اكتمال المهمة بدون تحقق
  - **systematic-debugging**: يفرض جمع الأدلة قبل اقتراح الإصلاحات
  - **test-driven-development**: يفرض سير عمل اختبار-أولاً
  - **dispatching-parallel-agents**: تقسيم المهام عبر وكلاء متعددين
- **التركيب**:
```bash
npx skills add obra/superpowers
```

#### ⭐ andrej-karpathy-skills
**مبادئ ترميز Karpathy الأربعة**
- **المستودع**: [mattpocock/skills](https://github.com/mattpocock/skills) (ينتهي بـ andrej-karpathy-skills)
- **النجوم**: 115K+ ⭐
- **الوصف**: مبادئ الترميز من Andrej Karpathy في ملف CLAUDE.md واحد
- **التركيب**:
```bash
npx @swarmclawai/andrej-karpathy-skills --agent claude --dest .
```

### 3.2 مهارات البرمجة المتخصصة

#### tdd (Test-Driven Development)
- **المستودع**: [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/test-driven-development)
- **الوصف**: يفرض حلقة red-green-refactor الصارمة
- **الاستخدام**: `/tdd`
- **الفوائد**: يمنع الاختبارات الهشة ويجبر على كتابة اختبار فاشل أولاً

#### skill-creator (Anthropic)
- **المستودع**: [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/skill-creator)
- **الوصف**: المهارة الوصفية لإنشاء وتحسين المهارات الأخرى
- **الاستخدام**: إنشاء مهارات جديدة متوافقة مع مواصفات SKILL.md

#### writing-skills (Anthropic)
- **المستودع**: [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/writing-skills)
- **الوصف**: تحسين جودة المهارات ذاتها
- **الاستخدام**: أنماط كتابة قابلة للتكرار ومنهجية اختبار

### 3.3 مهارات الاختبار

#### webapp-testing (Anthropic)
- **المستودع**: [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/webapp-testing)
- **الوصف**: اختبار تطبيقات الويب المحلية باستخدام Playwright
- **المميزات**:
  - انتظار الحالات وتحقق لقطات الشاشة
  - اكتشاف المحددات
  - تقليل السلوك المتقطع
- **التركيب**:
```bash
npx skills add anthropics/skills -s webapp-testing
```

#### playwright-skill
- **المستودع**: [testdino-hq/playwright-skill](https://github.com/testdino-hq/playwright-skill)
- **الوصف**: 70+ نمط اختبار Playwright جاهز للإنتاج

#### مهارات اختبار TestMu AI
مستودع شامل يحتوي على 20+ مهارة اختبار:
- [testmu-ai/cypress-skill](https://github.com/testmu-ai/cypress-skill) - Cypress E2E
- [testmu-ai/playwright-skill](https://github.com/testmu-ai/playwright-skill) - Playwright
- [testmu-ai/pytest-skill](https://github.com/testmu-ai/pytest-skill) - pytest
- [testmu-ai/jest-skill](https://github.com/testmu-ai/jest-skill) - Jest
- [testmu-ai/vitest-skill](https://github.com/testmu-ai/vitest-skill) - Vitest

### 3.4 مهارات TypeScript وNode.js

#### fastify
- **الوصف**: أفضل ممارسات Fastify لخدمات Node.js

#### node
- **الوصف**: أفضل ممارسات Node.js العامة

#### workers-best-practices (Cloudflare)
- **الوصف**: Cloudflare Workers وPages وKV وD1

---

## <a name="antislop"></a>🛡️ 4. مهارات إزالة الأنماط الآلية (Anti-Slop)

### لماذا نحتاج Anti-Slop؟
الواجهات المولدة من الذكاء الاصطناعي غالباً تشترك في:
- تدرجات بنفسجية-زرقاء
- خطوط Inter أو Roboto أو Arial
- بطاقات دائرية كبيرة
- لوحات تحكم زجاجية
- نصوص تسويقية غامضة
- نفس التخطيط في كل مرة

### 4.1 أفضل مهارات Anti-Slop

#### ⭐ Hallmark
**المصمم الذي يرفض أن يبدو مولداً من AI**
- **المستودع**: [nutlope/hallmark](https://github.com/nutlope/hallmark)
- **الموقع**: [usehallmark.com](https://www.usehallmark.com/)
- **الوصف**: يختار بنية كبرى ويضعها في واحد من 21 موضوعاً، ويشغل 57 بوابة اختبار
- **الأفعال الأربعة**:
  - `hallmark` (افتراضي): بناء واجهات جديدة
  - `hallmark audit`: تسجيل الواجهات الموجودة
  - `hallmark redesign`: إعادة بناء مع بصمة مختلفة
  - `hallmark study`: استخراج DNA من تصميم تadmireه
- **التركيب**:
```bash
# Claude Code
~/.claude/skills/hallmark/
```

#### ⭐ no-slop-ui
**قواعد تصميم واجهة أمامية لوكلاء البرمجة**
- **المستودع**: [LeoStehlik/no-slop-ui](https://github.com/LeoStehlik/no-slop-ui)
- **الوصف**: يوقف وكلاء البرمجة من شحن "الوحل الأمامي العام"
- **المميزات**:
  - قائمة أنماط محظورة مفصلة
  - قوائم ألوان محافظة
  - قائمة مراجعة قبول سريعة
- **التركيب**:
```bash
git clone https://github.com/LeoStehlik/no-slop-ui.git
```

#### ⭐ unslop-ui-skill
**كشف وإزالة جماليات "الثرثرة الآلية"**
- **المستودع**: [claudiusararu/unslop-ui-skill](https://github.com/claudiusararu/unslop-ui-skill)
- **الوصف**: مهارة تصميم + كتالوج ~100 علامة تصميم AI
- **المميزات**:
  - فحص قبل الطيران لأي كود HTML/CSS/React/Tailwind
  - تسجيل الواجهات الموجودة على مقياس 10 أبعاد
  - الالتزام باتجاه جمالي محدد لكل مشروع
- **التركيب**:
```bash
# Claude Code
cp -r unslop-ui-skill/.claude/skills/no-ai-slop .claude/skills/
```

#### avoid-ai-design
**مراجعة الواجهات الأمامية المولدة من AI**
- **المستودع**: [funboy322/avoid-ai-design](https://github.com/funboy322/avoid-ai-design)
- **الوصف**: يفحص الواجهات المولدة من AI ويحولها لإزالة أنماط AI العامة
- **أوضاع العمل**:
  - `rewrite` (افتراضي): تدقيق واقتراح اتجاه ثم إعادة كتابة
  - `detect`: تدقيق وتسجيل فقط بدون تعديلات
- **التركيب**:
```bash
git clone https://github.com/funboy322/avoid-ai-design.git ~/.claude/skills/avoid-ai-design
```

#### anti-slop (36 قاعدة)
- **المستودع**: [Rosmarinusofficinalispoloneck995/anti-slop](https://github.com/Rosmarinusofficinalispoloneck995/anti-slop)
- **الوصف**: 36 قاعدة تصميم قابلة للتنفيذ مع بوابة تسليم إلزامية

#### Anti-AI-UI
**مجموعة توجيه شاملة**
- **المستودع**: [Vanszs/Anti-AI-UI](https://github.com/Vanszs/Anti-AI-UI)
- **الوصف**: 3 مهارات توجيه: فلتر + لوحة + أداة بحث
- **المكونات**:
  - **Anti-AI-SLop**: الفلتر - ما يجب تجنبه
  - **component-reference-design**: اللوحة - ما يجب بناؤه
  - **ui-ux-pro-max**: أداة البحث - ذكاء التصميم

### 4.2 مهارات Anti-Slop المتخصصة

#### anti-ui-slop (GitHub/UIZZE)
- **المستودع**: [github/awesome-copilot](https://github.com/github/awesome-copilot/tree/main/skills/anti-ui-slop)
- **الوصف**: يستخدم 800,000+ شاشة ويب و iOS حقيقية لبناء واجهات خاصة بالمنتج
- **التركيب**:
```bash
npx skills add https://github.com/github/awesome-copilot --skill anti-ui-slop
```

#### anti-ai-slop-skills
- **المستودع**: [Krirox/anti-ai-slop-skills](https://github.com/Krirox/anti-ai-slop-skills)
- **الوصف**: يكشف وي Eliminateجماليات "الثرثرة الآلية" من واجهات الويب الأمامية

---

## <a name="automation"></a>⚙️ 5. مهارات الأتمتة وأتمتة سير العمل

### 5.1 منصات الأتمتة الرئيسية

#### n8n
**أفضل منصة أتمتة مفتوحة المصدر**
- **الموقع**: [n8n.io](https://n8n.io)
- **الوصف**: أتمتة سير العمل مع عقد وكلاء الذكاء الاصطناعي
- **المميزات**: بصري + كود، تكامل LangChain، مجاني ذاتي الاستضافة
- **المهارات المتوفرة**:
  - **n8n-code-javascript**: JavaScript في عقد الكود
  - **n8n-code-python**: Python في عقد الكود
  - **n8n-expression-syntax**: بنية تعبيرات n8n
  - **n8n-mcp-tools-expert**: دليل أدوات MCP

#### Zapier
**الintégration مع 7000+ تطبيق**
- **الموقع**: [zapier.com](https://zapier.com)
- **الوصف**: سير عمل بلغة طبيعية
- **السعر**: من $19.99/شهر

#### Make.com
**منصة سير عمل بصري**
- **الموقع**: [make.com](https://make.com)
- **الوصف**: منصة أتمتة مع قدرات ذكاء اصطناعي
- **السعر**: مجاني / مدفوع

#### Activepieces
**بديل Zapier مفتوح المصدر**
- **المستودع**: [activepieces/activepieces](https://github.com/activepieces/activepieces)
- **الوصف**: Zapier مفتوح المصدر مع ذكاء اصطناعي

### 5.2 مهارات الأتمتة المتخصصة

#### Hookdeck Webhook Skills
- **المستودع**: [hookdeck/agent-skills](https://github.com/hookdeck/agent-skills)
- **الوصف**: مهارات webhook خاصة بمزودي الخدمة
- **الاستخدام**: أتمتة مبنية على الأحداث

#### Cloudflare Skills
- **المستودع**: [cloudflare/skills](https://github.com/cloudflare/skills)
- **الوصف**: Workers, Pages, KV, D1, R2, AI, Agents SDK, MCP server building
- **التركيب**:
```bash
npx skills add cloudflare/skills
```

#### Zapier MCP
- **المستودع**: [zapier/zapier-mcp](https://github.com/zapier/zapier-mcp)
- **الوصف**: توزيع إضافات رسمي لخادم MCP المُستضاف

### 5.3 مهارات الأتمتة الذاتية الاستضافة

#### Docker MCP Toolkit
- **الوصف**: إدارة حاويات Docker عبر MCP

#### Home Assistant Automation Skills
- **الوصف**: أتمتة المنزل الذكي

#### Grafana / Prometheus / Netdata Monitoring
- **الوصف**: سير عمل المراقبة

#### ntfy / Apprise Notification Skills
- **الوصف**: سير عمل الإشعارات

---

## <a name="prompt"></a>🎯 6. مهارات هندسة البرومبتات (Prompt Engineering)

### 6.1 أطر عمل البرومبتات الأساسية

#### CO-STAR Framework
**الأفضل للمحتوى والتسويق**
- **المكونات**: Context, Objective, Style, Tone, Audience, Response
- **الأفضل لـ**: المحتوى التسويقي، النسخ الإعلاني، التواصل التجاري
- **التعقيد**: متوسط
- **مثال**:
```
Context: أنت تكتب وصف منتج لتطبيق جوال جديد
Objective: إنشاء وصف مقنع يزيد التحميلات
Style: احترافي ولكن ودود
Tone: متحمس ولكن واقعي
Audience: مستخدمي الهواتف الذكية من سن 25-40
Response: وصف 150 كلمة مع 3 نقاط رئيسية
```

#### RISEN Framework
**الأفضل للمهام التقنية متعددة الخطوات**
- **المكونات**: Role, Instructions, Steps, End Goal, Narrowing
- **الأفضل لـ**: المهام التقنية، سير عمل CI/CD، الترحيل
- **التعقيد**: متوسط-عالي
- **مثال**:
```
Role: أنت مهبر DevOps خبير في Kubernetes
Instructions: إنشاء خط أنابيب CI/CD لتطبيق Next.js
Steps: 
1. إعداد بنية المستودع
2. كتابة GitHub Actions workflow
3. إعداد اختبارات E2E
4. نشر إلى Kubernetes
End Goal: خط أنابيب متكامل ينشر تلقائياً عند الدفع
Narrowing: استخدم GitHub Actions فقط، لا Jenkins
```

#### RACE Framework
**الأفضل للمهام السريعة**
- **المكونات**: Role, Action, Context, Expectation
- **الأفضل لـ**: المهام البسيطة والسريعة
- **التعقيد**: منخفض

#### CRAFT Framework
**الأفضل للعمل الإبداعي**
- **المكونات**: Character, Request, Examples, Adjustments, Type, Extras
- **الأفضل لـ**: العمل التسويقي المفصل
- **التعقيد**: عالي

#### APE Framework
**الأغلى للسرعة**
- **المكونات**: Action, Purpose, Expectation
- **الأفضل لـ**: المهام البسيطة والسريعة
- **التعقيد**: منخفض جداً

#### STOKE Framework
**الأفضل للتحليل النطقي**
- **المكونات**: Situation, Task, Objective, Knowledge, Examples
- **الأفضل لـ**: المهام التحليلية والنطاقية المتخصصة
- **التعقيد**: متوسط-عالي

### 6.2 تقنيات البرومبتات المتقدمة

#### Chain-of-Thought (سلسلة التفكير)
- **الوصف**: تشجيع النموذج على التفكير خطوة بخطوة
- **الأفضل لـ**: التفكير المنطقي، الرياضيات، التحليل متعدد الخطوات

#### Tree-of-Thought (شجرة التفكير)
- **الوصف**: استكشاف ومقارنة مسارات متعددة قبل القرار
- **الأفضل لـ**: القرارات المعقدة، الاستراتيجية، حل المشكلات

#### Skeleton-of-Thought (هيكل التفكير)
- **الوصف**: هيكلة المحتوى الطويل (مخطط أولاً)
- **الأفضل لـ**: التوثيق، التقارير، المحتوى طويل الأجل

#### Self-Refine (التنقيح الذاتي)
- **الوصف**: تحسين جودة المخرجات بشكل تكراري
- **الأفضل لـ**: الكتابة عالية الجودة، التوثيق، مراجعة الكود

#### Few-Shot Prompting
- **الوصف**: تقديم 2-5 أمثلة للمخرجات المطلوبة
- **الأفضل لـ**: التصنيف، الاستخراج، التنسيق

### 6.3 مستودعات ومصادر هندسة البرومبتات

#### Awesome Prompt Engineering
- **المستودع**: [promptslab/Awesome-Prompt-Engineering](https://github.com/promptslab/Awesome-Prompt-Engineering)
- **الوصف**: مصادر شاملة لهندسة البرومبتات مع التركيز على GPT وChatGPT

#### Prompt Engineering Guide (DAIR.AI)
- **المستودع**: [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)
- **النجوم**: 55K+ ⭐
- **الوصف**: الدليل الشامل مفتوح المصدر

#### Prompt Architect
- **المستودع**: [ckelsoe/prompt-architect](https://github.com/ckelsoe/prompt-architect)
- **الوصف**: يحول البرومبتات الغامضة إلى برومبتات منظمة باستخدام 31 إطار عمل

#### NeoLabHQ/prompt-engineering
- **المستودع**: [NeoLabHQ/prompt-engineering](https://github.com/NeoLabHQ/prompt-engineering)
- **الوصف**: تقنيات وأنماط هندسة البرومبتات المستخدمة على نطاق واسع

### 6.4 أدوات هندسة البرومبتات

#### Braintrust
- **الموقع**: [braintrust.dev](https://www.braintrust.dev)
- **الوصف**: أفضل أداة شاملة (بدون كود، تقييم موجه، نشر إنتاجي)

#### PromptHub
- **الموقع**: [prompthub.us](https://www.prompthub.us)
- **الوصف**: نسخ بنمط Git مع تعاون الفريق

#### Promptfoo
- **المستودع**: [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo)
- **الوصف**: اختبار CLI مع فحص أمان

#### Agenta
- **المستودع**: [agenta-ai/agenta](https://github.com/agenta-ai/agenta)
- **الوصف**: إدارة برومبتات مفتوحة المصدر مع تقييم مدمج

---

## <a name="agents"></a>🤖 7. مهارات توجيه الوكلاء وهندستها

### 7.1 أطر عمل الوكلاء الرئيسية

#### ⭐ LangChain
**منصة هندسة الوكلاء الأساسية**
- **المستودع**: [langchain-ai/langchain](https://github.com/langchain-ai/langchain)
- **النجوم**: 132K+ ⭐
- **الوصف**: السلاسل والأدوات والوكلاء
- **الاستخدام**: بناء تطبيقات LLM مدعومة بالوكلاء

#### ⭐ CrewAI
**إطار عمل الوكلاء المستقلين**
- **المستودع**: [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI)
- **النجوم**: 48K+ ⭐
- **الوصف**: إطار عمل يتضمن أدواراً مستقلة تعمل معاً كطواقم

#### ⭐ AutoGen (Microsoft)
**إطار محادثة الوكلاء المتعددين**
- **المستودع**: [microsoft/autogen](https://github.com/microsoft/autogen)
- **النجوم**: 56.7K+ ⭐
- **الوصف**: إطار محادثة متعدد الوكلاء للذكاء الاصطناعي التعاوني

#### ⭐ MetaGPT
**إطار عمل الوكلاء المتعددين**
- **المستودع**: [geekan/MetaGPT](https://github.com/geekan/MetaGPT)
- **النجوم**: 66.7K+ ⭐
- **الوصف**: إطار عمل يحاكي شركة برمجيات مع وكلاء بأدوار

### 7.2 منصات بناء الوكلاء بدون كود

#### ⭐ Langflow
**منشئ بصري بالسحب والإفلات**
- **المستودع**: [langflow-ai/langflow](https://github.com/langflow-ai/langflow)
- **النجوم**: 146.6K+ ⭐
- **الوصف**: منشئ بصري لوكلاء وسير عمل مدعومين بالذكاء الاصطناعي

#### ⭐ Dify
**منصة جاهزة للإنتاج**
- **المستودع**: [langgenius/dify](https://github.com/langgenius/dify)
- **النجوم**: 136.3K+ ⭐
- **الوصف**: منصة جاهزة للإنتاج لبناء ونشر سير عمل الوكلاء

#### Flowise
**منشئ بصري بدون كود**
- **المستودع**: [FlowiseAI/Flowise](https://github.com/FlowiseAI/Flowise)
- **النجوم**: 51.6K+ ⭐
- **الوصف**: منشئ وكلاء بصري - سحب وإفلات ونشر بدون كود

### 7.3 مهارات الوكلاء المتخصصة

#### mcp-builder (Anthropic)
- **المستودع**: [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/mcp-builder)
- **الوصف**: بناء خوادم MCP عالية الجودة
- **المميزات**:
  - تسمية الأدوات لسهولة الاكتشاف
  - التوازن بين تغطية API الكاملة والأدوات المريحة
  - رسائل خطأ مفيدة

#### dispatching-parallel-agents
- **المستودع**: [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/dispatching-parallel-agents)
- **الوصف**: تقسيم المهام عبر وكلاء متعددين يعملون بالتوازي

#### Grill Me
**التخطيط قبل البرمجة**
- **المستودع**: [mattpocock/skills](https://github.com/mattpocock/skills)
- **الوصف**: يحاشرك بـ 16-50 سؤالاً موجهاً قبل كتابة أي كود
- **التركيب**:
```bash
npx skills add mattpocock/skills
```

#### Caveman
**تحسين استخدام الرموز**
- **المستودع**: [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)
- **النجوم**: 68K+ ⭐
- **الوصف**: يقلل رموز المخرجات بنحو 65% مع الحفاظ على جميع كتل الكود
- **الاستخدام**: `/caveman`

#### Graphify
**فهم قاعدة الكود**
- **المستودع**: [safishamsi/graphify](https://github.com/safishamsi/graphify)
- **النجوم**: 58.8K+ ⭐
- **الوصف**: يحول قاعدة الكود بأكملها إلى معرفة قابلة للاستعلام

### 7.4 ذاكرة الوكلاء وحالاتهم

#### Mem0
**طبقة الذاكرة الشاملة**
- **المستودع**: [mem0ai/mem0](https://github.com/mem0ai/mem0)
- **النجوم**: 52K+ ⭐
- **الوصف**: بنية تحتية للذاكرة قابلة للإسقاط للوكلاء والتطبيقات

#### claude-memory-kit
- **المستودع**: [awrshift/claude-memory-kit](https://github.com/awrshift/claude-memory-kit)
- **الوصف**: ذاكرة دائمة مع خطافات وwiki وتركيب يومي

#### data-structure-protocol
- **المستودع**: [k-kolomeitsev/data-structure-protocol](https://github.com/k-kolomeitsev/data-structure-protocol)
- **الوصف**: ذاكرة طويلة الأمد بنمط الرسم البياني

---

## <a name="devops"></a>🔧 8. مهارات DevOps والبنية التحتية

### 8.1 مهارات الحاويات والتنسيق

#### docker-patterns
- **المستودع**: [j4flmao/agent-skills](https://github.com/j4flmao/agent-skills)
- **الوصف**: أفضل ممارسات Docker: بناء متعدد المراحل، تخزين مؤقت للطبقات، فحص الأمان

#### kubernetes-patterns
- **الوصف**: تفاصيل نشر K8s، إدارة الموارد، جدولة Pod، discovery الخدمة

#### helm-patterns
- **الوصف**: تأليف مخططات Helm، قوالب القيم، إدارة الإصدارات

### 8.2 مهارات البنية التحتية ككود

#### terraform-skill
- **المستودع**: [antonbabenko/terraform-skill](https://github.com/antonbabenko/terraform-skill)
- **الوصف**: أنماط Terraform وOpenTofu: الاختبار، الوحدات، الحالة، CI/CD

#### devops-aws
- **الوصف**: أنماط بنية AWS التحتية: VPC، IAM، ECS/EKS، RDS، S3، CloudFormation، CDK

#### devops-gcp
- **الوصف**: أنماط Google Cloud: GKE، Cloud Run، BigQuery، IAM، Pub/Sub

#### devops-azure
- **الوصف**: بنية Azure: AKS، App Service، Cosmos DB، ARM templates، Bicep

### 8.3 مهارات CI/CD

#### ci-cd-pipeline-validator
- **الوصف**: يدقيق تكوينات GitHub Actions وGitLab CI وCircleCI وJenkins

#### GitHub Actions
- **الوصف**: تأليف ملفات workflow YAML لـ CI وCD والأختبار الآمن والإصدارات

### 8.4 مهارات المراقبة والرصد

#### Monitoring Setup
- **الوصف**: تكوين أكواد الرصد: Prometheus، Grafana، Datadog، CloudWatch

#### Sentry for AI
- **المستودع**: [sentry/sentry](https://github.com/getsentry/sentry)
- **الوصف**: يساعد وكلاء البرمجة على استخدام Sentry للإعداد والتصحيح

### 8.5 مستودعات DevOps الشاملة

#### j4flmao/agent-skills
- **الوصف**: 55+ مهارة DevOps: Docker، K8s، Terraform، Ansible، CI/CD، سحابة، FinOps، MLOps

#### BagelHole/DevOps-Security-Agent-Skills
- **الوصف**: 160+ مهارة DevOps + أمان + امتثال

#### MicrosoftDocs/Agent-Skills
- **الوصف**: 193 مهارة Azure كاملة

---

## <a name="security"></a>🔒 9. مهارات الأمان ومراجعة الكود

### 9.1 مهارات التدقيق الأمني

#### ⭐ Trail of Bits Skills
**الأفضل للتدقيق الأمني على مستوى الشركات**
- **المستودع**: [trailofbits/skills](https://github.com/trailofbits/skills)
- **النجوم**: 6K+ ⭐
- **الوصف**: ~40 إضافة مصممة لتقطير خبرة المستشار الأمني
- **المهارات الرئيسية**:
  - **static-analysis**: CodeQL + Semgrep
  - **variant-analysis**: إيجاد أخطاء مشابهة عبر قواعد الكود
  - **audit-context-building**: سياق معماري عميق
  - **building-secure-contracts**: أمان العقود الذكية (6 بلوك تشين)
  - **ask-questions-if-underspecified**: طلب التوضيح عند الغموض
- **التركيب**:
```bash
npx skills add trailofbits/skills
```

#### ⭐ Shannon
**مختبر اختبار اختراق مستقل**
- **المستودع**: متاح عبر مهارات Claude
- **الوصف**: ينفذ استغلالات حقيقية عبر 50+ نوع ثغرة
- **الاستخدام**: التحقق من القابلية للاستغلال بدلاً من المشكلات النظرية
- **تحذير**: فقط على أهداف لديك تصريح باختبارها

#### security-audit-skill (Cloudflare)
- **المستودع**: [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill)
- **النجوم**: 2K+ ⭐
- **الوصف**: تدقيق متعدد المراحل مع تحقق عدائي

#### vulnhunter (CapitalOne)
- **المستودع**: [capitalone/vulnhunter](https://github.com/capitalone/vulnhunter)
- **الوصف**: 3 مهارات Claude Code قابلة للتكوين لحلقة إصلاح آلية

### 9.2 مهارات تحليل الثغرات

#### code-vuln-audit
- **الوصف**: فحص الكود لمشاكل الأمان: ثغرات التبعيات، تسريبات الأسرار، أنماط OWASP

#### Claude Code OWASP
- **المستودع**: [agamm/claude-code-owasp](https://github.com/agamm/claude-code-owasp)
- **الوصف**: OWASP Top 10:2025، ASVS 5.0، أمان الذكاء الاصطناعي Agentic

### 9.3 مهارات أمان العقود الذكية

#### Building Secure Contracts (Trail of Bits)
- **الوصف**: 11 مهارة لفحص أمان العقود الذكية
- **الفحوصات المدعومة**:
  - Algorand/TEAL (11 نمط)
  - StarkNet/Cairo (6 أنماط)
  - Cosmos SDK (9 أنماط)
  - Solana/Anchor (6 أنماط)
  - Substrate (7 أنماط)
  - TON (3 أنماط)

---

## <a name="database"></a>🗄️ 10. مهارات قواعد البيانات

### 10.1 مهارات PostgreSQL

#### ⭐ Supabase Postgres Best Practices
**الأفضل لمشاريع Supabase**
- **المستودع**: [supabase/agent-skills](https://github.com/supabase/agent-skills/tree/main/supabase-postgres-best-practices)
- **التركيبات**: 130.6K+
- **الوصف**: أنماط PostgreSQL الأيديوماتية لمشاريع Supabase
- **المواضيع المشمولة**:
  - تصميم سياسات Row Level Security (RLS)
  - استراتيجية الفهرسة (B-tree، GIN، فهارس جزئية)
  - بنية ملفات الترحيل وأداة Supabase CLI
  - أنماط الاستعلام الفعالة (تجنب N+1، استخدام CTEs)
  - استخدام JSON/JSONB
  - البحث النصي الكامل مع tsvector
- **التركيب**:
```bash
/plugin marketplace add supabase/agent-skills
/plugin install postgres-best-practices@supabase-agent-skills
```

#### Neon Serverless Postgres
- **المستودع**: [neondatabase/agent-skills](https://github.com/neondatabase/agent-skills)
- **الوصف**: أفضل ممارسات Neon serverless: التفريع، تجميع الاتصالات، الدوال الحدية

### 10.2 مهارات SQL وتحسين الاستعلامات

#### sql-optimization-patterns
- **الوصف**: استعلامات بطيئة، استراتيجية الفهرسة، JOINs، تحليل EXPLAIN

#### postgres-schema-design
- **الوصف**: الجداول، القيود، الفهارس، نمذجة البيانات متعددة المستأجرين

#### database-migration
- **الوصف**: تغييرات المخطط، خطط النشر، التفكير في التراجع، استراتيجية الترحيل بدون توقف

### 10.3 مهارات البحث المتجانس وRAG

#### rag-implementation
- **الوصف**: أسئلة المستندات، قواعد المعرفة، خطوط استرداد، إجابات مدعومة

#### similarity-search-patterns
- **الوصف**: البحث الدلالي، الاسترداد الهجين، أقرب جار

#### vector-index-tuning
- **الوصف**: زمن الاستجابة، الاستدعاء، الذاكرة، ضبط HNSW

### 10.4 مهارات ORM

#### prisma
- **الوصف**: نمذجة Prisma، تكوين Prisma، تحسين أداء Prisma

#### drizzle
- **الوصف**: SQL آمن من النوع، أنماط Drizzle ORM، ترحيل Drizzle Kit

#### SQLAlchemy
- **الوصف**: تعريف النموذج، إدارة الجلسات، أنماط الاستعلام

### 10.5 مهارات معالجة البيانات

#### xlsx
- **الوصف**: Excel، CSV، الصيغ، الجداول المحورية، الرسوم البيانية

#### data-storytelling
- **الوصف**: التقارير، الملخصات التنفيذية، السرديات التحليلية

#### kpi-dashboard-design
- **الوصف**: تخطيط KPI، تسلسل المقاييس، مراقبة الاتجاهات

---

## <a name="frameworks"></a>🏗️ 11. أدوات وإطارات عمل الوكلاء

### 11.1 منصات الوكلاء المتكاملة

#### ⭐ AutoGPT
**إطار الوكلاء المستقلة**
- **المستودع**: [Significant-Gravitas/AutoGPT](https://github.com/Significant-Gravitas/AutoGPT)
- **النجوم**: 183K+ ⭐
- **الوصف**: إطار وكلاء ذكاء اصطناعي مستقلة - الرائد في إمكانية الوصول

#### ⭐ Browser-use
**جعل المواقع في متناول الوكلاء**
- **المستودع**: [browser-use/browser-use](https://github.com/browser-use/browser-use)
- **النجوم**: 86K+ ⭐
- **الوصف**: أتمتة المهام عبر الويب بسهولة

#### ⭐ RAGFlow
**محرك RAG مفتوح المصدر**
- **المستودع**: [infiniflow/ragflow](https://github.com/infiniflow/ragflow)
- **النجوم**: 77K+ ⭐
- **الوصف**: محرك RAG مفتوح المصدر يجمع بين قدرات الوكلاء

#### ⭐ LobeHub
**منصة تعاون الوكلاء المتعددين**
- **المستودع**: [lobehub/lobe-chat](https://github.com/lobehub/lobe-chat)
- **النجوم**: 74.8K+ ⭐
- **الوصف**: منصة لبناء وإدارة فرق الوكلاء

### 11.2 منصات الوكلاء المفتوحة المصدر

#### OpenHands
- **المستودع**: [All-Hands-AI/OpenHands](https://github.com/All-Hands-AI/OpenHands)
- **النجوم**: 69K+ ⭐
- **الوصف**: منصة رائدة لوكلاء البرمجة السحابية

#### SWE-agent
- **المستودع**: [princeton-nlp/SWE-agent](https://github.com/princeton-nlp/SWE-agent)
- **النجوم**: 19K+ ⭐
- **الوصف**: يأخذ مشكلة GitHub ويصلحها تلقائياً

#### Open SWE
- **المستودع**: [langchain-ai/open-swe](https://github.com/langchain-ai/open-swe)
- **الوصف**: إطار سير عمل البرمجة غير المتزامن المبني على LangGraph

#### Devika
- **المستودع**: [stitionai/devika](https://github.com/stitionai/devika)
- **النجوم**: 18K+ ⭐
- **الوصف**: مهندس برمجيات Agentic مفتوح المصدر

### 11.3 أدوات بناء الوكلاء

#### LangGraph
- **المستودع**: [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph)
- **النجوم**: 41K+ ⭐
- **الوصف**: بناء وكلاء مرنين

#### Agno
- **المستودع**: [agno-agi/agno](https://github.com/agno-agi/agno)
- **النجوم**: 39.2K+ ⭐
- **الوصف**: بناء وتشغيل وإدارة البرمجيات Agentic

---

## <a name="libraries"></a>📦 12. مستودعات شاملة ومكتبات المهارات

### 12.1 المكتبات الرئيسية

#### ⭐ Anthropic Skills (ال الرسمي)
- **المستودع**: [anthropics/skills](https://github.com/anthropics/skills)
- **النجوم**: 171.9K+ ⭐
- **الوصف**: مكتبة المهارات الرسمية من Anthropic
- **المهارات الرئيسية**: frontend-design، webapp-testing، skill-creator، mcp-builder، document-handling

#### ⭐ VoltAgent/awesome-agent-skills
- **المستودع**: [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)
- **النجوم**: 34K+ ⭐
- **الوصف**: مجموعة منسقة من 1000+ مهارة من فرق التطوير الحقيقية والمجتمع
- **التوافق**: Claude Code، Codex، Antigravity، Gemini CLI، Cursor، GitHub Copilot، OpenCode، Windsurf

#### ⭐ obra/superpowers
- **المستودع**: [obra/superpowers](https://github.com/obra/superpowers)
- **النجوم**: 217K+ ⭐
- **الوصف**: مكتبة المهارات العامة الرسمية من Anthropic

#### ⭐ alirezarezvani/claude-skills
- **المستودع**: [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills)
- **النجوم**: 5.2K+ ⭐
- **الوصف**: 380 مهارة Claude Code + 30+ وكيل + 70+ أمر مخصص
- **المجالات**: هندسة، DevOps، تسويق، أمان، امتثال، قيادة C-level

#### ⭐ rohitg00/awesome-claude-code-toolkit
- **المستودع**: [rohitg00/awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit)
- **الوصف**: أكثر مجموعة شاملة: 135 وكيل، 35 مهارة، 42 أمر، 176+ إضافة

### 12.2 مكتبات متخصصة

#### Antigravity Awesome Skills
- **المستودع**: [antigravity-skills](https://github.com/antigravity-skills)
- **الوصف**: 1,234+ مهارة منسقة في سلة واحدة

#### SkillKit
- **الوصف**: مدير حزم للمهارات عبر 46 وكيل و31 مصدراً

#### Skills.sh
- **الموقع**: [skills.sh](https://skills.sh)
- **الوصف**: دليل مهارات الوكلاء

#### AgenticSkills.io
- **الموقع**: [agenticskills.io](https://agenticskills.io)
- **الوصف**: دليل مهارات الوكلاء مع تصنيفات التركيب

### 12.3 مكتبات مهارات خاصة بالمنصات

#### Vercel Agent Skills
- **المستودع**: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- **النجوم**: 19.5K+ ⭐
- **المهارات**: react-best-practices، web-design-guidelines، composition-patterns، react-native-skills

#### Supabase Agent Skills
- **المستودع**: [supabase/agent-skills](https://github.com/supabase/agent-skills)
- **المهارات**: postgres-best-practices، supabase-edge-functions

#### Cloudflare Skills
- **المستودع**: [cloudflare/skills](https://github.com/cloudflare/skills)
- **المهارات**: workers، pages، KV، D1، R2، AI

#### Firebase Skills
- **المستودع**: [firebase/skills](https://github.com/firebase/skills)
- **المهارات**: developing-genkit-dart/go/js، firebase-ai-logic-basics

---

## <a name="installation"></a>📥 13. كيفية التركيب والاستخدام

### 13.1 التركيب عبر npx skills

```bash
# إضافة مهارة من مستودع
npx skills add anthropics/skills -s frontend-design

# إضافة مهارة من مستودع كامل
npx skills add vercel-labs/agent-skills

# إضافة مهارة من رابط
npx skills add https://github.com/user/repo -s skill-name
```

### 13.2 التركيب اليدوي

```bash
# Claude Code
cp -r skill-folder ~/.claude/skills/

# Codex
cp -r skill-folder ~/.agents/skills/

# Cursor
cp -r skill-folder ~/.cursor/skills/

# Gemini CLI
cp -r skill-folder ~/.gemini/skills/

# Windsurf
cp -r skill-folder ~/.codeium/windsurf/skills/
```

### 13.3 التحقق من تحميل المهارة

```bash
# Claude Code
/skills

# يجب أن تظهر المهارات المثبتة في القائمة
```

### 13.4 استخدام المهارات

```bash
# المهارات تعمل تلقائياً بناءً على السياق
# أو يمكن استدعاؤها يدوياً:
/frontend-design
/tdd
/caveman
/grill-me
```

---

## <a name="roadmap"></a>🗺️ 14. الخطة الموصى بها للبدء

### 14.1 للمطورين الأماميين (Frontend)

```bash
# الأساسيات
npx skills add anthropics/skills -s frontend-design
npx skills add vercel-labs/agent-skills -s react-best-practices
npx skills add vercel-labs/agent-skills -s web-design-guidelines

# المتقدم
npx skills add vercel-labs/agent-skills -s composition-patterns
npx skills add nextlevelbuilder/ui-ux-pro-max-skill
npx skills add Leonxlnx/taste-skill

# مكافحة النمطية
git clone https://github.com/nutlope/hallmark ~/.claude/skills/hallmark
```

### 14.2 لمطوري Full-Stack

```bash
# الأساسيات
npx skills add anthropics/skills -s frontend-design
npx skills add vercel-labs/agent-skills -s react-best-practices
npx skills add vercel-labs/next-skills -s next-best-practices
npx skills add anthropics/skills -s webapp-testing

# قواعد البيانات
/plugin marketplace add supabase/agent-skills
/plugin install postgres-best-practices@supabase-agent-skills

# DevOps
npx skills add cloudflare/skills
npx skills add supabase/agent-skills -s supabase-edge-functions
```

### 14.3 لمهندسي DevOps

```bash
# الحاويات والتنسيق
npx skills add j4flmao/agent-skills -s docker-patterns
npx skills add j4flmao/agent-skills -s kubernetes-patterns
npx skills add antonbabenko/terraform-skill

# CI/CD
npx skills add vercel-labs/agent-skills -s github-actions
npx skills add BagelHole/DevOps-Security-Agent-Skills

# المراقبة
npx skills add sentry/sentry -s sentry-for-ai
```

### 14.4 لمهندسي الأمان

```bash
# التدقيق الأمني
npx skills add trailofbits/skills
npx skills add cloudflare/security-audit-skill

# اختبار الاختراق (فقط على أهداف مصرح بها)
# Shannon عبر مهارات Claude

# OWASP
npx skills add agamm/claude-code-owasp
```

### 14.5 للباحثين وكتّاب المحتوى

```bash
# هندسة البرومبتات
npx skills add mattpocock/skills  # Grill Me
npx skills add JuliusBrussee/caveman  # Caveman

# البحث
npx skills add anthropics/skills -s deep-research
npx skills add ZeroPointRepo/youtube-skills

# التوثيق
npx skills add anthropics/skills -s doc
```

### 14.6 للقادة التقنيين ومهندسي المنتجات

```bash
# التخطيط والتصميم
npx skills add mattpocock/skills  # Grill Me
npx skills add obra/superpowers  # Superpowers

# التصميم
npx skills add anthropics/skills -s frontend-design
npx skills add vercel-labs/agent-skills -s web-design-guidelines

# إدارة المشاريع
npx skills add rameerez/claude-code-startup-skills
```

---

## 📊 ملخص المكتبات الرئيسية

| المكتبة | النجوم | الوصف | الرابط |
|---------|--------|-------|--------|
| anthropics/skills | 171.9K | مكتبة Anthropic الرسمية | [GitHub](https://github.com/anthropics/skills) |
| obra/superpowers | 217K | مكتبة Anthropic العامة | [GitHub](https://github.com/obra/superpowers) |
| VoltAgent/awesome-agent-skills | 34K | 1000+ مهارة من المجتمع | [GitHub](https://github.com/VoltAgent/awesome-agent-skills) |
| alirezarezvani/claude-skills | 5.2K | 380 مهارة شاملة | [GitHub](https://github.com/alirezarezvani/claude-skills) |
| vercel-labs/agent-skills | 19.5K | مهارات Vercel الرسمية | [GitHub](https://github.com/vercel-labs/agent-skills) |
| supabase/agent-skills | - | مهارات Supabase الرسمية | [GitHub](https://github.com/supabase/agent-skills) |
| trailofbits/skills | 6K | أمن ومراجعة كود | [GitHub](https://github.com/trailofbits/skills) |
| nextlevelbuilder/ui-ux-pro-max-skill | 125K | ذكاء تصميم شامل | [GitHub](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) |
| nutlope/hallmark | - | Anti-AI-slop مميز | [GitHub](https://github.com/nutlope/hallmark) |
| mattpocock/skills | 115K | Grill Me وTDD | [GitHub](https://github.com/mattpocock/skills) |

---

## 🔗 مصادر إضافية للتعلم

### الأدلة الرسمية
- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)
- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Google Gemini Prompting Strategies](https://ai.google.dev/docs/prompting_strategies)
- [Claude Code Official Docs](https://code.claude.com/docs)

### الدورات التعليمية
- [ChatGPT Prompt Engineering for Developers](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/) (مجاني)
- [Microsoft AI Agents for Beginners](https://github.com/microsoft/ai-agents-for-beginners) (18 درس)
- [Anthropic Courses](https://github.com/anthropics/courses)

### المجتمعات والمنتديات
- [r/AI_Agents](https://www.reddit.com/r/AI_Agents/)
- [r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/)
- [r/PromptEngineering](https://www.reddit.com/r/PromptEngineering/)
- [LangChain Discord](https://discord.gg/langchain)
- [Anthropic Discord](https://discord.gg/anthropic)

### الأبحاث والمقالات
- [The Prompt Report](https://arxiv.org/abs/2406.06608) - تصنيف 58+ تقنية prompting
- [Anthropic: Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Addy Osmani: Multi-Agent Coding Patterns](https://addyosmani.com/blog/multi-agent-coding-patterns/)

---

## 🎯 نصائح مهمة للاستخدام الأمثل

### 1. لا تثبت كل شيء
- ابدأ بـ 3-5 مهارات أساسية
- أضف مهارات جديدة عند الحاجة فقط
- تجنب تعارض المهارات (مهارة أساسية واحدة + مهارة حركة واحدة + مدقق واحد)

### 2. فعّل التدقيق البشري
- المهارات تحسن المخرجات لكنها لا تحل محل الحكم البشري
- راجع دائماً النتائج قبل النشر
- استخدم مهارات التحقق مثل verification-before-completion

### 3. حافظ على تحديث المهارات
- تحقق من تاريخ آخر commit في المستودع
- راقب نشاط issues و pull requests
- استخدم إصدارات محددة عندما يكون ذلك متاحاً

### 4. فهم سياق عملك
- المهارات تعمل أفضل عندما يكون للوكيل سياق كافٍ
- وفر ملفات مشروع واضحة (README، هيكل المجلدات)
- استخدم AGENTS.md أو CLAUDE.md لسياق المشروع

### 5. قيّم النتائج
- تتبع تحسينات الجودة بعد تثبيت المهارات
- قم بإعادة التقييم دورياً
- أزل المهارات التي لا تضيف قيمة

---

**تاريخ الإنشاء**: 11 سبتمبر 2026  
**آخر تحديث**: 11 سبتمبر 2026  
**الإصدار**: 1.0  
**الترخيص**: هذا الدليل مفتوح المصدر للاستخدام التعليمي

---

*هذا التقرير مرجع شامل يمكن وضعه مباشرة في أي وكيل برمجي لتحسين أدائه بشكل مبهر. الوكيل سيفهم أن عليه تحميل المهارات والتعليمات وسيؤدي ذلك إلى نتائج استثنائية بسبب تغذيته بالمصادر والأدوات المناسبة.*