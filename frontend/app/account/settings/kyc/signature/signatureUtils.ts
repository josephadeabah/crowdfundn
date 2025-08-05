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
