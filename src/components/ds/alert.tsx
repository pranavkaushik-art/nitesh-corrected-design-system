"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

import { cn } from "@/lib/utils";
import { LinkButton, type LinkButtonProps } from "@/components/ds/link-button";
import { AlertIcon, CheckCircleIcon, ErrorIcon, FeatureIcon, InfoIcon } from "@/components/ui/icons";
import { ALERT_ICON, AlertCloseLine } from "@/components/ds/alert-icons";

/**
 * The design system's Alert, Toast and Notification, built from
 * design-system/components/alert.md (Nitesh's Figma "Alert & Notification &
 * Toast [1.1]", node 169:2399). One component, used three ways: an Alert in
 * the content, a Toast at the bottom centre after an action, a Notification
 * (the Large size) at the bottom right for news that arrives on its own.
 *
 *   size     xs 32 | sm 36 (one line) | lg (title, description, links)
 *   variant  the Figma's Style: filled | light | lighter | stroke
 *   status   error | warning | success | information | feature (Feature is
 *            Gray, as drawn)
 *   title, description (lg only)
 *   links    AlertLink elements: one at the end of a one-line alert; on lg a
 *            row of links with a dot between them, the second not underlined
 *   onClose  shows the close icon (its own button: full strength on hover,
 *            the Neutral focus ring; page, Open)
 *
 * AlertLink is the Link Button the page names (Modifiable on Filled, Black
 * elsewhere; Small on xs, Medium otherwise), picked from the alert it sits in.
 * AlertToaster and showToast put a Toast at the bottom centre of the screen,
 * beside the product's own toasts (components/ui/toast.tsx), not instead.
 *
 * Sizes are the tokens in styles/sizes/alert.css.
 */

export type AlertStatus = "error" | "warning" | "success" | "information" | "feature";
export type AlertVariant = "filled" | "light" | "lighter" | "stroke";
export type AlertSize = "xs" | "sm" | "lg";

/** Each status, its token group (state/<group>/...) and its icon (Hugeicons
 *  for the Figma's Remix ones). Shared with the Banner, which uses the same.
 *  Written out so Tailwind sees them. */
export const ALERT_STATUS: Record<
  AlertStatus,
  { label: string; Icon: React.ComponentType; filled: string; light: string; lighter: string; icon: string }
> = {
  error: {
    label: "Error",
    Icon: ErrorIcon,
    filled: "bg-state-error-base",
    light: "bg-state-error-light",
    lighter: "bg-state-error-lighter",
    icon: "text-state-error-base",
  },
  warning: {
    label: "Warning",
    Icon: AlertIcon,
    filled: "bg-state-warning-base",
    light: "bg-state-warning-light",
    lighter: "bg-state-warning-lighter",
    icon: "text-state-warning-base",
  },
  success: {
    label: "Success",
    Icon: CheckCircleIcon,
    filled: "bg-state-success-base",
    light: "bg-state-success-light",
    lighter: "bg-state-success-lighter",
    icon: "text-state-success-base",
  },
  information: {
    label: "Information",
    Icon: InfoIcon,
    filled: "bg-state-information-base",
    light: "bg-state-information-light",
    lighter: "bg-state-information-lighter",
    icon: "text-state-information-base",
  },
  feature: {
    label: "Feature",
    Icon: FeatureIcon,
    filled: "bg-state-faded-base",
    light: "bg-state-faded-light",
    lighter: "bg-state-faded-lighter",
    icon: "text-state-faded-base",
  },
};

/** What each style does with its status (alert.md, Colours). Filled: every
 *  part in static/white. The others: words in text/strong-950, the icon in
 *  the status's base; Stroke adds bg/white-0, the edge and --shadow-alert. */
const LOOK: Record<AlertVariant, { box: string; description: string; dot: string; close: string }> = {
  filled: {
    box: "text-static-white",
    description: "",
    dot: "text-(--alert-dot-on-filled)",
    close: "text-(--alert-close-on-filled) ds-hover:text-static-white",
  },
  light: {
    box: "text-text-strong-950",
    description: "text-(--alert-description)",
    dot: "text-(--alert-dot)",
    close: "text-(--alert-close) ds-hover:text-icon-strong-950",
  },
  lighter: {
    box: "text-text-strong-950",
    description: "text-(--alert-description)",
    dot: "text-(--alert-dot)",
    close: "text-(--alert-close) ds-hover:text-icon-strong-950",
  },
  stroke: {
    box: "bg-bg-white-0 edge-stroke-soft-200 [--ds-lift:var(--shadow-alert)] text-text-strong-950",
    description: "text-text-sub-600",
    dot: "text-(--alert-dot)",
    close: "text-(--alert-close) ds-hover:text-icon-strong-950",
  },
};

