import { ComponentExample } from "@/components/component-example";
import { Route, Routes } from "react-router";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<ComponentExample />} />
      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}

export default App;
