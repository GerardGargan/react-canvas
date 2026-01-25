import { Route, Routes } from "react-router";
import Canvas from "./pages/canvas";

export function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Fishbone />} /> */}
      <Route path="/" element={<Canvas />} />
      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}

export default App;
