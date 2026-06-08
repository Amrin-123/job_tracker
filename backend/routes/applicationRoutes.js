const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
    createApplication,
    getApplications,
    updateApplication,
    deleteApplication
} = require("../controllers/applicationController");

// Create Application
router.post("/", authenticateToken, createApplication);

// Get All Applications of Logged-in User
router.get("/", authenticateToken, getApplications);

// Update Application
router.put("/:id", authenticateToken, updateApplication);

// Delete Application
router.delete("/:id", authenticateToken, deleteApplication);

module.exports = router;