import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Families from './Families';
import { vi, describe, it, expect, beforeEach, Mock, afterEach } from 'vitest';
import { addFamily, addFamilyUser } from '../../Api/api';
import AxiosMockAdapter from 'axios-mock-adapter';
import MockAdapter from 'axios-mock-adapter';
import client from '../../Api/apiClient';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Families Page', () => {
  const mockNavigate = vi.fn();
  let mockAxios: AxiosMockAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxios = new MockAdapter(client);
    (useNavigate as Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    mockAxios.restore();  // Reset any mocks or interceptors
  });

  it('renders the component correctly', () => {
    render(
      <MemoryRouter>
        <Families />
      </MemoryRouter>
    );

    expect(screen.getByText('My Families')).toBeInTheDocument();
    expect(screen.getByText('My Families')).toBeInTheDocument();
    expect(screen.getByText('Create Family')).toBeInTheDocument();
    expect(screen.getByText('Join Family')).toBeInTheDocument();
  });

  it('navigates to "My Families" page when "My Families" button is clicked', () => {
    render(
      <MemoryRouter>
        <Families />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('My Families'));
    expect(mockNavigate).toHaveBeenCalledWith('/my-families');
  });

  it('opens create family popup when "Create Family" button is clicked', () => {
    render(
      <MemoryRouter>
        <Families />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Create Family'));
    expect(screen.getByText('Create Family')).toBeInTheDocument();
  });

  it('opens join family popup when "Join Family" button is clicked', () => {
    render(
      <MemoryRouter>
        <Families />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Join Family'));
    expect(screen.getByText('Join Family')).toBeInTheDocument();
  });

  it('submits create family request and navigates on success', async () => {
    mockAxios.onPost(`/families/`).reply(200);

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
    mockAxios.onPost(`/families/`).reply(500, "Error adding family");

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
    mockAxios.onPost(`/familyusers/`).reply(200);

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
    mockAxios.onPost(`/familyusers/`).reply(500, "Error joining family");

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
