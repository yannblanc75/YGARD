from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Configuration de la base de données
db_config = {
    'host': 'localhost',
    'user': 'root',  # Remplace par ton utilisateur MySQL
    'password': 'root',  # Remplace par ton mot de passe MySQL
    'database': 'dossiers_db'
}

# Route pour servir le formulaire HTML
@app.route('/')
def form_page():
    return render_template('index.html')  # Assurez-vous que `index.html` est dans un dossier `templates`

# Route pour ajouter un emprunteur
@app.route('/api/emprunteurs', methods=['POST'])
def add_emprunteur():
    data = request.json
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        query = """
            INSERT INTO emprunteurs (prenom, nom, montant, statut, score_sante, score_employabilite)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (
            data['prenom'],
            data['nom'],
            data['montant'],
            'En attente',  # Statut par défaut
            data['score_sante'],
            data['score_employabilite']
        )
        cursor.execute(query, values)
        connection.commit()
        return jsonify({'message': 'Emprunteur ajouté avec succès!'}), 201
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    app.run(debug=True)
