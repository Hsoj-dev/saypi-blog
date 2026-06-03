// src\lib\server\storage\get-url.ts
import { getRequestEvent } from '$app/server';

export function getPublicUrl(
  bucket: string,
  path: string
) {
  const { locals: { cloudinary } } = getRequestEvent();
  // Construct the full public ID (folder + filename)
  const publicId = `${bucket}/${path}`;
  
  // Generates a direct URL with no transformation parameters
  return cloudinary.url(publicId, {
    secure: true
  });
}
