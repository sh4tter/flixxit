const router = require("express").Router();
const verify = require("../verifyToken");
const {
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
  getUserStats,
} = require("../controller/users");

//GET ALL
router.get("/", verify, getAllUsers);

//GET USER STATS - must come before /:id to avoid conflicts
router.get("/stats", getUserStats);

//GET specific user
router.get("/find/:id", getUserById);

//Update
router.put("/:id", verify, updateUser);

//Delete
router.delete("/:id", verify, deleteUser);

module.exports = router;
