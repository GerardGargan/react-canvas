import { CanvasContext } from "@/components/ui/canvas";
import { useContext } from "react";

export default function useCanvasContext() {
  const context = useContext(CanvasContext);
  if (!context)
    throw new Error("useCanvasContext must be used inside a Canvas element");
  return context;
}
