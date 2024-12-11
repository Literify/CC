const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')

const verifToken = require("../middleware/verifToken");

router.post("/user", userController.createUser);
router.get("/user", userController.getAllUsers);
router.get("/user/:username/email", userController.getUserEmail);
router.get("/user/:id", verifToken, userController.getUsersbyID);
router.put("/user/:id", verifToken, userController.updateUser);
router.delete("/user/:id", userController.deleteUser);

module.exports = router;