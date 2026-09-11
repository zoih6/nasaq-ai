# معمارية الـFrontend — نَسَق AI

| الحقل | القيمة |
|---|---|
| الإصدار | `0.1` |
| الحالة | قرار تأسيسي للـPrototype |
| آخر تحديث | 11 سبتمبر 2026 |
| المرجع | [PRD](../01-product/PRD.md) · [Design](../02-design/DESIGN.md) |
| نمط المستودع | npm workspaces monorepo |

---

## 1. الأهداف المعمارية

1. بناء Prototype لكل الوحدات بعقود وfixtures يمكن استبدالها بخدمات حقيقية.
2. الحفاظ على العربية وRTL/LTR في الجذر لا كطبقة لاحقة.
3. منع تداخل domain logic مع مكونات العرض.
4. تمثيل streaming وruns والموافقات والتكلفة كحالات فعلية.
5. إبقاء server/client boundaries واضحة وتقليل JavaScript غير اللازم.
6. دعم الاختبار والوصولية والـvisual QA من البداية.
7. السماح بإضافة AI Gateway وBackend تدريجيًا دون إعادة كتابة الواجهة.

---

## 2. التقنية الأساسية

لقطة الإصدارات المرجعية عند بدء المشروع:

| التقنية | الإصدار المرجعي | القرار |
|---|---:|---|
| Node.js | `20.20.x` في البيئة الحالية | الحد الأدنى يثبت في `engines` بعد تحقق Next |
| Next.js | `16.3.4` | App Router |
| React | `19.3.0` | Server Components افتراضيًا |
| TypeScript | `7.0.2` | `strict` وكامل فحوص الحدود |
| Tailwind CSS | `4.3.3` | utilities فوق semantic CSS variables، لا palette عشوائية |
| Zod | `4.6.2` | runtime contracts |
| MSW | `2.15.0` | mock transport في browser/tests |
| Radix UI | حزم primitives مثبتة | dialogs/menus/tabs وغيرها |
| Lucide React | `1.1.23` | icon baseline |
| XYFlow | `12.11.6` | Flow canvas في Wave 4 |
| Vitest | `4.1.11` | unit/component logic؛ خط Node 20 بعد إصلاح advisories المعروفة في 4.1.10 وما قبل |
| Playwright | `1.63.0` | E2E/visual/browser verification |

الإصدارات تُثبت في lockfile ولا تستخدم `latest` في CI. قبل كل ترقية major تُراجع release notes وتُشغل الاختبارات.

---

## 3. بنية المستودع

```text
nasaq-ai/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── [locale]/
│       │   │   ├── (marketing)/
│       │   │   ├── (auth)/
│       │   │   └── app/
│       │   ├── api/                 # prototype handlers only when useful
│       │   ├── global-error.tsx
│       │   └── not-found.tsx
│       ├── components/
│       │   ├── app-shell/
│       │   ├── domain/
│       │   └── marketing/
│       ├── features/
│       │   ├── chat/
│       │   ├── projects/
│       │   ├── agents/
│       │   ├── runs/
│       │   ├── flows/
│       │   ├── knowledge/
│       │   ├── models/
│       │   ├── usage/
│       │   └── team/
│       ├── lib/
│       │   ├── api/
│       │   ├── auth/
│       │   ├── analytics/
│       │   └── observability/
│       ├── styles/
│       └── tests/
├── packages/
│   ├── ui/                           # primitives + domain-neutral patterns
│   ├── contracts/                    # schemas/types/status transitions
│   ├── mock-api/                     # fixtures, handlers, event simulator
│   ├── i18n/                         # dictionaries, glossary, locale helpers
│   └── config/                       # tsconfig/eslint/test shared config
├── assets/
├── docs/
└── tools/
```

### قاعدة الملكية

- `packages/ui`: لا يعرف Chat أو Agent أو Workspace.
- `components/domain`: مكونات مجال مشتركة مثل `ModelBadge` و`RunStatus`.
- `features/*`: use cases، queries، forms، adapters الخاصة بالوحدة.
- `app/*`: تركيب routes/layouts فقط؛ لا business logic كبير.
- `packages/contracts`: المصدر الوحيد للحالات والعقود العابرة.
- `packages/mock-api`: لا يستورد React.

---

## 4. App Router وServer/Client boundaries

### Server Components افتراضيًا

تستخدم لـ:

- layouts الثابتة.
- marketing content.
- route-level data snapshot عندما يوجد Backend.
- metadata وlocale dictionary bootstrap.
- authorization redirect الأولي مستقبلًا.

### Client Components عند الحاجة فقط

تستخدم لـ:

