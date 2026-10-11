# M's Sweet Corner: scroll-driven bakery template for Framer

This repo is the **kit** for the Framer template: seven code components with
property controls, the CMS data, the style spec, and the guide. Framer projects
can't be created from outside Framer, so a few one-time steps (below) assemble
the kit into the published template. The code was typechecked and exercised in a
real browser (scroll scenes, cart, focus handling, mobile and reduced-motion
fallbacks).

```
framer/code/    paste each file into Framer as a code file (Assets → Code → +)
framer/cms/     products.csv: import into the Products CMS collection
framer/styles.md   color / text / spacing / breakpoint spec
dev/            local preview + checks (not needed in Framer)
```

---------------------------------------------------------------------------

## Part 1: Assemble the template (template author, ~45 min)

1. **New project.** Create a Framer project; set breakpoints Desktop 1200, Tablet 810, Phone 390.
2. **Styles.** Create the color and text styles in `framer/styles.md`.
3. **Code files.** For every file in `framer/code/` create a code file with the *same name*
   (keep `tokens.ts`, `cartStore.ts`, `GrainOverlay.tsx` too; the components import them).
   Paste the contents. Each component then appears in the Assets panel.
4. **CMS.** CMS → New collection **Products** with fields: `Title` (title), `Slug`,
   `Image` (image), `Description` (plain text), `Price` (number), `Category`
   (option: Cakes / Cookies / Macarons). Import `framer/cms/products.csv`.
5. **Page layout** (single page; give each section the anchor id shown):

   | Order | What to place | Settings |
   |---|---|---|
   | fixed top | **GlassNavbar** | Position Fixed, top 16, Width Fill (max 1100) |
   | fixed | **CartPanel** (one instance) | Position Fixed; place at the top level of the page |
   | 1 `#top` | **ScrollBakery** | Width Fill, Height Fit; no ancestor with *Overflow: hidden* (breaks sticky) |
   | 2 `#menu` | Collection list of **Products** → **ProductCard** inside | Grid, 3 / 2 / 1 columns. Bind Image, Name→Title, Description, Price, Category, **Product ID→Slug** |
   | 3 `#story` | **StoryReveal** | max width 1100 |
   | 4 `#custom` | **CustomOrderForm** | max width 700 |
   | 5 `#visit` | **SiteFooter** | |
   | overlay | **GrainOverlay** | Fixed, full page, Z above content, ignores pointer events |

6. **Link colors/fonts** on every component to your styles (Accent→Caramel, Cream→Cream, Cocoa→Cocoa, Butter→Butter; ScrollBakery fonts → Display/Body).
7. **Test** at each breakpoint with the preview. Check: keyboard-only through nav → cart → menu → form; reduced motion on (OS setting) shows the stacked layout.
8. **Publish** and submit/duplicate as a template.

> E-commerce: Framer's built-in e-commerce availability depends on the plan/region, so this kit ships the
> **local-state cart** (works on every plan). To use Framer's native e-commerce instead,
> swap ProductCard's button for the native Add to Cart and keep CartButton/CartPanel styling.

---------------------------------------------------------------------------

## Part 2: Buyer guide (include this in the template)

### Change the name, hero text and scenes
Select **ScrollBakery** → properties: *Bakery name*, *Hero text*, *Hero line*, *Button label/link*.
- **Scenes** (3–6): set the *Scenes* number, then edit each item's headline, short line,
  image and **alt text**. The image field labelled **"Image (replace me)"** is where your photo goes.
  Until you add one a warm gradient is shown.
- Photo tips: landscape 2400×1400 or larger, keep the lower-left clear for text, similar warm tones across scenes.
- **Flour scene #** picks which scene the drifting flour peaks on. **Scroll / scene** sets how long each scene lasts.
- Using video or an image sequence instead? Export stills from your clip (one per scene), or replace the
  `<img>` in `ScrollBakery.tsx` (`Scene`, marked *BACKGROUND*) with a `<video muted playsInline>`.
- Change the bakery name in **GlassNavbar** and **SiteFooter** too.
- Replace the `[LOCATION]` and `[HOURS]` placeholders in **SiteFooter**.

### Edit the menu
CMS → **Products**. Add, delete, or edit rows (name, image, description, price, category). The menu grid
and cart update automatically; no layout edits needed. Replace every `REPLACE ... photo` image.
Keep **Slug** unique: it's the cart's product ID.

### Change colors and fonts
Assets → Styles. Edit `Cream`, `Caramel`, `Cocoa`, `Butter` once; edit `Display`/`Body` text styles for fonts.
The accent color can also be set per component (*Accent* property).

### Grain on or off
Select **GrainOverlay** → *Show grain* (or *Strength*). ScrollBakery also has its own *Show grain* toggle.

### Custom-order form
Select **CustomOrderForm** → paste a form-service URL in *Endpoint* (Formspree, Formspark, Basin, etc.).
It sends JSON `{name, phone, date, notes}`. With no endpoint it runs in demo mode and says nothing was sent.

### Connect checkout
The cart is a local cart (browser storage); it does **not** take payments until you connect a provider.
- **Easiest:** create a hosted *Payment Link* (Stripe, Square, PayPal) and paste it in **CartPanel → Checkout URL**.
  (One link means one fixed amount/product; fine for deposits.)
- **Real cart checkout:** edit `handleCheckout` in `CartPanel.tsx`. It receives `items`
  (`id, name, price, qty`). POST them to your own serverless function that creates a
  Stripe Checkout Session, then redirect to `session.url`. **Never put secret keys in the component.**
  Always recompute prices server-side from your own product list.
- Shopify/Snipcart/Ecwid: map `items` to their cart API in the same function.

### Mobile, tablet and accessibility
- Under 810 px (and for visitors with *reduce motion* on) the scroll film becomes a simple stacked layout; change the cut-off with *Static below*.
- Every image has alt text (ScrollBakery scene alt, ProductCard uses the product name, StoryReveal alt).
- Visible focus rings, a labelled cart button ("Open cart, N items"), and a cart dialog with
  focus trap, Escape to close, and focus returned to the cart button.

### Known limits
- Framer must render the page sticky-friendly: no ancestor with *Overflow: hidden/clip* around ScrollBakery.
- The cart is per-browser (localStorage) and not secure for pricing; see checkout above.
- The static/cinematic switch happens after hydration, so a very brief flash can occur on phones.

---------------------------------------------------------------------------

## Local checks (optional)

```bash
npm install
npm run typecheck        # components compile against a stub of the framer package
npm run preview:build    # bundles dev/preview.tsx into dev/out/ for a browser look
```
