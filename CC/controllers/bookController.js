const express = require("express");
const multer = require('multer');
const axios = require('axios');
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fs = require("fs");
const { parse } = require("csv-parse");

// Initialize Google Cloud Storage
const storage = new Storage({
    projectId: "proud-curve-441603-q5",
    keyFilename: path.resolve(__dirname, "../services/storageBucket.json"), // deploy jangan lupa diganti
});

const bucketName = "literify";

const bucket = storage.bucket(bucketName);

// Controller function to read CSV from GCS bucket
// const readCSV = async (req, res) => {
//   const fileName = "https://storage.googleapis.com/literify/content_df.csv";
//   const bucket = storage.bucket(bucketName);
//   const file = bucket.file(fileName);

//   try {
//     res.setHeader("Content-Type", "application/json");
//     res.write('{"message": "Streaming CSV data", "data": [');

//     let isFirstRow = true;
//     file
//       .createReadStream()
//       .pipe(csv())
//       .on("data", (row) => {
//         if (!isFirstRow) res.write(",");
//         res.write(JSON.stringify(row));
//         isFirstRow = false;
//       })
//       .on("end", () => {
//         res.write("]}");
//         res.end();
//       })
//       .on("error", (error) => {
//         res.status(500).json({
//           message: "Error reading CSV file from GCS bucket",
//           error: error.message,
//         });
//       });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error accessing GCS bucket or file",
//       error: error.message,
//     });
//   }
// };

const readCSV = async (req, res) => {
    const results = [];
    // menyesuaikan dengan file csv yang akan di read
    const filePath = ".\controllers\csv\content_df.csv"
    fs.createReadStream(filePath)
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            results.push(row);
        })
        .on("end", function () {
            res.json(results);
        })
        .on("error", function (error) {
            // Handle any errors that occur during parsing
            console.log(error.message);
            res.status(500).json({ error: "Failed to read the CSV file" });
        });
}

const upload = multer({ storage: multer.memoryStorage() });

const uploadAndPredict = async (req, res) => {
    try {
        // Ensure a file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.file;
        const fileName = `${Date.now()}-${file.originalname}`;

        const bucketName = "literify";
        const bucket = storage.bucket(bucketName);

        const blob = bucket.file(fileName);

        // Upload the image to GCS
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        blobStream.end(file.buffer);
        blobStream.on('finish', async () => {
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

            try {
                const response = await axios.post(
                    'https://literify-410674384122.asia-southeast2.run.app/predict-genre',
                    { image_url: publicUrl }
                );

                res.status(200).json({
                    message: 'File uploaded and processed successfully',
                    fileUrl: publicUrl,
                    prediction: response.data,
                });
            } catch (mlError) {
                res.status(500).json({
                    error: 'Error calling ML endpoint',
                    details: mlError.response ? mlError.response.data : mlError.message,
                });
            }
        });

        blobStream.on('error', (err) => {
            res.status(500).json({ error: 'Error uploading file to GCS', details: err.message });
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};



module.exports = { readCSV, upload, uploadAndPredict };
