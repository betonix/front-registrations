import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { toast } from "react-toastify";
import NewUserPage from "./NewUser";
import useManageRegistrations from "~/hooks/registrations/useManageRegistrations/useManageRegistrations";

jest.mock(
  "~/hooks/registrations/useManageRegistrations/useManageRegistrations",
  () => ({
    __esModule: true,
    default: jest.fn(),
  })
);

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

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("NewUserPage Component", () => {
  const mockCreateRegistration = jest.fn();
  const history = createMemoryHistory();

  beforeEach(() => {
    jest.clearAllMocks();

    (useManageRegistrations as jest.Mock).mockReturnValue({
      createRegistration: mockCreateRegistration,
    });
  });

  it("should render all input fields and the submit button", () => {
    render(
      <Router history={history}>
        <NewUserPage />
      </Router>
    );

    expect(screen.getByLabelText("Nome")).toBeTruthy();
    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(screen.getByTestId("cpf-input")).toBeTruthy();
    expect(screen.getByLabelText("Data de admissão")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cadastrar" })).toBeTruthy();
  });

  it("should show validation error messages for invalid inputs", async () => {
    render(
      <Router history={history}>
        <NewUserPage />
      </Router>
    );

    const submitButton = screen.getByRole("button", { name: "Cadastrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Nome é obrigatório")).toBeTruthy();
      expect(screen.getByText("E-mail é obrigatório")).toBeTruthy();
      expect(screen.getByText("CPF é obrigatório")).toBeTruthy();
      expect(screen.getByText("Data de admissão é obrigatória")).toBeTruthy();
    });
  });

  it("should show validation error for invalid email format", async () => {
    render(
      <Router history={history}>
        <NewUserPage />
      </Router>
    );

    const submitButton = screen.getByRole("button", { name: "Cadastrar" });
    fireEvent.click(submitButton);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "invalid-email" },
    });

    await waitFor(() => {
      expect(screen.getByText("E-mail inválido")).toBeTruthy();
    });
  });

  it("should show validation error for invalid CPF", async () => {
    render(
      <Router history={history}>
        <NewUserPage />
      </Router>
    );

    fireEvent.change(screen.getByTestId("cpf-input"), {
      target: { value: "1234567890" },
    });

    const submitButton = screen.getByRole("button", { name: "Cadastrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("CPF inválido")).toBeTruthy();
    });
  });

  it("should call createRegistration with valid data and navigate to dashboard", async () => {
    mockCreateRegistration.mockResolvedValue({});

    render(
      <Router history={history}>
        <form>
          <NewUserPage />
        </form>
      </Router>
    );

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByTestId("cpf-input"), {
      target: { value: "09680316416" },
    });
    fireEvent.change(screen.getByLabelText("Data de admissão"), {
      target: { value: "2024-11-30" },
    });

    const submitButton = screen.getByRole("button", { name: "Cadastrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateRegistration).toHaveBeenCalledWith({
        employeeName: "John Doe",
        email: "john.doe@example.com",
        cpf: "09680316416",
        admissionDate: "2024-11-30",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Usuário cadastrado com sucesso!"
      );
      expect(history.location.pathname).toBe("/dashboard");
    });
  });

  it("should show an error toast if createRegistration fails", async () => {
    mockCreateRegistration.mockResolvedValue({ error: "Some error" });

    render(
      <Router history={history}>
        <NewUserPage />
      </Router>
    );

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByTestId("cpf-input"), {
      target: { value: "09680316416" },
    });
    fireEvent.change(screen.getByLabelText("Data de admissão"), {
      target: { value: "2024-11-30" },
    });

    const submitButton = screen.getByRole("button", { name: "Cadastrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Ocorreu um erro ao cadastrar o usuário."
      );
    });
  });
});
