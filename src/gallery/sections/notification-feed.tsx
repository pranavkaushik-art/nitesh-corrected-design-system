"use client";

import * as React from "react";

import { Avatar } from "@/components/ds/avatar";
import { Button } from "@/components/ds/button";
import { CompactButton } from "@/components/ds/compact-button";
import { TabMenuContent } from "@/components/ds/tab-menu";
import {
  NotificationFeed,
  NotificationFeedFooter,
  NotificationFeedHeader,
  NotificationFeedList,
  NotificationFeedTabs,
  NotificationItem,
  NotificationQuiet,
  type NotificationItemProps,
} from "@/components/ds/notification-feed";
import { CloseIcon, SettingsIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const noop = () => {};

/** A stand-in company logo for the detail line. */
// eslint-disable-next-line @next/next/no-img-element
const logo = <img src="/brand/slack.svg" alt="" />;

type Sample = { id: string; name: string; tab: "inbox" | "following" | "archived"; item: Omit<NotificationItemProps, "avatar"> };

const SAMPLES: Sample[] = [
  {
    id: "basic",
    name: "Wei Chen",
    tab: "inbox",
    item: {
      label: (
        <>
          Wei Chen <NotificationQuiet>joined to</NotificationQuiet> Final Presentation
        </>
      ),
      time: "8 min ago",
      picture: logo,
      description: "Product team",
    },
  },
  {
    id: "button",
    name: "Sofia Ramos",
    tab: "inbox",
    item: {
      label: (
        <>
          Sofia Ramos <NotificationQuiet>asked to join</NotificationQuiet> Q2 Planning
        </>
      ),
      time: "20 min ago",
      description: "Workspace",
      actions: (
        <>
          <Button tone="neutral" variant="stroke" size="xs">
            Deny
          </Button>
          <Button tone="primary" variant="filled" size="xs">
            Approve
          </Button>
        </>
      ),
    },
  },
  {
    id: "file",
    name: "Amir Khan",
    tab: "following",
    item: {
      label: (
        <>
          Amir Khan <NotificationQuiet>uploaded a file to</NotificationQuiet> Design Review
        </>
      ),
      time: "1 hour ago",
      description: "Files",
      file: { name: "Brand guidelines.pdf", size: "4mb" },
    },
  },
  {
    id: "message",
    name: "Lena Fischer",
    tab: "archived",
    item: {
      label: (
        <>
          Lena Fischer <NotificationQuiet>commented on</NotificationQuiet> Launch Plan
        </>
      ),
      time: "Yesterday",
      description: "Comments",
      message: "Can we move the launch to Thursday?",
    },
  },
];

const TYPES = [
  { id: "basic", label: "Basic (64)" },
  { id: "button", label: "Button (112)" },
  { id: "file", label: "File (112)" },
  { id: "message", label: "Message (112)" },
] as const;

const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focus (proposed)" },
] as const;

/** The whole panel, working: tabs switch the list, Mark all as read clears
 *  the red marks and counts, the up and down arrow keys move between items. */
function LivePanel() {
  const [unread, setUnread] = React.useState<Set<string>>(() => new Set(["basic", "button", "file"]));
  const [tab, setTab] = React.useState("all");

  const count = (where: Sample["tab"] | "all") =>
    SAMPLES.filter((s) => unread.has(s.id) && (where === "all" || s.tab === where)).length;
  const tabs = [
    { value: "all", label: "All", count: count("all") },
    { value: "inbox", label: "Inbox", count: count("inbox") },
    { value: "following", label: "Following", count: count("following") },
    { value: "archived", label: "Archived" },
  ];

  return (
    <NotificationFeed>
      <NotificationFeedHeader onMarkAllRead={() => setUnread(new Set())} />
      <NotificationFeedTabs tabs={tabs} value={tab} onValueChange={setTab} onFilter={noop}>
        {tabs.map((t) => (
          <TabMenuContent key={t.value} value={t.value} className="flex min-h-0 flex-1 flex-col outline-none">
            <NotificationFeedList aria-label={`${t.label} notifications`}>
              {SAMPLES.filter((s) => t.value === "all" || s.tab === t.value).map(({ id, name, item }) => (
                <NotificationItem
                  key={id}
                  {...item}
                  avatar={<Avatar size="40" name={name} />}
                  unread={unread.has(id)}
                  onClick={() => setUnread((u) => new Set([...u].filter((x) => x !== id)))}
                  onMore={noop}
                />
              ))}
            </NotificationFeedList>
          </TabMenuContent>
        ))}
      </NotificationFeedTabs>
      <NotificationFeedFooter onManage={noop} />
    </NotificationFeed>
  );
}

export function NotificationFeedSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="The panel, try it (540 wide)">
        <LivePanel />
      </Group>

      <Group label="Header: with Mark all as read, with the optional end button">
        <div className="flex w-notification-feed max-w-full flex-col gap-space-16">
          <Labelled label="Default">
            <NotificationFeedHeader className="w-notification-feed max-w-full" onMarkAllRead={noop} />
          </Labelled>
          <Labelled label="With the end button">
            <NotificationFeedHeader
              className="w-notification-feed max-w-full"
              onMarkAllRead={noop}
              end={
                <CompactButton variant="ghost" size="lg" fullRadius aria-label="Close">
                  <CloseIcon />
                </CompactButton>
              }
            />
          </Labelled>
        </div>
      </Group>

      <Group label="Tab Menu: 2, 3 and 4 tabs (a line before the 4th), counts, the filter button">
        <div className="flex w-notification-feed max-w-full flex-col gap-space-16">
          {[2, 3, 4].map((n) => (
            <Labelled key={n} label={`${n} tabs`}>
              <NotificationFeedTabs
                className="w-notification-feed max-w-full"
                defaultValue="all"
                onFilter={noop}
                tabs={[
                  { value: "all", label: "All", count: 3 },
                  { value: "inbox", label: "Inbox", count: 2 },
                  { value: "following", label: "Following" },
                  { value: "archived", label: "Archived" },
                ].slice(0, n)}
              />
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Notification item: every type in Default, Hover and Focus (unread shows the Avatar's red mark)">
        <div className="flex flex-col gap-space-24">
          {TYPES.map((type) => {
            const { name, item } = SAMPLES.find((s) => s.id === type.id)!;
            return (
              <div key={type.id} className="flex flex-wrap items-start gap-space-24">
                {STATES.map((state) => (
                  <Labelled key={state.id} label={`${type.label}, ${state.label}`}>
                    {/* In the panel an item is the list's width: 540 less the list's padding. */}
                    <div className="w-notification-feed max-w-full p-notification-feed-list-pad">
                      <NotificationItem
                        {...item}
                        avatar={<Avatar size="40" name={name} />}
                        unread={state.id === "default"}
                        onMore={noop}
                        data-force={state.id === "default" ? undefined : state.id}
                      />
                    </div>
                  </Labelled>
                ))}
              </div>
            );
          })}
        </div>
      </Group>

      <Group label="Footer: Default, with the optional start button">
        <div className="flex w-notification-feed max-w-full flex-col gap-space-16">
          <Labelled label="Default">
            <NotificationFeedFooter className="w-notification-feed max-w-full" onManage={noop} />
          </Labelled>
          <Labelled label="With the start button">
            <NotificationFeedFooter
              className="w-notification-feed max-w-full"
              onManage={noop}
              start={
                <CompactButton variant="ghost" size="lg" aria-label="Settings">
                  <SettingsIcon />
                </CompactButton>
              }
            />
          </Labelled>
        </div>
      </Group>
    </div>
  );
}
