const express = require("express");
const router = express.Router();
const {
    recommendBook,
    handleUserRecommendation // Add the new function for genr
} = require("../controllers/recomenController");

const userController = require('../controllers/userController');

// Routes for book recommendations
router.get("/recommend-book", recommendBook);
router.get("/process-client-response", handleUserRecommendation);
router.post("/process-client-response", handleUserRecommendation);

module.exports = router;
