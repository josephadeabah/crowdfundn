import React, { useRef, useState } from 'react';
import { Point } from './signatureUtils';
import { Button } from '@/app/components/ui/button';

interface SignaturePadProps {
  onSave: (signature: Point[]) => void;
  onCancel: () => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onCancel }) => {
  const [signature, setSignature] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    setIsDrawing(true);
    const point = getCoordinates(e);
    setSignature([...signature, point]);
    drawOnCanvas();
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing) return;
    e.preventDefault();
    const point = getCoordinates(e);
    setSignature([...signature, point]);
    drawOnCanvas();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const getCoordinates = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const drawOnCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || signature.length < 1) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSignature(ctx);
  };

  const drawSignature = (ctx: CanvasRenderingContext2D) => {
    if (signature.length < 1) return;

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';

    // Draw all stored points
    ctx.beginPath();

    if (signature.length > 0) {
      ctx.moveTo(signature[0].x, signature[0].y);
    }

    for (let i = 1; i < signature.length; i++) {
      ctx.lineTo(signature[i].x, signature[i].y);
    }

    ctx.stroke();
  };

  const clearSignature = () => {
    setSignature([]);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleSave = () => {
    if (signature.length < 5) {
      return false; // Not enough points for a valid signature
    }

    onSave(signature);
    return true;
  };

  return (
    <div className="flex flex-col items-center space-y-4 py-4">
      <div className="border rounded-md w-full bg-white p-2">
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="border rounded-sm w-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </div>
      <div className="flex justify-between w-full">
        <Button variant="destructive" onClick={clearSignature}>
          Clear Signature
        </Button>
        <Button variant="ghost" onClick={() => onSave(signature)} className="bg-green-200 text-green-600">Apply Signature</Button>
      </div>
    </div>
  );
};

export default SignaturePad;
