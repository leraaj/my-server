import {
  createContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
} from "react";
import useToggle from "../hooks/useToggle";

export const AuthContext = createContext();
const URL = `${process.env.REACT_APP_API_URL}/api/user/current-user`;

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      localStorage.clear();
      return { user: undefined };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const { toggle, toggler } = useToggle();
  const [state, dispatch] = useReducer(authReducer, { user: undefined });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [screenDimension, setScreenDimension] = useState(0);
  // Responsive View
  const screenCondition = screenDimension < 600;
  const [smallScreen, setSmallScreen] = useState(screenCondition);
  useEffect(() => {
    setSmallScreen(screenCondition);
  }, [screenDimension]);
  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        sameSite: "None",
      });
      const data = await response.json();
      if (response.ok) {
        dispatch({ type: "LOGIN", payload: data.user });
      } else {
        setError(data.message);
        dispatch({ type: "LOGOUT" });
      }
    } catch (error) {
      setError(error.message);
      console.error("Error refreshing user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
        toggle,
        toggler,
        isLoading,
        error,
        screenDimension,
        setScreenDimension,
        smallScreen,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
