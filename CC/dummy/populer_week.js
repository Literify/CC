const express = require('express');
const app = express();

// Dummy data untuk buku populer minggu ini
const popular_week = async (req, res) => {
  try {
    const filePath = "./controllers/csv/content_df.csv";  // Pastikan path file benar
    const popularBooks = await getRandomBooks(filePath, 10);
    res.json({
      "Popular this week": popularBooks
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve popular books." });
  }
};

module.exports = { popular_week };