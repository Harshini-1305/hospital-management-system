import API from "./api";

export const bookAppointment = (doctorId, date) => {
  return API.post(`/appointments?doctorId=${doctorId}&date=${date}`);
};

export const getAppointments = () => {
  return API.get("/appointments");
};
