import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Plus, Trash2, Video } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { useDropzone } from 'react-dropzone';

interface FAQItem {
  question: string;
  answer: string;
}

interface RaiseExtrasProps {
  extras: {
    videoPitch?: string;
    faq?: FAQItem[];
  };
  setExtras: (extras: any) => void;
}

const RaiseExtras = ({ extras, setExtras }: RaiseExtrasProps) => {
  const [newFAQ, setNewFAQ] = useState<FAQItem>({ question: '', answer: '' });
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.mov', '.avi'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setVideoFile(acceptedFiles[0]);
        setExtras({
          ...extras,
          videoPitch: URL.createObjectURL(acceptedFiles[0]),
        });
      }
    },
  });

  const handleAddFAQ = () => {
    if (newFAQ.question) {
      setExtras({
        ...extras,
        faq: [...(extras.faq || []), newFAQ],
      });
      setNewFAQ({ question: '', answer: '' });
    }
  };

  const handleRemoveFAQ = (index: number) => {
    const updatedFAQ = [...(extras.faq || [])];
    updatedFAQ?.splice(index, 1);
    setExtras({ ...extras, faq: updatedFAQ });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Extras</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Video Pitch</h4>
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
            >
              <input {...getInputProps()} />
              {extras.videoPitch ? (
                <div className="flex items-center justify-center">
                  <Video className="h-5 w-5 mr-2" />
                  <span>{videoFile?.name || 'Video uploaded'}</span>
                </div>
              ) : (
                <p>Drag 'n' drop a video file here, or click to select</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">FAQ</h4>
            <div className="space-y-3">
              {(extras.faq || [])?.map((item, index) => (
                <div key={index} className="border p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{item.question}</h5>
                      <p className="text-sm mt-1">{item.answer}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFAQ(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}

              <Input
                placeholder="Question"
                value={newFAQ.question}
                onChange={(e) =>
                  setNewFAQ({ ...newFAQ, question: e.target.value })
                }
              />
              <Input
                placeholder="Answer"
                value={newFAQ.answer}
                onChange={(e) =>
                  setNewFAQ({ ...newFAQ, answer: e.target.value })
                }
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddFAQ}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ Item
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RaiseExtras;
