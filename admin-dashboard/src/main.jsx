import React, { useState, createContext } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import AdminDashboard from "./components/AdminDashboard";
import BorrowerPage from "./components/BorrowerPage";

// Contexte global pour l'utilisateur et les décisions
export const UserContext = createContext();

const App = () => {
  const [user, setUser] = useState(null); // Stocke l'utilisateur connecté
  const [decisions, setDecisions] = useState({}); // Stocke les décisions des dossiers (id -> décision)

  return (
    <UserContext.Provider value={{ user, setUser, decisions, setDecisions }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/borrower" element={<BorrowerPage />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
