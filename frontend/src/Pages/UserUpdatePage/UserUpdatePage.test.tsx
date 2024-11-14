import { render, screen, waitFor } from "@testing-library/react";
import UserUpdatePage from "./UserUpdatePage";
import { getUser } from "../../Api/api";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { mockUsers } from "../../__mock__/mockUsers";

// Mock the dependencies
vi.mock("../../Api/api", () => ({
    getUser: vi.fn(),
}));

vi.mock("../../Components/UserForm/UserForm", () => ({
    default: vi.fn(({ data }) => <div>{data?.nickname}</div>), 
}));

describe("UserUpdatePage", () => {
    const mockGetUser = getUser as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render loading state initially", () => {
        mockGetUser.mockResolvedValueOnce({ data: mockUsers[0] });
        render(<UserUpdatePage />);

        // Check if the loading message is shown
        expect(screen.getByText(/Getting user details.../i)).toBeInTheDocument();
    });

    it("should display user data after successful fetch", async () => {
        mockGetUser.mockResolvedValueOnce({ data: mockUsers[0] });

        render(<UserUpdatePage />);

        await waitFor(() => expect(screen.getByText(mockUsers[0].nickname!)).toBeInTheDocument());
    });

    it("should show error message if fetching user data fails", async () => {
        const errorMessage = "Error fetching user data";
        mockGetUser.mockRejectedValueOnce({
            response: { data: { message: errorMessage } },
        });

        render(<UserUpdatePage />);

        await waitFor(() => expect(screen.getByText(errorMessage)).toBeInTheDocument());
    });

    it("should render the UserForm with fetched data", async () => {
        mockGetUser.mockResolvedValueOnce({ data: mockUsers[0] });

        render(<UserUpdatePage />);

        await waitFor(() => {
            expect(screen.getByText(mockUsers[0].nickname!)).toBeInTheDocument();
        });
    });
});
