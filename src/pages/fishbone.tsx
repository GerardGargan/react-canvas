import FishboneHeader from "@/components/fishbone/fishbone-header";
import type { Category } from "@/interfaces";
import { BarChart3, Cloud, Cog, FileText, Package, User } from "lucide-react";

const categories: Category[] = [
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

function Fishbone() {
  return (
    <>
      <FishboneHeader analysisTitle="Machine 4 breakdown" onExport={() => {}} />
    </>
  );
}

export default Fishbone;
