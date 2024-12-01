import { render, screen, fireEvent } from "@testing-library/react";
import ModalConfirmation from "./ModalConfirmation";

describe("ModalConfirmation", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    render(
      <ModalConfirmation
        isOpen={false}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText("Confirmação")).toBeFalsy();
    expect(
      screen.queryByText("Tem certeza que deseja realizar essa ação?")
    ).toBeFalsy();
  });

  it("should render when isOpen is true", () => {
    render(
      <ModalConfirmation
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("Confirmação")).toBeTruthy();
    expect(
      screen.getByText("Tem certeza que deseja realizar essa ação?")
    ).toBeTruthy();
    expect(screen.getByText("Cancelar")).toBeTruthy();
    expect(screen.getByText("Confirmar")).toBeTruthy();
  });

  it("should call onCancel when the cancel button is clicked", () => {
    render(
      <ModalConfirmation
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("should call onConfirm when the confirm button is clicked", () => {
    render(
      <ModalConfirmation
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByText("Confirmar");
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
});
