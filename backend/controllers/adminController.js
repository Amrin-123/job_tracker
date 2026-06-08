const pool = require("../config/db");

// GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, role, created_at
             FROM users
             ORDER BY created_at DESC`
        );

        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET ALL APPLICATIONS
const getAllApplications = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                a.id,
                a.company_name,
                a.position,
                a.status,
                a.application_date,
                a.notes,
                a.created_at,
                u.id AS user_id,
                u.name,
                u.email
             FROM applications a
             JOIN users u
             ON a.user_id = u.id
             ORDER BY a.created_at DESC`
        );

        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// ADMIN UPDATE APPLICATION STATUS
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await pool.query(
            `UPDATE applications
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            message: "Application status updated successfully",
            application: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getAllApplications,
    updateApplicationStatus
};