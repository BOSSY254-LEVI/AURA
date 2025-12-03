// server/controllers/threatController.ts
import { Request, Response } from 'express';
import { ThreatService } from '../services/threatService';

export const getThreats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const threats = await ThreatService.getThreatsByUserId(userId);
    res.json(threats);
  } catch (error) {
    console.error('Error fetching threats:', error);
    res.status(500).json({ message: 'Failed to fetch threats' });
  }
};

export const createThreat = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.claims.sub;
    const threat = await ThreatService.createThreat({ ...req.body, userId });
    if (!threat) {
      return res.status(500).json({ message: 'Failed to create threat' });
    }
    res.status(201).json(threat);
  } catch (error) {
    console.error('Error creating threat:', error);
    res.status(500).json({ message: 'Failed to create threat' });
  }
};

export const updateThreat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const threat = await ThreatService.updateThreat(id, req.body);
    if (!threat) {
      return res.status(404).json({ message: 'Threat not found' });
    }
    res.json(threat);
  } catch (error) {
    console.error('Error updating threat:', error);
    res.status(500).json({ message: 'Failed to update threat' });
  }
};
