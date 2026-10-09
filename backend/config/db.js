import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dialect = process.env.DB_DIALECT || 'mysql';
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 3306;
const username = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || 'root';
const database = process.env.DB_NAME || 'granite_tile_mms';
const ssl = process.env.DB_SSL === 'true';

let sequelize;

if (dialect === 'mysql') {
  const options = {
    host,
    port: Number(port),
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };

  if (ssl) {
    options.dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    };
  }

  sequelize = new Sequelize(database, username, password, options);
} else {
  // Embedded SQLite fallback
  const dbPath = path.join(__dirname, '..', 'granite_mms.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false
  });
}

export const connectDB = async (retries = 10, delay = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (dialect === 'mysql') {
        try {
          const connection = await mysql.createConnection({
            host,
            port: Number(port),
            user: username,
            password
          });
          await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
          await connection.end();
          console.log(`[Database] MySQL Database '${database}' checked / initialized.`);
        } catch (dbCreateErr) {
          console.warn(`[Database Warning]: Could not auto-create MySQL database '${database}': ${dbCreateErr.message}`);
        }
      }

      await sequelize.authenticate();
      console.log(`[Database] Connected successfully using ${sequelize.getDialect().toUpperCase()} dialect.`);
      return;
    } catch (error) {
      console.error(`[Database Connection Attempt ${attempt}/${retries} Error (${dialect})]:`, error.message);
      if (attempt < retries) {
        console.log(`[Database] Retrying connection in ${delay / 1000} seconds...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw error;
      }
    }
  }
};

export default sequelize;
