// __tests__/Home.test.js
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../components/Home";

describe("Home Component", () => {
  test("renders the welcome message", () => {
    render(<Home />);
    const headingElement = screen.getByText(
      /Welcome to the Project Management App!/i
    );
    expect(headingElement).toBeInTheDocument();
  });

  test("renders the instruction text", () => {
    render(<Home />);
    const instructionElement = screen.getByText(
      /Start by managing your projects and tasks./i
    );
    expect(instructionElement).toBeInTheDocument();
  });
});
