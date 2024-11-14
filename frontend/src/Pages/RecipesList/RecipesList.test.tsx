import { render, screen, waitFor } from "@testing-library/react";
import RecipesList from "./RecipesList";
import { useLocation, useParams } from "react-router-dom";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { getRecipeByUserId } from "../../Api/api";
import { mockRecipes } from "../../__mock__/mockRecipes";

// Mock the dependencies
vi.mock("react-router-dom", () => ({
    useLocation: vi.fn(),
    useParams: vi.fn(),
}));

vi.mock("../../Api/api", () => ({
    getRecipeByUserId: vi.fn(),
}));


vi.mock("../../Components/RecipeCard/RecipeCard", () => ({
    default: vi.fn(({ recipe }) => <div>{recipe.name}</div>),
}));

describe("RecipesList", () => {
    const mockGetRecipeByUserId = getRecipeByUserId as Mock;
    const mockUseParams = useParams as Mock;
    const mockUseLocation = useLocation as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseParams.mockReturnValue({ userId: 123 });
        mockUseLocation.mockReturnValue({ state: { isFromMealForm: true } });
    });

    it("displays loading message initially", async () => {
        mockGetRecipeByUserId.mockResolvedValue({ data: mockRecipes });
        await render(<RecipesList />);
        expect(screen.getByText(/Getting recipes.../i)).toBeInTheDocument();
    });

    it("renders recipes list after successful fetch", async () => {
        mockGetRecipeByUserId.mockResolvedValue({ data: mockRecipes });

        await render(<RecipesList />);
        await waitFor(() => expect(getRecipeByUserId).toHaveBeenCalled());

        for (const recipe of mockRecipes) {
            expect(screen.getByText(recipe.name!)).toBeInTheDocument();
        }
    });

    it("shows error message on failed data fetch", async () => {
        const errorMessage = "Error getting recipes";
        vi.mocked(getRecipeByUserId).mockRejectedValue({ response: { data: { message: errorMessage } } });

        render(
            <RecipesList />
        );

        await waitFor(() => expect(screen.getByText(errorMessage)).toBeInTheDocument());
    });
});
