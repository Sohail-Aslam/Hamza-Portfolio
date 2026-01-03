import React, { createContext, useContext, useState } from "react";

type ThemeContextType = {
    isDay: boolean;
    toggleDayNight: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDay, setIsDay] = useState(true);
    const toggleDayNight = () => setIsDay(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDay, toggleDayNight }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used inside ThemeProvider");
    return context;
};
