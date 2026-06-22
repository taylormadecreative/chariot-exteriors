#!/usr/bin/env node
// New web-specific imagery for the Chariot site — Nano Banana 2 (gemini-3-pro-image).
const fs=require('fs'),path=require('path');
const API_KEY=process.env.GOOGLE_API_KEY; if(!API_KEY){console.error('no key');process.exit(1);}
const MODEL='gemini-3-pro-image-preview';
const OUT=path.join(__dirname,'images','src');
const STYLE='Professional architectural and real-estate photography, full-frame DSLR, sharp, natural daylight, photorealistic, ultra detailed. No text, no signage, no brand logos, no watermarks.';
const IMAGES=[
  {file:'web-hero.png',aspect:'16:9',size:'4K',prompt:`${STYLE} A beautiful, freshly renovated two-story American suburban home at warm golden hour, photographed slightly from the left so the house sits on the right side of the frame and open blue sky fills the upper left for text overlay. Crisp light-gray and soft blue-gray lap siding, white trim, large windows glowing warm, a welcoming entry, manicured green lawn and tidy landscaping. Inviting, premium, aspirational curb appeal.`},
  {file:'crew-install.png',aspect:'4:3',size:'2K',prompt:`${STYLE} Two friendly professional exterior-remodeling installers in plain solid-color work shirts and tool belts working on the outside of a suburban home, one on a short ladder fitting a new window, the other handling a panel of new siding, bright daylight, focused and trustworthy, clean job site. Candid documentary feel. No text on clothing.`},
  {file:'consult-homeowners.png',aspect:'4:3',size:'2K',prompt:`${STYLE} A friendly home exterior design consultant in a clean polo shirt standing on a front porch with a relaxed middle-aged homeowner couple, all looking at a tablet/sample together and smiling, the home's siding and front door visible behind them, warm natural daylight. Approachable, professional, in-home estimate moment. No text.`},
  {file:'cta-dusk.png',aspect:'16:9',size:'4K',prompt:`${STYLE} A handsome suburban two-story home at blue-hour dusk, warm golden light glowing from every window, fresh siding and a lit entry, deep blue evening sky, lush dark lawn, cinematic and inviting, wide establishing shot with space across the top for text overlay.`},
];
async function gen(img){
  const url=`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body={contents:[{parts:[{text:img.prompt}]}],generationConfig:{responseModalities:['IMAGE'],imageConfig:{aspectRatio:img.aspect,imageSize:img.size}}};
  const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const data=await res.json();
  if(!res.ok) throw new Error(`${res.status}: ${JSON.stringify(data).slice(0,180)}`);
  for(const p of (data?.candidates?.[0]?.content?.parts||[])) if(p.inlineData?.data) return Buffer.from(p.inlineData.data,'base64');
  throw new Error('no image');
}
(async()=>{let ok=0;for(const img of IMAGES){const out=path.join(OUT,img.file);if(fs.existsSync(out)){console.log('SKIP',img.file);ok++;continue;}
  for(let a=1;a<=3;a++){try{process.stdout.write(`${img.file} (${img.aspect} ${img.size}) try${a} ... `);const buf=await gen(img);fs.writeFileSync(out,buf);console.log('OK '+Math.round(buf.length/1024)+'KB');ok++;break;}catch(e){console.log('FAIL '+e.message.slice(0,100));await new Promise(r=>setTimeout(r,2000));}}
  await new Promise(r=>setTimeout(r,700));}
  console.log('DONE '+ok+'/'+IMAGES.length);})();
