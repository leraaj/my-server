import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./context/useAuthContext";
const useLogin = () => {
  const LOGIN_API = `${process.env.REACT_APP_API_URL}/api/user/login`;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();
  const login = async (data, setError) => {
    try {
      setIsLoading(true);
      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
        sameSite: "None",
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Welcome, ${data.user?.fullName}`, { duration: 5000 });
        dispatch({ type: "LOGIN", payload: data.user });
        navigate(data.user?.position === 1 ? "/accounts" : "/profile");
        setIsLoading(false);
      } else {
        const data = await response.json();
        const inputError = [
          {
            type: "invalid-input",
            name: "username",
            message: " ", //Invalid username or password
          },
          {
            type: "invalid-input",
            name: "password",
            message: " ", //Invalid username or password
          },
        ];
        if (response.status === 401) {
          inputError.forEach(({ name, type, message }) =>
            setError(name, { type, message })
          );
        }
        if (response.status === 403) {
          console.log(data, response);
          inputError.forEach(({ name, type, message }) =>
            setError(name, { type, message })
          );
        } else {
        }
        setIsLoading(false);
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while logging in."); // set error state
      toast.error("An error occurred while logging in");
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};

export default useLogin;
