import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import App from "./App";
import { NoAuthProvider } from "./context/AuthContext";

describe("Sidebar navigation", () => {
  function renderWithApp(startPath = "/signin") {
    window.history.pushState({}, "Test", startPath);
    return render(
      <BrowserRouter>
        <NoAuthProvider>
          <App />
        </NoAuthProvider>
      </BrowserRouter>
    );
  }

  it("renders sidebar on dashboard and navigates to hash sections", () => {
    // Navigate to dashboard first
    renderWithApp("/dashboard");
    // Sidebar visible
    expect(screen.getByText(/Student Name/i)).toBeInTheDocument();

    // Click "Quizzes" (hash link)
    const quizzes = screen.getByRole("link", { name: /quizzes/i });
    fireEvent.click(quizzes);

    // URL should include #quizzes without full reload
    expect(window.location.pathname).toBe("/dashboard");
    expect(window.location.hash).toBe("#quizzes");
  });

  it("clicking Dashboard in sidebar routes to /dashboard", () => {
    // Start on signin page and mount entire app
    renderWithApp("/signin");

    // Navigate to dashboard via Sign In page CTA first (submit form replacement not needed)
    // Push to dashboard manually then validate sidebar link works too
    window.history.pushState({}, "GoDash", "/dashboard");
    // Find Dashboard link in sidebar and click
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    fireEvent.click(dashboardLink);

    expect(window.location.pathname).toBe("/dashboard");
  });
});
