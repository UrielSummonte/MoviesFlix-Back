import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.mjs"
import {
  getAllMoviesController,
  getMovieByIdController,
  //getMoviesByGenreController,
  //getMoviesForProfileController,
  // insertarFilmController,
  // editarFilmByIdController,
  // eliminarFilmByIdController,
} from "../controllers/movieController.mjs";

const router = express.Router();

//router.get("/profile/:profileId", verifyToken, getMoviesForProfileController);
router.get("/", getAllMoviesController);
//router.get("/movie/:genre", getMoviesByGenreController);
router.get("/:id", getMovieByIdController);


export default router;
