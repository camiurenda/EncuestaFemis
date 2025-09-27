'use server';
/**
 * @fileOverview AI-powered resource recommendation flow for survey respondents.
 *
 * - suggestResourceRecommendations - A function that generates personalized resource recommendations based on survey answers.
 * - SuggestResourceRecommendationsInput - The input type for the suggestResourceRecommendations function.
 * - SuggestResourceRecommendationsOutput - The return type for the suggestResourceRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestResourceRecommendationsInputSchema = z.object({
  digitalPresence: z
    .array(z.string())
    .describe('Answers to question 2: Current digital presence (e.g., Instagram, Facebook).'),
  challenges: z
    .array(z.string())
    .describe('Answers to question 3: Challenges faced (e.g., getting more clients, organizing time).'),
  desiredSolutions: z
    .array(z.string())
    .describe('Answers to question 4: Desired digital solutions (e.g., professional website, online store).'),
  profession: z
    .string()
    .optional()
    .describe('Answer to question 1: Profession of the respondent.'),
  investmentReadiness: z
    .string()
    .optional()
    .describe('Answer to question 5: Readiness to invest in a digital solution.'),
  investmentAmount: z
    .string()
    .optional()
    .describe('Answer to question 6: Comfortable investment amount.'),
  monthlySupportInterest: z
    .string()
    .optional()
    .describe('Answer to question 7: Interest in a monthly support plan.'),
});

export type SuggestResourceRecommendationsInput = z.infer<
  typeof SuggestResourceRecommendationsInputSchema
>;

const SuggestResourceRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('Personalized resource recommendations based on survey answers.'),
});

export type SuggestResourceRecommendationsOutput = z.infer<
  typeof SuggestResourceRecommendationsOutputSchema
>;

export async function suggestResourceRecommendations(
  input: SuggestResourceRecommendationsInput
): Promise<SuggestResourceRecommendationsOutput> {
  return suggestResourceRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestResourceRecommendationsPrompt',
  input: {schema: SuggestResourceRecommendationsInputSchema},
  output: {schema: SuggestResourceRecommendationsOutputSchema},
  prompt: `Based on the survey answers provided, suggest relevant resources and tools for the user's business.

Consider the following information:

Digital Presence: {{#each digitalPresence}}{{{this}}}, {{/each}}
Challenges: {{#each challenges}}{{{this}}}, {{/each}}
Desired Solutions: {{#each desiredSolutions}}{{{this}}}, {{/each}}

{{#if profession}}Profession: {{{profession}}}{{/if}}
{{#if investmentReadiness}}Investment Readiness: {{{investmentReadiness}}}{{/if}}
{{#if investmentAmount}}Comfortable Investment Amount: {{{investmentAmount}}}{{/if}}
{{#if monthlySupportInterest}}Interest in Monthly Support: {{{monthlySupportInterest}}}{{/if}}

Provide specific recommendations for tools, strategies, and resources that can help them achieve their goals, tailored to their specific needs and interests.
`,
});

const suggestResourceRecommendationsFlow = ai.defineFlow(
  {
    name: 'suggestResourceRecommendationsFlow',
    inputSchema: SuggestResourceRecommendationsInputSchema,
    outputSchema: SuggestResourceRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
