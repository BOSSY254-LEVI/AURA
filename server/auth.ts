import { Strategy as LocalStrategy } from "passport-local";
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

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}

export function setupAuth(app: any) {
  // Passport local strategy for login
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email: string, password: string, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Invalid credentials" });
          }

          const isValidPassword = await bcrypt.compare(password, user.passwordHash);
          if (!isValidPassword) {
            return done(null, false, { message: "Invalid credentials" });
          }

          return done(null, { id: user.id, email: user.email, name: user.firstName });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: AuthUser, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, { id: user.id, email: user.email, name: user.firstName });
    } catch (error) {
      done(error);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());
}
=======
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

export function setupAuth(app: any) {
  // JWT authentication setup - no additional middleware needed
}
