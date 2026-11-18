"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ds/button";
import { CompactButton } from "@/components/ds/compact-button";
import { KeyIcon, type KeyColor } from "@/components/ds/key-components";
import { ScrollArea } from "@/components/ds/scroll";
import { AlertIcon, CheckCircleIcon, CloseIcon, ErrorIcon, InfoIcon } from "@/components/ui/icons";

/**
 * The design system's Modal, built from design-system/components/modal.md
 * (Nitesh's Figma Modal page 466:4630), on Radix's dialog: a box over the
 * page that waits for an answer. Radix traps focus in the box and closes it
 * on Escape and on a click on the backdrop.
 *
 *   <Modal open={open} onOpenChange={setOpen}>
 *     <ModalTrigger asChild><Button>Invite</Button></ModalTrigger>
 *     <ModalContent width="sm">
 *       <ModalHeader title="Invite people" description="..." />
 *       <ModalBody>...</ModalBody>
 *       <ModalFooter type="checkbox" leading={<CheckboxLabel label="..." />} />
 *     </ModalContent>
 *   </Modal>
 *
 * ModalContent  the backdrop (overlay/gray) and the box in the middle.
 *               width sm 400 (the default) | md 440 | lg 480 (page, Open)
 * ModalHeader   size md 72 (title and description) | sm 56 (title only);
 *               type basic | left-icon | error | warning | success |
 *               information; icon (left-icon's, or to replace a status
 *               icon); close (on by default)
 * ModalBody     the words or form, padding 20, items 20 apart; it scrolls
 *               when the box is taller than the screen
 * ModalFooter   type basic | checkbox | information | toggle | stepper |
 *               link-button | stretch; leading is the left part (a slot for
 *               the Checkbox Label, Switch Label, Stepper Dot or Link
 *               Button; Information's words); cancel and confirm are the
 *               two buttons' words (null leaves one out)
 * StatusModalContent  the Status Modal's top: type error | warning |
 *               success | information, alignment horizontal | vertical.
 *               Put it in a Medium (440) box with a Checkbox footer.
 *
 * ModalBox and ModalBackdrop draw the box and the backdrop still, for the
 * Components page; every part also works on its own there.
 *
 * Ours (page, Open): the close button sits in the header's row, so a long
 * title wraps before it and every Small header is 56; the box keeps 16 from
 * the screen's edges and the body scrolls. Sizes are the tokens in
 * styles/sizes/modal.css.
 */

/** True inside a ModalContent: the parts then use Radix's Title,
 *  Description and Close, so the dialog is named and the buttons close it. */
const InDialog = React.createContext(false);

function Title({ className, children }: { className: string; children: React.ReactNode }) {
  return React.useContext(InDialog) ? (
    <DialogPrimitive.Title className={cn("m-0", className)}>{children}</DialogPrimitive.Title>
  ) : (
    <p className={cn("m-0", className)}>{children}</p>
  );
}

function Description({ className, children }: { className: string; children: React.ReactNode }) {
  return React.useContext(InDialog) ? (
    <DialogPrimitive.Description className={cn("m-0", className)}>{children}</DialogPrimitive.Description>
  ) : (
    <p className={cn("m-0", className)}>{children}</p>
  );
}

/** A button that closes the modal when it is in one. */
function Closes({ children }: { children: React.ReactElement }) {
  return React.useContext(InDialog) ? <DialogPrimitive.Close asChild>{children}</DialogPrimitive.Close> : children;
}

// ---- The box and the backdrop ----

const WIDTH = { sm: "w-modal-sm", md: "w-modal-md", lg: "w-modal-lg" } as const;
export type ModalWidth = keyof typeof WIDTH;

/** Corner 20, a 1px stroke/soft-200 edge inside, regular-shadow/medium. The
 *  Header and Footer have no corners of their own: the box clips them. */
const BOX =
  "ds-shadow edge-stroke-soft-200 [--ds-lift:var(--shadow-modal-box)] flex max-h-full max-w-full flex-col overflow-hidden rounded-modal bg-bg-white-0 outline-none";
/** The whole screen in overlay/gray, the box in the middle of it. */
const BACKDROP = "flex items-center justify-center bg-overlay-gray p-modal-gutter";

export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalClose = DialogPrimitive.Close;

export type ModalContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & { width?: ModalWidth };

export function ModalContent({ width = "sm", className, children, ...props }: ModalContentProps) {
  return (
    <DialogPrimitive.Portal>
      {/* The box sits inside the backdrop, so the backdrop centres it and keeps the gutter. */}
      <DialogPrimitive.Overlay className={cn(BACKDROP, "fixed inset-0 z-50")}>
        <DialogPrimitive.Content className={cn(BOX, WIDTH[width], className)} {...props}>
          <InDialog.Provider value>{children}</InDialog.Provider>
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  );
}

