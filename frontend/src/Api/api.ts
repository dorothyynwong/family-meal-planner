import { AxiosResponse } from 'axios';
import client from './apiClient';
import { RecipeDetailsInterface } from './apiInterface';

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

export async function getRecipeByUserId(userId: number) {
    try {
        const response: AxiosResponse = await client.get(`/recipes`, {
            params: {
                userId: 1
            }
        });

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

