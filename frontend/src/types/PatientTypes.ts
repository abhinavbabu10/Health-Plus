export interface Patient {
  _id: string;
  name: string;
  email: string;
  role: "patient";
  isVerified: boolean;
  createdAt: string;

  gender?: "male" | "female" | "other";
  dob?: string;                       
  isBlocked?: boolean;                  
}
