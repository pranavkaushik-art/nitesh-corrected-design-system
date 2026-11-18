"use client";

import { useEffect, useRef, useState } from "react";

import {
  FileFormatIcon,
  FileUploadArea,
  FileUploadCard,
  FileUploadList,
  ImageUpload,
  fileFormatOf,
  type FileFormatColor,
  type FileUploadCardState,
} from "@/components/ds/file-upload";
import { Group, Labelled } from "../parts";

const COLORS: { id: FileFormatColor; label: string }[] = [
  { id: "red", label: "Red" },
  { id: "orange", label: "Orange" },
  { id: "green", label: "Green" },
  { id: "blue", label: "Blue" },
  { id: "gray", label: "Gray" },
];

const AREA_STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover, and a file dragged over it" },
  { id: "focus", label: "Focus (proposed)" },
  { id: "disabled", label: "Disabled (proposed)" },
  { id: "error", label: "Error (proposed)" },
] as const;

/** A file's size as the card writes it: KB under a megabyte, MB above. */
const sizeOf = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const LIMIT = 50 * 1024 * 1024; // the area's "up to 50 MB"

type Upload = { id: number; name: string; size: number; done: number; state: FileUploadCardState };

/** Drop or browse files: each gets a card that uploads for a moment, its
 *  Progress Bar filling. A file over 50 MB fails half way, and the area
 *  says why until its card is removed. */
function TryIt() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const next = useRef(0);
  const uploading = uploads.some((u) => u.state === "progress");

  useEffect(() => {
    if (!uploading) return;
    const tick = window.setInterval(() => {
      setUploads((all) =>
        all.map((u) => {
          if (u.state !== "progress") return u;
          const done = Math.min(1, u.done + 0.08);
          if (u.size > LIMIT && done >= 0.5) return { ...u, done, state: "error" };
          return done >= 1 ? { ...u, done: 1, state: "success" } : { ...u, done };
        }),
      );
    }, 150);
    return () => window.clearInterval(tick);
  }, [uploading]);

  const add = (files: File[]) => {
    const added = files.map((f) => ({ id: next.current++, name: f.name, size: f.size, done: 0, state: "progress" as const }));
    setUploads((all) => [...all, ...added]);
  };
  const remove = (id: number) => setUploads((all) => all.filter((u) => u.id !== id));
  const retry = (id: number) => setUploads((all) => all.map((u) => (u.id === id ? { ...u, done: 0, state: "progress" } : u)));
  const failed = uploads.find((u) => u.state === "error");

  return (
    <div className="flex w-file-upload-figma max-w-full flex-col">
      <FileUploadList>
        <FileUploadArea multiple onFiles={add} error={failed ? `${failed.name} is over 50 MB.` : undefined} />
        {uploads.map((u) => (
          <FileUploadCard
            key={u.id}
            name={u.name}
            size={`${sizeOf(u.size * u.done)} of ${sizeOf(u.size)}`}
            state={u.state}
            progress={u.done * 100}
            onCancel={() => remove(u.id)}
            onRemove={() => remove(u.id)}
            onRetry={() => retry(u.id)}
          />
        ))}
      </FileUploadList>
    </div>
  );
}

function ImageTry({ type, align }: { type: "avatar" | "company"; align: "vertical" | "horizontal" }) {
  const [src, setSrc] = useState<string>();
  useEffect(() => () => void (src && URL.revokeObjectURL(src)), [src]);
  return <ImageUpload type={type} align={align} src={src} onUpload={(f) => setSrc(URL.createObjectURL(f))} onRemove={() => setSrc(undefined)} />;
}

