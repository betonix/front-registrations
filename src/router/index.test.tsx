import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Router from "./index";
import routes from "./routes";

jest.mock("react-input-mask", () => ({
  __esModule: true,
  default: ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: any;
  }) => <input {...props} />,
}));

describe("Router Component", () => {
  it("should render the DashboardPage when on the dashboard route", () => {
    render(
      <MemoryRouter initialEntries={[routes.dashboard]}>
        <Router />
      </MemoryRouter>
    );

    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("should render the NewUserPage when on the newUser route", () => {
    render(
      <MemoryRouter initialEntries={[routes.newUser]}>
        <Router />
      </MemoryRouter>
    );

    expect(screen.getByText(/nova admissão/i)).toBeTruthy();
  });

  it("should redirect to the DashboardPage when an invalid route is accessed", () => {
    render(
      <MemoryRouter initialEntries={["/invalid-route"]}>
        <Router />
      </MemoryRouter>
    );

    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });
});
