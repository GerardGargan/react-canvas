import type {
  CanvasElement,
  CanvasElementType,
  Transform,
} from "@/types/canvas";
import { useRef, useState, type MouseEvent } from "react";

type StartPan = Omit<Transform, "scale">;

export default function useCanvas() {
  const [transform, setTransform] = useState<Transform>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const [startPan, setStartPan] = useState<StartPan>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(
    null,
  );
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  function handleMouseDown(e: MouseEvent<HTMLDivElement>) {
    setStartPan({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    setIsPanning(true);
  }

  function handleMouseUp() {
    setIsPanning(false);
    setIsDraggingElement(false);
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (isDraggingElement && selectedElement) {
      const newX =
        (e.clientX - transform.x) / transform.scale - dragOffset.current.x;
      const newY =
        (e.clientY - transform.y) / transform.scale - dragOffset.current.y;
      setElements((prev) =>
        prev.map((el) =>
          el.id === selectedElement.id ? { ...el, x: newX, y: newY } : el,
        ),
      );
      setSelectedElement((prev) =>
        prev ? { ...prev, x: newX, y: newY } : prev,
      );
      return;
    }

    if (!isPanning) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    }));
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

  function handleElementMouseDown(
    e: MouseEvent<HTMLDivElement>,
    element: CanvasElement,
  ) {
    e.stopPropagation();
    setSelectedElement(element);
    setIsDraggingElement(true);

    // Store the cursor offset relative to the elements position, adjusted for canvas transform
    dragOffset.current = {
      x: (e.clientX - transform.x) / transform.scale - element.x,
      y: (e.clientY - transform.y) / transform.scale - element.y,
    };
  }

  return {
    handleAddElement,
    handleElementMouseDown,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleZoomIn,
    handleZoomOut,
    setSelectedElement,
    dragOffset,
    elements,
    transform,
    selectedElement,
  };
}
