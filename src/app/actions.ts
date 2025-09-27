
'use server';

// AI recommendations removed
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
  email: z.string().email('Ingresá un email válido'),
  phone: z.string().min(1, 'Ingresá tu teléfono'),
});

type FormState = {
  success: boolean;
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
    // Submit to Formspree only
    const formspreeResult = await fetch(process.env.FORM_ENDPOINT as string, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!formspreeResult.ok) {
        console.error('Error submitting to Formspree:', formspreeResult.status, formspreeResult.statusText);
        try {
            const formspreeError = await formspreeResult.json();
            console.error('Formspree error details:', formspreeError);
        } catch (e) {
            console.error('Could not parse Formspree error response');
        }
        return {
            success: false,
            error: 'No pudimos procesar tu encuesta en este momento. Por favor, intentá de nuevo más tarde.',
        };
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting survey:', error);
    return {
      success: false,
      error: 'Ocurrió un error al procesar tu encuesta. Por favor, intentá de nuevo más tarde.',
    };
  }
}
