import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { StatusCompletedIcon, StatusDisabledIcon, StatusFailedIcon, StatusInformationIcon, StatusPendingIcon } from "@/components/ui/icons";

/** flashlight-fill: the icon the Figma draws in a Left or Right Icon badge
 *  (Badge [1.1], nodes 119:1824 and 119:2385), copied from its export and
 *  drawn in currentColor. Its shape sits ~3px inside the box, which is what
 *  makes the 2px icon-to-word gap read as the Figma's; an edge-to-edge glyph
 *  looks like it touches the word. Scales to the 12px (Small) box. */
export function BadgeFlashlightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden data-icon="BadgeFlashlightIcon" {...props}>
      <path d="M8.6 6.8H12.8L7.4 14.6V9.2H3.2L8.6 1.4V6.8Z" />
    </svg>
  );
}

/**
 * The design system's Badge and Status Badge, built from
 * design-system/components/badge.md (Nitesh's Figma "Badge [1.1]", node
 * 118:2324, and "Status Badge [1.1]", node 171:5100): a label that only
 * reports something. Something a person can pick or remove is the Tag.
 *
 * Badge
 *   size     sm 16 | md 20
 *   variant  the Figma's Style: filled | light | lighter | stroke
 *   color    gray | blue | orange | red | green | yellow | purple | sky |
 *            pink | teal: the Figma's ten state colours (faded, information,
 *            warning, error, success, away, feature, verified, highlighted,
 *            stable), since 21 Oct 2026
 *   dot, leadingIcon, trailingIcon   the Figma's With Dot, Left and Right Icon
 *   number   a round badge with a number in it instead of a word
 *   disabled
 *
 * StatusBadge (use it for done, waiting, failed, information, switched off)
 *   status   completed | pending | failed | information | disabled
 *   variant  light | stroke
 *   mark     dot | icon
 *
 * Sizes are the tokens in styles/sizes/badge.css.
 */

export type BadgeColor = "gray" | "blue" | "orange" | "red" | "green" | "yellow" | "purple" | "sky" | "pink" | "teal";
export type BadgeVariant = "filled" | "light" | "lighter" | "stroke";

/** Each colour is one of the Figma's state token groups, used the same way
 *  by every style: Filled base/static white, Light light/dark, Lighter
 *  lighter/dark, Stroke an edge in base with dark words. The words are always
 *  the dark step since 21 Oct 2026 (the Figma's Lighter and Stroke use base,
 *  which read 2.5 to 4:1 on dark; dark reads 7:1, AAA). Written out so
 *  Tailwind sees them. */
