import { renderHook, act } from "@testing-library/react-hooks";
import * as MockAdapter from "axios-mock-adapter";
import httpClient from "../../../services/httpClient";
import useFetchRegistrations from "./useFetchRegistrations";
import {
  Registration,
  RegistrationStatus,
  SeparatedData,
} from "../../../types/registrations";

jest.useFakeTimers();

describe("useFetchRegistrations", () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(httpClient);
  });

  afterEach(() => {
    mock.reset();
    jest.clearAllTimers();
  });

  afterAll(() => {
    mock.restore();
  });

  it("should fetch registrations successfully with query string and format them after debounce", async () => {
    const mockData: Registration[] = [
      {
        admissionDate: "23/10/2023",
        email: "maria@caju.com.br",
        employeeName: "Maria Silva",
        status: RegistrationStatus.REVIEW,
        cpf: "12345678901",
        id: 1,
      },
      {
        admissionDate: "24/10/2023",
        email: "joao@caju.com.br",
        employeeName: "João Souza",
        status: RegistrationStatus.APPROVED,
        cpf: "98765432100",
        id: 2,
      },
    ];

    mock.onGet("/registrations?cpf=12345678901").reply(200, [mockData[0]]);

    const { result } = renderHook(() => useFetchRegistrations());

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({
      APPROVED: [],
      REPROVED: [],
      REVIEW: [],
    });
    expect(result.current.error).toBeNull();

    act(() => {
      result.current.fetchRegistrations("12345678901");
      jest.advanceTimersByTime(500);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({
      APPROVED: [],
      REPROVED: [],
      REVIEW: [mockData[0]],
    });
    expect(result.current.error).toBeNull();
  });

  it("should fetch all registrations when no query string is provided", async () => {
    const mockData: Registration[] = [
      {
        admissionDate: "23/10/2023",
        email: "maria@caju.com.br",
        employeeName: "Maria Silva",
        status: RegistrationStatus.REVIEW,
        cpf: "12345678901",
        id: 1,
      },
      {
        admissionDate: "24/10/2023",
        email: "joao@caju.com.br",
        employeeName: "João Souza",
        status: RegistrationStatus.APPROVED,
        cpf: "98765432100",
        id: 2,
      },
    ];

    const expectedData: SeparatedData = {
      APPROVED: [mockData[1]],
      REPROVED: [],
      REVIEW: [mockData[0]],
    };

    mock.onGet("/registrations").reply(200, mockData);

    const { result } = renderHook(() => useFetchRegistrations());

    act(() => {
      result.current.fetchRegistrations("");
      jest.advanceTimersByTime(500);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(expectedData);
    expect(result.current.error).toBeNull();
  });

  it("should handle an error during fetch after debounce", async () => {
    mock.onGet("/registrations").reply(500);

    const { result } = renderHook(() => useFetchRegistrations());

    act(() => {
      result.current.fetchRegistrations("");
      jest.advanceTimersByTime(500);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({
      APPROVED: [],
      REPROVED: [],
      REVIEW: [],
    });
    expect(result.current.error).toBe("Failed to fetch registrations.");
  });

  it("should initialize with default states", () => {
    const { result } = renderHook(() => useFetchRegistrations());

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({
      APPROVED: [],
      REPROVED: [],
      REVIEW: [],
    });
    expect(result.current.error).toBeNull();
  });

  it("should cancel previous request on new fetch", async () => {
    const mockData: Registration[] = [
      {
        admissionDate: "23/10/2023",
        email: "maria@caju.com.br",
        employeeName: "Maria Silva",
        status: RegistrationStatus.REVIEW,
        cpf: "12345678901",
        id: 1,
      },
    ];

    const expectedData: SeparatedData = {
      APPROVED: [],
      REPROVED: [],
      REVIEW: [mockData[0]],
    };

    mock.onGet("/registrations?cpf=12345678901").reply(200, mockData);

    const { result } = renderHook(() => useFetchRegistrations());

    act(() => {
      result.current.fetchRegistrations("98765432100");
      result.current.fetchRegistrations("12345678901");
      jest.advanceTimersByTime(500);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(expectedData);
    expect(result.current.error).toBeNull();
  });
});
