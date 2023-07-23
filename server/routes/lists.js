const router = require("express").Router();
const { createList, deleteList, getAllLists } = require("../controller/list");
const verify = require("../verifyToken");

router.use(verify);

//CREATE
router.route("/").post(createList).get(getAllLists);

//DELETE
router.delete("/:id", deleteList);

module.exports = router;
