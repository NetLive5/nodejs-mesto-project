import { errors } from "celebrate";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { createUser, login } from "./controllers/users";
import { auth } from "./middlewares/auth";
import { errorHandler } from "./middlewares/error-handler";
import { errorLogger } from "./middlewares/loger";
import { validateCreateUser, validateLogin } from "./middlewares/validation";
import cardRoutes from "./routes/card";
import userRoutes from "./routes/users";

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(errorLogger);
app.use(errors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/signin", validateLogin, login);
app.post("/signup", validateCreateUser, createUser);

app.use(auth);

app.use("/users", userRoutes);
app.use("/cards", cardRoutes);
app.use(errorHandler);
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Страница не найдена" });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

export default app;
