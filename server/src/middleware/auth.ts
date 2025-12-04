import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthRequest, JwtPayload, ApiResponse, GlobalRole, CompanyRole } from '../types';

export const authenticate = (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido',
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
      });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erro na autenticação',
    });
  }
};

export const requireGlobalRole = (...roles: GlobalRole[]) => {
  return (req: AuthRequest, res: Response<ApiResponse>, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado',
      });
    }
    
    if (!roles.includes(req.user.globalRole)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso não autorizado para este perfil',
      });
    }
    
    next();
  };
};

export const requireCompanyRole = (...roles: CompanyRole[]) => {
  return (req: AuthRequest, res: Response<ApiResponse>, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado',
      });
    }
    
    if (req.user.globalRole === 'MASTER') {
      return next();
    }
    
    if (!req.user.companyRole || !roles.includes(req.user.companyRole)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso não autorizado para este nível de permissão',
      });
    }
    
    next();
  };
};

export const requireCompanyAccess = (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado',
    });
  }
  
  if (req.user.globalRole === 'MASTER') {
    return next();
  }
  
  if (!req.user.activeCompanyId) {
    return res.status(403).json({
      success: false,
      message: 'Nenhuma empresa selecionada',
    });
  }
  
  next();
};

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
      req.user = decoded;
    }
    
    next();
  } catch {
    next();
  }
};
