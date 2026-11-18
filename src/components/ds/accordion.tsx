"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";

/* The Figma's own Remix glyphs (Accordion [1.1], node 210:4021), copied from
   its 20x20 exports and drawn in currentColor: question-line is the drawn
   left icon, add-line / subtract-line the plus and minus. */
function remix(d: string, name: string) {
  function Glyph(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden data-icon={name} {...props}>
        <path d={d} />
      </svg>
    );
  }
  Glyph.displayName = name;
  return Glyph;
}

/** question-line: the left icon the Figma draws. */
export const AccordionQuestionIcon = remix(
  "M10 17.5C5.85775 17.5 2.5 14.1423 2.5 10C2.5 5.85775 5.85775 2.5 10 2.5C14.1423 2.5 17.5 5.85775 17.5 10C17.5 14.1423 14.1423 17.5 10 17.5ZM10 16C11.5913 16 13.1174 15.3679 14.2426 14.2426C15.3679 13.1174 16 11.5913 16 10C16 8.4087 15.3679 6.88258 14.2426 5.75736C13.1174 4.63214 11.5913 4 10 4C8.4087 4 6.88258 4.63214 5.75736 5.75736C4.63214 6.88258 4 8.4087 4 10C4 11.5913 4.63214 13.1174 5.75736 14.2426C6.88258 15.3679 8.4087 16 10 16ZM9.25 12.25H10.75V13.75H9.25V12.25ZM10.75 11.0162V11.5H9.25V10.375C9.25 10.1761 9.32902 9.98532 9.46967 9.84467C9.61032 9.70402 9.80109 9.625 10 9.625C10.2131 9.62499 10.4217 9.56447 10.6017 9.4505C10.7818 9.33652 10.9257 9.17377 11.0168 8.98119C11.108 8.7886 11.1425 8.5741 11.1165 8.36263C11.0905 8.15117 11.005 7.95144 10.8699 7.78668C10.7348 7.62193 10.5557 7.49892 10.3534 7.43198C10.1511 7.36503 9.93403 7.3569 9.72732 7.40853C9.52061 7.46016 9.33281 7.56942 9.18577 7.72361C9.03874 7.8778 8.93851 8.07057 8.89675 8.2795L7.42525 7.98475C7.51647 7.52881 7.72713 7.10528 8.03569 6.75744C8.34425 6.4096 8.73964 6.14994 9.18144 6.00499C9.62325 5.86004 10.0956 5.83501 10.5503 5.93246C11.0049 6.02991 11.4255 6.24634 11.7691 6.55962C12.1127 6.8729 12.3669 7.2718 12.5058 7.71555C12.6447 8.15929 12.6633 8.63196 12.5596 9.08523C12.456 9.5385 12.2338 9.95612 11.9159 10.2954C11.5979 10.6347 11.1956 10.8834 10.75 11.0162Z",
  "AccordionQuestionIcon",
);

const AddLine = remix("M9.25 9.25V4.75H10.75V9.25H15.25V10.75H10.75V15.25H9.25V10.75H4.75V9.25H9.25Z", "AccordionAddLine");
const SubtractLine = remix("M4.75 9.25H15.25V10.75H4.75V9.25Z", "AccordionSubtractLine");

/**
 * The design system's Accordion, built from design-system/components/accordion.md
 * (Nitesh's Figma "Accordion [1.1]", node 210:4022), on Radix's accordion: a
 * title a person clicks to show or hide the words under it.
 *
 *   <Accordion type="single" collapsible>
 *     <AccordionItem value="billing" title="How does billing work?" icon={<InfoIcon />}>
 *       The words under it.
 *     </AccordionItem>
 *   </Accordion>
 *
 * Accordion      Radix's root (type single | multiple, value, onValueChange);
 *                its items sit 10 apart
 * AccordionItem  title; children is the description; icon, the left icon
 *                (off when left out); flip puts the plus or minus on the
 *                left, in place of the left icon; disabled
 *
 * States: Default (an edge and the card shadow), Hover (bg/weak-50, the plus
 * darker), Active (open, bg/weak-50 with or without the pointer). Ours (page,
 * Open): keyboard focus puts the Neutral focus ring around the whole
 * accordion, and Disabled is the Hover fill with the words and icons in
 * their disabled colours. data-force="hover" or "focus" on an item shows
 * that state on the Components page. Sizes are the tokens in
 * styles/sizes/accordion.css.
 */

