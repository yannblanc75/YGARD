document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname;

    if (path === '/add') {
        const form = document.getElementById('borrowerForm');
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            try {
                const response = await fetch('/api/emprunteurs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                const result = await response.json();
                alert(result.message || 'Erreur lors de l\'ajout');
            } catch (error) {
                alert('Erreur : ' + error.message);
            }
        });
    }
});
