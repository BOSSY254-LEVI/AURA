import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export interface ThreatAnalysis {
  isThreat: boolean;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  analysis: string;
  recommendations: string[];
}

export async function analyzeMessageForThreats(message: string): Promise<ThreatAnalysis> {
  if (!openai) {
    return {
      isThreat: false,
      type: "none",
      severity: "low",
      analysis: "AI analysis is not available. Please configure the OPENAI_API_KEY.",
      recommendations: ["Configure the OpenAI API key to enable threat detection"],
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a digital safety expert specializing in detecting online harassment, threats, and manipulation targeting women and girls. Analyze the given message and identify any concerning patterns.

Categories of threats to look for:
- harassment: Repeated unwanted contact, insults, or degrading language
- hate_speech: Discriminatory language based on gender, ethnicity, or other protected characteristics
- threat: Direct or implied threats of harm, violence, or exposure
- manipulation: Attempts to control, gaslight, or emotionally manipulate
- grooming: Patterns of building trust for exploitation, inappropriate requests
- doxxing: Attempts to gather or share personal information

Respond with JSON in this format:
{
  "isThreat": boolean,
  "type": "harassment" | "hate_speech" | "threat" | "manipulation" | "grooming" | "doxxing" | "none",
  "severity": "low" | "medium" | "high" | "critical",
  "analysis": "Brief explanation of the threat pattern detected",
  "recommendations": ["Array of safety recommendations"]
}`
        },
        {
          role: "user",
          content: message,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      isThreat: result.isThreat || false,
      type: result.type || "none",
      severity: result.severity || "low",
      analysis: result.analysis || "",
      recommendations: result.recommendations || [],
    };
  } catch (error) {
    console.error("Error analyzing message:", error);
    return {
      isThreat: false,
      type: "none",
      severity: "low",
      analysis: "Unable to analyze message at this time.",
      recommendations: [],
    };
  }
}

export async function getChatResponse(messages: { role: "user" | "assistant"; content: string }[]): Promise<string> {
  if (!openai) {
    return "I'm Safe Twin, your AI companion. To enable full AI support, please configure the OPENAI_API_KEY. In the meantime, if you're in immediate danger, please contact local emergency services or a trusted person.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are Safe Twin, a trauma-informed AI companion designed to support African women and girls experiencing digital violence. Your role is to:

1. Provide empathetic, non-judgmental support
2. Offer practical safety advice and guidance
3. Help users understand concerning online behaviors
4. Guide users on how to document and report abuse
5. Provide emotional support in a calm, reassuring manner
6. Never blame victims or minimize their experiences
7. Recognize signs of crisis and provide appropriate resources
8. Respect cultural contexts and sensitivities

Communication style:
- Use warm, supportive language
- Validate feelings and experiences
- Be direct but gentle when addressing safety concerns
- Offer actionable steps when appropriate
- Know when to recommend professional help or emergency services

You are NOT a replacement for professional mental health support, law enforcement, or emergency services. When situations are serious, always recommend appropriate resources.

If a user is in immediate danger, prioritize their safety and guide them to emergency services.`
        },
        ...messages.map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_completion_tokens: 1024,
    });

    return response.choices[0].message.content || "I'm here to help. Could you tell me more about what you're experiencing?";
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "I apologize, but I'm having trouble responding right now. If this is an emergency, please contact local emergency services or a trusted person immediately.";
  }
}
