// server/models/CommunityReport.ts
import { Schema, model, Document } from 'mongoose';

export interface ICommunityReport extends Document {
  reporterHash: string;
  platform: string;
  accountIdentifier?: string;
  incidentType: string;
  description?: string;
  evidenceLinks?: string[];
  region?: string;
  status: 'pending' | 'verified' | 'dismissed';
}

const communityReportSchema = new Schema<ICommunityReport>(
  {
    reporterHash: { type: String, required: true },
    platform: { type: String, required: true },
    accountIdentifier: { type: String },
    incidentType: { type: String, required: true },
    description: { type: String },
    evidenceLinks: [{ type: String }],
    region: { type: String },
    status: { 
      type: String, 
      enum: ['pending', 'verified', 'dismissed'], 
      default: 'pending' 
    }
  },
  { timestamps: true }
);

export const CommunityReport = model<ICommunityReport>('CommunityReport', communityReportSchema);
