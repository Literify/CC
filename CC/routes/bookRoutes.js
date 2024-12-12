const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const {upload, uploadAndPredict} = require("../controllers/bookController");

router.get("/csv", bookController.readCSV);
router.post('/upload-and-predict', upload.single('file'), uploadAndPredict);

module.exports = router; 