export type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root>;

export function Accordion({ className, ...props }: AccordionProps) {
  return <AccordionPrimitive.Root className={cn("flex flex-col gap-accordion-list-gap", className)} {...props} />;
}

export type AccordionItemProps = Omit<React.ComponentProps<typeof AccordionPrimitive.Item>, "title" | "children"> & {
  title: React.ReactNode;
  /** The left icon, 20 x 20. */
  icon?: React.ReactNode;
  /** The plus or minus on the left, in place of the left icon. */
  flip?: boolean;
  /** The description, shown when open. */
  children?: React.ReactNode;
  "data-force"?: "hover" | "focus";
};

const ICON = "inline-flex shrink-0 [&_svg]:size-accordion-icon";

export function AccordionItem({ title, icon, flip = false, disabled, className, children, ...props }: AccordionItemProps) {
  // The plus (closed) or minus (open): icon/soft-400 at rest, icon/sub-600
  // under the pointer and open. Disabled wins over both.
  const sign = (
    <span
      aria-hidden
      className={cn(
        ICON,
        "text-icon-soft-400 group-ds-hover/accordion:text-icon-sub-600 group-data-[state=open]/accordion:text-icon-sub-600",
        "group-data-disabled/accordion:text-icon-disabled-300!",
      )}
    >
      <AddLine className="group-data-[state=open]/accordion:hidden" />
      <SubtractLine className="hidden group-data-[state=open]/accordion:block" />
    </span>
  );
  const hasDescription = children != null && children !== false;
  // Something on the left: the left icon, or the flipped plus.
  const leftSide = flip || icon != null;

  return (
    <AccordionPrimitive.Item
      disabled={disabled}
      className={cn(
        "group/accordion ds-shadow rounded-accordion bg-bg-white-0 edge-stroke-soft-200 lift-card transition-[background-color,box-shadow] duration-150",
        "ds-hover:bg-bg-weak-50 ds-hover:edge-none ds-hover:lift-none",
        "data-[state=open]:bg-bg-weak-50 data-[state=open]:edge-none data-[state=open]:lift-none",
        "data-disabled:bg-bg-weak-50 data-disabled:edge-none data-disabled:lift-none",
        // The title is the button; its keyboard focus rings the whole accordion.
        "has-focus-visible:ring-focus-neutral data-[force=focus]:ring-focus-neutral",
        className,
      )}
      {...props}
    >
      {/* m-0: Radix renders an <h3>, and the base h3 rule (typography.css)
          adds 1em above and 0.5em below, which made it 69 tall, not 48. */}
      <AccordionPrimitive.Header className="m-0 flex">
        <AccordionPrimitive.Trigger
          className={cn(
            "flex w-full cursor-pointer items-start gap-accordion-gap p-accordion-pad text-start outline-none disabled:cursor-not-allowed",
            // Open, the description takes over below the title.
            hasDescription && "data-[state=open]:pb-0",
          )}
        >
          {flip
            ? sign
            : icon != null && (
                <span aria-hidden className={cn(ICON, "text-icon-sub-600 group-data-disabled/accordion:text-icon-disabled-300")}>
                  {icon}
                </span>
              )}
          {/* The words fill the space between the icons and wrap; the icons stay on the title's line. */}
          <span className="min-w-0 flex-1 text-label-sm text-text-strong-950 group-data-disabled/accordion:text-text-disabled-300">
            {title}
          </span>
          {!flip && sign}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      {hasDescription && (
        <AccordionPrimitive.Content
          className={cn(
            "pt-accordion-words-gap pb-accordion-pad text-paragraph-sm text-text-sub-600",
            leftSide ? "ps-accordion-indent" : "ps-accordion-pad",
            flip ? "pe-accordion-pad" : "pe-accordion-indent",
          )}
        >
          {children}
        </AccordionPrimitive.Content>
      )}
    </AccordionPrimitive.Item>
  );
}
