import {
  createContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
} from "react";
import useToggle from "../hooks/useToggle";
// Get environment variables
const NODE_ENVIRONMENT = process.env.REACT_APP_NODE_ENV;
const SERVER_LINK_LOCAL = process.env.REACT_APP_LOCAL_SERVER;
const SERVER_LINK_HOSTING = process.env.REACT_APP_RENDER_SERVER;
const API_URL =
  NODE_ENVIRONMENT === "development"
    ? SERVER_LINK_LOCAL
    : NODE_ENVIRONMENT === "production"
    ? SERVER_LINK_HOSTING
    : "http://localhost:3000"; // Add a fallback URL or log an error
console.log(`NODE_ENVIRONMENT: ${NODE_ENVIRONMENT}\nAPI_URL: ${API_URL} `);
export const AuthContext = createContext();

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
  const [popup, setPopup] = useState("");
  const popupFunction = (id, msgId) => {
    const value = (id === msgId && "appear") || "vanish";
    setPopup(value);
    return value;
  };

  // Responsive View
  const screenCondition = screenDimension < 600;
  const [smallScreen, setSmallScreen] = useState(screenCondition);
  useEffect(() => {
    setSmallScreen(screenCondition);
  }, [screenDimension]);
  const refreshUser = async () => {
    if (state.user) return; // Prevent fetching if user is already set
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/user/current-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include credentials in the request
      });
      const data = await response.json();
      if (response.ok) {
        dispatch({ type: "LOGIN", payload: data?.user });
      } else {
        setError(data?.message);
        dispatch({ type: "LOGOUT" });
      }
    } catch (error) {
      setError(error.message);
      console.error("Error refreshing user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
        popupFunction,
        popup,
        API_URL,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
