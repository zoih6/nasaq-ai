# مكتبة بحث Agent Skills وUI/UX

> **الحالة:** مكتملة  
> **الإصدار المعتمد:** 1.1  
> **تاريخ لقطة التدقيق:** 11 سبتمبر 2026

## التقرير المعتمد

- [التقرير المصمم — HTML](report/current/agent-skills-web-uiux-report-ar.html)
- [التقرير — Markdown](report/current/agent-skills-web-uiux-report-ar.md)
- [بصمات الإصدار الحالي](report/current/checksums.sha256)

## تنظيم المكتبة

```text
agent-skills-web-uiux/
├── report/
│   ├── current/             ← الإصدار المعتمد فقط
│   └── archive/             ← النسخ السابقة وبصمات ما قبل التنظيم
├── sources/
│   ├── original/            ← المادة التي رفعها المستخدم
│   └── extracts/            ← مقتطفات المهارات المدققة
├── audits/
│   ├── repository/          ← SHAs، metadata، الأشجار ونتائج فحص المستودعات
│   ├── validation/          ← نتائج skills-ref والمواصفة
│   ├── links/               ← فحص الروابط
│   ├── security/            ← تدقيق سطح التنفيذ والأمان
│   └── content/             ← outlines وREADME/features
├── working/                 ← مادة دمج وسيطة غير معتمدة كتقرير مستقل
└── tools/                   ← مولد HTML ومتطلباته
```

## نتائج التدقيق المحفوظة

- 36 ملفًا اختبرت بالمواصفة المرجعية: **25 PASS و11 FAIL**.
- 117 رابطًا فريدًا؛ لا توجد روابط 404 في اللقطة.
- 21 مستودعًا إضافيًا دُققت بعد دمج المصدر المرفق.
- تحذير Rosmarinus الأمني محفوظ في التقرير وتدقيق الأمان؛ لا تشغّل الملف التنفيذي المشار إليه.

## إعادة توليد HTML

```bash
cd /home/user/research/agent-skills-web-uiux
python -m pip install -r tools/requirements.txt
python tools/render-report.py
```

لا تُعدّل `sources/original/` أو `audits/` لتجميل النتائج؛ عند تحديث البحث أنشئ لقطة مؤرخة جديدة وحدّث التقرير الحالي بعد التحقق.
