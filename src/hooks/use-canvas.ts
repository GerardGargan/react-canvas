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
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });

  function handleMouseDown(e: MouseEvent<HTMLDivElement>) {
    if (selectedElement !== null) setSelectedElement(null);
    setStartPan({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    setIsPanning(true);
  }

  function handleMouseUp() {
    setIsPanning(false);
    setIsDraggingElement(false);
    setIsResizing(false);
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    // Handles moving an element on drag
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

    // Handles resizing an element
    if (isResizing && selectedElement) {
      const mouseX = (e.clientX - transform.x) / transform.scale;
      const mouseY = (e.clientY - transform.y) / transform.scale;

      const deltaX = mouseX - resizeStart.current.x;
      const deltaY = mouseY - resizeStart.current.y;

      const newWidth = Math.max(20, resizeStart.current.width + deltaX);
      const newHeight = Math.max(20, resizeStart.current.height + deltaY);

      setElements((prev) =>
        prev.map((el) =>
          el.id === selectedElement.id
            ? { ...el, width: newWidth, height: newHeight }
            : el,
        ),
      );
      setSelectedElement((prev) =>
        prev ? { ...prev, width: newWidth, height: newHeight } : prev,
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
    let element: CanvasElement | null = null;
    switch (elementType) {
      case "Rectangle":
        element = {
          id: Math.random().toString(36).substring(2, 9),
          colour: "white",
          height: 100,
          width: 200,
          border: "2px solid grey",
          borderRadius: "6px",
          elementType,
          x: 500,
          y: 500,
        };
        break;
      case "Circle":
        element = {
          id: Math.random().toString(36).substring(2, 9),
          colour: "white",
          height: 100,
          width: 100,
          border: "2px solid grey",
          borderRadius: "50%",
          elementType,
          x: 500,
          y: 500,
        };
        break;
    }
    if (!element) throw new Error("Error adding element");
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

  function handleResizeElement(
    e: MouseEvent<HTMLDivElement>,
    element: CanvasElement,
  ) {
    e.stopPropagation();
    setIsResizing(true);

    // Store the starting mouse position and element size
    resizeStart.current = {
      x: (e.clientX - transform.x) / transform.scale,
      y: (e.clientY - transform.y) / transform.scale,
      width: element.width,
      height: element.height,
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
    handleResizeElement,
    dragOffset,
    elements,
    transform,
    selectedElement,
  };
}
