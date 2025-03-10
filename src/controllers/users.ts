import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Произошла ошибка на сервере' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }

    return res.send(user);
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(400).send({ message: 'Некорректный id пользователя' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(201).send(user);
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Переданы некорректные данные' });
    }
    return res.status(500).json({ message: 'Произошла ошибка на сервере' });
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Переданы некорректные данные' });
    }
    return res.status(500).json({ message: 'Произошла ошибка на сервере' });
  }
};
