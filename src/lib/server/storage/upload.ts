// src\lib\server\storage\upload.ts
import { error } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import { logError } from '$lib/helpers/logger';

export async function uploadFile(userId: string, bucket: string, file: File, path: string) {
  const { locals: { cloudinary } } = getRequestEvent(); 
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({
      folder: bucket,
      public_id: path, // Set the path/filename
      resource_type: 'auto',
      overwrite: true,
    }, (err, result) => {
      if (err) {
        logError('PROFILE_PIC_UPLOAD_FAILED', { userId, error: err });
        return reject(error(500, {
          message: 'Failed to upload file',
          code: 'STORAGE_UPLOAD_FAILED'
        }));
      }
      resolve(result);
    }).end(buffer);
  });
}

// https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<folder>/<public_id>.<extension>