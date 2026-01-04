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

    const delta = e.deltaY > 0 ? 0.98 : 1.02;
    const newScale = Math.min(Math.max(transform.scale * delta, 0.3), 2);
    setTransform((prev) => {
      return { ...prev, scale: newScale };
    });
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

            {/* Arrow head */}
            <polygon points={`1000,100 980,1000 980,1000`} fill="black" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default FishboneCanvas;
