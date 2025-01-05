import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const BorrowerPage = () => {
  const location = useLocation();
  const client = location.state;
  const [favorableStatus, setFavorableStatus] = useState("");

  useEffect(() => {
    // Récupération de l'état favorable du client depuis l'API
    fetch(`http://127.0.0.1:5002/client-status/${client.ClientID}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.EstFavorable) {
          setFavorableStatus(data.EstFavorable);
        }
      })
      .catch((error) => console.error("Erreur lors de la récupération de l'état favorable :", error));
  }, [client.ClientID]);

  const handleStatusUpdate = (status) => {
    fetch("http://127.0.0.1:5002/update-client-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ClientID: client.ClientID,
        etatDuDossier: status,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert("Statut du dossier mis à jour avec succès.");
        } else {
          alert("Erreur lors de la mise à jour du statut du dossier.");
        }
      })
      .catch((error) => console.error("Erreur :", error));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations de l'emprunteur */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Informations de l'emprunteur</h2>
          <p><strong>Nom :</strong> {client.Prenom} {client.Nom}</p>
          <p><strong>Montant demandé :</strong> {client.MontantPret.toLocaleString()} €</p>
          <p><strong>Durée du prêt :</strong> {client.DureePret} mois</p>
          <p className="mt-4">
            <strong>État du dossier :</strong>{" "}
            <span className="font-semibold">{client.etatDuDossier}</span>
          </p>
          <p className="mt-4">
            <strong>Favorable :</strong>{" "}
            <span className="font-semibold">
              {favorableStatus === "Favorable" ? "✅ Favorable" : "❌ Pas favorable"}
            </span>
          </p>
        </div>

        {/* Mise à jour des informations */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Mise à jour des informations</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Revenu Annuel</label>
              <input
                type="number"
                defaultValue={client.RevenuAnnuel}
                className="border rounded-lg px-4 py-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Ratio d'Endettement</label>
              <input
                type="number"
                defaultValue={client.RatioEndettement}
                className="border rounded-lg px-4 py-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Montant Prêt</label>
              <input
                type="number"
                defaultValue={client.MontantPret}
                className="border rounded-lg px-4 py-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Durée Prêt (mois)</label>
              <input
                type="number"
                defaultValue={client.DureePret}
                className="border rounded-lg px-4 py-2 w-full"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Enregistrer
            </button>
          </form>
        </div>
      </div>

      {/* Boutons pour accepter ou refuser le prêt */}
      <div className="mt-8 w-full max-w-md flex justify-around">
        <button
          onClick={() => handleStatusUpdate(1)}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
        >
          Je valide le dossier
        </button>
        <button
          onClick={() => handleStatusUpdate(0)}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
        >
          Je ne valide pas le dossier
        </button>
      </div>
    </div>
  );
};

export default BorrowerPage;
