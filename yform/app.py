from flask import Flask, request, jsonify, render_template, redirect, url_for
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
@app.route('/archive', methods=['GET'])
def archive():
    search_query = request.args.get('search', '').strip()
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
            WHERE Clients.Nom LIKE %s OR Clients.Prenom LIKE %s
            ORDER BY Clients.ClientID DESC
        """
        cursor.execute(query, (f'%{search_query}%', f'%{search_query}%'))
        clients = cursor.fetchall()

        for client in clients:
            imc = float(client['IMC'])
            age = client['Age']
            antecedents = 0  # À définir avec les données réelles
            client['score_sante'] = max(0, 100 - (age / 2) - (imc / 10) - (antecedents * 5))

        return render_template('archive.html', clients=clients)
    except mysql.connector.Error as err:
        return f"Erreur: {err}"
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()


# Ajouter un emprunteur
@app.route('/add', methods=['GET'])
def add_form():
    return render_template('add_borrower.html')


@app.route('/api/emprunteurs', methods=['POST'])
def add_emprunteur():
    data = request.json
    required_fields = [
        'name', 'dob', 'email', 'profession', 'gender',
        'height', 'weight', 'blood_pressure', 'physical_activity',
        'smoking', 'alcohol_consumption', 'chronic_diseases',
        'past_surgeries', 'recent_hospitalizations', 'history'
    ]

    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({'error': f"Les champs suivants sont manquants : {', '.join(missing_fields)}"}), 400

    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Séparer prénom et nom
        full_name = data['name'].strip().split(" ")
        if len(full_name) < 2:
            return jsonify({'error': "Le champ 'Nom Complet' doit inclure à la fois un prénom et un nom."}), 400

        prenom = full_name[0]
        nom = " ".join(full_name[1:])

        # Vérifier si l'emprunteur existe déjà
        dob_to_age = 2025 - int(data['dob'].split("-")[0])
        query_check = "SELECT * FROM Clients WHERE Nom = %s AND Prenom = %s AND Age = %s"
        cursor.execute(query_check, (nom, prenom, dob_to_age))
        existing_client = cursor.fetchone()

        if existing_client:
            return jsonify({'message': 'Erreur : Cet emprunteur existe déjà.'}), 400

        # Insertion dans Clients
        query_clients = """
            INSERT INTO Clients (Nom, Prenom, Age, Sexe, Profession, RevenuAnnuel, RatioEndettement, MontantPret, DureePret, email)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query_clients, (
            nom, prenom, dob_to_age, data['gender'], data['profession'],
            35000, 0.35, 15000, 12, data['email']
        ))
        client_id = cursor.lastrowid

        # Insertion dans Sante
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

        # Insertion dans Historique
        query_historique = "INSERT INTO Historique (ClientID, DossierMedical, PretObtenu) VALUES (%s, %s, %s)"
        cursor.execute(query_historique, (client_id, data['history'], 'Non'))

        connection.commit()
        return jsonify({'message': 'Emprunteur ajouté avec succès!'}), 201
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()


# Profil d'un client
@app.route('/profile/<int:client_id>', methods=['GET'])
def profile(client_id):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT Clients.*, Sante.Tabagisme, Sante.ConsommationAlcool, 
                   Sante.ActivitePhysique, Sante.ChirurgiesPassees, Sante.IMC, Clients.Age, Clients.EstFavorable
            FROM Clients
            JOIN Sante ON Clients.ClientID = Sante.ClientID
            WHERE Clients.ClientID = %s
        """
        cursor.execute(query, (client_id,))
        client = cursor.fetchone()

        if not client:
            return f"Client avec ID {client_id} non trouvé.", 404

        habits_data = {
            'labels': ['Tabac', 'Alcool', 'Activité Physique', 'Chirurgies'],
            'values': [
                client.get('Tabagisme', 0),
                client.get('ConsommationAlcool', 0),
                client.get('ActivitePhysique', 0),
                client.get('ChirurgiesPassees', 0)
            ]
        }

        cursor.execute("SELECT Clients.ClientID, (100 - (Age / 2) - (IMC / 10)) AS score_sante FROM Clients JOIN Sante ON Clients.ClientID = Sante.ClientID")
        scores = cursor.fetchall()

        score_data = {
            'labels': [f"Client {row['ClientID']}" for row in scores],
            'values': [float(row['score_sante']) for row in scores]
        }

        return render_template('profile.html', client=client, habits_data=habits_data, score_data=score_data)
    except mysql.connector.Error as err:
        return f"Erreur: {err}"
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/profile/<int:client_id>/favorable', methods=['POST'])
def update_est_favorable(client_id):
    est_favorable = request.form.get('est_favorable')
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        query = "UPDATE Clients SET EstFavorable = %s WHERE ClientID = %s"
        cursor.execute(query, (est_favorable, client_id))
        connection.commit()
        return redirect(url_for('profile', client_id=client_id))
    except mysql.connector.Error as err:
        return f"Erreur : {err}"
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            
@app.route('/api/search_clients', methods=['GET'])
def search_clients():
    # Récupérer le terme de recherche depuis les paramètres de la requête
    query = request.args.get('query', '').strip()
    connection = None

    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Recherche dans les colonnes Nom et Prénom
        search_query = """
            SELECT Clients.ClientID, Clients.Prenom, Clients.Nom, Clients.Age, 
                   Sante.IMC, Sante.Poids, Sante.Taille, Historique.DossierMedical
            FROM Clients
            JOIN Sante ON Clients.ClientID = Sante.ClientID
            JOIN Historique ON Clients.ClientID = Historique.ClientID
            WHERE Clients.Nom LIKE %s OR Clients.Prenom LIKE %s
            ORDER BY Clients.ClientID DESC
        """
        # Ajouter les wildcards pour une recherche partielle
        like_query = f"%{query}%"
        cursor.execute(search_query, (like_query, like_query))
        clients = cursor.fetchall()

        # Calculer le score santé
        for client in clients:
            imc = float(client['IMC'])
            age = client['Age']
            antecedents = 0  # Vous pouvez ajuster cette valeur selon vos données
            client['score_sante'] = max(0, 100 - (age / 2) - (imc / 10) - (antecedents * 5))

        return jsonify(clients)

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()


if __name__ == '__main__':
    app.run(debug=True, port=5001)
