export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface DoctorProps {
  _id?: string;
  fullName: string;
  email: string;
  password: string;
  specialization?: string;
  qualifications?: string[];
  experience?: number;
  licenseNumber?: string;
  documents?: Record<string,string>; 
  affiliation?: string;
  verificationStatus?: VerificationStatus;
  rejectionReason?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Doctor {
  private props: DoctorProps;

  constructor(props: DoctorProps) {
    this.props = {
      verificationStatus: 'pending',
      rejectionReason: null,
      ...props,
    };
  }

  get id() { return this.props._id; }
  get fullName() { return this.props.fullName; }
  get email() { return this.props.email; }
  get password() { return this.props.password; }
  get verificationStatus() { return this.props.verificationStatus; }
  get rejectionReason() { return this.props.rejectionReason; }
  get raw() { return this.props; }

  verify() {
    if (!this.props.documents || Object.keys(this.props.documents).length === 0) {
      throw new Error('Cannot verify doctor without documents');
    }
    this.props.verificationStatus = 'verified';
    this.props.rejectionReason = null;
  }

  reject(reason: string) {
    this.props.verificationStatus = 'rejected';
    this.props.rejectionReason = reason || 'Not specified';
  }

  updateDocs(docs: Record<string,string>) {
    this.props.documents = docs;
  }
}
