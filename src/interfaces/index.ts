import type { LucideIcon } from "lucide-react";

export type Status = "InProgress" | "Completed";
export type Priority = "High" | "Medium" | "Low";

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

export interface FishboneAnalysis {
  id: string;
  title: string;
  dateCreated: string;
  dateModified: string;
  createdBy: string;
  problemStatement: string;
  status: Status;
  priority: Priority;
  causes: Cause[];
}

export interface Cause {
  id: string;
  title: string;
  category: CategoryType;
  isRootCause: boolean;
  whys: WhyStep[];
}

export interface WhyStep {
  id: string;
  level: number;
  reason: string;
}
