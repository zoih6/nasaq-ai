# أدوات التقرير

## إعادة توليد التقرير

```bash
cd /home/user/research/agent-skills-web-uiux
python -m pip install -r tools/requirements.txt
python tools/render-report.py
```

يقرأ السكربت نسخة Markdown من `report/current/` ويكتب HTML في المجلد نفسه.
