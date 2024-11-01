export interface ListResponse<T> {
    items: T[];
    totalNumberOfItems: number;
    page: number;
    nextPage: string;
    previousPage: string;
}

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
    recipeUrl?: string;
    addedByUserId?: number;
    addedByUserNickname?: string;
    isOwner?: boolean;
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
    addedByUserId?: number;
    notes?: string;
    schoolMealId?: number;
    schoolMealName?: string;
}

export interface UserSignupInterface {
    email?: string;
    password?: string;
    nickname?: string;
    familycode?: string;
}

export interface FamilyInterface {
    familyName: string;
}

export interface FamilyUserCreationInterface {
    familyShareCode: string;
}

export interface FamilyCodeShareInterface {
    familyId?: number,
    senderName?: string,
    recipentName?: string,
    recipentEmail?: string,
}

export interface FamilyUserInterface {
    userId: number,
    userNickName: string,
    familyId: number,
    familyRole: string,
    isApproved: boolean,
}

export interface FamilyWithUsersInterface {
    familyId: number,
    userId: number,
    familyName: string,
    familyShareCode: string,
    familyRole: string,
    familyUsers: FamilyUserInterface[],
}

export interface FamilyRoleUpdateInterface {
    familyId: number;
    userId: number;
    newRole: string;
}

export interface SchoolMealInterface {
    id?: number;
    schoolMenuId?: number;
    day?: number;
    mealName?: string;
    category?: string;
    allergens?: string;
}

export interface SchoolMenuInterface {
    id: number;
    schoolmeals: SchoolMealInterface[];
    status: string;
    familyId: number;
    userId: number;
}

export interface SchoolMenuWeekInterface {
    weekCommencing: Date;
    schoolMenuId: number;
}

export interface SchoolMenuWeekMealsInterface {
    weekCommencing: Date[];
    schoolMenuId: number;
    status: string;
    familyId: number;
    userId: number;
    schoolMeals: SchoolMealInterface[];
}

export interface UserLoginResponseInterface {
    nickname: string;
}

export interface RecipeSearchInterface {
    addedByUserId: number;
    familyId: number;
    recipeName: string;
    orderBy: string;
}