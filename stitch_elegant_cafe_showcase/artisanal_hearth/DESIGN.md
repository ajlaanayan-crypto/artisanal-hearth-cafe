---
name: Artisanal Hearth
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#4e453d'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#80756c'
  outline-variant: '#d2c4ba'
  surface-tint: '#725a42'
  primary: '#33210d'
  on-primary: '#ffffff'
  primary-container: '#4b3621'
  on-primary-container: '#bd9f83'
  inverse-primary: '#e1c1a4'
  secondary: '#6b5c4a'
  on-secondary: '#ffffff'
  secondary-container: '#f5dfc8'
  on-secondary-container: '#726250'
  tertiary: '#1e2800'
  on-tertiary: '#ffffff'
  tertiary-container: '#323f09'
  on-tertiary-container: '#9bab6a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#fedcbe'
  primary-fixed-dim: '#e1c1a4'
  on-primary-fixed: '#291806'
  on-primary-fixed-variant: '#59422c'
  secondary-fixed: '#f5dfc8'
  secondary-fixed-dim: '#d8c3ad'
  on-secondary-fixed: '#241a0c'
  on-secondary-fixed-variant: '#534434'
  tertiary-fixed: '#d9eaa3'
  tertiary-fixed-dim: '#bdce89'
  on-tertiary-fixed: '#161f00'
  on-tertiary-fixed-variant: '#3e4c16'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  headline-xl:
    fontFamily: Source Serif 4
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style

The brand identity centers on the concept of "The Modern Sanctuary"—a space that bridges the gap between high-end precision and domestic comfort. The target audience includes urban professionals, creative freelancers, and neighborhood locals who value quality and a slow-living philosophy. 

The design style is a hybrid of **Minimalism** and **Tactile/Skeuomorphism**. It prioritizes generous whitespace and structured layouts to convey cleanliness and professionalism, while using subtle textures, soft shadows, and organic color transitions to evoke a sense of physical touch and warmth. The UI should feel like high-quality stationery: substantial, textured, and intentional. Every interaction should aim for a calming, low-friction emotional response.

## Colors

The palette is derived from the natural lifecycle of coffee and its environment. 

- **Primary (Rich Roast):** A deep, espresso brown used for primary actions, headings, and critical iconography. It provides the grounding weight for the interface.
- **Secondary (Steamed Milk):** A creamy, warm beige used for surface backgrounds, secondary buttons, and decorative elements. It softens the transition between high-contrast elements.
- **Tertiary (Soft Sage):** An organic, muted green used sparingly for success states, subtle accents, and "natural/organic" product callouts.
- **Neutral (Parchment):** A warm off-white that replaces pure white for all main backgrounds to reduce eye strain and enhance the cozy, paper-like feel of the interface.

## Typography

This design system utilizes a high-contrast typographic pairing to reflect the "Artisanal" narrative. 

**Source Serif 4** provides an authoritative yet warm editorial feel for all headlines. Its slightly bracketed serifs and classic proportions evoke the feeling of a premium menu or a literary journal. 

**Plus Jakarta Sans** is used for all functional text. Its modern, slightly rounded letterforms maintain high legibility at smaller sizes while echoing the "soft" brand personality. Use optical sizing for the serif where available to ensure the hairline details remain visible on digital screens. Increase line height for body text to 1.5x-1.6x to reinforce the airy, minimalist aesthetic.

## Layout & Spacing

The layout follows a **fluid grid** logic with a strict 4px baseline. 

- **Desktop:** A 12-column grid with a 1200px max-width container. Margins are generous (40px) to ensure content feels framed and intentional.
- **Mobile:** A 4-column grid with 16px margins.
- **Rhythm:** Vertical spacing between sections should be aggressive (80px+) to allow the high-quality imagery of latte art and interiors to breathe. Content blocks should be stacked using "stack-md" for related items and "stack-lg" for distinct content groups. Avoid cluttering the screen; if in doubt, add more whitespace.

## Elevation & Depth

Visual hierarchy is established through **Ambient Shadows** and **Tonal Layers**. 

Instead of harsh black shadows, this design system uses "Umbra" effects tinted with the Primary Coffee Brown color at very low opacities (4-8%). This creates a "soft glow" depth rather than a "floating" effect, making components feel like they are resting gently on a paper surface.

- **Level 0 (Base):** Neutral (Parchment) background.
- **Level 1 (Cards/Inputs):** White or Secondary (Steamed Milk) surfaces with a 2px blur shadow.
- **Level 2 (Modals/Popovers):** Surface with a 12px blur, 4px offset shadow to indicate temporary interaction.
- **Backdrop:** Use a soft 4px Gaussian blur for overlays to maintain the "steamy" cafe atmosphere.

## Shapes

The shape language is consistently **Rounded**. 

The standard `rounded` value (0.5rem) should be applied to almost all interactive elements, including buttons, input fields, and small cards. For larger imagery or featured containers, use `rounded-lg` (1rem) to emphasize the soft, inviting nature of the brand. Avoid sharp 90-degree corners entirely, as they conflict with the "cozy" brand personality.

## Components

- **Buttons:** Primary buttons use the Primary Roast color with white text and a subtle 1px inner border of a slightly lighter brown to add "edge" detail. Secondary buttons use a Steamed Milk background with Primary Roast text.
- **Inputs:** Text fields should have a Neutral background with a subtle 1px border in Secondary Steamed Milk. Focus states transition the border to Primary Roast.
- **Cards:** Use a white background with `rounded-lg` corners and an Ambient Shadow. Images within cards should always have a subtle "film grain" or "soft focus" overlay to maintain the artisanal aesthetic.
- **Chips/Tags:** Used for "In Stock" or "New" labels. These should use the Tertiary Sage green with deep green text, featuring a pill-shape (rounded-xl).
- **Lists:** Menu items should be separated by thin, low-opacity horizontal rules in the Secondary color, with generous vertical padding (16px-24px) to avoid a cramped "data-grid" look.
- **Additional Suggestion - "The Steaming Micro-interaction":** Use subtle CSS transitions for hover states that mimic a soft "fade-in," avoiding snappy or aggressive animations.