# أدوات المشروع

## توليد وثيقة الرؤية

```bash
cd /home/user/projects/nasaq-ai
python -m pip install -r tools/requirements.txt
python tools/render-vision.py
```

المصدر في `docs/00-vision/*.md`، والمخرج HTML بجواره.

## توليد وثيقة PRD

```bash
cd /home/user/projects/nasaq-ai
python -m pip install -r tools/requirements.txt
python tools/render-prd.py
```

المصدر والمخرج في `docs/01-product/`.

## صحة المساحة (workspace hygiene)

```bash
bash tools/workspace-hygiene.sh status          # تقرير وزن المساحة (قراءة فقط)
bash tools/workspace-hygiene.sh clean           # حذف المخارج المولّدة فقط
bash tools/workspace-hygiene.sh clean --deps    # مع node_modules
bash tools/workspace-hygiene.sh clean --all     # مع المتصفحات (نهاية كل مهمة)
bash tools/workspace-hygiene.sh browsers        # أوامر تثبيت متصفحات Playwright خارج المساحة
```

`node_modules` ومتصفحات Playwright و`​.next` و`test-results` كلها مولّدة ومتجاهَلة في Git، ولا تُحفظ في اللقطة؛ تتراكم داخل المساحة أثناء العمل وتُبطئ فتحها. استخدم `status` قبل العمل الثقيل، ويُنهى **كل** مهمة بالأمر `clean --all` حتى لا تبقى مخلفات ثقيلة في المساحة.
