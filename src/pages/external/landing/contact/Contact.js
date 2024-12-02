import React from "react";

const Contact = () => {
  return (
    <div id="contact" className="landing-section pb-5">
      <div className="col pt-5">
        <span className="bar-title" style={{ paddingBottom: "3rem" }}>
          contact us
          <br />
          get in touch
        </span>
      </div>
      <div className="row mx-0 g-3">
        <div className="col row m-0 p-0 g-3">
          <div className="col-12  input-container">
            <label class="form-label">Name</label>
            <input type="text" className="form-control form-control-light" />
          </div>
          <div className="col-12  input-container">
            <label class="form-label">Email</label>
            <input type="text" className="form-control form-control-light" />
          </div>
        </div>
        <div className="col-12 col-lg input-container">
          <label class="form-label">Message</label>
          <textarea className="form-control form-control-light" rows={5} />
        </div>
        <div className="col-12">
          <button className="secondary-btn">send message</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
