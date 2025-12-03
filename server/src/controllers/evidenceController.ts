// server/controllers/evidenceController.ts
import { Request, Response } from 'express';
import { EvidenceService } from '../services/evidenceService';

export const getEvidenceItems = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const items = await EvidenceService.getEvidenceItems(userId);
    res.json(items);
  } catch (error) {
    console.error('Error fetching evidence items:', error);
    res.status(500).json({ message: 'Failed to fetch evidence items' });
  }
};

export const createEvidenceItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const item = await EvidenceService.createEvidenceItem(userId, req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating evidence item:', error);
    res.status(500).json({ message: 'Failed to create evidence item' });
  }
};

export const deleteEvidenceItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await EvidenceService.deleteEvidenceItem(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting evidence item:', error);
    res.status(500).json({ message: 'Failed to delete evidence item' });
  }
};
