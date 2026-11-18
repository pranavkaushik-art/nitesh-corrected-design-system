import * as React from "react";

import { InfoIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The design system's Label and Hint Text, built from
 * design-system/components/key-components.md ("Label", node 266:2814, and
 * "Hint Text", node 266:5284). The Text Input and the Text Area use both.
 *
 * FieldLabel   the line above a field: the word, then an optional `*`
 *              (required), "(Optional)", the info icon and a Link Button
 *              (link, a slot). disabled greys every part.
 * HintText     the line under a field: an optional 16 x 16 icon, then the
 *              text. state: default | error | disabled
 *
 * Sizes are the tokens in styles/sizes/label.css.
 */

export type FieldLabelProps = Omit<React.ComponentProps<"label">, "children"> & {
  children: React.ReactNode;
  /** Shows the `*` after the word. */
  required?: boolean;
  /** Shows "(Optional)" after the word. */
  optional?: boolean;
  /** Shows the 20 x 20 info icon. */
  info?: boolean;
  /** A Link Button (link-button.md) at the end of the row. */
  link?: React.ReactNode;
  disabled?: boolean;
};

export function FieldLabel({ children, required, optional, info, link, disabled, className, ...props }: FieldLabelProps) {
  const label = (
    <label className={cn("flex items-center gap-label-gap", disabled && "cursor-not-allowed", link == null && className)} {...props}>
      <span className={cn("text-label-sm", disabled ? "text-text-disabled-300" : "text-text-strong-950")}>{children}</span>
      {required && (
        <span aria-hidden className={cn("text-label-sm", disabled ? "text-text-disabled-300" : "text-primary-base")}>
          *
        </span>
      )}
      {optional && (
        <span className={cn("text-paragraph-sm", disabled ? "text-text-disabled-300" : "text-text-sub-600")}>
          {" "}(Optional)
        </span>
      )}
      {info && <InfoIcon className="size-label-icon shrink-0 text-icon-disabled-300" />}
    </label>
  );
  if (link == null) return label;
  // The link sits in the same row, beside the <label> rather than inside it:
  // a button inside a label would add its words to the field's name.
  return (
    <div className={cn("flex items-center gap-label-gap", className)}>
      {label}
      {link}
    </div>
  );
}

export type HintTextProps = Omit<React.ComponentProps<"p">, "children"> & {
  children: React.ReactNode;
  state?: "default" | "error" | "disabled";
  /** A 16 x 16 icon before the text, for example <InfoIcon />. */
  icon?: React.ReactNode;
};

const HINT_TEXT = { default: "text-text-sub-600", error: "text-state-error-base", disabled: "text-text-disabled-300" } as const;
const HINT_ICON = { default: "text-icon-soft-400", error: "text-state-error-base", disabled: "text-icon-disabled-300" } as const;

export function HintText({ children, state = "default", icon, className, ...props }: HintTextProps) {
  return (
    <p className={cn("m-0 flex items-center gap-label-hint-gap text-paragraph-xs", HINT_TEXT[state], className)} {...props}>
      {icon && (
        <span aria-hidden className={cn("flex shrink-0 [&_svg]:size-label-hint-icon", HINT_ICON[state])}>
          {icon}
        </span>
      )}
      <span>{children}</span>
    </p>
  );
}
