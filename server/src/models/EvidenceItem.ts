// server/models/EvidenceItem.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IEvidenceItem extends Document {
  userId: Types.ObjectId;
  type: string;
  title: string;
  description?: string;
  encryptedContent?: string;
  metadata?: Record<string, any>;
  hash?: string;
}

const evidenceItemSchema = new Schema<IEvidenceItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    encryptedContent: { type: String },
    metadata: { type: Schema.Types.Mixed },
    hash: { type: String }
  },
  { timestamps: true }
);

export const EvidenceItem = model<IEvidenceItem>('EvidenceItem', evidenceItemSchema);
