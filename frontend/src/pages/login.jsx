import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
    const [isRegister, setIsRegister] = useState(false);

    const navigate = useNavigate(); // ✅ IMPORTANT

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/login", {
                email: form.email,
                password: form.password
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            alert("Login Successful");

            // ✅ ROLE BASED NAVIGATION
            const user = res.data.user;

            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    // REGISTER
    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await API.post("/auth/register", form);

            alert("Register Successful! Now login");
            setIsRegister(false);
        } catch (err) {
            alert(err.response?.data?.message || "Register Failed");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>
                    {isRegister ? "Create Account" : "Welcome Back"}
                </h2>

                <form onSubmit={isRegister ? handleRegister : handleLogin}>

                    {isRegister && (
                        <input
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    )}

                    <input
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <button style={styles.button}>
                        {isRegister ? "Register" : "Login"}
                    </button>
                </form>

                <p
                    onClick={() => setIsRegister(!isRegister)}
                    style={styles.link}
                >
                    {isRegister
                        ? "Already have an account? Login"
                        : "New user? Register now"}
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6"
    },
    card: {
        width: "320px",
        padding: "25px",
        borderRadius: "10px",
        background: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        textAlign: "center"
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "8px 0",
        border: "1px solid #ddd",
        borderRadius: "6px"
    },
    button: {
        width: "100%",
        padding: "10px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "6px",
        marginTop: "10px",
        cursor: "pointer"
    },
    link: {
        marginTop: "12px",
        color: "#2563eb",
        cursor: "pointer",
        fontSize: "14px"
    }
};

export default Login;