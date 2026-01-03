import type { LucideIcon } from "lucide-react";

export type CategoryType =
  | "Man"
  | "Machine"
  | "Material"
  | "Method"
  | "Measurement"
  | "Environment";

export interface Category {
  category: CategoryType;
  icon: LucideIcon;
}
