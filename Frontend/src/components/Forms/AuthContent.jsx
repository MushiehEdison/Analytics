import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children, navigate }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    const login = (token) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
        navigate('/'); // Redirect to the main page
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate('/login'); // Redirect to the login page
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
