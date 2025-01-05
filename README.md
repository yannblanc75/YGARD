# YGARD Dashboard

## Description

**YGARD Dashboard** est une application web conçue pour gérer et évaluer les dossiers de demande de prêts bancaires. Elle permet à un administrateur de visualiser les demandes de prêts des clients, de les trier en fonction de leur statut (accepté, refusé, ou en attente), et de mettre à jour leurs informations. L'application se connecte à une base de données MySQL pour stocker et manipuler les données.

## Fonctionnalités principales

- **Visualisation des dossiers** : Affichage des dossiers clients avec des informations telles que le montant demandé, la durée du prêt et le statut actuel.
- **Filtres de tri** : Filtrer les dossiers par statut (accepté, refusé, en attente ou tous).
- **Mise à jour des informations** : Modifier les informations du client directement depuis l'application.
- **Gestion des statuts** : Valider ou refuser un dossier en un clic.
- **Recherche** : Recherche en temps réel parmi les clients.

## Structure du projet

```
YGARD/
├── admin-dashboard/         # Code du frontend
│   ├── src/
│   │   ├── components/     # Composants React (AdminDashboard, BorrowerPage...)
│   │   ├── App.jsx         # Point d'entrée de l'application React
│   │   └── ...
│   ├── public/             # Assets publics
│   └── ...
├── app.py                  # API Flask pour gérer les données
├── requirements.txt        # Dépendances Python
└── README.md               # Documentation du projet
```

## Technologies utilisées

### Frontend
- **React.js** : Framework JavaScript pour la création d'interfaces utilisateur modernes et dynamiques.
- **Tailwind CSS** : Framework CSS pour un design réactif et esthétique.

### Backend
- **Flask** : Framework Python léger pour créer l'API RESTful.
- **MySQL** : Base de données relationnelle pour le stockage des informations clients.

## Installation et exécution

### Prérequis
- Python 3.x
- Node.js et npm
- MySQL

### Instructions

#### 1. Cloner le dépôt
```bash
git clone https://github.com/votre-repo/YGARD.git
cd YGARD
```

#### 2. Configuration du backend
1. Créez un environnement virtuel :
   ```bash
   python -m venv venv
   source venv/bin/activate  # Sous Windows : venv\Scripts\activate
   ```
2. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```
3. Configurez la base de données MySQL et mettez à jour les paramètres dans `app.py`.
4. Lancez le serveur Flask :
   ```bash
   python app.py
   ```

#### 3. Configuration du frontend
1. Accédez au répertoire `admin-dashboard` :
   ```bash
   cd admin-dashboard
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le serveur de développement React :
   ```bash
   npm start
   ```

### Accès
- **Backend** : `http://127.0.0.1:5002`
- **Frontend** : `http://localhost:5173`

## Collaboration

Ce projet a été réalisé avec passion et engagement par :
- **Yann BLANC**
- **Julien BONNET**
- **Yanisse IMSAILLI**
