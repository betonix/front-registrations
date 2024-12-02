import { isValidCPF, isValidEmail, isValidEmployeeName } from "./validations";

describe("Validation Functions", () => {
  describe("isValidCPF", () => {
    it("should return false for invalid CPF with incorrect length", () => {
      expect(isValidCPF("123")).toBe(false);
    });

    it("should return false for CPF with all same digits", () => {
      expect(isValidCPF("111.111.111-11")).toBe(false);
    });

    it("should return false for an invalid CPF", () => {
      expect(isValidCPF("123.456.789-00")).toBe(false);
    });

    it("should return true for a valid CPF", () => {
      expect(isValidCPF("529.982.247-25")).toBe(true);
    });

    it("should ignore non-numeric characters", () => {
      expect(isValidCPF("529.982.247-25")).toBe(true);
    });
  });

  describe("isValidEmail", () => {
    it("should return false for an invalid email without @", () => {
      expect(isValidEmail("invalidemail.com")).toBe(false);
    });

    it("should return false for an invalid email without domain", () => {
      expect(isValidEmail("user@")).toBe(false);
    });

    it("should return false for an invalid email with special characters", () => {
      expect(isValidEmail("user.com")).toBe(false);
    });

    it("should return true for a valid email", () => {
      expect(isValidEmail("user@example.com")).toBe(true);
    });

    it("should return true for an email with subdomain", () => {
      expect(isValidEmail("user@sub.example.com")).toBe(true);
    });
  });

  describe("isValidEmployeeName", () => {
    it("should return false for a name with a number", () => {
      expect(isValidEmployeeName("John 1Doe")).toBe(false);
    });

    it("should return false for a single name", () => {
      expect(isValidEmployeeName("John")).toBe(false);
    });

    it("should return false for a name starting with a digit", () => {
      expect(isValidEmployeeName("1John Doe")).toBe(false);
    });

    it("should return true for a valid name with at least two words", () => {
      expect(isValidEmployeeName("John Doe")).toBe(true);
    });

    it("should return true for a valid name with multiple words", () => {
      expect(isValidEmployeeName("John Michael Doe")).toBe(true);
    });
  });
});
