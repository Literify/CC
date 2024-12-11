const express = require('express');
const app = express();

const genres = [
    { genre: "Adventure", imageUrl: "https://storage.googleapis.com/genre_literify/Genre/Adventure.png" },
    { genre: "Comedy", imageUrl: "https://storage.googleapis.com/genre_literify/Genre/Comedy.png" },
    { genre: "Crime", imageUrl: "https://storage.googleapis.com/genre_literify/Genre/Crime.png" },
    { genre: "Drama", imageUrl: "https://storage.googleapis.com/genre_literify/Genre/Drama.png" },
    { genre: "Education", imageUrl: "https://storage.googleapis.com/genre_literify/Genre/Education.png" },
    { genre: "Fantasy", imageUrl: "https://storage.googleapis.com/genre_literify/Genre/Fantasy.png" },
    { genre: "Fiksi", imageUrl: "https://storage.googleapis.com/genre_literify/Genre/Fiksi.png" },
    { genre: "Horor", imageUrl: "https://storage.googleapis.com/genre_literify/Genre/Horor.png" },
    { genre: "Non-Fiksi", imageUrl: "https://storage.googleapis.com/genre_literify/Genre/Non-Fiksi.png" },
    { genre: "Self-Improvement", imageUrl: "https://storage.googleapis.com/genre_literify/Genre/Self-Improvement.png" }
];

const genre = async (req, res) => {
    res.json({
        "Popular this week": genres
    });
};

module.exports = { genre };
