import SurveyForm from '@/components/survey-form';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-primary/10 via-accent/5 to-background p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <SurveyForm />
      </div>
    </main>
  );
}
