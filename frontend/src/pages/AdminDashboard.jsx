import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function AdminDashboard() {
    const [applications, setApplications] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || user.role !== "admin") {
            navigate("/");
            return;
        }

        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        const token = localStorage.getItem("token");

        const res = await API.get("/admin/applications", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setApplications(res.data);
    };

    // 🔥 UPDATE STATUS
    const updateStatus = async (id, status) => {
        const token = localStorage.getItem("token");

        await API.put(
            `/admin/applications/${id}/status`,
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        fetchApplications();
    };

    // 🗑 DELETE
    const deleteUser = async (id) => {
        const token = localStorage.getItem("token");

        await API.delete(`/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        fetchApplications();
    };

    // 🔍 FILTER
    const filteredData = applications.filter((app) =>
        app.name?.toLowerCase().includes(search.toLowerCase()) ||
        app.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        app.position?.toLowerCase().includes(search.toLowerCase())
    );

    // 📊 STATS
    const total = applications.length;
    const selected = applications.filter(a => a.status === "Selected").length;
    const rejected = applications.filter(a => a.status === "Rejected").length;

    return (
        <div style={styles.page}>

            {/* 🔝 TOP BAR */}
            <div style={styles.topbar}>
                <h2>👑 Admin Dashboard</h2>

                <input
                    placeholder="Search user / company / position..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.search}
                />

                <button
                    onClick={() => {
                        localStorage.clear();
                        navigate("/");
                    }}
                    style={styles.logout}
                >
                    Logout
                </button>
            </div>

            {/* 📊 STATS SECTION */}
            <div style={styles.statsGrid}>

                <div style={styles.statCard}>
                    <h3>👥 Total</h3>
                    <p>{total}</p>
                </div>

                <div style={styles.statCard}>
                    <h3>✅ Selected</h3>
                    <p style={{ color: "#22c55e" }}>{selected}</p>
                </div>

                <div style={styles.statCard}>
                    <h3>❌ Rejected</h3>
                    <p style={{ color: "#ef4444" }}>{rejected}</p>
                </div>

            </div>

            <hr />

            {/* CARDS */}
            <div style={styles.grid}>
                {filteredData.length === 0 ? (
                    <p>No results found</p>
                ) : (
                    filteredData.map(app => (
                        <div key={app.id} style={styles.card}>

                            <h3>{app.name}</h3>

                            <p><b>Company:</b> {app.company_name}</p>
                            <p><b>Position:</b> {app.position}</p>

                            <p>
                                <b>Status:</b>{" "}
                                <select
                                    value={app.status}
                                    onChange={(e) =>
                                        updateStatus(app.id, e.target.value)
                                    }
                                >
                                    <option value="Applied">Applied</option>
                                    <option value="Assessment">Assessment</option>
                                    <option value="Interview Scheduled">Interview Scheduled</option>
                                    <option value="Offer Received">Offer Received</option>
                                    <option value="Selected">Selected</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </p>

                            <button
                                onClick={() => deleteUser(app.id)}
                                style={styles.delete}
                            >
                                Delete
                            </button>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    page: {
        padding: "20px",
        fontFamily: "Arial",
        background: "#f4f6f8",
        minHeight: "100vh"
    },

    topbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "15px",
        marginBottom: "15px"
    },

    search: {
        flex: 1,
        maxWidth: "400px",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc"
    },

    logout: {
        padding: "8px 12px",
        background: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    },

    // 📊 STATS
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "15px",
        marginBottom: "15px"
    },

    statCard: {
        background: "white",
        padding: "15px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        textAlign: "center"
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "15px"
    },

    card: {
        background: "white",
        padding: "15px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        transition: "0.2s",
        cursor: "pointer"
    },

    delete: {
        marginTop: "10px",
        padding: "6px 10px",
        background: "#dc2626",
        color: "white",
        border: "none",
        borderRadius: "5px"
    }
};

export default AdminDashboard;