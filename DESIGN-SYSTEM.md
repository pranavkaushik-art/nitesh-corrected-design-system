# Merlin Design System: the full reference

Everything about Nitesh's design system in Merlin's colours on one page: what it is, how to run it, the rules, every token and every component with its props and sizes. The code is the source of truth; this page is read from it (each component's own comment, its sizes file and the token files), as of 18 Nov 2026.

* **Figma:** Merlin AI Design System, file `dg3s0vTM8bdlfnGh9kNE3W` (the components here are matched to it node by node).
* **Owner:** Nitesh Arora, product design. Anything missing or wrong goes to him first.
* **More:** [README.md](README.md) (how to pull it), [START-HERE.md](START-HERE.md) (changing the brand), [CLAUDE.md](CLAUDE.md) (rules for Claude sessions), [DECISIONS.md](DECISIONS.md) (every decision, dated), `3-base-components/<name>/README.md` (each component's spec and pictures).

---

## 1. Run it

You need Node 20 or newer.

```bash
npm install
```

```bash
npm run dev
```

| Page | What it shows |
|---|---|
| http://localhost:3100 | Every component in every size and state, in one gallery. Jump to one with `#<section>`, for example `#banner`. |
| http://localhost:3100/foundations | Colours, type, spacing, corners, shadows and icons. |

| Script | Does |
|---|---|
| `npm run dev` | The gallery on port 3100 (Turbopack). |
| `npm run typecheck` | `tsc --noEmit`. Run it after every change. |
| `npm run build` | A production build. |
| `npm run pictures:components` | Retakes the component pictures in `3-base-components/`. |

Stack: React 19, Next 15, Tailwind 4 (tokens in `@theme`), Radix primitives, cmdk, react-day-picker 8 with date-fns, Hugeicons, next-themes.

---

## 2. The rules

1. **Never make a component of your own.** Every button, field, menu, card, table and panel comes from `src/components/ds/`. If nothing fits, ask Nitesh; it gets its spec page before its code.
2. **Sizes come from the components.** Heights, paddings, gaps, corners and icon sizes are tokens in `src/styles/sizes/<component>.css`. Never guess a number.
3. **Never type a value by hand.** No hex, no `rgb()`, no Tailwind palette class (`bg-blue-500`), no `text-[13px]`, no `p-[7px]`. Colours through colour tokens, sizes through size tokens, words through type styles.
4. **Merlin is square.** Every corner is 0. Round stays round only where the shape is the part: radio, switch, avatars and the picture slots that hold them, dots, slider and colour-picker knobs, donut and gauge charts.
5. **Charts are plain.** Solid bars, lines, rings and squares, square corners, light value lines, square keys. Nothing moving on its own, no dotted cells. Use `chart.tsx`.
6. **The look is exact.** Whatever you build looks exactly like the component here: sizes, padding, gaps, corners, edges, shadows, type, colours and every state. Behaviour may come from elsewhere; the look may not.
7. **Light and dark.** Everything works in both. `data-theme="paper"` is light, `data-theme="ink"` is dark (next-themes, on `<html>`).
8. **Type.** Inter for words, DM Mono (`font-data`) for machine data in capitals. Weights 400 and 500 only.
9. **Icons.** Hugeicons, Stroke Rounded, through `src/components/ui/icons.tsx`. The exceptions are glyphs copied exactly from the Figma (`alert-icons.tsx`, `page-header-icons.tsx`, the badge's flashlight).
10. **No em dashes or en dashes** in words a person reads.
11. **Every decision goes into [DECISIONS.md](DECISIONS.md)** with its date.

---

## 3. Foundations

### 3.1 Colour

**The palette** sits at the top of `src/styles/theme-tokens.css`. Every token points at it, so changing a hex value there re-colours the whole system. The brand scale keeps its old name, `--palette-blue-*`, but holds Merlin purple:

| Step | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|
| Brand (`--palette-blue-*`) | `#f6f1fa` | `#e1d3f0` | `#bc9fd3` | `#a074b7` | `#8b4dab` | **`#6e3785`** | `#5d2f70` | `#4c285b` | `#3b1f46` | `#2a1731` |
| Gray (`--palette-gray-*`) | `#fafafa` | `#f7f7f7` | `#ebebeb` | `#d1d1d1` | `#a3a3a3` | `#7b7b7b` | `#5c5c5c` | `#262626` | `#171717` | `#111111` |

(Gray also has 0 `#ffffff` and 950 `#0e0e0e`.) These values are for reference; components never use them directly.

**Semantic tokens.** The Tailwind class is the token's kind, then its name: `bg-bg-white-0`, `text-text-sub-600`, `border-stroke-soft-200`, `text-icon-sub-600`.

| Kind | Tokens |
|---|---|
| Surfaces (`bg-bg-*`) | `white-0`, `weak-25`, `weak-50` (page), `soft-200` (hover, selected), `sub-300`, `surface-800`, `strong-950` |
| Words (`text-text-*`) | `strong-950` (primary), `sub-600` (secondary), `soft-400` (placeholder), `disabled-300`, `white-0` |
| Edges (`stroke-*`) | `soft-200` (default), `sub-300`, `strong-950`, `white-0` |
| Icons (`text-icon-*`) | `strong-950`, `sub-600`, `soft-400`, `disabled-300`, `white-0` |
| Brand (`*-primary-*`) | `primary-base` (500 on light, 400 on dark), `primary-dark`, `primary-darkest`, `primary-light`, `primary-lighter`, `primary-alpha-10`, `-16`, `-24` |
| Status (`*-state-*`) | `state-<name>-base`, `-dark`, `-light`, `-lighter` for success, warning, error, information, away, feature, verified, highlighted, stable, faded |
| Fixed | `static-white`, `static-black`; overlays `overlay-gray`, `overlay-scrim` |

Careful: `bg-primary` is an old near-black. The brand is **`bg-primary-base`**.

### 3.2 Type

One class sets size, line height, weight and letter spacing (`src/styles/typography-tokens.css`). Sizes in px.

| Class | Size / line height | Weight |
|---|---|---|
| `font-display text-title-h1` to `text-title-h6` | 56/64, 48/56, 40/48, 32/40, 24/32, 20/28 | 500 |
| `text-label-xl`, `-lg`, `-md`, `-sm`, `-xs` | 24/32, 18/24, 16/24, 14/20, 12/16 | 500 |
| `text-paragraph-xl`, `-lg`, `-md`, `-sm`, `-xs` | 24/32, 18/24, 16/24, 14/20, 12/16 | 400 |
| `text-subheading-md`, `-sm`, `-xs`, `-2xs` + `uppercase` | 16/24, 14/20, 12/16, 11/12 | 500 |
| `font-data text-data-md`, `-sm`, `-xs`, `-2xs` + `uppercase` | 16/24, 14/20, 12/16, 10/16 | 500 |

Fonts live in `src/app/fonts/` (Inter, DM Mono) and load in `src/app/layout.tsx`.

### 3.3 Spacing

`--space-*` in `src/styles/size-tokens.css`, in px: **0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48**. Classes: `gap-space-16`, `p-space-12`, `px-space-32`.

Use the scale for layout between components. Inside a component, use that component's own token (`px-button-md-x`, `gap-modal-body-gap`), so one component can change later on its own.

The rem values assume a **16px root** (`2.5rem` = 40px).

### 3.4 Corners

`--corner-0` to `--corner-28` all equal **0**. The Figma's steps (2 to 28) are kept as names only, so `rounded-corner-8` is square. `rounded-corner-full` (999) is only for the shapes in rule 4.

### 3.5 Edges, shadows, focus and states

From `src/styles/ds.css`. Put `ds-shadow` on the element, then stack these:

| Utility | Does |
|---|---|
| `edge-<colour>` | A 1px inside edge, for example `edge-stroke-soft-200`. |
| `lift-card` | The card shadow (`--shadow-card`). |
| `ring-focus-primary`, `ring-focus-neutral`, `ring-focus-error` | The focus ring. |
| `edge-none`, `lift-none`, `ring-none` | Clear one layer. |
| `[--ds-lift:var(--shadow-x)]`, `[--ds-edge:...]` | Swap in a component's own shadow or edge token. |

State variants: `ds-hover:`, `ds-focus:`, `ds-active:`, plus `disabled:`. They also fire on `data-force="hover" | "focus" | "active"`, which is how the gallery shows a state still.

---

## 4. Components

48 files in `src/components/ds/`. Each file's top comment lists its props; each has a sizes file in `src/styles/sizes/<name>.css` (the Button's are in `size-tokens.css`) and a spec in `3-base-components/<name>/`.

```tsx
import { Button } from "@/components/ds/button";
import { SearchIcon } from "@/components/ui/icons";
```

### 4.1 Actions

| Component | File | Key props |
|---|---|---|
| `Button` | `button.tsx` | `tone` primary, neutral, error; `variant` filled, stroke, lighter, ghost; `size` md 40, sm 36, xs 32, 2xs 28; `leadingIcon`, `trailingIcon`. No children = icon only (needs `aria-label`). |
| `LinkButton` | `link-button.tsx` | `variant` gray, black, primary, error, modifiable; `size` md 20, sm 16; `underline`. `<a>` with `href`, `<button>` without. |
| `CompactButton` | `compact-button.tsx` | Icon-only control inside another component. `variant` stroke, ghost, white, modifiable; `size` lg 24, md 20; `fullRadius`; `active`. Always needs `aria-label`. |
| `SocialButton` | `social-button.tsx` | `brand` apple, x, google, facebook, linkedin, github, dropbox; `variant` filled, stroke. 40 tall. |
| `FancyButton` | `fancy-button.tsx` | `tone` neutral, basic, primary, error; `size` md, sm, xs. When to use it is undecided: ask Nitesh first. |
| `ButtonGroup`, `ButtonGroupItem` | `button-group.tsx` | 2 to 6 joined items. `size` sm 36, xs 32, 2xs 24; item `active` (aria-pressed), icons, icon only. |

### 4.2 Fields

| Component | File | Key props |
|---|---|---|
| `TextInput` | `text-input.tsx` | `size` md 40, sm 36, xs 32; `appearance` stroke, filled; `type` basic, email, phone, card, website, amount, date, search, password, button, dropdown, emoji; `label`, `required`, `optional`, `info`, `labelLink`, `hint`, `error`, `leftIcon`, `rightIcon`, `picker`. |
| `TextArea` | `text-area.tsx` | One size. Same label and hint as TextInput; `limit` (the counter), `resizable` (never shorter than 72). |
| `FieldLabel`, `HintText` | `label.tsx` | The line above and under a field. HintText `state` default, error, disabled. |
| `Select` (+ `SelectItem`, `SelectGroup`, `SelectHeading`, `SelectSeparator`) | `select.tsx` | `size` md, sm, xs; `type` basic, country, avatar, provider, brand, company; `icon`, `badge`, label props, `hint`, `error`. Also `CompactSelect`, `SelectInputPicker` (inside Phone and Amount), `InlineSelect` (20 tall, no box). |
| `Checkbox`, `CheckboxLabel`, `CheckboxCard` | `checkbox.tsx` | Box `size` md 20, sm 16; `checked` true, false, "indeterminate". Label: `label`, `sublabel`, `badge`, `description`, `link`, `flip`. Card `type` basic, left-icon, avatar, card-provider, brand, company + `picture`. Focus shows on the box, never a ring. |
| `RadioGroup`, `Radio`, `RadioLabel`, `RadioCard` | `radio.tsx` | The Checkbox's twin; only the button differs. |
| `Switch`, `SwitchLabel`, `SwitchCard`, `IntegrationSwitch` | `switch.tsx` | One size; `checked`, `onCheckedChange`. IntegrationSwitch: `direction`, `variant` card, list, `logo`, `title`, `badge`, `action`. |
| `Slider` | `slider.tsx` | One value = Slider, two = Range Slider. `label`, `showValue`, `tooltip`, `format`. |
| `RatingItem`, `RatingReview`, `RatingCell`, `RatingBar`, `RatingBarArea` | `rating.tsx` | Bar `type` emoji, number, star, heart. Filled star waits for Yellow (Amber until then). |
| `ColorPicker` (+ `ColorSpectrum`, `ColorSlider`, `ColorValueField`, `ColorDots`) | `color-picker.tsx` | `defaultValue` `{ hex, alpha }`, `defaultFormat` hex, rgb, hsl, `recommended`. The one place raw colours are drawn (the colour being picked). |
| `DatePicker`, `RangePicker`, `DatePickerPopover` | `date-picker.tsx` | `value`, `onValueChange`, `onApply`, `onCancel`; RangePicker `quickPicks`. Weeks start Monday. |
| `TimePicker`, `TimePickerPopover`, `TimeList` (+ `TimeItem`, `DurationChip`, `StatusChip`) | `time-picker.tsx` | `value` in minutes after midnight, `durations`, `hour12`. Never the browser's time input. |
| `FileUploadArea`, `FileUploadCard`, `FileUploadList`, `FileFormatIcon`, `ImageUpload` | `file-upload.tsx` | Area: `onFiles`, `accept`, `multiple`, `disabled`, `error`. Card `state` progress, success, error + `progress`, `onCancel`, `onRemove`, `onRetry`. List puts cards 12 apart. Format icon `size` md 40, xs 32, `color`; `fileFormatOf(name)`. ImageUpload `type` avatar, company, `align` vertical, horizontal. The Figma's area is 400 wide (`w-file-upload-figma`). |
| `RichEditorToolbar`, `RichEditorButton`, `RichEditorBox` (+ divider and colour menu) | `rich-editor.tsx` | Toolbar `look` floating (32), attached (36). Button `type` text, dropdown, color, icon + `label`, `menu`, `active`. Plain text is the TextArea. |

### 4.3 Navigation

| Component | File | Key props |
|---|---|---|
| `TabMenu`, `TabMenuList`, `TabMenuTrigger`, `TabMenuContent` | `tab-menu.tsx` | `orientation` horizontal, vertical; vertical `variant` card, list; slots `badge`, `end`, `heading`. |
| `SegmentedControl`, `SegmentedControlItem` | `segmented-control.tsx` | `size` md 36, sm 28; `label`; items share the full width. |
| `Breadcrumbs`, `BreadcrumbItem` | `breadcrumbs.tsx` | `divider` arrow, slash, dot; item `icon`, `current`, `href`. |
| `Pagination` | `pagination.tsx` | `variant` basic, full-radius, group; `page` or `defaultPage`, `pageCount`, `summary`, `perPage` (a CompactSelect xs). |
| `StepIndicator`, `StepMark`, `StepperDot` | `step-indicator.tsx` | `direction` horizontal, vertical; `steps`; `current` from 0. StepperDot `size`, `count`, `current`. |
| `CommandMenu` (+ `Panel`, `Search`, `Filters`, `List`, `Group`, `Item`, `Row`, `Footer`) | `command-menu.tsx` | cmdk inside a Radix dialog, 600 wide. Item `size` sm 40, md 64; `type` basic, icon, avatar, brand, company, country + `picture`; `label`, `sublabel`, `description`, `badge`, `shortcut`, `action`. Binds no key on its own. |
| `PageHeader` | `page-header.tsx` | `type` basic, avatar, left-icon, brand, company (+ `picture`); `title`, `description`; `search`, `notification`, `unread`; `dropdown`; `actions` (12 apart); `divider`; `background` (off sits on the page). Figma frame 1168 x 88: 24 at the sides, 20 top and bottom. |

### 4.4 Menus and overlays

| Component | File | Key props |
|---|---|---|
| `Dropdown` (+ `Trigger`, `Content`, `Item`, `CheckboxItem`, `Sub*`, `Group`, `Heading`, `Separator`, `Search`, `ButtonRow`, `Caption`) | `dropdown.tsx` | Every menu is this. Content: padding 8, rows 4 apart, 300 wide (`width` menu, trigger, content). Item `size` sm 36, lg 56; `type` basic, country, avatar, provider, brand, company; `label`, `sublabel`, `description`, `badge`, `shortcut`, `action`, `rightIcon`. CheckboxItem `control` checkbox, switch. |
| `Popover`, `PopoverPanel`, `PopoverFooter` | `popover.tsx` | `tail` none or one of 12 sides (32 from the nearer corner); `icon` (a Key Icon, Large 48); `title`, `description`, `close`; footer `type` stepper, text-stepper, stretch. |
| `Tooltip`, `TooltipPanel` | `tooltip.tsx` | `size` 2xs 20, xs 28, lg (280 wide); `variant` light, dark; `tail`; Large adds `icon`, `title`, `description`, `close`. Never the browser's `title`. |
| `Modal`, `ModalTrigger`, `ModalContent`, `ModalHeader`, `ModalBody`, `ModalFooter`, `StatusModalContent` | `modal.tsx` | Content `width` sm 400 (default), md 440, lg 480. Header `size` md 72, sm 56; `type` basic, left-icon, error, warning, success, information; `close`. Body padding 20, items 20 apart, scrolls. Footer `type` basic, checkbox, information, toggle, stepper, link-button, stretch; `leading`, `cancel`, `confirm` (null leaves one out). StatusModalContent `type`, `alignment` horizontal, vertical, in an md box. `ModalBox`, `ModalBackdrop` draw it still. |
| `Drawer` (+ `Trigger`, `Content`, `Panel`, `Header`, `Body`, `Section`, `Footer`) | `drawer.tsx` | Slides in on the right, full height. `backdrop` off by default. Header `size` sm 64, md, lg 88; `type` basic, left-icon; `badge`, `link`, `line`, `close`. Section padding 20, items 16 apart, `band`. Footer `type` stretch (default), basic, checkbox, toggle, stepper, link-button. |
| `HorizontalFilter`, `FilterPanel` (+ items, header, choices, footer) | `filter.tsx` | Bar 36 tall, parts 12 apart; `type` table, calendar. Panel: groups down the left (Radix tabs), Clear and Apply. |

### 4.5 Feedback

| Component | File | Key props |
|---|---|---|
| `Alert`, `AlertLink`, `showToast`, `AlertToaster` | `alert.tsx` | `size` xs 32, sm 36, lg (title, description, links); `variant` filled, light, lighter, stroke; `status` error, warning, success, information, feature; `onClose`. One component used as Alert, Toast (bottom centre) and Notification (lg, bottom right). |
| `Banner`, `BannerLink` | `banner.tsx` | Whole-product message, full width, 44 tall. Same `status` and `variant` as Alert; `title`, `description`, `link`, `onClose`. Uses the Figma's filled status icons from `alert-icons.tsx`, the same as the Alert. |
| `ProgressBar`, `ProgressBarLabel`, `ProgressBarLink`, `CircularProgressBar` | `progress-bar.tsx` | `value` 0 to 100, `color` blue, red, orange, green. Label `type` top, right. Circular `size` 80, 72, 64, 56, 48. |
| `NotificationFeed` (+ `Header`, `Tabs`, `List`, `Item`, `Quiet`, `Footer`) | `notification-feed.tsx` | Panel 540 wide. Item: `avatar` (40), `unread` (the red status dot, 9 with a 6.75 dot, on the avatar's top right), `label`, `time`, `description`, then one of `actions`, `file`, `message`; `onMore`. |
| `ActivityFeed` (+ `Event`, `Action`, `FileChip`, `CommentChip`, `TaskChip`, `FilterChip`) | `activity-feed.tsx` | Events 32 apart on a line through the pictures. Event picture is an Avatar 32 or a Key Icon sm. |

### 4.6 Display

| Component | File | Key props |
|---|---|---|
| `Badge`, `StatusBadge` | `badge.tsx` | A label that only reports. Colours, variants, left or right icon. |
| `Tag` | `tag.tsx` | A label a person picks, filters by or removes. 24 tall; `variant` stroke, gray; `tone` neutral, blue; `active`, `picture`, `count`, `onDismiss`, `onClick`. |
| `Avatar`, `AvatarGroup`, `CompactAvatarGroup` | `avatar.tsx` | `size` 80, 72, 64, 56, 48, 40, 32, 24, 20; `src`, `alt`, `name` (initials and a stable colour); `color` gray, blue, red, yellow, purple, sky, spirit; `topMark` favorite, add, remove, notification; `bottomMark` online, offline, busy or a company logo. Compact group `size` 40, 32, 24, `variant` default, stroke. |
| `ContentDivider` | `content-divider.tsx` | Every separating line. `type` line, line-spacing, text-line, text, solid-text, icon-button, icon-button-group, text-button, text-button-group. Never a hand-drawn border or `<hr>`. |
| `KeyIcon`, `ContentLabel`, `ContentCard`, `PasswordStrength`, `LegendDot` | `key-components.tsx` | KeyIcon `size` 2xl 64, xl 56, lg 48, md 40, sm 32; `variant` stroke, lighter; `color` gray, blue, orange, red, green. ContentLabel `size` md 40, lg 48. |
| `Accordion`, `AccordionItem` | `accordion.tsx` | With the Figma's question-line icon. |
| `ScrollArea` | `scroll.tsx` | Every styled scrollbar. `size` md 20, sm 16, xs 12; `variant` default, lighter; `orientation`; `type` hover, always. Needs a height. |

### 4.7 Data

| Component | File | Key props |
|---|---|---|
| `Table` (+ `TableHeader`, `TableHeaderCell`, `TableBody`, `TableRow`, `TableGroupRow`, `TableCell`, `TableTextCell`, `TableNumberCell`, `TableFooter`, `TableBulkBar`, `useTablePicks`) | `table.tsx` | A CSS grid. `size` xl (64 rows, two lines), lg (48), grid (40, the Excel kind); `columns` ("fill" or a cell type); sorting, resizing, group rows, bulk bar. Every list of records with columns. |
| `ChartCard`, `BarChart`, `LineChart`, `DonutChart`, `Gauge`, `Heatmap`, `BreakdownBar`, `ChartLegend`, `Swatch` | `chart.tsx` | Data as rows (`data`, `xKey`, `series`). Keyboard-navigable, with a data table for screen readers. Plain (rule 5). |
| `KpiCard` | `kpi-card.tsx` | `label`, `icon`, `value`, `change` `{ value, good }`, `period`, `trend` line, bars, gauge, breakdown; `loading`. |
| `neutrino-cells.tsx` | | The charts' colours from the light's ramp (`useCellTheme`, `rampAt`, `penAt`). Its dotted `CellCanvas` is never used for a chart. |

---

## 5. Building with it: things that bite

* **The global paragraph margin.** `src/styles/typography.css` sets `p { margin: 1.25em 0 }`. Any `<p>` inside a component must carry `m-0`, or it pushes the layout off the Figma. Every component here already does (PageHeader, NotificationFeed, ActivityFeed, Modal, FileUpload, HintText, Banner, Alert).
* **A width in `className` may not win.** Components that are `w-full` keep it over a width class you pass. Put the width on a wrapper: `<div className="w-file-upload-figma max-w-full"><FileUploadArea /></div>`.
* **Showing a state still.** `data-force="hover" | "focus" | "active"` on a part draws that state without the pointer; the gallery uses it.
* **Status classes.** In this repo the status colours take the `-base` step: `bg-state-error-base`. (In ether-web-v1 the same colour is `bg-state-error`, with no suffix.)
* **The 16px root.** Sizes are rem on a 16px root. In an app with a 14px root (ether-web-v1), write sizes in px or they shrink by 12.5%.
* **Exact Figma glyphs.** When the Figma draws an icon Hugeicons does not have (status fills, close-line, page header icons), it is copied into its own `*-icons.tsx` file and drawn in `currentColor`. Reuse those files; do not redraw.

---

## 6. Where things are

| What | Where |
|---|---|
| Components | `src/components/ds/` |
| Each component's sizes | `src/styles/sizes/<name>.css` |
| Spacing and corner scales, the Button's sizes | `src/styles/size-tokens.css` |
| Colours, light and dark, and shadows | `src/styles/theme-tokens.css` |
| Type styles | `src/styles/typography-tokens.css` (`typography.css` holds the base element styles) |
| Edges, shadows, focus rings, state variants | `src/styles/ds.css` |
| Icons | `src/components/ui/icons.tsx` |
| Fonts | `src/app/fonts/` |
| The gallery | `src/gallery/gallery.tsx`, one section per component in `src/gallery/sections/` |
| The foundations page | `src/app/foundations/` |
| Specs and pictures | `1-core-elements/`, `3-base-components/`, `4-product-components/` |
| Tokens as JSON | `tokens/` |
| Decisions | `DECISIONS.md` |

**Using it in another app.** Same stack: copy `src/components/ds`, `src/components/ui/icons.tsx`, `src/components/input-modality.tsx`, `src/lib` and `src/styles`, import the styles in the order `src/app/globals.css` does (`typography.css`, `theme.css`, `theme-tokens.css`, `typography-tokens.css`, `size-tokens.css`, `ds.css`, after `tailwindcss` and `tw-animate-css`), and add the packages from `package.json`. Another stack: keep that project's behaviour and restyle until the look matches exactly (rule 6).

---

## 7. Changing it

1. A token change reaches every component at once. Change it, run `npm run typecheck`, then check the gallery in light and dark.
2. Matching a Figma frame: read the node's exact numbers (Dev Mode), set them as tokens in the component's sizes file, then measure the live DOM against them. Never spec off a screenshot.
3. Something missing goes to Nitesh first: spec page, then code, then a dated line in `DECISIONS.md`.
4. Another product's colours: branch (`git switch -c <product>`), change the palette hex values (light and dark) in `theme-tokens.css`, push the branch.

## 8. Still open

* Yellow, Teal, Purple, Pink and Sky hues are not in the palette yet; the parts that need them say so (rating star, file format icons, key icon colours, colour dots).
* Not in code yet: the Grid System, the Figma's five motion speeds, most Assets, and the Product Components beyond Charts, the KPI Card and the Page Header.
* Every Base Component waits for Nitesh's review; each spec page's "Open" section lists what is undecided.
