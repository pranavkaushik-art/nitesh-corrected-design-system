"use client";

import { useState } from "react";

import { Button } from "@/components/ds/button";
import { CheckboxLabel } from "@/components/ds/checkbox";
import { LinkButton } from "@/components/ds/link-button";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalBox,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  StatusModalContent,
  type ModalFooterType,
  type ModalHeaderType,
  type ModalStatus,
  type ModalWidth,
} from "@/components/ds/modal";
import { StepperDot } from "@/components/ds/step-indicator";
import { SwitchLabel } from "@/components/ds/switch";
import { TextInput } from "@/components/ds/text-input";
import { MailIcon, SettingsIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const HEADER_TYPES: { id: ModalHeaderType; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "left-icon", label: "Left Icon" },
  { id: "error", label: "Error" },
  { id: "warning", label: "Warning" },
  { id: "success", label: "Success" },
  { id: "information", label: "Information" },
];
const STATUSES: { id: ModalStatus; label: string; title: string; description: string }[] = [
  { id: "error", label: "Error", title: "Payment failed", description: "We could not charge your card. Check its details and try again." },
  { id: "warning", label: "Warning", title: "Delete this workspace?", description: "Its runs and files go with it. This cannot be undone." },
  { id: "success", label: "Success", title: "Invite sent", description: "Ana will get an email with a link to join the workspace." },
  { id: "information", label: "Information", title: "New version ready", description: "Reload the page to get the latest changes to the editor." },
];
const WIDTHS: { id: ModalWidth; label: string }[] = [
  { id: "sm", label: "Small 400 (the default)" },
  { id: "md", label: "Medium 440" },
  { id: "lg", label: "Large 480" },
];

/** The left part of each footer type. */
function footerLeading(type: ModalFooterType) {
  switch (type) {
    case "checkbox":
      return <CheckboxLabel label="Don't show it again" />;
    case "information":
      return "Changes save for everyone.";
    case "toggle":
      return <SwitchLabel label="Notify the team" />;
    case "stepper":
      return <StepperDot size="sm" count={3} current={0} />;
    case "link-button":
      return (
        <LinkButton variant="gray" size="md" underline>
          Learn more
        </LinkButton>
      );
    default:
      return undefined;
  }
}

const FOOTER_TYPES: { id: ModalFooterType; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "checkbox", label: "Checkbox" },
  { id: "information", label: "Information" },
  { id: "toggle", label: "Toggle" },
  { id: "stepper", label: "Stepper" },
  { id: "link-button", label: "Link Button" },
  { id: "stretch", label: "Stretch" },
];

const BODY = (
  <p className="m-0 text-paragraph-sm text-text-sub-600">
    Everyone you invite can open the workspace&apos;s chats, runs and files. You can change what they can do later.
  </p>
);

