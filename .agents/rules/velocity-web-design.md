# Velocity Web Design Rule

Guidelines for rapid, high-velocity web design execution and landing page creation for videos, live demos, and fast prototypes.

## 1. Execution Speed & Workflow (Zero Overhead)
- **Immediate One-Pass Delivery**: When requested to build or design a page, write the complete, functional code directly into the target files (e.g., `app/page.tsx`) immediately.
- **No Implementation Plans**: Do not create `implementation_plan.md` or pause for plan approvals unless explicitly commanded by the user.
- **No Build or Lint Commands**: Never run `npm run build`, `bun run build`, `next build`, `npm run lint`, or background tasks that block or slow down execution.
- **No Package Installations**: Do not run `npm install` or `bun add`. Use built-in React, Next.js, and Tailwind CSS.
- **Self-Contained Assets**: Use inline SVG icons and direct high-resolution Unsplash images. Do not trigger `generate_image` or external asset generators.

---

## 2. Velocity Design System & Aesthetics
- **Color Palette & Theme**:
  - Deep obsidian & dark charcoal theme (`#09090b`, `#18181b`) with high contrast text (`zinc-100`, `zinc-400`).
  - Warm luminous accents (amber/gold `#f59e0b`, emerald `#10b981`, electric cyan).
  - Subtle radial gradient glows (`bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(245,158,11,0.15),transparent)]`).
  - Glassmorphic panels with backdrop blur (`backdrop-blur-xl`, `border-zinc-800/80`, `bg-zinc-950/80`).
- **Typography & Hierarchy**:
  - High-impact headline sizing (`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight`).
  - Gradient clipped text accents (`text-transparent bg-clip-text bg-gradient-to-r`).
  - Clean monospace micro-badges and tags.

---

## 3. Core Landing Page Components
Every velocity e-commerce / web design must include:
1. **Announcement Bar**: Top promotional ribbon with coupon codes and shipping incentives.
2. **Sticky Navigation Bar**: Frosted glass header, logo mark, navigation links, search input, and interactive bag/cart counter badge.
3. **High-Impact Hero Section**:
   - Status badge pill (e.g. "✦ NEXT-GEN SOUND & OBJECTS").
   - Bold hero title and engaging subhead.
   - Dual action buttons (Primary high-contrast button + Secondary glass/outline button).
   - Trust statistics (e.g., 4.9★ rating, 50k+ creators, 2-year warranty).
   - Interactive hero showcase card with badge and quick buy action.
4. **Trust Badges Grid**: 4-column value markers (Express Global Delivery, 2-Year Warranty, 30-Day In-Studio Trial, Eco/Carbon-Neutral).
5. **Interactive Catalog & Category Filter**:
   - Filter pills ("All", and 3–4 category tags) with active button states.
   - Real-time search filter.
   - Product cards with hover image zoom, discount/new badges, wishlist heart toggle, star ratings, color swatches, and "Add to Bag" action.
6. **Slide-Over Cart Drawer**:
   - Real-time subtotal calculation.
   - Dynamic free-shipping milestone progress bar.
   - Quantity increment/decrement buttons, item removal, and checkout CTA.
7. **Product Spotlight / Deep-Dive**:
   - Visual showcase paired with modular spec cards (Acoustics, Latency, Battery, Materials).
8. **Customer Reviews / Social Proof**:
   - Testimonial grid with star ratings, quotes, and verified reviewer credentials.
9. **Newsletter / VIP Club**:
   - Inline email signup with instant toast feedback.
10. **Modern Footer**:
    - Brand identity, copyright notice, and essential navigational / legal links.
