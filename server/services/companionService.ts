import { supabase } from '../supabase';

export class CompanionService {
  static async getCompanionChat(userId: string) {
    const { data, error } = await supabase
      .from('companion_chats')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data || { messages: [] };
  }

  static async upsertCompanionChat(userId: string, message: string, getChatResponse: Function) {
    // Get existing chat
    const existingChat = await this.getCompanionChat(userId);
    const messages = existingChat.messages || [];

    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    };
    messages.push(userMessage);

    // Get AI response
    const aiResponse = await getChatResponse(
      messages.map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    );

    // Add AI response
    const assistantMessage = {
      role: 'assistant' as const,
      content: aiResponse,
      timestamp: new Date().toISOString()
    };
    messages.push(assistantMessage);

    // Save or update chat
    const { data, error } = await supabase
      .from('companion_chats')
      .upsert({
        user_id: userId,
        messages,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return { response: aiResponse, messages };
  }
}
