import React, { useRef, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Pencil } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Point, drawSignatureToCanvas, clearCanvas } from './signatureUtils';

interface DigitalCertificateProps {
  isSigned: boolean;
  signature: Point[];
  onSignClick: () => void;
  onRemoveSignature: () => void;
}

const DigitalCertificate: React.FC<DigitalCertificateProps> = ({
  isSigned,
  signature,
  onSignClick,
  onRemoveSignature,
}) => {
  const certificateCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isSigned && signature.length > 0 && certificateCanvasRef.current) {
      const ctx = certificateCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(
          0,
          0,
          certificateCanvasRef.current.width,
          certificateCanvasRef.current.height,
        );
        drawSignatureToCanvas(ctx, signature);
      }
    }
  }, [isSigned, signature]);

  return (
    <Card className="shadow-md col-span-1 md:col-span-2 lg:col-span-2">
      <CardHeader>
        <CardTitle>Digital Certificate</CardTitle>
        <CardDescription>
          Your investment certificate requires signature
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="bg-slate-50 p-4 sm:p-6 rounded-md border mb-4">
          {isSigned && (
            <div className="mt-4 pt-3 border-t">
              <p className="text-sm font-medium mb-1">Investor Signature:</p>
              <div className="bg-white p-2 border rounded-md">
                <canvas
                  ref={certificateCanvasRef}
                  width={400}
                  height={100}
                  className="border rounded-sm w-full"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {!isSigned ? (
          <Button className="w-full" variant="outline" onClick={onSignClick}>
            <Pencil className="mr-2 h-4 w-4" />
            Sign Certificate
          </Button>
        ) : (
          <Button
            variant="destructive"
            className="w-full"
            onClick={onRemoveSignature}
          >
            Remove Signature
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DigitalCertificate;
