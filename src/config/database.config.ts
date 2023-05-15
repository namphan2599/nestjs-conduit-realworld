import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  // for dev mode
  synchronize: true,
}));