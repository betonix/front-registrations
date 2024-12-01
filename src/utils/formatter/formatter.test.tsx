import { separateByStatus } from "./formatter";
import {
  Registration,
  RegistrationStatus,
  SeparatedData,
} from "~/types/registrations";

describe("separateByStatus", () => {
  it("should separate data correctly based on status", () => {
    const mockData: Registration[] = [
      {
        admissionDate: "23/10/2023",
        email: "maria@caju.com.br",
        employeeName: "Maria Silva",
        status: RegistrationStatus.REVIEW,
        cpf: "12345678901",
        id: 1234,
      },
      {
        admissionDate: "24/10/2023",
        email: "joao@caju.com.br",
        employeeName: "João Souza",
        status: RegistrationStatus.APPROVED,
        cpf: "98765432100",
        id: 1234,
      },
      {
        admissionDate: "25/10/2023",
        email: "ana@caju.com.br",
        employeeName: "Ana Paula",
        status: RegistrationStatus.REPROVED,
        cpf: "11122233344",
        id: 134,
      },
    ];

    const expectedOutput: SeparatedData = {
      APPROVED: [mockData[1]],
      REPROVED: [mockData[2]],
      REVIEW: [mockData[0]],
    };

    const result = separateByStatus(mockData);

    expect(result).toEqual(expectedOutput);
  });

  it("should handle empty input", () => {
    const mockData: Registration[] = [];
    const expectedOutput: SeparatedData = {
      APPROVED: [],
      REPROVED: [],
      REVIEW: [],
    };

    const result = separateByStatus(mockData);

    expect(result).toEqual(expectedOutput);
  });

  it("should handle data with only one status", () => {
    const mockData: Registration[] = [
      {
        admissionDate: "24/10/2023",
        email: "joao@caju.com.br",
        employeeName: "João Souza",
        status: RegistrationStatus.APPROVED,
        cpf: "98765432100",
        id: 778,
      },
      {
        admissionDate: "25/10/2023",
        email: "ana@caju.com.br",
        employeeName: "Ana Paula",
        status: RegistrationStatus.APPROVED,
        cpf: "11122233344",
        id: 99,
      },
    ];

    const expectedOutput: SeparatedData = {
      APPROVED: mockData,
      REPROVED: [],
      REVIEW: [],
    };

    const result = separateByStatus(mockData);

    expect(result).toEqual(expectedOutput);
  });

  it("should handle data with multiple objects in the same status", () => {
    const mockData: Registration[] = [
      {
        admissionDate: "23/10/2023",
        email: "maria@caju.com.br",
        employeeName: "Maria Silva",
        status: RegistrationStatus.REVIEW,
        cpf: "12345678901",
        id: 88,
      },
      {
        admissionDate: "24/10/2023",
        email: "joao@caju.com.br",
        employeeName: "João Souza",
        status: RegistrationStatus.REVIEW,
        cpf: "98765432100",
        id: 726,
      },
    ];

    const expectedOutput: SeparatedData = {
      APPROVED: [],
      REPROVED: [],
      REVIEW: mockData,
    };

    const result = separateByStatus(mockData);

    expect(result).toEqual(expectedOutput);
  });
});
