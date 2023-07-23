const router = require("express").Router();
const authRoute = require("./auth");
const userRoute = require("./users.js");
const movieRoute = require("./movies.js");
const listRoute = require("./lists.js");

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/movies", movieRoute);
router.use("/lists", listRoute);

module.exports = router;
