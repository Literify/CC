require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const gamificationRoutes = require("./routes/gamificationRoutes");
const bookRoutes = require("./routes/bookRoutes");
const rekomendasi = require("./routes/recomenRoutes");
const dummyRoutes = require("./routes/dummyRoutes");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:3000/",
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser());
app.use(express.json());

app.use("/", userRoutes);
app.use("/", gamificationRoutes);
app.use("/", bookRoutes);
app.use("/", rekomendasi);
app.use("/", dummyRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
