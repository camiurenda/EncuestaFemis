
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';

interface RecommendationsProps {
  recommendations: string;
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  if (!recommendations) {
    return null;
  }

  // Basic markdown-to-HTML conversion
  const formatText = (text: string) => {
    return text
      .split('\n')
      .map((line) => {
        if (line.startsWith('* ')) {
          return `<li>${line.substring(2)}</li>`;
        }
        if (line.trim() === '') {
            return '<br />';
        }
        return `<p>${line}</p>`;
      })
      .join('')
      .replace(/<li>/g, '<ul class="list-disc list-inside space-y-1"><li>')
      .replace(/<\/li>(?!<li>)/g, '</li></ul>');
  };

  return (
    <div className="mt-6 animate-fade-in-down">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-primary">
            <Wand2 className="h-6 w-6" />
            <span>Sugerencias para tu proyecto</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-sm max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: formatText(recommendations) }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
