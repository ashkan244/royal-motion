#!/usr/bin/env bash
# Local still preview (no npm needed): screenshot a built composition at given times
# and tile them into one contact sheet.
# usage: scripts/stills.sh <variant-name> "0.5 1.5 2.5 4" [outdir]
set -e
NAME="$1"; TIMES="${2:-0.5 1.5 2.5 3.5 4.5}"; OUTD="${3:-stills}"
CH="/c/Program Files/Google/Chrome/Application/chrome.exe"
ROOT="$(cd "$(dirname "$0")/.." && pwd -W 2>/dev/null || pwd)"
FILE="$ROOT/dist/v/$NAME.html"
W=$(grep -o 'data-width="[0-9]*"' "dist/v/$NAME.html" | head -1 | grep -o '[0-9]*')
H=$(grep -o 'data-height="[0-9]*"' "dist/v/$NAME.html" | head -1 | grep -o '[0-9]*')
mkdir -p "$OUTD/tmp"
PROFILE="$(mktemp -d)"
i=0; LIST=""
for t in $TIMES; do
  i=$((i+1)); P="$OUTD/tmp/$i.png"
  timeout 40 "$CH" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$PROFILE" --force-device-scale-factor=1 \
    --allow-file-access-from-files --virtual-time-budget=4000 --window-size=$W,$H \
    --screenshot="$(cd "$OUTD/tmp" && pwd -W)/$i.png" "file:///$FILE?t=$t" 2>&1 | grep -i "error" | grep -v "externally_managed\|devtools" || true
  LIST="$LIST -i $P"
done
rm -rf "$PROFILE"
N=$i
SC=$(( W > H ? 480 : 300 ))
if [ "$N" = 1 ]; then ffmpeg -loglevel error -y -i "$OUTD/tmp/1.png" -vf scale=$((SC*2)):-1 "$OUTD/$NAME.png"; else ffmpeg -loglevel error -y $LIST -filter_complex "$(for j in $(seq 0 $((N-1))); do printf "[%d:v]scale=%d:-1[s%d];" $j $SC $j; done)$(for j in $(seq 0 $((N-1))); do printf "[s%d]" $j; done)hstack=inputs=$N" "$OUTD/$NAME.png"; fi
rm -rf "$OUTD/tmp"
echo "$OUTD/$NAME.png"
