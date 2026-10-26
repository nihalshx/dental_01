#!/usr/bin/env bash
# Turn a Flow video into the scroll-driven hero frames.
#   bash src/make_frames.sh path/to/hero-turntable.mp4
# Writes 96 WebP frames to site/assets/seq/hero/. If the frame count changes,
# update data-frames on the hero in src/home.html and run: python3 src/build.py
set -euo pipefail
IN="$1"; OUT="site/assets/seq/hero"; N=96
rm -f "$OUT"/*.webp; mkdir -p "$OUT"
TOTAL=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "$IN")
STEP=$(( TOTAL / N )); [ "$STEP" -lt 1 ] && STEP=1
ffmpeg -v error -y -i "$IN" -vf "select='not(mod(n\,$STEP))',scale='min(1280,iw)':-2" -vsync vfr -frames:v $N -c:v libwebp -quality 80 "$OUT/%03d.webp"
echo "$(ls "$OUT" | wc -l) frames written to $OUT"
