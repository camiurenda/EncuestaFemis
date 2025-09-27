
'use server';

import {
  suggestResourceRecommendations,
  type SuggestResourceRecommendationsInput,
} from '@/ai/flows/suggest-resource-recommendations';
import { z } from 'zod';

const FormSchema = z.object({
  profession: z.string(),
  professionMore: z.string().optional(),
  digitalPresence: z.array(z.string()),
  challenges: z.array(z.string()),
  desiredSolutions: z.string(),
  investmentReadiness: z.string(),
  investmentAmount: z.string().optional(),
  monthlySupportInterest: z.string(),
  contact: z.string(),
});

type FormState = {
  success: boolean;
  recommendations?: string;
  error?: string;
};

const desiredSolutionsOptions = [
  'Una página web profesional',
  'Una tienda online',
  'Herramientas para organizar mi trabajo',
  'Un sistema de turnos/citas online',
  'Automatización de procesos',
];

export async function submitSurvey(data: z.infer<typeof FormSchema>): Promise<FormState> {
  try {
    const aiInput: SuggestResourceRecommendationsInput = {
      digitalPresence: data.digitalPresence,
      challenges: data.challenges,
      desiredSolutions:
        data.desiredSolutions === 'Todas las anteriores'
          ? desiredSolutionsOptions
          : [data.desiredSolutions],
      profession: data.profession,
      investmentReadiness: data.investmentReadiness,
      investmentAmount: data.investmentAmount,
      monthlySupportInterest: data.monthlySupportInterest,
    };

    // Don't wait for these promises to resolve, run them in parallel
    const recommendationsPromise = suggestResourceRecommendations(aiInput);

    const formspreePromise = fetch(process.env.FORM_ENDPOINT as string, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const [result, formspreeResult] = await Promise.all([recommendationsPromise, formspreePromise]);
    
    if (!formspreeResult.ok) {
        console.error('Error submitting to Formspree:', formspreeResult.statusText);
        const formspreeError = await formspreeResult.json();
        console.error(formspreeError);
        // We can still continue if formspree fails, as the main goal is recommendations.
    }

    return { success: true, recommendations: result.recommendations };
  } catch (error) {
    console.error('Error submitting survey or getting recommendations:', error);
    return {
      success: false,
      error: 'Ocurrió un error al procesar tu encuesta. Por favor, intentá de nuevo más tarde.',
    };
  }
}
