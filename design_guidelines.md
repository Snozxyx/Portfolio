# Snozxyx Portfolio Design Guidelines

## Design Approach: Reference-Based with Gaming Edge

Drawing inspiration from modern developer portfolios like Linear, Vercel, and gaming platforms like Discord, this portfolio balances professional tech aesthetics with gaming culture vibrancy. The design prioritizes smooth interactions, bold typography, and strategic use of white space to create an immersive yet clean experience.

**Core Principles:**
- Dark sophistication without harshness (rich dark grays, not pitch black)
- White as the primary accent for clarity and contrast
- Gaming energy through orange accents and animated effects
- Purposeful animations that enhance, not distract

---

## Color Palette

**Dark Mode Foundation:**
- **Primary Background:** 15 0% 10% (rich charcoal, not pure black)
- **Secondary Background:** 0 0% 8% (deeper cards and containers)
- **Elevated Surface:** 0 0% 15% (hover states, elevated elements)
- **Border Color:** 0 0% 20% (subtle borders and dividers)

**Text Hierarchy:**
- **Primary Text:** 0 0% 98% (near-white for readability)
- **Secondary Text:** 0 0% 65% (muted gray for descriptions)
- **Tertiary Text:** 0 0% 45% (labels, metadata)

**Accent Colors:**
- **Primary Accent (White):** 0 0% 100% (pure white for highlights, CTAs, focus states)
- **Gaming Accent (Orange):** 15 90% 60% (vibrant orange for gaming elements, badges, active states)
- **Success/Active:** 150 80% 50% (green for online status, success messages)

**Gradients:**
- White to Orange: Used sparingly for premium CTAs and hero elements
- Dark gradient: Subtle 10% to 8% for section depth

---

## Typography

**Font Families:**
- **Body/Sans:** Source Code Pro (400, 500, 600) - Primary text, paragraphs, UI elements
- **Headings/Serif:** Poppins (600, 700, 900) - H1-H6, section titles, emphasis
- **Code/Mono:** Inter (300, 400, 500) - Code snippets, technical labels, monospace needs

**Type Scale:**
- **Hero Display:** text-7xl to text-9xl (Poppins 900)
- **Page Titles:** text-5xl to text-6xl (Poppins 700)
- **Section Headings:** text-3xl to text-4xl (Poppins 600)
- **Body Large:** text-lg to text-xl (Source Code Pro 400)
- **Body Regular:** text-base (Source Code Pro 400)
- **Small/Labels:** text-sm to text-xs (Source Code Pro 500)
- **Code Blocks:** text-sm (Inter 400)

**Line Heights:**
- Headings: leading-tight (1.2)
- Body: leading-relaxed (1.7)
- Code: leading-normal (1.5)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24, 32

**Common Patterns:**
- Section padding: py-20 to py-32 (desktop), py-12 to py-16 (mobile)
- Component padding: p-6 to p-8
- Card spacing: space-y-6
- Grid gaps: gap-6 to gap-8

**Container Strategy:**
- Full-width sections: w-full with max-w-7xl centered
- Content sections: max-w-6xl
- Reading content: max-w-4xl
- Narrow forms: max-w-2xl

**Grid Patterns:**
- Project Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Skills Grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Stats Counter: grid-cols-2 lg:grid-cols-4
- Single column mobile, expand on tablet/desktop

---

## Component Library

### Navigation
**Floating Nav Bar:** Fixed top-6, glassmorphic (backdrop-blur-md), rounded-full pill shape with bg-black/70, white text with orange hover states. Auto-hide on scroll down, reveal on scroll up.

### Hero Section
**Full-Screen Impact:** min-h-screen centered content, animated particle background in background layer. Large hero image (abstract tech/gaming aesthetic - dark, neon-lit, digital art) as backdrop with gradient overlay. Name in Poppins 900 (text-8xl), white with orange gradient on hover. Typewriter effect cycling through roles using white text. Dual CTAs: primary (white bg, black text) and secondary (outline white, transparent bg with blur).

### Project Cards
**Elevated Cards:** Dark bg (8% lightness) with rounded-xl corners, p-6 spacing. Hover: lift with y-axis transform, animated white border glow. Tech stack as small white/orange pills at top. Project image thumbnail (16:9 ratio). Title in Poppins 700, description in Source Code Pro. Feature list with orange bullet points. Action buttons: white primary, orange secondary.

### Skills Section
**Tech Stack Visualization:** Grid of skill cards, each with icon, name (Poppins 600), and proficiency indicator. Animated progress bars (white fill on dark gray track) that animate on scroll into view. Category grouping: Languages, Frameworks, Tools, Gaming Tech.

### Stats Counter
**Gaming Metrics:** Large numbers (text-5xl Poppins 700) in white, counting animation on scroll trigger. Labels below in Source Code Pro. Four columns: Projects Completed, GitHub Repos, Discord Bots, Stream Hours. Orange accent underlines.

### Contact Section
**Interactive Form:** Dark card with white borders on focus states. Input fields with subtle white borders, orange focus rings. Social icons in white, orange on hover. Include: Discord, GitHub, Twitter, Email with animated hover lift.

### Footer
Minimal design with white text on darkest background. Three columns: Quick Links, Projects, Connect. Copyright and "Built with Next.js" badge. Social icons repeat in white/orange theme.

---

## Animations

**Sparingly Applied:**
- Page transitions: 400ms fade with slight scale (0.98 to 1)
- Scroll-triggered reveals: Fade up on intersection, 600ms duration
- Hover lifts: -10px transform with 300ms ease-out
- Particle background: Slow, ambient movement (0.5-1 speed)
- Typewriter effect: Hero only, 50ms type speed
- CountUp stats: Triggered once on scroll into view
- Border glows: Subtle gradient animation on card hover (2s duration)

**No Excessive Motion:** Avoid continuous animations, spinning elements, or distracting effects. Focus on responsive, purposeful interactions.

---

## Images

**Hero Background Image:**
Large, high-quality abstract tech/gaming image with dark tones, subtle neon accents (orange/white), and digital/cyberpunk aesthetic. Apply dark gradient overlay (opacity-70) to ensure text readability. Position: object-cover, full viewport height.

**Project Thumbnails:**
16:9 ratio screenshots or mockups for each project. Show actual UI or representative graphics. Use subtle border and shadow on hover.

**About Section Image:**
Professional photo or stylized avatar of Snozxyx, positioned in a circular frame with white border, subtle glow effect. Alternative: Gaming setup photo with subtle orange accent lighting.

**Particle Background:**
Animated particles (white and orange, 1-3px size, 0.3 opacity) floating slowly across dark background. Present throughout site but subtle and non-distracting.

---

## Responsive Behavior

**Mobile-First Approach:**
- Stack all multi-column grids to single column
- Reduce hero text sizes (text-5xl mobile vs text-8xl desktop)
- Floating nav becomes bottom-fixed tab bar on mobile
- Reduce spacing (py-12 vs py-24)
- Touch-friendly button sizes (min h-12)
- Simplified animations on mobile (reduced motion preferred)

**Breakpoint Strategy:**
- Mobile: base styles
- Tablet: md: prefix (768px)
- Desktop: lg: prefix (1024px)
- Large: xl: prefix (1280px)

This portfolio showcases modern web development with gaming flair, balancing professional credibility with personal brand energy through strategic use of white and orange accents on a sophisticated dark canvas.