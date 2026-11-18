"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ds/badge";
import { CompactButton } from "@/components/ds/compact-button";
import { ContentDivider } from "@/components/ds/content-divider";
import { LinkButton } from "@/components/ds/link-button";
import { TabMenu, TabMenuList, TabMenuTrigger } from "@/components/ds/tab-menu";
import { ArrowDownIcon, ArrowUpIcon, FilterIcon, MoreIcon, PaperclipIcon, SettingsIcon } from "@/components/ui/icons";

/**
 * The design system's Notification Feed, built from
 * design-system/components/notification-feed.md (Nitesh's Figma
 * "Notifications Header [1.1]" node 4308:1004, "Notifications Tab Menu [1.1]"
 * 4349:46656, "Notifications Items [1.1]" 4308:731, "Notifications Footer
 * [1.1]" 4308:5526): the list of a person's notifications. Built only from
 * its four parts, in this order:
 *
 *   <NotificationFeed>
 *     <NotificationFeedHeader onMarkAllRead={...} />
 *     <NotificationFeedTabs tabs={[{ value: "all", label: "All", count: 3 }, ...]} onFilter={...}>
 *       <TabMenuContent value="all"><NotificationFeedList>...</NotificationFeedList></TabMenuContent>
 *     </NotificationFeedTabs>
 *     <NotificationFeedFooter onManage={...} />
 *   </NotificationFeed>
 *
 *   NotificationFeed        the panel: 540 wide, corner 20, its eight-layer shadow.
 *                           Give it a height and the list scrolls inside it.
 *   NotificationFeedHeader  title, "Mark all as read" (onMarkAllRead), end (a Compact Button)
 *   NotificationFeedTabs    the Tab Menu's tabs (2, 3 or 4, each with an optional
 *                           count Badge), the filter button (onFilter). Radix Tabs.
 *   NotificationFeedList    the items, with a Content Divider between each two;
 *                           the up and down arrow keys move between items
 *   NotificationItem        avatar (an Avatar 40), unread (the red status dot),
 *                           label, time, picture, description, and one of
 *                           actions (Button type), file (File type), message
 *                           (Message type); onMore shows the more button on hover
 *   NotificationQuiet       the label's words between names ("joined to")
 *   NotificationFeedFooter  the arrow keys hint, "Manage Notification" (onManage), start
 *
 * Keyboard focus shows the Neutral focus ring on items (page, Open). Sizes are
 * the tokens in styles/sizes/notification-feed.css.
 */

/** The edge, lift and ring parts (styles/ds.css) are inherited custom
 *  properties, so a part set on the panel, a bar or an item would also draw
 *  on every Button, Badge and Avatar inside it. Wrappers with this clear them
 *  for whatever sits inside. */
const NO_PARTS = "edge-none lift-none ring-none";

// ---- The panel ----

export function NotificationFeed({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "ds-shadow flex w-notification-feed max-w-full flex-col overflow-hidden rounded-notification-feed bg-bg-white-0 [--ds-lift:var(--shadow-notification-feed)]",
        className,
      )}
      {...props}
    >
      <div className={cn("contents", NO_PARTS)}>{children}</div>
    </div>
  );
}

// ---- Header ----

export type NotificationFeedHeaderProps = Omit<React.ComponentProps<"div">, "title"> & {
  title?: React.ReactNode;
  /** Shows "Mark all as read"; called when it is pressed. */
  onMarkAllRead?: React.MouseEventHandler<HTMLButtonElement>;
  /** An optional Compact Button, Ghost, Large, fully round, on the right. */
  end?: React.ReactNode;
};

