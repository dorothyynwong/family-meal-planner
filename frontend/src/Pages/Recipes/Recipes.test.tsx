import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Recipes from './Recipes';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Recipes Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
  });

  it('renders the component correctly', () => {
    render(
      <MemoryRouter>
        <Recipes />
      </MemoryRouter>
    );

    const searchButton = screen.getByLabelText(/Search Recipes/i); 
    expect(searchButton).toBeInTheDocument();

    const importRecipesButton = screen.getByLabelText(/Import Recipe from Website/i); 
    expect(importRecipesButton).toBeInTheDocument();

    const newRecipeButton = screen.getByLabelText(/New Recipe/i); 
    expect(newRecipeButton).toBeInTheDocument();

  });

  it('should navigate to recipes search page when Search Recipes button is clicked', () => {
    render(<Recipes />);

    const searchButton = screen.getByText('Search Recipes');
    fireEvent.click(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith('/recipes-search/');
  });

  it('should navigate to recipes add recipe page page when New Recipe button is clicked', () => {
    render(<Recipes />);

    const addButton = screen.getByText('New Recipe');
    fireEvent.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith('/recipe-add');
  });

  it('opens join import recipe popup when "Import Recipe from Website" button is clicked', () => {
    render(
      <MemoryRouter>
        <Recipes />
      </MemoryRouter>
    );

    const importButton = screen.getByRole('button', { name: /Import Recipe from Website/i }); 
    fireEvent.click(importButton);

    expect(screen.getByText('Please input URL of a recipe')).toBeInTheDocument();
  });

  it('should update the URL state when typing in the input field', () => {
    render(<Recipes />);

    fireEvent.click(screen.getByText('Import Recipe from Website'));

    const inputField = screen.getByPlaceholderText('Recipe Url') as HTMLInputElement;
    fireEvent.change(inputField, { target: { value: 'https://example.com/recipe' } });

    expect(inputField.value).toBe('https://example.com/recipe');
  });

  it('should navigate to recipe add page with URL state when Submit button is clicked in popup', () => {
    render(<Recipes />);

    fireEvent.click(screen.getByText('Import Recipe from Website'));

    const inputField = screen.getByPlaceholderText('Recipe Url')as HTMLInputElement;
    fireEvent.change(inputField, { target: { value: 'https://example.com/recipe' } });

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    expect(mockNavigate).toHaveBeenCalledWith('/recipe-add', { state: 'https://example.com/recipe' });
  });
});
