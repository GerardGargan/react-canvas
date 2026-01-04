import { categories } from "@/data/categories";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type WheelEvent,
} from "react";

function FishboneCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const branchLength = 250;
  const spineStartX = 100;
  const spineEndX = 1000;
  const spineY = 500;

  const topCateogries = categories.filter(
    (x) =>
      x.category === "Man" ||
      x.category === "Machine" ||
      x.category === "Measurement"
  );
  const bottomCategories = categories.filter(
    (x) =>
      x.category === "Material" ||
      x.category === "Environment" ||
      x.category === "Method"
  );

  useEffect(() => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const containerWidth = containerRef.current.clientWidth;

      const initialScale = Math.min(
        containerWidth / 1200,
        containerHeight / 1000,
        1
      );

      const fishboneCenterX = (spineStartX + spineEndX) / 2;
      const fishboneCenterY = spineY;

      const offsetX = containerWidth / 2 - fishboneCenterX * initialScale;
      const offsetY = containerHeight / 2 - fishboneCenterY * initialScale;

      setTransform({ x: offsetX, y: offsetY, scale: initialScale });
    }
  }, []);

  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    const container = containerRef.current;
    if (!container) return;

    if (e.ctrlKey) {
      const delta = e.deltaY > 0 ? 0.98 : 1.02;
      const newScale = Math.min(Math.max(transform.scale * delta, 0.3), 2);
      setTransform((prev) => {
        return { ...prev, scale: newScale };
      });
    } else {
      setTransform((prev) => {
        return { ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY };
      });
    }
  };

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsPanning(true);
    setStartPan({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const onMouseUp = () => {
    setIsPanning(false);
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    setTransform((prev) => {
      return { ...prev, x: e.clientX - startPan.x, y: e.clientY - startPan.y };
    });
  };

  return (
    <div
      className="relative h-full flex-1 overflow-hidden bg-gray-100"
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onWheel={onWheel}
    >
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing relative"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Grid */}
        <div
          className="absolute"
          style={{
            left: "-5000px",
            top: "-5000px",
            width: "10000px",
            height: "10000px",
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "24px 24px",

            backgroundPosition: "0 0",
          }}
        />

        {/* Content */}
        {/* Fishbone nodes go here */}
        <svg
          className="absolute pointer-events-none"
          style={{
            left: "0",
            top: "0",
            width: "1200px",
            height: "1000px",
            overflow: "visible",
          }}
        >
          {/* Main spine */}
          <line
            x1={spineStartX}
            y1={spineY}
            x2={spineEndX}
            y2={spineY}
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Head */}
          <polygon
            points={`1010,${spineY} 980,${spineY - 10} 980,${spineY + 10}`}
            fill="black"
          />

          {topCateogries.map((c, i) => (
            <line
              key={c.category}
              x1={200 + 250 * i}
              y1={spineY - branchLength}
              x2={350 + 250 * i}
              y2={spineY}
              className="stroke-current"
              strokeWidth={2}
            />
          ))}

          {bottomCategories.map((c, i) => (
            <line
              key={c.category}
              x1={200 + 250 * i}
              y1={spineY + branchLength}
              x2={350 + 250 * i}
              y2={spineY}
              className="stroke-current"
              strokeWidth={2}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default FishboneCanvas;
