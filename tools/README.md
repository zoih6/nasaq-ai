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
