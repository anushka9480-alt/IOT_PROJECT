function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Unable to convert blob to base64.'));
        return;
      }

      resolve(reader.result.split(',')[1] ?? '');
    };

    reader.onerror = () => reject(new Error('Unable to read file.'));
    reader.readAsDataURL(blob);
  });
}

export async function fileUriToBase64(fileUri: string) {
  const response = await fetch(fileUri);
  const blob = await response.blob();
  return blobToBase64(blob);
}
