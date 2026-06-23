#!/bin/bash
# Build the Chariot product showcase montage from the 5 Kling clips + brand label overlays.
set -e
FF=/opt/homebrew/bin/ffmpeg
cd "$(dirname "$0")"
mkdir -p build/segs
SEG=2.6          # seconds per product segment
OUTRO=3.2
FO=$(echo "$SEG-0.4" | bc)   # label fade-out start

# product clip -> overlay label
PAIRS="siding:siding windows:windows doors:doors sunroom:sunrooms screenroom:screenrooms"

ENC="-r 24 -c:v libx264 -profile:v high -level 4.0 -crf 20 -preset medium -pix_fmt yuv420p -video_track_timescale 12288 -an"

echo ">> building product segments"
for p in $PAIRS; do
  clip="${p%%:*}"; lab="${p##*:}"
  $FF -y -t $SEG -i "videos/clips/$clip.mp4" -loop 1 -framerate 24 -t $SEG -i "overlays/$lab.png" -filter_complex \
    "[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,format=yuv420p[v];\
     [1:v]format=rgba,fade=in:st=0:d=0.45:alpha=1,fade=out:st=$FO:d=0.4:alpha=1[ov];\
     [v][ov]overlay=0:0,format=yuv420p[o]" \
    -map "[o]" $ENC "build/segs/$clip.mp4" 2>/dev/null
  echo "   seg $clip"
done

echo ">> building outro card"
$FF -y -loop 1 -t $OUTRO -i images/hero.jpg -loop 1 -framerate 24 -t $OUTRO -i overlays/outro.png -filter_complex \
  "[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,eq=brightness=-0.32:saturation=0.85,fps=24,format=yuv420p[bg];\
   [1:v]format=rgba,fade=in:st=0.25:d=0.5:alpha=1[ov];\
   [bg][ov]overlay=0:0,format=yuv420p[o]" \
  -map "[o]" $ENC "build/segs/outro.mp4" 2>/dev/null

echo ">> concat + top/tail fade -> showcase master"
TOTAL=$(echo "$SEG*5 + $OUTRO" | bc)
FOUT=$(echo "$TOTAL-0.6" | bc)
$FF -y -i build/segs/siding.mp4 -i build/segs/windows.mp4 -i build/segs/doors.mp4 \
       -i build/segs/sunroom.mp4 -i build/segs/screenroom.mp4 -i build/segs/outro.mp4 \
  -filter_complex "[0:v][1:v][2:v][3:v][4:v][5:v]concat=n=6:v=1:a=0,fade=t=in:st=0:d=0.5,fade=t=out:st=$FOUT:d=0.6[o]" \
  -map "[o]" -c:v libx264 -profile:v high -crf 21 -preset slow -pix_fmt yuv420p -movflags +faststart -an build/showcase-master.mp4 2>/dev/null

echo ">> web-optimized showcase (mp4 + webm)"
$FF -y -i build/showcase-master.mp4 -an -c:v libx264 -profile:v high -crf 23 -preset slow -movflags +faststart videos/showcase.mp4 2>/dev/null
$FF -y -i build/showcase-master.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 2 videos/showcase.webm 2>/dev/null

echo "DONE total≈${TOTAL}s"
ls -lh videos/showcase.mp4 videos/showcase.webm | awk '{print $5,$9}'
