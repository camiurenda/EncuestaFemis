
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

    const result = await suggestResourceRecommendations(aiInput);

    // Here you could also save the full form data (data) to a database
    // or send it to a service like Formspree.

    return { success: true, recommendations: result.recommendations };
  } catch (error) {
    console.error('Error submitting survey or getting recommendations:', error);
    return {
      success: false,
      error: 'Ocurrió un error al procesar tu encuesta. Por favor, intentá de nuevo más tarde.',
    };
  }
}
