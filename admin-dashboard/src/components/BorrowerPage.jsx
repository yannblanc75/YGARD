import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../main";
import { Button } from "./ui/button";

const BorrowerPage = () => {
  const { user, decisions, setDecisions } = useContext(UserContext); // Contexte global
  const navigate = useNavigate();
  const location = useLocation();
  const borrower = location.state;

  const handleDecision = (decision) => {
    setDecisions((prev) => ({
      ...prev,
      [borrower.id]: decision,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Bouton de retour */}
      <Button
        className="hover:scale-110 transition-transform"
        onClick={() => navigate("/")}
      >
        Retour au tableau de bord
      </Button>

      {/* Informations emprunteur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Informations de l'emprunteur</h2>
          <p>
            <strong>Nom :</strong> {borrower.firstName} {borrower.lastName}
          </p>
          <p>
            <strong>Montant demandé :</strong> {borrower.loanAmount}€
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Statut du dossier</h2>
          <p>
            <strong>Statut :</strong> {borrower.status}
          </p>
          <div className="mt-4 space-y-4">
            <Button
              className="bg-green-600 hover:scale-110 transition-transform w-full"
              onClick={() => handleDecision("validé")}
            >
              Je valide le dossier
            </Button>
            <Button
              className="bg-red-600 hover:scale-110 transition-transform w-full"
              onClick={() => handleDecision("non validé")}
            >
              Je ne valide pas le dossier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowerPage;
