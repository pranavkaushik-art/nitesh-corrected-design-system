"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { CompactButton } from "@/components/ds/compact-button";
import { LinkButton } from "@/components/ds/link-button";
import { AlertIcon, CheckCircleIcon, CommentIcon, DownloadIcon, ErrorIcon, MoreIcon, PaperclipIcon } from "@/components/ui/icons";

/**
 * The design system's Activity Feed, built from
 * design-system/components/activity-feed.md (Nitesh's Figma "Activity Feed
 * [1.1]" node 166035:46833, its File, Comment and Task Status Items, and
 * "Activity Feed Selected Filter [1.1]" 165967:3881): a record of what
 * happened in one place, newest first.
 *
 *   ActivityFeed         the events, 32 apart, with a line down the side
 *                        through the pictures (each picture's ring cuts it)
 *   ActivityEvent        picture (an Avatar 32, or a Key Icon, Small, Stroke),
 *                        the sentence (children), time, chips (the type:
 *                        file chips, a comment chip, a Compact Avatar Group
 *                        or task chips; none is the Default type), and the
 *                        more button on the right (onMore)
 *   ActivityAction       the sentence's action word ("uploaded")
 *   ActivityFileChip     name, size, onDownload (the download button)
 *   ActivityCommentChip  the comment (children), onReply ("Reply")
 *   ActivityTaskChip     status success | warning | error, the words (children)
 *   ActivityFilterChip   icon, the word, active (picked), a toggle button
 *
 * Every chip's edge sits inside (page, Open). Keyboard focus shows the
 * Neutral focus ring; an Active filter the Primary one (page, Open). The
 * Pending task waits for the Yellow hue. Sizes are the tokens in
 * styles/sizes/activity-feed.css.
 */

// ---- The feed ----

/** Stacks events and draws the line: each event but the last draws its
 *  piece, from its picture's centre to the next one's, behind everything
 *  (the feed is its own layer, so the line stays above the feed's own fill). */
export function ActivityFeed({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "isolate flex flex-col gap-activity-feed-gap",
        "*:relative *:not-last:before:absolute *:not-last:before:-z-10 *:not-last:before:top-activity-feed-line-top *:not-last:before:-bottom-activity-feed-line-reach",
        "*:not-last:before:left-activity-feed-line-x *:not-last:before:w-activity-feed-line *:not-last:before:bg-stroke-soft-200",
        className,
      )}
      {...props}
    />
  );
}

// ---- An event ----

/** The sentence's action word, quieter than the names around it. */
export function ActivityAction({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("text-paragraph-sm text-text-sub-600", className)} {...props} />;
}

export type ActivityEventProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** An Avatar (size 32), or a KeyIcon (size sm, Stroke) for an event with no person. */
  picture: React.ReactNode;
  /** The sentence. Who and what in the label style; wrap the action in ActivityAction. */
  children: React.ReactNode;
  /** "4 min ago". */
  time: React.ReactNode;
  /** What sits under the sentence. Left out: the Default type, one line. */
  chips?: React.ReactNode;
  /** Called when the more button is pressed. */
  onMore?: React.MouseEventHandler<HTMLButtonElement>;
  moreLabel?: string;
};

export function ActivityEvent({ picture, children, time, chips, onMore, moreLabel = "More", className, ...props }: ActivityEventProps) {
  return (
    <div
      className={cn("flex gap-activity-feed-event-gap", chips != null ? "items-start" : "items-center", className)}
      {...props}
    >
      {/* The 4px ring in stroke/white-0 cuts the feed's line. */}
      <span className="ds-shadow flex size-activity-feed-picture shrink-0 items-center justify-center rounded-activity-feed-picture [--ds-lift:var(--shadow-activity-feed-picture)]">
        {/* The ring is an inherited part: cleared so the picture inside does not draw it again. */}
        <span className="contents edge-none lift-none ring-none">{picture}</span>
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-activity-feed-words-gap">
        <p className="m-0 text-label-sm text-text-strong-950">
          {children}
          <span aria-hidden className="mx-activity-feed-sentence-gap inline-block w-activity-feed-dot text-center text-label-sm text-text-disabled-300">
            ・
          </span>
          <span className="text-paragraph-sm text-text-soft-400">{time}</span>
        </p>
        {chips != null && <div className="flex flex-wrap items-center gap-activity-feed-chips-gap">{chips}</div>}
      </div>

      {/* Always on the right. */}
      <CompactButton variant="ghost" size="md" fullRadius aria-label={moreLabel} onClick={onMore}>
        <MoreIcon />
      </CompactButton>
    </div>
  );
}

