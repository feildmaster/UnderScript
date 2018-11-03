FNAME="${1:-}"

if [[ ! -f "$FNAME" ]]; then
  echo "File not found"
  exit 2
else
  CONTENT=$(cat "$FNAME")
fi

if [[ ! $gist_token ]]; then
  echo 'Token not provided'
  exit 2
fi

CONTENT=$(echo "${CONTENT}" | sed -e 's/\\/\\\\/g' -e 's/\r//' -e's/\t/\\t/g' -e 's/"/\\"/g' | sed -E ':a;N;$!ba;s/\r{0,1}\n/\\n/g')

TEMP=$(mktemp)
cat > $TEMP <<EOF
{
  "public": false,
  "files": {
    "$(basename $FNAME)": {
      "content": "${CONTENT}"
    }
  }
}
EOF

OUTPUT=$(curl -H "Authorization: token ${gist_token}" -X POST -d @$TEMP "https://api.github.com/gists" )
URL=$(echo "$OUTPUT" | grep 'html_url' | grep 'gist')

rm $TEMP

if [[ ! -z ${URL:-} ]]; then
  echo "URL: $URL"
else
  echo "ERROR"
  echo "$OUTPUT"
fi
