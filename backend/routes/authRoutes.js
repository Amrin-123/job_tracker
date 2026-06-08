const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");

const {
    registerValidator,
    loginValidator
} = require("../validators/authValidator");

const { validationResult } = require("express-validator");

// Validation Middleware
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
};

// REGISTER
router.post(
    "/register",
    registerValidator,
    handleValidation,
    register
);

// LOGIN
router.post(
    "/login",
    loginValidator,
    handleValidation,
    login
);

module.exports = router;