const SIZE: Record<AlertSize, { box: string; icon: string; title: string }> = {
  xs: {
    box: "min-h-alert-xs items-center gap-alert-xs-gap rounded-alert-xs p-alert-xs-pad",
    icon: "size-alert-xs-icon [&_svg]:size-alert-xs-icon",
    title: "text-paragraph-xs",
  },
  sm: {
    box: "min-h-alert-sm items-center gap-alert-sm-gap rounded-alert-sm px-alert-sm-x py-alert-sm-y",
    icon: "size-alert-sm-icon [&_svg]:size-alert-sm-icon",
    title: "text-paragraph-sm",
  },
  lg: {
    box: "items-start gap-alert-lg-gap rounded-alert-lg px-alert-lg-x pt-alert-lg-top pb-alert-lg-bottom",
    icon: "size-alert-lg-icon [&_svg]:size-alert-lg-icon",
    title: "text-label-sm",
  },
};

/** The edge, lift and ring parts are inherited custom properties, so a part
 *  set on the alert would also draw on the Link Button inside it. Wrappers
 *  with this clear them for whatever sits inside. */
const NO_PARTS = "edge-none lift-none ring-none";

/** The alert an AlertLink sits in, and the link's place in the Large size's row. */
const AlertContext = React.createContext<{ size: AlertSize; variant: AlertVariant }>({ size: "sm", variant: "lighter" });
const LinkIndex = React.createContext(0);

export type AlertProps = Omit<React.ComponentProps<"div">, "title"> & {
  size?: AlertSize;
  variant?: AlertVariant;
  status?: AlertStatus;
  title: React.ReactNode;
  /** Large only: the line under the title. */
  description?: React.ReactNode;
  /** AlertLink elements. */
  links?: React.ReactNode;
  /** Shows the close icon; called when it is pressed. */
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  /** The close icon's words for screen readers. */
  closeLabel?: string;
  /** More for the close button (the Components page shows its states with data-force). */
  closeButtonProps?: React.ComponentProps<"button">;
  /** Another status icon, in place of the status's own. */
  icon?: React.ReactNode;
};

