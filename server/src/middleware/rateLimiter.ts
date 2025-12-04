import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { ApiResponse } from '../types';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Muitas requisições. Por favor, tente novamente em alguns minutos.',
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Muitas tentativas de login. Por favor, tente novamente em 15 minutos.',
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: 'Limite de requisições excedido. Por favor, aguarde um momento.',
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false,
});

export const scrapingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Limite de consultas excedido. Por favor, aguarde antes de tentar novamente.',
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false,
});
