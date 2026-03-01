export type Transform = {
  x: number;
  y: number;
  scale: number;
};

export type CanvasElementType = "Rectangle" | "Circle";

export type CanvasElement = {
  id: string;
  elementType: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  colour: string;
  border: string;
  borderRadius: string;
};
