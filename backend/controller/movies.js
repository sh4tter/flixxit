const Movie = require("../models/Movie");

const createMovie = async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);
    try {
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (err) {
      console.error("Create movie error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(403).json({ message: "You are not allowed!" });
  }
};

const updateMovie = async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (!updatedMovie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.status(200).json(updatedMovie);
    } catch (err) {
      console.error("Update movie error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(403).json({ message: "You are not allowed!" });
  }
};

const deleteMovie = async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
      if (!deletedMovie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.status(200).json({ message: "The movie has been deleted..." });
    } catch (err) {
      console.error("Delete movie error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(403).json({ message: "You are not allowed!" });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(movie);
  } catch (err) {
    console.error("Get movie error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRandomMovies = async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    
    if (!movie || movie.length === 0) {
      return res.status(404).json({ message: "No movies found" });
    }
    
    res.status(200).json(movie);
  } catch (err) {
    console.error("Get random movies error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllMovies = async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const movies = await Movie.find();
      res.status(200).json(movies.reverse());
    } catch (err) {
      console.error("Get all movies error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(403).json({ message: "You are not allowed!" });
  }
};

module.exports = {
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieById,
  getRandomMovies,
  getAllMovies,
};
