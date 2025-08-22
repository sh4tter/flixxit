const mongoose = require("mongoose");
const User = require("./models/User");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => {
    console.error("DB Connection Error:", err);
    process.exit(1);
  });

const createAdminUser = async () => {
  try {
    const adminEmail = "sunnydowari@gmail.com";
    const adminPassword = "admin123"; // Change this to your desired password
    const adminUsername = "admin";

    // Check if admin user already exists
    let adminUser = await User.findOne({ email: adminEmail });

    if (adminUser) {
      console.log("Admin user already exists. Updating password...");
      
      // Update the password
      adminUser.password = CryptoJS.AES.encrypt(
        adminPassword,
        process.env.SECRET_KEY
      ).toString();
      
      // Ensure isAdmin is set to true
      adminUser.isAdmin = true;
      
      await adminUser.save();
      console.log("Admin user password updated successfully!");
    } else {
      console.log("Creating new admin user...");
      
      // Create new admin user
      const newAdminUser = new User({
        username: adminUsername,
        email: adminEmail,
        password: CryptoJS.AES.encrypt(
          adminPassword,
          process.env.SECRET_KEY
        ).toString(),
        isAdmin: true,
      });
      
      await newAdminUser.save();
      console.log("Admin user created successfully!");
    }

    console.log("\nAdmin Login Credentials:");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("\nYou can now login to the admin panel with these credentials.");

  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
createAdminUser();
