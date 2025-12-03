// server/controllers/emergencyContactController.ts
import { Request, Response } from 'express';
import { EmergencyContactService } from '../services/emergencyContactService';

export const getEmergencyContacts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const contacts = await EmergencyContact.find({ userId }).sort({ isPrimary: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    res.status(500).json({ message: 'Failed to fetch emergency contacts' });
  }
};

export const createEmergencyContact = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const contact = await EmergencyContactService.createEmergencyContact(userId, req.body);
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating emergency contact:', error);
    res.status(500).json({ message: 'Failed to create emergency contact' });
  }
};

export const deleteEmergencyContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await EmergencyContactService.deleteEmergencyContact(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting emergency contact:', error);
    res.status(500).json({ message: 'Failed to delete emergency contact' });
  }
};
