import cors from "cors";
import { errors } from "celebrate";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { createUser, login } from "./controllers/users";
import { NotFoundError } from "./errors/errors";
import { auth } from "./middlewares/auth";
import { errorHandler } from "./middlewares/error-handler";
import { errorLogger, requestLogger } from "./middlewares/loger";
import { validateCreateUser, validateLogin } from "./middlewares/validation";
import cardRoutes from "./routes/card";
import userRoutes from "./routes/users";

const app = express();
const PORT = 3000;
dotenv.config();

const allowedOrigins = ["https://domainname.students2510.nomorepartiessbs.ru"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post("/signin", validateLogin, login);
app.post("/signup", validateCreateUser, createUser);

app.use(auth);
app.use("/users", userRoutes);
app.use("/cards", cardRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError("Маршрут не найден"));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

export default app;
