import { Registration, SeparatedData } from "~/types/registrations";

export const separateByStatus = (data: Registration[]): SeparatedData => {
  return data.reduce<SeparatedData>(
    (acc, item) => {
      if (item.status === "APPROVED") {
        acc.APPROVED.push(item);
      } else if (item.status === "REPROVED") {
        acc.REPROVED.push(item);
      } else if (item.status === "REVIEW") {
        acc.REVIEW.push(item);
      }
      return acc;
    },
    { APPROVED: [], REPROVED: [], REVIEW: [] }
  );
};
