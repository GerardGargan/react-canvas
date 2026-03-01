import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type {
  CanvasElement,
  CanvasElementType,
  Transform,
} from "@/types/canvas";
import {
  Circle,
  GrapeIcon,
  Pencil,
  RectangleHorizontal,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  createContext,
  type ChangeEvent,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "./button";
import useCanvas from "@/hooks/use-canvas";
import useCanvasContext from "@/hooks/use-canvas-context";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "./label";
import { Input } from "./input";

type CanvasContextType = {
  transform: Transform;
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  handleAddElement: (elementType: CanvasElementType) => void;
  setSelectedElement: React.Dispatch<
    React.SetStateAction<CanvasElement | null>
  >;
  handleElementMouseDown: (
    e: MouseEvent<HTMLDivElement>,
    element: CanvasElement,
  ) => void;
  handleMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: () => void;
  handleMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
  handleZoomIn: (increment: number) => void;
  handleZoomOut: (increment: number) => void;
  handleResizeElement: (
    e: MouseEvent<HTMLDivElement>,
    element: CanvasElement,
  ) => void;
  handleOpenSheet: (element: CanvasElement) => void;
  handleCloseSheet: () => void;
  isSheetOpen: boolean;
  handleEditElement: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const CanvasContext = createContext<CanvasContextType | null>(null);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const {
    transform,
    elements,
    selectedElement,
    handleAddElement,
    handleElementMouseDown,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleZoomIn,
    handleZoomOut,
    setSelectedElement,
    handleResizeElement,
    handleOpenSheet,
    handleCloseSheet,
    handleEditElement,
    isSheetOpen,
  } = useCanvas();

  return (
    <CanvasContext
      value={{
        transform,
        elements,
        selectedElement,
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
        handleZoomIn,
        handleAddElement,
        handleElementMouseDown,
        handleZoomOut,
        setSelectedElement,
        handleResizeElement,
        handleCloseSheet,
        handleOpenSheet,
        handleEditElement,
        isSheetOpen,
      }}
    >
      {children}
    </CanvasContext>
  );
}

export function CanvasArea({ children }: { children?: ReactNode }) {
  const { handleMouseDown, handleMouseMove, handleMouseUp, transform } =
    useCanvasContext();

  return (
    <div
      className="relative h-full overflow-hidden bg-gray-100"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div
        className="h-full w-full relative cursor-grab active:cursor-grabbing"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        }}
      >
        <div
          className="absolute"
          style={{
            width: "5000px",
            height: "5000px",
            top: "-1000px",
            left: "-1000px",
            backgroundImage: "radial-gradient(#99a1af 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {children && children}
      </div>
    </div>
  );
}

export function CanvasElements() {
  const context = useCanvasContext();
  const elements = context.elements;

  return (
    <>
      {elements.map((e) => (
        <CanvasElementView element={e} key={e.id} />
      ))}
    </>
  );
}

export function CanvasElementView({ element }: { element: CanvasElement }) {
  const {
    selectedElement,
    handleElementMouseDown,
    handleResizeElement,
    handleOpenSheet,
  } = useCanvasContext();

  const isSelected = selectedElement?.id === element.id;

  return (
    <div
      data-slot="canvas-element"
      className={twMerge(
        "absolute z-1 p-1",
        isSelected && "ring-2 ring-blue-500",
      )}
      style={{
        top: element.y,
        left: element.x,
        height: element.height,
        width: element.width,
        backgroundColor: element.colour,
        border: element.border,
        borderRadius: element.borderRadius,
        position: "absolute",
      }}
      onMouseDown={(e) => handleElementMouseDown(e, element)}
    >
      {/* Resize Handle */}
      {isSelected && (
        <div
          data-slot="resize-handle"
          className="absolute -right-2 -bottom-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-nwse-resize"
          onMouseDown={(e) => handleResizeElement(e, element)}
        />
      )}

      {/* Edit button */}
      {isSelected && (
        <Button
          variant="link"
          className="absolute -top-8 -right-8"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenSheet(element);
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export function CanvasSheet() {
  const { selectedElement, isSheetOpen, handleCloseSheet, handleEditElement } =
    useCanvasContext();
  if (!selectedElement) return;

  return (
    <Sheet
      open={selectedElement !== null && isSheetOpen}
      onOpenChange={(open) => {
        if (!open) handleCloseSheet();
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit shape</SheetTitle>
          <SheetDescription>Make changes to the shape here.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 mt-4 px-4">
          <Label>
            Width:
            <Input
              type="number"
              name="width"
              value={selectedElement.width}
              min={20}
              className="border px-2 py-1 rounded ml-2"
              onChange={handleEditElement}
            />
          </Label>
          <Label>
            Height:
            <Input
              type="number"
              name="height"
              value={selectedElement.height}
              min={20}
              className="border px-2 py-1 rounded ml-2"
              onChange={handleEditElement}
            />
          </Label>
          <Label>
            Colour:
            <input
              type="color"
              name="colour"
              value={selectedElement.colour}
              className="border px-2 py-1 rounded ml-2"
              onChange={handleEditElement}
            />
          </Label>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function CanvasHeader({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      data-slot="canvas-header"
      className="grid border-b bg-card py-2 px-3 has-data-[slot=canvas-action]:grid-cols-2"
    >
      <span className="flex items-center space-x-2">
        <GrapeIcon className="h-7 w-7 bg-gray-200 rounded-sm p-1" />
        <p>{title}</p>
      </span>
      {children}
    </div>
  );
}

export function CanvasAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="canvas-action"
      className={cn("col-start-2 justify-self-end", className)}
      {...props}
    />
  );
}

export function CanvasToolbar() {
  const { handleZoomIn, handleZoomOut, handleAddElement, transform } =
    useCanvasContext();
  const scalePercentage = Math.round(transform.scale * 100) + "%";

  return (
    <div
      data-slot="canvas-toolbar"
      className="absolute bottom-10 left-1/2 -translate-x-1/2 border rounded-md flex items-center z-1 bg-card py-2 px-2 gap-2 shadow-md"
    >
      <Button variant="ghost" onClick={() => handleAddElement("Rectangle")}>
        <RectangleHorizontal />
      </Button>
      <Button variant="ghost" onClick={() => handleAddElement("Circle")}>
        <Circle />
      </Button>
      <Separator orientation="vertical" />
      <Button variant="ghost" onClick={() => handleZoomIn(0.1)}>
        <ZoomIn />
      </Button>
      <p className="text-xs">{scalePercentage}</p>
      <Button variant="ghost" onClick={() => handleZoomOut(0.1)}>
        <ZoomOut />
      </Button>
    </div>
  );
}

export function CanvasZoomInfo() {
  const { transform } = useCanvasContext();
  const scalePercentage = Math.round(transform.scale * 100) + "%";
  return (
    <div
      data-slot="canvas-zoom-info"
      className="absolute bottom-5 right-5 rounded-md bg-card py-1 px-2 text-xs z-10 shadow-md"
    >
      {scalePercentage}
    </div>
  );
}
