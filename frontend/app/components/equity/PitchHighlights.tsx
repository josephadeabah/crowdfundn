import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import RichTextEditor from '@/app/components/ui/RichTextEditor';

interface PitchHighlightsProps {
  highlights: string;
  setHighlights: (value: string) => void;
}

const PitchHighlights = ({
  highlights,
  setHighlights,
}: PitchHighlightsProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Highlights</h3>
        <RichTextEditor
          value={highlights}
          onChange={setHighlights}
          placeholder="Key highlights and selling points of your equity offering..."
        />
      </CardContent>
    </Card>
  );
};

export default PitchHighlights;
