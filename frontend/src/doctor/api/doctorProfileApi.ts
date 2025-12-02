import axios from "axios";

const BASE_URL = "http://localhost:5000/api/doctor";

export const fetchDoctorProfileApi = async (token: string) => {
  const { data } = await axios.get(`${BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const submitDoctorProfileApi = async (formData: FormData, token: string) => {
  const { data } = await axios.post(`${BASE_URL}/profile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
