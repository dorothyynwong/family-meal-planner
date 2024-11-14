import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { getRecipeById } from "../../Api/api";
import { useParams } from "react-router-dom";
import { RecipeDetailsInterface } from "../../Api/apiInterface";
import UpdateRecipe from "./RecipeUpdate";
import { mockRecipes } from "../../__mock__/mockRecipes";

// Mock dependencies
vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
}));

vi.mock("../../Api/api", () => ({
  getRecipeById: vi.fn(),
}));

vi.mock("../../Components/RecipeForm/RecipeForm", () => ({
  default: ({ data }: { data: RecipeDetailsInterface }) => <div>{data.name}</div>,
}));

describe("UpdateRecipe", () => {
  const mockGetRecipeById = getRecipeById as Mock;
  const mockUseParams = useParams as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ recipeId: "1" });
  });

  it("displays loading message initially", () => {
    mockGetRecipeById.mockResolvedValueOnce({ data: mockRecipes[0] });
    render(<UpdateRecipe />);
    expect(screen.getByText(/Getting recipe .../i)).toBeInTheDocument();
  });

  it("renders recipe data after successful fetch", async () => {
    mockGetRecipeById.mockResolvedValueOnce({ data: mockRecipes[0] });

    render(<UpdateRecipe />);
    await waitFor(() => expect(getRecipeById).toHaveBeenCalledWith(1));
    const recipeName = mockRecipes[0].name!;
    expect(screen.getByText(recipeName)).toBeInTheDocument();
  });

  it("shows error message on failed data fetch", async () => {
    const errorMessage = "Error getting recipe";
    mockGetRecipeById.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    render(<UpdateRecipe />);
    await waitFor(() => expect(screen.getByText(errorMessage)).toBeInTheDocument());
  });
});
