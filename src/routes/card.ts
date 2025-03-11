import { Router } from "express";
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from "../controllers/cards";
import { validateCardId, validateCreateCard } from "../middlewares/validation";

const router = Router();

router.get("/", getCards);
router.post("/", createCard, validateCreateCard);
router.delete("/:cardId", deleteCard, validateCardId);
router.put("/:cardId/likes", likeCard, validateCardId);
router.delete("/:cardId/likes", dislikeCard, validateCardId);

export default router;
