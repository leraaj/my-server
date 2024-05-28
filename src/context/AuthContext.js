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

export const authReducer = (state, action) => {
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
  // const sidebarLS = localStorage.getItem("toggleSidebar") === false;
  const sidebarLS = localStorage.getItem("server_toggleSidebar") === false;
  console.log(`Local Storage: ${localStorage.getItem("toggleSidebar")}`);
  console.log(`Default Storage: ${false}`);
  const { toggle, toggler } = useToggle(sidebarLS);
  const [state, dispatch] = useReducer(authReducer, {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    // localStorage.setItem("toggleSidebar", toggle);
    localStorage.setItem("server_toggleSidebar", toggle);
  }, [toggle]);
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
        setIsLoading(false);
        dispatch({ type: "LOGIN", payload: data.user });
      } else {
        console.log("message: ", data.message);
        setError(data.message);
        dispatch({ type: "LOGOUT", payload: undefined });
      }
    } catch (error) {
      setError(error);
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
      value={{ ...state, dispatch, toggle, toggler, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
