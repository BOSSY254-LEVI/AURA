// server/controllers/learningController.ts
import { Request, Response } from 'express';
import { LearningProgress } from '../models/LearningProgress';

export const getLearningProgress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const progress = await LearningProgress.find({ userId });
    res.json(progress);
  } catch (error) {
    console.error('Error fetching learning progress:', error);
    res.status(500).json({ message: 'Failed to fetch learning progress' });
  }
};

export const upsertLearningProgress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { moduleId, lessonId, completed, score } = req.body;
    
    const existing = await LearningProgress.findOne({ userId, moduleId, lessonId });
    let progress;
    
    if (existing) {
      existing.completed = completed;
      existing.score = score;
      if (completed) {
        existing.completedAt = new Date();
      }
      await existing.save();
      progress = existing;
    } else {
      progress = new LearningProgress({ userId, moduleId, lessonId, completed, score });
      if (completed) {
        progress.completedAt = new Date();
      }
      await progress.save();
    }
    
    res.json(progress);
  } catch (error) {
    console.error('Error upserting learning progress:', error);
    res.status(500).json({ message: 'Failed to update learning progress' });
  }
};
