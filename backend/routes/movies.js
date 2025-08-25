const router = require("express").Router();
const {
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieById,
  getRandomMovies,
  getAllMovies,
  getTrendingMovies,
  incrementMovieViews,
} = require("../controller/movies");
const verify = require("../verifyToken");

router.use(verify);

//CREATE
router.route("/").get(getAllMovies).post(createMovie);

//GET RANDOM - must come before /:id to avoid conflicts
router.get("/random", getRandomMovies);

//GET TRENDING - must come before /:id to avoid conflicts
router.get("/trending", getTrendingMovies);

//INCREMENT MOVIE VIEWS (for testing)
router.post("/increment-views", incrementMovieViews);

//GET specific movie
router.get("/find/:id", getMovieById);

//UPDATE and DELETE - must come last
router.route("/:id").put(updateMovie).delete(deleteMovie);

module.exports = router;
