const { createdb, dropdb } = require('pgtools');
const { exec } = require('child_process');
require('dotenv').config();
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
};

const databaseName = process.env.PGDATABASE;
const dumpFilePath = './database/db.sql';

class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

async function createDatabase() {
  try {
    await createdb(config, databaseName);
  } catch (error) {
    throw new DatabaseError(`Error creating database: ${error}`);
  }
}

async function restoreDatabase() {
  return new Promise((resolve, reject) => {
    const restoreCommand = `pg_restore -U ${config.user} -d ${databaseName} -v ${dumpFilePath}`;

    exec(
      restoreCommand,
      { env: { PGPASSWORD: config.password } },
      (error) => {
        if (error) {
          reject(new DatabaseError(`Error restoring database: ${error}`));
        } else {
          console.log('Database restored successfully');
          resolve();
        }
      },
    );
  });
}

async function dropDatabase() {
  try {
    await dropdb(config, databaseName);
  } catch (error) {
    throw new DatabaseError(`Error dropping database: ${error}`);
  }
}

async function setupDatabase() {
  try {
    await createDatabase();
    await restoreDatabase();
    process.exit(0);
  } catch (error) {
    if (
      error instanceof DatabaseError
      && error.message.includes('duplicate_database')
    ) {
      readline.question(
        `Database ${process.env.PGDATABASE} already exists. Proceed with restoration? Existing data will be replaced. (Y/N) `,
        async (answer) => {
          if (answer.toLowerCase() === 'y') {
            try {
              await dropDatabase();
              await createDatabase();
              await restoreDatabase();
            } catch (err) {
              console.error('Error setting up database:', err);
            }
          } else {
            console.log('Operation cancelled.');
          }
          readline.close();
        },
      );
    } else {
      console.error('Error setting up database:', error);
      process.exit(1);
    }
  }
}

setupDatabase();
