import React, { useCallback, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Upload, Link2, X, File, ImageIcon, FileVideo } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { toast } from 'sonner';

interface MediaUploadProps {
  onMediaSelect: (url: string, type: 'image' | 'video') => void;
  className?: string;
}

const MediaUpload = ({ onMediaSelect, className }: MediaUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlType, setUrlType] = useState<'image' | 'video'>('image');
  const [isUrlMode, setIsUrlMode] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
    // Reset input value so the same file can be selected again
    e.target.value = '';
  };

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    const fileType = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
        ? 'video'
        : null;

    if (!fileType) {
      toast.error('Unsupported file type. Please upload an image or video.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onMediaSelect(result, fileType);
        toast.success(
          `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded successfully!`,
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    onMediaSelect(urlInput, urlType);
    toast.success(
      `${urlType.charAt(0).toUpperCase() + urlType.slice(1)} from URL added successfully!`,
    );
    setUrlInput('');
    setIsUrlMode(false);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {isUrlMode ? (
        <div className="animate-fade-in">
          <form onSubmit={handleUrlSubmit} className="space-y-3">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={urlType === 'image' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUrlType('image')}
                className="flex-1"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Image
              </Button>
              <Button
                type="button"
                variant={urlType === 'video' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUrlType('video')}
                className="flex-1"
              >
                <FileVideo className="w-4 h-4 mr-2" />
                Video
              </Button>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={`Enter ${urlType} URL...`}
                className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald/60"
              />
              <Button type="submit" size="sm">
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsUrlMode(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div
          className={cn(
            'media-upload-area',
            isDragging && 'border-emerald bg-muted',
            'animate-fade-in',
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="media-upload"
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileSelect}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-emerald-600 opacity-70" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Drag and drop media here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports images and videos
              </p>
            </div>
            <div className="flex gap-3 mt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('media-upload')?.click()}
              >
                <File className="mr-2 h-4 w-4" />
                Browse files
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsUrlMode(true)}
              >
                <Link2 className="mr-2 h-4 w-4" />
                Add from URL
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
