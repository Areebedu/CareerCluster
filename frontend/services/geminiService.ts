import { GoogleGenAI } from '@google/genai';
import { BoxScore, StudentInfo } from '../types';

export async function generateAICareerAdvice(
  student: StudentInfo,
  topClusters: BoxScore[],
  language: 'en' | 'ur' | 'both' = 'both'
): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "Gemini API key is not configured in the environment. Please proceed with the standard career cluster pathways provided below.";
  }

  const ai = new GoogleGenAI({ apiKey: apiKey, vertexai: true });

  const clustersSummary = topClusters.map((c, i) => 
    `${i + 1}. Cluster ${c.boxNumber}: ${c.titleEn} (${c.titleUr}) - Score: ${c.count} items circled`
  ).join("\n");

  const prompt = `You are a certified career counselor and expert educational mentor specializing in Pakistani and international career pathways.
A student has completed the official 16 Career Clusters Interest Survey (Oklahoma Department of Career and Technology Education model).

Student Details:
- Name: ${student.name || 'Student'}
- School: ${student.school || 'Not specified'}
- Class/Grade: ${student.classGrade || 'Not specified'}

Their top 3 career clusters based on their interests and strengths:
${clustersSummary}

Provide a comprehensive, inspiring, and actionable career guidance report with:
1. Analysis of how these top 3 clusters connect with each other.
2. Top 4 recommended career paths (both in Pakistan and globally).
3. Recommended university degrees / diplomas to target after Matric/O-Levels or FSc/A-Levels.
4. Key soft and hard skills to start developing today.
5. Provide this report in bilingual format: first clean English sections, followed by an inspiring summary in authentic, warm Urdu (اردو خلاصہ اور رہنمائی).

Keep the formatting clean with markdown headings and bullet points.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an inspiring, warm, and highly practical educational and career mentor helping young students discover their passion.',
        temperature: 0.7,
      }
    });

    return response.text || "No guidance generated.";
  } catch (err: any) {
    console.error("Gemini generation error:", err);
    throw new Error(err.message || "Failed to generate AI guidance.");
  }
}
