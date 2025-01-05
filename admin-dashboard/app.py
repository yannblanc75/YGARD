from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Connexion à la base de données MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",  # Remplacez par votre utilisateur MySQL
    password="root",  # Remplacez par votre mot de passe MySQL
    database="banqueEvaluation"
)

@app.route('/clients', methods=['GET'])
def get_clients():
    try:
        cursor = db.cursor(dictionary=True)  # Retourne les résultats sous forme de dictionnaires
        cursor.execute("SELECT * FROM Clients")
        clients = cursor.fetchall()
        cursor.close()
        return jsonify(clients), 200
    except Exception as e:
        print(f"Erreur : {e}")
        return jsonify({"error": "Erreur lors de la récupération des clients"}), 500

@app.route('/update-client', methods=['POST'])
def update_client():
    data = request.json
    client_id = data.get('ClientID')
    revenu_annuel = data.get('RevenuAnnuel')
    ratio_endettement = data.get('RatioEndettement')
    montant_pret = data.get('MontantPret')
    duree_pret = data.get('DureePret')

    try:
        cursor = db.cursor()
        query = """
            UPDATE Clients
            SET RevenuAnnuel = %s, RatioEndettement = %s, MontantPret = %s, DureePret = %s
            WHERE ClientID = %s
        """
        cursor.execute(query, (revenu_annuel, ratio_endettement, montant_pret, duree_pret, client_id))
        db.commit()
        cursor.close()
        return jsonify({"message": "Les informations ont été mises à jour avec succès."}), 200
    except Exception as e:
        print("Erreur:", e)
        return jsonify({"error": "Erreur lors de la mise à jour des données."}), 500

@app.route('/update-client-status', methods=['POST'])
def update_client_status():
    data = request.json
    client_id = data.get('ClientID')
    etat_du_dossier = data.get('etatDuDossier')

    try:
        cursor = db.cursor()
        query = """
            UPDATE Clients
            SET etatDuDossier = %s
            WHERE ClientID = %s
        """
        cursor.execute(query, (etat_du_dossier, client_id))
        db.commit()
        cursor.close()
        return jsonify({"message": "État du dossier mis à jour avec succès."}), 200
    except Exception as e:
        print("Erreur:", e)
        return jsonify({"error": "Erreur lors de la mise à jour de l'état du dossier."}), 500

@app.route('/client-status/<int:client_id>', methods=['GET'])
def get_client_status(client_id):
    try:
        cursor = db.cursor(dictionary=True)
        query = "SELECT etatDuDossier, EstFavorable FROM Clients WHERE ClientID = %s"
        cursor.execute(query, (client_id,))
        result = cursor.fetchone()
        cursor.close()
        if result:
            status_map = {0: "Refusé", 1: "Accepté", 2: "Non traité"}
            status = status_map.get(result["etatDuDossier"], "Inconnu")
            favorable = "Favorable" if result["EstFavorable"] == 1 else "Pas favorable"
            return jsonify({"etatDuDossier": status, "EstFavorable": favorable}), 200
        else:
            return jsonify({"error": "Client introuvable."}), 404
    except Exception as e:
        print("Erreur:", e)
        return jsonify({"error": "Erreur lors de la récupération de l'état du dossier."}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5002)
