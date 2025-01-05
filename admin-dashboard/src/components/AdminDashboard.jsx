import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5002/clients")
      .then((response) => response.json())
      .then((data) => setClients(data))
      .catch((error) => console.error("Erreur lors de la récupération des clients :", error));
  }, []);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.Nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.Prenom.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "accepted" && client.etatDuDossier === 1) ||
      (filter === "refused" && client.etatDuDossier === 0) ||
      (filter === "pending" && client.etatDuDossier === 2);

    return matchesSearch && matchesFilter;
  });

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

  const viewClient = (client) => {
    navigate(`/borrower`, { state: client });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-6">YGARD Dashboard</h1>

        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full md:w-1/3 mb-4 md:mb-0"
          />

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg ${
                filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter("accepted")}
              className={`px-4 py-2 rounded-lg ${
                filter === "accepted" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Acceptés
            </button>
            <button
              onClick={() => setFilter("refused")}
              className={`px-4 py-2 rounded-lg ${
                filter === "refused" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Refusés
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg ${
                filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              En attente
            </button>
          </div>
        </div>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div key={client.ClientID} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800">
                {client.Prenom} {client.Nom}
              </h2>
              <p className="text-gray-700">Montant du prêt : {client.MontantPret.toLocaleString()} €</p>
              <p className="text-gray-700">Durée : {client.DureePret} mois</p>
              <p className="text-gray-700 font-semibold">Statut : {getStatus(client.etatDuDossier)}</p>
              <button
                onClick={() => viewClient(client)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Voir le dossier
              </button>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