export type ModalBoxProps = React.ComponentProps<"div"> & { width?: ModalWidth };

/** The box, still: the Components page and anywhere a modal is drawn in place. */
export function ModalBox({ width = "sm", className, ...props }: ModalBoxProps) {
  return <div className={cn(BOX, WIDTH[width], className)} {...props} />;
}

/** The backdrop, still: put a ModalBox in it. */
export function ModalBackdrop({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn(BACKDROP, className)} {...props} />;
}

// ---- Header ----

export type ModalHeaderType = "basic" | "left-icon" | "error" | "warning" | "success" | "information";

/** Medium: the Key Icon, Medium (40); Left Icon is its Stroke style (page,
 *  "Where this differs"), the statuses its Lighter style, which is
 *  state/<type>/lighter behind state/<type>/base. Small: the bare icon in
 *  the type's icon colour. */
const HEADER_ICON: Record<
  Exclude<ModalHeaderType, "basic">,
  { variant: "stroke" | "lighter"; color: KeyColor; bare: string; Icon?: React.ComponentType }
> = {
  "left-icon": { variant: "stroke", color: "gray", bare: "text-icon-sub-600" },
  error: { variant: "lighter", color: "red", bare: "text-state-error-base", Icon: ErrorIcon },
  warning: { variant: "lighter", color: "orange", bare: "text-state-warning-base", Icon: AlertIcon },
  success: { variant: "lighter", color: "green", bare: "text-state-success-base", Icon: CheckCircleIcon },
  information: { variant: "lighter", color: "blue", bare: "text-state-information-base", Icon: InfoIcon },
};

export type ModalHeaderProps = Omit<React.ComponentProps<"div">, "title"> & {
  size?: "md" | "sm";
  type?: ModalHeaderType;
  /** Left Icon's icon; on a status type it replaces the status's own. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  /** Medium only. */
  description?: React.ReactNode;
  /** The close button, on by default. */
  close?: boolean;
  /** Outside a ModalContent, what the close button does. */
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  closeLabel?: string;
};

export function ModalHeader({
  size = "md",
  type = "basic",
  icon,
  title,
  description,
  close = true,
  onClose,
  closeLabel = "Close",
  className,
  ...props
}: ModalHeaderProps) {
  const md = size === "md";
  const look = type === "basic" ? null : HEADER_ICON[type];
  const glyph = look ? (icon ?? (look.Icon ? <look.Icon /> : null)) : null;

  return (
    <div
      className={cn(
        "ds-shadow [--ds-edge:var(--shadow-modal-header-line)] flex shrink-0 items-center bg-bg-white-0 py-modal-header-y pr-modal-header-right pl-modal-header-left",
        md ? "min-h-modal-header-md gap-modal-header-md-gap" : "min-h-modal-header-sm gap-modal-header-sm-gap",
        className,
      )}
      {...props}
    >
      {look &&
        glyph != null &&
        (md ? (
          <KeyIcon size="md" variant={look.variant} color={look.color} className="self-start">
            {glyph}
          </KeyIcon>
        ) : (
          <span aria-hidden className={cn("inline-flex shrink-0 self-start [&_svg]:size-modal-header-sm-icon", look.bare)}>
            {glyph}
          </span>
        ))}
      {/* The words fill the space up to the close button and wrap before it. */}
      <div className="flex min-w-0 flex-1 flex-col gap-modal-header-words-gap">
        <Title className="text-label-sm text-text-strong-950">{title}</Title>
        {md && description != null && <Description className="text-paragraph-xs text-text-sub-600">{description}</Description>}
      </div>
      {close && (
        <span className="inline-flex shrink-0 self-start">
          <Closes>
            <CompactButton variant="ghost" size="lg" aria-label={closeLabel} onClick={onClose}>
              <CloseIcon />
            </CompactButton>
          </Closes>
        </span>
      )}
    </div>
  );
}

// ---- Body ----

export type ModalBodyProps = React.ComponentProps<"div">;

/** Not a Figma component: padding 20, items 20 apart. It scrolls, with the
 *  Scroll, when the box reaches the screen's height. */
export function ModalBody({ className, children, ...props }: ModalBodyProps) {
  return (
    <ScrollArea className="flex-1">
      <div className={cn("flex flex-col gap-modal-body-gap bg-bg-white-0 p-modal-body-pad", className)} {...props}>
        {children}
      </div>
    </ScrollArea>
  );
}

// ---- Footer ----

