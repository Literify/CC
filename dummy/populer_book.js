const fs = require('fs');
const { parse } = require('csv-parse');

// Function to get the 10 most popular books based on the number of ratings or another metric
function getPopularBooks(filePath, numBooks) {
  return new Promise((resolve, reject) => {
    const books = [];

    // Read the CSV file and parse it
    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: ",", from_line: 2 }))  // Adjust if needed for header row
      .on("data", (row) => {
        // Map the row to a book object
        const book = {
          book_title: row[0],
          description: row[1],
          authors: row[2],
          genre: row[3],
          publisher: row[4],
          price: row[5],
          image: row[6],
          previewLink: row[7],
          infoLink: row[8],
          average_rating: parseFloat(row[9]),  // Ensure rating is a number
          rating_count: parseInt(row[10]),  // Ensure rating count is an integer
          weighted_average: parseFloat(row[11]),
          bag_of_words: row[12]
        };
        books.push(book);  // Push the book into the array
      })
      .on("end", () => {
        // Sort books by rating_count in descending order and select the top 10
        const sortedBooks = books.sort((a, b) => b.rating_count - a.rating_count);
        const popularBooks = sortedBooks.slice(0, numBooks);

        resolve(popularBooks);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// API route for getting popular books this week
const popular_week = async (req, res) => {
  try {
    const filePath = "./controllers/csv/content_df.csv";  // Make sure the file path is correct
    const popularBooks = await getPopularBooks(filePath, 10);
    res.json({
      "Popular this week": popularBooks
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve popular books." });
  }
};

// API route for getting popular books by views
const popular_view = async (req, res) => {
  try {
    const filePath = "./controllers/csv/content_df.csv";  // Make sure the file path is correct
    const popularBooks = await getPopularBooks(filePath, 10);
    res.json({
      "Popular this week": popularBooks
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve popular books." });
  }
};

// API route for getting popular books this month
const popular_month = async (req, res) => {
  try {
    const filePath = "./controllers/csv/content_df.csv";  // Make sure the file path is correct
    const popularBooks = await getPopularBooks(filePath, 100);
    res.json({
      "Popular this month": popularBooks
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve popular books." });
  }
};

module.exports = { popular_week, popular_view, popular_month };