export function FileUploadSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <div className="text-paragraph-xs text-text-soft-400">
        Yellow, Teal, Purple and Pink Format Icons wait for their hues. The progress bar is the Progress Bar&apos;s Blue
        (state/information/base); which blue it takes is settled on the Progress Bar&apos;s page.
      </div>

      <Group label="Try it: drop files on the area, or browse">
        <TryIt />
      </Group>

      <Group label="Upload Area, every state">
        <div className="flex flex-wrap items-start gap-space-24">
          {AREA_STATES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              {/* The Figma's 400: on a wrapper, since the area's own w-full would win. */}
              <div className="w-file-upload-figma max-w-full">
                <FileUploadArea
                  data-force={s.id === "hover" || s.id === "focus" ? s.id : undefined}
                  disabled={s.id === "disabled"}
                  error={s.id === "error" ? "This file is over 50 MB." : undefined}
                />
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Upload Card: In Progress, Success, Error">
        <div className="flex w-file-upload-figma max-w-full flex-col gap-space-24">
          <Labelled label="In Progress">
            <FileUploadCard name="Quarterly report.pdf" size="48 KB of 120 KB" state="progress" progress={40} />
          </Labelled>
          <Labelled label="Success">
            <FileUploadCard name="Quarterly report.pdf" size="120 KB of 120 KB" state="success" />
          </Labelled>
          <Labelled label="Error">
            <FileUploadCard name="Quarterly report.pdf" size="0 KB of 120 KB" state="error" />
          </Labelled>
          <Labelled label="A long name runs to one line">
            <FileUploadCard name="Board pack, quarterly results and forecast, final version.pdf" size="2.4 MB of 2.4 MB" state="success" />
          </Labelled>
        </div>
      </Group>

      <Group label="Upload Area with its cards, 12 apart">
        <div className="flex w-file-upload-figma max-w-full flex-col">
          <FileUploadList>
            <FileUploadArea />
            <FileUploadCard name="Budget 2026.xlsx" size="64 KB of 160 KB" state="progress" progress={40} />
            <FileUploadCard name="Team photo.png" size="820 KB of 820 KB" state="success" />
            <FileUploadCard name="Launch video.mp4" size="32.0 MB of 64.0 MB" state="error" />
          </FileUploadList>
        </div>
      </Group>

      <Group label="Format Icon, every colour, Medium 40 and X-Small 32">
        <div className="flex flex-col gap-space-16">
          {(["md", "xs"] as const).map((size) => (
            <div key={size} className="flex flex-wrap items-end gap-space-24">
              {COLORS.map((c) => (
                <Labelled key={c.id} label={`${c.label}, ${size === "md" ? "Medium" : "X-Small"}`}>
                  <FileFormatIcon size={size} color={c.id} label="PDF" />
                </Labelled>
              ))}
            </div>
          ))}
        </div>
      </Group>

      <Group label="Format Icon by file type (the page's proposal)">
        <div className="flex flex-wrap items-end gap-space-24">
          {["Report.pdf", "Budget.xlsx", "Notes.docx", "Photo.png", "Archive.zip"].map((name) => {
            const f = fileFormatOf(name);
            return (
              <Labelled key={name} label={name}>
                <FileFormatIcon label={f.label} color={f.color} />
              </Labelled>
            );
          })}
        </div>
      </Group>

      <Group label="Image Upload, every type, alignment and state (the photos are stand-ins)">
        <div className="grid grid-cols-[repeat(4,max-content)] items-start gap-x-space-40 gap-y-space-24">
          {(["avatar", "company"] as const).map((type) =>
            (["vertical", "horizontal"] as const).map((align) =>
              [false, true].map((uploaded) => (
                <Labelled
                  key={`${type}-${align}-${uploaded}`}
                  label={`${type === "avatar" ? "Avatar" : "Company"}, ${align === "vertical" ? "Vertical" : "Horizontal"}, ${uploaded ? "Uploaded" : "Empty"}`}
                >
                  <ImageUpload type={type} align={align} src={uploaded ? (type === "avatar" ? "/8bit-sharp-logo.png" : "/brand/microsoft.svg") : undefined} />
                </Labelled>
              )),
            ),
          )}
        </div>
      </Group>

      <Group label="Try it: upload a picture">
        <div className="flex flex-wrap items-start gap-space-40">
          <ImageTry type="avatar" align="vertical" />
          <ImageTry type="company" align="horizontal" />
        </div>
      </Group>
    </div>
  );
}
