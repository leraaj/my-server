import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./context/useAuthContext";
const useLogin = () => {
  const api_url = `${process.env.REACT_APP_API_URL}/api/user/login`;
  console.log(process.env.REACT_APP_API_URL);
  // const api_url = "http://localhost:3001/api/user/login";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();
  const login = async (data, setError) => {
    try {
      setIsLoading(true);
      const response = await fetch(api_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Welcome, ${data.user?.fullName}`, { duration: 5000 });
        dispatch({ type: "LOGIN", payload: data.user });
        navigate(data.user?.position === 1 ? "/accounts" : "/profile");
        setIsLoading(false);
      } else {
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
        inputError.forEach(({ name, type, message }) =>
          setError(name, { type, message })
        );
        const errorMessage = await response.text(); // assuming error message comes as text
        setError(errorMessage); // set error state
        setIsLoading(false);
        toast.error("Invalid username or password");
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
