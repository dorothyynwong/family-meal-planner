import React, { createContext, useContext, useState } from "react";
import { RecipeDetailsInterface } from "../../Api/apiInterface";

interface RecipeContextProps {
    selectedRecipe: RecipeDetailsInterface | null;
    setSelectedRecipe: (recipe: RecipeDetailsInterface) => void;
}

const RecipeContext = createContext<RecipeContextProps | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetailsInterface | null>(null);

    return (
        <RecipeContext.Provider value={{ selectedRecipe, setSelectedRecipe }}>
            {children}
        </RecipeContext.Provider>
    );
};

export const useRecipe = () => {
    const context = useContext(RecipeContext);
    if (!context) {
        throw new Error("useRecipe must be used within a RecipeProvider");
    }
    return context;
};
