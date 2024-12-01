import { useState, useRef, useCallback } from "react";
import { fetchRegistrations as fetchRegistrationsApi } from "~/api/registrations/registrations";
import { Registration } from "../../../types/registrations";
import { separateByStatus } from "~/utils/formatter/formatter";
import { AxiosResponse } from "axios";

const useFetchRegistrations = () => {
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchRegistrations = useCallback((cpf: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      fetchRegistrationsApi(cpf, controller.signal)
        .then((response: AxiosResponse) => {
          setData(response.data);
        })
        .catch((err: Error) => {
          if (err.name === "AbortError") {
            console.log("Request aborted");
          } else {
            setError("Failed to fetch registrations.");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);
  }, []);

  return { data: separateByStatus(data), loading, error, fetchRegistrations };
};

export default useFetchRegistrations;
