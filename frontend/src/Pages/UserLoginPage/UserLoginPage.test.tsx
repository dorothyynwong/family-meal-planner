import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserLoginPage from "./UserLoginPage";
import { userLogin } from "../../Api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Components/AuthProvider/AuthProvider";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

// Mock the dependencies
vi.mock("../../Api/api", () => ({
    userLogin: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: vi.fn(),
}));

vi.mock("../../Components/AuthProvider/AuthProvider", () => ({
    useAuth: vi.fn(),
}));

describe("UserLoginPage", () => {
    const mockUseNavigate = useNavigate as Mock;
    const mockUseAuth = useAuth as Mock;
    const mockUserLogin = userLogin as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseNavigate.mockReturnValue(vi.fn());
        mockUseAuth.mockReturnValue({ logUserIn: vi.fn() });
    });

    it("renders the login form", () => {
        render(<UserLoginPage />);
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    });

    it("displays loading message when login is in progress", async () => {
        mockUserLogin.mockResolvedValue({ status: 200, data: {} });

        render(<UserLoginPage />);
        
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
        
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => expect(screen.getByText(/Logging In .../i)).toBeInTheDocument());
    });

    it("handles successful login", async () => {
        mockUserLogin.mockResolvedValue({ status: 200, data: { user: "testuser" } });
        const mockNavigate = mockUseNavigate();
        const mockLogUserIn = mockUseAuth().logUserIn;

        render(<UserLoginPage />);

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/home"));
        expect(mockLogUserIn).toHaveBeenCalledWith({ user: "testuser" });
        expect(screen.getByText(/Logged In Successfully!/i)).toBeInTheDocument();
    });

    it("handles login error", async () => {
        mockUserLogin.mockRejectedValue({ response: { data: { message: "Invalid credentials" } } });

        render(<UserLoginPage />);

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "wrongpassword" } });
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument());
    });

    it("does not allow submission with empty fields", async () => {
        render(<UserLoginPage />);

        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => expect(userLogin).not.toHaveBeenCalled());
    });
});
