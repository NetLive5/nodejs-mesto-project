import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cardRoutes from "./routes/card";
import userRoutes from "./routes/users";

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: "67ce99317c44171064683500",
  };

  next();
});

app.use(express.json());
app.use("/users", userRoutes);
app.use("/cards", cardRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

export default app;