export function ModalSection() {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Try it: open a real modal (Escape or a click on the backdrop closes it)">
        <div className="flex flex-wrap gap-space-12">
          <Modal open={inviteOpen} onOpenChange={setInviteOpen}>
            <ModalTrigger asChild>
              <Button>Invite people</Button>
            </ModalTrigger>
            <ModalContent width="sm">
              <ModalHeader type="left-icon" icon={<MailIcon />} title="Invite people" description="They join as members of this workspace." />
              <ModalBody>
                <TextInput label="Email" type="email" placeholder="ana@8bit.ai" />
                {BODY}
              </ModalBody>
              <ModalFooter type="checkbox" leading={<CheckboxLabel label="Don't show it again" />} confirm="Send invite" onConfirm={() => setInviteOpen(false)} />
            </ModalContent>
          </Modal>

          <Modal>
            <ModalTrigger asChild>
              <Button tone="neutral" variant="stroke">
                Long modal
              </Button>
            </ModalTrigger>
            <ModalContent width="lg">
              <ModalHeader type="information" title="Release notes" description="What changed in October." />
              <ModalBody>
                {Array.from({ length: 14 }, (_, i) => (
                  <p key={i} className="m-0 text-paragraph-sm text-text-sub-600">
                    Runs now show their steps as they happen, and a failed step says why it failed and how to fix it.
                  </p>
                ))}
              </ModalBody>
              <ModalFooter type="stretch" cancel="Close" confirm="Got it" />
            </ModalContent>
          </Modal>

          {STATUSES.map((s, i) => (
            <Modal key={s.id}>
              <ModalTrigger asChild>
                <Button tone="neutral" variant="stroke">
                  {s.label}
                </Button>
              </ModalTrigger>
              <ModalContent width="md">
                <StatusModalContent type={s.id} alignment={i % 2 === 0 ? "horizontal" : "vertical"} title={s.title} description={s.description} />
                <ModalFooter type="checkbox" leading={<CheckboxLabel label="Don't show it again" />} />
              </ModalContent>
            </Modal>
          ))}
        </div>
      </Group>

      <Group label="The backdrop and the box (overlay/gray behind, the box in the middle)">
        {/* Two boxes side by side: the Basic modal, then the Figma's Status
            Modal (Success, Horizontal, 440 x 176, node 167140:146042). */}
        <ModalBackdrop className="flex-wrap gap-space-16 rounded-corner-12 py-space-48">
          <ModalBox>
            <ModalHeader title="Rename the chat" description="Only you see this name." />
            <ModalBody>{BODY}</ModalBody>
            <ModalFooter />
          </ModalBox>
          <ModalBox width="md">
            <StatusModalContent
              type="success"
              alignment="horizontal"
              title="Insert Status Modal Title"
              description="Insert your status modal description here. It would look better as two lines of text."
            />
            <ModalFooter type="stretch" confirm="View Receipt" />
          </ModalBox>
        </ModalBackdrop>
      </Group>

      <Group label="Widths (ours: three), Header Medium, Footer Basic">
        <div className="flex flex-wrap items-start gap-space-24">
          {WIDTHS.map((w) => (
            <Labelled key={w.id} label={w.label}>
              <ModalBox width={w.id}>
                <ModalHeader title="Rename the chat" description="Only you see this name." />
                <ModalBody>{BODY}</ModalBody>
                <ModalFooter />
              </ModalBox>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Header, Medium 72, every type">
        <div className="flex flex-wrap items-start gap-space-24">
          {HEADER_TYPES.map((t) => (
            <Labelled key={t.id} label={t.label}>
              <ModalBox width="md">
                <ModalHeader type={t.id} icon={t.id === "left-icon" ? <SettingsIcon /> : undefined} title="Workspace settings" description="Changes apply to everyone in it." />
              </ModalBox>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Header, Small 56, every type">
        <div className="flex flex-wrap items-start gap-space-24">
          {HEADER_TYPES.map((t) => (
            <Labelled key={t.id} label={t.label}>
              <ModalBox width="md">
                <ModalHeader size="sm" type={t.id} icon={t.id === "left-icon" ? <SettingsIcon /> : undefined} title="Workspace settings" />
              </ModalBox>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Header: a long title wraps before the close button (ours); no close button">
        <div className="flex flex-wrap items-start gap-space-24">
          <Labelled label="Medium, long title">
            <ModalBox width="md">
              <ModalHeader
                type="warning"
                title="Delete the Northwind workspace and every chat, run and file in it?"
                description="This cannot be undone."
              />
            </ModalBox>
          </Labelled>
          <Labelled label="Small, long title">
            <ModalBox width="md">
              <ModalHeader size="sm" title="Delete the Northwind workspace and every chat, run and file in it?" />
            </ModalBox>
          </Labelled>
          <Labelled label="Medium, close off">
            <ModalBox width="md">
              <ModalHeader title="Workspace settings" description="Changes apply to everyone in it." close={false} />
            </ModalBox>
          </Labelled>
        </div>
      </Group>

      <Group label="Footer, every type, two buttons">
        <div className="flex flex-wrap items-start gap-space-24">
          {FOOTER_TYPES.map((t) => (
            <Labelled key={t.id} label={t.label}>
              <ModalBox width="md">
                <ModalFooter type={t.id} leading={footerLeading(t.id)} />
              </ModalBox>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Footer, one button">
        <div className="flex flex-wrap items-start gap-space-24">
          <Labelled label="Basic">
            <ModalBox width="md">
              <ModalFooter cancel={null} />
            </ModalBox>
          </Labelled>
          <Labelled label="Checkbox">
            <ModalBox width="md">
              <ModalFooter type="checkbox" leading={footerLeading("checkbox")} cancel={null} />
            </ModalBox>
          </Labelled>
          <Labelled label="Stretch">
            <ModalBox width="md">
              <ModalFooter type="stretch" cancel={null} />
            </ModalBox>
          </Labelled>
        </div>
      </Group>

      {(["horizontal", "vertical"] as const).map((alignment) => (
        <Group key={alignment} label={`Status Modal, ${alignment === "horizontal" ? "Horizontal" : "Vertical"}, every type`}>
          <div className="flex flex-wrap items-start gap-space-24">
            {STATUSES.map((s) => (
              <Labelled key={s.id} label={s.label}>
                <ModalBox width="md">
                  <StatusModalContent type={s.id} alignment={alignment} title={s.title} description={s.description} />
                  <ModalFooter type="checkbox" leading={footerLeading("checkbox")} />
                </ModalBox>
              </Labelled>
            ))}
          </div>
        </Group>
      ))}
    </div>
  );
}
