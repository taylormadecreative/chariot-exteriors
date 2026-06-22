#!/bin/bash
# Optimize source PNGs into web-ready JPEGs (resized, q82, stripped) for fast mobile loading.
set -e
CV="/opt/ImageMagick/bin/convert"
cd "$(dirname "$0")"
S=images/src
# name:src:width
MAP="
hero:web-hero:2400
cta:cta-dusk:2400
showcase:cover-hero-home:1500
siding:siding-home:1200
windows:windows-interior:1100
doors:entry-door:1100
sunroom:sunroom-interior:1200
crew:crew-install:1500
consult:consult-homeowners:1500
family:cover-family-window:1200
home-before:home-before:1300
home-after:home-after:1300
siding-before:siding-before:1300
siding-after:siding-after:1300
"
echo "$MAP" | while read line; do
  [ -z "$line" ] && continue
  name=$(echo "$line" | cut -d: -f1); src=$(echo "$line" | cut -d: -f2); w=$(echo "$line" | cut -d: -f3)
  if [ -f "$S/$src.png" ]; then
    "$CV" "$S/$src.png" -resize "${w}x" -quality 82 -strip -interlace Plane "images/$name.jpg"
    echo "  images/$name.jpg ($(du -h images/$name.jpg | cut -f1))"
  else
    echo "  MISSING $S/$src.png"
  fi
done
echo "done."
