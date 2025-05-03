import express from "express";
import { getMoviesValidation } from '../middlewares/validationMiddleware.mjs'
import {
  getAllMoviesController,
  getMovieByIdController,
} from "../controllers/movieController.mjs";

const router = express.Router();

router.get("/", getMoviesValidation, getAllMoviesController);
router.get("/:id", getMovieByIdController);

export default router;
