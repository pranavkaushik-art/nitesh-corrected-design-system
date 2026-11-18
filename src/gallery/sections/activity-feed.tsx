"use client";

import * as React from "react";

import {
  ActivityAction,
  ActivityCommentChip,
  ActivityEvent,
  ActivityFeed,
  ActivityFileChip,
  ActivityFilterChip,
  ActivityTaskChip,
} from "@/components/ds/activity-feed";
import { Avatar, CompactAvatarGroup } from "@/components/ds/avatar";
import { KeyIcon } from "@/components/ds/key-components";
import { Switch } from "@/components/ds/switch";
import { CompactSelect, SelectItem } from "@/components/ds/select";
import { TextInput } from "@/components/ds/text-input";
import { AlertIcon, CalendarIcon, ChatIcon, FileIcon, GridIcon, UserIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const noop = () => {};

const FILTERS = [
  { id: "all", label: "All", icon: <GridIcon /> },
  { id: "files", label: "Files", icon: <FileIcon /> },
  { id: "comments", label: "Comments", icon: <ChatIcon /> },
  { id: "people", label: "People", icon: <UserIcon /> },
] as const;

/** The Figma's example, working: the period picks, the filters pick, the
 *  search types, the switch switches. The page says "a picker" without its
 *  kind; the Compact Select, Basic, X-Small is our pick. */
function LiveExample() {
  const [filter, setFilter] = React.useState<string>("all");
  return (
    <div className="flex max-w-2xl flex-col gap-space-32">
      <div className="flex flex-col">
        <div className="flex items-center gap-space-16">
          <p className="m-0 min-w-0 flex-1 text-label-md text-text-sub-600">Activities</p>
          <CompactSelect type="basic" size="xs" aria-label="Period" defaultValue="7">
            <SelectItem value="1" code="Today">
              Today
            </SelectItem>
            <SelectItem value="7" code="Last 7 days">
              Last 7 days
            </SelectItem>
            <SelectItem value="30" code="Last 30 days">
              Last 30 days
            </SelectItem>
          </CompactSelect>
          <span className="flex pl-space-4">
            <Switch defaultChecked aria-label="Show new activity" />
          </span>
        </div>
        <TextInput className="mt-space-20" type="search" size="sm" placeholder="Search" aria-label="Search activities" />
        <div className="mt-space-16 flex flex-wrap gap-space-10">
          {FILTERS.map((f) => (
            <ActivityFilterChip key={f.id} icon={f.icon} active={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </ActivityFilterChip>
          ))}
        </div>
      </div>

      <ActivityFeed>
        <ActivityEvent picture={<Avatar size="32" name="Wei Chen" />} time="4 min ago" onMore={noop}>
          Wei Chen <ActivityAction>uploaded</ActivityAction> Q2 financial report
        </ActivityEvent>
        <ActivityEvent
          picture={<Avatar size="32" name="Sofia Ramos" />}
          time="12 min ago"
          onMore={noop}
          chips={
            <>
              <ActivityFileChip name="Q2 report.pdf" size="4mb" onDownload={noop} downloadLabel="Download Q2 report.pdf" />
              <ActivityFileChip name="Forecast.xlsx" size="2mb" onDownload={noop} downloadLabel="Download Forecast.xlsx" />
            </>
          }
        >
          Sofia Ramos <ActivityAction>added 2 files to</ActivityAction> Finance
        </ActivityEvent>
        <ActivityEvent
          picture={<Avatar size="32" name="Amir Khan" />}
          time="1 hour ago"
          onMore={noop}
          chips={<ActivityCommentChip onReply={noop}>Looks good, ship it on Friday.</ActivityCommentChip>}
        >
          Amir Khan <ActivityAction>commented on</ActivityAction> Launch Plan
        </ActivityEvent>
        <ActivityEvent
          picture={
            <KeyIcon size="sm" variant="stroke" color="blue">
              <CalendarIcon />
            </KeyIcon>
          }
          time="2 hours ago"
          onMore={noop}
          chips={
            <CompactAvatarGroup size="24" variant="stroke" more={4}>
              <Avatar name="Wei Chen" />
              <Avatar name="Sofia Ramos" />
              <Avatar name="Lena Fischer" />
            </CompactAvatarGroup>
          }
        >
          Weekly sync <ActivityAction>was held with</ActivityAction> 7 people
        </ActivityEvent>
        <ActivityEvent
          picture={
            <KeyIcon size="sm" variant="stroke" color="red">
              <AlertIcon />
            </KeyIcon>
          }
          time="Yesterday"
          onMore={noop}
          chips={
            <>
              <ActivityTaskChip status="success">12 tasks completed</ActivityTaskChip>
              <ActivityTaskChip status="warning">3 tasks at risk</ActivityTaskChip>
              <ActivityTaskChip status="error">1 task failed</ActivityTaskChip>
            </>
          }
        >
          Sprint 14 <ActivityAction>ended for</ActivityAction> Platform
        </ActivityEvent>
      </ActivityFeed>
    </div>
  );
}

const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focus (proposed)" },
] as const;
type StateId = (typeof STATES)[number]["id"];
const force = (s: StateId) => (s === "default" ? undefined : s);

export function ActivityFeedSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="The feed with its header, try it (the Figma's example)">
        <LiveExample />
      </Group>

      <Group label="Event types: Default (32), File (56), Comment (64), Avatar Group (56), Tasks (56)">
        <div className="flex max-w-2xl flex-col gap-space-24">
          <Labelled label="Default: one line, centred">
            <div className="w-full">
              <ActivityEvent picture={<Avatar size="32" name="Wei Chen" />} time="4 min ago">
                Wei Chen <ActivityAction>uploaded</ActivityAction> Q2 financial report
              </ActivityEvent>
            </div>
          </Labelled>
          <Labelled label="With a Key Icon, for an event with no person">
            <div className="w-full">
              <ActivityEvent
                picture={
                  <KeyIcon size="sm" variant="stroke" color="red">
                    <AlertIcon />
                  </KeyIcon>
                }
                time="10 min ago"
              >
                Risk alert <ActivityAction>raised on</ActivityAction> Vendor contract
              </ActivityEvent>
            </div>
          </Labelled>
        </div>
      </Group>

      <Group label="File chip: Default, download Hover, download Focus (proposed)">
        <div className="flex flex-wrap items-end gap-space-24">
          {STATES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <ActivityFileChip
                name="Q2 report.pdf"
                size="4mb"
                onDownload={noop}
                downloadButtonProps={s.id === "default" ? undefined : ({ "data-force": s.id } as React.ComponentProps<"button">)}
              />
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Comment chip: Default, Hover">
        <div className="flex flex-wrap items-end gap-space-24">
          {STATES.filter((s) => s.id !== "focus").map((s) => (
            <Labelled key={s.id} label={s.label}>
              <ActivityCommentChip onReply={noop} data-force={force(s.id)}>
                Looks good, ship it on Friday.
              </ActivityCommentChip>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Task chip: Success, Warning, Error (Pending waits for the Yellow hue)">
        <div className="flex flex-wrap items-end gap-space-24">
          <Labelled label="Success">
            <ActivityTaskChip status="success">12 tasks completed</ActivityTaskChip>
          </Labelled>
          <Labelled label="Warning">
            <ActivityTaskChip status="warning">3 tasks at risk</ActivityTaskChip>
          </Labelled>
          <Labelled label="Error">
            <ActivityTaskChip status="error">1 task failed</ActivityTaskChip>
          </Labelled>
        </div>
      </Group>

      <Group label="Filter chip: Default, Hover, Active, Focus (proposed), Active and focused">
        <div className="flex flex-wrap items-end gap-space-24">
          {STATES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <ActivityFilterChip icon={<FileIcon />} data-force={force(s.id)}>
                Files
              </ActivityFilterChip>
            </Labelled>
          ))}
          <Labelled label="Active">
            <ActivityFilterChip icon={<FileIcon />} active>
              Files
            </ActivityFilterChip>
          </Labelled>
          <Labelled label="Active, Focus (proposed)">
            <ActivityFilterChip icon={<FileIcon />} active data-force="focus">
              Files
            </ActivityFilterChip>
          </Labelled>
        </div>
      </Group>
    </div>
  );
}
