#!/bin/bash

# Variables de configuration
DB_HOST="localhost"  # Hôte MySQL
DB_USER="root"  # Utilisateur MySQL
DB_PASS="root"  # Mot de passe MySQL
DB_NAME="banqueEvaluation"  # Nom de la base de données

# Fonction pour vérifier la connexion MySQL
check_mysql_connection() {
  echo "Vérification de la connexion à MySQL..."
  mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME;" > /dev/null 2>&1

  if [ $? -eq 0 ]; then
    echo "Connexion MySQL réussie."
  else
    echo "Impossible de se connecter à MySQL. Vérifiez vos paramètres de connexion."
    exit 1
  fi
}

# Lancer les étapes
check_mysql_connection
