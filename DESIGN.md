---
name: ROMADI
description: High-end digital experiences shaped with technical precision and a deep cherry atmosphere.
colors:
  canvas-black: "#050505"
  true-black: "#000000"
  surface-primary: "#090909"
  surface-secondary: "#0C0C0C"
  surface-elevated: "#111111"
  text-primary: "#FFFFFF"
  text-secondary: "#B5B5BB"
  text-muted: "#8E8E93"
  signal: "#E0234E"
  signal-hover: "#F75F7F"
  signal-deep: "#A91037"
  wine-field: "#620B22"
  wine-shadow: "#100507"
  wine-edge: "#58091E"
  cherry-glow: "#E41648"
typography:
  display:
    fontFamily: "Manrope Variable, Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.75rem, 7.25vw, 7rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope Variable, Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.3rem, 4.25vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Manrope Variable, Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 1.25vw, 1.25rem)"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Manrope Variable, Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, monospace"
    fontSize: "clamp(0.72rem, 0.85vw, 0.9rem)"
    fontWeight: 550
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  field: "12.8px"
  card: "16px"
  panel: "24px"
  section: "32px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  section: "clamp(5rem, 9vw, 9rem)"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "12.8px 24.8px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.signal-hover}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.pill}"
  button-secondary:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "12.8px 24.8px"
    height: "52px"
  input:
    backgroundColor: "{colors.surface-primary}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "12.8px 16px"
    height: "52px"
  surface-card:
    backgroundColor: "{colors.surface-secondary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "24px"
---

# Design System: ROMADI

## Overview

**Creative North Star: "The Cherry Signal Room"**

ROMADI should feel like a high-end digital studio operating from a precise, dark technical environment. Near-black structure gives the work authority; deep wine fields, restrained cherry light, fine grain, and fluid motion give it a recognizable pulse. The visual language is confident and cinematic, never loud for its own sake.

The system balances generous, single-purpose sections with compact technical labels and close-set functional groups. Screens may change art direction, but every surface must remain connected through the same ink hierarchy, cherry spectrum, typography, and controlled motion. It explicitly rejects bright magenta, pure crimson floods, white-hot goo highlights, obvious tiled noise, generic SaaS card walls, and ornamental glass used without a navigation or layering purpose.

**Key Characteristics:**

- Near-black structural surfaces with committed wine/cherry atmospheric fields.
- Large, restrained Manrope headlines paired with compact JetBrains Mono support copy.
- Fine organic grain, soft vignettes, and animated liquid or line fields instead of decorative grids.
- Broad section shells, tighter content cards, and clear alignment across columns.
- Purposeful reveal, menu, hover, and typewriter motion with reduced-motion fallbacks.

## Colors

The palette is a dark neutral system energized by a specific cherry-to-wine spectrum, not a generic red or magenta gradient.

### Primary

- **ROMADI Signal:** The focused interactive accent for active controls, focus states, small glows, and emphasis. It must remain selective rather than filling whole sections.
- **Signal Lift:** The brighter hover state for short-lived interaction feedback. Never use it as a large background.
- **Deep Signal:** The shadow-side accent used to give marks and small gradient details depth.

### Secondary

- **Wine Field:** The left or base edge of signature atmospheric gradients used by the hero, showcase, CTA, and footer transition.
- **Wine Shadow:** The near-black burgundy center that keeps cherry sections sophisticated and preserves white-text contrast.
- **Wine Edge:** The complementary burgundy edge that prevents the field from reading as flat black.
- **Cherry Glow:** A translucent radial highlight only; it is never a solid full-screen fill.

### Neutral

- **Canvas Black:** The page background and default section ground.
- **True Black:** Reserved for hard occlusion, deep visual artifacts, and maximum-contrast transitions.
- **Primary, Secondary, and Elevated Surfaces:** A narrow stepped range for panels, cards, navigation, and interactive hover states.
- **Primary White:** Headlines, selected states, and critical actions.
- **Secondary Silver:** Supporting copy that still needs comfortable reading contrast.
- **Muted Steel:** Metadata, inactive navigation, and low-priority labels.

### Named Rules

**The Wine, Not Crimson Rule.** Signature fields combine Wine Field, Wine Shadow, Wine Edge, and translucent Cherry Glow. Never allow filters, blending, or saturation to collapse them into pure bright red.

**The Cherry Signal Rule.** ROMADI Signal identifies action and focus. Large atmospheric surfaces use the wine palette; they do not use the signal color as a flat fill.

**The Organic Grain Rule.** Texture must read as irregular film/static grain. Repeating squares, visible tiles, checker patterns, and decorative two-axis grids are prohibited.

## Typography

**Display Font:** Manrope Variable (with Manrope and system sans-serif fallbacks)  
**Body Font:** Manrope Variable (with Manrope and system sans-serif fallbacks)  
**Label/Mono Font:** JetBrains Mono (with SFMono-Regular, Consolas, and Liberation Mono fallbacks)

**Character:** Manrope provides clean, contemporary confidence without becoming sterile. JetBrains Mono introduces a measured technical voice for descriptions, metadata, braces, counters, and system-like details; it supports the brand rather than dominating it.

### Hierarchy

- **Display** (400, fluid hero scale, 0.98 line-height): One dominant statement per viewport. Keep tracking no tighter than `-0.04em` and verify Latvian diacritics at every breakpoint.
- **Headline** (500, fluid section scale, 1 line-height): Two- or three-line section propositions with balanced wrapping.
- **Title** (600, compact fluid scale, 1.4 line-height): Cards, capabilities, navigation groups, and selected showcase concepts.
- **Body** (500, 1rem, 1.5 line-height): Explanatory prose. Keep long copy within 65–75 characters per line.
- **Label** (550, compact fluid scale, 1.6 line-height): Technical descriptions, contact metadata, counters, and bracketed typewriter labels. Uppercase is limited to short navigation or system labels.

