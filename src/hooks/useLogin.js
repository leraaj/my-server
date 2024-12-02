import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./context/useAuthContext";

const useLogin = () => {
  const { API_URL } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (data, setError) => {
    try {
      setIsLoading(true);
      console.log(`${API_URL}/api/user/login`);
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Welcome, ${data.user?.fullName || "User"}`, {
          duration: 5000,
        });
        dispatch({ type: "LOGIN", payload: data.user });
        navigate(data.user?.position === 1 ? "/accounts" : "/profile");
      } else {
        const data = await response.json();
        const inputError = [
          { type: "invalid-input", name: "username", message: " " },
          { type: "invalid-input", name: "password", message: " " },
        ];

        if (response.status === 401 || response.status === 403) {
          inputError.forEach(({ name, type, message }) =>
            setError(name, { type, message })
          );
        } else {
          toast.error(data.message || "An error occurred.");
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Login failed:", error);
      setError("An error occurred while logging in.");
      toast.error("An error occurred while logging in.");
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};

export default useLogin;
