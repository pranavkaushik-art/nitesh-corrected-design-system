"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { Avatar } from "@/components/ds/avatar";
import { Button } from "@/components/ds/button";
import { CompactButton } from "@/components/ds/compact-button";
import { HintText } from "@/components/ds/label";
import { LinkButton } from "@/components/ds/link-button";
import { ProgressBar } from "@/components/ds/progress-bar";
import { CheckCircleIcon, CloseIcon, DeleteIcon, ErrorIcon, InfoIcon, SpinnerIcon, UploadCloudIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The design system's File Upload, built from
 * design-system/components/file-upload.md (Nitesh's Figma "File Upload Area
 * [1.1]" 450:9413, "File Upload Cards [1.1]" 451:409, "File Format Icons
 * [1.1]" 450:17234 and "Image Upload [1.1]" 452:653).
 *
 * FileUploadArea   the box to drop files on or browse for them. onFiles,
 *                  accept, multiple, disabled, error (a message under it).
 *                  A file dragged over it shows the Hover look (page, Open).
 * FileUploadCard   one file: state progress | success | error, name, size,
 *                  progress (0 to 100, In Progress draws the Progress Bar),
 *                  onCancel, onRemove, onRetry.
 * FileUploadList   the Upload Area and its cards under it, 12 apart.
 * FileFormatIcon   the small page with the file type: size md 40 | xs 32,
 *                  color red | orange | green | blue | gray, label ("PDF").
 *                  fileFormatOf(name) picks both from a file name.
 * ImageUpload      a person's picture or a company's logo: type avatar |
 *                  company, align vertical | horizontal, src (uploaded),
 *                  onUpload, onRemove
 *
 * Yellow, Teal, Purple and Pink wait for their hues. Sizes are the tokens in
 * styles/sizes/file-upload.css.
 */

// ---- Format Icon ----

export type FileFormatColor = "red" | "orange" | "green" | "blue" | "gray";

/** The label's fill: each colour's state/<colour>/base. Written out so Tailwind sees them. */
const FORMAT_FILL: Record<FileFormatColor, string> = {
  red: "bg-state-error-base",
  orange: "bg-state-warning-base",
  green: "bg-state-success-base",
  blue: "bg-state-information-base",
  gray: "bg-state-faded-base",
};

const SHEETS = ["xls", "xlsx", "csv", "tsv", "numbers", "ods"];
const DOCUMENTS = ["doc", "docx", "txt", "md", "rtf", "pages", "odt"];
const IMAGES = ["png", "jpg", "jpeg", "gif", "svg", "webp", "heic", "avif"];

/** A file's label and colour, the page's proposal (Open): PDF Red,
 *  spreadsheets Green, documents Blue, images Orange, anything else Gray. */
export function fileFormatOf(name: string): { label: string; color: FileFormatColor } {
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
  const color: FileFormatColor =
    ext === "pdf" ? "red" : SHEETS.includes(ext) ? "green" : DOCUMENTS.includes(ext) ? "blue" : IMAGES.includes(ext) ? "orange" : "gray";
  return { label: (ext || "file").slice(0, 4).toUpperCase(), color };
}

export type FileFormatIconProps = Omit<React.ComponentProps<"span">, "children" | "color"> & {
  size?: "md" | "xs";
  color?: FileFormatColor;
  /** The file type, for example "PDF". */
  label: string;
};

/** The Medium drawing, on its 40 grid: a 32 x 40 page with corner 6 and a
 *  12 x 12 folded corner, its 1.5 edge drawn inside, 4 in from the left so
 *  the label can stand 4 outside it. */
function FormatPage() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className="absolute inset-space-0 size-full">
      <path
        d="M10 0.75H24L35.25 12V34A5.25 5.25 0 0 1 30 39.25H10A5.25 5.25 0 0 1 4.75 34V6A5.25 5.25 0 0 1 10 0.75Z"
        strokeWidth={1.5}
        strokeLinejoin="round"
        className="fill-bg-white-0 stroke-stroke-sub-300"
      />
      <path d="M24 0.75V12H35.25" strokeWidth={1.5} strokeLinejoin="round" className="stroke-stroke-sub-300" />
    </svg>
  );
}

