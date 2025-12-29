import { Navigate, Route, Routes } from "react-router-dom";
import DocPage from "./pages/DocPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/doc/demo" replace />} />
      <Route path="/doc/:docId" element={<DocPage />} />
      <Route path="*" element={<Navigate to="/doc/demo" replace />} />
    </Routes>
  );
}