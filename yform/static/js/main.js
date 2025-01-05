document.querySelector("#searchBar").addEventListener("input", async (e) => {
    const query = e.target.value.trim();

    try {
        // Requête GET au backend avec le terme de recherche
        const response = await fetch(`/api/search_clients?query=${encodeURIComponent(query)}`);
        if (response.ok) {
            const clients = await response.json();
            updateClientList(clients); // Mettre à jour la liste des clients
        } else {
            console.error("Erreur lors de la récupération des résultats.");
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
});

function updateClientList(clients) {
    const clientList = document.querySelector(".client-list");
    clientList.innerHTML = ""; // Vider la liste actuelle

    // Construire la liste de clients
    clients.forEach((client) => {
        const clientCard = document.createElement("div");
        clientCard.className = "client-card";

        clientCard.innerHTML = `
            <div>
                <h3>${client.Prenom} ${client.Nom}</h3>
                <p>Score Santé : ${client.score_sante.toFixed(2)}%</p>
            </div>
            <div class="progress-bar">
                <span style="width: ${client.score_sante}%;"></span>
            </div>
        `;

        clientList.appendChild(clientCard);
    });
}
