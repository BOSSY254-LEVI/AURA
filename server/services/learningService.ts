import { supabase } from '../supabase';

export class LearningService {
  static async getLearningProgress(userId: string) {
    const { data, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  static async upsertLearningProgress(userId: string, progressData: any) {
    const { moduleId, lessonId, completed, score } = progressData;

    const { data, error } = await supabase
      .from('learning_progress')
      .upsert({
        user_id: userId,
        module_id: moduleId,
        lesson_id: lessonId,
        completed,
        score,
        completed_at: completed ? new Date().toISOString() : null
      }, {
        onConflict: 'user_id,module_id,lesson_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
