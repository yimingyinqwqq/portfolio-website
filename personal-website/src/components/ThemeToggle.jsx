import React, { useState, useEffect } from "react";

export default function ThemeToggle() {
    // Initialize theme state from localStorage or default to "light"
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <button onClick={toggleTheme} style={styles.button}>
            {theme === 'light' ? (
                <img src="/lantern_off.svg" alt="Lantern Off" width="32" height="32" />
            ) : (
                <img src="/lantern_on1.svg" alt="Lantern On" width="32" height="32" />
            )}
        </button>
    );
}

const styles = {
    button: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
        margin: 0,
        height: "32px" // Match height of other social icons
    },
    icon: {
        color: "var(--text-color)" // Use theme color
    }
};