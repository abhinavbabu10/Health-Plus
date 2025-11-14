export interface Appointment {
  id: string;
  patientName?: string;
  patient?: { name?: string };
  date: string;
  status?: string;
}

export interface Patient {
  id: string;
  name?: string;
  fullName?: string;
  email?: string;
  contact?: string;
  age?: number;
}
