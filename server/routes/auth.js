const router = require("express").Router();
const { registerUser, loginUser, adminLogin } = require("../controller/auth");

//Register
router.post("/register", registerUser);

//login system
router.post("/login", loginUser);

router.post("/admin", adminLogin);

module.exports = router;
