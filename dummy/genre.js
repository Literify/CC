const express = require('express');
const app = express();

const genres = [
    { genre: "Biography & Autobiography", imageUrl: "https://storage.googleapis.com/genre_literify/genre/Biography%20%26%20Autobiography.png" },
    { genre: "Business & Economics", imageUrl: "https://storage.googleapis.com/genre_literify/genre/Business%20%26%20Economics.png" },
    { genre: "Computers", imageUrl: "https://storage.googleapis.com/genre_literify/genre/Computers.png" },
    { genre: "Cooking", imageUrl: "https://storage.googleapis.com/genre_literify/genre/Cooking.png" },
    { genre: "Fiction", imageUrl: "https://storage.googleapis.com/genre_literify/genre/Fiction.png" },
    { genre: "History", imageUrl: "https://storage.googleapis.com/genre_literify/genre/History.png" },
    { genre: "Juvenile Fiction", imageUrl: "https://storage.googleapis.com/genre_literify/genre/Juvenile%20Fiction.png" },
    { genre: "Religion", imageUrl: "https://storage.googleapis.com/genre_literify/genre/Religion.png" },
    { genre: "Self-Help", imageUrl: "https://storage.googleapis.com/genre_literify/genre/Self-Help.png" },
    { genre: "Social Science", imageUrl: "https://storage.googleapis.com/genre_literify/genre/Social%20Science.png" }
];


const genre = async (req, res) => {
    res.json({
        "Popular this week": genres
    });
};

module.exports = { genre };