const BADGE_COLOURS: Record<BadgeColor, Record<BadgeVariant, string>> = {
  gray: {
    filled: "bg-state-faded-base text-static-white",
    light: "bg-state-faded-light text-state-faded-dark",
    lighter: "bg-state-faded-lighter text-state-faded-dark",
    stroke: "edge-state-faded-base text-state-faded-dark",
  },
  blue: {
    filled: "bg-state-information-base text-static-white",
    light: "bg-state-information-light text-state-information-dark",
    lighter: "bg-state-information-lighter text-state-information-dark",
    stroke: "edge-state-information-base text-state-information-dark",
  },
  orange: {
    filled: "bg-state-warning-base text-static-white",
    light: "bg-state-warning-light text-state-warning-dark",
    lighter: "bg-state-warning-lighter text-state-warning-dark",
    stroke: "edge-state-warning-base text-state-warning-dark",
  },
  red: {
    filled: "bg-state-error-base text-static-white",
    light: "bg-state-error-light text-state-error-dark",
    lighter: "bg-state-error-lighter text-state-error-dark",
    stroke: "edge-state-error-base text-state-error-dark",
  },
  green: {
    filled: "bg-state-success-base text-static-white",
    light: "bg-state-success-light text-state-success-dark",
    lighter: "bg-state-success-lighter text-state-success-dark",
    stroke: "edge-state-success-base text-state-success-dark",
  },
  // The five the Figma has beside them (21 Oct 2026, its state variables).
  yellow: {
    filled: "bg-state-away-base text-static-white",
    light: "bg-state-away-light text-state-away-dark",
    lighter: "bg-state-away-lighter text-state-away-dark",
    stroke: "edge-state-away-base text-state-away-dark",
  },
  purple: {
    filled: "bg-state-feature-base text-static-white",
    light: "bg-state-feature-light text-state-feature-dark",
    lighter: "bg-state-feature-lighter text-state-feature-dark",
    stroke: "edge-state-feature-base text-state-feature-dark",
  },
  sky: {
    filled: "bg-state-verified-base text-static-white",
    light: "bg-state-verified-light text-state-verified-dark",
    lighter: "bg-state-verified-lighter text-state-verified-dark",
    stroke: "edge-state-verified-base text-state-verified-dark",
  },
  pink: {
    filled: "bg-state-highlighted-base text-static-white",
    light: "bg-state-highlighted-light text-state-highlighted-dark",
    lighter: "bg-state-highlighted-lighter text-state-highlighted-dark",
    stroke: "edge-state-highlighted-base text-state-highlighted-dark",
  },
  teal: {
    filled: "bg-state-stable-base text-static-white",
    light: "bg-state-stable-light text-state-stable-dark",
    lighter: "bg-state-stable-lighter text-state-stable-dark",
    stroke: "edge-state-stable-base text-state-stable-dark",
  },
};

const badgeVariants = cva(
  "ds-shadow inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-badge py-badge-y",
  {
    variants: {
      size: {
        sm: "h-badge-sm text-subheading-2xs uppercase [&_svg]:size-badge-sm-icon",
        md: "h-badge-md text-label-xs [&_svg]:size-badge-md-icon",
      },
      number: { true: "px-badge-number-pad", false: "" },
      // Disabled, every colour and style: no fill, a stroke/soft-200 edge.
      disabled: { true: "edge-stroke-soft-200 text-text-disabled-300", false: "" },
    },
    compoundVariants: [
      { number: true, size: "sm", class: "min-w-badge-sm" },
      { number: true, size: "md", class: "min-w-badge-md" },
    ],
    defaultVariants: { size: "md", number: false, disabled: false },
  },
);

export type BadgeProps = Omit<React.ComponentProps<"span">, "color"> & {
  size?: "sm" | "md";
  variant?: BadgeVariant;
  color?: BadgeColor;
  /** The Figma's With Dot: a 4 x 4 dot in a 16 x 16 box before the word. */
  dot?: boolean;
  /** An icon before the word (12 on Small, 16 on Medium). */
  leadingIcon?: React.ReactNode;
  /** An icon after the word. */
  trailingIcon?: React.ReactNode;
  /** A round badge holding a number instead of a word. */
  number?: boolean;
  disabled?: boolean;
};

export function Badge({
  size = "md",
  variant = "filled",
  color = "gray",
  dot = false,
  leadingIcon,
  trailingIcon,
  number = false,
  disabled = false,
  className,
  children,
  ...props
}: BadgeProps) {
  // Padding: 8 on a side that ends in the word, 4 on an icon's side; a dot
  // box takes the left padding (0 on Small, 2 on Medium) and no gap.
  const left = number
    ? ""
    : dot
      ? size === "sm"
        ? "pl-badge-sm-dot-x"
        : "pl-badge-md-dot-x"
      : leadingIcon
        ? "pl-badge-x-icon"
        : "pl-badge-x";
  const right = number ? "" : trailingIcon ? "pr-badge-x-icon" : "pr-badge-x";
  const icon = (node: React.ReactNode) => (
    <span className={cn("inline-flex shrink-0", disabled && "text-icon-disabled-300")}>{node}</span>
  );

  return (
    <span
      aria-disabled={disabled || undefined}
      className={cn(
        badgeVariants({ size, number, disabled }),
        !disabled && BADGE_COLOURS[color][variant],
        dot ? "gap-badge-dot-gap" : "gap-badge-gap",
        left,
        right,
        className,
      )}
      {...props}
    >
      {dot && !number && (
        <span aria-hidden className="flex size-badge-dot-box shrink-0 items-center justify-center">
          <span className="size-badge-dot rounded-badge-dot bg-current" />
        </span>
      )}
      {leadingIcon != null && !number && icon(leadingIcon)}
      {children}
      {trailingIcon != null && !number && icon(trailingIcon)}
    </span>
  );
}

