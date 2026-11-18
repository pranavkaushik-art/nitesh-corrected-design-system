"use client";

import {
  ScrollArea,
  type ScrollSize,
  type ScrollVariant,
} from "@/components/ds/scroll";
import { Group, Labelled } from "../parts";

const SIZES: { id: ScrollSize; label: string }[] = [
  { id: "md", label: "Medium 20 (the default)" },
  { id: "sm", label: "Small 16" },
  { id: "xs", label: "X-Small 12" },
];
const VARIANTS: { id: ScrollVariant; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "lighter", label: "Lighter" },
];

const PEOPLE = [
  "Ana Silva",
  "Ben Okafor",
  "Chloe Martin",
  "Dev Patel",
  "Elena Rossi",
  "Femi Adeyemi",
  "Grace Lee",
  "Hugo Laurent",
  "Ines Costa",
  "Jamal Wright",
  "Kira Tanaka",
  "Liam Murphy",
  "Maya Cohen",
  "Noah Fischer",
  "Olga Petrova",
  "Priya Shah",
  "Quinn Taylor",
  "Rosa Diaz",
  "Sam Novak",
  "Tara Singh",
];

/** A long list to scroll, clear of the track. */
function People({ pad }: { pad: string }) {
  return (
    // list-inside: the bullet sits inside the 12px left padding instead of
    // hanging on the edge. m-0 on the li drops the base 0.5em margins
    // (typography.css) so the rows are 8px apart.
    <ul className={`m-0 flex list-inside list-disc flex-col gap-space-8 py-space-12 pl-space-12 ${pad}`}>
      {PEOPLE.map((p) => (
        <li key={p} className="m-0 text-paragraph-sm text-text-strong-950">
          {p}
        </li>
      ))}
    </ul>
  );
}

/** A hairline frame around an area, 1px out, so the area's own edges show. */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="ds-shadow edge-stroke-soft-200 w-full overflow-hidden rounded-corner-12 bg-bg-white-0 p-space-1">
      {children}
    </div>
  );
}

/** The right padding that keeps the words clear of each track. */
const CLEAR: Record<ScrollSize, string> = {
  md: "pr-scroll-md",
  sm: "pr-scroll-sm",
  xs: "pr-scroll-xs",
};

export function ScrollSection() {
  return (
    <div className="flex flex-col gap-space-40">
      {VARIANTS.map((v) => (
        <Group
          key={v.id}
          label={`${v.label}, every size, always shown, 400 tall as the Figma draws it`}
        >
          <div className="grid grid-cols-3 gap-space-24">
            {SIZES.map((s) => (
              <Labelled key={s.id} label={s.label}>
                <Frame>
                  <ScrollArea
                    type="always"
                    size={s.id}
                    variant={v.id}
                    className="h-scroll-figma"
                  >
                    <People pad={CLEAR[s.id]} />
                  </ScrollArea>
                </Frame>
              </Labelled>
            ))}
          </div>
        </Group>
      ))}

      <Group label="Thumb under the pointer and while dragged (ours: one step stronger)">
        <div className="grid grid-cols-3 gap-space-24">
          {VARIANTS.map((v) => (
            <Labelled key={v.id} label={`${v.label}, Hover`}>
              <Frame>
                <ScrollArea
                  type="always"
                  variant={v.id}
                  data-force="hover"
                  className="h-scroll-figma"
                >
                  <People pad={CLEAR.md} />
                </ScrollArea>
              </Frame>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Try it: the track shows while the pointer is over the area or it scrolls (ours)">
        <div className="grid grid-cols-3 gap-space-24">
          {VARIANTS.map((v) => (
            <Labelled key={v.id} label={v.label}>
              <Frame>
                <ScrollArea variant={v.id} className="h-scroll-figma">
                  <People pad={CLEAR.md} />
                </ScrollArea>
              </Frame>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Sideways (ours): the track on its side, its edge along the top">
        <div className="grid grid-cols-3 gap-space-24">
          {SIZES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <Frame>
                <ScrollArea type="always" orientation="horizontal" size={s.id}>
                  <p
                    className={`w-max px-space-12 pt-space-12 text-paragraph-sm whitespace-nowrap text-text-strong-950 ${{ md: "pb-scroll-md", sm: "pb-scroll-sm", xs: "pb-scroll-xs" }[s.id]}`}
                  >
                    {PEOPLE.join(", ")}
                  </p>
                </ScrollArea>
              </Frame>
            </Labelled>
          ))}
        </div>
      </Group>
    </div>
  );
}
