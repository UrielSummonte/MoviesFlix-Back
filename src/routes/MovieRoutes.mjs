import express from "express";
//import { verifyToken } from "../middlewares/authMiddleware.mjs"
import { getMoviesValidation } from '../middlewares/validationMiddleware.mjs'
import {
  getAllMoviesController,
  getMovieByIdController,
  //getMoviesByGenreController,
} from "../controllers/movieController.mjs";

const router = express.Router();


router.get("/", getMoviesValidation, getAllMoviesController);
//router.get("/movie/:genre", getMoviesByGenreController);
router.get("/:id", getMovieByIdController);


export default router;
