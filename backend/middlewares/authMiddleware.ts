import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { asyncHandler } from "../lib/asyncHandler";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser | null;
  }
}

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - No token provided",
        });
      }

      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret) as JwtPayload;

      const user = await User.findById(decoded.id).select(
        "-password -__v -authType"
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - Invalid token",
        });
      }

      req.user = user;
      return next();
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
        error: error.message,
      });
    }
  }
);
