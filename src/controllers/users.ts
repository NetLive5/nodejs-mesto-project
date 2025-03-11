import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/errors";
import User from "../models/user";

const JWT_SECRET = "super-strong-secret";

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!._id;
    const user = await User.findById(userId);

    if (!user) {
      return next(new NotFoundError("Пользователь не найден"));
    }
    return res.status(200).send(user);
  } catch (err) {
    return next(err);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return next(new NotFoundError("Пользователь не найден"));
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof Error && err.name === "CastError") {
      return next(new BadRequestError("Некорректный id пользователя"));
    }
    return next(err);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    return res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "ValidationError") {
      return next(
        new BadRequestError(
          "Переданы некорректные данные при создании пользователя"
        )
      );
    }
    return next(err);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { name, about },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new NotFoundError("Пользователь не найден"));
    }

    return res.status(200).json(user);
  } catch (err) {
    if (err instanceof Error && err.name === "ValidationError") {
      return next(
        new BadRequestError(
          "Переданы некорректные данные при обновлении профиля"
        )
      );
    }
    return next(err);
  }
};

export const updateUserAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new NotFoundError("Пользователь не найден"));
    }

    return res.status(200).json(user);
  } catch (err) {
    if (err instanceof Error && err.name === "ValidationError") {
      return next(
        new BadRequestError(
          "Переданы некорректные данные при обновлении аватара"
        )
      );
    }
    return next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new UnauthorizedError("Неправильные почта или пароль"));
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 604800000,
      httpOnly: true,
      sameSite: true,
    });
    return res.send({ token, message: "Авторизация успешна" });
  } catch (err) {
    return next(err);
  }
};