// ---- File chip ----

export type ActivityFileChipProps = Omit<React.ComponentProps<"div">, "children"> & {
  name: React.ReactNode;
  /** "4mb", shown as "(4mb)". */
  size?: React.ReactNode;
  /** Called when the download button is pressed. */
  onDownload?: React.MouseEventHandler<HTMLButtonElement>;
  downloadLabel?: string;
  /** More for the download button (the Components page shows its states with data-force). */
  downloadButtonProps?: React.ComponentProps<"button">;
};

export function ActivityFileChip({
  name,
  size,
  onDownload,
  downloadLabel = "Download",
  downloadButtonProps,
  className,
  ...props
}: ActivityFileChipProps) {
  return (
    <div
      className={cn(
        "ds-shadow relative inline-flex h-activity-feed-file max-w-full items-stretch rounded-activity-feed-file bg-bg-white-0 lift-card",
        // The edge, inside, drawn over the parts so the download button's hover fill never hides it.
        "after:ds-shadow after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:edge-stroke-soft-200 after:lift-none",
        className,
      )}
      {...props}
    >
      <span className="ds-shadow flex min-w-0 items-center gap-activity-feed-file-gap py-activity-feed-file-y pr-activity-feed-file-right pl-activity-feed-file-left [--ds-edge:var(--shadow-activity-feed-divider)] lift-none">
        <span aria-hidden className="flex shrink-0 text-icon-soft-400 [&_svg]:size-activity-feed-file-icon">
          <PaperclipIcon />
        </span>
        <span className="flex min-w-0 items-center gap-activity-feed-file-size-gap">
          <span className="truncate text-label-sm text-text-sub-600">{name}</span>
          {size != null && <span className="shrink-0 text-paragraph-sm text-text-soft-400">({size})</span>}
        </span>
      </span>
      <button
        type="button"
        aria-label={downloadLabel}
        onClick={onDownload}
        {...downloadButtonProps}
        className={cn(
          // edge-none and lift-none: the chip's card shadow is an inherited part, and stays on the chip.
          "ds-shadow flex size-activity-feed-download shrink-0 cursor-pointer items-center justify-center rounded-r-activity-feed-file bg-bg-white-0 p-activity-feed-download-pad text-icon-soft-400 outline-none edge-none lift-none [&_svg]:size-activity-feed-download-icon",
          "transition-[background-color,color,box-shadow] duration-150",
          "ds-hover:bg-bg-weak-50 ds-hover:text-icon-sub-600 ds-focus:ring-focus-neutral",
          downloadButtonProps?.className,
        )}
      >
        <DownloadIcon />
      </button>
    </div>
  );
}

// ---- Comment chip ----

export type ActivityCommentChipProps = React.ComponentProps<"div"> & {
  /** Shows "Reply"; called when it is pressed. */
  onReply?: React.MouseEventHandler<HTMLButtonElement>;
};

/** A speech bubble. Hover is on the whole chip: the fill turns bg/weak-50, the
 *  edge goes, the shadow stays (as drawn), and "Reply" darkens and underlines. */
