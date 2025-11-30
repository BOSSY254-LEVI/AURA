import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface JWTClaims {
  sub: string;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
}

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Token generation
export const generateToken = (user: { id: string; email: string; name?: string }): string => {
  return jwt.sign(
    { 
      sub: user.id, 
      email: user.email, 
      name: user.name 
    }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );
};

// Authentication middleware
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTClaims;
      req.user = { claims: decoded };
      next();
    } catch (jwtError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Authentication failed' });
  }
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        claims: JWTClaims;
      };
    }
  }
}

export function setupAuth(app: any) {
  // JWT authentication setup - no additional middleware needed
  console.log('JWT authentication setup complete');
}