const List = require("../models/List");

const createList = async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    try {
      const savedList = await newList.save();
      res.status(201).json(savedList);
    } catch (err) {
      console.error("Create list error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(403).json({ message: "You are not allowed!" });
  }
};

const updateList = async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedList = await List.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (!updatedList) {
        return res.status(404).json({ message: "List not found" });
      }
      res.status(200).json(updatedList);
    } catch (err) {
      console.error("Update list error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(403).json({ message: "You are not allowed!" });
  }
};

const deleteList = async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const deletedList = await List.findByIdAndDelete(req.params.id);
      if (!deletedList) {
        return res.status(404).json({ message: "List not found" });
      }
      res.status(200).json({ message: "The list has been deleted..." });
    } catch (err) {
      console.error("Delete list error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(403).json({ message: "You are not allowed!" });
  }
};

const getAllLists = async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];
  try {
    if (typeQuery === "top10") {
      // Special handling for Top 10 list
      list = await List.find({ isTop10: true }).sort({ order: 1, createdAt: -1 }).limit(1);
    } else if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery, isTop10: { $ne: true } } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, isTop10: { $ne: true } } },
        ]);
      }
    } else {
      list = await List.aggregate([
        { $match: { isTop10: { $ne: true } } },
        { $sample: { size: 10 } }
      ]);
    }
    
    if (!list || list.length === 0) {
      return res.status(404).json({ message: "No lists found" });
    }
    
    res.status(200).json(list);
  } catch (err) {
    console.error("Get all lists error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllListsForAdmin = async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const lists = await List.find().sort({ order: 1, createdAt: -1 });
      res.status(200).json(lists);
    } catch (err) {
      console.error("Get all lists for admin error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(403).json({ message: "You are not allowed!" });
  }
};

module.exports = {
  createList,
  updateList,
  deleteList,
  getAllLists,
  getAllListsForAdmin,
};
