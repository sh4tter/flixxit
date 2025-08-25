const mongoose = require("mongoose");
const Movie = require("./models/Movie");
require("dotenv").config();

const testTrending = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Get all movies
    const movies = await Movie.find();
    console.log(`Found ${movies.length} movies in database`);

    if (movies.length === 0) {
      console.log("No movies found. Please run sampleData.js first to populate the database.");
      process.exit(1);
    }

    // Simulate some view activity by incrementing views for random movies
    const viewIncrements = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    
    for (let i = 0; i < Math.min(movies.length, 10); i++) {
      const movie = movies[i];
      const increment = viewIncrements[i] || Math.floor(Math.random() * 50) + 1;
      
      await Movie.findByIdAndUpdate(movie._id, {
        $inc: { views: increment },
        $set: { lastViewed: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) } // Random time in last 24 hours
      });
      
      console.log(`Added ${increment} views to "${movie.title}"`);
    }

    // Display the trending movies
    const trendingMovies = await Movie.find()
      .sort({ views: -1, lastViewed: -1 })
      .limit(10)
      .select('title views lastViewed');

    console.log("\n🎬 Top 10 Trending Movies:");
    console.log("==========================");
    trendingMovies.forEach((movie, index) => {
      const date = movie.lastViewed ? movie.lastViewed.toLocaleDateString() : 'Never';
      console.log(`${index + 1}. ${movie.title} - ${movie.views} views (Last viewed: ${date})`);
    });

    console.log("\n✅ Trending data populated successfully!");
    console.log("💡 Now when users click on movies, the trending list will update automatically!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error testing trending:", error);
    process.exit(1);
  }
};

// Run the script
testTrending();

