'use client';
import React, { useCallback, useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Button } from '@/app/components/ui/button';
import { Edit, Eye, LayoutTemplate, Save } from 'lucide-react';
import RichTextEditor from '@/app/components/ui/RichTextEditor';
import TemplateSelector from '@/app/components/ui/TemplateSelector';
import { CampaignTemplate } from '@/app/lib/campaign-templates';
import { toast } from 'sonner';
import { Separator } from '../ui/seperator';
import { useDropzone } from 'react-dropzone';
import { FiX } from 'react-icons/fi';
import { FormErrors } from './CampaignCreator';

interface CampaignEditorProps {
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  selectedTemplate: CampaignTemplate | null;
  setSelectedTemplate: (template: CampaignTemplate | null) => void;
  onSave: () => void;
  onSelectTemplate: (template: CampaignTemplate) => void;
  selectedImage: File | null;
  setSelectedImage: (file: File | null) => void;
  category: string;
  location: string;
  goalAmount: string;
  currencyCode: string;
  currencies: Array<{ code: string; symbol: string }>;
  startDate?: Date | string;
  endDate?: Date | string;
  loading: boolean;
  error: FormErrors;
}

const CampaignEditor = ({
  title,
  setTitle,
  content,
  setContent,
  selectedTemplate,
  onSave,
  onSelectTemplate,
  selectedImage,
  setSelectedImage,
  category,
  location,
  goalAmount,
  currencyCode,
  currencies,
  startDate,
  endDate,
  loading,
  error,
}: CampaignEditorProps) => {
  const [editorActiveTab, setEditorActiveTab] = useState('editor');
  const getCurrencySymbol = (code: string) => {
    const currency = currencies.find((c) => c.code === code);
    return currency ? currency.symbol : '$';
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setSelectedImage(acceptedFiles[0]);
      }
    },
    [setSelectedImage],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-5">
        <Tabs
          value={editorActiveTab}
          onValueChange={setEditorActiveTab}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger
                value="editor"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-500"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-500"
              >
                <LayoutTemplate className="w-4 h-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-500"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
            <Button
              variant="secondary"
              onClick={onSave}
              className="ml-auto text-gray-500"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Saving...' : 'Save Campaign'}
            </Button>
          </div>

          <TabsContent value="editor" className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <div>
                <label className="form-label">Campaign Story</label>
                <RichTextEditor value={content} onChange={setContent} />
              </div>

              <div>
                <label className="form-label">Add Media</label>
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    {selectedImage && (
                      <FiX
                        size={24}
                        className="text-gray-500 cursor-pointer"
                        onClick={handleRemoveImage}
                      />
                    )}
                  </div>

                  {!selectedImage ? (
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-md p-4 text-center ${
                        isDragActive ? 'border-green-600' : 'border-gray-400'
                      }`}
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p>Drop the files here...</p>
                      ) : (
                        <p>Drag 'n' drop a file here, or click to select one</p>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-64 bg-cover bg-center rounded-md overflow-hidden">
                      <img
                        src={URL.createObjectURL(selectedImage) || ''}
                        alt="Selected image"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  {/* Display the image validation error */}
                  {error.image && (
                    <p className="text-red-500 text-sm mt-2">{error.image}</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="animate-fade-in">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Choose a Template
                </h3>
                <p className="text-muted-foreground mb-4">
                  Select a pre-designed template to jumpstart your campaign.
                </p>
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={onSelectTemplate}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="animate-fade-in">
            <div className="bg-white rounded-xl border border-border p-6 max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-3">
                {title || 'Your Campaign Title'}
              </h1>

              {category && (
                <div className="inline-flex items-center bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm mr-2 mb-4">
                  <span>{category}</span>
                </div>
              )}

              {location && (
                <div className="inline-flex items-center bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm mb-4">
                  <span>{location}</span>
                </div>
              )}

              {goalAmount && (
                <div className="mb-4">
                  <span className="font-semibold text-emerald-800">
                    Goal: {getCurrencySymbol(currencyCode)}
                    {goalAmount}
                  </span>
                </div>
              )}

              {startDate && endDate && (
                <div className="inline-flex items-center bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm mb-6">
                  <span>
                    Campaign runs: {new Date(startDate).toLocaleDateString()} -{' '}
                    {new Date(endDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              <Separator className="my-6" />

              <div
                className="prose prose-emerald max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    content ||
                    '<p class="text-muted-foreground">Your campaign story will appear here. Switch to the Editor tab to add content.</p>',
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CampaignEditor;