export function NotificationFeedHeader({ title = "Notifications", onMarkAllRead, end, className, ...props }: NotificationFeedHeaderProps) {
  return (
    <div
      className={cn(
        "ds-shadow flex h-notification-feed-header shrink-0 items-center gap-notification-feed-header-gap bg-bg-white-0 px-notification-feed-bar-x py-notification-feed-header-y [--ds-edge:var(--shadow-notification-feed-line)]",
        className,
      )}
      {...props}
    >
      <div className={cn("contents", NO_PARTS)}>
        <p className="m-0 min-w-0 flex-1 text-label-md text-text-strong-950">{title}</p>
        {onMarkAllRead && (
          <LinkButton variant="primary" size="md" onClick={onMarkAllRead}>
            Mark all as read
          </LinkButton>
        )}
        {end}
      </div>
    </div>
  );
}

// ---- Tab Menu ----

export type NotificationFeedTab = { value: string; label: React.ReactNode; count?: number };

export type NotificationFeedTabsProps = Omit<React.ComponentProps<typeof TabMenu>, "orientation"> & {
  /** 2, 3 or 4 tabs. With 4, a line stands before the last. */
  tabs: NotificationFeedTab[];
  /** Shows the filter button; called when it is pressed. */
  onFilter?: React.MouseEventHandler<HTMLButtonElement>;
  filterLabel?: string;
  /** The tab bar's words for screen readers. */
  "aria-label"?: string;
};

/** The tab bar, then children (TabMenuContent panels, each holding a list). */
export function NotificationFeedTabs({
  tabs,
  onFilter,
  filterLabel = "Filter",
  "aria-label": ariaLabel = "Notifications",
  children,
  className,
  ...props
}: NotificationFeedTabsProps) {
  return (
    <TabMenu orientation="horizontal" className={cn("flex min-h-0 flex-1 flex-col", className)} {...props}>
      <TabMenuList
        aria-label={ariaLabel}
        end={
          onFilter && (
            <CompactButton variant="ghost" size="lg" fullRadius aria-label={filterLabel} onClick={onFilter}>
              <FilterIcon />
            </CompactButton>
          )
        }
        // The Tab Menu's bar (48, 14 top and bottom) with only its bottom line,
        // 20 at the left, 12 at the right (the filter button's place), tabs
        // 20 apart, each word 4 from its count.
        className={cn(
          "shrink-0 pl-notification-feed-bar-x pr-notification-feed-filter-right [--ds-edge:var(--shadow-notification-feed-line)]",
          "[&>[role=tablist]]:gap-notification-feed-tabs-gap [&_[role=tab]]:gap-notification-feed-tab-gap",
          // The bar's line is an inherited part: cleared for the tabs and the filter button.
          "*:edge-none *:lift-none *:ring-none",
        )}
      >
        {tabs.map((tab, i) => (
          <React.Fragment key={tab.value}>
            {tabs.length === 4 && i === 3 && (
              <span aria-hidden className="w-notification-feed-line h-notification-feed-tabs-divider shrink-0 self-center bg-stroke-soft-200" />
            )}
            <TabMenuTrigger
              value={tab.value}
              badge={
                tab.count != null && tab.count > 0 ? (
                  <Badge size="sm" variant="filled" color="red" number>
                    {tab.count}
                  </Badge>
                ) : undefined
              }
            >
              {tab.label}
            </TabMenuTrigger>
          </React.Fragment>
        ))}
      </TabMenuList>
      {children}
    </TabMenu>
  );
}

// ---- The list ----

/** The items, 4 apart, a Content Divider (Line Spacing) between each two, a
 *  line along the bottom. Up and down arrow keys move between items. */
export function NotificationFeedList({ children, className, onKeyDown, ...props }: React.ComponentProps<"div">) {
  const items = React.Children.toArray(children);

  function move(event: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) return;
    const all = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("[data-notification-item]"));
    const here = (event.target as HTMLElement).closest<HTMLElement>("[data-notification-item]");
    const at = here ? all.indexOf(here) : -1;
    const next = all[event.key === "ArrowDown" ? at + 1 : at - 1];
    if (next) {
      event.preventDefault();
      next.focus();
    }
  }

  return (
    <div
      className={cn(
        // The bottom line is drawn over the items, so it shows while they scroll.
        "relative flex min-h-0 flex-1 flex-col after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-notification-feed-line after:bg-stroke-soft-200",
        className,
      )}
    >
      <div
        className="flex min-h-0 flex-1 flex-col gap-notification-feed-list-gap overflow-y-auto p-notification-feed-list-pad"
        onKeyDown={move}
        {...props}
      >
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ContentDivider type="line-spacing" />}
            {item}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ---- Notification item ----

