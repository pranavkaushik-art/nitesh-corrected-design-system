"use client";

import { Avatar } from "@/components/ds/avatar";
import { Button } from "@/components/ds/button";
import { PageHeader, type PageHeaderType } from "@/components/ds/page-header";
import {
  HeaderAddIcon,
  HeaderCalendarCheckIcon,
  HeaderCalendarIcon,
} from "@/components/ds/page-header-icons";
import { Select, SelectItem } from "@/components/ds/select";
import { Group, Labelled } from "../parts";

/** The Figma's five types (Page Header [1.1], node 3829:27898). */
const TYPES: { id: PageHeaderType; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "avatar", label: "Avatar" },
  { id: "left-icon", label: "Left Icon" },
  { id: "brand", label: "Brand" },
  { id: "company", label: "Company" },
];

const TITLE = "Insert page title here";
const DESCRIPTION = "Insert page description here.";

/** The Figma's buttons: Schedule (Neutral Stroke) and Create Request (Primary Filled). */
function Actions() {
  return (
    <>
      <Button
        tone="neutral"
        variant="stroke"
        leadingIcon={<HeaderCalendarCheckIcon />}
      >
        Schedule
      </Button>
      <Button leadingIcon={<HeaderAddIcon />}>Create Request</Button>
    </>
  );
}

/** The Figma's hidden dropdown: a Select with a calendar icon, "Last month". */
function Range() {
  return (
    <Select
      icon={<HeaderCalendarIcon />}
      defaultValue="last-month"
      aria-label="Date range"
      className="w-fit"
    >
      <SelectItem value="last-week">Last week</SelectItem>
      <SelectItem value="last-month">Last month</SelectItem>
      <SelectItem value="last-quarter">Last quarter</SelectItem>
    </Select>
  );
}

export function PageHeaderSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Every type, as the Figma draws it (1168 x 88: 24 at the sides, 20 top and bottom)">
        {/* On bg/weak-50 so the bar's own bg/white-0 and its divider show. */}
        <div className="overflow-x-auto bg-bg-weak-50">
          {/* Padding on a w-max inner box, so the right 24 scrolls into view too. */}
          <div className="flex w-max flex-col gap-space-24 p-space-24">
            {TYPES.map((t) => (
              <Labelled key={t.id} label={t.label}>
                <PageHeader
                  type={t.id}
                  title={TITLE}
                  description={DESCRIPTION}
                  picture={
                    t.id === "avatar" ? (
                      <Avatar
                        size="48"
                        src="/avatars/erik-cofield-image.png"
                        alt="Erik Cofield"
                        color="yellow"
                      />
                    ) : undefined
                  }
                  actions={<Actions />}
                  className="w-page-header-frame shrink-0"
                />
              </Labelled>
            ))}
          </div>
        </div>
      </Group>

      <Group label="Options: the dropdown on, one button, no search, no divider">
        <div className="overflow-x-auto bg-bg-weak-50">
          <div className="flex w-max flex-col gap-space-24 p-space-24">
            <Labelled label="With the dropdown">
              <PageHeader
                type="left-icon"
                title={TITLE}
                description={DESCRIPTION}
                dropdown={<Range />}
                actions={<Actions />}
                className="w-page-header-frame shrink-0"
              />
            </Labelled>
            <Labelled label="One button, no search, read notifications">
              <PageHeader
                type="company"
                title={TITLE}
                description={DESCRIPTION}
                search={false}
                unread={false}
                actions={
                  <Button leadingIcon={<HeaderAddIcon />}>
                    Create Request
                  </Button>
                }
                className="w-page-header-frame shrink-0"
              />
            </Labelled>
            <Labelled label="Title only, nothing on the right, no divider">
              <PageHeader
                title={TITLE}
                search={false}
                notification={false}
                divider={false}
                className="w-page-header-frame shrink-0"
              />
            </Labelled>
            <Labelled label="Title only, an icon and a button on the right, no divider">
              <PageHeader
                title={TITLE}
                search={false}
                divider={false}
                actions={<Button leadingIcon={<HeaderAddIcon />}>Create Request</Button>}
                className="w-page-header-frame shrink-0"
              />
            </Labelled>
            <Labelled label="Heading only, no background">
              <PageHeader
                title={TITLE}
                search={false}
                notification={false}
                divider={false}
                background={false}
                className="w-page-header-frame shrink-0"
              />
            </Labelled>
            <Labelled label="Heading and a button on the right, no background">
              <PageHeader
                title={TITLE}
                search={false}
                notification={false}
                divider={false}
                background={false}
                actions={<Button leadingIcon={<HeaderAddIcon />}>Create Request</Button>}
                className="w-page-header-frame shrink-0"
              />
            </Labelled>
          </div>
        </div>
      </Group>
    </div>
  );
}
