import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.format(),
    });
  }
  return res
    .status(500)
    .json({ success: false, message: "Internal server error" });
};
