import { useState } from "react";

const useToggle = (initialState = false) => {
  const [toggle, setToggle] = useState(initialState);
  const toggler = () => {
    setToggle(!toggle);
  };
  return { toggle, toggler, setToggle };
};

export default useToggle;
