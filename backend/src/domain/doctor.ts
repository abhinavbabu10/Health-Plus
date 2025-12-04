// src/domain/entities/Doctor.ts
export class Doctor {
  constructor(
    public id: string,
    public fullName: string,
    public email: string,
    public verificationStatus: "pending" | "verified" | "rejected",
    public rejectionReason?: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  verify() {
    this.verificationStatus = "verified";
    this.rejectionReason = undefined;
  }

  reject(reason: string) {
    if (!reason || reason.trim() === "") {
      throw new Error("Rejection reason is required");
    }
    this.verificationStatus = "rejected";
    this.rejectionReason = reason;
  }

  isPending(): boolean {
    return this.verificationStatus === "pending";
  }

  isVerified(): boolean {
    return this.verificationStatus === "verified";
  }

  isRejected(): boolean {
    return this.verificationStatus === "rejected";
  }
}