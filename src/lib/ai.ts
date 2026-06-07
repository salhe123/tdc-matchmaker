import OpenAI from "openai";

export function generateFallbackIntro(customerName: string, matchName: string, reasons: string[]): string {
  const topReason = reasons[0] ?? "shared values and compatibility";
  const secondReason = reasons[1] ?? "mutual lifestyle alignment";
  return `Hi ${customerName}, we think ${matchName} could be a wonderful match for you — especially because of ${topReason.toLowerCase()}. Beyond that, ${secondReason.toLowerCase()}, making this one worth exploring. We'd love to connect you both for an introductory call.`;
}

export async function generateMatchIntro(customerName: string, matchName: string, reasons: string[]): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key || key === "your_groq_api_key_here") {
    return generateFallbackIntro(customerName, matchName, reasons);
  }

  try {
    const client = new OpenAI({
      apiKey: key,
      baseURL: "https://api.groq.com/openai/v1",
    });
    const reasonsText = reasons.join("; ");

    const response = await client.chat.completions.create({
      model: "llama3-8b-8192",
      max_tokens: 120,
      messages: [
        {
          role: "system",
          content: "You are a warm and professional Indian matchmaker writing personalized introductory emails. Keep it to exactly 2 sentences. Be specific and warm, not generic.",
        },
        {
          role: "user",
          content: `Write a 2-sentence personalized introduction for ${customerName} suggesting ${matchName} as a potential match. Key compatibility reasons: ${reasonsText}. The tone should be warm, hopeful, and professional like a good matchmaker.`,
        },
      ],
    });

    return response.choices[0]?.message?.content?.trim() ?? generateFallbackIntro(customerName, matchName, reasons);
  } catch {
    return generateFallbackIntro(customerName, matchName, reasons);
  }
}
