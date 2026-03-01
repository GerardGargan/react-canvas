import { Button } from "@/components/ui/button";
import {
  CanvasAction,
  CanvasArea,
  CanvasElements,
  CanvasHeader,
  CanvasProvider,
  CanvasSheet,
  CanvasToolbar,
  CanvasZoomInfo,
} from "@/components/ui/canvas";

import { Download } from "lucide-react";

export default function Canvas() {
  return (
    <div className="h-screen flex flex-col relative">
      <CanvasProvider>
        <CanvasHeader title="Canvas">
          <CanvasAction>
            <Button className="space-x-1">
              <Download />
              <p>Export</p>
            </Button>
          </CanvasAction>
        </CanvasHeader>
        <CanvasToolbar />
        <CanvasZoomInfo />
        <CanvasArea>
          <CanvasElements />
        </CanvasArea>
        <CanvasSheet />
      </CanvasProvider>
    </div>
  );
}