- composer وstreaming.
- drawers/dialogs/menus التفاعلية.
- builders وcanvas.
- optimistic UI.
- browser-only mock worker.
- keyboard shortcuts والdrag/drop.

### قواعد boundary

1. لا تضف `'use client'` إلى layout كامل بسبب زر واحد؛ اعزل الزر.
2. props العابرة للحد server/client serializable.
3. secrets/env server-only لا تستوردها ملفات client.
4. model/provider adapters الحقيقية لا تدخل bundle الواجهة.
5. browser MSW development-only ولا يعمل في production الحقيقي.

---

## 5. Routing واللغة

- route segment `[locale]` يقبل `ar|en` فقط.
- `/` يعيد التوجيه server-side إلى locale محفوظ/مكتشف، مع `ar` fallback.
- dictionaries مقسمة حسب namespace/feature لتجنب تحميل كل النصوص.
- `dir` يشتق من locale على `<html>`.
- helpers تولد روابط تحتفظ بالlocale.
- `notFound()` للlocale غير الصالح أو redirect آمن وفق السياق.
- صفحات التطبيق `noindex`، والتسويق يملك canonical/hreflang.

### ممنوع

- string UI أساسي داخل component مباشرة.
- استخدام CSS left/right دون مبرر موثق.
- تغيير ترتيب DOM بصريًا بطريقة تكسر focus.
- إدخال prompt أو secret في URL.

---

## 6. طبقات البيانات

```text
Route / Component
      ↓
Feature hook / server query
      ↓
Typed API client interface
      ↓
Transport adapter
  ├── MSW/mock transport (Prototype)
  └── HTTP/SSE transport (Backend)
      ↓
Zod parse at boundary
```

### القاعدة الأساسية

لا تستورد الشاشة fixture مباشرة. تستدعي interface كما لو كانت خدمة حقيقية؛ mock handler يعيد contract نفسه.

### القراءة

- Server snapshot عندما يفيد SSR.
- query cache للبيانات المتغيرة في client.
- cursor pagination للقوائم الطويلة.
- normalized IDs عند الربط، دون بناء client database معقد مبكرًا.

### الكتابة

- command functions بأسماء أفعال: `sendMessage`, `approveAction`, `publishFlow`.
- idempotency key للأفعال المكلفة والحساسة.
- optimistic UI فقط عندما rollback واضح ولا يزيف النجاح.
- invalidation دقيقة، لا refresh كامل.

---

## 7. إدارة الحالة

### ترتيب الاختيار

1. URL: filter/tab/selected resource القابل للمشاركة.
2. Server/query cache: الموارد والحقيقة القادمة من API.
3. Component state: UI محلي قصير العمر.
4. Context محدود: locale/theme/shell/workspace snapshot.
5. Reducer/machine: composer، builders، mock runs ذات انتقالات واضحة.
6. Store عالمي إضافي فقط إذا أثبتت الحاجة.

### ممنوع

- نسخ server data إلى global store بلا سبب.
- boolean soup مثل `isLoading/isRunning/isDone/isFailed` يمكن أن تتعارض؛ استخدم discriminated union `status`.
- Context واحد لكل التطبيق يعيد rendering للجميع.

---

## 8. Streaming وRealtime

### واجهة transport

```ts
type EventStream<TEvent> = {
  subscribe(handlers: StreamHandlers<TEvent>): () => void;
  reconnect?(cursor: string): void;
  close(): void;
};
```

### Prototype

- deterministic event scheduler.
- seed/fixture يحدد النجاح أو الفشل أو الانقطاع.
- يدعم pause/stop/reconnect simulation.
- timestamps من clock injectable في الاختبارات.

### Backend

- SSE أولًا للresponses/run events؛ WebSocket فقط إذا أثبت التفاعل ثنائي الاتجاه حاجة.
- event `sequence` و`cursor` للاستئناف.
- snapshot endpoint عند gap.
- AbortController للإلغاء في client، مع حالة `cancel_requested` حتى تأكيد الخادم.

---

## 9. Contracts وruntime validation

- كل response خارجي يمر Zod في boundary development/test، وبسياسة مناسبة للإنتاج.
- أنواع UI لا تعيد تعريف الكيان.
- enums مستخرجة من schema أو constants مشتركة.
- dates strings ISO عند النقل، وتتحول في formatter فقط.
- money integer minor units + currency.
- usage quantities decimal-safe/string عند الحاجة.
- errors وفق envelope موحد.

التفاصيل في `CONTRACTS.md`.

---

## 10. Mock API

### أهدافه

- محاكاة المنتج، لا مجرد إرجاع JSON ثابت.
- دعم الحالات الواردة في `SCREEN-INVENTORY.md`.
- نفس endpoint shapes المتوقعة من Backend.
- تشغيل مستقل في browser وVitest وPlaywright.

