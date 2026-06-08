import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        company_name: "",
        position: "",
        status: "Applied",
        application_date: "",
        notes: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/");
        else fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await API.get("/applications", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setApplications(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        await API.post("/applications", form, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        resetForm();
        fetchApplications();
        setShowForm(false);
    };

    const handleDelete = async (id) => {
        await API.delete(`/applications/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        fetchApplications();
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setForm(item);
        setShowForm(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        await API.put(`/applications/${editingId}`, form, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        resetForm();
        setEditingId(null);
        fetchApplications();
        setShowForm(false);
    };

    const resetForm = () => {
        setForm({
            company_name: "",
            position: "",
            status: "Applied",
            application_date: "",
            notes: ""
        });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // 🎨 STATUS COLORS
    const getStatusColor = (status) => {
        switch (status) {
            case "Applied": return "#3b82f6";
            case "Assessment": return "#f59e0b";
            case "Interview Scheduled": return "#8b5cf6";
            case "Offer Received": return "#10b981";
            case "Selected": return "#22c55e";
            case "Rejected": return "#ef4444";
            default: return "#6b7280";
        }
    };

    return (
        <div style={styles.page}>

            {/* TOP BAR */}
            <div style={styles.topbar}>
                <h2>📊 Dashboard</h2>

                <div>
                    <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
                        + Add Application
                    </button>

                    <button style={styles.logoutBtn} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* FORM */}
            {showForm && (
                <form style={styles.form} onSubmit={editingId ? handleUpdate : handleAdd}>

                    <input name="company_name" placeholder="Company"
                        value={form.company_name} onChange={handleChange} style={styles.input} />

                    <input name="position" placeholder="Position"
                        value={form.position} onChange={handleChange} style={styles.input} />

                    <input type="date" name="application_date"
                        value={form.application_date} onChange={handleChange} style={styles.input} />

                    <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
                        <option>Applied</option>
                        <option>Assessment</option>
                        <option>Interview Scheduled</option>
                        <option>Offer Received</option>
                        <option>Selected</option>
                        <option>Rejected</option>
                    </select>

                    <input name="notes" placeholder="Notes"
                        value={form.notes} onChange={handleChange} style={styles.input} />

                    <button style={styles.saveBtn}>
                        {editingId ? "Update" : "Save"}
                    </button>
                </form>
            )}

            {/* CARDS */}
            <div style={styles.grid}>
                {applications.map((item) => (
                    <div key={item.id} style={styles.card}>

                        <div style={styles.cardTop}>
                            <h3>{item.company_name}</h3>

                            <span style={{
                                ...styles.badge,
                                background: getStatusColor(item.status)
                            }}>
                                {item.status}
                            </span>
                        </div>

                        <p>📌 {item.position}</p>
                        <p>📅 {item.application_date?.split("T")[0]}</p>
                        <p>📝 {item.notes}</p>

                        <div style={styles.actions}>
                            <button onClick={() => startEdit(item)} style={styles.editBtn}>
                                Edit
                            </button>

                            <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    page: { padding: "20px", fontFamily: "Arial" },

    topbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },

    addBtn: {
        marginRight: "10px",
        padding: "8px 12px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "5px"
    },

    logoutBtn: {
        padding: "8px 12px",
        background: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "5px"
    },

    form: {
        display: "grid",
        gap: "10px",
        padding: "15px",
        background: "#f3f4f6",
        borderRadius: "10px",
        marginBottom: "20px"
    },

    input: {
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc"
    },

    saveBtn: {
        padding: "10px",
        background: "#10b981",
        color: "white",
        border: "none",
        borderRadius: "5px"
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "15px"
    },

    card: {
        padding: "15px",
        borderRadius: "10px",
        background: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    },

    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    badge: {
        padding: "4px 8px",
        borderRadius: "5px",
        color: "white",
        fontSize: "12px"
    },

    actions: {
        marginTop: "10px",
        display: "flex",
        gap: "10px"
    },

    editBtn: {
        padding: "5px 10px",
        background: "#3b82f6",
        border: "none",
        color: "white",
        borderRadius: "5px"
    },

    deleteBtn: {
        padding: "5px 10px",
        background: "#ef4444",
        border: "none",
        color: "white",
        borderRadius: "5px"
    }
};

export default Dashboard;