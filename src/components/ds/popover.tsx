"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { Button } from "@/components/ds/button";
import { useControllableState } from "@/components/ds/checkbox";
import { CompactButton } from "@/components/ds/compact-button";
import { KeyIcon } from "@/components/ds/key-components";
import { StepperDot } from "@/components/ds/step-indicator";
import { CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The design system's Popover, built from design-system/components/popover.md
 * (Nitesh's Figma "Popover [1.1]", node 4431:81573, and "Popover Footer
 * [1.1]", node 4456:83048), on Radix's popover. A box that points at one
 * thing and explains it: a step of a product tour, a "new here" hint.
 *
 *   <Popover tail="top-left" icon={<InfoIcon />} title="Your reports" description="..."
 *            close footer={<PopoverFooter type="stepper" current={0} count={4} />}>
 *     <Button>Reports</Button>
 *   </Popover>
 *
 * Popover        the Radix popover around a trigger (children); close shows
 *                the close button; Escape closes it too. When it opens, focus
 *                moves to the footer's first button (the page's proposal).
 * PopoverPanel   the box drawn on its own (the Components page shows it still)
 *
 *   tail    none | top-left | top-center | top-right | bottom-left |
 *           bottom-center | bottom-right | right-top | right | right-bottom |
 *           left-top | left | left-bottom: the edge it sits on, 32 from the
 *           nearer corner. A tail on the top opens the box below its trigger.
 *   icon    the glyph for the Key Icon at the top (Stroke, Gray, Large 48)
 *   title, description
 *   footer  a PopoverFooter: type stepper | text-stepper | stretch, current
 *           and count, buttons 1 | 2 (Back and Next), onBack, onNext
 *
 * The tail adds 8 outside the box, so the box keeps its width on every side
 * (ours, the page). Sizes are the tokens in styles/sizes/popover.css; the
 * shadow is the Dropdown's menu shadow.
 */

export type PopoverTail =
  | "none"
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "right-top"
  | "right"
  | "right-bottom"
  | "left-top"
  | "left"
  | "left-bottom";
type Edge = "top" | "bottom" | "left" | "right";
type Tail = Exclude<PopoverTail, "none">;

function edgeOf(tail: Tail): Edge {
  return tail.split("-")[0] as Edge;
}

// ---- The tail ----

/** The row the tail sits in, just outside the box's edge, reaching 1px in. */
const EDGE_ROW: Record<Edge, string> = {
  top: "inset-x-space-0 bottom-full -mb-popover-tail-overlap",
  bottom: "inset-x-space-0 top-full -mt-popover-tail-overlap",
  left: "inset-y-space-0 right-full -mr-popover-tail-overlap flex-col",
  right: "inset-y-space-0 left-full -ml-popover-tail-overlap flex-col",
};

/** Where along its edge: 32 from the nearer corner, or centred. */
function alongEdge(tail: Tail) {
  const across = edgeOf(tail) === "top" || edgeOf(tail) === "bottom";
  if (/-(left|top)$/.test(tail)) return across ? "justify-start ps-popover-tail-inset" : "justify-start pt-popover-tail-inset";
  if (/-(right|bottom)$/.test(tail)) return across ? "justify-end pe-popover-tail-inset" : "justify-end pb-popover-tail-inset";
  return "justify-center";
}

/** The tail's drawing on its own grid, 16 x 8 plus the 1 that reaches into
 *  the box (the same numbers as its tokens; the SVG stretches to them). */
function tailPaths(edge: Edge) {
  const [w, h, o] = [16, 8, 1];
  switch (edge) {
    case "top":
      return { box: `0 0 ${w} ${h + o}`, fill: `M0 ${h}L${w / 2} 0L${w} ${h}V${h + o}H0Z`, line: `M0 ${h}L${w / 2} 0L${w} ${h}` };
    case "bottom":
      return { box: `0 0 ${w} ${h + o}`, fill: `M0 ${o}L${w / 2} ${h + o}L${w} ${o}V0H0Z`, line: `M0 ${o}L${w / 2} ${h + o}L${w} ${o}` };
    case "left":
      return { box: `0 0 ${h + o} ${w}`, fill: `M${h} 0L0 ${w / 2}L${h} ${w}H${h + o}V0Z`, line: `M${h} 0L0 ${w / 2}L${h} ${w}` };
    case "right":
      return { box: `0 0 ${h + o} ${w}`, fill: `M${o} 0L${h + o} ${w / 2}L${o} ${w}H0V0Z`, line: `M${o} 0L${h + o} ${w / 2}L${o} ${w}` };
  }
}

/** bg/white-0 with the stroke/soft-200 edge along its two outer sides; its
 *  base covers the box's edge where they meet. */
function PopoverTailMark({ tail }: { tail: Tail }) {
  const edge = edgeOf(tail);
  const across = edge === "top" || edge === "bottom";
  const p = tailPaths(edge);
  return (
    <span aria-hidden className={cn("pointer-events-none absolute flex", EDGE_ROW[edge], alongEdge(tail))}>
      <svg
        viewBox={p.box}
        preserveAspectRatio="none"
        className={cn(
          "block shrink-0 overflow-visible",
          across ? "h-popover-tail-box w-popover-tail-w" : "h-popover-tail-w w-popover-tail-box",
        )}
      >
        <path d={p.fill} className="fill-bg-white-0" />
        <path d={p.line} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className="stroke-stroke-soft-200" />
      </svg>
    </span>
  );
}

// ---- The footer ----

export type PopoverFooterProps = {
  /** stepper: the Stepper Dot on the left; text-stepper: "Step 1 of 4"; stretch: the buttons share the width. */
  type?: "stepper" | "text-stepper" | "stretch";
  /** The current step, counted from 0. */
  current?: number;
  count?: number;
  /** One button (Next) or two (Back and Next). */
  buttons?: 1 | 2;
  backLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  className?: string;
};

/** Padding 16 and 20, gap 12, the 1px line on top. The buttons: Neutral
 *  Stroke and Primary Filled, Small (36), 12 apart; 80 wide in the Stepper
 *  types. Its bg/white-0 is the box's own, so it never covers the box's edge. */
export function PopoverFooter({
  type = "stepper",
  current = 0,
  count = 4,
  buttons = 2,
  backLabel = "Back",
  nextLabel = "Next",
  onBack,
  onNext,
  className,
}: PopoverFooterProps) {
  const stretch = type === "stretch";
  const width = stretch ? "flex-1" : "w-popover-button";
  return (
    <div
      data-popover-footer=""
      className={cn(
        "ds-shadow [--ds-edge:var(--shadow-popover-line)] flex items-center gap-popover-footer-gap px-popover-footer-x py-popover-footer-y",
        className,
      )}
    >
      {type === "stepper" && <StepperDot size="sm" count={count} current={current} />}
      {type === "text-stepper" && (
        <span className="text-paragraph-sm text-text-sub-600">
          Step {current + 1} of {count}
        </span>
      )}
      <div className={cn("flex gap-popover-buttons-gap", stretch ? "flex-1" : "ms-auto")}>
        {buttons === 2 && (
          <Button tone="neutral" variant="stroke" size="sm" className={width} onClick={onBack}>
            {backLabel}
          </Button>
        )}
        <Button tone="primary" variant="filled" size="sm" className={width} onClick={onNext}>
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}

// ---- The panel ----

export type PopoverPanelProps = Omit<React.ComponentProps<"div">, "title"> & {
  tail?: PopoverTail;
  /** The glyph for the Key Icon (Stroke, Gray, Large) at the top. */
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Shows the close button (a Compact Button, Ghost, Large) and is called by it. */
  onClose?: () => void;
  closeLabel?: string;
  /** A PopoverFooter. */
  footer?: React.ReactNode;
  /** The title's id, so the popover is named by it. */
  titleId?: string;
};

export function PopoverPanel({
  tail = "none",
  icon,
  title,
  description,
  onClose,
  closeLabel = "Close",
  footer,
  titleId,
  className,
  children,
  ...props
}: PopoverPanelProps) {
  const words = title != null || description != null;
  return (
    <div
      className={cn(
        "ds-shadow edge-stroke-soft-200 [--ds-lift:var(--shadow-popover-box)] relative w-popover-w rounded-popover bg-bg-white-0",
        className,
      )}
      {...props}
    >
      {(icon != null || words || children != null) && (
        <div className="flex flex-col gap-popover-body-gap p-popover-body-pad">
          {icon != null && (
            <KeyIcon size="lg" variant="stroke" color="gray">
              {icon}
            </KeyIcon>
          )}
          {words && (
            // As the Figma draws it (Popover [1.1], node 175333:181969): the
            // words 280 wide, title 24 tall, 4, the description. m-0: the base
            // `p` rule (typography.css) added 20 and 17.5 above and below,
            // which made the box 183 tall, not 108. Only the title keeps
            // clear of the close button; the description sits below it and
            // takes the full 280, as drawn.
            <div className="flex flex-col gap-popover-words-gap">
              {title != null && (
                <p
                  id={titleId}
                  className={cn("m-0 text-label-md text-text-strong-950", icon == null && onClose && "pr-popover-words-clear")}
                >
                  {title}
                </p>
              )}
              {description != null && <p className="m-0 text-paragraph-sm text-text-sub-600">{description}</p>}
            </div>
          )}
          {children}
        </div>
      )}
      {onClose && (
        <CompactButton
          variant="ghost"
          size="lg"
          aria-label={closeLabel}
          onClick={onClose}
          className="absolute top-popover-close-inset right-popover-close-inset"
        >
          <CloseIcon />
        </CompactButton>
      )}
      {footer}
      {tail !== "none" && <PopoverTailMark tail={tail} />}
    </div>
  );
}

// ---- The popover ----

/** Where Radix opens the box for each tail. */
const PLACEMENT: Record<Tail, { side: Edge; align: "start" | "center" | "end" }> = {
  "top-left": { side: "bottom", align: "start" },
  "top-center": { side: "bottom", align: "center" },
  "top-right": { side: "bottom", align: "end" },
  "bottom-left": { side: "top", align: "start" },
  "bottom-center": { side: "top", align: "center" },
  "bottom-right": { side: "top", align: "end" },
  "left-top": { side: "right", align: "start" },
  left: { side: "right", align: "center" },
  "left-bottom": { side: "right", align: "end" },
  "right-top": { side: "left", align: "start" },
  right: { side: "left", align: "center" },
  "right-bottom": { side: "left", align: "end" },
};

/** The room the Radix wrapper keeps for the tail, outside the box. */
const ROOM: Record<Edge, string> = {
  top: "pt-popover-tail-h",
  bottom: "pb-popover-tail-h",
  left: "pl-popover-tail-h",
  right: "pr-popover-tail-h",
};

/** The gap to the trigger, on whichever side Radix puts the box. */
const OFFSET =
  "data-[side=bottom]:mt-popover-offset data-[side=top]:mb-popover-offset data-[side=left]:mr-popover-offset data-[side=right]:ml-popover-offset";

export type PopoverProps = Omit<PopoverPanelProps, "onClose" | "titleId" | "children"> & {
  /** The trigger: one element that takes a ref (a Button). */
  children: React.ReactElement;
  /** Shows the close button. */
  close?: boolean;
  /** Which side to open on when there is no tail. */
  side?: Edge;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Popover({
  children,
  close = false,
  tail = "none",
  side = "bottom",
  open,
  defaultOpen = false,
  onOpenChange,
  ...panel
}: PopoverProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  const titleId = React.useId();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const place = tail === "none" ? { side, align: "center" as const } : PLACEMENT[tail];

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={contentRef}
          side={place.side}
          align={place.align}
          // A tail fixes the side, so the box never flips away from it.
          avoidCollisions={tail === "none"}
          aria-labelledby={panel.title != null ? titleId : undefined}
          onOpenAutoFocus={(e) => {
            // Focus goes to the footer's first button (the page's proposal).
            const first = contentRef.current?.querySelector<HTMLElement>("[data-popover-footer] button:not(:disabled)");
            if (first) {
              e.preventDefault();
              first.focus();
            }
          }}
          className={cn("z-50 outline-none", tail === "none" ? "" : ROOM[edgeOf(tail)], OFFSET)}
        >
          <PopoverPanel tail={tail} titleId={titleId} onClose={close ? () => setOpen(false) : undefined} {...panel} />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
