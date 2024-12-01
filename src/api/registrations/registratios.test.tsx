import * as MockAdapter from "axios-mock-adapter";
import httpClient from "~/services/httpClient";
import {
  fetchRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
} from "~/api/registrations/registrations";
import { Registration, RegistrationStatus } from "~/types/registrations";

describe("API Registrations", () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(httpClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  const mockData: Registration[] = [
    {
      admissionDate: "23/10/2023",
      email: "maria@caju.com.br",
      employeeName: "Maria Silva",
      status: RegistrationStatus.REVIEW,
      cpf: "12345678901",
      id: 98,
    },
  ];

  it("should fetch registrations with no query string", async () => {
    mock.onGet("/registrations").reply(200, mockData);

    const response = await fetchRegistrations("");

    expect(response.data).toEqual(mockData);
    expect(mock.history.get[0].url).toBe("/registrations");
  });

  it("should fetch registrations with CPF query string", async () => {
    mock.onGet("/registrations?cpf=12345678901").reply(200, mockData);

    const response = await fetchRegistrations("12345678901");

    expect(response.data).toEqual(mockData);
    expect(mock.history.get[0].url).toBe("/registrations?cpf=12345678901");
  });

  it("should handle error in fetchRegistrations", async () => {
    mock.onGet("/registrations").reply(500);

    await expect(fetchRegistrations("")).rejects.toThrowError();
  });

  it("should update registration status", async () => {
    const id = 1;
    const status = "APPROVED";

    mock.onPut(`/registrations/${id}`, { ...mockData[0], status }).reply(200);

    const response = await updateRegistrationStatus(id, status, mockData[0]);

    expect(response.status).toBe(200);
    expect(mock.history.put[0].url).toBe(`/registrations/${id}`);
    expect(JSON.parse(mock.history.put[0].data)).toEqual({
      ...mockData[0],
      status,
    });
  });

  it("should handle error in updateRegistrationStatus", async () => {
    const id = 1;
    const status = "REPROVED";

    mock.onPut(`/registrations/${id}`, { status }).reply(500);

    await expect(
      updateRegistrationStatus(id, status, mockData[0])
    ).rejects.toThrowError();
  });

  it("should delete a registration", async () => {
    const id = 1;

    mock.onDelete(`/registrations/${id}`).reply(200);

    const response = await deleteRegistration(id);

    expect(response.status).toBe(200);
    expect(mock.history.delete[0].url).toBe(`/registrations/${id}`);
  });

  it("should handle error in deleteRegistration", async () => {
    const id = 1;

    mock.onDelete(`/registrations/${id}`).reply(500);

    await expect(deleteRegistration(id)).rejects.toThrowError();
  });
});
