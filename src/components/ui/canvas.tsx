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
  RectangleHorizontal,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  createContext,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "./button";
import useCanvas from "@/hooks/use-canvas";
import useCanvasContext from "@/hooks/use-canvas-context";

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
  const { selectedElement, handleElementMouseDown } = useCanvasContext();

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
      }}
      onMouseDown={(e) => handleElementMouseDown(e, element)}
    ></div>
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
