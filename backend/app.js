const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// routes
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

// middleware
const authenticateToken = require("./middleware/authMiddleware");

// test protected route
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        message: "Protected route accessed successfully",
        user: req.user
    });
});

// home route
app.get("/", (req, res) => {
    res.json({ message: "ApplyTrack Backend Running 🚀" });
});

module.exports = app;