import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  CanvasElement,
  CanvasElementType,
  Transform,
} from "@/types/canvas";
import {
  Download,
  GrapeIcon,
  Minus,
  Plus,
  RectangleHorizontal,
} from "lucide-react";
import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";

export default function Canvas() {
  return (
    <div className="h-screen flex flex-col relative">
      <CanvasProvider>
        <CanvasHeader title="test">
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
      </CanvasProvider>
    </div>
  );
}

type CanvasContextType = {
  transform: Transform;
  startPan: StartPan;
  isPanning: boolean;
  elements: CanvasElement[];
  handleAddElement: (elementType: CanvasElementType) => void;
  setIsPanning: (value: boolean) => void;
  handleMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
  handleZoomIn: (increment: number) => void;
  handleZoomOut: (increment: number) => void;
};

type StartPan = Omit<Transform, "scale">;

const CanvasContext = createContext<CanvasContextType | null>(null);

function useCanvasContext() {
  const context = useContext(CanvasContext);
  if (!context)
    throw new Error("useCanvasContext must be used inside a Canvas element");
  return context;
}

function CanvasProvider({ children }: { children: ReactNode }) {
  const [transform, setTransform] = useState<Transform>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const [startPan, setStartPan] = useState<StartPan>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [elements, setElements] = useState<CanvasElement[]>([]);

  function handleMouseDown(e: MouseEvent<HTMLDivElement>) {
    setStartPan({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    setIsPanning(true);
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!isPanning) return;

    setTransform((prev) => {
      return { ...prev, x: e.clientX - startPan.x, y: e.clientY - startPan.y };
    });
  }

  function handleZoomIn(increment: number) {
    setTransform((prev) => {
      const newScale = Math.min(prev.scale + increment, 2);
      return { ...prev, scale: newScale };
    });
  }

  function handleZoomOut(increment: number) {
    setTransform((prev) => {
      const newScale = Math.max(prev.scale - increment, 0.5);
      return { ...prev, scale: newScale };
    });
  }

  function handleAddElement(elementType: CanvasElementType) {
    const element: CanvasElement = {
      id: Math.random().toString(36).substring(2, 9),
      colour: "white",
      height: 100,
      width: 200,
      elementType,
      x: 500,
      y: 500,
    };
    setElements((prev) => [...prev, element]);
  }

  return (
    <CanvasContext
      value={{
        transform,
        startPan,
        handleMouseDown,
        handleMouseMove,
        setIsPanning,
        isPanning,
        handleZoomIn,
        handleZoomOut,
        elements,
        handleAddElement,
      }}
    >
      {children}
    </CanvasContext>
  );
}

function CanvasArea({ children }: { children?: ReactNode }) {
  const { handleMouseDown, handleMouseMove, setIsPanning, transform } =
    useCanvasContext();

  return (
    <div
      className="relative h-full overflow-hidden bg-gray-100"
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsPanning(false)}
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

function CanvasElements() {
  const context = useCanvasContext();
  const elements = context.elements;

  return (
    <>
      {elements.map((e) => (
        <CanvasElementView element={e} />
      ))}
    </>
  );
}

function CanvasElementView({ element }: { element: CanvasElement }) {
  return (
    <div
      className="absolute border-2 z-2"
      style={{
        top: element.y,
        left: element.x,
        height: element.height,
        width: element.width,
        backgroundColor: element.colour,
      }}
    >
      Canvas Element
    </div>
  );
}

function CanvasHeader({
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

function CanvasAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="canvas-action"
      className={cn("col-start-2 justify-self-end", className)}
      {...props}
    />
  );
}

function CanvasToolbar() {
  const { handleZoomIn, handleZoomOut, handleAddElement } = useCanvasContext();

  return (
    <div
      data-slot="canvas-toolbar"
      className="absolute top-20 left-5 border rounded-md flex flex-col z-10 bg-card py-2 px-1 gap-2 shadow-md"
    >
      <Button variant="outline" onClick={() => handleZoomIn(0.1)}>
        <Plus />
      </Button>
      <Button variant="outline" onClick={() => handleZoomOut(0.1)}>
        <Minus />
      </Button>
      <Button variant="outline" onClick={() => handleAddElement("Rectangle")}>
        <RectangleHorizontal />
      </Button>
    </div>
  );
}

function CanvasZoomInfo() {
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
