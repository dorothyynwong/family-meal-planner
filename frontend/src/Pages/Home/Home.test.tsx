import { render, screen, waitFor } from '@testing-library/react';
import Home from './Home';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockFamiliesWithUsers } from '../../__mock__/mockFamiliesWithUsers';
import AxiosMockAdapter from 'axios-mock-adapter';
import MockAdapter from 'axios-mock-adapter';
import client from '../../Api/apiClient';
import { mockMealDetails } from '../../__mock__/mockMealDetails';
import { MealProvider } from '../../Components/MealContext/MealContext';
import { MemoryRouter } from 'react-router-dom';

describe('Home Component', () => {
  let mockAxios: AxiosMockAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxios = new MockAdapter(client);
  });

  afterEach(() => {
    mockAxios.restore();  // Reset any mocks or interceptors
  });

  it('displays loading message initially', () => {
    render(<Home />);
    expect(screen.getByText("What's in our feast today...")).toBeInTheDocument();
  });

  it('displays family meals after successful API call', async () => {

    mockAxios.onGet(`/familyUsers/by-user/`).reply(200, mockFamiliesWithUsers);
    mockAxios.onGet(`/meals`).reply(200, mockMealDetails);

    render(
      <MealProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </MealProvider>
    );

    await waitFor(() => expect(screen.getByText("Today's Feast")).toBeInTheDocument());

    expect(screen.getByText("Lunch")).toBeInTheDocument();

    const headerText = screen.getByText(/Feast with The Smith Family/i);
    expect(headerText).toBeInTheDocument();
  });

  // it('displays an error message if API call fails', async () => {
  //   (getFamiliesWithUsersByUserId as Mock).mockRejectedValueOnce({
  //     response: { data: { message: 'Failed to load family meals' } },
  //   });

  //   render(<Home />);

  //   await waitFor(() => expect(screen.getByText('Error getting family meals')).toBeInTheDocument());

  //   expect(screen.getByText('Failed to load family meals')).toBeInTheDocument();
  // });
});
