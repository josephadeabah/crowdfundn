export interface Point {
  x: number;
  y: number;
}

export const drawSignatureToCanvas = (
  ctx: CanvasRenderingContext2D,
  signature: Point[],
) => {
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

export const clearCanvas = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

export const convertSignatureToBlob = (
  signature: Point[],
  width: number = 400,
  height: number = 200,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw the signature
    drawSignatureToCanvas(ctx, signature);

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert signature to blob'));
        }
      },
      'image/png',
      1.0,
    );
  });
};
