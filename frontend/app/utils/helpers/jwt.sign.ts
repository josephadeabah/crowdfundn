import { SignJWT } from 'jose';

export async function generateToken(
  payload: Record<string, unknown>,
  secretKey: string,
) {
  const encoder = new TextEncoder();
  const secret = encoder.encode(secretKey);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(secret);
}
