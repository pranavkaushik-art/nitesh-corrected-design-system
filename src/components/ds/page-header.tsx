import * as React from "react";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ds/avatar";
import { KeyIcon } from "@/components/ds/key-components";
import {
  HeaderNotificationIcon,
  HeaderSearchIcon,
  HeaderUserIcon,
  LoomMark,
  MerlinMark,
} from "@/components/ds/page-header-icons";

/**
 * The design system's Page Header, built from Nitesh's Figma "Page Header
 * [1.1]" (node 3829:27898): the bar at the top of a page, with its title and
 * description, then search, notifications, an optional dropdown and the
 * page's buttons, over a divider inset 24 from each side.
 *
 *   type     basic | avatar | left-icon | brand | company: what sits left
 *            of the words (nothing, an Avatar, a Key Icon, a brand's logo or
 *            the company's). `picture` swaps in your own.
 *   search, notification   the two 40 Topbar Item Buttons (on by default)
 *   dropdown  a Select (select.md), e.g. a date range, before the buttons
 *   actions   the page's Buttons (button.md), 12 apart
 *   divider   the line along the bottom (on by default)
 *   background  the bar's bg/white-0 (on by default; off sits on the page)
 *
 * Sizes are the tokens in styles/sizes/page-header.css.
 */

export type PageHeaderType = "basic" | "avatar" | "left-icon" | "brand" | "company";

export type PageHeaderProps = Omit<React.ComponentProps<"header">, "title"> & {
  type?: PageHeaderType;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** The 48 picture on the left; each type has its own stand-in. */
  picture?: React.ReactNode;
  search?: boolean;
  notification?: boolean;
  /** The red dot on the notification button (on by default). */
  unread?: boolean;
  onSearch?: React.MouseEventHandler<HTMLButtonElement>;
  onNotification?: React.MouseEventHandler<HTMLButtonElement>;
  dropdown?: React.ReactNode;
  actions?: React.ReactNode;
  divider?: boolean;
  /** The bar's bg/white-0 (on by default); off, it sits on the page's own. */
  background?: boolean;
};

/** Each type's stand-in picture, as the Figma draws it. */
function standIn(type: PageHeaderType) {
  switch (type) {
    case "avatar":
      return <Avatar size="48" />;
    case "left-icon":
      return (
        <KeyIcon size="lg">
          <HeaderUserIcon />
        </KeyIcon>
      );
    case "brand":
      return <LoomMark className="size-page-header-picture" />;
    case "company":
      return (
        <MerlinMark className="inline-flex size-page-header-picture shrink-0 items-center justify-center rounded-avatar bg-(--palette-blue-600) text-static-white" />
      );
    default:
      return null;
  }
}

/** The Figma's Topbar Item Button: a 40 square in bg/white-0, a 20 icon. */
function TopbarItem({ label, dot, onClick, children }: { label: string; dot?: boolean; onClick?: React.MouseEventHandler<HTMLButtonElement>; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "relative inline-flex size-page-header-item shrink-0 cursor-pointer items-center justify-center rounded-page-header-item bg-bg-white-0 text-icon-sub-600 outline-none",
        "transition-colors duration-150 hover:bg-bg-weak-50 hover:text-icon-strong-950 focus-visible:ring-2 focus-visible:ring-stroke-strong-950",
        "[&_svg]:size-page-header-item-icon",
      )}
    >
      {children}
      {dot && (
        <span
          aria-hidden
          className="ds-shadow absolute top-page-header-dot-inset right-page-header-dot-inset size-page-header-dot rounded-avatar bg-state-error-base [--ds-lift:var(--shadow-page-header-dot)]"
        />
      )}
    </button>
  );
}

export function PageHeader({
  type = "basic",
  title,
  description,
  picture,
  search = true,
  notification = true,
  unread = true,
  onSearch,
  onNotification,
  dropdown,
  actions,
  divider = true,
  background = true,
  className,
  ...props
}: PageHeaderProps) {
  const pic = picture ?? standIn(type);
  return (
    <header
      className={cn(
        "relative flex w-full items-center gap-page-header-gap px-page-header-x py-page-header-y",
        background && "bg-bg-white-0",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-start gap-page-header-content-gap">
        {type !== "basic" && pic != null && <span className="flex shrink-0">{pic}</span>}
        <div className="flex min-w-0 flex-1 flex-col gap-page-header-words-gap">
          <h1 className="m-0 truncate text-label-lg text-text-strong-950">{title}</h1>
          {description != null && <p className="m-0 truncate text-paragraph-sm text-text-sub-600">{description}</p>}
        </div>
      </div>

      {search && (
        <TopbarItem label="Search" onClick={onSearch}>
          <HeaderSearchIcon />
        </TopbarItem>
      )}
      {notification && (
        <TopbarItem label={unread ? "Notifications, unread" : "Notifications"} dot={unread} onClick={onNotification}>
          <HeaderNotificationIcon />
        </TopbarItem>
      )}
      {dropdown != null && <div className="shrink-0">{dropdown}</div>}
      {actions != null && <div className="flex shrink-0 items-center gap-page-header-gap">{actions}</div>}

      {divider && <span aria-hidden className="absolute right-page-header-x bottom-0 left-page-header-x h-px bg-stroke-soft-200" />}
    </header>
  );
}
