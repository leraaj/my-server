import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthContext } from "./context/useAuthContext";

const useFetchById = ({ path, id }) => {
  const { API_URL } = useAuthContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!id) {
      // setError(new Error("Invalid ID"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/${path}/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [path, id]);

  return { data, loading, error, refresh: fetchData };
};

export default useFetchById;
