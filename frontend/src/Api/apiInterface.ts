export interface RecipeDetailsInterface {
    id?: number;
    name?: string;
    images? :string[];
    author? :string;
    url?: string;
    description?: string;
    notes?: string;
    recipeCuisine?: string;
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    keywords?: string;
    recipeYield?: string;
    recipeCategory?: string;
    recipeIngredients?: string[];
    recipeInstructions?: string[];
    creationDateTime?: Date;
    lastUpdatedDateTime?: Date;
    defaultImageUrl?: string;
}

export interface MealDetailsInterface {
    id?: number;
    date: string;
    recipeId?: number;
    recipeName?: string;
    recipeDefaultImage?: string;
    userId?: number;
    familyId?: number;
    mealType: string;
    addedByUserId: number;
    notes?: string;
}

export interface UserSignupInterface {
    email?: string;
    password?: string;
    nickname?: string;
    familycode?: string;
}