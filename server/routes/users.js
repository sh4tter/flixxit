const router = require("express").Router();
const verify = require("../verifyToken");
const {
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
  getUserStats,
} = require("../controller/users");

//Update
router.put("/:id", verify, updateUser);

//Delete
router.delete("/:id", verify, deleteUser);

//GET
router.get("/find/:id", getUserById);

//GET ALL
router.get("/", verify, getAllUsers);

//GET USER STATS
router.get("/stats", getUserStats);

module.exports = router;
