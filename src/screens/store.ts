import create from 'zustand';
import {ISuggestion} from "./suggestion";

interface SuggestionState {
    suggestions: ISuggestion[];
    setSuggestions: (suggestions: ISuggestion[]) => void;
}

export const useSuggestionStore = create<SuggestionState>((set) => ({
    suggestions: [],
    setSuggestions: (suggestions) => set({ suggestions }),
}));
