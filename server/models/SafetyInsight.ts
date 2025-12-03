// server/models/SafetyInsight.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface ISafetyInsight extends Document {
  userId: Types.ObjectId;
  date: Date;
  threatCount: number;
  resolvedCount: number;
  categories?: Record<string, any>;
  safetyScore?: number;
}

const safetyInsightSchema = new Schema<ISafetyInsight>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    threatCount: { type: Number, default: 0 },
    resolvedCount: { type: Number, default: 0 },
    categories: { type: Schema.Types.Mixed },
    safetyScore: { type: Number }
  },
  { timestamps: true }
);

export const SafetyInsight = model<ISafetyInsight>('SafetyInsight', safetyInsightSchema);
