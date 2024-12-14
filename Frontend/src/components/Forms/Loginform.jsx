import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContent"; // Correct the import path if necessary

function LoginForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("http://localhost:5000/api/login", formData);
            login(data.access_token);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={styles.container} >
            <form style={styles.form} onSubmit={handleSubmit}>
                <h2 style={styles.title} className="py-4">Login</h2>
                <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={styles.input}
                />
                <button type="submit" style={styles.button} className="my-3">
                    Login
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "1.3em, 0",
        backgroundColor: "#fff",
        color: "#fff" // White text
    },
    form: {
        backgroundColor: "#1c1c1c", // Slightly lighter black
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)",
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px"
    },
    title: {
        marginBottom: "20px",
        fontSize: "1.5rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "2px",
        color:"#fff"
    },
    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #555", // Gray border
        backgroundColor: "#2c2c2c", // Dark gray input
        color: "#fff",
        outline: "none",
        fontSize: "1rem"
    },
    button: {
        padding: "10px 20px",
        borderRadius: "4px",
        backgroundColor: "#fff", // White button
        color: "#000", // Black text
        fontWeight: "bold",
        fontSize: "1rem",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.3s, color 0.3s",
    },
    buttonHover: {
        backgroundColor: "#000",
        color: "#fff"
    }
};

export default LoginForm;
