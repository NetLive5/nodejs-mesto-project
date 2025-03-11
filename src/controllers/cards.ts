import { NextFunction, Request, Response } from "express";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../errors/errors";
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

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(err);
  }
};

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, link } = req.body;
    const owner = req.user!._id;

    const card = await Card.create({ name, link, owner });
    return res.status(201).send(card);
  } catch (err) {
    if (err instanceof Error && err.name === "ValidationError") {
      return next(
        new BadRequestError(
          "Переданы некорректные данные при создании карточки"
        )
      );
    }
    return next(err);
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const userId = req.user!._id;

    const card = await Card.findById(cardId);

    if (!card) {
      return next(new NotFoundError("Карточка не найдена"));
    }

    if (card.owner.toString() !== userId) {
      return next(new ForbiddenError("Нет прав на удаление этой карточки"));
    }

    await Card.findByIdAndRemove(cardId);

    return res.send({ message: "Карточка удалена" });
  } catch (err) {
    if (err instanceof Error && err.name === "CastError") {
      return next(new BadRequestError("Некорректный id карточки"));
    }
    return next(err);
  }
};

export const likeCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user!._id } },
      { new: true }
    );

    if (!card) {
      return next(new NotFoundError("Карточка не найдена"));
    }

    return res.send(card);
  } catch (err) {
    if (err instanceof Error && err.name === "CastError") {
      return next(new BadRequestError("Некорректный id карточки"));
    }
    return next(err);
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user!._id } },
      { new: true }
    );

    if (!card) {
      return next(new NotFoundError("Карточка не найдена"));
    }

    return res.send(card);
  } catch (err) {
    if (err instanceof Error && err.name === "CastError") {
      return next(new BadRequestError("Некорректный id карточки"));
    }
    return next(err);
  }
};
