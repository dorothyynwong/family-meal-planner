export interface ImportRecipeInterface {
    id?: number;
    name?: string;
    images? :string[];
    author? :string;
    url: string;
    description?: string;
    recipeCuisine?: string;
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    keywords?: string;
    recipeYield?: string;
    recipeCategory?: string;
    recipeIngredients?: string[];
    recipeInstructions?: string[];
}