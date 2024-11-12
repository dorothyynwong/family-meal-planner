import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RecipeCreation from "./RecipeCreation";
import { importRecipeFromUrl, getRecipeById } from "../../Api/api";
import { RecipeDetailsInterface } from "../../Api/apiInterface";

vi.mock("../../Api/api", () => ({
  importRecipeFromUrl: vi.fn(),
  getRecipeById: vi.fn(),
}));

describe("RecipeCreation", () => {

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
    const mockRecipeData: RecipeDetailsInterface = {
      name: "Test Recipe",
      images: [],
      notes: "Some notes",
      description: "Test description",
      recipeIngredients: [],
      recipeInstructions: [],
      recipeUrl: "",
    };

    importRecipeFromUrl.mockResolvedValueOnce({ data: mockRecipeData });

    render(
      <MemoryRouter initialEntries={["/"]}>
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
    importRecipeFromUrl.mockRejectedValueOnce({ response: { data: { message: "Error importing recipe" } } });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<RecipeCreation />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Error importing recipe")).toBeInTheDocument();
    });
    expect(importRecipeFromUrl).toHaveBeenCalledTimes(1);
  });

  it("should fetch recipe details when recipeId is present", async () => {
    const mockRecipeData: RecipeDetailsInterface = {
      name: "Recipe by ID",
      images: [],
      notes: "Recipe notes",
      description: "Recipe description",
      recipeIngredients: [],
      recipeInstructions: [],
      recipeUrl: "",
    };

    getRecipeById.mockResolvedValueOnce({ data: mockRecipeData });
    const initialRecipeId = "123";

    render(
      <MemoryRouter initialEntries={[`/recipe/${initialRecipeId}`]}>
        <Routes>
          <Route path="/recipe/:recipeId" element={<RecipeCreation />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Recipe by ID")).toBeInTheDocument();
    });
    expect(getRecipeById).toHaveBeenCalledTimes(1);
  });

  it("should not make an API call if recipeId is invalid", async () => {
    const invalidRecipeId = "abc";

    render(
      <MemoryRouter initialEntries={[`/recipe/${invalidRecipeId}`]}>
        <Routes>
          <Route path="/recipe/:recipeId" element={<RecipeCreation />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // We don't expect the recipe to be rendered since the API call was not triggered
      expect(screen.queryByText("Recipe by ID")).not.toBeInTheDocument();
    });
    expect(getRecipeById).not.toHaveBeenCalled();
  });

  it("should handle URL import logic if URL state is provided", async () => {
    const mockRecipeData: RecipeDetailsInterface = {
      name: "Imported Recipe",
      images: [],
      notes: "Imported recipe notes",
      description: "Imported recipe description",
      recipeIngredients: [],
      recipeInstructions: [],
      recipeUrl: "http://someurl.com",
    };

    const mockLocationState = "http://someurl.com";

    importRecipeFromUrl.mockResolvedValueOnce({ data: mockRecipeData });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<RecipeCreation />} />
        </Routes>
      </MemoryRouter>
    );

    // Mocking location state
    vi.spyOn(require("react-router-dom"), "useLocation").mockReturnValue({ state: mockLocationState } as any);

    await waitFor(() => {
      expect(screen.getByText("Recipe is imported successfully!")).toBeInTheDocument();
    });
    expect(importRecipeFromUrl).toHaveBeenCalledTimes(1);
  });

  it("should not trigger import if URL state is empty or null", async () => {
    const mockLocationState = null;

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<RecipeCreation />} />
        </Routes>
      </MemoryRouter>
    );

    // Mocking location state
    vi.spyOn(require("react-router-dom"), "useLocation").mockReturnValue({ state: mockLocationState } as any);

    await waitFor(() => {
      expect(screen.queryByText("Recipe is imported successfully!")).not.toBeInTheDocument();
    });
    expect(importRecipeFromUrl).not.toHaveBeenCalled();
  });

});
