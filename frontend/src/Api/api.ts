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
        const response: AxiosResponse = await client.post('recipes', {
            params: { recipe: recipe}
        });
        return response;
    } catch (error) {
        throw error;
    }
}