export function FileFormatIcon({ size = "md", color = "gray", label, className, ...props }: FileFormatIconProps) {
  const drawing = (
    <span className={cn("relative flex size-file-upload-format shrink-0", size === "xs" && "origin-top-left scale-(--file-upload-format-xs-scale)")}>
      <FormatPage />
      <span
        className={cn(
          "absolute top-file-upload-format-label-top left-space-0 flex h-file-upload-format-label items-center rounded-file-upload-format-label px-file-upload-format-label-x py-file-upload-format-label-y",
          "text-subheading-2xs uppercase text-static-white",
          FORMAT_FILL[color],
        )}
      >
        {label}
      </span>
    </span>
  );
  return (
    <span role="img" aria-label={`${label} file`} className={cn("flex shrink-0", size === "xs" && "size-file-upload-format-xs", className)} {...props}>
      {drawing}
    </span>
  );
}

// ---- Upload Area ----

export type FileUploadAreaProps = Omit<React.ComponentProps<"div">, "title" | "onDrop" | "children"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  buttonLabel?: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onFiles?: (files: File[]) => void;
  /** A message under the area in the Hint Text's Error look (a file too big, the wrong type). */
  error?: React.ReactNode;
  "data-force"?: "hover" | "focus";
};

export function FileUploadArea({
  title = "Choose a file or drag & drop it here.",
  description = "JPEG, PNG, PDF, and MP4 formats, up to 50 MB.",
  buttonLabel = "Browse File",
  accept,
  multiple,
  disabled,
  onFiles,
  error,
  className,
  "data-force": force,
  ...props
}: FileUploadAreaProps) {
  const input = React.useRef<HTMLInputElement>(null);
  const errorId = React.useId();
  const [dragging, setDragging] = React.useState(false);
  const browse = () => !disabled && input.current?.click();

  const onDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  };
  const onLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only when the file leaves the area, not when it moves over a child.
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles?.(multiple ? files : files.slice(0, 1));
  };

  return (
    <div className={cn("flex w-full flex-col gap-file-upload-area-hint-gap", className)} {...props}>
      <div
        data-force={force}
        data-dragging={dragging || undefined}
        onClick={browse}
        onDragEnter={onDrag}
        onDragOver={onDrag}
        onDragLeave={onLeave}
        onDrop={onDrop}
        className={cn(
          "ds-shadow relative flex w-full flex-col items-center gap-file-upload-area-gap rounded-file-upload-area p-file-upload-area-pad text-center",
          "transition-[background-color,box-shadow] duration-150",
          // Keyboard focus lands on the file input inside; the area shows the ring.
          "ds-focus:ring-focus-neutral has-[input:focus-visible]:ring-focus-neutral",
          disabled ? "cursor-not-allowed bg-bg-weak-50" : "cursor-pointer bg-bg-white-0 ds-hover:bg-bg-weak-50 data-dragging:bg-bg-weak-50",
        )}
      >
        {/* The dashed edge, 5 on and 5 off, which a CSS border cannot set (page, "In code"). */}
        <svg aria-hidden className="pointer-events-none absolute inset-space-0 size-full overflow-visible">
          <rect
            x="0.5"
            y="0.5"
            style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
            strokeWidth={1}
            className="fill-none stroke-stroke-sub-300 [rx:var(--file-upload-area-dash-corner)] [stroke-dasharray:var(--file-upload-area-dash)]"
          />
        </svg>
        <span aria-hidden className={cn("relative flex [&_svg]:size-file-upload-area-icon", disabled ? "text-icon-disabled-300" : "text-icon-sub-600")}>
          <UploadCloudIcon />
        </span>
        <div className="relative flex flex-col gap-file-upload-area-words-gap">
          <p className={cn("m-0 text-label-sm", disabled ? "text-text-disabled-300" : "text-text-strong-950")}>{title}</p>
          <p className={cn("m-0 text-paragraph-xs", disabled ? "text-text-disabled-300" : "text-text-sub-600")}>{description}</p>
        </div>
        {/* The input is the keyboard's way in, so the button stays out of the tab order. */}
        <Button
          tone="neutral"
          variant="stroke"
          size="xs"
          tabIndex={-1}
          disabled={disabled}
          className="relative"
          onClick={(e) => {
            e.stopPropagation();
            browse();
          }}
        >
          {buttonLabel}
        </Button>
        <input
          ref={input}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-label={typeof title === "string" ? title : "Choose a file"}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className="sr-only"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) onFiles?.(files);
            e.target.value = "";
          }}
        />
      </div>
      {error && (
        <HintText id={errorId} state="error" icon={<InfoIcon />}>
          {error}
        </HintText>
      )}
    </div>
  );
}

