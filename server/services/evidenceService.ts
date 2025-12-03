import { supabase } from '../supabase';

export class EvidenceService {
  static async getEvidenceItems(userId: string) {
    const { data, error } = await supabase
      .from('evidence_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createEvidenceItem(userId: string, itemData: any) {
    const { data, error } = await supabase
      .from('evidence_items')
      .insert({
        ...itemData,
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteEvidenceItem(id: string) {
    const { error } = await supabase
      .from('evidence_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
