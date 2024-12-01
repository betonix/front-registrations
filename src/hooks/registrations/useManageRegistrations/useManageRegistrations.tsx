import { useState } from "react";
import {
  updateRegistrationStatus,
  deleteRegistration,
  saveRegistration,
} from "~/api/registrations/registrations";
import { Registration, RegistrationStatus } from "~/types/registrations";

const useManageRegistrations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (
    id: number,
    status: RegistrationStatus,
    registration: Registration
  ) => {
    setLoading(true);
    setError(null);

    try {
      await updateRegistrationStatus(id, status, registration);
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Error updating status.");
      return { error: "Error updating status" };
    } finally {
      setLoading(false);
    }
  };

  const removeRegistration = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await deleteRegistration(id);
    } catch (err) {
      console.error("Error deleting registration:", err);
      setError("Failed to delete registration.");
      return { error: "Failed to delete registration." };
    } finally {
      setLoading(false);
    }
  };

  const createRegistration = async (registration: Partial<Registration>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await saveRegistration({
        ...registration,
        status: RegistrationStatus.REVIEW,
      });
      return response;
    } catch (err) {
      console.error("Error saving registration:", err);
      setError("Failed to save registration.");
      return { error: "Failed to save registration." };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateStatus,
    removeRegistration,
    createRegistration,
    loading,
    error,
  };
};

export default useManageRegistrations;
