import { supabase } from '../supabase';

export class EmergencyContactService {
  static async getEmergencyContacts(userId: string) {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createEmergencyContact(userId: string, contactData: any) {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert({
        ...contactData,
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateEmergencyContact(id: string, contactData: any) {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .update(contactData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteEmergencyContact(id: string) {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
