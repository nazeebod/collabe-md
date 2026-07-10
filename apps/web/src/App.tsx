import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { DocumentPage } from "./pages/DocumentPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/d/:documentId" element={<DocumentPage />} />
    </Routes>
  );
}
