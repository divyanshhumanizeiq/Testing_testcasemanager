
import { GoogleGenAI, Type } from "@google/genai";
import { TestRun } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want a more robust way to handle this,
  // but for this example, we'll throw an error.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates test case steps based on a feature description.
 */
export const generateTestCaseSteps = async (featureDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the following feature description, generate a list of detailed, step-by-step test cases with expected results. Format the output as a JSON array where each object has "step", "action", and "expectedResult" keys. Feature: "${featureDescription}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              step: { type: Type.INTEGER },
              action: { type: Type.STRING },
              expectedResult: { type: Type.STRING },
            },
            required: ["step", "action", "expectedResult"],
          },
        },
      },
    });
    const jsonString = response.text.trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating test case steps:", error);
    throw new Error("Failed to generate test case steps from AI.");
  }
};


/**
 * Generates a summary for a given test run report.
 */
export const summarizeTestReport = async (report: TestRun): Promise<string> => {
  try {
    const passedTestCases = report.testCases.filter(tc => tc.status === 'Pass');
    const failedTestCases = report.testCases.filter(tc => tc.status === 'Fail');

    const passedCount = passedTestCases.length;
    const failedCount = failedTestCases.length;

    const passedTestTitles = passedTestCases
        .map(tc => `- ${tc.title}`)
        .join('\n');

    const failedTestTitles = failedTestCases
        .map(tc => `- ${tc.title}`)
        .join('\n');

    const prompt = `
      Generate a concise summary report for the following test run.
      Focus on what passed and what failed.
      The report should be suitable for a project manager.

      Project: ${report.name}
      Execution Date: ${report.date}

      --- PASSED TEST CASES (${passedCount}/${report.totalTests}) ---
      ${passedTestTitles || 'None'}

      --- FAILED TEST CASES (${failedCount}/${report.totalTests}) ---
      ${failedTestTitles || 'None'}

      --- SUMMARY ---
      Based on the results above, provide a brief summary of the test run's outcome.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;

  } catch (error) {
    console.error("Error summarizing test report:", error);
    throw new Error("Failed to generate AI summary for the report.");
  }
};
