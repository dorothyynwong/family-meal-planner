import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Renders home page correctly', async () => {
    it('Should render the page correctly', async () => {
        // Setup
        render(<Home />);
        const h1 = await screen.queryByText('Today\'s Feast');

        // Expectations
        expect(h1).not.toBeNull();
    });
});