// ---- Upload Card ----

export type FileUploadCardState = "progress" | "success" | "error";

const STATUS_WORD: Record<FileUploadCardState, string> = {
  progress: "Uploading...",
  success: "Completed",
  error: "Failed",
};

/** The status icons, 16 x 16: a spinner; Hugeicons' tick in a circle and
 *  warning circle, filled, with the mark cut out in white. */
function StatusIcon({ state }: { state: FileUploadCardState }) {
  if (state === "progress") {
    return (
      <span aria-hidden className="flex size-file-upload-card-status-icon shrink-0 text-primary-base [&_svg]:size-full motion-safe:[&_svg]:animate-spin">
        <SpinnerIcon />
      </span>
    );
  }
  if (state === "success") {
    return (
      <span
        aria-hidden
        className="flex size-file-upload-card-status-icon shrink-0 text-state-success-base [&_svg]:size-full [&_path:first-child]:fill-current [&_path:last-child]:text-static-white"
      >
        <CheckCircleIcon />
      </span>
    );
  }
  return (
    <span aria-hidden className="flex size-file-upload-card-status-icon shrink-0 text-state-error-base [&_svg]:size-full [&_circle]:fill-current [&_path]:text-static-white">
      <ErrorIcon />
    </span>
  );
}

export type FileUploadCardProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The file's name. */
  name: string;
  /** The size line, for example "0 KB of 120 KB". */
  size: React.ReactNode;
  state?: FileUploadCardState;
  /** The Format Icon's label and colour; from the name unless set. */
  format?: { label: string; color: FileFormatColor };
  /** In Progress: how far the upload has got, 0 to 100, shown on the Progress Bar. */
  progress?: number;
  /** The status word; "Uploading...", "Completed" or "Failed" unless set. */
  status?: React.ReactNode;
  /** In Progress: the close button stops the upload. */
  onCancel?: () => void;
  /** Success and Error: the bin removes the file. */
  onRemove?: () => void;
  /** Error: "Try Again". */
  onRetry?: () => void;
};

