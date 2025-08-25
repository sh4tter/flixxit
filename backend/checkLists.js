const mongoose = require("mongoose");
const List = require("./models/List");
require("dotenv").config();

const checkLists = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    const lists = await List.find();
    console.log(`\nCurrent lists in database (${lists.length} total):`);
    
    if (lists.length === 0) {
      console.log("No lists found in database.");
    } else {
      lists.forEach((list, i) => {
        console.log(`${i + 1}. ${list.title}`);
        console.log(`   Type: ${list.type}`);
        console.log(`   Genre: ${list.genre}`);
        console.log(`   Movies: ${list.content.length}`);
        console.log(`   Top 10: ${list.isTop10}`);
        console.log(`   Order: ${list.order}`);
        console.log(`   ID: ${list._id}`);
        console.log("");
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkLists();
