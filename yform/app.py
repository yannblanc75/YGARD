from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector
from decimal import Decimal

app = Flask(__name__)
CORS(app)

# Configuration de la base de données
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'banqueEvaluation'
}

# Page d'accueil
@app.route('/')
def home():
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Récupérer le nombre total de clients
        query = "SELECT COUNT(*) FROM Clients"
        cursor.execute(query)
        total_clients = cursor.fetchone()[0]

        return render_template('index.html', total_clients=total_clients)
    except mysql.connector.Error as err:
        return f"Erreur: {err}"
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

# Route pour afficher les archives
@app.route('/archive')
def archive():
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT Clients.ClientID, Clients.Prenom, Clients.Nom, Clients.Age, 
                   Sante.IMC, Sante.Poids, Sante.Taille, Historique.DossierMedical
            FROM Clients
            JOIN Sante ON Clients.ClientID = Sante.ClientID
            JOIN Historique ON Clients.ClientID = Historique.ClientID
            ORDER BY Clients.ClientID DESC
        """
        cursor.execute(query)
        clients = cursor.fetchall()

        for client in clients:
            imc = float(client['IMC'])
            age = client['Age']
            poids = float(client['Poids'])
            antecedents = 0  # À définir avec les données réelles
            client['score_sante'] = max(0, 100 - (age / 2) - (imc / 10) - (antecedents * 5))

        return render_template('archive.html', clients=clients)
    except mysql.connector.Error as err:
        return f"Erreur: {err}"
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/add', methods=['GET'])
def add_form():
    return render_template('add_borrower.html')

@app.route('/api/emprunteurs', methods=['POST'])
def add_emprunteur():
    data = request.json
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Vérifier si l'emprunteur existe déjà
        query_check = """
            SELECT * FROM Clients WHERE Nom = %s AND Prenom = %s AND Age = %s
        """
        dob_to_age = 2025 - int(data['dob'].split("-")[0])
        cursor.execute(query_check, (data['name'], data['email'], dob_to_age))
        existing_client = cursor.fetchone()

        if existing_client:
            return jsonify({'message': 'Erreur : Cet emprunteur existe déjà.'}), 400

        # Insérer les données du client
        query_clients = """
            INSERT INTO Clients (Nom, Prenom, Age, Sexe, Profession, RevenuAnnuel, RatioEndettement, MontantPret, DureePret)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query_clients, (
            data['name'], data['email'], dob_to_age, 'Non spécifié', data['profession'],
            35000, 0.35, 15000, 12
        ))
        client_id = cursor.lastrowid

        # Insérer les données de santé
        query_sante = """
            INSERT INTO Sante (
                ClientID, Poids, Taille, IMC, PressionArterielle, ActivitePhysique,
                Tabagisme, ConsommationAlcool, MaladiesChroniques, ChirurgiesPassees,
                HospitalisationsRecente
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        imc = float(data['weight']) / ((float(data['height']) / 100) ** 2)
        cursor.execute(query_sante, (
            client_id, data['weight'], data['height'], imc, data['blood_pressure'],
            data['physical_activity'], data['smoking'], data['alcohol_consumption'],
            data['chronic_diseases'], data['past_surgeries'], data['recent_hospitalizations']
        ))

        # Historique
        query_historique = """
            INSERT INTO Historique (ClientID, DossierMedical, PretObtenu)
            VALUES (%s, %s, %s)
        """
        cursor.execute(query_historique, (client_id, data['history'], 'Non'))

        connection.commit()
        return jsonify({'message': 'Emprunteur ajouté avec succès!'}), 201

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()


if __name__ == '__main__':
    app.run(debug=True, port=5001)
