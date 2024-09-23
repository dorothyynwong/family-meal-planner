import { AxiosResponse } from 'axios';
import client from './apiClient';

export async function importRecipeFromUrl(url: string) {
    try {
        const response: AxiosResponse = await client.get('recipes', {
            params: { url: url }
        });
        return response;
    } catch (error) {
        throw error;
    }
}
