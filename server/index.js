const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const router = require("./routes/index.js");
const cors = require("cors");
const path = require("path");

//ignoring env files in git
dotenv.config();
// Serve the React app's index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
//connect to mongodb using mongoose using .env file

app.use(express.json());

app.use(
  cors({
    origin: "https://flixxit-backend-blueyottle.vercel.app",
    credentials: true,
  })
);
app.options("*", cors());

app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: false,
  })
);

//use the auth router, to get the user
app.use("/api", router);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connection Successfull"))
  .catch((err) => {
    console.error(err);
  });

app.listen(8800, () => {
  console.log(`server is running`);
});
