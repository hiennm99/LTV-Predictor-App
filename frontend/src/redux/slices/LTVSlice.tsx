import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LTVFilter {
    fromDate: string;
    toDate: string;
    country: string;
    partner: string;
    gamePackageName: string;
    campaign: string;
};

interface LTVFilterState {
    filters: LTVFilter[];
}

// Load dữ liệu từ localStorage (nếu có)
const loadState = (): LTVFilterState => {
    try {
        const storedState = localStorage.getItem("LTVFilters");
        return storedState ? JSON.parse(storedState) : { filters: [] };
    } catch (error) {
        console.error("Failed to load state from localStorage", error);
        return { filters: [] };
    }
};

const initialState: LTVFilterState = loadState();

const LTVSlice = createSlice({
    name: "LTVFilter",
    initialState,
    reducers: {
        addFilter: (state, action: PayloadAction<LTVFilter>) => {
            const newState = {
                ...state,
                filters: [...state.filters, action.payload],
            };
            localStorage.setItem("LTVFilters", JSON.stringify(newState));
            return newState;
        },
        resetFilters: (state) => {
            console.log("Resetting filters");
            const newState = {
                ...state,
                filters: [],
            };
            localStorage.removeItem("LTVFilters");
            return newState;
        },
        resetFiltersKeepGame: (state) => {
            console.log("Resetting filters except game");
            const lastGameFilter = state.filters[state.filters.length - 1]?.gamePackageName || "";
            const newState = {
                ...state,
                filters: [{ gamePackageName: lastGameFilter, fromDate: "", toDate: "", partner: "", country: "", campaign: "" }],
            };
            localStorage.setItem("LTVFilters", JSON.stringify(newState));
            return newState;
        },
        restoreFiltersFromStorage: (state) => {
            console.log("Restoring filters from localStorage");
            return loadState();
        }
    },
});

export const { addFilter, resetFilters, resetFiltersKeepGame, restoreFiltersFromStorage } = LTVSlice.actions;
export default LTVSlice.reducer;
