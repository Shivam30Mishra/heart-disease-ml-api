import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders product hero content", () => {
  render(<App />);
  expect(
    screen.getByText(/HeartWise turns a model demo into a daily-use heart health product/i)
  ).toBeInTheDocument();
});
