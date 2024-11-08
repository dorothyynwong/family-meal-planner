import { FamilyWithUsersInterface } from "../Api/apiInterface";
import { mockFamilyUsers } from "./mockFamilyUser";

export const mockFamiliesWithUsers: FamilyWithUsersInterface[] = [
  {
    familyId: 100,
    userId: 1,
    familyName: 'The Smith Family',
    familyShareCode: 'ABC123',
    familyRole: 'Leader',
    familyUsers: mockFamilyUsers.filter(user => user.familyId === 100),
  },
  {
    familyId: 200,
    userId: 4,
    familyName: 'The Johnson Family',
    familyShareCode: 'XYZ789',
    familyRole: 'Member',
    familyUsers: mockFamilyUsers.filter(user => user.familyId === 200),
  },
  {
    familyId: 300,
    userId: 6,
    familyName: 'The Brown Family',
    familyShareCode: 'DEF456',
    familyRole: 'Cook',
    familyUsers: mockFamilyUsers.filter(user => user.familyId === 300),
  },
];
