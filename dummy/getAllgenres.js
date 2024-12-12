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

function getGenres(books) {
    // Assuming the genre is in the 4th column (index 4)
    const genres = books.map(book => book[3]);

    // Filter out duplicate genres and return a unique list
    const uniqueGenres = [...new Set(genres)];
    return uniqueGenres;
}

// API route to get all available genres
const getAllGenres = async (req, res) => {
    try {
        const filePath = "./controllers/csv/content_df.csv";  // Make sure the file path is correct
        const allBooks = await getAllBooks(filePath);
        const genres = getGenres(allBooks);

        if (genres.length === 0) {
            return res.status(404).json({ error: "No genres found." });
        }

        res.json({
            genres: genres
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve genres." });
    }
};

module.exports = { getAllGenres };