export function Alert({
  size = "sm",
  variant = "lighter",
  status = "information",
  title,
  description,
  links,
  onClose,
  closeLabel = "Close",
  closeButtonProps,
  icon,
  role,
  className,
  ...props
}: AlertProps) {
  const s = ALERT_STATUS[status];
  // The Figma's filled Remix glyph; the Banner keeps s.Icon.
  const StatusIcon = ALERT_ICON[status];
  const look = LOOK[variant];
  const z = SIZE[size];
  const fill = variant === "filled" ? s.filled : variant === "light" ? s.light : variant === "lighter" ? s.lighter : "";
  const linkItems = React.Children.toArray(links);

  return (
    <AlertContext.Provider value={{ size, variant }}>
      <div
        // Error and Warning interrupt; the others wait their turn.
        role={role ?? (status === "error" || status === "warning" ? "alert" : "status")}
        className={cn("ds-shadow flex", z.box, fill, look.box, className)}
        {...props}
      >
        <span aria-hidden className={cn("flex shrink-0 items-center justify-center", z.icon, variant !== "filled" && s.icon)}>
          {icon ?? <StatusIcon />}
        </span>

        {size === "lg" ? (
          <div className={cn("flex min-w-0 flex-auto flex-col gap-alert-lg-body-gap", NO_PARTS)}>
            <div className="flex flex-col gap-alert-lg-text-gap">
              <p className={cn("m-0", z.title)}>{title}</p>
              {description != null && <p className={cn("m-0 text-paragraph-sm", look.description)}>{description}</p>}
            </div>
            {linkItems.length > 0 && (
              <div className="flex flex-wrap items-center gap-alert-lg-links-gap">
                {linkItems.map((link, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <span aria-hidden className={cn("w-alert-lg-dot text-center text-paragraph-sm", look.dot)}>
                        ∙
                      </span>
                    )}
                    <LinkIndex.Provider value={i}>{link}</LinkIndex.Provider>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* The title fills the space between the icon and the link. */}
            {/* m-0: the base `p` rule (typography.css) adds 1.25em above and
                below, which made X-Small 62 tall instead of 32. */}
            <p className={cn("m-0 min-w-0 flex-auto", z.title)}>{title}</p>
            {linkItems.length > 0 && <span className={cn("contents", NO_PARTS)}>{linkItems}</span>}
          </>
        )}

        {onClose && (
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            {...closeButtonProps}
            className={cn(
              "ds-shadow flex shrink-0 cursor-pointer items-center justify-center rounded-alert-close outline-none edge-none lift-none",
              "transition-[color,box-shadow] duration-150 ds-focus:ring-focus-neutral",
              z.icon,
              look.close,
              closeButtonProps?.className,
            )}
          >
            <AlertCloseLine />
          </button>
        )}
      </div>
    </AlertContext.Provider>
  );
}

export type AlertLinkProps = LinkButtonProps;

/** A link inside an Alert: the Link Button, underlined, in the style and size
 *  its alert calls for. On a Large alert the links after the first have no
 *  underline (as drawn). Set underline to change that. */
export function AlertLink({ underline, ...props }: AlertLinkProps) {
  const { size, variant } = React.useContext(AlertContext);
  const index = React.useContext(LinkIndex);
  return (
    <LinkButton
      {...(props as LinkButtonProps)}
      variant={variant === "filled" ? "modifiable" : "black"}
      size={size === "xs" ? "sm" : "md"}
      underline={underline ?? !(size === "lg" && index > 0)}
    />
  );
}

// ---- Toast: a small store, so any code can show one ----

export type ShowToastOptions = Omit<AlertProps, "size" | "onClose" | "closeButtonProps" | "description" | "role"> & {
  /** How long it stays, in milliseconds. Left out, it stays until closed:
   *  how long a Toast stays is not decided yet (alert.md, Open). */
  duration?: number;
};

type ToastEntry = { id: number; open: boolean; options: ShowToastOptions };

let toasts: ToastEntry[] = [];
let nextToastId = 1;
const listeners = new Set<() => void>();
const NO_TOASTS: ToastEntry[] = [];

function setToasts(next: ToastEntry[]) {
  toasts = next;
  listeners.forEach((listen) => listen());
}

function closeToast(id: number) {
  setToasts(toasts.map((t) => (t.id === id ? { ...t, open: false } : t)));
}

/** Shows a Toast (Small, Stroke unless variant says otherwise) at the bottom
 *  centre of the screen. Needs an AlertToaster on the page. One at a time: a
 *  new one sends the last one away (how several stack is not drawn yet). */
export function showToast(options: ShowToastOptions) {
  const id = nextToastId++;
  // Keep a few closed ones a moment longer, so they can slide away.
  setToasts([...toasts.slice(-3).map((t) => ({ ...t, open: false })), { id, open: true, options }]);
  return id;
}

function subscribe(listen: () => void) {
  listeners.add(listen);
  return () => {
    listeners.delete(listen);
  };
}

/** Where showToast's Toasts appear: 40 above the bottom of the screen, in the
 *  middle. They slide up from below the screen and back down when closed, as
 *  in the Figma's prototype (Radix Toast underneath: Escape or a swipe down
 *  closes one too). */
export function AlertToaster() {
  const entries = React.useSyncExternalStore(subscribe, () => toasts, () => NO_TOASTS);
  return (
    <ToastPrimitive.Provider swipeDirection="down" duration={Infinity}>
      {entries.map(({ id, open, options: { duration, variant = "stroke", className, ...alert } }) => (
        <ToastPrimitive.Root
          key={id}
          open={open}
          duration={duration}
          onOpenChange={(next) => {
            if (!next) closeToast(id);
          }}
          className={cn(
            // The space under the toast is part of it, so the slide starts below the screen.
            "pointer-events-none flex justify-center pb-alert-toast-bottom",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-full",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full",
            "data-[swipe=move]:translate-y-(--radix-toast-swipe-move-y) data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-bottom-full",
          )}
        >
          <Alert
            {...alert}
            size="sm"
            variant={variant}
            // The toast announces itself; the alert inside stays quiet.
            role="presentation"
            onClose={() => closeToast(id)}
            className={cn("pointer-events-auto w-fit", className)}
          />
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center outline-none" />
    </ToastPrimitive.Provider>
  );
}
