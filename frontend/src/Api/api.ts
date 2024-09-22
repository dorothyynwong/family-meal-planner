import { AxiosResponse } from 'axios';
import client from './apiClient';

export async function ImportRecipeFromUrl(url: string) {
    try {
        const response: AxiosResponse = await client.get('recipes/url', {
            params: { url: url }
        });
        return response;
    } catch (error) {
        throw error;
    }
}
