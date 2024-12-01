import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Collumns, { allColumns } from "./index";
import { RegistrationStatus, SeparatedData } from "~/types/registrations";
import useManageRegistrations from "~/hooks/registrations/useManageRegistrations/useManageRegistrations";

jest.mock(
  "~/hooks/registrations/useManageRegistrations/useManageRegistrations"
);

describe("Collumns Component", () => {
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

  const mockRegistrations: SeparatedData = {
    APPROVED: [
      {
        id: 1,
        admissionDate: "2023-10-23",
        email: "approved@example.com",
        employeeName: "Approved User",
        status: RegistrationStatus.APPROVED,
        cpf: "12345678901",
      },
    ],
    REPROVED: [
      {
        id: 2,
        admissionDate: "2023-10-24",
        email: "reproved@example.com",
        employeeName: "Reproved User",
        status: RegistrationStatus.REPROVED,
        cpf: "98765432100",
      },
    ],
    REVIEW: [
      {
        id: 3,
        admissionDate: "2023-10-25",
        email: "review@example.com",
        employeeName: "Review User",
        status: RegistrationStatus.REVIEW,
        cpf: "11122233344",
      },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render all columns with correct titles", () => {
    render(
      <Collumns
        registrations={mockRegistrations}
        onStatusChange={mockOnStatusChange}
      />
    );

    allColumns.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeTruthy();
    });
  });

  it("should render registration cards for each column", () => {
    render(
      <Collumns
        registrations={mockRegistrations}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText("Approved User")).toBeTruthy();
    expect(screen.getByText("Reproved User")).toBeTruthy();
    expect(screen.getByText("Review User")).toBeTruthy();
  });

  it("should call onStatusChange when click review button", async () => {
    render(
      <Collumns
        registrations={mockRegistrations}
        onStatusChange={mockOnStatusChange}
      />
    );

    const reviewCard = screen.getByTestId("button-review-1");
    fireEvent.click(reviewCard);
    expect(
      screen.getByText("Tem certeza que deseja realizar essa ação?")
    ).toBeTruthy();

    const confirmButton = screen.getByTestId("modal-confirm-button");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnStatusChange).toHaveBeenCalledTimes(1);
    });
  });

  it("should handle empty columns gracefully", () => {
    render(
      <Collumns
        registrations={{ APPROVED: [], REPROVED: [], REVIEW: [] }}
        onStatusChange={mockOnStatusChange}
      />
    );

    const columnContent = screen.queryByTestId("registration-card");
    expect(columnContent).toBeFalsy();
  });
});
