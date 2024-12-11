const fs = require('fs');
const { parse } = require('csv-parse');

// Function to get 10 random rows from the CSV
function getRandomBooks(filePath, numBooks) {
    return new Promise((resolve, reject) => {
        const books = [];

        // Read the CSV file and parse it
        fs.createReadStream(filePath)
            .pipe(parse({ delimiter: ",", from_line: 2 }))  // Adjust if needed for header row
            .on("data", (row) => {
                books.push(row);  // Push each row into the books array
            })
            .on("end", () => {
                // Select 10 random books from the array
                const randomBooks = [];
                const bookCount = books.length;

                for (let i = 0; i < numBooks; i++) {
                    const randomIndex = Math.floor(Math.random() * bookCount);
                    randomBooks.push(books[randomIndex]);
                }

                resolve(randomBooks);
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
        const popularBooks = await getRandomBooks(filePath, 10);
        res.json({
            "Popular this week": popularBooks
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve popular books." });
    }
};

const popular_view = async (req, res) => {
    try {
        const filePath = "./controllers/csv/content_df.csv";  // Make sure the file path is correct
        const popularBooks = await getRandomBooks(filePath, 10);
        res.json({
            "Popular this week": popularBooks
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve popular books." });
    }
};

const popular_month = async (req, res) => {
    try {
        const filePath = "./controllers/csv/content_df.csv";  // Make sure the file path is correct
        const popularBooks = await getRandomBooks(filePath, 100);
        res.json({
            "Popular this month": popularBooks
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve popular books." });
    }
};

module.exports = { popular_week, popular_view, popular_month };
