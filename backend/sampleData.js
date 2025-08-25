const mongoose = require("mongoose");
const Movie = require("./models/Movie");
const List = require("./models/List");
require("dotenv").config();

// Sample movies data with view counts
const sampleMovies = [
  {
    title: "Wednesday",
    desc: "A supernatural mystery series following Wednesday Addams as she navigates her new school.",
    img: null,
    imgTitle: "Wednesday",
    imgSm: null,
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
    img: null,
    imgTitle: "Great Indian Family",
    imgSm: null,
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
    img: null,
    imgTitle: "Raid 2",
    imgSm: null,
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
    img: null,
    imgTitle: "Maareesan",
    imgSm: null,
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
    img: null,
    imgTitle: "Squid Game",
    imgSm: null,
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
    img: null,
    imgTitle: "Saas Bahu Saga",
    imgSm: null,
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
    img: null,
    imgTitle: "The Last Kingdom",
    imgSm: null,
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
    img: null,
    imgTitle: "Money Heist",
    imgSm: null,
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
    img: null,
    imgTitle: "Stranger Things",
    imgSm: null,
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
    img: null,
    imgTitle: "Breaking Bad",
    imgSm: null,
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

    // Create sample lists with movie content
    const sampleLists = [
      {
        title: "Trending Now",
        type: "trending",
        genre: "Mixed",
        content: insertedMovies.slice(0, 5).map(movie => movie._id), // First 5 movies
        isTop10: false,
        order: 1
      },
      {
        title: "Top 10 Movies",
        type: "top10",
        genre: "Mixed",
        content: insertedMovies.slice(0, 10).map(movie => movie._id), // First 10 movies
        isTop10: true,
        order: 0
      },
      {
        title: "Action & Adventure",
        type: "action",
        genre: "Action",
        content: insertedMovies.filter(movie => movie.genre.toLowerCase().includes('action')).slice(0, 3).map(movie => movie._id),
        isTop10: false,
        order: 2
      }
    ];

    // Clear existing lists
    await List.deleteMany({});
    console.log("Cleared existing lists");

    // Insert sample lists
    const insertedLists = await List.insertMany(sampleLists);
    console.log(`Successfully inserted ${insertedLists.length} lists`);

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
