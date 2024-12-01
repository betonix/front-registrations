import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Router as ReactRouter, MemoryRouter } from "react-router-dom";
import App from "./App";
import * as api from "~/api/registrations/registrations";
import { createMemoryHistory } from "history";

jest.mock("~/api/registrations/registrations", () => ({
  fetchRegistrations: jest.fn(),
  updateRegistrationStatus: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container"></div>,
}));

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

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRegistrations = {
    data: [
      {
        id: 1,
        employeeName: "John Doe",
        status: "REVIEW",
        cpf: "12345678900",
      },
      {
        id: 2,
        employeeName: "Jane Doe",
        status: "APPROVED",
        cpf: "98765432100",
      },
    ],
  };
  it("should render the list of registrations", async () => {
    (api.fetchRegistrations as jest.Mock).mockResolvedValue(mockRegistrations);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeTruthy();
      expect(screen.getByText("Jane Doe")).toBeTruthy();
    });
  });

  it("should approve a registration", async () => {
    (api.fetchRegistrations as jest.Mock).mockResolvedValue(mockRegistrations);
    (api.updateRegistrationStatus as jest.Mock).mockResolvedValue({});

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeTruthy();
    });

    const approveButton = screen.getByRole("button", { name: "Aprovar" });
    fireEvent.click(approveButton);

    expect(
      screen.getByText("Tem certeza que deseja realizar essa ação?")
    ).toBeTruthy();

    const confirmButton = screen.getByTestId("modal-confirm-button");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(api.updateRegistrationStatus).toHaveBeenCalledWith(
        1,
        "APPROVED",
        expect.anything()
      );
    });
  });

  it("should navigate to NewUser page", async () => {
    const history = createMemoryHistory();

    render(
      <ReactRouter history={history}>
        <App />
      </ReactRouter>
    );

    const newUserButton = screen.getByRole("button", { name: "Nova Admissão" });
    fireEvent.click(newUserButton);

    await waitFor(() => {
      expect(screen.getByTestId("newUser-page")).toBeTruthy();
    });
  });
});
