import express from "express";
import { getMoviesValidation } from '../middlewares/validationMiddleware.mjs'
import {
  getAllMoviesController,
  getMovieByIdController,
  getUserStatsController
} from "../controllers/movieController.mjs";

const router = express.Router();

router.get("/", getMoviesValidation, getAllMoviesController);
router.get("/:id", getMovieByIdController);
router.get("/users/stats", getUserStatsController);

export default router;
