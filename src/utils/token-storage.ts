// src/utils/token-storage.ts
import fs from 'fs';
import path from 'path';

const TOKEN_PATH = process.env.TOKEN_FILE_PATH
  ? path.resolve(process.cwd(), process.env.TOKEN_FILE_PATH)
  : path.resolve(process.cwd(), 'storage/tokens/auth.json');

export type TokenData = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // unix timestamp (ms)
};

export function saveToken(token: TokenData) {
  const dir = path.dirname(TOKEN_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token), 'utf8');
}

export function loadToken(): TokenData | null {
  if (!fs.existsSync(TOKEN_PATH)) return null;
  try {
    const raw = fs.readFileSync(TOKEN_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearToken() {
  if (fs.existsSync(TOKEN_PATH)) fs.unlinkSync(TOKEN_PATH);
}
