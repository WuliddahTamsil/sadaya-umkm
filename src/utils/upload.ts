import { api } from '../config/api';

export const VERCEL_SAFE_FILE_LIMIT_BYTES = 4 * 1024 * 1024;

export function validateUploadFile(file: File, allowedMimePrefixes: string[] = ['image/']) {
  if (!file) {
    throw new Error('File tidak ditemukan');
  }

  const isAllowed = allowedMimePrefixes.some((prefix) => file.type.startsWith(prefix))
    || allowedMimePrefixes.includes(file.type.toLowerCase());

  if (!isAllowed) {
    throw new Error('Format file tidak didukung');
  }

  if (file.size > VERCEL_SAFE_FILE_LIMIT_BYTES) {
    throw new Error('Ukuran file maksimal 4MB agar upload aman di Vercel');
  }
}

export async function uploadFileToBlob(file: File, folder: 'driver' | 'umkm' | 'products' | 'profiles' | 'general') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch(api.upload.file, {
    method: 'POST',
    body: formData,
  });

  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || 'Gagal upload file');
  }

  if (!payload?.fileUrl) {
    throw new Error('Server tidak mengembalikan URL file');
  }

  return payload.fileUrl as string;
}
