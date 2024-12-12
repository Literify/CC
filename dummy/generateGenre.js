const fs = require('fs');
const { parse } = require('csv-parse');

// Function to get all rows from the CSV
function getAllBooks(filePath) {
    return new Promise((resolve, reject) => {
        const books = [];

        // Read the CSV file and parse it
        fs.createReadStream(filePath)
            .pipe(parse({ delimiter: ",", from_line: 2 }))  // Adjust if needed for header row
            .on("data", (row) => {
                books.push(row);  // Push each row into the books array
            })
            .on("end", () => {
                resolve(books);
            })
            .on("error", (error) => {
                reject(error);
            });
    });
}

function filterBooksByGenre(books, genre) {
    // Filter books by genre (ignoring case sensitivity)
    const filteredBooks = books.filter(book => book[3].toLowerCase() === genre.toLowerCase());
    return filteredBooks;
}

// API route for getting books by genre based on URL parameter
const books_by_genre = async (req, res) => {
    try {
        const genre = req.params.genre;  // Get genre from URL parameter
        const filePath = "./controllers/csv/content_df.csv";  // Make sure the file path is correct

        // Check if genre is provided
        if (!genre) {
            return res.status(400).json({ error: "Genre parameter is required." });
        }

        const allBooks = await getAllBooks(filePath);
        const filteredBooks = filterBooksByGenre(allBooks, genre);

        if (filteredBooks.length === 0) {
            return res.status(404).json({ error: `No books found for the genre: ${genre}` });
        }

        res.json({
            "Books for genre": filteredBooks
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve books by genre." });
    }
};

module.exports = { books_by_genre };
