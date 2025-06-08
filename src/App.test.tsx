import React from "react";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/Choose Your Skip Size/i);
  expect(linkElement).toBeInTheDocument();
});

