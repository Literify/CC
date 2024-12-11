const express = require("express");
const router = express.Router();
const { genre } = require("../dummy/genre");
const { popular_week, popular_view, popular_month } = require("../dummy/random_book");
// const { popular_week: popularWeek, popular_month: popularMonth } = require("../dummy/random_book");

router.get("/genre", genre);
router.get("/populer-week", popular_week);
router.get("/populer-view", popular_view);
router.get("/populer-mounth", popular_month);

module.exports = router;
