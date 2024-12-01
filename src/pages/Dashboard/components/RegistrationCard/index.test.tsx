import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistrationCard from "./index";
import { Registration, RegistrationStatus } from "~/types/registrations";
import useManageRegistrations from "~/hooks/registrations/useManageRegistrations/useManageRegistrations";

jest.mock(
  "~/hooks/registrations/useManageRegistrations/useManageRegistrations"
);

describe("RegistrationCard with Modal Confirmation", () => {
  const mockUpdateStatus = jest.fn();
  const mockRemoveRegistration = jest.fn();
  const mockOnStatusChange = jest.fn();

  const mockUseManageRegistrations = useManageRegistrations as jest.Mock;

  beforeEach(() => {
    mockUseManageRegistrations.mockReturnValue({
      updateStatus: mockUpdateStatus,
      removeRegistration: mockRemoveRegistration,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockRegistration: Registration = {
    id: 1,
    admissionDate: "2023-10-23",
    email: "maria@caju.com.br",
    employeeName: "Maria Silva",
    status: RegistrationStatus.REVIEW,
    cpf: "12345678901",
  };

  it("should render registration details correctly", () => {
    render(
      <RegistrationCard
        data={mockRegistration}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText("Maria Silva")).toBeTruthy();
    expect(screen.getByText("maria@caju.com.br")).toBeTruthy();
    expect(screen.getByText("2023-10-23")).toBeTruthy();
  });

  it("should open modal and confirm REPROVED action", async () => {
    render(
      <RegistrationCard
        data={mockRegistration}
        onStatusChange={mockOnStatusChange}
      />
    );

    const reproveButton = screen.getByText("Reprovar");
    fireEvent.click(reproveButton);

    expect(
      screen.getByText("Tem certeza que deseja realizar essa ação?")
    ).toBeTruthy();

    const confirmButton = screen.getByTestId("modal-confirm-button");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalledWith(
        1,
        RegistrationStatus.REPROVED,
        mockRegistration
      );
    });

    expect(mockOnStatusChange).toHaveBeenCalled();
  });

  it("should open modal and confirm APPROVED action", async () => {
    render(
      <RegistrationCard
        data={mockRegistration}
        onStatusChange={mockOnStatusChange}
      />
    );

    const approveButton = screen.getByText("Aprovar");
    fireEvent.click(approveButton);

    expect(
      screen.getByText("Tem certeza que deseja realizar essa ação?")
    ).toBeTruthy();

    const confirmButton = screen.getByTestId("modal-confirm-button");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalledWith(
        1,
        RegistrationStatus.APPROVED,
        mockRegistration
      );
    });

    expect(mockOnStatusChange).toHaveBeenCalled();
  });

  it("should open modal and confirm REVIEW action", async () => {
    const mockRegistrationApproved: Registration = {
      ...mockRegistration,
      status: RegistrationStatus.APPROVED,
    };

    render(
      <RegistrationCard
        data={mockRegistrationApproved}
        onStatusChange={mockOnStatusChange}
      />
    );

    const reviewButton = screen.getByText("Revisar novamente");
    fireEvent.click(reviewButton);

    expect(
      screen.getByText("Tem certeza que deseja realizar essa ação?")
    ).toBeTruthy();

    const confirmButton = screen.getByTestId("modal-confirm-button");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalledWith(
        1,
        RegistrationStatus.REVIEW,
        mockRegistrationApproved
      );
    });

    expect(mockOnStatusChange).toHaveBeenCalled();
  });

  it("should open modal and confirm delete action", async () => {
    render(
      <RegistrationCard
        data={mockRegistration}
        onStatusChange={mockOnStatusChange}
      />
    );

    const trashIcon = screen.getByTestId("trash-icon");
    fireEvent.click(trashIcon);

    expect(
      screen.getByText("Tem certeza que deseja realizar essa ação?")
    ).toBeTruthy();

    const confirmButton = screen.getByTestId("modal-confirm-button");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockRemoveRegistration).toHaveBeenCalledWith(1);
    });

    expect(mockOnStatusChange).toHaveBeenCalled();
  });

  it("should cancel action when Cancelar is clicked in the modal", () => {
    render(
      <RegistrationCard
        data={mockRegistration}
        onStatusChange={mockOnStatusChange}
      />
    );

    const reproveButton = screen.getByText("Reprovar");
    fireEvent.click(reproveButton);

    expect(
      screen.getByText("Tem certeza que deseja realizar essa ação?")
    ).toBeTruthy();

    const cancelButton = screen.getByTestId("modal-cancel-button");
    fireEvent.click(cancelButton);

    expect(mockUpdateStatus).not.toHaveBeenCalled();
    expect(mockOnStatusChange).not.toHaveBeenCalled();
  });
});
