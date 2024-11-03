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
    schoolMealId: number;
    setSchoolMealId: (newSchoolMealId: number) => void;
    mealTypes: string[];
    setMealTypes: (newMealTypes: string[]) => void;
    status: "idle" | "loading" | "success" | "error";
    setStatus: (newStatus: "idle" | "loading" | "success" | "error") => void;
    errorMessages: string[];
    setErrorMessages: (newMessages: string[]) => void;
    formType: "recipe" | "school-meal" | "family";
    setFormType: (newType: "recipe" | "school-meal" | "family") => void;
    isFromRecipeList: boolean;
    setIsFromRecipeList: (newValue: boolean) => void;
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
    const [schoolMealId, setSchoolMealId] = useState(0);
    const [mealTypes, setMealTypes] = useState<string[]>([]);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [formType, setFormType] = useState<"recipe" | "school-meal" | "family">("recipe");
    const [isFromRecipeList, setIsFromRecipeList] = useState(false);

    const resetMealContext = () => {
        setSelectedMealType("");
        setMealDate(new Date().toISOString().split('T')[0]);
        setMealNotes("");
        setSelectedRecipe(null);
        setRecipeName("");
        setSchoolMealId(0);
        setIsFromRecipeList(false);
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
                                        schoolMealId,
                                        setSchoolMealId,
                                        mealTypes,
                                        setMealTypes,
                                        status,
                                        setStatus,
                                        errorMessages,
                                        setErrorMessages,
                                        formType,
                                        setFormType,
                                        isFromRecipeList,
                                        setIsFromRecipeList
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
