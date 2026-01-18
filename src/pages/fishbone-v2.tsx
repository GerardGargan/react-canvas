import { Button } from "@/components/ui/button";
import { GrapeIcon } from "lucide-react";
import {
  createContext,
  useContext,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

export default function FishboneV2() {
  return (
    <div className="h-screen flex flex-col">
      <Canvas>
        <CanvasHeader title="test" />
        <CanvasArea>
          <></>
        </CanvasArea>
      </Canvas>
    </div>
  );
}

type CanvasContextType = {
  transform: Transform;
  startPan: StartPan;
  isPanning: boolean;
  setIsPanning: (value: boolean) => void;
  handleMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
};

type Transform = {
  x: number;
  y: number;
  scale: number;
};

type StartPan = Omit<Transform, "scale">;

const CanvasContext = createContext<CanvasContextType | null>(null);

function useCanvasContext() {
  const context = useContext(CanvasContext);
  if (!context)
    throw new Error("useCanvasContext must be used inside a Canvas element");
  return context;
}

function Canvas({ children }: { children: ReactNode }) {
  const [transform, setTransform] = useState<Transform>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const [startPan, setStartPan] = useState<StartPan>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

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

  return (
    <CanvasContext
      value={{
        transform,
        startPan,
        handleMouseDown,
        handleMouseMove,
        setIsPanning,
        isPanning,
      }}
    >
      {children}
    </CanvasContext>
  );
}

function CanvasArea({ children }: { children: ReactNode }) {
  const { handleMouseDown, handleMouseMove, setIsPanning, transform } =
    useCanvasContext();

  return (
    <div
      className="relative h-full overflow-hidden bg-background"
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsPanning(false)}
      onMouseMove={handleMouseMove}
    >
      <div
        className="h-full w-full relative cursor-grab active:cursor-grabbing"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px)`,
        }}
      >
        <div
          className="absolute"
          style={{
            width: "5000px",
            height: "5000px",
            top: "-1000px",
            left: "-1000px",
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {children}
      </div>
    </div>
  );
}

function CanvasHeader({ title }: { title: string }) {
  return (
    <div className="flex justify-between items-center border-b bg-card py-2 px-3">
      <GrapeIcon className="h-7 w-7 bg-gray-200 rounded-sm p-1" />
      <Button>Test</Button>
    </div>
  );
}
