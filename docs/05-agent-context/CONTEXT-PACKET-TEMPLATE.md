# Context Packet Template

> **الغرض:** تسليم وكيل جديد أقل سياق كافٍ لتنفيذ مهمة واحدة قابلة للتحقق، دون تمرير سجل المحادثة أو كامل المستودع أو التقارير التاريخية.
>
> **قاعدة:** هذا القالب لا يمنح صلاحيات جديدة. `file_allowlist` و`external_actions` و`approval_required` ملزمة، وأي تعارض يُحال إلى `AGENTS.md` ثم عقد المشروع ثم موافقة المستخدم.

## Packet metadata

| الحقل | القيمة |
|---|---|
| `schema_version` | `1.0` |
| `packet_id` | `CP-YYYYMMDD-NNN` |
| `created_at` | `YYYY-MM-DDTHH:mm:ssZ` |
| `expires_at` | `YYYY-MM-DDTHH:mm:ssZ` |
| `owner` | اسم الوكيل/المنسق |
| `parent_task` | معرّف المهمة |
| `repository` | `zoih6/nasaq-ai` |
| `base_commit` | SHA كامل |
| `branch` | اسم الفرع |

## 1. Objective

**المطلوب في جملة واحدة:**

> [فعل قابل للتحقق + النطاق + نتيجة التسليم]

**Definition of done:**

- [شرط قابل للقياس 1]
- [شرط قابل للقياس 2]
- [ملف/manifest/receipt المطلوب]

## 2. Scope and boundaries

**In scope:**

- [الملف/الوحدة/السلوك المسموح]

**Out of scope:**

- Backend، قاعدة البيانات، provider/live search، secrets، auth، deploy، حذف واسع، أو أي نطاق غير مذكور صراحة.

**Truth boundary:**

- هل العمل محاكاة حتمية، قراءة فقط، أم تنفيذ حي؟
- ما الذي يجب أن يظهر للمستخدم بوصفه `simulated` أو `not implemented`؟

## 3. Current state

- **الحالة الحالية:** [وصف قصير]
- **آخر دليل موثوق:** [رابط ملف/manifest + SHA]
- **المخاطر المفتوحة:** [قائمة قصيرة]
- **القرارات الملزمة:** [D-xxx، عقد، أو سياسة]

لا تُرسل نسخًا كاملة من التقارير القديمة؛ اربط بها فقط إذا احتاجها الاختبار الحالي.

## 4. Required context

اقرأ بالترتيب، وبالأجزاء المطلوبة فقط:

1. `AGENTS.md`
2. `docs/05-agent-context/CURRENT-STATE.md`
3. هذا الـpacket
4. العقد/المواصفة ذات الصلة
5. ملفات التنفيذ المدرجة في `file_allowlist`
6. الاختبارات المدرجة في `tests_to_run`

**لا تقرأ تلقائيًا:** كامل `WORKLOG.md`، التقارير التاريخية، كل `docs/`، أو كل ملفات skills. اطلب مقتطفًا محددًا عند الحاجة.

## 5. File allowlist

**يمكن القراءة والتعديل فقط:**

```text
- path/to/allowed-file.ts
- path/to/allowed-test.spec.ts
- path/to/allowed-doc.md
```

**ممنوع التعديل:**

```text
- package-lock.json (إلا بإذن صريح)
- .env* وsecrets
- generated evidence السابقة
- ملفات خارج المهمة
```

## 6. Execution plan

| الترتيب | الإجراء | بوابة الخروج |
|---:|---|---|
| 1 | قراءة العقد والاختبار المتأثر | فهم قابل للتلخيص |
| 2 | تنفيذ أصغر تعديل | diff محدود |
| 3 | تشغيل `tests_to_run` | PASS/FAIL موثق |
| 4 | فحص lint/typecheck المتأثر | لا أخطاء جديدة |
| 5 | تحديث مصدر الحقيقة | حالة صادقة فقط |
| 6 | تنظيف workspace | `LIGHT` |

## 7. Tests and evidence

**Tests to run first (affected-first):**

