import axios from "axios";

export const getAdminDashboardSummary = async (token: string) => {
  const { data } = await axios.get("/api/admin/dashboard/summary", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
