const express = require("express");
const router = express.Router();
const { genre } = require("../dummy/genre");
const { popular_week, popular_view, popular_month } = require("../dummy/random_book");
const { books_by_genre } = require("../dummy/generateGenre");
const { getAllGenres } = require("../dummy/getAllgenres");

// Define the routes
router.get("/genre", genre);
router.get("/populer-week", popular_week);
router.get("/populer-view", popular_view);
router.get("/populer-mounth", popular_month);
router.get("/getGenre", getAllGenres);

// Fixed routes for getGenre
router.get("/getGenre/:genre", books_by_genre);  // This will handle any genre as a parameter
// contoh link
// Biography & Autobiography : http://localhost:3000/getGenre/Biography%20&%20Autobiography
// Business & Economics : http://localhost:3000/getGenre/Business%20&%20Economics
// Computers : http://localhost:3000/getGenre/Computers
// Cooking : http://localhost:3000/getGenre/Cooking
// Fiction : http://localhost:3000/getGenre/Fiction
// History : http://localhost:3000/getGenre/History
// Juvenile Fiction : http://localhost:3000/getGenre/Juvenile%20Fiction
// Religion : http://localhost:3000/getGenre/Religion
// Self-Help : http://localhost:3000/getGenre/Self-Help
// Social Science : http://localhost:3000/getGenre/Social%20Science

module.exports = router;
