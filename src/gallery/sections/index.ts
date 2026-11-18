import type { ComponentType } from "react";

import { ButtonSection } from "./button";
import { LabelSection } from "./label";
import { TextInputSection } from "./text-input";
import { TextAreaSection } from "./text-area";
import { CheckboxSection } from "./checkbox";
import { RadioSection } from "./radio";
import { SwitchSection } from "./switch";
import { ButtonGroupSection } from "./button-group";
import { LinkButtonSection } from "./link-button";
import { CompactButtonSection } from "./compact-button";
import { SocialButtonSection } from "./social-button";
import { FancyButtonSection } from "./fancy-button";
import { TagSection } from "./tag";
import { BadgeSection } from "./badge";
import { AvatarSection } from "./avatar";
import { KeyComponentsSection } from "./key-components";
import { ContentDividerSection } from "./content-divider";
import { TooltipSection } from "./tooltip";
import { BreadcrumbsSection } from "./breadcrumbs";
import { TabMenuSection } from "./tab-menu";
import { SegmentedControlSection } from "./segmented-control";
import { PaginationSection } from "./pagination";
import { StepIndicatorSection } from "./step-indicator";
import { SelectSection } from "./select";
import { DropdownSection } from "./dropdown";
import { PopoverSection } from "./popover";
import { CommandMenuSection } from "./command-menu";
import { FilterSection } from "./filter";
import { AlertSection } from "./alert";
import { BannerSection } from "./banner";
import { ProgressBarSection } from "./progress-bar";
import { ChartSection } from "./chart";
import { KpiCardSection } from "./kpi-card";
import { NotificationFeedSection } from "./notification-feed";
import { ActivityFeedSection } from "./activity-feed";
import { DatePickerSection } from "./date-picker";
import { TimePickerSection } from "./time-picker";
import { FileUploadSection } from "./file-upload";
import { SliderSection } from "./slider";
import { RatingSection } from "./rating";
import { ColorPickerSection } from "./color-picker";
import { RichEditorSection } from "./rich-editor";
import { ModalSection } from "./modal";
import { DrawerSection } from "./drawer";
import { AccordionSection } from "./accordion";
import { TableSection } from "./table";
import { ScrollSection } from "./scroll";
import { PageHeaderSection } from "./page-header";

/** Every section of the Components page, in the order of the index. Add a
 *  component: write sections/<name>.tsx and list it here. */
export const SECTIONS: { id: string; name: string; page: string; Component: ComponentType }[] = [
  { id: "button", name: "Button", page: "button.md", Component: ButtonSection },
  { id: "label", name: "Label and Hint Text", page: "key-components.md", Component: LabelSection },
  { id: "text-input", name: "Text Input", page: "text-input.md", Component: TextInputSection },
  { id: "text-area", name: "Text Area", page: "text-area.md", Component: TextAreaSection },
  { id: "checkbox", name: "Checkbox", page: "checkbox.md", Component: CheckboxSection },
  { id: "radio", name: "Radio", page: "radio.md", Component: RadioSection },
  { id: "switch", name: "Switch", page: "switch.md", Component: SwitchSection },
  { id: "button-group", name: "Button Group", page: "button-group.md", Component: ButtonGroupSection },
  { id: "link-button", name: "Link Button", page: "link-button.md", Component: LinkButtonSection },
  { id: "compact-button", name: "Compact Button", page: "compact-button.md", Component: CompactButtonSection },
  { id: "social-button", name: "Social Button", page: "social-button.md", Component: SocialButtonSection },
  { id: "fancy-button", name: "Fancy Button", page: "fancy-button.md", Component: FancyButtonSection },
  { id: "tag", name: "Tag", page: "tag.md", Component: TagSection },
  { id: "badge", name: "Badge", page: "badge.md", Component: BadgeSection },
  { id: "avatar", name: "Avatar", page: "avatar.md", Component: AvatarSection },
  { id: "key-components", name: "Key Components", page: "key-components.md", Component: KeyComponentsSection },
  { id: "content-divider", name: "Content Divider", page: "content-divider.md", Component: ContentDividerSection },
  { id: "tooltip", name: "Tooltip", page: "tooltip.md", Component: TooltipSection },
  { id: "breadcrumbs", name: "Breadcrumbs", page: "breadcrumbs.md", Component: BreadcrumbsSection },
  { id: "tab-menu", name: "Tab Menu", page: "tab-menu.md", Component: TabMenuSection },
  { id: "segmented-control", name: "Segmented Control", page: "segmented-control.md", Component: SegmentedControlSection },
  { id: "pagination", name: "Pagination", page: "pagination.md", Component: PaginationSection },
  { id: "step-indicator", name: "Step Indicator", page: "step-indicator.md", Component: StepIndicatorSection },
  { id: "select", name: "Select", page: "select.md", Component: SelectSection },
  { id: "dropdown", name: "Dropdown", page: "dropdown.md", Component: DropdownSection },
  { id: "popover", name: "Popover", page: "popover.md", Component: PopoverSection },
  { id: "command-menu", name: "Command Menu", page: "command-menu.md", Component: CommandMenuSection },
  { id: "filter", name: "Filter", page: "filter.md", Component: FilterSection },
  { id: "alert", name: "Alert, Toast and Notification", page: "alert.md", Component: AlertSection },
  { id: "banner", name: "Banner", page: "banner.md", Component: BannerSection },
  { id: "progress-bar", name: "Progress Bar", page: "progress-bar.md", Component: ProgressBarSection },
  { id: "charts", name: "Charts", page: "chart.md", Component: ChartSection },
  { id: "kpi-card", name: "KPI Card", page: "kpi-card.md", Component: KpiCardSection },
  { id: "notification-feed", name: "Notification Feed", page: "notification-feed.md", Component: NotificationFeedSection },
  { id: "activity-feed", name: "Activity Feed", page: "activity-feed.md", Component: ActivityFeedSection },
  { id: "date-picker", name: "Date Picker", page: "date-picker.md", Component: DatePickerSection },
  { id: "time-picker", name: "Time Picker", page: "time-picker.md", Component: TimePickerSection },
  { id: "file-upload", name: "File Upload", page: "file-upload.md", Component: FileUploadSection },
  { id: "slider", name: "Slider", page: "slider.md", Component: SliderSection },
  { id: "rating", name: "Rating", page: "rating.md", Component: RatingSection },
  { id: "color-picker", name: "Color Picker", page: "color-picker.md", Component: ColorPickerSection },
  { id: "rich-editor", name: "Rich Editor", page: "rich-editor.md", Component: RichEditorSection },
  { id: "modal", name: "Modal", page: "modal.md", Component: ModalSection },
  { id: "drawer", name: "Drawer", page: "drawer.md", Component: DrawerSection },
  { id: "accordion", name: "Accordion", page: "accordion.md", Component: AccordionSection },
  { id: "table", name: "Table", page: "table.md", Component: TableSection },
  { id: "scroll", name: "Scroll", page: "scroll.md", Component: ScrollSection },
  { id: "header", name: "Header", page: "page-header.md", Component: PageHeaderSection },
];
