import { render, screen, waitFor } from '@testing-library/react';
import Home from './Home';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { getFamiliesWithUsersByUserId } from '../../Api/api';
import { mockFamiliesWithUsers } from '../../__mock__/mockFamiliesWithUsers';

vi.mock('../../Api/api', () => ({
  getFamiliesWithUsersByUserId: vi.fn(),
}));

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks(); 
  });

  it('displays loading message initially', () => {
    render(<Home />);
    expect(screen.getByText("What's in our feast today...")).toBeInTheDocument();
  });

  it('displays family meals after successful API call', async () => {
    (getFamiliesWithUsersByUserId as Mock).mockResolvedValueOnce({
      data: mockFamiliesWithUsers,
    });

    render(<Home />);
    
    await waitFor(() => expect(screen.getByText("Today's Feast")).toBeInTheDocument());
    
    expect(screen.getByText('The Smith Family')).toBeInTheDocument();
  });

  it('displays an error message if API call fails', async () => {
    (getFamiliesWithUsersByUserId as Mock).mockRejectedValueOnce({
      response: { data: { message: 'Failed to load family meals' } },
    });

    render(<Home />);
    
    await waitFor(() => expect(screen.getByText('Error getting family meals')).toBeInTheDocument());

    expect(screen.getByText('Failed to load family meals')).toBeInTheDocument();
  });
});
