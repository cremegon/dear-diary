import dotenv from "dotenv";
dotenv.config();

interface Config {
  db: {
    user: string;
    password: string;
    host: string;
    database: string;
    port: number;
  };
  jwtSecret: string;
  cryptoSecret: string;
  serverPort: number;
}

export const config = {
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
  },
  jwtSecret: process.env.JWT_SECRETKEY,
  cryptoSecret: process.env.CRYPTO_SECREYKEY,
  serverPort: Number(process.env.PORT) || 5000,
};
