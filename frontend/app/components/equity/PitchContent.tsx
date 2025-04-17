import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import RichTextEditor from '@/app/components/ui/RichTextEditor';

interface PitchContentProps {
  content: string;
  setContent: (value: string) => void;
}

const PitchContent = ({ content, setContent }: PitchContentProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Pitch Content</h3>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Your full investment pitch story..."
        />
      </CardContent>
    </Card>
  );
};

export default PitchContent;
