# DESIGN.md — Chariot Exteriors site

## Color (OKLCH, tinted toward brand blue; never pure #000/#fff)
- **Brand blue** (committed): `#3F6EF0` → `--blue`. Primary CTAs, links, accents.
- **Green** (secondary): `#3E8C4E` → `--green`. Checkmarks, success, the logo tagline, confirmations.
- **Navy** (depth): `#15327A` / `#0E2356` → dark sections, footer, headings on light.
- **Paper**: `oklch(0.99 0.004 250)` near-white, faint blue tint. **Ink**: `oklch(0.23 0.02 255)` off-navy-black.
- **Mist**: `oklch(0.965 0.01 250)` light blue-gray section fills.
Strategy: Committed. Light base, confident blue, one or two navy sections for contrast.

## Type
- **Display / headings:** Archivo (700–900), tight tracking. Cohesive with the CHARIOT logo (Archivo Black Italic).
- **Body / UI:** Hanken Grotesk (400–700). Humanist, highly readable for a 45–65 audience. (Not Inter.)
- Fluid scale with clamp(), ≥1.25 ratio. Body 17–18px min for readability.

## Logo
CHARIOT wordmark = Archivo Black Italic in `--blue`; tagline "SIDING • WINDOWS • DOORS" centered under it in `--green`.

## Motion
ease-out-expo / quart curves, 150–400ms. Entrance reveals on scroll (IntersectionObserver), subtle.
Buttons: scale(0.97) on :active. Respect prefers-reduced-motion. Never animate layout props.

## Components
- Buttons: solid blue primary (white text), outline secondary. Generous padding, large tap targets.
- Service tiles: photo-led (real images), not icon cards.
- Before/after: interactive slider.
- Process: connected 1-2-3.
- Testimonials: card row with stars + name + DFW city.
- FAQ: accordion (grid-template-rows transition).
- Quote form: short (name, phone, email, service, message), FormSubmit backend.

## Bans (enforced)
No side-stripe borders, no gradient text, no glassmorphism-by-default, no identical icon-card grids,
no hero-metric template, no em dashes in copy, no modal-first.
