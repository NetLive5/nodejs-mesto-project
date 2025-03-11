import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/errors";

interface tokenPayload {
  _id: string;
}

const { JWT_SECRET = "super-strong-secret" } = process.env;

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Необходима авторизация"));
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET) as tokenPayload;
    req.user = payload;
    next();
  } catch (err) {
    return next(new UnauthorizedError("Недействительный токен"));
  }
};
