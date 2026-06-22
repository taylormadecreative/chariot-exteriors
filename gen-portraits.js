#!/usr/bin/env node
// Realistic homeowner portraits for testimonials — Nano Banana 2, square, natural (not stocky).
const fs=require('fs'),path=require('path');
const API_KEY=process.env.GOOGLE_API_KEY; if(!API_KEY){console.error('no key');process.exit(1);}
const MODEL='gemini-3-pro-image-preview';
const OUT=path.join(__dirname,'images','src');
const STYLE='Authentic, natural lifestyle portrait photography, candid and genuine (not stock-photo posed), soft natural daylight, shallow depth of field, warm and approachable, real person. Head and shoulders, looking at camera with a genuine relaxed smile. Photorealistic. No text, no watermark.';
const IMAGES=[
  {file:'portrait-couple.png',prompt:`${STYLE} A happy middle-aged Black couple, a man and woman both around 50, standing close together in front of their attractive suburban home with fresh siding, casual nice everyday clothing, genuine warm smiles, proud homeowners.`},
  {file:'portrait-linda.png',prompt:`${STYLE} A friendly Asian-American woman in her early 50s with a neat bob haircut, wearing a soft casual sweater, standing on the porch of her home near a bright new window, kind genuine smile, relaxed and content.`},
  {file:'portrait-ray.png',prompt:`${STYLE} A friendly Latino man in his late 40s with short dark hair and light stubble, wearing a casual collared shirt, standing in the front yard of his suburban home with new windows and a new front door behind him, warm confident smile.`},
];
async function gen(p){
  const url=`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body={contents:[{parts:[{text:p}]}],generationConfig:{responseModalities:['IMAGE'],imageConfig:{aspectRatio:'1:1',imageSize:'2K'}}};
  const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const data=await res.json(); if(!res.ok) throw new Error(`${res.status}: ${JSON.stringify(data).slice(0,160)}`);
  for(const part of (data?.candidates?.[0]?.content?.parts||[])) if(part.inlineData?.data) return Buffer.from(part.inlineData.data,'base64');
  throw new Error('no image');
}
(async()=>{let ok=0;for(const img of IMAGES){const out=path.join(OUT,img.file);if(fs.existsSync(out)){console.log('SKIP',img.file);ok++;continue;}
  for(let a=1;a<=3;a++){try{process.stdout.write(`${img.file} try${a} ... `);const buf=await gen(img.prompt);fs.writeFileSync(out,buf);console.log('OK '+Math.round(buf.length/1024)+'KB');ok++;break;}catch(e){console.log('FAIL '+e.message.slice(0,90));await new Promise(r=>setTimeout(r,2000));}}
  await new Promise(r=>setTimeout(r,600));}
  console.log('DONE '+ok+'/'+IMAGES.length);})();
