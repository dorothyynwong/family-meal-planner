import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import RecipeDetails from "./RecipeDetails";
import { getRecipeById } from "../../Api/api";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { mockRecipes } from "../../__mock__/mockRecipes";

// Mock the necessary dependencies
vi.mock("../../Api/api", () => ({
    getRecipeById: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});


describe("RecipeDetails Component", () => {
    const mockGetRecipeById = getRecipeById as Mock;
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as Mock).mockReturnValue(mockNavigate);
    });

    it("renders loading message initially", async () => {
        mockGetRecipeById.mockResolvedValueOnce({ data: mockRecipes[0] });

        render(
            <MemoryRouter initialEntries={["/recipe-details/1"]}>
                <RecipeDetails />
            </MemoryRouter>
        );

        expect(screen.getByText(/Getting recipe.../i)).toBeInTheDocument();
    });

    it("fetches and displays recipe data on successful load", async () => {
        mockGetRecipeById.mockResolvedValueOnce({ data: mockRecipes[0] });

        render(
            <MemoryRouter initialEntries={["/recipe-details/1"]}>
                <RecipeDetails />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText("Spaghetti Carbonara")).toBeInTheDocument());
    });

    it("shows error message on failed data fetch", async () => {
        const errorMessage = "Error getting recipe";
        vi.mocked(getRecipeById).mockRejectedValue({ response: { data: { message: errorMessage } } });

        render(
            <MemoryRouter initialEntries={["/recipe-details/1"]}>
                <RecipeDetails />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText(errorMessage)).toBeInTheDocument());
    });

    it("navigates back on back button click", async () => {
        mockGetRecipeById.mockResolvedValueOnce({ data: mockRecipes[0] });

        render(
            <MemoryRouter initialEntries={["/recipe-details/1"]}>
                <RecipeDetails />
            </MemoryRouter>
        );

        const backButton = screen.getByLabelText(/go back/i);
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it("shows delete confirmation on delete menu click", async () => {
        mockGetRecipeById.mockResolvedValueOnce({ data: mockRecipes[0] });

        render(
            <MemoryRouter initialEntries={["/recipe-details/1"]}>
                <RecipeDetails />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText("Spaghetti Carbonara"));

        const moreButton = screen.getByRole("button", { name: /more button/i });
        fireEvent.click(moreButton);

        const deleteOption = screen.getByText("Delete");
        fireEvent.click(deleteOption);

        expect(screen.getByText(/delete recipe/i)).toBeInTheDocument();
    });

    it("navigates to edit page on edit menu click", async () => {
        mockGetRecipeById.mockResolvedValueOnce({ data: mockRecipes[0] });
        
        render(
            <MemoryRouter initialEntries={["/recipe-details/1"]}>
                <RecipeDetails />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText("Spaghetti Carbonara"));

        const moreButton = screen.getByRole("button", { name: /more button/i });
        fireEvent.click(moreButton);

        const editOption = screen.getByText("Edit");
        fireEvent.click(editOption);

        expect(mockNavigate).toHaveBeenCalledWith("/recipe-edit/1");
    });
});
