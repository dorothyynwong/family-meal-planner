import { AxiosResponse } from 'axios';
import client from './apiClient';
import { NewRecipeData } from '../Pages/NewRecipe/NewRecipe';

export async function importRecipeFromUrl(url: string) {
    try {
        const response: AxiosResponse = await client.get('recipes/import', {
            params: { url: url }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function addRecipe(recipe: NewRecipeData) {
    try {
        const response: AxiosResponse = await client.post('recipes', recipe);
        return response;
    } catch (error) {
        throw error;
    }


}

export async function uploadImage(uploadImage: File) {
    try {
        const response: AxiosResponse = await client.post('recipes/upload', uploadImage);
        return response;
    } catch (error) {
        throw error;
    }
}