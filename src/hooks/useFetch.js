import { useState, useEffect } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const refresh = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        setLoading(false);
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          setLoading(false);
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [url]); // Depend on the URL so that if it changes, the effect is triggered again.

  return { data, loading, error, refresh };
}

export default useFetch;
