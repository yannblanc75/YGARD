# YGARD - Application de Gestion d'Emprunteurs

## Description

YGARD est une application web moderne conçue pour les administrateurs et les banquiers afin de gérer efficacement les emprunteurs. L'application permet :

- **D'afficher un tableau de bord** des emprunteurs avec leurs informations et leurs statuts.
- **D'ajouter des emprunteurs** via un formulaire.
- **De prendre des décisions** (valider ou rejeter un dossier) et d'enregistrer ces décisions.
- **D'utiliser un contexte global** pour gérer les utilisateurs connectés et les décisions.

## Fonctionnalités

1. **Tableau de bord dynamique :**
   - Affiche les emprunteurs existants avec leurs scores et montants.
   - Permet de naviguer vers les détails d'un emprunteur.

2. **Gestion des emprunteurs :**
   - Ajout d'emprunteurs via un formulaire HTML.
   - Sauvegarde des informations dans une base de données MySQL.

3. **Prise de décisions :**
   - Les administrateurs peuvent valider ou refuser un dossier.
   - Les décisions sont sauvegardées dans la base de données avec un suivi des utilisateurs responsables.

4. **Interface utilisateur moderne :**
   - Stylée avec Tailwind CSS et animations fluides.

---

## Structure du Projet

### **Frontend**
- **Technologies :** React, React Router, Tailwind CSS
- **Composants principaux :**
  - `AdminDashboard`: Tableau de bord des emprunteurs.
  - `BorrowerPage`: Page de détails d'un emprunteur.
  - `App`: Composant racine.

### **Backend**
- **Technologie :** Flask (Python)
- **API :**
  - POST `/api/emprunteurs` : Ajoute un emprunteur.
  - POST `/api/decisions` : Enregistre une décision.
  - GET `/api/decisions` : Récupère toutes les décisions.

### **Base de Données**
- **SGBD :** MySQL
- **Tables principales :**
  - `emprunteurs` : Contient les informations des emprunteurs.
  - `decisions` : Contient les décisions liées aux emprunteurs.

---

## Prérequis

- Node.js (version 16 ou supérieure)
- Python 3.10 ou supérieur
- MySQL

---

## Installation et Lancement

### **1. Configuration de la Base de Données**

1. Connectez-vous à MySQL et créez la base de données :
   ```sql
   CREATE DATABASE dossiers_db;
   ```

2. Créez les tables :
   ```sql
   CREATE TABLE emprunteurs (
       id INT AUTO_INCREMENT PRIMARY KEY,
       prenom VARCHAR(100) NOT NULL,
       nom VARCHAR(100) NOT NULL,
       montant DECIMAL(10, 2) NOT NULL,
       statut VARCHAR(50) NOT NULL DEFAULT 'En attente',
       score_sante INT NOT NULL,
       score_employabilite INT NOT NULL
   );

   CREATE TABLE decisions (
       id_decision INT AUTO_INCREMENT PRIMARY KEY,
       id_emprunteur INT,
       decision VARCHAR(255),
       date_decision DATETIME,
       FOREIGN KEY (id_emprunteur) REFERENCES emprunteurs(id)
   );
   ```

### **2. Installation des Dépendances**

#### **Frontend**

1. Naviguez dans le répertoire du projet :
   ```bash
   cd YGARD
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez l'application :
   ```bash
   npm run dev
   ```

#### **Backend**

1. Naviguez dans le répertoire du backend (contenant `app.py`) :
   ```bash
   cd yform
   ```

2. Installez les dépendances Python :
   ```bash
   pip install flask flask-cors mysql-connector-python
   ```

3. Lancez le serveur Flask :
   ```bash
   python app.py
   ```

### **3. Accédez à l'Application**

- Frontend : [http://localhost:5173](http://localhost:5173)
- Backend API : [http://localhost:5000](http://localhost:5000)

---

## Auteurs

- **Yann BLANC**
- **Julien BONNET**
- **Yanisse ISMAILLI**