import { Route, Routes } from "react-router";
import CanvasDemo from "./pages/canvasDemo";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<CanvasDemo />} />
      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}

export default App;
