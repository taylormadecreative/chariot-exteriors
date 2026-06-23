#!/usr/bin/env node
// 16:9 product hero frames for the Chariot showcase video — Nano Banana 2, aligned to the brochure.
const fs=require('fs'),path=require('path');
const API_KEY=process.env.GOOGLE_API_KEY; if(!API_KEY){console.error('no key');process.exit(1);}
const MODEL='gemini-3-pro-image-preview';
const OUT=path.join(__dirname,'images','src');
const STYLE='Cinematic architectural / real-estate photography, full-frame, sharp, golden-hour or bright natural daylight, premium magazine quality, photorealistic, ultra detailed, clean composition. No text, no logos, no watermark, no people.';
const IMAGES=[
  {file:'sv-siding.png',prompt:`${STYLE} Beautiful two-story suburban home showcasing premium horizontal lap siding in a rich, attractive fade-resistant color (soft blue-gray) with crisp white trim, visible clean siding texture, manicured lawn, blue sky, three-quarter angle emphasizing curb appeal.`},
  {file:'sv-windows.png',prompt:`${STYLE} Modern home exterior featuring elegant large black-framed windows that stand out against light siding, strong curb appeal, warm light glowing from inside, sharp architectural detail, late-afternoon light.`},
  {file:'sv-doors.png',prompt:`${STYLE} A premium custom front entry door, rich painted color with a decorative glass insert and sidelights, realistic wood-grain fiberglass texture, on an inviting covered porch with tasteful plants, warm welcoming daylight, straight-on hero framing.`},
  {file:'sv-sunroom.png',prompt:`${STYLE} A bright, airy four-season sunroom addition with floor-to-ceiling glass walls and glass roof, comfortable upholstered furniture, leafy plants, sunlight streaming in, lush green backyard visible through the glass, relaxing upscale interior.`},
  {file:'sv-screenroom.png',prompt:`${STYLE} A screened-in patio enclosure (screen room) attached to a home, fine black screen mesh walls, comfortable outdoor lounge furniture and a ceiling fan, dappled shade, a lush green backyard beyond, cool inviting outdoor-living space on a sunny day.`},
];
async function gen(p){
  const url=`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body={contents:[{parts:[{text:p}]}],generationConfig:{responseModalities:['IMAGE'],imageConfig:{aspectRatio:'16:9',imageSize:'2K'}}};
  const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const data=await res.json(); if(!res.ok) throw new Error(`${res.status}: ${JSON.stringify(data).slice(0,160)}`);
  for(const part of (data?.candidates?.[0]?.content?.parts||[])) if(part.inlineData?.data) return Buffer.from(part.inlineData.data,'base64');
  throw new Error('no image');
}
(async()=>{let ok=0;for(const img of IMAGES){const out=path.join(OUT,img.file);if(fs.existsSync(out)){console.log('SKIP',img.file);ok++;continue;}
  for(let a=1;a<=3;a++){try{process.stdout.write(`${img.file} try${a} ... `);const buf=await gen(img.prompt);fs.writeFileSync(out,buf);console.log('OK '+Math.round(buf.length/1024)+'KB');ok++;break;}catch(e){console.log('FAIL '+e.message.slice(0,90));await new Promise(r=>setTimeout(r,2000));}}
  await new Promise(r=>setTimeout(r,600));}
  console.log('DONE '+ok+'/'+IMAGES.length);})();
