import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getAdminDashboardSummary = async (token: string) => {
  const { data } = await axios.get(`${API_URL}/admin/dashboard/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
