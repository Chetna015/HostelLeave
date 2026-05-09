type UploadResult = {
  url: string;
  provider: 'cloudinary' | 'inline';
};

function isDataUrl(value: string) {
  return value.startsWith('data:');
}

export async function uploadVerificationMedia(dataUrl: string, folder: string): Promise<UploadResult> {
  if (!isDataUrl(dataUrl)) {
    return { url: dataUrl, provider: 'inline' };
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return { url: dataUrl, provider: 'inline' };
  }

  const payload = new FormData();
  payload.append('file', dataUrl);
  payload.append('upload_preset', uploadPreset);
  payload.append('folder', folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: payload,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload failed: ${errorText}`);
  }

  const result = (await response.json()) as { secure_url?: string };

  if (!result.secure_url) {
    throw new Error('Cloudinary upload did not return a secure URL');
  }

  return { url: result.secure_url, provider: 'cloudinary' };
}