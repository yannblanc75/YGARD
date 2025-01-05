import os
import sys
import pytest
from faker import Faker

# Ajouter le répertoire parent (contenant app.py) au chemin de recherche
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import mysql.connector
import json
from app import app, db_config

db_config = {
    'user': 'root',
    'password': 'root',
    'host': 'localhost',
    'database': 'banqueEvaluation'
}

faker = Faker()

@pytest.fixture
def client():
    """Fixture pour configurer le client Flask pour les tests."""
    with app.test_client() as client:
        yield client

@pytest.fixture(autouse=True)
def clean_database():
    """Nettoie la base de données avant chaque test."""
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    # Supprimer les données de test ajoutées par faker
    cursor.execute("DELETE FROM Clients WHERE email LIKE '%@example.com'")
    connection.commit()

    cursor.close()
    connection.close()

def generate_unique_profile():
    """Génère un profil aléatoire unique qui n'existe pas dans la base de données."""
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    while True:
        # Générer des données fictives
        name = faker.name()
        email = faker.email()
        dob = faker.date_of_birth(minimum_age=18, maximum_age=80).strftime("%Y-%m-%d")
        profession = faker.job()
        gender = faker.random_element(elements=("Homme", "Femme"))
        height = faker.random_int(min=150, max=200)
        weight = faker.random_int(min=50, max=120)
        blood_pressure = f"{faker.random_int(min=90, max=140)}/{faker.random_int(min=60, max=90)}"
        physical_activity = faker.random_int(min=0, max=10)
        smoking = faker.random_int(min=0, max=20)
        alcohol_consumption = faker.random_int(min=0, max=10)
        chronic_diseases = faker.sentence(nb_words=3)
        past_surgeries = faker.sentence(nb_words=4)
        recent_hospitalizations = faker.sentence(nb_words=5)
        history = faker.random_element(elements=("Oui", "Non"))

        # Vérifier si le profil existe déjà
        query_check = "SELECT * FROM Clients WHERE Nom = %s OR email = %s"
        cursor.execute(query_check, (name, email))
        existing_client = cursor.fetchone()

        if not existing_client:
            connection.close()
            return {
                'name': name,
                'email': email,
                'dob': dob,
                'profession': profession,
                'gender': gender,
                'height': height,
                'weight': weight,
                'blood_pressure': blood_pressure,
                'physical_activity': physical_activity,
                'smoking': smoking,
                'alcohol_consumption': alcohol_consumption,
                'chronic_diseases': chronic_diseases,
                'past_surgeries': past_surgeries,
                'recent_hospitalizations': recent_hospitalizations,
                'history': history
            }

def debug_response(response):
    """Affiche le statut et les données de réponse pour le débogage."""
    print("Statut :", response.status_code)
    print("Données de réponse :", json.loads(response.data.decode('utf-8')))

def test_add_borrower_page(client):
    """Test pour vérifier que la page d'ajout d'emprunteur est accessible."""
    response = client.get('/add')
    assert response.status_code == 200
    assert b'Ajouter un Emprunteur' in response.data

def test_add_borrower_submission_success(client):
    """Test pour vérifier l'ajout d'un emprunteur avec des données valides."""
    profile = generate_unique_profile()

    response = client.post('/api/emprunteurs', json=profile)

    # Débogage
    debug_response(response)

    # Assertions
    assert response.status_code == 201  # Vérifie que la requête est réussie
    assert json.loads(response.data.decode('utf-8')).get('message') == 'Emprunteur ajouté avec succès!'

def test_add_borrower_missing_field(client):
    """Test pour vérifier le comportement en cas de champ manquant."""
    profile = generate_unique_profile()
    del profile['email']  # Supprime un champ pour provoquer une erreur

    response = client.post('/api/emprunteurs', json=profile)

    # Débogage
    debug_response(response)

    # Assertions
    assert response.status_code == 400  # Vérifie que la requête échoue
    assert 'email' in json.loads(response.data.decode('utf-8')).get('error', '')
