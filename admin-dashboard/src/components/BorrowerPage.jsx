import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../main";
import { Button } from "./ui/button";

const BorrowerPage = () => {
  const { decisions, setDecisions } = useContext(UserContext); // Contexte global
  const navigate = useNavigate();
  const location = useLocation();
  const borrower = location.state;

  const [formData, setFormData] = useState({
    RevenuAnnuel: borrower.RevenuAnnuel || "",
    RatioEndettement: borrower.RatioEndettement || "",
    MontantPret: borrower.MontantPret || "",
    DureePret: borrower.DureePret || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:5002/update-client", {
      method: "POST", // ou PUT selon votre logique
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ClientID: borrower.ClientID,
        ...formData,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Les informations ont été mises à jour dans la base de données.");
          navigate("/"); // Retour au tableau de bord si nécessaire
        } else {
          throw new Error("Erreur lors de la mise à jour des données.");
        }
      })
      .catch((error) => {
        console.error("Erreur:", error);
        alert("Une erreur est survenue lors de la mise à jour.");
      });
  };

  const handleDecision = (decision) => {
    fetch("http://127.0.0.1:5002/update-client-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ClientID: borrower.ClientID,
        etatDuDossier: decision,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert(`Dossier de ${borrower.Prenom} ${borrower.Nom} mis à jour avec succès.`);
          setDecisions((prev) => ({
            ...prev,
            [borrower.ClientID]: decision,
          }));
        } else {
          throw new Error("Erreur lors de la mise à jour de l'état du dossier.");
        }
      })
      .catch((error) => {
        console.error("Erreur:", error);
        alert("Une erreur est survenue lors de la mise à jour de l'état du dossier.");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 flex flex-col items-center">
      {/* Header */}
      <header className="w-full py-6 bg-white shadow-md">
        <div className="max-w-5xl mx-auto px-4">
          <Button
            className="text-blue-500 hover:underline"
            onClick={() => navigate("/")}
          >
            Retour au tableau de bord
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-5xl mt-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations emprunteur */}
          <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Informations de l'emprunteur</h2>
            <p className="text-gray-700 mb-2">
              <strong>Nom :</strong> {borrower.Prenom} {borrower.Nom}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Montant demandé :</strong> {borrower.MontantPret.toLocaleString()} €
            </p>
            <p className="text-gray-700">
              <strong>Durée du prêt :</strong> {borrower.DureePret} mois
            </p>
          </div>

          {/* Formulaire de mise à jour */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Mise à jour des informations</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="RevenuAnnuel">
                  Revenu Annuel
                </label>
                <input
                  type="number"
                  id="RevenuAnnuel"
                  name="RevenuAnnuel"
                  value={formData.RevenuAnnuel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="RatioEndettement">
                  Ratio d'Endettement
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="RatioEndettement"
                  name="RatioEndettement"
                  value={formData.RatioEndettement}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="MontantPret">
                  Montant Prêt
                </label>
                <input
                  type="number"
                  id="MontantPret"
                  name="MontantPret"
                  value={formData.MontantPret}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="DureePret">
                  Durée Prêt (mois)
                </label>
                <input
                  type="number"
                  id="DureePret"
                  name="DureePret"
                  value={formData.DureePret}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Enregistrer
              </Button>
            </form>
          </div>

          {/* Statut du dossier */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Statut du dossier</h2>
            <div className="mt-4 flex flex-col space-y-4">
              <Button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                onClick={() => handleDecision(1)}
              >
                Je valide le dossier
              </Button>
              <Button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={() => handleDecision(0)}
              >
                Je ne valide pas le dossier
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BorrowerPage;
