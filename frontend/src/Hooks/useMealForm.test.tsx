
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { addMeal, deleteMeal, getMealTypes } from '../Api/api';
import useMealForm from './useMealForm';
import { act, renderHook } from '@testing-library/react';
import { mockMealTypes } from '../__mock__/mockMealTypes';

// Mock API and Context
vi.mock('../Api/api', () => ({
  addMeal: vi.fn(),
  deleteMeal: vi.fn(),
  getMealTypes: vi.fn(),
  updateMeal: vi.fn(),
}));

const mockSetStatus = vi.fn();
const mockSetMealDate = vi.fn();
const mockSetMealTypes = vi.fn();
const mockSetErrorMessages = vi.fn();
const mockSetModalShow = vi.fn();
const mockResetMealContext = vi.fn();
const errorMessages: string[] = [];
const mockMode = 'Add';
const mockFormType = 'family';
const mockSetRecipeName = vi.fn();

vi.mock('../Components/MealContext/MealContext', () => ({
  useMeal: () => ({
    mode: mockMode,
    currentMeal: { id: 1 },
    recipeName: '',
    setRecipeName: vi.fn(),
    selectedRecipe: { id: 123, name: 'Test Recipe' },
    selectedMealType: 'Dinner',
    mealDate: '',
    setMealDate: mockSetMealDate,
    mealNotes: 'Test Notes',
    setModalShow: mockSetModalShow,
    resetMealContext: mockResetMealContext,
    selectedFamily: { familyId: 456 },
    schoolMealId: 0,
    setMealTypes: mockSetMealTypes,
    setStatus: mockSetStatus,
    errorMessages,
    setErrorMessages: mockSetErrorMessages,
    formType: mockFormType,
    isFromRecipeList: false,
    mealTypes: mockMealTypes,
  }),
  MealProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('useMealForm Hook', () => {
  const mockAddMeal = addMeal as Mock;
  const mockDeleteMeal = deleteMeal as Mock;
  const mockGetMealTypes = getMealTypes as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes the form on mount', async () => {
    mockGetMealTypes.mockResolvedValueOnce({ data: mockMealTypes });

    const { result } = renderHook(() => useMealForm());

    const mockEvent = {
        preventDefault: vi.fn(),
        target: {} as EventTarget,
        currentTarget: {} as EventTarget,
    } as unknown as React.FormEvent<HTMLFormElement>;
      

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockSetStatus).toHaveBeenCalledWith('loading');
    expect(mockGetMealTypes).toHaveBeenCalled();
    expect(mockSetMealTypes).toHaveBeenCalledWith(mockMealTypes);
    expect(mockSetStatus).toHaveBeenCalledWith('idle');
  });

//   it('handles form validation and displays errors', async () => {
//     const { result } = renderHook(() => useMealForm());

//     const mockEvent = {
//         preventDefault: vi.fn(),
//         target: {} as EventTarget,
//         currentTarget: {} as EventTarget,
//     } as unknown as React.FormEvent<HTMLFormElement>;

//     act(() => {
//       result.current.handleSubmit(mockEvent);
//     });

//     expect(mockSetStatus).toHaveBeenCalledWith('error');
//     expect(mockSetErrorMessages).toHaveBeenCalledWith(
//       expect.arrayContaining(["Please select a date. "])
//     );
//   });

//   it('successfully submits a meal', async () => {
//     mockAddMeal.mockResolvedValueOnce({ status: 200 });
//     mockGetMealTypes.mockResolvedValueOnce({ data: mockMealTypes });

//     const { result } = renderHook(() => useMealForm());

//     const mockEvent = {
//         preventDefault: vi.fn(),
//         target: {} as EventTarget,
//         currentTarget: {} as EventTarget,
//     } as unknown as React.FormEvent<HTMLFormElement>;

//     expect(mockSetStatus).toHaveBeenCalledWith('loading');
//     await act(async () => {
//       await result.current.handleSubmit(mockEvent);
//     });

    
//     // expect(mockAddMeal).toHaveBeenCalled();
//     // expect(mockSetStatus).toHaveBeenCalledWith('success');
//     // expect(mockResetMealContext).toHaveBeenCalled();
//   });

  it('successfully deletes a meal', async () => {
    mockDeleteMeal.mockResolvedValueOnce({ status: 200 });
    mockGetMealTypes.mockResolvedValueOnce({ data: mockMealTypes });

    const { result } = renderHook(() => useMealForm());

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(mockDeleteMeal).toHaveBeenCalledWith(1);
    expect(mockSetStatus).toHaveBeenCalledWith('success');
    expect(mockResetMealContext).toHaveBeenCalled();
  });

  it('handles errors during API calls', async () => {
    const mockError = { response: { data: { message: 'Error deleting meal' } } };
    mockDeleteMeal.mockRejectedValueOnce(mockError);
    mockGetMealTypes.mockResolvedValueOnce({ data: mockMealTypes });

    const { result } = renderHook(() => useMealForm());

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(mockSetStatus).toHaveBeenCalledWith('error');
    expect(mockSetErrorMessages).toHaveBeenCalledWith(
      expect.arrayContaining(['Error deleting meal'])
    );
  });
});
