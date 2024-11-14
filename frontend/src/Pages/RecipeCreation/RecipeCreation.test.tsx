import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, Mock, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RecipeCreation from "./RecipeCreation";
import { importRecipeFromUrl, getRecipeById } from "../../Api/api";
import { mockRecipes } from "../../__mock__/mockRecipes";

vi.mock("../../Api/api", () => ({
  importRecipeFromUrl: vi.fn(),
  getRecipeById: vi.fn(),
}));

describe("RecipeCreation Page", () => {
const mockImportRecipeFromUrl = importRecipeFromUrl as Mock;
const mockGetRecipeById = getRecipeById as Mock;

  it("should render the component correctly", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<RecipeCreation />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("New Recipe")).toBeInTheDocument();
  });

  it("should handle success state when importing a recipe", async () => {
    mockImportRecipeFromUrl.mockResolvedValueOnce({ data: mockRecipes[0] });

    const initialEntries = [{ state: 'http://example.com/recipe' }];

    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<RecipeCreation />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Recipe is imported successfully!")).toBeInTheDocument();
    });
    expect(importRecipeFromUrl).toHaveBeenCalledTimes(1);
  });

  it("should handle error state when importing a recipe", async () => {
    const mockError = { response: { data: { message: "Error importing recipe" } }, };
    const initialEntries = [{ state: 'http://example.com/recipe' }];

    mockImportRecipeFromUrl.mockRejectedValueOnce(mockError);

    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<RecipeCreation />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Error importing recipe")).toBeInTheDocument();
    });
  });

  it("should fetch recipe details when recipeId is present", async () => {
    mockGetRecipeById.mockResolvedValueOnce({ data: mockRecipes[0] });
    const initialRecipeId = "1";

    render(
      <MemoryRouter initialEntries={[`/recipe/${initialRecipeId}`]}>
        <Routes>
          <Route path="/recipe/:recipeId" element={<RecipeCreation />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/enter recipe name/i)
      expect(input).toHaveValue(mockRecipes[0].name)
    });
    expect(getRecipeById).toHaveBeenCalledTimes(1);
  });

});
