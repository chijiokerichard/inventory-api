const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const dotenv = require("dotenv");
const { router } = require("./routes");

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173", // local dev
  process.env.FRONTEND_URL // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Mount your router under /api
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello from Express API checking");
});

const GO_URL = process.env.GO_URL;
if (!GO_URL) {
  console.error("❌ Missing MONGO_URL environment variable!");
  process.exit(1);
}

mongoose
  .connect(GO_URL)
  .then(() => console.log("✅ database connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


app.listen(process.env.PORT || 3000, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT || 3000}`);
});

module.exports = app;
