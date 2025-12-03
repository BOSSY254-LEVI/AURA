// server/controllers/communityController.ts
import { Request, Response } from 'express';
import { CommunityService } from '../services/communityService';

export const getCommunityReports = async (req: Request, res: Response) => {
  try {
    const reports = await CommunityService.getCommunityReports();
    res.json(reports);
  } catch (error) {
    console.error('Error fetching community reports:', error);
    res.status(500).json({ message: 'Failed to fetch community reports' });
  }
};

export const createCommunityReport = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const report = await CommunityService.createCommunityReport(req.body, userId);
    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating community report:', error);
    res.status(500).json({ message: 'Failed to create community report' });
  }
};
