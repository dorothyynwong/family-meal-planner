/* eslint-disable no-useless-catch */
import { AxiosResponse } from 'axios';
import client from './apiClient';
import { FamilyCodeShareInterface, FamilyInterface, FamilyRoleUpdateInterface, FamilyUserCreationInterface, MealDetailsInterface, RecipeDetailsInterface, SchoolMealInterface, UserSignupInterface } from './apiInterface';

export async function importRecipeFromUrl(url: string) {
    try {
        const response: AxiosResponse = await client.get('recipes/import-recipe', {
            params: { url: url }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function addRecipe(recipe: RecipeDetailsInterface) {
    try {
        const response: AxiosResponse = await client.post('recipes', recipe);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function updateRecipe(recipe: RecipeDetailsInterface, recipeId: number) {
    try {
        const response: AxiosResponse = await client.put(`/recipes/${recipeId}`, recipe);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function deleteRecipe(recipeId: number) {
    try {
        const response: AxiosResponse = await client.delete(`/recipes/${recipeId}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function getRecipeById(recipeId: number) {
    try {
        const response: AxiosResponse = await client.get(`/recipes/${recipeId}`);

        return response;
    } catch (error) {
        throw error;
    }
}

export async function getRecipeByUserId() {
    try {
        const response: AxiosResponse = await client.get(`/recipes`, {});

        return response;
    } catch (error) {
        throw error;
    }
}

export async function uploadImage(uploadImage: File) {
    const formData = new FormData();
    formData.append('uploadImage', uploadImage);
    try {
        const response: AxiosResponse = await client.post('recipes/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function addMeal(meal: MealDetailsInterface) {
    try {
        const response: AxiosResponse = await client.post('meals', meal);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function updateMeal(meal: MealDetailsInterface, mealId: number) {
    try {
        const response: AxiosResponse = await client.put(`/meals/${mealId}`, meal);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function deleteMeal(mealId: number) {
    try {
        const response: AxiosResponse = await client.delete(`/meals/${mealId}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function getMealByDateUserId(fromDate: string, toDate: string, familyId?: number, userId?: number) {
    try {
        const response: AxiosResponse = await client.get(`/meals`, {
            params: {
                fromDate: fromDate,
                toDate: toDate,
                familyId: familyId,
                userId: userId
            }
        });

        return response;
    } catch (error) {
        throw error;
    }
}

export async function getMealByDateFamilyId(fromDate: string, toDate: string, familyId: number) {
    try {
        const response: AxiosResponse = await client.get(`/meals/by-family`, {
            params: {
                fromDate: fromDate,
                toDate: toDate,
                familyId: familyId,
            }
        });

        return response;
    } catch (error) {
        throw error;
    }
}

export async function getMealTypes() {
    try {

        const response: AxiosResponse = await client.get(`/meals/mealTypes`, {});
        return response;
    } catch (error) {
        throw error;
    }
}

export async function userLogin(email: string, password: string) {
    try {
        const response: AxiosResponse = await client.post(`/auth/login`, {
            email: email,
            password: password,
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function userLogout() {
    try {
        const response: AxiosResponse = await client.post(`/auth/logout`, {});
        return response;
    } catch (error) {
        throw error;
    }
}

export async function refreshToken() {
    try {
        const response: AxiosResponse = await client.post(`/auth/refresh`, {});

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function userSignup(user: UserSignupInterface) {
    try {
        const response: AxiosResponse = await client.post('/auth/signup', user, { withCredentials: false });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function addFamily(family: FamilyInterface) {
    try {
        const response: AxiosResponse = await client.post('families', family);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function addFamilyUser(familyUser: FamilyUserCreationInterface) {
    try {
        const response: AxiosResponse = await client.post('familyUsers', familyUser);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function familyCodeShare(familyCodeShare: FamilyCodeShareInterface) {
    try {
        const response: AxiosResponse = await client.post('/families/share-code', familyCodeShare);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function getFamiliesWithUsersByUserId() {
    try {
        const response: AxiosResponse = await client.get(`/familyUsers/by-user/`);

        return response;
    } catch (error) {
        throw error;
    }
}

export async function getFamilyRoleTypes() {
    try {

        const response: AxiosResponse = await client.get(`/familyUsers/familyRoleTypes`, {});
        return response;
    } catch (error) {
        throw error;
    }
}

export async function updateFamilyRole(familyRole: FamilyRoleUpdateInterface) {
    try {
        const response: AxiosResponse = await client.put(`/familyUsers/update-role`, familyRole);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function getSchoolMenusByFamilyId(familyId: number) {
    try {
        const response: AxiosResponse = await client.get(`/schoolMenus`, {
            params: {
                familyId: familyId,
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function getSchoolMenuByDate(familyId: number, weekCommercing: string) {
    try {
        const response: AxiosResponse = await client.get(`/schoolMenus/weekmenu-by-date`, {
            params: {
                familyId: familyId,
                menuDate: weekCommercing
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function getSchoolMealsByDate(familyId: number, menuDate: string) {
    try {
        const response: AxiosResponse = await client.get(`/schoolMenus/meals-by-date`, {
            params: {
                familyId: familyId,
                menuDate: menuDate
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function getSchoolMenuWeekByMenuId(schoolMenuId: number) {
    try {
        const response = await client.get(`/schoolmenus/${schoolMenuId}`);
        return response;
    } catch (error) {
        throw error;
    }  
}

export async function getDayTypes() {
    try {
        const response: AxiosResponse = await client.get(`/schoolmenus/days-of-week`, {});
        return response;
    } catch (error) {
        throw error;
    }
}

export async function updateSchoolMeal(schoolMealId: number, schoolMeal: SchoolMealInterface) {
    try {
        const response: AxiosResponse = await client.put(`/schoolmenus/meal/${schoolMealId}`, schoolMeal);
        return response;
    } catch (error) {
        throw error;
    }
}