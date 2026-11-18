"use client";

import { Accordion, AccordionItem, AccordionQuestionIcon } from "@/components/ds/accordion";

import { Group, Labelled } from "../parts";

const TITLE = "How does billing work?";
const WORDS = "You pay for each seat once a month. Add or remove people at any time; the next bill follows.";

const STATES = [
  { id: "default", label: "Default (closed)" },
  { id: "hover", label: "Hover" },
  { id: "active", label: "Active (open)" },
  { id: "focus", label: "Focus (ours)" },
  { id: "disabled", label: "Disabled (ours)" },
] as const;

const LOOKS = [
  { id: "icon", label: "Left icon on", icon: true, flip: false },
  { id: "plain", label: "Left icon off", icon: false, flip: false },
  { id: "flip", label: "Flip Icon on", icon: false, flip: true },
] as const;

/** One accordion, on its own, at the Figma's 440. */
function One({
  state,
  icon,
  flip,
}: {
  state: (typeof STATES)[number]["id"];
  icon: boolean;
  flip: boolean;
}) {
  return (
    <Accordion type="single" collapsible defaultValue={state === "active" ? "one" : undefined} className="w-accordion-figma">
      <AccordionItem
        value="one"
        title={TITLE}
        icon={icon ? <AccordionQuestionIcon /> : undefined}
        flip={flip}
        disabled={state === "disabled"}
        data-force={state === "hover" || state === "focus" ? state : undefined}
      >
        {WORDS}
      </AccordionItem>
    </Accordion>
  );
}

export function AccordionSection() {
  return (
    <div className="flex flex-col gap-space-40">
      {LOOKS.map((look) => (
        <Group key={look.id} label={`${look.label}, every state`}>
          <div className="flex flex-wrap items-start gap-space-24">
            {STATES.map((s) => (
              <Labelled key={s.id} label={s.label}>
                <One state={s.id} icon={look.icon} flip={look.flip} />
              </Labelled>
            ))}
          </div>
        </Group>
      ))}

      <Group label="Try it: a list, 10 apart, one open at a time">
        <Accordion type="single" collapsible defaultValue="billing" className="w-accordion-figma">
          <AccordionItem value="billing" title={TITLE} icon={<AccordionQuestionIcon />}>
            {WORDS}
          </AccordionItem>
          <AccordionItem value="seats" title="Who counts as a seat?" icon={<AccordionQuestionIcon />}>
            Everyone who can sign in to the workspace. People you share a single report with do not.
          </AccordionItem>
          <AccordionItem value="cancel" title="Can I cancel at any time?" icon={<AccordionQuestionIcon />}>
            Yes. The workspace stays open until the end of the month you paid for, then turns read-only.
          </AccordionItem>
          <AccordionItem value="data" title="What happens to my data when I leave?" icon={<AccordionQuestionIcon />}>
            You can export every chat, run and file for 30 days. After that it is deleted for good.
          </AccordionItem>
        </Accordion>
      </Group>

      <Group label="Try it: a list, several open at once, Flip Icon on">
        <Accordion type="multiple" className="w-accordion-figma">
          <AccordionItem value="a" title="Connect a data source" flip>
            Pick a source, sign in to it, and choose the tables Neutrino may read.
          </AccordionItem>
          <AccordionItem value="b" title="Ask your first question" flip>
            Type a question in plain words. Neutrino shows the steps it takes to answer it.
          </AccordionItem>
          <AccordionItem value="c" title="Share the answer" flip>
            Turn an answer into a report and share it with your team.
          </AccordionItem>
        </Accordion>
      </Group>
    </div>
  );
}
