import React, { useEffect, useState } from "react";
import Modal from "../../../../components/modal/Modal";
import { toast } from "sonner";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useFetch from "../../../../hooks/useFetch";
import { getValue } from "@testing-library/user-event/dist/utils";
import CustomButton from "../../../../components/button/CustomButton";

const JobAppointmentModal = ({ show, onHide, refresh, selectedJob }) => {
  const {
    data: applications,
    loading: applicationLoading,
    refresh: jobRefresh,
  } = useFetch(`${process.env.REACT_APP_API_URL}/api/appointments`);
  const [selectedApplicant, setSelectedApplicant] = useState({});
  const [applicantsAppointment, setApplicantsAppointment] = useState({});
  // Modal Varaiables
  const [appointmentModal, setAppointmentModal] = useState(null);
  const showAppointmentModal = () => {
    setAppointmentModal(true);
  };
  const hideAppointmentModal = () => {
    setAppointmentModal(false);
  };

  // Create Appointment Variables
  const [meetingLink, setMeetingLink] = useState({});
  const [meetingTime, setMeetingTime] = useState({});
  // Handle Application Status
  const handleUserAppointment = async (updatedData) => {
    try {
      console.log("Data: " + JSON.stringify(updatedData));
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/${applicantsAppointment?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedData),
        }
      );
      const fnResponse = await response.json();
      if (response.ok) {
        toast.success(
          "Success: The request for application was successfully handled."
        );
        hideAppointmentModal();
        jobRefresh();
        console.log("Response: " + JSON.stringify(fnResponse));
      } else {
        toast.success("Error: The request for application was un-successful.");
      }
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        title="Job Appointments"
        size="fullscreen"
        isStatic>
        <div class="vstack gap-3">
          {applicationLoading
            ? "loading..."
            : applications?.map((app) => {
                return (
                  <div>
                    <CustomButton
                      size="sm"
                      color="dark"
                      label="View Application"
                      onClick={() => {
                        showAppointmentModal();
                        setSelectedApplicant(app?.user);
                        setApplicantsAppointment(app);
                      }}
                    />
                    {`   ${app?.job.title} - ${app?.user?.fullName}`}
                  </div>
                );
              })}
        </div>
      </Modal>
      <Modal
        show={appointmentModal}
        onHide={hideAppointmentModal}
        title={`${selectedApplicant.fullName} - Appointment Form`}
        size="sm">
        <div className="row mx-0 g-3">
          <div className="col-12 input-container">
            {selectedApplicant.fullName}
            {applicantsAppointment?.meetingLink}
            <p>
              You have been accepted{" "}
              <strong>{applicantsAppointment?.job.title} </strong>
              <br />
              The meeting link:{applicantsAppointment?.meetingLink}
              <br />
              The meeting time:{applicantsAppointment?.meetingTime}
            </p>
            {console.log(JSON.stringify(applicantsAppointment))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default JobAppointmentModal;
