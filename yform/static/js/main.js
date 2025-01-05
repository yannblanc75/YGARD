document.querySelector("#addBorrowerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
  
    try {
      const response = await fetch("/api/emprunteurs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        e.target.reset();
      } else {
        const error = await response.json();
        alert(`Erreur : ${error.message}`);
      }
    } catch (error) {
      alert("Une erreur est survenue lors de l'envoi des données.");
      console.error(error);
    }
  });
  