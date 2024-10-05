import React, { createContext, useContext, useState } from "react";

interface MealContextProps {
    selectedMealType: string;
    setSelectedMealType: (mealType:string) => void;
    mealDate: string;
    setMealDate: (date:string) => void;
    mealNotes: string;
    setMealNotes: (notes: string) => void;
    resetMealContext: () => void;
}

const MealContext = createContext<MealContextProps | undefined>(undefined);

export const MealProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedMealType, setSelectedMealType] = useState("");
    const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]);
    const [mealNotes, setMealNotes] = useState("");

    const resetMealContext = () => {
        setSelectedMealType("");
        setMealDate("");
        setMealNotes("");
    };

    return (
        <MealContext.Provider value={{ selectedMealType, 
                                        setSelectedMealType, 
                                        mealDate, 
                                        setMealDate, 
                                        mealNotes, 
                                        setMealNotes, 
                                        resetMealContext }}>
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
