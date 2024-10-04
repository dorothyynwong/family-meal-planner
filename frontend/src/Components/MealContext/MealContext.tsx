import React, { createContext, useContext, useState } from "react";

interface MealContextProps {
    selectedMealType: string;
    setSelectedMealType: (mealType:string) => void;
    mealDate: string;
    setMealDate: (date:string) => void;
}

const MealContext = createContext<MealContextProps | undefined>(undefined);

export const MealProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedMealType, setSelectedMealType] = useState("");
    const [mealDate, setMealDate] = useState("");

    return (
        <MealContext.Provider value={{ selectedMealType, setSelectedMealType, mealDate, setMealDate }}>
            {children}
        </MealContext.Provider>
    );
};

export const useMeal = () => {
    const context = useContext(MealContext);
    if (!context) {
        throw new Error("useMeal must be used within a MealProvider");
    }
    return context;
};