/** The label's quieter words between the names and things ("joined to"). */
export function NotificationQuiet({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("text-paragraph-sm text-text-sub-600", className)} {...props} />;
}

export type NotificationItemProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** An Avatar, 40. */
  avatar: React.ReactNode;
  /** Unread: the Figma's "Top Status [1.1]", a red dot in a white ring on the avatar's top right. */
  unread?: boolean;
  /** Names and things in the label style; wrap the words between them in NotificationQuiet. */
  label: React.ReactNode;
  /** "8 min ago". */
  time: React.ReactNode;
  /** A 16 x 16 picture before the description (a company logo). */
  picture?: React.ReactNode;
  description?: React.ReactNode;
  /** Button type: two Buttons, X-Small (32): Neutral Stroke, then Primary Filled. */
  actions?: React.ReactNode;
  /** File type: the file under the words. */
  file?: { name: React.ReactNode; size?: React.ReactNode };
  /** Message type: the quoted message under the words. */
  message?: React.ReactNode;
  /** Shows the more button on hover; called when it is pressed. */
  onMore?: React.MouseEventHandler<HTMLButtonElement>;
  moreLabel?: string;
};

export function NotificationItem({
  avatar,
  unread,
  label,
  time,
  picture,
  description,
  actions,
  file,
  message,
  onMore,
  moreLabel = "More",
  className,
  ...props
}: NotificationItemProps) {
  const attachment =
    actions != null ? (
      <div className="flex flex-wrap items-center gap-notification-feed-item-buttons-gap">{actions}</div>
    ) : file != null ? (
      <div className="ds-shadow flex h-notification-feed-file w-fit max-w-full items-center gap-notification-feed-file-gap rounded-notification-feed-file bg-bg-white-0 p-notification-feed-file-pad edge-stroke-soft-200 lift-card">
        <span aria-hidden className="flex shrink-0 text-icon-sub-600 [&_svg]:size-notification-feed-file-icon">
          <PaperclipIcon />
        </span>
        <span className="flex min-w-0 items-center gap-notification-feed-file-size-gap text-paragraph-sm">
          <span className="truncate text-text-sub-600">{file.name}</span>
          {file.size != null && <span className="shrink-0 text-text-soft-400">({file.size})</span>}
        </span>
      </div>
    ) : message != null ? (
      <blockquote className="ds-shadow flex min-h-notification-feed-message items-center rounded-tl-notification-feed-message-start rounded-tr-notification-feed-message rounded-br-notification-feed-message rounded-bl-notification-feed-message bg-bg-white-0 px-notification-feed-message-x py-notification-feed-message-y text-paragraph-sm text-text-sub-600 edge-stroke-soft-200 lift-card">
        {message}
      </blockquote>
    ) : null;

  return (
    <div
      data-notification-item=""
      tabIndex={0}
      className={cn(
        "group/item ds-shadow flex items-start gap-notification-feed-item-gap rounded-notification-feed-item bg-bg-white-0 p-notification-feed-item-pad outline-none",
        "transition-[background-color,box-shadow] duration-150",
        "ds-hover:bg-bg-weak-50 ds-focus:ring-focus-neutral",
        className,
      )}
      {...props}
    >
      <span className={cn("relative flex shrink-0", NO_PARTS)}>
        {avatar}
        {unread && (
          // Top Status [1.1]: 9 of bg/white-0 round 6.75 of state/error, centred 37 across and 9 down the 40 avatar.
          <span
            role="img"
            aria-label="Unread"
            className="ds-shadow absolute top-notification-feed-status-top left-notification-feed-status-left flex size-notification-feed-status items-center justify-center rounded-full bg-bg-white-0 [--ds-lift:var(--shadow-notification-feed-status)]"
          >
            <span className="size-notification-feed-status-dot rounded-full bg-state-error-base" />
          </span>
        )}
      </span>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          NO_PARTS,
          actions != null ? "gap-notification-feed-item-buttons-top" : "gap-notification-feed-item-attachment-top",
        )}
      >
        <div className="flex flex-col gap-notification-feed-item-words-gap">
          <p className="m-0 text-label-sm text-text-strong-950">{label}</p>
          <div className="flex min-w-0 items-center gap-notification-feed-item-detail-gap text-paragraph-xs text-text-sub-600">
            <span className="shrink-0">{time}</span>
            {(picture != null || description != null) && (
              <>
                <span aria-hidden className="shrink-0 text-text-soft-400">
                  ∙
                </span>
                <span className="flex min-w-0 items-center gap-notification-feed-item-picture-gap">
                  {picture != null && (
                    <span className="flex size-notification-feed-item-picture shrink-0 items-center justify-center [&>img]:size-full [&_svg]:size-full">
                      {picture}
                    </span>
                  )}
                  {description != null && <span className="min-w-0">{description}</span>}
                </span>
              </>
            )}
          </div>
        </div>
        {attachment}
      </div>

      {onMore && (
        // Hover only: shown when the pointer is on the item or focus is inside it.
        <span
          className={cn(
            "flex size-notification-feed-item-more shrink-0 items-center justify-center p-notification-feed-item-more-pad opacity-0 transition-opacity duration-150",
            NO_PARTS,
            "group-hover/item:opacity-100 group-focus-within/item:opacity-100 group-data-[force=hover]/item:opacity-100",
          )}
        >
          <CompactButton variant="ghost" size="lg" aria-label={moreLabel} onClick={onMore}>
            <MoreIcon />
          </CompactButton>
        </span>
      )}
    </div>
  );
}

