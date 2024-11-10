import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Families from './Families';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { addFamily, addFamilyUser } from '../../Api/api';

vi.mock('../../Api/api', () => ({
  addFamily: vi.fn(),
  addFamilyUser: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Families Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
  });

  it('renders the component correctly', () => {
    render(
      <MemoryRouter>
        <Families />
      </MemoryRouter>
    );

    const createFamilyButton = screen.getByRole('button', { name: /Create Family/i }); 
    expect(createFamilyButton).toBeInTheDocument();

    const myFamiliesButton = screen.getByRole('button', { name: /My Families/i }); 
    expect(myFamiliesButton).toBeInTheDocument();

    const joinFamilyButton = screen.getByRole('button', { name: /Join Family/i }); 
    expect(joinFamilyButton).toBeInTheDocument();

  });

  it('navigates to "My Families" page when "My Families" button is clicked', () => {
    render(
      <MemoryRouter>
        <Families />
      </MemoryRouter>
    );

    const myFamiliesButton = screen.getByRole('button', { name: /My Families/i }); 
    fireEvent.click(myFamiliesButton);

    expect(mockNavigate).toHaveBeenCalledWith('/my-families');
  });

  it('opens create family popup when "Create Family" button is clicked', () => {
    render(
      <MemoryRouter>
        <Families />
      </MemoryRouter>
    );

    const createFamilyButton = screen.getByRole('button', { name: /Create Family/i }); 
    fireEvent.click(createFamilyButton);

    expect(screen.getByLabelText('Create Family')).toBeInTheDocument();
  });

  it('opens join family popup when "Join Family" button is clicked', () => {
    render(
      <MemoryRouter>
        <Families />
      </MemoryRouter>
    );

    const joinFamilyButton = screen.getByRole('button', { name: /Join Family/i }); 
    fireEvent.click(joinFamilyButton);

    expect(screen.getByLabelText('Join Family')).toBeInTheDocument();
  });

  it('submits create family request and navigates on success', async () => {
    (addFamily as Mock).mockResolvedValue({ status: 200 });
    render(
      <MemoryRouter>
        <Families />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Create Family'));
    fireEvent.change(screen.getByPlaceholderText('Family Name'), { target: { value: 'Test Family' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(addFamily).toHaveBeenCalledWith({ familyName: 'Test Family' }));
    expect(mockNavigate).toHaveBeenCalledWith('/my-families');
  });

  it('handles create family request failure and displays error', async () => {
    (addFamily as Mock).mockRejectedValue({
      response: { data: { message: 'Error adding family' } },
    });

    render(
      <MemoryRouter>
        <Families />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Create Family'));
    fireEvent.change(screen.getByPlaceholderText('Family Name'), { target: { value: 'Test Family' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(addFamily).toHaveBeenCalledWith({ familyName: 'Test Family' }));
    expect(screen.getByText('Error adding family')).toBeInTheDocument();
  });

  it('submits join family request and navigates on success', async () => {
    (addFamilyUser as Mock).mockResolvedValue({ status: 200 });

    render(
      <MemoryRouter>
        <Families />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Join Family'));
    fireEvent.change(screen.getByPlaceholderText('Family Share Code'), { target: { value: '12345' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(addFamilyUser).toHaveBeenCalledWith({ familyShareCode: '12345' }));
    expect(mockNavigate).toHaveBeenCalledWith('/my-families');
  });

  it('handles join family request failure and displays error', async () => {
    (addFamilyUser as Mock).mockRejectedValue({
      response: { data: { message: 'Error joining family' } },
    });

    render(
      <MemoryRouter>
        <Families />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Join Family'));
    fireEvent.change(screen.getByPlaceholderText('Family Share Code'), { target: { value: '12345' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(addFamilyUser).toHaveBeenCalledWith({ familyShareCode: '12345' }));
    expect(screen.getByText('Error joining family')).toBeInTheDocument();
  });
});
