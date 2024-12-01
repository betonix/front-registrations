export const isValidCPF = (cpf: string): boolean => {
  const cleanCpf = cpf.replace(/\D/g, "");

  if (cleanCpf.length !== 11 || /^(\d)\1+$/.test(cleanCpf)) {
    return false;
  }

  const cpfArray = cleanCpf.split("").map(Number);

  const calculateDigit = (factor: number) =>
    cpfArray
      .slice(0, factor - 1)
      .reduce((sum, num, idx) => sum + num * (factor - idx), 0) % 11;

  const firstDigit = calculateDigit(10);
  if (cpfArray[9] !== (firstDigit < 2 ? 0 : 11 - firstDigit)) {
    return false;
  }

  const secondDigit = calculateDigit(11);
  if (cpfArray[10] !== (secondDigit < 2 ? 0 : 11 - secondDigit)) {
    return false;
  }

  return true;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidEmployeeName = (name: string): boolean => {
  const nameRegex = /^[^\d][a-zA-Z\s]+$/;
  return nameRegex.test(name) && name.trim().split(" ").length >= 2;
};
