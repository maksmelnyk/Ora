#!/bin/bash
set -eo pipefail

# --- Validate Required Environment Variables ---
required_vars=(
  POSTGRES_USER 
  POSTGRES_PASSWORD 
  KEYCLOAK_DB_USER 
  KEYCLOAK_DB_PASS 
  PROFILE_DB_USER 
  PROFILE_DB_PASS 
  LEARNING_DB_USER 
  LEARNING_DB_PASS 
  SCHEDULING_DB_USER 
  SCHEDULING_DB_PASS 
  PAYMENT_DB_USER 
  PAYMENT_DB_PASS 
  CHAT_DB_USER 
  CHAT_DB_PASS
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: variable '$var' must not be null." >&2
    exit 1
  fi
done

# --- Mapping for Each Microservice Database ---
declare -A db_configs=(
  ["keycloak"]="${KEYCLOAK_DB_USER}:${KEYCLOAK_DB_PASS}"
  ["profile"]="${PROFILE_DB_USER}:${PROFILE_DB_PASS}"
  ["learning"]="${LEARNING_DB_USER}:${LEARNING_DB_PASS}"
  ["scheduling"]="${SCHEDULING_DB_USER}:${SCHEDULING_DB_PASS}"
  ["payment"]="${PAYMENT_DB_USER}:${PAYMENT_DB_PASS}"
  ["chat"]="${CHAT_DB_USER}:${CHAT_DB_PASS}"
)

# --- Function: Create Role, Database, and Grant Privileges ---
create_role_and_db() {
  local dbname="$1"
  local dbuser="$2"
  local dbpass="$3"

  echo "Initializing database '$dbname' with owner '$dbuser'..."

  # Create the role if it does not exist.
  psql --username "$POSTGRES_USER" --dbname=postgres <<EOSQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = '$dbuser') THEN
    EXECUTE format('CREATE ROLE %I LOGIN PASSWORD %L', '$dbuser', '$dbpass');
  END IF;
END
\$\$;
EOSQL

  # Conditionally create the database (CREATE DATABASE must execute outside a transaction block)
  DB_EXISTS=$(psql --username "$POSTGRES_USER" --dbname=postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$dbname'")
  if [ "$DB_EXISTS" != "1" ]; then
    echo "Creating database '$dbname' with owner '$dbuser'..."
    psql --username "$POSTGRES_USER" --dbname=postgres -c "CREATE DATABASE \"$dbname\" WITH OWNER = \"$dbuser\""
  else
    echo "Database '$dbname' already exists. Skipping creation."
  fi

  # Grant privileges on the database.
  psql --username "$POSTGRES_USER" --dbname=postgres <<EOSQL
GRANT ALL PRIVILEGES ON DATABASE "$dbname" TO "$dbuser";
EOSQL

  echo "Done initializing '$dbname'."
}

# --- Main Loop: Initialize Each Database ---
echo "Starting Postgres initialization..."

for db in "${!db_configs[@]}"; do
  IFS=':' read -r dbuser dbpass <<< "${db_configs[$db]}"
  create_role_and_db "$db" "$dbuser" "$dbpass"
done

echo "Postgres initialization complete."
