import { renderHook, act } from "@testing-library/react-hooks";
import * as MockAdapter from "axios-mock-adapter";
import httpClient from "~/services/httpClient";
import useManageRegistrations from "~/hooks/registrations/useManageRegistrations/useManageRegistrations";
import { Registration, RegistrationStatus } from "~/types/registrations";
import {
  updateRegistrationStatus,
  deleteRegistration,
} from "~/api/registrations/registrations";

jest.mock("~/api/registrations/registrations", () => ({
  updateRegistrationStatus: jest.fn(),
  deleteRegistration: jest.fn(),
}));

const mockRegistration: Registration = {
  id: 1,
  admissionDate: "2023-10-23",
  email: "maria@caju.com.br",
  employeeName: "Maria Silva",
  status: RegistrationStatus.REVIEW,
  cpf: "12345678901",
};

describe("useManageRegistrations", () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(httpClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it("should update registration status successfully", async () => {
    (updateRegistrationStatus as jest.Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => useManageRegistrations());

    expect(result.current.loading).toBe(false);

    await act(async () => {
      await result.current.updateStatus(
        1,
        RegistrationStatus.APPROVED,
        mockRegistration
      );
    });

    expect(updateRegistrationStatus).toHaveBeenCalledWith(
      1,
      "APPROVED",
      mockRegistration
    );
    expect(result.current.loading).toBe(false);
  });

  it("should handle error when updating registration status", async () => {
    (updateRegistrationStatus as jest.Mock).mockRejectedValueOnce(
      new Error("Error")
    );

    const { result } = renderHook(() => useManageRegistrations());

    await act(async () => {
      await result.current.updateStatus(
        1,
        RegistrationStatus.REPROVED,
        mockRegistration
      );
    });

    expect(updateRegistrationStatus).toHaveBeenCalledWith(
      1,
      "REPROVED",
      mockRegistration
    );

    expect(result.current.loading).toBe(false);
  });

  it("should delete a registration successfully", async () => {
    (deleteRegistration as jest.Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => useManageRegistrations());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    await act(async () => {
      await result.current.removeRegistration(1);
    });

    expect(deleteRegistration).toHaveBeenCalledWith(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle error when deleting a registration", async () => {
    (deleteRegistration as jest.Mock).mockRejectedValueOnce(new Error("Error"));

    const { result } = renderHook(() => useManageRegistrations());

    await act(async () => {
      const response = await result.current.removeRegistration(1);
      expect(response?.error).toBe("Failed to delete registration.");
    });

    expect(deleteRegistration).toHaveBeenCalledWith(1);
    expect(result.current.loading).toBe(false);
  });
});
