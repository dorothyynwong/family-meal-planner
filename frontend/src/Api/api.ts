import { AxiosResponse } from 'axios';
import client from './apiClient';
import { MealDetailsInterface, RecipeDetailsInterface, UserSignupInterface } from './apiInterface';
import { configure } from '@testing-library/react';

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
    formData.append('uploadImage',uploadImage);
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

// export async function getMealByDateUserId(fromDate: string, toDate: string, userId: string) {
    export async function getMealByDateUserId(fromDate: string, toDate: string) {
    try {

        const response: AxiosResponse = await client.get(`/meals`, {
            params: {
                fromDate: fromDate,
                toDate: toDate,
                // userId: parseInt(userId)
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
        const response: AxiosResponse = await client.post(`/auth/refresh`,{});

        return response.data; 
    } catch (error) {
        throw error;
    }
}

export async function userSignup(user: UserSignupInterface) {
    try {
        const response: AxiosResponse = await client.post('/auth/signup', user,  {withCredentials: false} );
        return response;
    } catch (error) {
        throw error;
    }
}