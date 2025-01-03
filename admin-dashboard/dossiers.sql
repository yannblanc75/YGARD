-- Créer la base de données
CREATE DATABASE IF NOT EXISTS dossiers_db;

-- Utiliser la base de données
USE dossiers_db;

-- Table pour les emprunteurs
CREATE TABLE IF NOT EXISTS emprunteurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    statut VARCHAR(50) NOT NULL DEFAULT 'En attente', -- Favorable / Non favorable / En attente
    score_sante INT NOT NULL,
    score_employabilite INT NOT NULL
);

-- Table pour les décisions
CREATE TABLE IF NOT EXISTS decisions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emprunteur_id INT NOT NULL,
    utilisateur VARCHAR(100) NOT NULL,
    decision VARCHAR(50) NOT NULL, -- Validé / Non validé
    date_decision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emprunteur_id) REFERENCES emprunteurs(id)
);

-- Ajouter des données initiales
INSERT INTO emprunteurs (prenom, nom, montant, statut, score_sante, score_employabilite)
VALUES
    ('Jean', 'Dupont', 25000.00, 'En attente', 85, 92),
    ('Marie', 'Martin', 15000.00, 'En attente', 78, 88);
