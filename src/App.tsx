import { Route, Routes } from "react-router";
import Fishbone from "./pages/fishbone";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Fishbone />} />
      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}

export default App;