// ---- Footer ----

/** One of the footer's keys: 20 x 20, an arrow on bg/weak-50 with an edge. */
function Key({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <kbd className="ds-shadow flex size-notification-feed-key shrink-0 items-center justify-center rounded-notification-feed-key bg-bg-weak-50 p-notification-feed-key-pad text-icon-sub-600 edge-stroke-soft-200 [&_svg]:size-notification-feed-key-icon">
      {children}
      <span className="sr-only">{label}</span>
    </kbd>
  );
}

export type NotificationFeedFooterProps = React.ComponentProps<"div"> & {
  /** Shows "Manage Notification"; called when it is pressed. */
  onManage?: React.MouseEventHandler<HTMLButtonElement>;
  /** An optional Compact Button, Ghost, Large, on the left. */
  start?: React.ReactNode;
};

export function NotificationFeedFooter({ onManage, start, className, ...props }: NotificationFeedFooterProps) {
  return (
    <div
      className={cn(
        "flex h-notification-feed-footer shrink-0 items-center gap-notification-feed-footer-gap bg-bg-white-0 px-notification-feed-bar-x py-notification-feed-footer-y",
        className,
      )}
      {...props}
    >
      {start}
      <p className="m-0 flex items-center gap-notification-feed-footer-hint-gap text-paragraph-xs text-text-sub-600">
        <span>Use</span>
        <Key label="Up arrow">
          <ArrowUpIcon />
        </Key>
        <Key label="Down arrow">
          <ArrowDownIcon />
        </Key>
        <span>to navigate</span>
      </p>
      {onManage && (
        <LinkButton variant="gray" size="sm" leadingIcon={<SettingsIcon />} onClick={onManage} className="ml-auto">
          Manage Notification
        </LinkButton>
      )}
    </div>
  );
}
