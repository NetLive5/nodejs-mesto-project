import { NextFunction, Request, Response } from "express";

interface ResponseError extends Error {
  statusCode?: number;
  code?: number;
}

export const errorHandler = (
  err: ResponseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.code === 11000) {
    return res.status(409).send({
      message: "Пользователь с таким email уже существует",
    });
  }

  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
};
