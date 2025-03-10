import { Request, Response } from "express";
import Card from "../models/card";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
      };
    }
  }
}

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Произошла ошибка на сервере" });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const owner = req.user!._id;

    const card = await Card.create({ name, link, owner });
    return res.status(201).send(card);
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.name === "ValidationError") {
      return res.status(400).send({ message: "Переданы некорректные данные" });
    }
    return res.status(500).send({ message: "Произошла ошибка на сервере" });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndRemove(cardId);

    if (!card) {
      return res.status(404).send({ message: "Карточка не найдена" });
    }

    return res.send({ message: "Карточка удалена" });
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.name === "CastError") {
      return res.status(400).send({ message: "Некорректный id карточки" });
    }
    return res.status(500).send({ message: "Произошла ошибка на сервере" });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user!._id } }, // добавить _id в массив, если его там нет
      { new: true }
    );

    if (!card) {
      return res.status(404).json({ message: "Карточка не найдена" });
    }

    return res.send(card);
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.name === "CastError") {
      return res.status(400).json({ message: "Некорректный id карточки" });
    }
    return res.status(500).json({ message: "Произошла ошибка на сервере" });
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user!._id } },
      { new: true }
    );

    if (!card) {
      return res.status(404).json({ message: "Карточка не найдена" });
    }

    return res.status(200).json(card);
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.name === "CastError") {
      return res.status(400).json({ message: "Некорректный id карточки" });
    }
    return res.status(500).json({ message: "Произошла ошибка на сервере" });
  }
};
