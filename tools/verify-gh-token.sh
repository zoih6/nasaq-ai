#!/usr/bin/env bash
# Diagnose a GitHub token locally WITHOUT ever printing it.
#
# usage:
#   bash tools/verify-gh-token.sh                 # reads GITHUB_TOKEN_TEST or prompts silently
#   bash tools/verify-gh-token.sh --api-only
#   bash tools/verify-gh-token.sh --repo zoih6/nasaq-ai
#
# prints: length, format check, sha256 fingerprint (first 16 hex), API result, git result.
# never prints the token itself, and never writes it to disk.

set -u
REPO="zoih6/nasaq-ai"
API_ONLY="no"
while [ $# -gt 0 ]; do
  case "$1" in
    --api-only) API_ONLY="yes"; shift ;;
    --repo) REPO="${2:-$REPO}"; shift 2 ;;
    *) shift ;;
  esac
done

TOKEN="${GITHUB_TOKEN_TEST:-}"
if [ -z "$TOKEN" ]; then
  printf 'الصق التوكن (لن يظهر أثناء الكتابة): '
  read -rs TOKEN
  printf '\n'
fi
[ -z "$TOKEN" ] && { echo "لا يوجد توكن."; exit 2; }

LEN=${#TOKEN}
FP=$(printf '%s' "$TOKEN" | sha256sum | cut -c1-16)
FMT="غير معروف"
case "$TOKEN" in
  github_pat_*) FMT="fine-grained PAT (github_pat_)" ;;
  ghp_*)        FMT="classic PAT (ghp_)" ;;
  gho_*)        FMT="OAuth / gh CLI (gho_)" ;;
  ghs_*)        FMT="GitHub App server-to-server (ghs_)" ;;
esac
ASCII_OK="نعم"
printf '%s' "$TOKEN" | LC_ALL=C grep -q '[^A-Za-z0-9_]' && ASCII_OK="لا (يحتوي محارف غير مسموحة)"

echo "──────────────────────────────────────────────"
echo "الطول            : $LEN  (fine-grained PAT الصحيح = 93)"
printf 'النوع            : %s\n' "$FMT"
printf 'محارف سليمة      : %s\n' "$ASCII_OK"
echo "بصمة SHA-256     : $FP  (أول 16 خانة — لا تكشف التوكن)"
echo "──────────────────────────────────────────────"

echo -n "API api.github.com/user            : "
CODE=$(curl -s -o /tmp/ghvt.json -w '%{http_code}' -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" -H "User-Agent: nasaq-token-check" https://api.github.com/user)
echo "HTTP $CODE"
if [ "$CODE" = "200" ]; then
  python3 -c "
import json
d=json.load(open('/tmp/ghvt.json'))
print('  ✔ التوكن صالح — الحساب:', d.get('login'), '| النوع:', d.get('type'))
" 2>/dev/null
else
  python3 -c "
import json
try:
    d=json.load(open('/tmp/ghvt.json')); print('  ✖ الرسالة من GitHub:', d.get('message'))
except Exception: print('  ✖ تعذر قراءة الرد')
" 2>/dev/null
fi

echo -n "قراءة المستودع $REPO      : "
CODE2=$(curl -s -o /tmp/ghvt2.json -w '%{http_code}' -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" -H "User-Agent: nasaq-token-check" "https://api.github.com/repos/$REPO")
echo "HTTP $CODE2"
[ "$CODE2" = "404" ] && echo "  (التوكن صالح لكن لا صلاحية وصول لهذا المستودع، أو اسمه/مالكه غير صحيح)"

if [ "$API_ONLY" = "no" ]; then
  echo -n "git push-ability (ls-remote)       : "
  if GIT_TERMINAL_PROMPT=0 git ls-remote "https://oauth2:${TOKEN}@github.com/${REPO}.git" >/dev/null 2>&1; then
    echo "OK — يستطيع القراءة/الدفع عبر HTTPS"
  else
    echo "فشل — GitHub رفض الاعتماد"
  fi
fi
rm -f /tmp/ghvt.json /tmp/ghvt2.json

echo "──────────────────────────────────────────────"
case "$CODE" in
  200) echo "الخلاصة: التوكن سليم على هذه الشبكة. إن فشل عند وكيل آخر، فالمُرسَل إليه مختلف عن المُختبَر هنا." ;;
  401) echo "الخلاصة: GitHub نفسه يرفض هذه القيمة (Bad credentials).
الأسباب المعروفة: إلغاء/سحب تلقائي بسبب الظهور في مكان عام (secret scanning)، إعادة توليد، انتهاء صلاحية، أو اختلاف حرف واحد عند النسخ (0/O أو l/I)." ;;
  403) echo "الخلاصة: التوكن صالح لكن ناقص الصلاحيات أو يحتاج تفعيل SSO للمؤسسة." ;;
  *)   echo "الخلاصة: نتيجة غير متوقعة ($CODE) — تحقق من الشبكة." ;;
esac
