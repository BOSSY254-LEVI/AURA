import { supabase } from '../supabase';
import crypto from 'crypto';

export class CommunityService {
  static async getCommunityReports() {
    const { data, error } = await supabase
      .from('community_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createCommunityReport(reportData: any, userId?: string) {
    const reporterHash = userId
      ? crypto.createHash('sha256').update(userId + Date.now()).digest('hex').slice(0, 16)
      : null;

    const { data, error } = await supabase
      .from('community_reports')
      .insert({
        ...reportData,
        reporter_hash: reporterHash,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