```bash
# ضع الأوامر المحددة فقط
```

**Tests gated until release or shared-boundary change:**

```text
full check / build / cross-browser / production smoke
```

**Evidence required:**

- `requirement_ids`: [U2-XXX-001]
- `manifest_path`: [path]
- `receipt_fields`: [commit, route, locale, viewport, status]
- لا تكتب `PASS` إذا كانت النتيجة `flaky`, `UNVERIFIED`, أو تحتاج مراجعة بشرية.

## 8. Permissions and external actions

| الفعل | مسموح؟ | ملاحظة |
|---|---|---|
| تعديل الملفات المدرجة | نعم | ضمن allowlist فقط |
| تشغيل اختبارات محلية | نعم | affected-first |
| تثبيت dependency | لا افتراضيًا | يحتاج سببًا ومراجعة |
| commit | [نعم/لا] | حسب الطلب |
| push | [نعم/لا] | تأكيد صريح عند كل مهمة |
| deploy/publish | لا | موافقة مستقلة |
| حذف بيانات/ملفات متتبعة | لا | توقف واطلب توجيهًا |
| تكامل خارجي أو live provider | لا | لا يتحول إلى محاكاة بصمت |

## 9. Output contract

أعد ملخصًا لا يتجاوز صفحة واحدة:

```text
status: PASS | PARTIAL | FAIL | BLOCKED | UNVERIFIED
base_commit: <sha>
changed_files: [..]
tests:
  - command: <command>
    result: PASS | FAIL | FLAKY | NOT_RUN
    summary: <one line>
evidence: [paths]
open_gates: [..]
risks: [..]
next_action: <one sentence>
workspace: LIGHT | HEAVY
```

**لا تُلصق logs كاملة.** احفظها كartifact مؤقت، وأرسل رقم الاختبارات وسبب الفشل والأسطر الحاسمة فقط.

## 10. Handoff checklist

قبل التسليم:

- [ ] `git diff --check` ناجح.
- [ ] لا توجد ملفات خارج allowlist.
- [ ] كل نتيجة موصوفة PASS/FAIL/FLAKY/UNVERIFIED بصدق.
- [ ] تم تحديث `CURRENT-STATE.md` أو الملف canonical المطلوب فقط.
- [ ] تم تسجيل القرار الجديد في `DECISIONS.md` عند الحاجة.
- [ ] تم إنشاء/تحديث manifest عند تغيير evidence.
- [ ] لا توجد خوادم أو متصفحات أو build artifacts عالقة.
- [ ] `bash tools/workspace-hygiene.sh clean --all` أعاد `LIGHT`.
- [ ] لم يحدث commit/push إلا إذا كانا ضمن التفويض.

## Example: U2.2 stability packet

```yaml
schema_version: "1.0"
packet_id: CP-20260913-U22-STABILITY
objective: "تحديد سبب flaky في Research E2E دون تعديل سلوك المنتج بلا دليل"
base_commit: 5b5a671926ebfefb529d606ba731d5d60bb51804
in_scope:
  - tools/run-research-e2e.sh
  - apps/web/tests/e2e/service-research.spec.ts
  - docs/05-agent-context/CURRENT-STATE.md
file_allowlist:
  - tools/run-research-e2e.sh
  - apps/web/tests/e2e/service-research.spec.ts
  - docs/05-agent-context/CURRENT-STATE.md
tests_to_run:
  - "cd apps/web && npx vitest run tests/u2-research-state.test.ts tests/u2-research-integration.test.ts tests/u2-boundaries.test.ts"
  - "bash tools/run-research-e2e.sh"
external_actions:
  push: false
  deploy: false
truth_boundary: "Frontend-only deterministic simulation; no live provider/search"
open_gates:
  - "E2E retries must be explained or removed"
  - "manual keyboard/screen-reader review"
```

> **المبدأ:** الوكيل لا يحتاج أن يعرف كل شيء؛ يحتاج أن يعرف الشيء الصحيح، والحدود الصحيحة، وطريقة إثبات النتيجة.
