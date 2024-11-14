import { render, screen, waitFor } from "@testing-library/react";
import RecipesSearchResult from "./RecipesSearchResult";
import { useLocation, useParams } from "react-router-dom";
import { describe, it, vi, Mock, beforeEach, expect } from "vitest";
import { searchRecipes } from "../../Api/api";
import { InfiniteList } from "../../Components/InfiniteList/InfiniteList";
// import { RecipeDetailsInterface } from "../../Api/apiInterface";
import userEvent from '@testing-library/user-event'
import { mockRecipes } from "../../__mock__/mockRecipes";

// Mock dependencies
vi.mock("react-router-dom", () => ({
    useLocation: vi.fn(),
    useParams: vi.fn(),
}));

vi.mock("../../Api/api", () => ({
    searchRecipes: vi.fn(),
}));

vi.mock("../../Components/InfiniteList/InfiniteList", () => ({
    InfiniteList: vi.fn(({ renderItem }) => <div>{renderItem(mockRecipes)}</div>),
}));

vi.mock("../../Components/RecipeCard/RecipeCard", () => ({
    default: () => <div>{mockRecipes[0].name}</div>,
}));

vi.mock("../../Components/SearchBar/SearchBar", () => ({
    default: vi.fn(({ searchValue, setSearchValue }) => (
        <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
        />
    )),
}));

vi.mock("../../Components/MealForm/MealForm", () => ({
    default: () => <div>MealForm</div>,
}));

vi.mock("../../Components/FamilyMealForm/FamilyMealForm", () => ({
    default: () => <div>FamilyMealForm</div>,
}));

vi.mock("../../Components/GoTopButton/GoTopButton", () => ({
    default: () => <div>GoTopButton</div>,
}));

vi.mock("../../Hooks/useDebounce", () => ({
    default: (value: string) => value,
}));

describe("RecipesSearchResult", () => {
    const mockUseLocation = useLocation as Mock;
    const mockUseParams = useParams as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders SearchBar and InfiniteList with the correct initial state", () => {
        mockUseLocation.mockReturnValue({ state: { isFromMealForm: false } });
        mockUseParams.mockReturnValue({ searchRecipeName: "spaghetti" });
        
        render(<RecipesSearchResult />);

        // Verify SearchBar
        const searchBar = screen.getByPlaceholderText("Search...");
        expect(searchBar).toHaveValue("spaghetti");

        // Verify InfiniteList
        expect(InfiniteList).toHaveBeenCalledWith(
            expect.objectContaining({
                fetchItems: searchRecipes,
                query: "RecipeName=spaghetti",
            }),
            {}
        );

        // Verify RecipeCard is rendered inside InfiniteList
        expect(screen.getByText("Spaghetti Carbonara")).toBeInTheDocument();
    });

    it("renders MealForm, FamilyMealForm, and GoTopButton when not from meal form", () => {
        mockUseLocation.mockReturnValue({ state: { isFromMealForm: false } });
        mockUseParams.mockReturnValue({});

        render(<RecipesSearchResult />);

        expect(screen.getByText("MealForm")).toBeInTheDocument();
        expect(screen.getByText("FamilyMealForm")).toBeInTheDocument();
        expect(screen.getByText("GoTopButton")).toBeInTheDocument();
    });

    it("does not render MealForm, FamilyMealForm, and GoTopButton when isFromMealForm is true", () => {
        mockUseLocation.mockReturnValue({ state: { isFromMealForm: true } });
        mockUseParams.mockReturnValue({});

        render(<RecipesSearchResult />);

        expect(screen.queryByText("MealForm")).not.toBeInTheDocument();
        expect(screen.queryByText("FamilyMealForm")).not.toBeInTheDocument();
        expect(screen.queryByText("GoTopButton")).not.toBeInTheDocument();
    });

    it("updates search query on input change", async () => {
        mockUseLocation.mockReturnValue({ state: { isFromMealForm: false } });
        mockUseParams.mockReturnValue({ searchRecipeName: "" });

        render(<RecipesSearchResult />);
        
        const searchBar = screen.getByPlaceholderText("Search...");
        await userEvent.type(searchBar, "vegan");

        await waitFor(() => {
            expect(InfiniteList).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    query: "RecipeName=vegan",
                }),
                expect.anything()
            );
        });
    });
});
