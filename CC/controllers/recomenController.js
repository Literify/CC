const express = require("express");
const multer = require('multer');
const axios = require('axios');
const { Storage } = require("@google-cloud/storage");
const path = require("path");


const storage = new Storage({
    projectId: "proud-curve-441603-q5",
    keyFilename: path.resolve(__dirname, "../services/storageBucket.json"),
});

const bucketName = "literify";
// const bucket = storage.bucket(bucketName);

const recommendBook = async (req, res) => {
    try {
        // Extract the book title from the request body
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        // Call the ML recommendation endpoint

        const response = await axios.post('https://literify-410674384122.asia-southeast2.run.app/recommend-book-fitur-1',
            {
                title: title
            }
        );

        // Return the recommendation results
        res.status(200).json({
            message: 'Recommendations retrieved successfully',
            recommendations: response.data,
        });
    } catch (error) {
        console.error('Error fetching book recommendations:', error.message);

        // Handle errors gracefully
        res.status(500).json({
            error: 'Failed to fetch recommendations',
            details: error.response ? error.response.data : error.message,
        });
    }
};

const handleUserRecommendation = async (req, res) => {
    const { predicted_genre, choice_genre } = req.body;
    // Validate the input
    if (!predicted_genre || !choice_genre) {
        return res.status(400).json({ error: "Missing predicted_genre or choice_genre" });
    }

    // Call the ML recommendation endpoint using manually input genres
    try {
        const recommendationResponse = await axios.post(
            'https://literify-410674384122.asia-southeast2.run.app/recommend-books-fitur-2',
            {
                predicted_genre: predicted_genre,
                choice_genre: choice_genre,
            }
        );

        // Send success response with recommendations
        return res.status(200).json({
            message: "Recommendations retrieved successfully",
            userSelection,
            recommendations: recommendationResponse.data.recommendations,
        });
    } catch (mlError) {
        console.error(`Error during recommendation at endpoint: ${mlEndpoint}`, mlError.message);
        return res.status(500).json({
            error: "Error during recommendation",
            endpoint: mlEndpoint,
            details: mlError.response ? mlError.response.data : mlError.message,
        });
    }
};



module.exports = {
    recommendBook,
    handleUserRecommendation
};
