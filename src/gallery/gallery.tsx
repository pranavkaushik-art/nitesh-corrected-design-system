"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { TextInput } from "@/components/ds/text-input";
import { cn } from "@/lib/utils";
import { SECTIONS } from "./sections";
import DOCS from "@/site/docs-map.json";

/** Other words people search with, so "graph" finds Charts and "dialog" Modal. */
const KEYWORDS: Record<string, string> = {
  charts: "graph bar line pie donut gauge heatmap sparkline breakdown neutrino",
  "kpi-card": "stat metric number tile",
  select: "picker combobox",
  dropdown: "menu",
  popover: "menu panel",
  "command-menu": "search palette cmdk",
  "date-picker": "calendar range",
  "time-picker": "clock",
  tooltip: "hint",
  "tab-menu": "tabs",
  "segmented-control": "toggle tabs",
  switch: "toggle",
  alert: "toast notification",
  banner: "announcement",
  modal: "dialog popup",
  drawer: "sheet panel side",
  badge: "status chip pill",
  tag: "chip pill",
  avatar: "user profile picture",
  "progress-bar": "loading meter",
  "file-upload": "attach dropzone",
  "rich-editor": "text editor toolbar",
  "color-picker": "colour",
  "content-divider": "separator line",
  "key-components": "label hint legend password",
  label: "hint",
  "text-input": "field",
  "text-area": "field textarea",
  scroll: "scrollbar",
  header: "page header title topbar",
  table: "grid rows",
  filter: "search sort",
  pagination: "pages",
  "step-indicator": "stepper steps",
  breadcrumbs: "path",
  rating: "stars",
  "notification-feed": "inbox",
  "activity-feed": "timeline",
};

const SEARCH_ID = "components-search";

/** The page around the sections: a header with a light and dark switch, an
 *  index down the side, and one section per component. */
export function ComponentsGallery() {
  const { resolvedTheme, setTheme } = useTheme();
  // The theme is only known in the browser; the switch settles after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && (resolvedTheme === "dark" || resolvedTheme === "ink");

  // The index's search: by name, page and the words people use for it.
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const found = q ? SECTIONS.filter((s) => `${s.name} ${s.id} ${s.page} ${KEYWORDS[s.id] ?? ""}`.toLowerCase().includes(q)) : SECTIONS;
  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ block: "start" });
    history.replaceState(null, "", `#${id}`);
  };
  // "/" anywhere on the page puts the cursor in the search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      document.getElementById(SEARCH_ID)?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-bg-white-0 text-text-strong-950">
      <div className="mx-auto flex max-w-[1440px] gap-space-32 px-space-32 py-space-32">
        {/* The index stays in view below the top bar, its search on top and
            its list scrolling on its own, so every component can be found
            and reached (Nitesh, 19 Oct 2026). Enter goes to the first match,
            Escape clears, "/" anywhere focuses the search. */}
        <nav aria-label="Components" className="sticky top-space-48 hidden h-fit max-h-[calc(100dvh-7rem)] w-48 shrink-0 flex-col gap-space-8 lg:flex">
          <p className="text-subheading-2xs uppercase text-text-soft-400">Components</p>
          <TextInput
            id={SEARCH_ID}
            type="search"
            size="xs"
            placeholder="Search"
            aria-label="Search components"
            shortcut="/"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && found[0]) {
                e.preventDefault();
                go(found[0].id);
              } else if (e.key === "Escape") setQuery("");
            }}
          />
          <div className="flex min-h-0 flex-col gap-space-2 overflow-y-auto overscroll-contain pb-space-16">
            {found.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="rounded-corner-6 px-space-8 py-space-4 text-paragraph-sm text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950">
                {s.name}
              </a>
            ))}
            {!found.length && <span className="px-space-8 py-space-4 text-paragraph-sm text-text-soft-400">No component matches.</span>}
          </div>
        </nav>

        <main className="flex min-w-0 flex-1 flex-col gap-space-48">
          <header className="flex flex-wrap items-end justify-between gap-space-16">
            <div className="flex flex-col gap-space-4">
              <h1 className="font-display text-title-h4">Components</h1>
              <p className="max-w-2xl text-paragraph-sm text-text-sub-600">
                The coded components, built only from the pages in 3-base-components and the
                Figma&apos;s tokens. Hover, click and tab through them; the grids also show every
                state side by side. Switch the theme to see dark.
              </p>
            </div>
            <div role="group" aria-label="Theme" className="flex gap-space-4 rounded-corner-10 bg-bg-weak-50 p-space-4">
              {[
                { id: "light", label: "Light", on: !dark },
                { id: "dark", label: "Dark", on: dark },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={t.on}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "rounded-corner-6 px-space-12 py-space-4 text-label-sm",
                    t.on ? "bg-bg-white-0 text-text-strong-950 shadow-card" : "text-text-soft-400 hover:text-text-sub-600",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </header>

          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="flex scroll-mt-space-32 flex-col gap-space-24 border-t border-stroke-soft-200 pt-space-32">
              <div className="flex flex-col gap-space-4">
                <h2 className="font-display text-title-h5">{s.name}</h2>
                <p className="text-paragraph-xs text-text-soft-400">{(DOCS as Record<string, string>)[s.id] ?? s.page}</p>
              </div>
              <s.Component />
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
