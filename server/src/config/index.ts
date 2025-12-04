import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL!,
  },
  
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'spl-access-secret-key-2024',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'spl-refresh-secret-key-2024',
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  
  bcrypt: {
    saltRounds: 12,
  },
};
