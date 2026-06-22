# Chariot Exteriors — Website

Mobile-friendly marketing site for **Chariot Exteriors** (DFW siding, windows, doors, sunrooms).
Static HTML/CSS/JS. Deploys to GitHub Pages.

**Live (preview):** https://taylormadecreative.github.io/chariot-exteriors/

## Stack
- `index.html` · `styles.css` · `script.js` (no build step)
- Fonts: Archivo + Hanken Grotesk (Google Fonts)
- Images: `images/*.jpg` (web-optimized). 4K Nano Banana 2 masters live in `images/src/` (git-ignored).
- Quote form posts to **FormSubmit** (`sean@chariotexteriors.com`) via AJAX, with inline success.

## ✅ Finalize before promoting / pointing the domain
1. **Testimonials are sample placeholders** (realistic but not real). Replace with Sean's actual reviews.
2. **All photos are AI-generated placeholders** (Nano Banana 2). Swap in real Chariot project photos,
   especially the before/after.
3. **Confirm the claims are true:** "licensed & insured," warranty / workmanship guarantee, financing
   "may be available," and the FAQ answers. Edit anything Chariot can't stand behind.
4. **Activate the form:** the first submission triggers a FormSubmit confirmation email to
   sean@chariotexteriors.com. Sean must click it once to start receiving leads.
5. **Real logo:** the CHARIOT wordmark is a CSS recreation. Drop in the real vector if available.
6. **Custom domain (optional):** add a `CNAME` file with `chariotexteriors.com` and set DNS to GitHub Pages.

## Rebuild assets
```bash
node gen-web.js          # regenerate web hero / crew / consult / cta images (needs GOOGLE_API_KEY)
bash optimize-images.sh  # src PNG -> web JPEG
```

Built by Taylormade Creative.
