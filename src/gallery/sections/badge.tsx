"use client";

import { Badge, BadgeFlashlightIcon, StatusBadge, type BadgeColor, type BadgeVariant, type StatusBadgeStatus } from "@/components/ds/badge";
import { Group, Labelled } from "../parts";

const VARIANTS: { id: BadgeVariant; label: string }[] = [
  { id: "filled", label: "Filled" },
  { id: "light", label: "Light" },
  { id: "lighter", label: "Lighter" },
  { id: "stroke", label: "Stroke" },
];
const COLORS: { id: BadgeColor; label: string }[] = [
  { id: "gray", label: "Gray" },
  { id: "blue", label: "Blue" },
  { id: "orange", label: "Orange" },
  { id: "red", label: "Red" },
  { id: "green", label: "Green" },
  { id: "yellow", label: "Yellow" },
  { id: "purple", label: "Purple" },
  { id: "sky", label: "Sky" },
  { id: "pink", label: "Pink" },
  { id: "teal", label: "Teal" },
];
const SIZES = [
  { id: "md", label: "Medium 20" },
  { id: "sm", label: "Small 16" },
] as const;
const TYPES = ["Basic", "With Dot", "Left Icon", "Right Icon", "Number"];

const STATUSES: StatusBadgeStatus[] = ["completed", "pending", "failed", "information", "disabled"];

/** One row of a colour: every type at one size. */
function BadgeRow({ variant, color, size, disabled }: { variant: BadgeVariant; color: BadgeColor; size: "sm" | "md"; disabled?: boolean }) {
  const common = { variant, color, size, disabled };
  return (
    <>
      <Badge {...common}>Badge</Badge>
      <Badge {...common} dot>
        Badge
      </Badge>
      <Badge {...common} leadingIcon={<BadgeFlashlightIcon />}>
        Badge
      </Badge>
      <Badge {...common} trailingIcon={<BadgeFlashlightIcon />}>
        Badge
      </Badge>
      <Badge {...common} number>
        8
      </Badge>
    </>
  );
}

function TypeHeader() {
  return (
    <>
      <span />
      {SIZES.map((s) =>
        TYPES.map((t) => (
          <span key={`${s.id}-${t}`} className="text-paragraph-xs text-text-soft-400">
            {t}, {s.id === "md" ? "20" : "16"}
          </span>
        )),
      )}
    </>
  );
}

export function BadgeSection() {
  return (
    <div className="flex flex-col gap-space-40">
      {VARIANTS.map((v) => (
        <Group key={v.id} label={`Badge, ${v.label}: Medium 20 then Small 16, every colour and type`}>
          <div className="grid grid-cols-[repeat(11,max-content)] items-center justify-items-start gap-x-space-16 gap-y-space-12">
            <TypeHeader />
            {COLORS.map((c) => (
              <div key={c.id} className="contents">
                <span className="text-paragraph-xs text-text-soft-400">{c.label}</span>
                {SIZES.map((s) => (
                  <BadgeRow key={s.id} variant={v.id} color={c.id} size={s.id} />
                ))}
              </div>
            ))}
          </div>
        </Group>
      ))}

      <Group label="Badge, Disabled (the same for every colour and style)">
        <div className="grid grid-cols-[repeat(11,max-content)] items-center justify-items-start gap-x-space-16 gap-y-space-12">
          <TypeHeader />
          <span className="text-paragraph-xs text-text-soft-400">Disabled</span>
          {SIZES.map((s) => (
            <BadgeRow key={s.id} variant="filled" color="blue" size={s.id} disabled />
          ))}
        </div>
      </Group>

      {(["light", "stroke"] as const).map((variant) => (
        <Group key={variant} label={`Status Badge, ${variant === "light" ? "Light" : "Stroke"}`}>
          <div className="flex flex-col gap-space-12">
            {(["dot", "icon"] as const).map((mark) => (
              <div key={mark} className="flex flex-wrap items-end gap-space-24">
                {STATUSES.map((status) => (
                  <Labelled key={status} label={mark === "dot" ? "With a dot" : "With its icon"}>
                    <StatusBadge status={status} variant={variant} mark={mark} />
                  </Labelled>
                ))}
              </div>
            ))}
          </div>
        </Group>
      ))}
    </div>
  );
}
