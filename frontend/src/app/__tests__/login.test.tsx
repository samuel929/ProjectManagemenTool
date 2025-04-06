// Mock useRouter for testing
jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

import { render, screen } from "@testing-library/react";
import LoginPage from "../login/page";
import userEvent from "@testing-library/user-event";

describe("Login Page", () => {
  it("renders login form", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("can type into inputs", async () => {
    render(<LoginPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");

    expect(screen.getByLabelText(/email/i)).toHaveValue("test@example.com");
    expect(screen.getByLabelText(/password/i)).toHaveValue("password123");
  });
});
