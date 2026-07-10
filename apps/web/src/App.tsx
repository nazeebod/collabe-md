import { Routes, Route } from "react-router-dom";
import { DocumentPage } from "./pages/DocumentPage";
import { HelpPage } from "./pages/HelpPage";
import { HomePage } from "./pages/HomePage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/d/:documentId" element={<DocumentPage />} />
    </Routes>
  );
}
