# إيصال تحقق Wave 1 — نَسَق AI

**التاريخ:** 2026-09-11  
**النطاق:** الأساس التفاعلي للواجهة، App Shell، Marketing، Home Command Center، Chat prototype، ومسارات جميع الوحدات  
**البيئة المتحققة:** Node.js `20.20.2` + npm `11.6.4`

## 1. ما أُنجز

- مساران كاملان `ar` و`en` مع `RTL/LTR` مشتقين من عنوان الصفحة.
- Marketing surface تعرّف سلسلة القيمة: **Chat → Agent → Flow**.
- App Shell متجاوب مع تنقل مكتبي وهاتفي، تبديل لغة يحفظ المسار، تبديل مساحة، إشعارات، طي الشريط، ولوحة أوامر.
- لوحة أوامر مبنية على Radix Dialog مع حبس تركيز، إغلاق بـEscape، وإعادة التركيز إلى الزر المشغّل.
- Home Command Center مرتبط بعقد Zod وdata boundary، ويعرض التشغيلات والموافقة والرصيد والمشاريع والنماذج.
- Chat prototype محلي: starter prompts، اختيار نموذج تجريبي، مقارنة، مرفق، streaming حتمي، إيقاف وإعادة ضبط، وإيصال تكلفة تجريبي.
- صفحات عربية وإنجليزية لكل وحدات التنقل: Projects, Agents, Flows, Knowledge, Models, Runs, Usage, Team, Settings.
- Favicon محلي وخطوط محلية؛ لا تعتمد الواجهة على CDN أو أسرار أو API خارجي.

## 2. حل تثبيت الاعتمادات

فشل npm `10.8.2` داخل Arborist عند peer resolution. ثُبّتت الاستراتيجية القابلة لإعادة الإنتاج كالتالي:

- package manager: `npm@11.6.4`، وهو متوافق مع Node 20 الحالي.
- تصحيح `lucide-react` إلى الإصدار الموجود `1.44.0`.
- تثبيت Vitest `4.1.11`: متوافق مع Node 20 ويتضمن إصلاح advisories التي أثرت على `4.1.10` وما قبل.
- تثبيت ESLint `9.39.5` بسبب توافق `eslint-plugin-react` الحالي؛ ESLint 10 كان يكسر rule loading.
- إنشاء `package-lock.json` صالح وتشغيل `npm audit` دون ثغرات معروفة.

أمر التثبيت المعتمد:

```bash
npx -y npm@11.6.4 ci
```

## 3. بوابات الجودة المنفذة

| البوابة | النتيجة | التفاصيل |
|---|---:|---|
| ESLint | ناجح | جميع workspaces، بلا أخطاء أو تحذيرات في آخر تشغيل |
| TypeScript strict | ناجح | web + contracts + i18n + mock-api + ui |
| Vitest | ناجح | ملف واحد، 4 اختبارات عقود/locale/fixture |
| Playwright | ناجح | 6 حالات E2E على Chromium |
| Route smoke | ناجح | 24 عنوانًا عربيًا/إنجليزيًا داخل اختبار E2E واحد |
| Responsive | ناجح | سطحا Marketing وHome عند `390×844` بلا overflow أفقي |
| Accessibility gate | ناجح | لا مخالفات Axe من درجتي serious/critical على Marketing وHome المكتبي والهاتف |
| Production build | ناجح | جميع مسارات locale تم prerender لها بنجاح |
| npm audit | ناجح | `0 vulnerabilities` |

## 4. إصلاحات خرجت من التحقق الحقيقي

- رفع تباين النصوص الثانوية وأرقام مراحل Marketing إلى WCAG AA.
- تحويل مؤشر الميزانية إلى `progressbar` صحيح مع `aria-valuenow/min/max`.
- إضافة أسماء وصول لأزرار الإغلاق، وزر إغلاق صريح للتنقل الهاتفي.
- استبدال command dialog اليدوي بـRadix Dialog لإدارة التركيز ولوحة المفاتيح.
- فصل اختبارات Playwright عن glob الخاص بـVitest.
- إزالة gradients وbackdrop blur حتى يظل التصميم مطابقًا لاتجاه **Precision Workspace** بلا glassmorphism.
- إضافة `prefers-reduced-motion`، skip link، وتحقق فعلي من RTL/LTR.

## 5. اختبارات Playwright المغطاة

1. Marketing العربي: الرسالة الأساسية + CTA + اتجاه RTL + Axe.
2. Home الإنجليزي: اتجاه LTR + تبديل اللغة مع حفظ deep link.
3. Command Center: تشغيلات + موافقة + تكلفة + command palette + focus restoration + Axe.
4. Chat: starter → prompt → send → simulated streaming → completed receipt.
5. الهاتف: no horizontal overflow + bottom navigation + فتح/إغلاق كامل التنقل + Axe.
6. جميع الصفحات العامة وصفحات التطبيق بالعربية والإنجليزية دون page errors.

## 6. أدلة بصرية

- [`evidence/wave-1-marketing-ar.png`](evidence/wave-1-marketing-ar.png)
- [`evidence/wave-1-command-center-ar.png`](evidence/wave-1-command-center-ar.png)
- [`evidence/wave-1-chat-ar.png`](evidence/wave-1-chat-ar.png)
- [`evidence/wave-1-marketing-mobile-ar.png`](evidence/wave-1-marketing-mobile-ar.png)
- [`evidence/wave-1-command-center-mobile-ar.png`](evidence/wave-1-command-center-mobile-ar.png)

## 7. حدود Wave 1 المعلنة

- لا توجد مفاتيح حقيقية أو مدفوعات أو اتصالات مزودين أو تنفيذ أدوات.
- بيانات التشغيلات والتكلفة والموافقة mock وموسومة بوضوح كبيانات تجريبية.
- عمق التفاعل المكتمل حاليًا متركز في Shell وHome وChat؛ صفحات الوحدات الأخرى contract-backed scaffolds جاهزة للتعميق في الموجة التالية.
- لم يُنفذ بعد فحص يدوي بقارئ شاشة فعلي، ولا مصفوفة Firefox/WebKit؛ بوابة المتصفح الحالية Chromium + Axe.

## 8. أوامر إعادة التحقق

```bash
npx -y npm@11.6.4 ci
npx -y npm@11.6.4 run check
npx playwright install chromium
npx -y npm@11.6.4 run test:e2e
npx -y npm@11.6.4 audit --audit-level=moderate
```

## 9. قرار الانتقال

**Wave 1 مقبولة تقنيًا كأساس واجهة تفاعلي قابل للتشغيل.**  
الموجة التالية تعمّق المسار الرأسي **Chat → Agent → Flow → Run/Approval receipt**، ثم تضيف حالات التفاصيل والإنشاء/التعديل لكل وحدة دون تغيير عقود الأساس.
