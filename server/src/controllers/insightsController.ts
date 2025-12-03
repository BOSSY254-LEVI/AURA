// server/controllers/insightsController.ts
import { Request, Response } from 'express';
import { SafetyInsight } from '../models/SafetyInsight';

export const getSafetyInsights = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const insights = await SafetyInsight.find({ userId }).sort({ date: -1 });
    res.json(insights);
  } catch (error) {
    console.error('Error fetching safety insights:', error);
    res.status(500).json({ message: 'Failed to fetch safety insights' });
  }
};

export const createSafetyInsight = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const insight = new SafetyInsight({ ...req.body, userId });
    await insight.save();
    res.status(201).json(insight);
  } catch (error) {
    console.error('Error creating safety insight:', error);
    res.status(500).json({ message: 'Failed to create safety insight' });
  }
};
