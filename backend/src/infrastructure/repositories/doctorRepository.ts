import { DoctorModel, IDoctor } from "../models/DoctorModel";
import { Doctor, DoctorProps } from "../../domain/doctor";
import { Types } from "mongoose";


export class DoctorRepository {
  async create(fullName: string, email: string, password: string): Promise<Doctor> {
    const doc = await DoctorModel.create({ fullName, email, password });
    return this.toDomain(doc);
  }

  async findByEmail(email: string): Promise<Doctor | null> {
    const doc = await DoctorModel.findOne({ email });
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<Doctor | null> {
    const doc = await DoctorModel.findById(id);
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async findAll(): Promise<Doctor[]> {
    const docs = await DoctorModel.find();
    return docs.map((d) => this.toDomain(d));
  }

  async save(doctor: Doctor): Promise<Doctor> {
    const updated = await DoctorModel.findByIdAndUpdate(
      doctor.id,
      { ...doctor },
      { new: true }
    );
    if (!updated) throw new Error("Doctor not found");
    return this.toDomain(updated);
  }

    async updateFromDomain(doctor: IDoctor): Promise<IDoctor> {
    return await doctor.save();
  }


  private toDomain(doc: IDoctor) {
  const props: DoctorProps = {
    _id: (doc._id as Types.ObjectId).toString(),
    fullName: doc.fullName,
    email: doc.email,
    password: doc.password,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return new Doctor(props);
}
}
