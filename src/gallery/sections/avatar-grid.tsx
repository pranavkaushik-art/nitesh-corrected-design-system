"use client";

import { Avatar, type AvatarColor, type AvatarSize } from "@/components/ds/avatar";

/**
 * Nitesh's Figma "Avatar [1.1]" (node 174787:51592), laid out as drawn: for
 * each size, the twelve personas across and the six styles down (Image,
 * Solid BG, Memoji, Illustration, Text, Icon), 48 apart both ways. Each size
 * keeps its label above, as the rest of the Components page does.
 *
 * The pictures are the Figma's own, exported and cut to 160 px (2x the
 * largest avatar) in public/avatars. The letters are the Figma's, as drawn.
 * Kumar's and Wei's pictures sit on the Figma's slate/200, which has no
 * token; they take Gray (gray/200), one step lighter.
 */

const SIZES: AvatarSize[] = ["80", "72", "64", "56", "48", "40", "32", "24", "20"];

type Persona = { name: string; slug: string; initials: string; color: AvatarColor };

const PERSONAS: Persona[] = [
  { name: "Kumar Sidhartha", slug: "kumar-sidhartha", initials: "JB", color: "gray" },
  { name: "Erik Cofield", slug: "erik-cofield", initials: "SW", color: "yellow" },
  { name: "Audree Grubesic", slug: "audree-grubesic", initials: "AT", color: "spirit" },
  { name: "Sneha Kumari", slug: "sneha-kumari", initials: "EW", color: "sky" },
  { name: "Matthew Johnson", slug: "matthew-johnson", initials: "MJ", color: "purple" },
  { name: "Laura Perez", slug: "laura-perez", initials: "LP", color: "red" },
  { name: "Wei Chen", slug: "wei-chen", initials: "WC", color: "gray" },
  { name: "Lena Müller", slug: "lena-muller", initials: "LM", color: "spirit" },
  { name: "Juma Omondi", slug: "juma-omondi", initials: "JO", color: "yellow" },
  { name: "Natalia Nowak", slug: "natalia-nowak", initials: "NN", color: "sky" },
  { name: "Ravi Patel", slug: "ravi-patel", initials: "RP", color: "purple" },
  { name: "Nuray Aksoy", slug: "nuray-aksoy", initials: "NA", color: "red" },
];

type Style = "image" | "solid" | "memoji" | "illustration" | "text" | "icon";
const STYLES: { id: Style; label: string }[] = [
  { id: "image", label: "Image" },
  { id: "solid", label: "Solid BG" },
  { id: "memoji", label: "Memoji" },
  { id: "illustration", label: "Illustration" },
  { id: "text", label: "Text" },
  { id: "icon", label: "Icon" },
];

function One({ persona: p, style, size }: { persona: Persona; style: Style; size: AvatarSize }) {
  if (style === "text") return <Avatar size={size} initials={p.initials} alt={p.name} color={p.color} />;
  // No name and no picture: the placeholder person on the persona's colour.
  if (style === "icon") return <Avatar size={size} alt={p.name} color={p.color} />;
  return <Avatar size={size} src={`/avatars/${p.slug}-${style}.png`} alt={p.name} color={p.color} />;
}

export function AvatarFigmaGrid() {
  return (
    <div className="flex flex-col gap-space-40">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col gap-space-12">
          <span className="text-paragraph-xs text-text-soft-400">{size}</span>
          {/* 12 across at 80 is 1488 wide: the block scrolls sideways. */}
          <div className="overflow-x-auto pb-space-4">
            <div className="flex w-max flex-col gap-space-48">
              {STYLES.map((st) => (
                <div key={st.id} className="flex gap-space-48" aria-label={`${st.label}, ${size}`}>
                  {PERSONAS.map((p) => (
                    <One key={p.slug} persona={p} style={st.id} size={size} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
