import { Request } from "express";

// Extend the Express Request interface to include userId
// This allows us to access req.userId in our route handlers
declare module "express" {
  export interface Request {
    userId?: number;
  }
}