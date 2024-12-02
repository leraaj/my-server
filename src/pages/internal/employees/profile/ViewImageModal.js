import React from "react";
import Modal from "../../../../components/modal/Modal";
import placeholder from "../../../../assets/images/placeholder/img_blank.png";
const Index = ({ show, onHide }) => {
  const isStatic = false;
  return (
    <Modal
      show={show}
      onHide={onHide}
      title={`View Image [Show: ${show}, isStatic: ${isStatic}]`}
      size={"fullscreen"}
      isStatic={isStatic}
      closeMessage={"Close"}>
      <div className="d-flex justify-content-center" style={{ height: "100%" }}>
        <img src={placeholder} style={{ objectFit: "cover", height: "100%" }} />
      </div>
    </Modal>
  );
};

export default Index;