export type ModalFooterType = "basic" | "checkbox" | "information" | "toggle" | "stepper" | "link-button" | "stretch";

export type ModalFooterProps = React.ComponentProps<"div"> & {
  type?: ModalFooterType;
  /** The left part: a Checkbox Label, a Switch Label, the Stepper Dot or a
   *  Link Button (a slot), or Information's words (the footer adds the icon). */
  leading?: React.ReactNode;
  /** The Neutral Stroke button's words; null leaves it out. Inside a modal it closes it. */
  cancel?: React.ReactNode;
  /** The Primary Filled button's words; null leaves it out. */
  confirm?: React.ReactNode;
  /** The confirm button's other props: tone "error" for a delete, disabled while it runs. */
  confirmProps?: Omit<ButtonProps, "children" | "onClick">;
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
};

export function ModalFooter({
  type = "basic",
  leading,
  cancel = "Cancel",
  confirm = "Continue",
  confirmProps,
  onCancel,
  onConfirm,
  className,
  ...props
}: ModalFooterProps) {
  const stretch = type === "stretch";
  // Stretch: the buttons share the full width equally.
  const share = stretch ? "flex-1" : undefined;

  let left: React.ReactNode = null;
  if (type === "information") {
    left = (
      <div className="flex min-w-0 flex-1 items-center gap-modal-footer-info-gap">
        <span aria-hidden className="inline-flex shrink-0 text-icon-disabled-300 [&_svg]:size-modal-footer-icon">
          <InfoIcon />
        </span>
        <span className="min-w-0 text-paragraph-sm text-text-strong-950">{leading}</span>
      </div>
    );
  } else if (!stretch && type !== "basic" && leading != null) {
    left = <div className="flex min-w-0 flex-1 items-center">{leading}</div>;
  }

  return (
    <div
      className={cn(
        "ds-shadow [--ds-edge:var(--shadow-modal-footer-line)] flex min-h-modal-footer shrink-0 items-center gap-modal-footer-gap bg-bg-white-0 px-modal-footer-x py-modal-footer-y",
        className,
      )}
      {...props}
    >
      {left}
      <div className={cn("flex items-center gap-modal-footer-gap", stretch ? "flex-1" : "ms-auto shrink-0")}>
        {cancel != null && (
          <Closes>
            <Button tone="neutral" variant="stroke" size="sm" onClick={onCancel} className={share}>
              {cancel}
            </Button>
          </Closes>
        )}
        {confirm != null && (
          <Button size="sm" {...confirmProps} onClick={onConfirm} className={cn(share, confirmProps?.className)}>
            {confirm}
          </Button>
        )}
      </div>
    </div>
  );
}

// ---- Status Modal ----

export type ModalStatus = "error" | "warning" | "success" | "information";

const STATUS: Record<ModalStatus, { square: string; Icon: React.ComponentType }> = {
  error: { square: "bg-state-error-lighter text-state-error-base", Icon: ErrorIcon },
  warning: { square: "bg-state-warning-lighter text-state-warning-base", Icon: AlertIcon },
  success: { square: "bg-state-success-lighter text-state-success-base", Icon: CheckCircleIcon },
  information: { square: "bg-state-information-lighter text-state-information-base", Icon: InfoIcon },
};

export type StatusModalContentProps = Omit<React.ComponentProps<"div">, "title"> & {
  type: ModalStatus;
  /** horizontal: the icon left of the words. vertical: the icon above, all centred. */
  alignment?: "horizontal" | "vertical";
  /** Replaces the status's own icon. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
};

/** The Status Modal's top part: a 40 rounded square with a 24 icon, then
 *  the title (Label/Medium) and description (Paragraph/Small), 4 apart. */
export function StatusModalContent({
  type,
  alignment = "horizontal",
  icon,
  title,
  description,
  className,
  ...props
}: StatusModalContentProps) {
  const s = STATUS[type];
  const vertical = alignment === "vertical";
  return (
    <div
      className={cn(
        "flex shrink-0 gap-modal-status-gap bg-bg-white-0 p-modal-status-pad",
        vertical ? "flex-col items-center text-center" : "items-start",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-modal-status-icon-box shrink-0 items-center justify-center rounded-modal-status-icon p-modal-status-icon-pad [&_svg]:size-modal-status-icon",
          s.square,
        )}
      >
        {icon ?? <s.Icon />}
      </span>
      <div className={cn("flex min-w-0 flex-col gap-modal-status-words-gap", vertical ? "w-full" : "flex-1")}>
        <Title className="text-label-md text-text-strong-950">{title}</Title>
        {description != null && <Description className="text-paragraph-sm text-text-sub-600">{description}</Description>}
      </div>
    </div>
  );
}
