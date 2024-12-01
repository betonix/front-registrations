export type Registration = {
  admissionDate: string;
  email: string;
  employeeName: string;
  status: RegistrationStatus;
  cpf: string;
  id: number;
};

export type SeparatedData = {
  APPROVED: Registration[];
  REPROVED: Registration[];
  REVIEW: Registration[];
};

export enum RegistrationStatus {
  REVIEW = "REVIEW",
  APPROVED = "APPROVED",
  REPROVED = "REPROVED",
}