### Named Rules

**The Two Voices Rule.** Manrope makes the proposition; JetBrains Mono supplies evidence and metadata. Never set large marketing headlines in mono.

**The Two-Line Promise Rule.** Major CTA copy should resolve into intentional short lines, not an accidental narrow column or a three-line orphan.

## Elevation

ROMADI uses a hybrid of tonal layering and atmospheric depth. Most content sits flat on stepped black surfaces; shadows appear on floating navigation, image previews, primary actions, and major panels. Grain, vignettes, translucent radial light, and inset highlights carry more of the depth than conventional card shadows.

### Shadow Vocabulary

- **Panel Ambient** (`inset 0 1px 0 rgb(255 255 255 / 5%), 0 24px 80px rgb(0 0 0 / 32%)`): Major floating panels only.
- **Panel Hover** (`inset 0 1px 0 rgb(255 255 255 / 8%), 0 32px 100px rgb(0 0 0 / 46%)`): A deliberate lift for an actually clickable panel.
- **Signal Glow** (`0 0 0 1px rgb(224 35 78 / 28%), 0 14px 48px rgb(224 35 78 / 24%)`): Small branded actions and focus moments.
- **Signal Glow Strong** (`0 0 0 1px rgb(224 35 78 / 42%), 0 20px 72px rgb(224 35 78 / 36%)`): Hover state only, never a resting decoration.

### Named Rules

**The Structural Shadow Rule.** Wide shadows are reserved for components that genuinely float above the page. Flat content cells use borders or tonal shifts, not decorative lift.

**The Soft Edge Rule.** Atmosphere fades into adjacent black through vignettes and gradients. Hard rectangular color cutoffs are forbidden unless they define a deliberate panel boundary.

## Components

### Buttons

- **Shape:** Primary and secondary utility buttons are full pills; large editorial CTA buttons use a restrained 16px radius.
- **Primary:** ROMADI Signal with primary white text, a 52px minimum height, strong weight, and compact horizontal padding.
- **Hover / Focus:** Lift by 2px with exponential easing; increase signal brightness or use a clear cherry focus ring. Active state returns to the resting plane.
- **Secondary / Ghost:** Secondary actions use translucent near-black or white surfaces. Ghost actions remain borderless and become white on hover. White CTA buttons invert to black text for decisive conversion moments.

### Chips

- **Style:** Full-pill shape, compact padding, secondary silver text, a subtle white border, and a lightly lifted black surface.
- **State:** Selected or signal chips may use a translucent cherry fill and Signal Lift text; unselected chips must remain quiet.

### Cards / Containers

- **Corner Style:** Content cards use 16px corners. Major panels use 24px. The hero and joined CTA/footer shell may reach 32px because they define the page silhouette.
- **Background:** Cards use the secondary-to-elevated black surface range. Signature showcase and CTA sections use the wine atmospheric field.
- **Shadow Strategy:** Flat by default for repeated cells; ambient elevation only for floating previews and major shells.
- **Border:** One-pixel white borders at low opacity. Pink borders are prohibited around showcase media and concept selectors.
- **Internal Padding:** Start at 24px and scale only when the content density justifies it. Do not leave oversized empty cells.

### Inputs / Fields

- **Style:** A 52px minimum height, 12.8px radius, primary black surface, white text, and a subtle white border.
- **Focus:** Border shifts to ROMADI Signal with a soft three-pixel translucent cherry ring.
- **Error / Disabled:** Errors use signal color with readable copy; disabled fields reduce contrast but retain a visible boundary and legible label.

### Navigation

- **Desktop:** A centered dark floating header with restrained red glass, compact Manrope links, and a clearly separated project action. The services mega menu keeps a real pointer-safe gap and fades upward into place.
- **Mobile:** A right-to-left off-canvas panel. Primary rows enter in a staggered, top-left-tilted domino sequence; service sublinks remain large enough to tap. Counters sit immediately after their labels, never in a right-aligned column.
- **States:** Hover and active copy turns white. Inactive copy stays silver/gray. Dropdown closing is prompt but allows a natural pointer path into the panel.

### Signature Atmospheric Section

The hero, showcase, CTA, and footer transition share a family of layered wine gradients, organic grain, soft vignettes, and moving fields. They should feel related without using an identical composition. The hero may use liquid goo; the showcase uses image concepts; the CTA uses a calmer central glow; the footer resolves into a dotted black panel.

## Do's and Don'ts

### Do:

- **Do** use the exact wine/cherry family for signature fields and verify the rendered result visually after filters and blend modes are applied.
- **Do** align related headings and columns to a shared vertical start.
- **Do** keep selected and hovered showcase labels white while inactive labels remain gray.
- **Do** preserve clear tap targets, visible focus states, keyboard operation, and reduced-motion alternatives.
- **Do** use grain, moving liquid fields, or animated line work only when they reinforce a section’s role.
- **Do** keep the CTA and footer visually joined when they form one closing composition.

### Don't:

- **Don't** substitute bright magenta, pure crimson, or white-hot highlights for the established wine/cherry atmosphere.
- **Don't** use visible square noise, tiled patterns, decorative grids, or accidental vertical and horizontal divider lines.
- **Don't** add pink borders around showcase previews or selectors.
- **Don't** create oversized cards with sparse content; tighten the component before adding decoration.
- **Don't** center-align concept-selector copy or push menu counters to the far edge when the reference calls for immediate adjacency.
- **Don't** repeat numbered section markers or tiny uppercase eyebrows as generic scaffolding; retain them only where they are already a deliberate technical motif.
- **Don't** use glass, glow, shadow, or animation as decoration without a structural or interactive reason.
