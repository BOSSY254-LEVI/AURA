// server/models/LearningProgress.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface ILearningProgress extends Document {
  userId: Types.ObjectId;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  completedAt?: Date;
}

const learningProgressSchema = new Schema<ILearningProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    moduleId: { type: String, required: true },
    lessonId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    score: { type: Number },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

export const LearningProgress = model<ILearningProgress>('LearningProgress', learningProgressSchema);
