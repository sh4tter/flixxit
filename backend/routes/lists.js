const router = require("express").Router();
const { createList, updateList, deleteList, getAllLists, getAllListsForAdmin } = require("../controller/list");
const verify = require("../verifyToken");

router.use(verify);

//CREATE
router.route("/").post(createList).get(getAllLists);

//GET ALL LISTS FOR ADMIN - must come before /:id to avoid conflicts
router.get("/admin/all", getAllListsForAdmin);

//UPDATE and DELETE - must come last
router.route("/:id").put(updateList).delete(deleteList);

module.exports = router;
