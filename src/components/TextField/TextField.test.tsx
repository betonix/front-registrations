import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextField from "./TextField";

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

describe("TextField Component", () => {
  it("should render with label", () => {
    render(<TextField label="CPF" />);
    expect(screen.getByLabelText("CPF")).toBeTruthy();
  });

  it("should render with error message", () => {
    render(<TextField label="CPF" error="CPF inválido" />);
    expect(screen.getByText("CPF inválido")).toBeTruthy();
  });

  it("should call onChange when input value changes", async () => {
    const mockOnChange = jest.fn();
    render(
      <form>
        <TextField label="CPF" id="cpf" onChange={mockOnChange} />
      </form>
    );

    const input = screen.getByLabelText("CPF") as HTMLInputElement;
    await userEvent.type(input, "12345678901");

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("should update value when typing", async () => {
    const mockOnChange = jest.fn();
    render(
      <form>
        <TextField label="CPF" data-testid="input-id" onChange={mockOnChange} />
      </form>
    );

    const input = screen.getByTestId("input-id") as HTMLInputElement;
    await userEvent.type(input, "12345678901");

    expect(mockOnChange).toHaveBeenCalled();
    expect(input.value).toBe("12345678901");
  });

  it("should render without mask when mask is not provided", () => {
    render(<TextField label="Nome" value="Maria Silva" />);
    const input = screen.getByLabelText("Nome") as HTMLInputElement;

    expect(input.value).toBe("Maria Silva");
  });
});
