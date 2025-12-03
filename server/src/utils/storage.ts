import { User } from './models/User';
import { Threat } from './models/Threat';
import { EvidenceItem } from './models/EvidenceItem';
import { EmergencyContact } from './models/EmergencyContact';
import { CommunityReport } from './models/CommunityReport';
import { LearningProgress } from './models/LearningProgress';
import { CompanionChat } from './models/CompanionChat';
import { SafetyInsight } from './models/SafetyInsight';

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<any>;
  getUserByEmail(email: string): Promise<any>;
  createUser(user: any): Promise<any>;
  upsertUser(user: any): Promise<any>;

  // Threat operations
  getThreats(userId: string): Promise<any[]>;
  createThreat(threat: any): Promise<any>;
  updateThreat(id: string, data: Partial<any>): Promise<any | undefined>;

  // Evidence operations
  getEvidenceItems(userId: string): Promise<any[]>;
  createEvidenceItem(item: any): Promise<any>;
  deleteEvidenceItem(id: string): Promise<void>;

  // Emergency contact operations
  getEmergencyContacts(userId: string): Promise<any[]>;
  createEmergencyContact(contact: any): Promise<any>;
  deleteEmergencyContact(id: string): Promise<void>;

  // Community report operations
  getCommunityReports(): Promise<any[]>;
  createCommunityReport(report: any): Promise<any>;

  // Learning progress operations
  getLearningProgress(userId: string): Promise<any[]>;
  upsertLearningProgress(progress: any): Promise<any>;

  // Companion chat operations
  getCompanionChat(userId: string): Promise<any | undefined>;
  upsertCompanionChat(chat: any): Promise<any>;

  // Safety insights operations
  getSafetyInsights(userId: string): Promise<any[]>;
  createSafetyInsight(insight: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<any> {
    return User.findById(id);
  }

  async getUserByEmail(email: string): Promise<any> {
    return User.findOne({ email });
  }

  async createUser(user: any): Promise<any> {
    const newUser = new User(user);
    return newUser.save();
  }

  async upsertUser(userData: any): Promise<any> {
    const user = await User.findOneAndUpdate(
      { email: userData.email },
      userData,
      { upsert: true, new: true }
    );
    return user;
  }

  // Threat operations
  async getThreats(userId: string): Promise<any[]> {
    return Threat.find({ userId }).sort({ createdAt: -1 });
  }

  async createThreat(threat: any): Promise<any> {
    const newThreat = new Threat(threat);
    return newThreat.save();
  }

  async updateThreat(id: string, data: Partial<any>): Promise<any | undefined> {
    return Threat.findByIdAndUpdate(id, data, { new: true });
  }

  // Evidence operations
  async getEvidenceItems(userId: string): Promise<any[]> {
    return EvidenceItem.find({ userId }).sort({ createdAt: -1 });
  }

  async createEvidenceItem(item: any): Promise<any> {
    const newItem = new EvidenceItem(item);
    return newItem.save();
  }

  async deleteEvidenceItem(id: string): Promise<void> {
    await EvidenceItem.findByIdAndDelete(id);
  }

  // Emergency contact operations
  async getEmergencyContacts(userId: string): Promise<any[]> {
    return EmergencyContact.find({ userId }).sort({ isPrimary: -1 });
  }

  async createEmergencyContact(contact: any): Promise<any> {
    const newContact = new EmergencyContact(contact);
    return newContact.save();
  }

  async deleteEmergencyContact(id: string): Promise<void> {
    await EmergencyContact.findByIdAndDelete(id);
  }

  // Community report operations
  async getCommunityReports(): Promise<any[]> {
    return CommunityReport.find().sort({ createdAt: -1 });
  }

  async createCommunityReport(report: any): Promise<any> {
    const newReport = new CommunityReport(report);
    return newReport.save();
  }

  // Learning progress operations
  async getLearningProgress(userId: string): Promise<any[]> {
    return LearningProgress.find({ userId });
  }

  async upsertLearningProgress(progress: any): Promise<any> {
    const existing = await LearningProgress.findOne({
      userId: progress.userId,
      moduleId: progress.moduleId,
      lessonId: progress.lessonId
    });

    if (existing) {
      Object.assign(existing, progress);
      if (progress.completed) {
        existing.completedAt = new Date();
      }
      return existing.save();
    }

    const newProgress = new LearningProgress(progress);
    if (progress.completed) {
      newProgress.completedAt = new Date();
    }
    return newProgress.save();
  }

  // Companion chat operations
  async getCompanionChat(userId: string): Promise<any | undefined> {
    return CompanionChat.findOne({ userId }).sort({ updatedAt: -1 });
  }

  async upsertCompanionChat(chat: any): Promise<any> {
    const existing = await this.getCompanionChat(chat.userId);

    if (existing) {
      Object.assign(existing, chat);
      return existing.save();
    }

    const newChat = new CompanionChat(chat);
    return newChat.save();
  }

  // Safety insights operations
  async getSafetyInsights(userId: string): Promise<any[]> {
    return SafetyInsight.find({ userId }).sort({ date: -1 });
  }

  async createSafetyInsight(insight: any): Promise<any> {
    const newInsight = new SafetyInsight(insight);
    return newInsight.save();
  }
}

export const storage = new DatabaseStorage();
