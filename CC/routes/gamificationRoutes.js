const express = require("express");
const router = express.Router();
const gamificationController = require("../controllers/gamificationController");

const verifToken = require("../middleware/verifToken")

router.post("/points", verifToken, gamificationController.awardPoints);
router.post("/achievement", verifToken, gamificationController.addAchievement);
router.get("/leaderboards", verifToken, gamificationController.getLeaderboard);
router.post("/rankup", verifToken, gamificationController.incrementScore);
router.get("/trackStreak/:id", verifToken, gamificationController.trackStreak);

module.exports = router; 