export type StatusBadgeStatus = "completed" | "pending" | "failed" | "information" | "disabled";

/** Each status, its token group and its icon (the Figma's own filled marks,
 *  24 Oct 2026; components/ui/icons.tsx). Light: the lighter fill, the words and the mark in dark (7:1,
 *  21 Oct 2026; Disabled: text/sub-600). Stroke: white, the Figma's stroke/soft-200
 *  edge (#262626 on dark, --status-badge-edge), words text/sub-600, the dot
 *  or icon in the status's base, as the Figma (the colour sits in the mark, beside readable grey words; 23 Oct 2026). */
const STATUS: Record<
  StatusBadgeStatus,
  { label: string; Icon: React.ComponentType; light: string; mark: string; strokeMark: string }
> = {
  completed: {
    label: "Completed",
    Icon: StatusCompletedIcon,
    light: "bg-state-success-lighter text-state-success-dark",
    mark: "text-state-success-dark",
    strokeMark: "text-state-success-base",
  },
  pending: {
    label: "Pending",
    Icon: StatusPendingIcon,
    light: "bg-state-warning-lighter text-state-warning-dark",
    mark: "text-state-warning-dark",
    strokeMark: "text-state-warning-base",
  },
  failed: {
    label: "Failed",
    Icon: StatusFailedIcon,
    light: "bg-state-error-lighter text-state-error-dark",
    mark: "text-state-error-dark",
    strokeMark: "text-state-error-base",
  },
  information: {
    label: "Information",
    Icon: StatusInformationIcon,
    light: "bg-state-information-lighter text-state-information-dark",
    mark: "text-state-information-dark",
    strokeMark: "text-state-information-base",
  },
  disabled: { label: "Disabled", Icon: StatusDisabledIcon, light: "bg-state-faded-lighter text-text-sub-600", mark: "text-state-faded-base", strokeMark: "text-state-faded-base" },
};

const statusBadgeVariants = cva(
  "ds-shadow inline-flex h-status-badge shrink-0 items-center whitespace-nowrap rounded-status-badge py-status-badge-y pl-status-badge-left pr-status-badge-right text-label-xs",
  {
    variants: {
      variant: { light: "", stroke: "bg-bg-white-0 [--ds-edge:inset_0_0_0_1px_var(--status-badge-edge)] text-text-sub-600" },
      mark: { dot: "gap-status-badge-dot-gap", icon: "gap-status-badge-icon-gap [&_svg]:size-status-badge-icon" },
    },
    defaultVariants: { variant: "light", mark: "dot" },
  },
);

export type StatusBadgeProps = React.ComponentProps<"span"> & {
  status: StatusBadgeStatus;
  variant?: "light" | "stroke";
  mark?: "dot" | "icon";
  /** The words; the status's own name when left out. */
  children?: React.ReactNode;
};

export function StatusBadge({ status, variant = "light", mark = "dot", className, children, ...props }: StatusBadgeProps) {
  const s = STATUS[status];
  return (
    <span className={cn(statusBadgeVariants({ variant, mark }), variant === "light" && s.light, className)} {...props}>
      <span aria-hidden className={cn("inline-flex shrink-0", variant === "stroke" ? s.strokeMark : s.mark)}>
        {mark === "dot" ? <span className="size-status-badge-dot rounded-status-badge-dot bg-current" /> : <s.Icon />}
      </span>
      {children ?? s.label}
    </span>
  );
}

export { badgeVariants, statusBadgeVariants };
