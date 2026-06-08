const pool = require("../config/db");

// CREATE APPLICATION
const createApplication = async (req, res) => {
    try {
        const {
            company_name,
            position,
            status,
            application_date,
            notes
        } = req.body;

        const user_id = req.user.id;

        const result = await pool.query(
            `INSERT INTO applications
            (company_name, position, status, application_date, notes, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                company_name,
                position,
                status,
                application_date,
                notes,
                user_id
            ]
        );

        res.status(201).json({
            message: "Application created successfully",
            application: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET ALL APPLICATIONS OF LOGGED-IN USER
const getApplications = async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await pool.query(
            `SELECT *
             FROM applications
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [user_id]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// UPDATE APPLICATION
const updateApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            company_name,
            position,
            status,
            application_date,
            notes
        } = req.body;

        const user_id = req.user.id;

        const result = await pool.query(
            `UPDATE applications
             SET company_name = $1,
                 position = $2,
                 status = $3,
                 application_date = $4,
                 notes = $5
             WHERE id = $6
               AND user_id = $7
             RETURNING *`,
            [
                company_name,
                position,
                status,
                application_date,
                notes,
                id,
                user_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            message: "Application updated successfully",
            application: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE APPLICATION
const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const user_id = req.user.id;

        const result = await pool.query(
            `DELETE FROM applications
             WHERE id = $1
               AND user_id = $2
             RETURNING *`,
            [id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            message: "Application deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createApplication,
    getApplications,
    updateApplication,
    deleteApplication
};