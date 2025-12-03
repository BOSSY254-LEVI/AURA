// server/controllers/companionController.ts
import { Request, Response } from 'express';
import { CompanionService } from '../services/companionService';
import { getChatResponse } from '../openai';

export const getCompanionChat = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const chat = await CompanionService.getCompanionChat(userId);
    res.json(chat);
  } catch (error) {
    console.error('Error fetching companion chat:', error);
    res.status(500).json({ message: 'Failed to fetch companion chat' });
  }
};

export const upsertCompanionChat = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    let chat = await CompanionChat.findOne({ userId });
    const messages = chat?.messages || [];
    
    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: message,
      timestamp: new Date()
    };
    messages.push(userMessage);

    // Get AI response
    const aiResponse = await getChatResponse(
      messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    );

    // Add AI response
    const assistantMessage = {
      role: 'assistant' as const,
      content: aiResponse,
      timestamp: new Date()
    };
    messages.push(assistantMessage);

    // Save or update chat
    if (chat) {
      chat.messages = messages;
      await chat.save();
    } else {
      chat = new CompanionChat({ userId, messages });
      await chat.save();
    }

    res.json({ response: aiResponse, messages });
  } catch (error) {
    console.error('Error upserting companion chat:', error);
    res.status(500).json({ message: 'Failed to process companion chat' });
  }
};
