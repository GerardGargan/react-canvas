import FishboneCanvas from "@/components/fishbone/fishbone-canvas";
import FishboneHeader from "@/components/fishbone/fishbone-header";

function Fishbone() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <FishboneHeader analysisTitle="Machine 4 breakdown" onExport={() => {}} />
      <FishboneCanvas />
    </div>
  );
}

export default Fishbone;
