import { useQuery } from 'react-query';
import {ISuggestion} from "./suggestion";

const fetchSuggestions = async (): Promise<ISuggestion[]> => {
    const response = await fetch('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const useSuggestions = () => {
    return useQuery('suggestions', fetchSuggestions);
};
