import { Route, Routes } from "react-router";
import Fishbone from "./pages/fishbone";
import FishboneV2 from "./pages/fishbone-v2";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Fishbone />} />
      <Route path="/v2" element={<FishboneV2 />} />
      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}

export default App;
