const CryptoJS = require("crypto-js");
const User = require("../models/User");

const updateUser = async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      const { password, ...userInfo } = updateUser._doc;
      res.status(200).json(userInfo);
    } catch (err) {
      console.error("Update user error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(403).json({ message: "You can update only your account!" });
  }
};

const deleteUser = async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User has been deleted..." });
    } catch (err) {
      console.error("Delete user error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(403).json({ message: "You can delete only your account!" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();
      const usersWithoutPassword = users.map(user => {
        const { password, ...userInfo } = user._doc;
        return userInfo;
      });
      res.status(200).json(usersWithoutPassword);
    } catch (err) {
      console.error("Get all users error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(403).json({ message: "You are not allowed to see all users" });
  }
};

const getUserStats = async (req, res) => {
  const today = new Date();
  // eslint-disable-next-line no-unused-vars
  const lastYear = today.setFullYear(today.setFullYear() - 1);
  // eslint-disable-next-line no-unused-vars
  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    console.error("Get user stats error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
  getUserStats,
};
