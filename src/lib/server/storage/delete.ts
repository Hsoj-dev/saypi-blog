// src\lib\server\storage\delete.ts
import { error } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import { logInfo, logError } from '$lib/helpers/logger';

export async function deleteFile(
  bucket: string,
  path: string
) {
  const { locals: { cloudinary } } = getRequestEvent();
  const publicId = `${bucket}/${path}`;
  
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    // Check the result status. 'not found' means the asset didn't exist.
    if (result.result === 'not found') {
      logError('STORAGE_DELETE_NO_FILE_FOUND', { publicId });
      throw error(404, {
        message: 'File not found for deletion',
        code: 'STORAGE_DELETE_NO_FILE_FOUND'
      });
    } else if (result.result !== 'ok') {
      // Catch other potential issues, though 'destroy' is usually 'ok' or 'not found'
      logError('STORAGE_DELETE_FAILED_UNKNOWN_REASON', { publicId, result });
      throw error(500, {
        message: 'Failed to delete file for an unknown reason',
        code: 'STORAGE_DELETE_UNKNOWN_FAILED'
      });
    }

    logInfo('STORAGE_DELETE_SUCCESS', { publicId });
  } catch (err) {
    logError('STORAGE_DELETE_FAILED', { bucket, path, error: err });
    throw error(500, {
      message: 'Failed to delete file',
      code: 'STORAGE_DELETE_FAILED'
    });
  }
}
