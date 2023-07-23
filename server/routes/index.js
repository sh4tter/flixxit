const router = require("express").Router();

router.use("/api/auth", authRoute);
router.use("/api/users", userRoute);
router.use("/api/movies", movieRoute);
router.use("/api/lists", listRoute);

module.exports = { router };
