import API from "./api";

export const getDoctors = () => {
  return API.get("/doctors");
};

export const addDoctor = (data) => {
  return API.post("/doctors", data);
};
