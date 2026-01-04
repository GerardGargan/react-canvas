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
  const [centerY, setCenterY] = useState(500);

  const branchLength = 250;

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
      setCenterY(containerRef.current.clientHeight / 2);
      setTransform({ x: 0, y: 0, scale: 1 });
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
        className="w-full h-full cursor-grab active:cursor-grabbing relative items-center justify-center"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
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
            backgroundSize: `${24 * transform.scale}px ${
              24 * transform.scale
            }px`,
            backgroundPosition: `${transform.x % (24 * transform.scale)}px ${
              transform.y % (24 * transform.scale)
            }px`,
          }}
        />

        {/* Content */}
        <div className="relative w-1000 h-1000">
          {/* Fishbone nodes go here */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ minWidth: "1200px", minHeight: "1000px" }}
          >
            {/* Main spine */}
            <line
              x1="100"
              y1={centerY}
              x2="1000"
              y2={centerY}
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Head */}
            <polygon
              points={`1010,${centerY} 980,${centerY - 10} 980,${centerY + 10}`}
              fill="black"
            />

            {topCateogries.map((c, i) => (
              <line
                key={c.category}
                x1={200 + 250 * i}
                y1={centerY - branchLength}
                x2={350 + 250 * i}
                y2={centerY}
                className="stroke-current"
                strokeWidth={2}
              />
            ))}

            {bottomCategories.map((c, i) => (
              <line
                key={c.category}
                x1={200 + 250 * i}
                y1={centerY + branchLength}
                x2={350 + 250 * i}
                y2={centerY}
                className="stroke-current"
                strokeWidth={2}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

export default FishboneCanvas;
