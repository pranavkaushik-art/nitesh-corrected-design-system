"use client";

import {
  Avatar,
  AvatarGroup,
  CompactAvatarGroup,
  type AvatarBottomMarkType,
  type AvatarColor,
  type AvatarSize,
  type AvatarTopMarkType,
} from "@/components/ds/avatar";
import { Group, Labelled } from "../parts";
import { AvatarFigmaGrid } from "./avatar-grid";

const SIZES: AvatarSize[] = ["80", "72", "64", "56", "48", "40", "32", "24", "20"];
const COLORS: { id: AvatarColor; label: string }[] = [
  { id: "gray", label: "Gray" },
  { id: "blue", label: "Blue" },
  { id: "red", label: "Red" },
  { id: "yellow", label: "Yellow" },
  { id: "purple", label: "Purple" },
  { id: "sky", label: "Sky" },
  { id: "spirit", label: "Spirit" },
];
const TOP_MARKS: { id: AvatarTopMarkType; label: string }[] = [
  { id: "favorite", label: "Favorite" },
  { id: "add", label: "Add" },
  { id: "remove", label: "Remove" },
  { id: "notification", label: "Notification" },
];
const BOTTOM_MARKS: { id: AvatarBottomMarkType; label: string }[] = [
  { id: "online", label: "Online" },
  { id: "offline", label: "Offline" },
  { id: "busy", label: "Busy" },
];
const PEOPLE = ["Nitesh Arora", "Maya Chen", "Sam Okafor", "Lena Fischer"];
/** The Figma's Avatar Group (node 581:6198): the first four personas, their
 *  Illustration pictures on their colours. */
const GROUP_PEOPLE: { name: string; slug: string; color: AvatarColor }[] = [
  { name: "Kumar Sidhartha", slug: "kumar-sidhartha", color: "gray" },
  { name: "Erik Cofield", slug: "erik-cofield", color: "yellow" },
  { name: "Audree Grubesic", slug: "audree-grubesic", color: "spirit" },
  { name: "Sneha Kumari", slug: "sneha-kumari", color: "sky" },
];

/* eslint-disable @next/next/no-img-element */
const companyLogo = <img src="/brand/microsoft.svg" alt="Microsoft" />;

export function AvatarSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Every size: 12 personas across, Image, Solid BG, Memoji, Illustration, Text and Icon down, as the Figma draws it">
        <AvatarFigmaGrid />
      </Group>

      <Group label="Colours, behind initials and the placeholder">
        <div className="flex flex-wrap items-end gap-space-24">
          {COLORS.map((c) => (
            <Labelled key={c.id} label={c.label}>
              <div className="flex items-center gap-space-12">
                <Avatar size="56" name="Maya Chen" color={c.id} />
                <Avatar size="56" color={c.id} />
                <Avatar size="40" name="Maya Chen" color={c.id} />
                <Avatar size="40" color={c.id} />
              </div>
            </Labelled>
          ))}
          <Labelled label="Colour picked from the name">
            <div className="flex items-center gap-space-12">
              {PEOPLE.map((name) => (
                <Avatar key={name} size="40" name={name} />
              ))}
            </div>
          </Labelled>
        </div>
      </Group>

      <Group label="Top marks, every size">
        <div className="flex flex-col gap-space-16">
          {TOP_MARKS.map((m) => (
            <div key={m.id} className="flex flex-wrap items-end gap-space-24">
              {SIZES.map((size) => (
                <Labelled key={size} label={`${m.label}, ${size}`}>
                  <Avatar size={size} name="Sam Okafor" color="gray" topMark={m.id} />
                </Labelled>
              ))}
            </div>
          ))}
        </div>
      </Group>

      <Group label="Bottom marks, every size">
        <div className="flex flex-col gap-space-16">
          {BOTTOM_MARKS.map((m) => (
            <div key={m.id} className="flex flex-wrap items-end gap-space-24">
              {SIZES.map((size) => (
                <Labelled key={size} label={`${m.label}, ${size}`}>
                  <Avatar size={size} name="Lena Fischer" color="red" bottomMark={m.id} />
                </Labelled>
              ))}
            </div>
          ))}
          <div className="flex flex-wrap items-end gap-space-24">
            {SIZES.map((size) => (
              <Labelled key={size} label={`Company, ${size}`}>
                <Avatar size={size} name="Lena Fischer" color="blue" company={companyLogo} />
              </Labelled>
            ))}
          </div>
          <Labelled label="Both corners">
            <Avatar size="56" name="Nitesh Arora" color="blue" topMark="notification" bottomMark="online" />
          </Labelled>
        </div>
      </Group>

      <Group label="Avatar Group, every size, with the count">
        <div className="flex flex-col gap-space-16">
          {SIZES.map((size) => (
            <Labelled key={size} label={size}>
              <AvatarGroup size={size} more={9}>
                {GROUP_PEOPLE.map((p) => (
                  <Avatar key={p.slug} src={`/avatars/${p.slug}-illustration.png`} alt={p.name} color={p.color} />
                ))}
              </AvatarGroup>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Compact Avatar Group">
        {/* On bg/weak-50, as the Figma frames it (Compact Avatar Group [1.1],
            dark 175323:181703: #262626, 24 in and 24 apart), so the pill's
            own bg/white-0 shows against it. */}
        <div className="grid w-fit grid-cols-[repeat(3,max-content)] items-end gap-space-24 bg-bg-weak-50 p-space-24">
          {(["default", "stroke"] as const).map((variant) =>
            (["40", "32", "24"] as const).map((size) => (
              <Labelled key={`${variant}-${size}`} label={`${variant === "default" ? "Default" : "Stroke"}, ${size}`}>
                <CompactAvatarGroup size={size} variant={variant} more={4}>
                  {GROUP_PEOPLE.slice(0, 3).map((p) => (
                    <Avatar key={p.slug} src={`/avatars/${p.slug}-illustration.png`} alt={p.name} color={p.color} />
                  ))}
                </CompactAvatarGroup>
              </Labelled>
            )),
          )}
        </div>
      </Group>
    </div>
  );
}
