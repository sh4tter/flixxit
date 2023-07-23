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

router.route("/:id").put(updateMovie).delete(deleteMovie);

//GET
router.get("/find/:id", getMovieById);

//GET RANDOM
router.get("/random", getRandomMovies);

module.exports = router;
