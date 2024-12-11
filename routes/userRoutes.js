const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')

const verifToken = require("../middleware/verifToken");

router.get("/users", userController.getAllUsers);
router.post("/user", userController.createUser);
router.get("/user", verifToken, userController.getUsersbyID);
router.put("/user", verifToken, userController.updateUser);
router.delete("/user/:id", userController.deleteUser);
router.get("/user/:id/email", userController.getUserEmail);

module.exports = router;