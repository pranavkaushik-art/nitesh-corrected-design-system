# Merlin Nitesh's New Design System

Nitesh's design system in Merlin's colours: every token, component and rule, the same as Nitesh's Figma library, in code you can run. It started as Neutrino's (8bit's product), so older pages say "Neutrino".

**The full reference:** [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md): the rules, every token and every component with its props and sizes, on one page.

**For Claude:** [CLAUDE.md](CLAUDE.md) holds the rules every session follows: build only from these components and tokens, never a component of its own.

**Figma:** [Nitesh's New Personal Design System](https://www.figma.com/design/Ao3YVgFYdQIF0znq2ToqVl)
**Owner:** Nitesh Arora, product design. Questions and changes go to him.

## Pull it anywhere

The link: **https://github.com/nitesharora36/nitesh-corrected-design-system.git** (SSH: `git@github.com:nitesharora36/nitesh-corrected-design-system.git`). The repo is private, so sign in to GitHub as nitesharora36 first on any computer (`gh auth login`).

| To | Run |
|---|---|
| Get it the first time | `git clone https://github.com/nitesharora36/nitesh-corrected-design-system.git ~/dev/design-system-kit-merlin` |
| Bring it up to date | `git -C ~/dev/design-system-kit-merlin pull` |
| Make every Claude Code session on that computer follow it | `~/dev/design-system-kit-merlin/scripts/install-claude.sh` (adds the section in [scripts/claude-global.md](scripts/claude-global.md) to `~/.claude/CLAUDE.md`; run it again after a pull) |
| Put it inside another project, so Claude sessions there read it | `git submodule add https://github.com/nitesharora36/nitesh-corrected-design-system.git design-system`, then add the line `@design-system/CLAUDE.md` to that project's CLAUDE.md |
| Update it inside that project | `git submodule update --remote design-system` |
| Make a branch for another product | `git switch -c my-product`, change its colours (see [START-HERE.md](START-HERE.md)), then `git push -u origin my-product` |

## What's inside

The folders follow the Figma's pages, in the same order.

| Figma | Here | What you find |
|---|---|---|
| Get Started | this page | What the system is, how to use it, the rules |
| Core Elements | [1-core-elements](1-core-elements) | Color Palette, Icons, Grid System, Shadows, Motions & Animations, Typography, Corner Radius |
| Assets | [2-assets](2-assets) | The brand's logos, placeholders, and what is still in the Figma only |
| Base Components | [3-base-components](3-base-components) | 45 components on 40 Figma pages. Each: pictures in light and dark, how to use it, its full spec, its code |
| Product Components | [4-product-components](4-product-components) | Charts and the KPI Card |
| | [tokens](tokens) | Every token as JSON, for other tools |
| | [src](src) | The code: components, styles, icons, and the gallery app |

Also here: [DECISIONS.md](DECISIONS.md), every design decision with its date, and [SOURCE.md](SOURCE.md), when this copy was last brought up to date.

## See it working

You need Node 20 or newer.

```bash
npm install
npm run dev
```

Then open:

* [localhost:3100](http://localhost:3100): every component in every size and state. Hover, click and tab through them.
* [localhost:3100/foundations](http://localhost:3100/foundations): the colours, type, spacing, corners, shadows and icons.

Each page switches between light and dark at its top.

## For designers

Each folder here is a page of the Figma. Open a component's folder to see the coded component in light and dark, next to its spec: the sizes, states and colour tokens measured from the Figma frame, and what is still open. Where the code and the Figma differ, the page says so.

## For developers

The code sits at the same paths as in the product (`neutrino-frontend-v3`), so a file copies across unchanged: `src/components/ds/button.tsx` here is `components/ds/button.tsx` there.

1. **Styles.** Import them in this order in the app's global stylesheet, after `tailwindcss` and `tw-animate-css` (see [`src/app/globals.css`](src/app/globals.css)): `typography.css`, `theme.css`, `theme-tokens.css`, `typography-tokens.css`, `size-tokens.css` (it brings in every file in `sizes/`), `ds.css`.
2. **Components.** `import { Button } from "@/components/ds/button";` Each component's page lists what it exports.
3. **Icons.** `import { SearchIcon } from "@/components/ui/icons";`
4. **Colours, by token.** `bg-bg-white-0`, `text-text-sub-600`, `border-stroke-soft-200`, `bg-primary-base`, `bg-state-error-lighter`. Never a hex, never Tailwind's own palette (`bg-blue-500`). Careful: `bg-primary` is the old near-black; the brand blue is `bg-primary-base`.
5. **Type, by style.** `text-label-sm`, `text-paragraph-md`, `font-display text-title-h4`, `font-data text-data-xs uppercase`.
6. **Light and dark.** next-themes puts `data-theme="paper"` (light) or `data-theme="ink"` (dark) on `<html>`, and every token follows.

The packages the components need are in [`package.json`](package.json): React 19, Next 15, Tailwind 4, Radix, cmdk, react-day-picker and Hugeicons.

## The rules

1. Build only from what is written here. No page, no component: something missing goes to Nitesh first, and gets its page before its code.
2. Colours only through colour tokens, sizes only through size tokens, words only through the type styles. Never a hex, a pixel size or a font size typed into a component.
3. Every component works in light and in dark.
4. Icons are Hugeicons, Stroke Rounded, only through `icons.tsx`.
5. Inter for the product. No 600 or 700 weights on words.
6. Every decision goes into [DECISIONS.md](DECISIONS.md) with its date.
7. Merlin is square: every corner is 0. Round stays round only where the shape is the part: radio, switch, avatars and the picture slots that hold them, dots, slider and colour-picker knobs, donut and gauge charts.
8. The look is exact: in any app, what is built looks exactly like these components. Behaviour may come from elsewhere.

## This copy

A standalone copy of the design system, taken on 2 Nov 2026, to use in another product. Edit it here. To change the colours, fonts and brand, read [START-HERE.md](START-HERE.md).

To retake the component pictures after a change: `npm run dev`, then `npm run pictures:components`.

## Where it stands

* Every Base Component is coded and waits for Nitesh's review. Each page's "Open" section lists what is still undecided.
* Not in code yet: the Grid System, the Figma's five motion speeds, most Assets (flags, emojis, app store badges, thumbnails, cursors), and the Figma's Product Components (Navigation, Page Headers, Widgets, Empty States), Sector Products and Landing Page.
* The product's own screens still use their older components (`components/ui`); they move onto these components as they are redesigned, the Workflow Studio first.
