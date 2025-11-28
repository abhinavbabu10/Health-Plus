import axios, { AxiosResponse } from "axios";
import { Patient } from "../../../types/PatientTypes";
import { PatientFilters } from "../../../types/PatientFilterTypes";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


export const getAllPatients = async (
  token: string,
  filters: PatientFilters = {}
): Promise<Patient[]> => {
  try {
 
const params = new URLSearchParams(
  Object.entries(filters)
    .filter(([value]) => value !== undefined && value !== "")
    .map(([key, value]) => [key, String(value)])
).toString();

    const res: AxiosResponse<{ patients: Patient[] }> = await axios.get(
      `${API_URL}/admin/patients?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data.patients;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch patients");
    }
    throw new Error("Failed to fetch patients");
  }
};
