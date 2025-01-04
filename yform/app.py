from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Configuration de la base de données
db_config = {
    'host': 'localhost',
    'user': 'root',  # Remplacez par votre utilisateur MySQL
    'password': 'root',  # Remplacez par votre mot de passe MySQL
    'database': 'banqueEvaluation'  # Assurez-vous que votre base de données a bien ce nom
}

# Page d'accueil
@app.route('/')
def home():
    return render_template('index.html')

# Route pour afficher les archives
@app.route('/archive')
def archive():
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Récupérer les données des clients récemment traités
        query = """
            SELECT Clients.ClientID, Clients.Prenom, Clients.Nom, Clients.Age, Sante.IMC, Historique.DossierMedical,
            (100 - (Clients.Age / 2) - (Sante.IMC / 10) - (5 * Historique.DossierMedical)) AS score_sante
            FROM Clients
            JOIN Sante ON Clients.ClientID = Sante.ClientID
            JOIN Historique ON Clients.ClientID = Historique.ClientID
            ORDER BY Clients.ClientID DESC
        """
        cursor.execute(query)
        clients = cursor.fetchall()
        return render_template('archive.html', clients=clients)
    except mysql.connector.Error as err:
        return f"Erreur: {err}"
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

# Route pour ajouter un emprunteur
@app.route('/add', methods=['GET'])
def add_form():
    return render_template('add_borrower.html')

@app.route('/api/emprunteurs', methods=['POST'])
def add_emprunteur():
    data = request.json
    connection = None
    try:
        poids = float(data['poids'])
        taille = float(data['taille'])
        age = int(data['age'])
        antecedents_medicaux = int(data['antecedents_medicaux'])
        score_employabilite = int(data['score_employabilite'])

        # Calcul du BMI
        imc = poids / ((taille / 100) ** 2)

        # Calcul du score santé
        score_sante = max(0, 100 - (age / 2) - (imc / 10) - (antecedents_medicaux * 5))

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Insérer les données dans la table Clients
        query_clients = """
            INSERT INTO Clients (Nom, Prenom, Age, Sexe, Profession, RevenuAnnuel, RatioEndettement, MontantPret, DureePret)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        client_values = (
            data['nom'],
            data['prenom'],
            age,
            "Non spécifié",
            "Profession inconnue",
            35000,
            0.35,
            data['montant'],
            12
        )
        cursor.execute(query_clients, client_values)

        # Récupérer l'ID du client nouvellement ajouté
        client_id = cursor.lastrowid

        # Insérer les données dans la table Sante
        query_sante = """
            INSERT INTO Sante (ClientID, Poids, Taille, IMC, ActivitePhysique, Tabagisme, ConsommationAlcool, MaladiesChroniques, ChirurgiesPassees, HospitalisationsRecente)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        sante_values = (
            client_id,
            poids,
            taille,
            imc,
            0,
            0,
            0,
            0,
            0,
            0
        )
        cursor.execute(query_sante, sante_values)

        # Insérer les données dans la table Historique
        query_historique = """
            INSERT INTO Historique (ClientID, DossierMedical, PretObtenu)
            VALUES (%s, %s, %s)
        """
        historique_values = (
            client_id,
            "Dossier médical par défaut",
            "Non"
        )
        cursor.execute(query_historique, historique_values)

        connection.commit()
        return jsonify({'message': 'Emprunteur ajouté avec succès!', 'score_sante': score_sante}), 201

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

# Lancer l'application Flask
if __name__ == '__main__':
    app.run(debug=True)
