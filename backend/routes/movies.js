const router = require("express").Router();
const {
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieById,
  getRandomMovies,
  getAllMovies,
} = require("../controller/movies");
const verify = require("../verifyToken");

router.use(verify);

//CREATE
router.route("/").get(getAllMovies).post(createMovie);

//GET RANDOM - must come before /:id to avoid conflicts
router.get("/random", getRandomMovies);

//GET specific movie
router.get("/find/:id", getMovieById);

//UPDATE and DELETE - must come last
router.route("/:id").put(updateMovie).delete(deleteMovie);

module.exports = router;
