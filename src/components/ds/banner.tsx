"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { ALERT_STATUS, type AlertStatus, type AlertVariant } from "@/components/ds/alert";
import { LinkButton, type LinkButtonProps } from "@/components/ds/link-button";
import { ALERT_ICON, AlertCloseLine } from "@/components/ds/alert-icons";

/**
 * The design system's Banner, built from design-system/components/banner.md
 * (Nitesh's Figma "Banner [1.1]", node 224:2249): a message about the whole
 * product or account, across the full width of the screen. A message about
 * one part of the page is an Alert (alert.tsx).
 *
 *   status   error | warning | success | information | feature (the Alert's
 *            statuses and icons; Feature is Gray, as drawn)
 *   variant  the Figma's Style: filled | light | lighter | stroke
 *   title, description   the words, with a dot between them
 *   link     a BannerLink after the words
 *   onClose  shows the close icon, 12 from the right edge (its own button:
 *            full strength on hover, the Neutral focus ring; page, Open)
 *
 * One size: 44 tall, no corner. Sizes are the tokens in
 * styles/sizes/banner.css.
 */

/** The Fill of each style (banner.md, Colours); Stroke is bg/white-0 with a
 *  bottom edge. */
function fillOf(status: AlertStatus, variant: AlertVariant) {
  const s = ALERT_STATUS[status];
  if (variant === "filled") return s.filled;
  if (variant === "light") return s.light;
  if (variant === "lighter") return s.lighter;
  return "bg-bg-white-0 [--ds-edge:var(--shadow-banner-edge)]";
}

const BannerContext = React.createContext<AlertVariant>("lighter");

export type BannerProps = Omit<React.ComponentProps<"div">, "title"> & {
  status?: AlertStatus;
  variant?: AlertVariant;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** A BannerLink. */
  link?: React.ReactNode;
  /** Shows the close icon; called when it is pressed. */
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  /** The close icon's words for screen readers. */
  closeLabel?: string;
  /** More for the close button (the Components page shows its states with data-force). */
  closeButtonProps?: React.ComponentProps<"button">;
  /** Another status icon, in place of the status's own. */
  icon?: React.ReactNode;
};

export function Banner({
  status = "information",
  variant = "lighter",
  title,
  description,
  link,
  onClose,
  closeLabel = "Close",
  closeButtonProps,
  icon,
  role,
  className,
  ...props
}: BannerProps) {
  const s = ALERT_STATUS[status];
  // The Figma's filled Remix glyph (error-warning-fill, alert-fill, ...), as the Alert draws it.
  const StatusIcon = ALERT_ICON[status];
  const filled = variant === "filled";

  return (
    <BannerContext.Provider value={variant}>
      <div
        role={role ?? (status === "error" || status === "warning" ? "alert" : "status")}
        className={cn(
          "ds-shadow relative flex min-h-banner w-full items-center justify-center rounded-banner px-banner-x py-banner-y",
          fillOf(status, variant),
          filled ? "text-static-white" : "text-text-strong-950",
          className,
        )}
        {...props}
      >
        {/* One row in the middle: the icon, the words, the link. */}
        {/* The Stroke edge is an inherited part: cleared here so the link does not draw it too. */}
        <div className="flex min-w-0 items-center gap-banner-gap edge-none lift-none ring-none">
          <span aria-hidden className={cn("flex size-banner-icon shrink-0 [&_svg]:size-banner-icon", !filled && s.icon)}>
            {icon ?? <StatusIcon />}
          </span>
          <p className="m-0 flex min-w-0 flex-wrap items-center gap-banner-text-gap">
            <span className="text-label-sm">{title}</span>
            {description != null && (
              <>
                <span aria-hidden className="text-label-sm">
                  ∙
                </span>
                <span className="text-paragraph-sm">{description}</span>
              </>
            )}
          </p>
          {link}
        </div>

        {onClose && (
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            {...closeButtonProps}
            className={cn(
              "ds-shadow absolute inset-y-0 right-banner-close-right my-auto flex size-banner-icon cursor-pointer items-center justify-center rounded-banner-close outline-none edge-none lift-none [&_svg]:size-banner-icon",
              "transition-[color,box-shadow] duration-150 ds-focus:ring-focus-neutral",
              filled ? "text-(--banner-close-on-filled) ds-hover:text-static-white" : "text-(--banner-close) ds-hover:text-icon-strong-950",
              closeButtonProps?.className,
            )}
          >
            <AlertCloseLine />
          </button>
        )}
      </div>
    </BannerContext.Provider>
  );
}

export type BannerLinkProps = LinkButtonProps;

/** The Banner's link: the Link Button, Medium (20), underlined; Modifiable on
 *  Filled (it takes the banner's white), Black on the other styles. */
export function BannerLink({ underline = true, ...props }: BannerLinkProps) {
  const variant = React.useContext(BannerContext);
  return (
    <LinkButton
      {...(props as LinkButtonProps)}
      variant={variant === "filled" ? "modifiable" : "black"}
      size="md"
      underline={underline}
    />
  );
}