export function ActivityCommentChip({ onReply, children, className, ...props }: ActivityCommentChipProps) {
  return (
    <div
      className={cn(
        "group/comment ds-shadow inline-flex min-h-activity-feed-comment max-w-full items-center gap-activity-feed-comment-gap",
        "rounded-tl-activity-feed-comment-start rounded-tr-activity-feed-comment rounded-br-activity-feed-comment rounded-bl-activity-feed-comment",
        "bg-bg-white-0 py-activity-feed-comment-y pr-activity-feed-comment-right pl-activity-feed-comment-left edge-stroke-soft-200 lift-card",
        "transition-[background-color,box-shadow] duration-150 ds-hover:bg-bg-weak-50 ds-hover:edge-none",
        className,
      )}
      {...props}
    >
      {/* The chip's edge and shadow are inherited parts: cleared so "Reply" does not draw them too. */}
      <span className="contents edge-none lift-none ring-none">
        <span aria-hidden className="flex shrink-0 text-icon-soft-400 [&_svg]:size-activity-feed-comment-icon">
          <CommentIcon />
        </span>
        <span className="min-w-0 text-label-sm text-text-sub-600">{children}</span>
        {onReply && (
          <LinkButton
            variant="primary"
            size="md"
            onClick={onReply}
            className="group-hover/comment:text-primary-dark group-hover/comment:underline group-data-[force=hover]/comment:text-primary-dark group-data-[force=hover]/comment:underline"
          >
            Reply
          </LinkButton>
        )}
      </span>
    </div>
  );
}

// ---- Task chip ----

export type ActivityTaskStatus = "success" | "warning" | "error";

const TASK: Record<ActivityTaskStatus, { Icon: React.ComponentType; colour: string; label: string }> = {
  success: { Icon: CheckCircleIcon, colour: "text-state-success-base", label: "Success" },
  warning: { Icon: AlertIcon, colour: "text-state-warning-base", label: "Warning" },
  error: { Icon: ErrorIcon, colour: "text-state-error-base", label: "Error" },
};

export type ActivityTaskChipProps = React.ComponentProps<"span"> & {
  status: ActivityTaskStatus;
};

export function ActivityTaskChip({ status, children, className, ...props }: ActivityTaskChipProps) {
  const t = TASK[status];
  return (
    <span
      className={cn(
        "ds-shadow inline-flex h-activity-feed-task max-w-full items-center gap-activity-feed-task-gap rounded-activity-feed-task bg-bg-white-0 py-activity-feed-task-y pr-activity-feed-task-right pl-activity-feed-task-left edge-stroke-soft-200 lift-card",
        className,
      )}
      {...props}
    >
      <span role="img" aria-label={t.label} className={cn("flex shrink-0 [&_svg]:size-activity-feed-task-icon", t.colour)}>
        <t.Icon />
      </span>
      <span className="truncate text-label-sm text-text-sub-600">{children}</span>
    </span>
  );
}

// ---- Filter chip ----

export type ActivityFilterChipProps = Omit<React.ComponentProps<"button">, "children"> & {
  /** An 18 x 18 icon before the word. */
  icon?: React.ReactNode;
  children: React.ReactNode;
  /** Picked: the Active look. Sets aria-pressed. */
  active?: boolean;
};

export function ActivityFilterChip({ icon, active = false, children, className, type = "button", ...props }: ActivityFilterChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        "group/filter ds-shadow inline-flex h-activity-feed-filter shrink-0 cursor-pointer items-center gap-activity-feed-filter-gap whitespace-nowrap rounded-activity-feed-filter px-activity-feed-filter-x py-activity-feed-filter-y text-label-sm outline-none",
        "transition-[background-color,color,box-shadow] duration-150",
        "bg-bg-white-0 text-text-sub-600 edge-stroke-soft-200",
        "ds-hover:not-aria-pressed:bg-bg-weak-50 ds-hover:not-aria-pressed:edge-none",
        "aria-pressed:bg-primary-alpha-10 aria-pressed:text-primary-base aria-pressed:edge-none",
        "ds-focus:ring-focus-neutral aria-pressed:ds-focus:ring-focus-primary",
        className,
      )}
      {...props}
    >
      {icon != null && (
        <span
          aria-hidden
          className="flex shrink-0 text-icon-soft-400 group-aria-pressed/filter:text-primary-base [&_svg]:size-activity-feed-filter-icon"
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}
