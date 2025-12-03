// server/models/EmergencyContact.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IEmergencyContact extends Document {
  userId: Types.ObjectId;
  name: string;
  phone?: string;
  email?: string;
  relationship?: string;
  isPrimary: boolean;
}

const emergencyContactSchema = new Schema<IEmergencyContact>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    relationship: { type: String },
    isPrimary: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const EmergencyContact = model<IEmergencyContact>('EmergencyContact', emergencyContactSchema);