export function FileUploadCard({
  name,
  size,
  state = "progress",
  format,
  progress,
  status,
  onCancel,
  onRemove,
  onRetry,
  className,
  ...props
}: FileUploadCardProps) {
  const f = format ?? fileFormatOf(name);
  return (
    <div
      className={cn(
        "ds-shadow flex w-full flex-col gap-file-upload-card-gap rounded-file-upload-card bg-bg-white-0 pt-file-upload-card-top pr-file-upload-card-right pb-file-upload-card-bottom pl-file-upload-card-left",
        state === "error" ? "edge-state-error-base" : "edge-stroke-soft-200",
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-file-upload-card-row-gap">
        <FileFormatIcon label={f.label} color={f.color} />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-file-upload-card-retry-gap">
          <div className="flex w-full min-w-0 flex-col gap-file-upload-card-words-gap">
            <p className="m-0 truncate text-label-sm text-text-strong-950">{name}</p>
            <p className="m-0 flex items-center gap-file-upload-card-line-gap text-paragraph-xs">
              <span className="text-text-sub-600">{size}</span>
              <span aria-hidden className="text-text-sub-600">
                ∙
              </span>
              <span role="status" className="flex items-center gap-file-upload-card-status-gap text-text-strong-950">
                <StatusIcon state={state} />
                {status ?? STATUS_WORD[state]}
              </span>
            </p>
          </div>
          {state === "error" && (
            <LinkButton variant="error" size="md" underline onClick={onRetry}>
              Try Again
            </LinkButton>
          )}
        </div>
        {state === "progress" ? (
          <CompactButton variant="ghost" size="lg" aria-label={`Stop uploading ${name}`} onClick={onCancel}>
            <CloseIcon />
          </CompactButton>
        ) : (
          <CompactButton
            variant={state === "error" ? "modifiable" : "ghost"}
            size="lg"
            aria-label={`Remove ${name}`}
            onClick={onRemove}
            className={state === "error" ? "text-state-error-base" : undefined}
          >
            <DeleteIcon />
          </CompactButton>
        )}
      </div>
      {/* The Progress Bar, Blue: state/information/base as the Figma. The page's
          proposal (primary/base) waits on the Progress Bar page's own Open. */}
      {state === "progress" && <ProgressBar value={progress ?? 0} aria-label={`Uploading ${name}`} />}
    </div>
  );
}

/** The Upload Area, then its cards under it, 12 apart (the Figma's Blocks frame). */
export function FileUploadList({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex w-full flex-col gap-file-upload-cards-gap", className)} {...props} />;
}

// ---- Image Upload ----

/** The company placeholder: two white buildings on a grey circle, the front
 *  one at 80%, their windows in the circle's grey. */
function CompanyPlaceholder() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="size-full">
      <circle cx="32" cy="32" r="32" className="fill-bg-soft-200" />
      <rect x="30" y="17" width="15" height="29" rx="1.5" className="fill-static-white" />
      <g className="fill-bg-soft-200">
        <rect x="33.5" y="21" width="3" height="3" rx="0.5" />
        <rect x="38.5" y="21" width="3" height="3" rx="0.5" />
        <rect x="33.5" y="27" width="3" height="3" rx="0.5" />
        <rect x="38.5" y="27" width="3" height="3" rx="0.5" />
        <rect x="38.5" y="33" width="3" height="3" rx="0.5" />
      </g>
      <rect x="19" y="27" width="15" height="19" rx="1.5" className="fill-static-white" fillOpacity={0.8} />
      <g className="fill-bg-soft-200">
        <rect x="22.5" y="31" width="3" height="3" rx="0.5" />
        <rect x="27.5" y="31" width="3" height="3" rx="0.5" />
        <rect x="22.5" y="37" width="3" height="3" rx="0.5" />
        <rect x="27.5" y="37" width="3" height="3" rx="0.5" />
      </g>
    </svg>
  );
}

export type ImageUploadProps = Omit<React.ComponentProps<"div">, "title" | "children"> & {
  type?: "avatar" | "company";
  /** Vertical: the picture, the words, the buttons. Horizontal: the picture and the buttons. */
  align?: "vertical" | "horizontal";
  /** The uploaded picture. None is Empty (Upload); one is Uploaded (Remove and Change). */
  src?: string;
  alt?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  accept?: string;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
};

export function ImageUpload({
  type = "avatar",
  align = "vertical",
  src,
  alt,
  title = "Upload Image",
  description = "Min 400x400px, PNG or JPEG",
  accept = "image/png, image/jpeg",
  onUpload,
  onRemove,
  className,
  ...props
}: ImageUploadProps) {
  const input = React.useRef<HTMLInputElement>(null);
  const vertical = align === "vertical";
  const pictureSize = vertical ? "size-file-upload-image-vertical" : "size-file-upload-image-horizontal";

  const picture =
    type === "avatar" ? (
      <Avatar size={vertical ? "64" : "56"} src={src} alt={alt ?? (src ? "Your picture" : undefined)} />
    ) : (
      <AvatarPrimitive.Root className={cn("flex shrink-0 overflow-hidden rounded-file-upload-image", pictureSize)}>
        {src && <AvatarPrimitive.Image src={src} alt={alt ?? "Company logo"} className="size-full object-cover" />}
        <AvatarPrimitive.Fallback className="flex size-full">
          <CompanyPlaceholder />
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );

  const buttons = (
    <div className="flex items-center gap-file-upload-image-buttons-gap">
      {src ? (
        <>
          <Button tone="error" variant="stroke" size="xs" onClick={onRemove}>
            Remove
          </Button>
          <Button tone="neutral" variant="stroke" size="xs" onClick={() => input.current?.click()}>
            Change
          </Button>
        </>
      ) : (
        <Button tone="neutral" variant="stroke" size="xs" onClick={() => input.current?.click()}>
          Upload
        </Button>
      )}
      <input
        ref={input}
        type="file"
        accept={accept}
        tabIndex={-1}
        aria-hidden
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload?.(file);
          e.target.value = "";
        }}
      />
    </div>
  );

  return (
    <div
      className={cn("flex gap-file-upload-image-gap", vertical ? "flex-col items-start" : "flex-row items-center", className)}
      {...props}
    >
      {picture}
      {vertical ? (
        <div className="flex flex-col items-start gap-file-upload-image-buttons-top">
          <div className="flex flex-col gap-file-upload-image-words-gap">
            <p className="m-0 text-label-md text-text-strong-950">{title}</p>
            <p className="m-0 text-paragraph-sm text-text-sub-600">{description}</p>
          </div>
          {buttons}
        </div>
      ) : (
        buttons
      )}
    </div>
  );
}
