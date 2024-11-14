import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { getFamiliesWithUsersByUserId, getMealByDateUserId, getMealTypes } from "../../Api/api";
import { mockMealTypes } from "../../__mock__/mockMealTypes";
import MealPlanMonthly from "./MealPlanMonthly";
import { mockMealDetails } from "../../__mock__/mockMealDetails";
import { mockFamiliesWithUsers } from "../../__mock__/mockFamiliesWithUsers";

// Mock API calls and necessary components
vi.mock("../../Api/api", () => ({
  getFamiliesWithUsersByUserId: vi.fn(),
  getMealByDateUserId: vi.fn(),
  getMealTypes: vi.fn()
}));

// Mock components for testing
vi.mock("../../Components/MealCard/MealCard", () => ({
  default: vi.fn(({ meal }) => <div>{meal.recipeName}</div>),
}));

vi.mock("../../Components/FamilyMealsCard/FamilyMealsCard", () => ({
  default: vi.fn(({ data }) => <div>{data.familyName}'s Meal</div>),
}));

const mockSetFormType = vi.fn();
const mockSetMealDate = vi.fn();
const mockSetStatus = vi.fn();
const mockSetErrorMessages = vi.fn();
const mockSetSelectedFamily = vi.fn();
const mockSetModalShow = vi.fn();
const mockSetMealTypes = vi.fn();
const mockSetMode = vi.fn();
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
      setMode: mockSetMode,
      setMealTypes: mockSetMealTypes,
      modalShow: mockModalShow,
      mode: mockMode,
      formType: mockFormType,
      mealTypes: mockMealTypes,
    }),
    MealProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  }));

describe("MealPlanMonthly", () => {
//   const mockSetModalShow = vi.fn();
//   const mockSetMode = vi.fn();
//   const mockSetMealDate = vi.fn();
//   const mockSetFormType = vi.fn();
  const mockGetMealByDateUserId = getMealByDateUserId as Mock;
  const mockGetFamiliesWithUsersByUserId = getFamiliesWithUsersByUserId as Mock;
  const mockGetMealTypes = getMealTypes as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays loading state while fetching meal data", async () => {
    mockGetMealByDateUserId.mockResolvedValueOnce({ data: [] });
    mockGetFamiliesWithUsersByUserId.mockResolvedValueOnce({ data: mockFamiliesWithUsers });
    mockGetMealTypes.mockResolvedValueOnce({data: mockMealTypes});

    await render(<MealPlanMonthly />);

    expect(screen.getByText(/Loading Meals../i)).toBeInTheDocument();
  });

  it("displays meal data after successful fetch", async () => {
    mockGetMealByDateUserId.mockResolvedValueOnce({ data: mockMealDetails });
    mockGetFamiliesWithUsersByUserId.mockResolvedValueOnce({ data: mockFamiliesWithUsers });
    mockGetMealTypes.mockResolvedValueOnce({data: mockMealTypes});

    await render(<MealPlanMonthly />);

    await waitFor(() => expect(getMealByDateUserId).toHaveBeenCalled());

    // mockMealDetails.forEach((meal) => {
    //   expect(screen.getByText(meal.recipeName!)).toBeInTheDocument();
    // });
  });

  it("displays family users' meal cards", async () => {
    mockGetMealByDateUserId.mockResolvedValueOnce({ data: mockMealDetails });
    mockGetFamiliesWithUsersByUserId.mockResolvedValueOnce({ data: mockFamiliesWithUsers });
    mockGetMealTypes.mockResolvedValueOnce({data: mockMealTypes});

    await render(<MealPlanMonthly />);

    await waitFor(() => expect(mockGetFamiliesWithUsersByUserId).toHaveBeenCalled());

    mockFamiliesWithUsers.forEach((family) => {
      expect(screen.getByText(`${family.familyName}'s Meal`)).toBeInTheDocument();
    });
  });

//   it("handles errors while fetching meal data", async () => {
//     const errorMessage = "Error fetching meals";
//     mockGetMealByDateUserId.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

//     render(<MealPlanMonthly />);

//     await waitFor(() => expect(screen.getByText(errorMessage)).toBeInTheDocument());
//   });

  it("handles click event on add meal button", async () => {
    mockGetMealByDateUserId.mockResolvedValueOnce({ data: mockMealDetails });
    mockGetFamiliesWithUsersByUserId.mockResolvedValueOnce({ data: mockFamiliesWithUsers });
    mockGetMealTypes.mockResolvedValueOnce({data: mockMealTypes});

    await render(<MealPlanMonthly />);

    const addMealButton = screen.getByLabelText(/add meal/i);
    expect(addMealButton).toBeInTheDocument();
    fireEvent.click(addMealButton);

    expect(mockSetModalShow).toHaveBeenCalledWith(true);
    expect(mockSetMode).toHaveBeenCalledWith("Add");
  });
});
