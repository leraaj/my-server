import React from "react";
import Modal from "../../../../components/modal/Modal";

const AddCategoryModal = ({ show, onHide }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="fullscreen"
      title="Add Category"
      isStatic></Modal>
  );
};

export default AddCategoryModal;
