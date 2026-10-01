import { GoogleGenAI } from '@google/genai';
import { BoxScore, StudentInfo } from '../types';

export async function generateAICareerAdvice(
  student: StudentInfo,
  topClusters: BoxScore[]
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

  const clustersSummary = topClusters.map((c, i) => 
    `${i + 1}. Cluster ${c.boxNumber}: ${c.titleEn} (${c.titleUr}) - Score: ${c.count} items circled`
  ).join("\n");

  const prompt = `You are a certified career counselor and expert educational mentor specializing in Pakistani and international career pathways.
A student has completed the official 16 Career Clusters Interest Survey (Oklahoma Department of Career and Technology Education model).

Student Details:
- Name: ${student.name || 'Student'}
- School: ${student.school || 'Not specified'}
- Class/Grade: ${student.classGrade || 'Not specified'}

Their top 3 career clusters based on their survey responses:
${clustersSummary}

Provide a comprehensive, inspiring, and actionable career guidance report including:
1. Synthesis: How these top 3 clusters complement and connect with each other.
2. Recommended Career Paths: Top 4 promising professions in Pakistan and internationally.
3. Educational Roadmaps: What subjects and degree paths to choose after Matric/O-Levels or FSc/A-Levels (e.g. Pre-Engineering, Pre-Medical, ICS, I.Com, BS programs).
4. Practical Next Steps: Key hard and soft skills they should start learning now.
5. Bilingual Urdu Section: An encouraging and inspiring Urdu summary (اردو رہنمائی اور تجاویز) written in clear, elegant Urdu.

Format cleanly with markdown headings and bullet points.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an inspiring, warm, and highly practical educational and career mentor helping young students discover their strengths and future careers.',
        temperature: 0.7,
      }
    });

    return response.text || "No guidance generated.";
  } catch (err: any) {
    console.error("Gemini generation error:", err);
    throw new Error(err.message || "Unable to contact the AI Career Counselor. Please check your network connection.");
  }
}
