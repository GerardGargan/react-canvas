import { ChartColumnBig, Download } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";

interface Props {
  analysisTitle: string;
  onExport: () => void;
}
function FishboneHeader({ analysisTitle, onExport }: Props) {
  return (
    <div className="flex justify-between items-center bg-card border-b px-4 py-2">
      <div className="flex gap-2">
        <div className="p-2 bg-primary/10 m-auto rounded-sm">
          <ChartColumnBig className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-foreground">
                  {analysisTitle}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="font-semibold text-lg">Fishbone Studio</h1>
        </div>
      </div>
      <div>
        <Button onClick={onExport}>
          <Download />
          Export
        </Button>
      </div>
    </div>
  );
}

export default FishboneHeader;
