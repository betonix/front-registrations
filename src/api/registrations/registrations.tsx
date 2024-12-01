import httpClient from "~/services/httpClient";
import { Registration } from "~/types/registrations";

export const fetchRegistrations = (cpf: string, signal?: AbortSignal) => {
  const query = cpf ? `?cpf=${cpf}` : "";
  return httpClient.get<Registration[]>(`/registrations${query}`, { signal });
};

export const updateRegistrationStatus = (
  id: number,
  status: string,
  registration: Partial<Registration>
) => {
  return httpClient.put(`/registrations/${id}`, { ...registration, status });
};

export const deleteRegistration = (id: number) => {
  return httpClient.delete(`/registrations/${id}`);
};

export const saveRegistration = async (registration: Partial<Registration>) => {
  const response = await httpClient.post("/registrations", registration);
  return response.data;
};
