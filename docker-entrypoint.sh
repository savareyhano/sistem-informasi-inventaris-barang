#!/bin/bash
set -e

# Start PostgreSQL in the background
docker-entrypoint.sh postgres &

# Wait for PostgreSQL to start up
echo "Waiting for PostgreSQL to start..."
until pg_isready -U "$POSTGRES_USER"; do
  sleep 1
done

# Check if the database exists
echo "Checking if database $POSTGRES_DB exists..."
if psql -U "$POSTGRES_USER" -lqt | cut -d \| -f 1 | grep -qw "$POSTGRES_DB"; then
  echo "Database $POSTGRES_DB already exists. Dropping it..."
  psql -U "$POSTGRES_USER" -c "DROP DATABASE $POSTGRES_DB;"
else
  echo "Database $POSTGRES_DB does not exist."
fi

# Create the database
echo "Creating the database $POSTGRES_DB..."
createdb -U "$POSTGRES_USER" "$POSTGRES_DB"

# Restore the database
echo "Restoring the database..."
pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v /tmp/db.sql

# Keep PostgreSQL in the foreground
wait
