import { FileText, Download } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface DocumentsTabProps {
  isLoading: boolean;
  documents: any[];
}

export function DocumentsTab({ isLoading, documents }: DocumentsTabProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading documents...</p>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>No documents available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map(
        (doc, index) =>
          doc.files &&
          doc.files.map((file: any, fileIndex: number) => (
            <div
              key={`${index}-${fileIndex}`}
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer rounded-lg group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 flex items-center justify-center rounded-lg">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-600">
                    {file.filename} • {file.human_size}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="bg-white hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => window.open(file.url, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          )),
      )}
    </div>
  );
}
