
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Code, Loader2, Heart } from 'lucide-react';

import { submitSurvey } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
// Recommendations removed

const requiredString = (message: string) => z.string({ required_error: message }).min(1, message);
const requiredArray = (message: string) => z.array(z.string()).refine((value) => value.length > 0, { message });

const formSchema = z.object({
  profession: requiredString('Por favor, seleccioná una opción.'),
  professionMore: z.string().optional(),
  digitalPresence: requiredArray('Tenés que seleccionar al menos una opción.'),
  challenges: requiredArray('Tenés que seleccionar al menos una opción.'),
  desiredSolutions: requiredString('Por favor, seleccioná una opción.'),
  investmentReadiness: requiredString('Por favor, seleccioná una opción.'),
  investmentAmount: z.string().optional().default(''),
  monthlySupportInterest: requiredString('Por favor, seleccioná una opción.'),
  email: z.string().email('Ingresá un email válido').min(1, 'El email es requerido.'),
  phone: requiredString('Por favor, ingresá tu teléfono.'),
});

type FormValues = z.infer<typeof formSchema>;

const formSections = [
  { name: 'profession', label: '¿A qué te dedicás actualmente? *', options: ['Profesora', 'Emprendedora', 'Estudiante', 'Profesional de la salud', 'Otro'] },
  { name: 'digitalPresence', label: '¿Tenés actualmente alguna presencia digital? (Podés marcar varias opciones) *', options: ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'Página web propia', 'No tengo presencia digital', 'Otro'] },
  { name: 'challenges', label: '¿Cuál de estas cosas te genera más dificultad hoy? (Podés marcar varias opciones) *', options: ['Conseguir más clientes/pacientes', 'Organizar mi tiempo', 'Mostrar mis servicios de forma profesional', 'Tener una presencia web profesional', 'Procesar pagos online', 'Automatizar tareas repetitivas', 'Diferenciarme de la competencia'] },
  { name: 'desiredSolutions', label: 'Si pudieras tener una ayudita digital, te interesaría más: *', options: ['Una página web profesional', 'Una tienda online', 'Herramientas para organizar mi trabajo', 'Un sistema de turnos/citas online', 'Automatización de procesos', 'Todas las anteriores'] },
  { name: 'investmentReadiness', label: '¿Qué tan dispuesta estarías a invertir en una solución digital que te dé visibilidad y te ahorre tiempo? *', options: ['Muy dispuesta', 'Algo dispuesta', 'Poco dispuesta', 'Nada dispuesta'] },
  { name: 'investmentAmount', label: '(Opcional) Para orientarme un poco, ¿cuánto sentirías cómodo invertir en algo así?', options: ['Hasta $10.000', 'Entre $10.000 y $25.000', 'Entre $25.000 y $50.000', 'Más de $50.000', 'Prefiero no decir'] },
  { name: 'monthlySupportInterest', label: '¿Te interesaría un plan de acompañamiento mensual accesible que incluya soporte, cambios pequeños y ayuda con lo digital? *', options: ['Sí, me interesa mucho', 'Tal vez, dependiendo del precio', 'No estoy segura', 'No me interesa'] },
  // Contact field replaced with separate email and phone fields
];

export default function SurveyForm() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  // Recommendations state removed
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profession: '',
      professionMore: '',
      digitalPresence: [],
      challenges: [],
      desiredSolutions: '',
      investmentReadiness: '',
      investmentAmount: '',
      monthlySupportInterest: '',
      email: '',
      phone: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setFormState('submitting');
    const result = await submitSurvey(values);
    if (result.success) {
      setFormState('success');
      form.reset();
      toast({
        title: '¡Encuesta enviada!',
        description: 'Gracias por completar la encuesta. Hemos recibido tu información.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: '¡Ups! Algo salió mal.',
        description: result.error || 'No se pudo enviar la encuesta.',
      });
      setFormState('idle');
    }
  }
  
  const renderAnimatedSection = (child: React.ReactNode, index: number) => (
    <div className="animate-fade-in-down" style={{ animationDelay: `${index * 100}ms` }}>
      {child}
    </div>
  );

  if (formState === 'success') {
    return (
      <Card className="w-full shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
             <Heart className="w-10 h-10 text-accent" fill="currentColor" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">¡Gracias por sumar tu voz!</CardTitle>
          <CardDescription className="text-lg">
            Tus respuestas nos ayudan a pensar juntas soluciones digitales para nuestra comunidad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              Pronto te contactaremos con más información.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-2xl shadow-primary/10">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
          <Code className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Encuesta de Soluciones Web
        </CardTitle>
        <CardDescription className="mt-2 text-lg">
          Diseñemos juntas la tecnología que tu proyecto necesita para crecer y brillar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            
            {renderAnimatedSection(<>
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">{formSections[0].label}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Seleccioná una opción..." /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formSections[0].options?.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="professionMore"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormControl>
                      <Textarea placeholder="Contanos un poco más..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>, 0)}

            <Separator />
            
            {renderAnimatedSection(<FormField
              control={form.control}
              name="digitalPresence"
              render={() => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">{formSections[1].label}</FormLabel>
                  <div className="space-y-2">
                    {formSections[1].options?.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="digitalPresence"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item])
                                    : field.onChange(field.value?.filter((value) => value !== item));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />, 1)}

            <Separator />

            {renderAnimatedSection(<FormField
              control={form.control}
              name="challenges"
              render={() => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">{formSections[2].label}</FormLabel>
                  <div className="space-y-2">
                    {formSections[2].options?.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="challenges"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item])
                                    : field.onChange(field.value?.filter((value) => value !== item));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />, 2)}
            
            <Separator />

            {renderAnimatedSection(<FormField
              control={form.control}
              name="desiredSolutions"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg font-semibold">{formSections[3].label}</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                      {formSections[3].options?.map(option => (
                        <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value={option} /></FormControl>
                          <FormLabel className="font-normal">{option}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />, 3)}

            <Separator />
            
            {renderAnimatedSection( <FormField
              control={form.control}
              name="investmentReadiness"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg font-semibold">{formSections[4].label}</FormLabel>
                   <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                      {formSections[4].options?.map(option => (
                        <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value={option} /></FormControl>
                          <FormLabel className="font-normal">{option}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />, 4)}

            <Separator />
            
            {renderAnimatedSection(<FormField
              control={form.control}
              name="investmentAmount"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg font-semibold">{formSections[5].label}</FormLabel>
                   <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                      {formSections[5].options?.map(option => (
                        <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value={option} /></FormControl>
                          <FormLabel className="font-normal">{option}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />, 5)}

            <Separator />
            
            {renderAnimatedSection(<FormField
              control={form.control}
              name="monthlySupportInterest"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg font-semibold">{formSections[6].label}</FormLabel>
                   <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                      {formSections[6].options?.map(option => (
                        <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value={option} /></FormControl>
                          <FormLabel className="font-normal">{option}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />, 6)}

            <Separator />

            {renderAnimatedSection(<div className="space-y-4">
              <h3 className="text-lg font-semibold">¿Querés que te avise cuando arme las primeras soluciones? *</h3>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono *</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="11 1234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>, 7)}
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          size="lg"
          className="w-full text-lg font-bold transition-transform hover:scale-105"
          disabled={formState === 'submitting'}
          onClick={form.handleSubmit(onSubmit)}
        >
          {formState === 'submitting' ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <>
            Enviar Respuestas <Heart className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
