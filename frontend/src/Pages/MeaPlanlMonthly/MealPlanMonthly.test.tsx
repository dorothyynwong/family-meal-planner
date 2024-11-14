import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { getFamiliesWithUsersByUserId, getMealByDateUserId } from "../../Api/api";
import { mockMealTypes } from "../../__mock__/mockMealTypes";
import { mockFamilies } from "../../__mock__/mockFamilies";
import MealPlanMonthly from "./MealPlanMonthly";
import { mockMealDetails } from "../../__mock__/mockMealDetails";

// Mock API calls and necessary components
vi.mock("../../Api/api", () => ({
  getFamiliesWithUsersByUserId: vi.fn(),
  getMealByDateUserId: vi.fn(),
}));

vi.mock("../../Components/MealContext/MealContext", () => ({
  useMeal: vi.fn(),
}));

// Mock components for testing
vi.mock("../../Components/MealCard/MealCard", () => ({
  default: vi.fn(({ meal }) => <div>{meal.name}</div>),
}));

vi.mock("../../Components/FamilyMealsCard/FamilyMealsCard", () => ({
  default: vi.fn(({ mealDate, data }) => <div>{data.nickname}'s Meal on {mealDate}</div>),
}));

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
const mockFormType = 'family';

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
      formType: mockFormType,
      mealTypes: mockMealTypes,
    }),
    MealProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  }));

describe("MealPlanMonthly", () => {
  const mockSetModalShow = vi.fn();
  const mockSetMode = vi.fn();
//   const mockSetMealDate = vi.fn();
//   const mockSetFormType = vi.fn();
  const mockGetMealByDateUserId = getMealByDateUserId as Mock;
  const mockGetFamiliesWithUsersByUserId = getFamiliesWithUsersByUserId as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays loading state while fetching meal data", async () => {
    mockGetMealByDateUserId.mockResolvedValueOnce({ data: [] });
    mockGetFamiliesWithUsersByUserId.mockResolvedValueOnce({ data: mockFamilies });

    render(<MealPlanMonthly />);

    expect(screen.getByText(/Loading Meals../i)).toBeInTheDocument();
  });

  it("displays meal data after successful fetch", async () => {
    mockGetMealByDateUserId.mockResolvedValueOnce({ data: mockMealDetails });
    mockGetFamiliesWithUsersByUserId.mockResolvedValueOnce({ data: mockFamilies });

    render(<MealPlanMonthly />);

    await waitFor(() => expect(getMealByDateUserId).toHaveBeenCalled());

    // Check if meal names appear in the document
    mockMealDetails.forEach((meal) => {
      expect(screen.getByText(meal.recipeName!)).toBeInTheDocument();
    });
  });

  it("displays family users' meal cards", async () => {
    mockGetMealByDateUserId.mockResolvedValueOnce({ data: mockMealDetails });
    mockGetFamiliesWithUsersByUserId.mockResolvedValueOnce({ data: mockFamilies });

    render(<MealPlanMonthly />);

    await waitFor(() => expect(getFamiliesWithUsersByUserId).toHaveBeenCalled());

    // Check if family meal cards appear for each user
    mockFamilies.forEach((family) => {
      expect(screen.getByText(`${family.familyName}'s Meal on ${new Date().toLocaleDateString()}`)).toBeInTheDocument();
    });
  });

  it("handles errors while fetching meal data", async () => {
    const errorMessage = "Error fetching meals";
    mockGetMealByDateUserId.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });
    mockGetFamiliesWithUsersByUserId.mockResolvedValueOnce({ data: mockFamilies });

    render(<MealPlanMonthly />);

    await waitFor(() => expect(screen.getByText(errorMessage)).toBeInTheDocument());
  });

  it("handles click event on add meal button", () => {
    mockGetMealByDateUserId.mockResolvedValueOnce({ data: mockMealDetails });
    mockGetFamiliesWithUsersByUserId.mockResolvedValueOnce({ data: mockFamilies });

    render(<MealPlanMonthly />);

    const addMealButton = screen.getByRole("button", { name: /add meal/i });
    fireEvent.click(addMealButton);

    expect(mockSetModalShow).toHaveBeenCalledWith(true);
    expect(mockSetMode).toHaveBeenCalledWith("Add");
  });
});
