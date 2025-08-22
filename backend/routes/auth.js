const router = require("express").Router();
const { registerUser, loginUser, adminLogin } = require("../controller/auth");
const verify = require("../verifyToken");

//Register
router.post("/register", registerUser);

//login system
router.post("/login", loginUser);

router.post("/admin", adminLogin);

//verify token
router.get("/verify", verify, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Verify token error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
