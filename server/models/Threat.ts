// server/models/Threat.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IThreat extends Document {
  userId: Types.ObjectId;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  content: string;
  analysis?: string;
  source?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  notes?: string;
}

const threatSchema = new Schema<IThreat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    severity: { 
      type: String, 
      required: true,
      enum: ['low', 'medium', 'high', 'critical'] 
    },
    content: { type: String, required: true },
    analysis: { type: String },
    source: { type: String },
    status: { 
      type: String, 
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending'
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    notes: { type: String }
  },
  { timestamps: true }
);

export const Threat = model<IThreat>('Threat', threatSchema);