### الوضع

```text
NEXT_PUBLIC_DATA_MODE=mock | api
NEXT_PUBLIC_MOCK_SCENARIO=happy | degraded | quota | viewer | dense
```

`NEXT_PUBLIC_*` لا يحمل أسرارًا.

### fixtures

- IDs ثابتة وقابلة للقراءة في الاختبار.
- clock ثابت أو قابل للحقن.
- العربية والإنجليزية والنص المختلط.
- data builders لمنع نسخ fixtures ضخمة.
- ممنوع `Math.random()` غير seeded في E2E.

---

## 11. Design System implementation

### الطبقات

1. CSS primitive tokens.
2. semantic theme tokens.
3. Radix-based accessible primitives.
4. composed UI patterns.
5. domain components.
6. feature compositions.

### Tailwind

- utilities تستخدم semantic variables مثل `bg-surface` و`text-muted`.
- لا قيم hex داخل JSX.
- arbitrary values استثناء ومراجعة.
- class composition عبر helper موحد.
- component variants عبر أداة typed صغيرة عند الحاجة.

### Components catalog

في المرحلة الأولى يبنى development-only Component Lab داخل التطبيق أو Storybook، بشرط أن يغطي:

- كل primitive state.
- RTL/LTR.
- Light/Dark.
- keyboard/a11y.
- domain status/cost/approval/run components.

---

## 12. Forms

- React Hook Form أو نمط مكافئ + Zod resolver عند النماذج المعقدة.
- server error mapping إلى field/form.
- dirty state وتحذير مغادرة builders.
- autosave debounced + version conflict.
- secrets لا تدخل localStorage أو error telemetry.
- submit commands idempotent عند الحاجة.

---

## 13. Error handling

### مستويات

1. field error.
2. inline surface error.
3. route error boundary.
4. global fatal boundary.
5. background operation notification.

### Error object

يحمل `code`, `messageKey`, `retryability`, `correlationId?`, `fieldErrors?`, `details?` المنقحة.

- لا raw provider message للمستخدم.
- لا catch صامت.
- retry action يعرف هل يكرر command أو يجلب snapshot فقط.
- unknown outcome يدخل reconciliation.

---

## 14. الصلاحيات في الواجهة

- API هو الحكم؛ UI يحسن الفهم فقط.
- permission snapshot يولد `can(action, resource)`.
- hidden للأفعال غير المناسبة كليًا، disabled + reason عندما يحتاج المستخدم معرفة وجودها.
- 403 بعد race يعالج دون فقد draft.
- preview-as-role development tool لا يغير authorization الحقيقي.

التفاصيل في `PERMISSIONS.md`.

---

## 15. الأمان

### Client rules

- لا credentials أو provider secrets في client state المستمر.
- لا `dangerouslySetInnerHTML` لمحتوى النموذج دون sanitizer/renderer آمن.
- markdown links مقيدة schemes، وexternal links آمنة.
- file previews sandboxed حسب النوع.
- CSP وheaders عند Backend deployment.
- no prompt/response/file name في analytics الافتراضية.
- source/tool output يعامل untrusted data.

### Dependency rules

- lockfile committed.
- no install scripts غير مراجعة لحزم عالية المخاطر.
- dependency diff/review.
- لا إضافة package لوظيفة صغيرة يمكن تنفيذها بوضوح.

---

## 16. Analytics وObservability

### Analytics interface

```ts
track(eventName, propertiesWithoutContent)
identify(userId, safeTraits)
page(routeId)
```

- event names من contract مشترك.
- dev logger للتحقق.
- consent/region policy قبل مزود خارجي.
- prompts/responses excluded.

### Frontend observability

- route errors.
- web vitals.
- stream disconnect/reconnect.
- contract parse failure.
- correlation ID في support copy.
- source maps خاصة ومحمية.

---

## 17. الاختبارات

### Unit

- formatters.
- permission evaluator.
- state transition guards.
- cost/usage formatting.
- i18n/bidi helpers.

### Component

- primitives keyboard/focus.
- Model Picker.
- Composer.
- Approval Request.
- Run Timeline.
- Flow node/inspector.

### Integration

- feature + MSW handlers.
- errors/permission/quota.
- streaming/reconnect.

### E2E

المسارات `E2E-001..012` في Screen Inventory.

### Accessibility

- axe في component وE2E.
- manual keyboard.
- screen reader للمسارات الحرجة.
- visual RTL regression.

---

## 18. الأداء

### budgets الأولية

