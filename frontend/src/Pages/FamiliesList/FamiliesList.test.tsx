import { render, screen, waitFor } from '@testing-library/react';
import {  beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import FamiliesList from './FamiliesList';
import { getFamilyRoleTypes, getFamiliesWithUsersByUserId } from '../../Api/api';
import { mockRoles } from '../../__mock__/mockRoles';
import { mockFamilyUsers } from '../../__mock__/mockFamilyUser';
import { FamilyWithUsersInterface } from '../../Api/apiInterface';
import { mockFamiliesWithUsers } from '../../__mock__/mockFamiliesWithUsers';

vi.mock('../../Api/api', () => ({
    getFamilyRoleTypes: vi.fn(),
    getFamiliesWithUsersByUserId: vi.fn(),
}));

vi.mock('../../Components/FamilyCard/FamilyCard', () => ({
    default: ({ data }: { data: FamilyWithUsersInterface }) => <div>{data.familyId}</div>,
}));

describe('FamiliesList Page', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should display loading status initially', () => {
        (getFamilyRoleTypes as Mock).mockResolvedValueOnce({ data: mockRoles });
        (getFamiliesWithUsersByUserId as Mock).mockResolvedValueOnce({ data: mockFamiliesWithUsers });


        render(<FamiliesList />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display family roles and family users list on success', async () => {
        // Mock the resolved values for API calls
        (getFamilyRoleTypes as Mock).mockResolvedValueOnce({ data: mockRoles });
        (getFamiliesWithUsersByUserId as Mock).mockResolvedValueOnce({ data: mockFamiliesWithUsers });

        render(<FamiliesList />);

        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
        mockFamilyUsers.forEach(fu => {
            expect(screen.getByText(fu.familyId.toString())).toBeInTheDocument();
        });
    });

      it('should display error message on API error', async () => {

        // Mock the rejected values for API calls
        (getFamilyRoleTypes as Mock).mockRejectedValueOnce({
            response: { data: { message: 'Error fetching roles' } },
          });
        (getFamiliesWithUsersByUserId as Mock).mockRejectedValueOnce({
          response: { data: { message: 'Error getting families with users' } },
        });

        render(<FamiliesList />);

        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
        // expect(screen.getByText('Error fetching roles')).toBeInTheDocument();
      });
});
