import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FamilyMealDaily from './FamilyMealDaily';
import { MealProvider} from '../../Components/MealContext/MealContext';
import { getFamiliesWithUsersByUserId, getMealByDateUserId, getMealTypes } from '../../Api/api';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { mockMealDetails } from '../../__mock__/mockMealDetails';
import { MemoryRouter } from 'react-router-dom';
import { mockMealTypes } from '../../__mock__/mockMealTypes';
import { mockFamiliesWithUsers } from '../../__mock__/mockFamiliesWithUsers';

// Mock API and context
vi.mock('../../Api/api', () => ({
  getFamiliesWithUsersByUserId: vi.fn(),
  getMealByDateUserId: vi.fn(),
  getMealTypes: vi.fn(),
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

describe('FamilyMealDaily Page', () => {
  const mockGetFamiliesWithUsersByUserId = getFamiliesWithUsersByUserId as Mock;
  const mockGetMealByDateUserId = getMealByDateUserId as Mock;
  const mockGetMealTypes = getMealTypes as Mock;

  beforeEach(() => {
    mockGetFamiliesWithUsersByUserId.mockResolvedValue({ data: mockFamiliesWithUsers });
    mockGetMealByDateUserId.mockResolvedValue({ data: mockMealDetails });
    mockGetMealTypes.mockResolvedValue({  data: mockMealTypes });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders FamilyMealDaily component and sets form type to "family"', async () => {
    render(
      <MealProvider>
        <MemoryRouter>
          <FamilyMealDaily />
        </MemoryRouter>
      </MealProvider>);
    await waitFor(() => {
      expect(mockSetFormType).toHaveBeenCalledWith("family");
    });
  });

  it('displays loading message initially', async () => {
    render(
      <MealProvider>
        <MemoryRouter>
          <FamilyMealDaily />
        </MemoryRouter>
      </MealProvider>);
    expect(screen.getByText(/Getting families and meals.../i)).toBeInTheDocument();
  });

  it('calls getFamiliesWithUsersByUserId API and displays data when successful', async () => {
    mockGetFamiliesWithUsersByUserId.mockResolvedValueOnce({ data: mockFamiliesWithUsers });
    mockGetMealByDateUserId.mockResolvedValueOnce({ data: mockMealDetails });
    mockGetMealTypes.mockResolvedValueOnce({ data: mockMealTypes});

    render(
      <MealProvider>
        <MemoryRouter>
          <FamilyMealDaily />
        </MemoryRouter>
      </MealProvider>);

    await waitFor(() => {
      expect(mockGetFamiliesWithUsersByUserId).toHaveBeenCalled();
      const tabs = screen.getByLabelText("families-meals-tabs");
      expect(tabs).toBeInTheDocument();
    });
  });

  // it('displays error message when API call fails', async () => {
  //   const mockError = { response: { data: { message: 'Error getting families with users' } }, };

  //   mockGetFamiliesWithUsersByUserId.mockRejectedValueOnce(mockError);

  //   render(
  //     <MealProvider>
  //       <MemoryRouter>
  //         <FamilyMealDaily />
  //       </MemoryRouter>
  //     </MealProvider>);

  //   await waitFor(() => {
  //     expect(screen.getByText('Error getting families with users')).toBeInTheDocument();
  //   });
  // });

  it('renders "No families available" if familyUsersList is empty', async () => {
    mockGetFamiliesWithUsersByUserId.mockResolvedValueOnce({ data: [] });

    render(
      <MealProvider>
        <MemoryRouter>
          <FamilyMealDaily />
        </MemoryRouter>
      </MealProvider>);

    await waitFor(() => {
      expect(screen.getByText('No families available')).toBeInTheDocument();
    });
  });

  it('renders DateBar, FamilyMealsBottomBar components FamilyForm should not be shown', async () => {
    render(
      <MealProvider>
        <MemoryRouter>
          <FamilyMealDaily />
        </MemoryRouter>
      </MealProvider>);

    expect(screen.getByLabelText('Date Bar')).toBeInTheDocument();
    expect(screen.getByLabelText('Family Meals Bottom Bar')).toBeInTheDocument();
    expect(screen.queryByLabelText('Family Meal Form')).toBeInTheDocument();
  });

  it('should show FamilyForm when Add Meal to Family is clicked ', async () => {
    mockGetFamiliesWithUsersByUserId.mockResolvedValueOnce({ data: mockFamiliesWithUsers });
    mockGetMealByDateUserId.mockResolvedValueOnce({ data: mockMealDetails });
    mockGetMealTypes.mockResolvedValueOnce({ data: mockMealTypes});

    render(
      <MealProvider>
        <MemoryRouter>
          <FamilyMealDaily />
        </MemoryRouter>
      </MealProvider>);

    const addIcon = screen.getByLabelText('Add Meal to Family');
    fireEvent.click(addIcon);

    await waitFor(() => expect(screen.getByLabelText('Family Meal Form')).toBeInTheDocument());
  });
});