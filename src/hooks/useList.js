import { useState } from "react";

const useList = ({ id }) => {
  const [list, setList] = useState([]);
  const handleList = () => {
    const addedList = document.getElementById(`${id}`).value;
    if (addedList.trim() !== "") {
      setList([...list, addedList]);
    }
  };
  const handleListRemove = (index) => {
    const updatedList = [...list];
    updatedList.splice(index, 1);
    setList(updatedList);
  };
  const resetList = () => {
    setList([]);
  };
  return { list, handleList, handleListRemove, resetList };
};

export default useList;
