# Yform - Gestion des Profils Clients

Yform est une application web Flask permettant de gérer et d'analyser des profils clients. Ce projet utilise une base de données MySQL pour stocker des informations relatives aux clients, à leur santé, et à leur historique médical. L'objectif principal est de fournir un outil simple et efficace pour visualiser, analyser et gérer ces données.

## Fonctionnalités

- **Visualisation des clients :** Affiche une liste complète des clients avec leurs informations de santé et d'historique.
- **Profils détaillés :** Permet d'afficher les détails d'un client, y compris un graphique d'analyse de ses habitudes et un score de santé.
- **Ajout de nouveaux clients :** Interface pour ajouter de nouveaux clients et leurs données associées.
- **Édition des profils :** Modification des informations d'un client.
- **Analyse graphique :** Visualisation des habitudes de vie (tabac, alcool, activité physique, etc.) et suivi des tendances des scores de santé.

## Captures d'écran

### Liste des clients
![Liste des clients](chemin/vers/limage/liste_clients.png)

### Profil d'un client
![Profil d'un client](chemin/vers/limage/profil_client.png)

## Prérequis

- **Python 3.10+**
- **MySQL** (serveur et client)
- **Bibliothèques Python** :
  - Flask
  - Flask-CORS
  - mysql-connector-python
  - Chart.js (intégré dans le front-end)

## Installation

1. Clonez le répertoire :
   ```bash
   git clone https://github.com/votreutilisateur/yform.git
   cd yform
   ```

2. Créez et activez un environnement virtuel :
   ```bash
   python3 -m venv env
   source env/bin/activate  # Sous Windows : env\Scripts\activate
   ```

3. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```

4. Configurez la base de données MySQL :
   - Importez le fichier SQL fourni (par exemple `banqueEvaluation.sql`) dans votre serveur MySQL.
   - Mettez à jour les informations de connexion dans `app.py` :
     ```python
     db_config = {
         'host': 'localhost',
         'user': 'root',
         'password': 'root',
         'database': 'banqueEvaluation'
     }
     ```

5. Lancez l'application :
   ```bash
   python app.py --port=5001
   ```

6. Accédez à l'application dans votre navigateur :
   ```
   http://127.0.0.1:5001
   ```

## Structure du projet

```
.
├── app.py                 # Code principal de l'application Flask
├── templates/             # Fichiers HTML (Jinja2)
│   ├── index.html         # Page d'accueil
│   ├── archive.html       # Liste des clients
│   ├── profile.html       # Profil d'un client
│   └── add_borrower.html  # Formulaire d'ajout de client
├── static/
│   ├── css/               # Fichiers CSS pour le style
│   │   ├── style.css
│   │   ├── archives.css
│   │   └── profile.css
│   └── js/                # Scripts JavaScript (Chart.js inclus)
├── requirements.txt       # Liste des dépendances Python
├── README.md              # Documentation du projet
└── banqueEvaluation.sql   # Script pour créer la base de données MySQL
```

## Utilisation

### Ajout d'un nouveau client
- Rendez-vous à l'URL `/add` pour accéder au formulaire d'ajout de client.
- Renseignez les informations demandées et soumettez le formulaire.

### Visualisation des clients
- Accédez à l'URL `/archive` pour consulter la liste des clients.
- Cliquez sur un client pour voir son profil détaillé.

### Analyse graphique
- Sur la page de profil d'un client, visualisez :
  - Un graphique en camembert des habitudes.
  - Un graphique en ligne des tendances des scores de santé.

## Auteurs

Projet développé par : 
  - Yann BLANC
  - Julien BONNET
  - Yanisse ISMAILLI

