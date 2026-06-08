const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getAllUsers,
    getAllApplications,
    updateApplicationStatus
} = require("../controllers/adminController");

// Admin: View All Users
router.get(
    "/users",
    authenticateToken,
    authorizeRoles("admin"),
    getAllUsers
);

// Admin: View All Applications
router.get(
    "/applications",
    authenticateToken,
    authorizeRoles("admin"),
    getAllApplications
);

// Admin: Update Application Status
router.put(
    "/applications/:id/status",
    authenticateToken,
    authorizeRoles("admin"),
    updateApplicationStatus
);

module.exports = router;