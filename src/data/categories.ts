import type { Category } from "@/interfaces";
import { BarChart3, Cloud, Cog, FileText, Package, User } from "lucide-react";

export const categories: Category[] = [
  {
    category: "Man",
    icon: User,
  },
  {
    category: "Machine",
    icon: Cog,
  },
  {
    category: "Material",
    icon: Package,
  },
  {
    category: "Method",
    icon: FileText,
  },
  {
    category: "Measurement",
    icon: BarChart3,
  },
  {
    category: "Environment",
    icon: Cloud,
  },
];
