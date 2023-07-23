const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");
const listRoute = require("./routes/lists");
const cors = require("cors");

//ignoring env files in git
dotenv.config();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.options(
  "*",
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
  express.urlencoded({
    extended: false,
  })
);
//connect to mongodb using mongoose using .env file
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

app.use(express.json());
//use the auth router, to get the user
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);

app.listen(8800, () => {
  console.log(`server is running`);
});
