const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { router } = require("./routes");

dotenv.config();
const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Mount your router under /api
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello from Express API checking!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT || 3000}`);
});

module.exports = app;