- route-level code splitting.
- لا تحميل XYFlow على Chat/Home.
- لا تحميل chart library قبل Usage.
- dynamic import للeditors/viewers الثقيلة.
- images محلية ومحسنة.
- long lists virtualized عند threshold مقاس.
- streaming updates batched دون تأخير ملحوظ.

### قياس

- production build لا dev.
- Web Vitals.
- React profiler للحالات الطويلة.
- bundle analyzer في release gate.
- Playwright trace عند jank.

---

## 19. الاعتمادية والتدرج

- feature flags للوحدات الحقيقية: `realChat`, `realAgents`, `realBilling`.
- لا mixed mock/real داخل العملية الواحدة دون badge واضح.
- provider degradation لا يسقط shell.
- offline يحفظ drafts غير الحساسة فقط.
- forms الطويلة تملك local recovery policy موثقة.

---

## 20. Environment configuration

```text
NODE_ENV
NEXT_PUBLIC_APP_ENV
NEXT_PUBLIC_DATA_MODE
NEXT_PUBLIC_MOCK_SCENARIO
NEXT_PUBLIC_DEFAULT_LOCALE
NEXT_PUBLIC_ENABLED_LOCALES
```

لاحقًا server-only:

```text
DATABASE_URL
AUTH_*
KMS_*
PROVIDER_*
PAYMENT_*
OBSERVABILITY_*
```

- `.env.example` دون قيم حقيقية.
- validation عند startup.
- client/server env schemas منفصلة.

---

## 21. CI pipeline المقترح

```text
install locked
→ lint
→ typecheck
→ unit/component tests
→ contracts/fixtures validation
→ build
→ Playwright smoke (ar/en)
→ accessibility scan
→ visual regression critical screens
→ dependency/security checks
```

لا تمرر CI لأن test لم يعمل؛ skipped يحتاج سببًا مسجلًا.

---

## 22. Naming conventions

- React component: `PascalCase`.
- hooks: `useVerbNoun`.
- commands: `verbNoun` مثل `publishFlow`.
- query keys typed factory.
- files: `kebab-case.tsx`، ما عدا Next conventions.
- schemas: `thingSchema`, type `Thing` مستخرج.
- IDs: prefixes مثل `ws_`, `prj_`, `cnv_`, `run_` في fixtures.
- route IDs تبقى من Sitemap للاختبار/analytics.

---

## 23. قواعد الاستيراد

```text
app → features/components/packages
features → domain components/ui/contracts/i18n
components/domain → ui/contracts/i18n
ui → لا features ولا app
contracts → لا React ولا browser
mock-api → contracts فقط + utilities غير browser-specific
```

تطبق boundaries عبر ESLint عندما يكبر الكود.

---

## 24. مراحل التنفيذ المعمارية

### A. Foundation

- workspace/package files.
- config وTypeScript.
- tokens/globals/fonts.
- i18n routes.
- ui primitives.
- contracts core.
- mock boot.

### B. Shell

- marketing/auth/app layouts.
- sidebar/topbar/mobile nav.
- theme/locale/workspace context.
- error/loading/not-found.

### C. Core product

- Home/Projects/Chat/Compare.
- streaming simulator.
- cost/model components.

### D. Execution

- Agents/Runs/Approvals.
- Flow.
- Knowledge.

### E. Administration

- Usage/Billing/Team/Settings.
- full tests/a11y/visual.

---

## 25. قرارات مؤجلة عمدًا

- اعتماد TanStack Query من أول يوم أو بعد أول API فعلي؛ interface يبقى ثابتًا.
- XState مقابل reducers typed؛ لا نضيف runtime قبل قياس التعقيد.
- Storybook مقابل internal Component Lab.
- chart library.
- rich-text editor.
- public package publishing.
- micro-frontends: مرفوضة حاليًا إلا إذا ظهرت فرق مستقلة فعلًا.

---

## 26. معايير قبول المعمارية

- [x] `npm ci` يعمل من lockfile باستخدام `npm@11.6.4` المعلن.
- [x] `npm run dev` يفتح `/ar` و`/en`.
- [x] `npm run typecheck`, `test`, `build` معرفة وناجحة في Wave 1.
- [x] contracts لا تستورد React.
- [x] الشاشات لا تستورد fixtures مباشرة.
- [x] locale/dir من route ويعملان في root.
- [x] tokens semantic ولا hex عشوائي داخل JSX الشاشات.
- [x] no secrets في client/env example.
- [x] mock streaming والإلغاء deterministic.
- [ ] error/permission/quota states قابلة للاختبار — تُعمّق مع كل وحدة.
- [x] لا يحمل Home مكتبات Flow/charts الثقيلة.
- [ ] lint boundaries تضاف قبل توسع features؛ اختبارات المسارات الحرجة موجودة في Playwright.
