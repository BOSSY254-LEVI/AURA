// server/models/CompanionChat.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface ICompanionChat extends Document {
  userId: Types.ObjectId;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[];
}

const companionChatSchema = new Schema<ICompanionChat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [{
      role: { type: String, enum: ['user', 'assistant'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

export const CompanionChat = model<ICompanionChat>('CompanionChat', companionChatSchema);
