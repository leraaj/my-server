import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "./context/useAuthContext";

const useDimensions = () => {
  const { toggle, setScreenDimension } = useAuthContext();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const elementRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (elementRef.current) {
        const { offsetWidth, offsetHeight } = elementRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
        setScreenDimension(offsetWidth);
      }
    };

    updateDimensions(); // Initial dimension update
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [toggle]); // Dependency array should include dependencies that trigger dimension updates

  return [dimensions, elementRef];
};

export default useDimensions;
