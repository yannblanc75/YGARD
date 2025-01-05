import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5002/clients")
      .then((response) => response.json())
      .then((data) => setClients(data))
      .catch((error) => console.error("Erreur lors de la récupération des clients :", error));
  }, []);

  const handleViewDetails = (client) => {
    navigate("/borrower", { state: client });
  };

  const getStatus = (etatDuDossier) => {
    switch (etatDuDossier) {
      case 1:
        return "✅ Accepté";
      case 0:
        return "❌ Refusé";
      case 2:
      default:
        return "⏳ Non traité";
    }
  
  };

  const filteredClients = clients.filter((client) =>
    `${client.Prenom} ${client.Nom}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 flex flex-col items-center">
      <header className="w-full py-6 bg-white shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">YGARD Dashboard</h1>
        <div className="mt-4 flex justify-center">
          <input
            type="text"
            placeholder="Rechercher un client..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>
      <main className="flex-1 w-full max-w-5xl mt-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.ClientID} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800">
              {client.Prenom} {client.Nom}
            </h2>
            <p className="text-gray-700">Montant du prêt : {client.MontantPret.toLocaleString()} €</p>
            <p className="text-gray-700">Durée : {client.DureePret} mois</p>
            <p className="text-gray-700 font-semibold">Statut : {getStatus(client.etatDuDossier)}</p>
            <button
              onClick={() => handleViewDetails(client)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Voir le dossier
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default AdminDashboard;
