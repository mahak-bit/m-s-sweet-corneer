# Styles spec (create once in Framer, then link everything to them)

## Color styles (Assets panel → Styles → Colors)

| Style name        | Light value | Used for                          |
|-------------------|-------------|-----------------------------------|
| `Cream`           | `#F7EFE3`   | page background, text on imagery  |
| `Caramel`         | `#C98A4B`   | accent, buttons, cart badge       |
| `Cocoa`           | `#4A2C1D`   | body text, dark scenes            |
| `Butter`          | `#F3D98B`   | highlights, flour specks          |
| `Glass Tint`      | `#F7EFE3` @ 40% | frosted panel fill            |
| `Glass Border`    | `#F7EFE3` @ 55% | 1px panel borders             |

No pure white or neon anywhere. Each code component has Accent / Cream / Cocoa /
Butter color properties: click the style picker on each and choose the style.
Change a style once and the whole site follows.

## Text styles (Assets panel → Styles → Text)

| Style      | Font                                     | Size (desktop / tablet / mobile) | Weight |
|------------|------------------------------------------|----------------------------------|--------|
| `Display`  | Fraunces (or Playfair Display), serif    | 72 / 56 / 40                     | 600    |
| `H2`       | Fraunces                                 | 48 / 40 / 30                     | 600    |
| `H3`       | Fraunces                                 | 22 / 22 / 20                     | 600    |
| `Body`     | Inter (or DM Sans), sans                 | 18 / 17 / 16                     | 400    |
| `Small`    | Inter                                    | 14 / 14 / 13                     | 500    |

Components with a Font property (ScrollBakery) take these styles directly.
The others use the same families by default; to change fonts everywhere, edit
the `font-family` strings at the top of each component, or wrap them in your
text styles in the page.

## Spacing and glass

- Spacing scale: 8 / 16 / 24 / 32 / 48 / 80 / 120 px. Section padding 80 (desktop), 56 (tablet), 40 (mobile).
- Radius: 24 (cards), 28 (large panels), 999 (buttons, navbar).
- Glass recipe (already built into the components): Glass Tint fill, 16px background blur,
  1px Glass Border, shadow `0 8 32 rgba(74,44,29,.18)`. For your own panels use
  Effects → Background blur 16.

## Breakpoints

| Name    | Width     |
|---------|-----------|
| Desktop | ≥ 1200 px |
| Tablet  | 810–1199  |
| Mobile  | ≤ 809     |

Below 810 px ScrollBakery switches to a stacked static layout (also used for
reduced-motion users), and GlassNavbar collapses to a menu button.
