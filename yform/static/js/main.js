document.querySelector("#addBorrowerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Récupérer les données du formulaire
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    console.log("Données envoyées :", data); // Débogage

    try {
        // Envoyer les données au backend
        const response = await fetch("/api/emprunteurs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        // Gérer la réponse du backend
        if (response.ok) {
            const result = await response.json();
            alert(result.message); // Message de succès
            e.target.reset(); // Réinitialiser le formulaire
        } else {
            const error = await response.json();
            alert(`Erreur : ${error.message}`); // Afficher le message d'erreur
        }
    } catch (error) {
        // Gérer les erreurs de communication
        alert("Une erreur est survenue lors de l'envoi des données.");
        console.error(error);
    }
});
