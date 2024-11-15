import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import RecipeDetails from "./RecipeDetails";
import { getFamiliesWithUsersByUserId, getMealTypes, getRecipeById } from "../../Api/api";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { mockRecipes } from "../../__mock__/mockRecipes";
import { MealProvider } from "../../Components/MealContext/MealContext";
import { mockMealTypes } from "../../__mock__/mockMealTypes";
import { mockFamiliesWithUsers } from "../../__mock__/mockFamiliesWithUsers";

// Mock the necessary dependencies
vi.mock("../../Api/api", () => ({
    getRecipeById: vi.fn(),
    getMealTypes: vi.fn(),
    getFamiliesWithUsersByUserId: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

const mockSetFormType = vi.fn();
const mockSetMealDate = vi.fn();
const mockSetStatus = vi.fn();
const mockSetErrorMessages = vi.fn();
const mockSetSelectedFamily = vi.fn();
const mockSetModalShow = vi.fn();
const mockSetMealTypes = vi.fn();
const errorMessages: string[] = [];
const mockModalShow = true;
const mockMode = true;

vi.mock('../../Components/MealContext/MealContext', () => ({
    useMeal: () => ({
      setFormType: mockSetFormType,
      setMealDate: mockSetMealDate,
      setStatus: mockSetStatus,
      errorMessages,
      setErrorMessages: mockSetErrorMessages,
      setSelectedFamily: mockSetSelectedFamily,
      setModalShow: mockSetModalShow,
      setMode: mockSetStatus,
      setMealTypes: mockSetMealTypes,
      modalShow: mockModalShow,
      mode: mockMode,
      mealTypes: mockMealTypes,
    }),
    MealProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  }));

describe("RecipeDetails Component", () => {
    const mockGetRecipeById = getRecipeById as Mock;
    const mockNavigate = vi.fn();
    const mockGetMealTypes = getMealTypes as Mock;
    const mockGetFamiliesWithUsersByUserId = getFamiliesWithUsersByUserId as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as Mock).mockReturnValue(mockNavigate);
        mockGetMealTypes.mockResolvedValue({  data: mockMealTypes });
    });

    it("renders loading message initially", async () => {
        const recipe = mockRecipes[0];
        mockGetRecipeById.mockResolvedValueOnce({ data: recipe});
        mockGetFamiliesWithUsersByUserId.mockResolvedValue({ data: mockFamiliesWithUsers });

        render(
            <MealProvider>
            <MemoryRouter initialEntries={["/recipe-details/1"]}>
                <RecipeDetails />
            </MemoryRouter>
            </MealProvider>
        );

        expect(screen.getByText(/Getting recipe.../i)).toBeInTheDocument();
    });

    it("fetches and displays recipe data on successful load", async () => {
        const recipe = mockRecipes[0];
        mockGetRecipeById.mockResolvedValueOnce({ data: recipe});
        mockGetFamiliesWithUsersByUserId.mockResolvedValue({ data: mockFamiliesWithUsers });

        render(
            <MealProvider>
            <MemoryRouter initialEntries={["/recipe-details/1"]}>
                <RecipeDetails />
            </MemoryRouter>
            </MealProvider>
        );

        await waitFor(() => expect(screen.getByText(mockRecipes[0].name!)).toBeInTheDocument());
    });

    it("shows error message on failed data fetch", async () => {
        const errorMessage = "Error getting recipe";
        vi.mocked(getRecipeById).mockRejectedValue({ response: { data: { message: errorMessage } } });

        render(
            <MealProvider>
            <MemoryRouter initialEntries={["/recipe-details/1"]}>
                <RecipeDetails />
            </MemoryRouter>
            </MealProvider>
        );

        await waitFor(() => expect(screen.getByText(errorMessage)).toBeInTheDocument());
    });

    it("navigates back on back button click", async () => {
        const recipe = mockRecipes[0];
        mockGetRecipeById.mockResolvedValueOnce({ data: recipe });
        mockGetFamiliesWithUsersByUserId.mockResolvedValue({ data: mockFamiliesWithUsers });

        render(
            <MealProvider>
            <MemoryRouter initialEntries={["/recipe-details/1"]}>
                <RecipeDetails />
            </MemoryRouter>
            </MealProvider>
        );

        const backButton = screen.getByLabelText(/go back/i);
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it("shows delete confirmation on delete menu click", async () => {
        const recipe = mockRecipes[0];
        mockGetRecipeById.mockResolvedValueOnce({ data: recipe });
        mockGetFamiliesWithUsersByUserId.mockResolvedValue({ data: mockFamiliesWithUsers });

        render(
            <MealProvider>
            <MemoryRouter initialEntries={["/recipe-details/1"]}>
                <RecipeDetails />
            </MemoryRouter>
            </MealProvider>
        );

        await waitFor(() => screen.getByText(mockRecipes[0].name!));

        const moreButton = screen.getByRole("button", { name: /more button/i });
        fireEvent.click(moreButton);

        const deleteOption = screen.getByText("Delete");
        fireEvent.click(deleteOption);

        expect(screen.getByText(/delete recipe/i)).toBeInTheDocument();
    });

    it("navigates to edit page on edit menu click", async () => {
        const recipe = mockRecipes[0];
        mockGetRecipeById.mockResolvedValueOnce({ data: recipe });
        mockGetFamiliesWithUsersByUserId.mockResolvedValue({ data: mockFamiliesWithUsers });
        
        render(
            <MealProvider>
            <MemoryRouter initialEntries={["/recipe-details/1"]}>
                <RecipeDetails />
            </MemoryRouter>
            </MealProvider>
        );

        await waitFor(() => screen.getByText(recipe.name!));

        const moreButton = screen.getByRole("button", { name: /more button/i });
        fireEvent.click(moreButton);

        const editOption = screen.getByText("Edit");
        fireEvent.click(editOption);

        expect(mockNavigate).toHaveBeenCalledWith("/recipe-edit/1");
    });

    it("not show edit and delete button to non-owners", async () => {
        const recipe = mockRecipes[1];
        mockGetRecipeById.mockResolvedValueOnce({ data: recipe });
        mockGetFamiliesWithUsersByUserId.mockResolvedValue({ data: mockFamiliesWithUsers });
        
        render(
            <MealProvider>
            <MemoryRouter initialEntries={["/recipe-details/1"]}>
                <RecipeDetails />
            </MemoryRouter>
            </MealProvider>
        );

        await waitFor(() => screen.getByText(recipe.name!));

        const moreButton = screen.getByRole("button", { name: /more button/i });
        fireEvent.click(moreButton);

        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    });
});
