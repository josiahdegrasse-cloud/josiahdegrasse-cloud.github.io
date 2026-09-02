import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { About } from "../About";
import { Contact } from "../Contact";
import { Hero } from "../Hero";
import { Leadership } from "../Leadership";
import { Skills } from "../Skills";
import { Work } from "../Work";

describe("portfolio sections", () => {
  it("renders the hero", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { name: /Josiah deGrasse/i })).toBeInTheDocument();
    expect(screen.getByText(/complicated work into clear, useful products/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Selected work/i })).toBeInTheDocument();
    expect(screen.getByText(/Current flagship/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GitHub repository/i })).toHaveAttribute(
      "href",
      "https://github.com/josiahdegrasse-cloud/Sensory-Platform",
    );
  });

  it("renders About", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(screen.getByText(/After tearing my ACL twice/i)).toBeInTheDocument();
  });

  it("renders Work", () => {
    render(<Work />);
    expect(screen.getByRole("heading", { name: "Selected Work" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /How the platform moves a study forward/i })).toBeInTheDocument();
    expect(screen.getByText("New Food Innovation | Sensory Platform")).toBeInTheDocument();
    expect(screen.getByText("8 USER INTERVIEWS")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View Sensory Platform repository on GitHub/i })).toHaveAttribute(
      "href",
      "https://github.com/josiahdegrasse-cloud/Sensory-Platform",
    );
    expect(screen.getByText(/Personal friction became a concrete matching product/i)).toBeInTheDocument();
  });

  it("renders Skills", () => {
    render(<Skills />);
    expect(screen.getByRole("heading", { name: "Capabilities" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Useful across the messy middle/i })).toBeInTheDocument();
    expect(screen.getByText("Row Level Security")).toBeInTheDocument();
  });

  it("renders Leadership", () => {
    render(<Leadership />);
    expect(screen.getByRole("heading", { name: "How I Work" })).toBeInTheDocument();
    expect(screen.getByText(/NCAA Division III National Champion/i)).toBeInTheDocument();
  });

  it("renders Contact", () => {
    render(<Contact />);
    expect(screen.getByRole("heading", { name: "Let's work together" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send message/i })).toBeInTheDocument();
  });
});
