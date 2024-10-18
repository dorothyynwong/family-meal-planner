import React, { createContext, useContext, useState } from "react";
import { FamilyWithUsersInterface, MealDetailsInterface, RecipeDetailsInterface } from "../../Api/apiInterface";

interface MealContextProps {
    mode: string;
    setMode: (newMode: string) => void;
    currentMeal: MealDetailsInterface | null;
    setCurrentMeal: (meal: MealDetailsInterface) => void;
    selectedRecipe: RecipeDetailsInterface | null;
    setSelectedRecipe: (recipe: RecipeDetailsInterface) => void;
    recipeName: string;
    setRecipeName: (newRecipeName: string) => void;
    selectedMealType: string;
    setSelectedMealType: (mealType:string) => void;
    mealDate: string;
    setMealDate: (date:string) => void;
    mealNotes: string;
    setMealNotes: (notes: string) => void;
    modalShow: boolean;
    setModalShow: (newModalShow: boolean) => void;
    resetMealContext: () => void;
    selectedFamily: FamilyWithUsersInterface | null;
    setSelectedFamily: (newFamily: FamilyWithUsersInterface) => void;
}

const MealContext = createContext<MealContextProps | undefined>(undefined);

export const MealProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState("");
    const [currentMeal, setCurrentMeal] = useState<MealDetailsInterface | null>(null);
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetailsInterface | null>(null);
    const [recipeName, setRecipeName] = useState("");
    const [selectedMealType, setSelectedMealType] = useState("");
    const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]);
    const [mealNotes, setMealNotes] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [selectedFamily, setSelectedFamily] = useState<FamilyWithUsersInterface | null>(null);
    const [addedByUserId, setAddedByUserId] = useState(0);

    const resetMealContext = () => {
        setSelectedMealType("");
        setMealDate(new Date().toISOString().split('T')[0]);
        setMealNotes("");
        setSelectedRecipe(null);
        setRecipeName("");
        setSelectedFamily(null);
    };

    return (
        <MealContext.Provider value={{  mode,
                                        setMode,
                                        currentMeal,
                                        setCurrentMeal,
                                        selectedRecipe,
                                        setSelectedRecipe,
                                        recipeName,
                                        setRecipeName,
                                        selectedMealType, 
                                        setSelectedMealType, 
                                        mealDate, 
                                        setMealDate, 
                                        mealNotes, 
                                        setMealNotes, 
                                        modalShow,
                                        setModalShow,
                                        resetMealContext, 
                                        selectedFamily,
                                        setSelectedFamily,
                                        }}>
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
