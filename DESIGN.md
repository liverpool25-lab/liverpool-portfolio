# Design System & Aesthetics — Liverpool Portfolio

## 1. Visual Direction & Identity

- **Design Philosophy**: High-precision Editorial Modernism meets Computational Craft. Merges the tactile, warm editorial composition inspired by curated portfolios with the sharp technical rigor of Stitch's tactical terminal aesthetics.
- **Atmosphere**: Warm ivory `#F6F4EF` foundation / Obsidian Dark `#0B0D10` night canvas, anchored by high-contrast typography, restrained hairline borders, and the signature Spider-Man Red `#D9323E` focal accent with bioluminescent Lime `#C8F36B` and Mint `#72D9BC` telemetry tags.

## 2. Core Color Palette

| Token | Light Theme | Dark Theme | Purpose |
|---|---|---|---|
| `bg-background` | `#F6F4EF` (Warm Ivory) | `#0B0D10` (Obsidian Canvas) | Global viewport background |
| `surface-low` | `#ECE9E1` | `#161B20` | Cards, panels, input fields |
| `surface-container` | `#E3DFD5` | `#1E242B` | Hover states, inner containers |
| `surface-high` | `#D8D3C7` | `#28303A` | Badges, toolbars, modal backgrounds |
| `on-surface` | `#171717` (Near-Black) | `#F2F4F4` (Crisp Off-White) | Primary display headlines & labels |
| `on-surface-variant`| `#5C6470` | `#9CA6B2` | Body copy, secondary metadata |
| `primary` / Accent | `#D9323E` (Spider Red) | `#D9323E` / `#C8F36B` (Lime) | Main interactive accent & CTA highlights |
| `secondary` | `#0E7490` (Deep Teal) | `#72D9BC` (Soft Mint) | Secondary tags, security telemetry |
| `border-subtle` | `rgba(23, 23, 23, 0.08)` | `rgba(255, 255, 255, 0.08)` | Hairline dividers and borders |

## 3. Typographic Scale

- **Headlines & Display**: Space Grotesk (700 / 600 / 500) — geometric, bold, authoritative.
- **Body & Prose**: Inter / Manrope (400 / 500) — legible, relaxed rhythm.
- **Telemetry & Labels**: JetBrains Mono (500 / 600) — uppercase, tracked, instrument-grade.

## 4. Key Interactive Elements

- **Welcome Intro**: Fullscreen editorial sequence with staged letter animation, red accent stroke, and curtain reveal.
- **Hero Spider-Man Spotlight**: Localized radial mask following mouse coordinates via `requestAnimationFrame` with smooth feathering and opacity blend (0.65).
- **3D Coverflow Gallery**: Single horizontal rail with perspective origin; active center card elevated with 0deg rotation, while neighbor cards dynamically tilt inward at responsive angles.
- **Lightbox**: Quick zoom transition with full metadata, keyboard escape, and arrow navigation.
- **Language Switcher**: Instant reactive switch between Indonesian (ID) and English (EN) covering 100% of the UI.
