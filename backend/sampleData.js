const mongoose = require("mongoose");
const Movie = require("./models/Movie");
require("dotenv").config();

// Sample movies data with view counts
const sampleMovies = [
  {
    title: "Wednesday",
    desc: "A supernatural mystery series following Wednesday Addams as she navigates her new school.",
    img: "https://via.placeholder.com/400x600/000000/FFFFFF?text=Wednesday",
    imgTitle: "Wednesday",
    imgSm: "https://via.placeholder.com/200x300/000000/FFFFFF?text=Wednesday",
    trailer: "https://www.youtube.com/watch?v=Di310WS8zLk",
    video: "https://www.youtube.com/watch?v=Di310WS8zLk",
    year: "2022",
    limit: 16,
    genre: "Mystery",
    isSeries: true,
    views: 15420,
    lastViewed: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    title: "Great Indian Family",
    desc: "A heartwarming family drama about cultural identity and acceptance.",
    img: "https://via.placeholder.com/400x600/000000/FFFFFF?text=Great+Indian+Family",
    imgTitle: "Great Indian Family",
    imgSm: "https://via.placeholder.com/200x300/000000/FFFFFF?text=Great+Indian+Family",
    trailer: "https://www.youtube.com/watch?v=example1",
    video: "https://www.youtube.com/watch?v=example1",
    year: "2023",
    limit: 12,
    genre: "Drama",
    isSeries: false,
    views: 12850,
    lastViewed: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
  },
  {
    title: "Raid 2",
    desc: "An action-packed sequel following the intense police operations.",
    img: "https://via.placeholder.com/400x600/000000/FFFFFF?text=Raid+2",
    imgTitle: "Raid 2",
    imgSm: "https://via.placeholder.com/200x300/000000/FFFFFF?text=Raid+2",
    trailer: "https://www.youtube.com/watch?v=example2",
    video: "https://www.youtube.com/watch?v=example2",
    year: "2021",
    limit: 18,
    genre: "Action",
    isSeries: false,
    views: 11230,
    lastViewed: new Date(Date.now() - 1000 * 60 * 60 * 6) // 6 hours ago
  },
  {
    title: "Maareesan",
    desc: "A romantic comedy about love and relationships in modern times.",
    img: "https://via.placeholder.com/400x600/000000/FFFFFF?text=Maareesan",
    imgTitle: "Maareesan",
    imgSm: "https://via.placeholder.com/200x300/000000/FFFFFF?text=Maareesan",
    trailer: "https://www.youtube.com/watch?v=example3",
    video: "https://www.youtube.com/watch?v=example3",
    year: "2023",
    limit: 12,
    genre: "Romance",
    isSeries: false,
    views: 9870,
    lastViewed: new Date(Date.now() - 1000 * 60 * 60 * 8) // 8 hours ago
  },
  {
    title: "Squid Game",
    desc: "A thrilling survival drama where contestants play deadly games for money.",
    img: "https://via.placeholder.com/400x600/000000/FFFFFF?text=Squid+Game",
    imgTitle: "Squid Game",
    imgSm: "https://via.placeholder.com/200x300/000000/FFFFFF?text=Squid+Game",
    trailer: "https://www.youtube.com/watch?v=example4",
    video: "https://www.youtube.com/watch?v=example4",
    year: "2021",
    limit: 18,
    genre: "Thriller",
    isSeries: true,
    views: 8760,
    lastViewed: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
  },
  {
    title: "Saas Bahu Saga",
    desc: "A family drama exploring the complex relationships between mothers-in-law and daughters-in-law.",
    img: "https://via.placeholder.com/400x600/000000/FFFFFF?text=Saas+Bahu+Saga",
    imgTitle: "Saas Bahu Saga",
    imgSm: "https://via.placeholder.com/200x300/000000/FFFFFF?text=Saas+Bahu+Saga",
    trailer: "https://www.youtube.com/watch?v=example5",
    video: "https://www.youtube.com/watch?v=example5",
    year: "2022",
    limit: 12,
    genre: "Drama",
    isSeries: true,
    views: 7650,
    lastViewed: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    title: "The Last Kingdom",
    desc: "A historical drama set in medieval England during the Viking invasions.",
    img: "https://via.placeholder.com/400x600/000000/FFFFFF?text=The+Last+Kingdom",
    imgTitle: "The Last Kingdom",
    imgSm: "https://via.placeholder.com/200x300/000000/FFFFFF?text=The+Last+Kingdom",
    trailer: "https://www.youtube.com/watch?v=example6",
    video: "https://www.youtube.com/watch?v=example6",
    year: "2020",
    limit: 16,
    genre: "Historical",
    isSeries: true,
    views: 6540,
    lastViewed: new Date(Date.now() - 1000 * 60 * 60 * 36) // 1.5 days ago
  },
  {
    title: "Money Heist",
    desc: "A group of robbers attempt to pull off the biggest heist in Spanish history.",
    img: "https://via.placeholder.com/400x600/000000/FFFFFF?text=Money+Heist",
    imgTitle: "Money Heist",
    imgSm: "https://via.placeholder.com/200x300/000000/FFFFFF?text=Money+Heist",
    trailer: "https://www.youtube.com/watch?v=example7",
    video: "https://www.youtube.com/watch?v=example7",
    year: "2017",
    limit: 18,
    genre: "Crime",
    isSeries: true,
    views: 5430,
    lastViewed: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
  },
  {
    title: "Stranger Things",
    desc: "When a young boy disappears, his mother must confront terrifying forces to get him back.",
    img: "https://via.placeholder.com/400x600/000000/FFFFFF?text=Stranger+Things",
    imgTitle: "Stranger Things",
    imgSm: "https://via.placeholder.com/200x300/000000/FFFFFF?text=Stranger+Things",
    trailer: "https://www.youtube.com/watch?v=example8",
    video: "https://www.youtube.com/watch?v=example8",
    year: "2016",
    limit: 16,
    genre: "Sci-Fi",
    isSeries: true,
    views: 4320,
    lastViewed: new Date(Date.now() - 1000 * 60 * 60 * 72) // 3 days ago
  },
  {
    title: "Breaking Bad",
    desc: "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student.",
    img: "https://via.placeholder.com/400x600/000000/FFFFFF?text=Breaking+Bad",
    imgTitle: "Breaking Bad",
    imgSm: "https://via.placeholder.com/200x300/000000/FFFFFF?text=Breaking+Bad",
    trailer: "https://www.youtube.com/watch?v=example9",
    video: "https://www.youtube.com/watch?v=example9",
    year: "2008",
    limit: 18,
    genre: "Crime",
    isSeries: true,
    views: 3210,
    lastViewed: new Date(Date.now() - 1000 * 60 * 60 * 96) // 4 days ago
  }
];

const populateSampleData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Clear existing movies
    await Movie.deleteMany({});
    console.log("Cleared existing movies");

    // Insert sample movies
    const insertedMovies = await Movie.insertMany(sampleMovies);
    console.log(`Successfully inserted ${insertedMovies.length} movies`);

    // Display the trending movies
    const trendingMovies = await Movie.find()
      .sort({ views: -1, lastViewed: -1 })
      .limit(10)
      .select('title views');

    console.log("\nTop 10 Trending Movies:");
    trendingMovies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} - ${movie.views} views`);
    });

    console.log("\nSample data populated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error populating sample data:", error);
    process.exit(1);
  }
};

// Run the script
populateSampleData();
