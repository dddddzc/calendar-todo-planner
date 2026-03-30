import { TaskColorKey } from "../types";

export interface ColorOption {
  value: TaskColorKey;
  label: string;
  swatchClass: string;
  chipClass: string;
  softClass: string;
  borderClass: string;
  textClass: string;
  ringClass: string;
}

export const COLOR_OPTIONS: ColorOption[] = [
  {
    value: "sky",
    label: "Sky",
    swatchClass: "bg-sky-500",
    chipClass: "border-sky-200 bg-sky-50 text-sky-700",
    softClass: "bg-sky-500/10",
    borderClass: "border-sky-200",
    textClass: "text-sky-700",
    ringClass: "ring-sky-200",
  },
  {
    value: "amber",
    label: "Amber",
    swatchClass: "bg-amber-500",
    chipClass: "border-amber-200 bg-amber-50 text-amber-700",
    softClass: "bg-amber-500/10",
    borderClass: "border-amber-200",
    textClass: "text-amber-700",
    ringClass: "ring-amber-200",
  },
  {
    value: "emerald",
    label: "Emerald",
    swatchClass: "bg-emerald-500",
    chipClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    softClass: "bg-emerald-500/10",
    borderClass: "border-emerald-200",
    textClass: "text-emerald-700",
    ringClass: "ring-emerald-200",
  },
  {
    value: "violet",
    label: "Violet",
    swatchClass: "bg-violet-500",
    chipClass: "border-violet-200 bg-violet-50 text-violet-700",
    softClass: "bg-violet-500/10",
    borderClass: "border-violet-200",
    textClass: "text-violet-700",
    ringClass: "ring-violet-200",
  },
  {
    value: "rose",
    label: "Rose",
    swatchClass: "bg-rose-500",
    chipClass: "border-rose-200 bg-rose-50 text-rose-700",
    softClass: "bg-rose-500/10",
    borderClass: "border-rose-200",
    textClass: "text-rose-700",
    ringClass: "ring-rose-200",
  },
];

export const COLOR_MAP = Object.fromEntries(
  COLOR_OPTIONS.map((color) => [color.value, color]),
) as Record<TaskColorKey, ColorOption>;
