import API from "./axios";

export const registerUser = async (data) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await API.post("/auth/login", data);
  localStorage.setItem("token", response.data.token);
  return response.data;
};