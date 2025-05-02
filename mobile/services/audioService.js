import * as mime from 'mime';

export const uploadLectureAudio = async (audioUri) => {
  
  console.log("Inside audio service")
  console.log(audioUri)
  const mimeType = mime.getType(audioUri); // uses extension to get correct MIME
  const fileName = audioUri.split('/').pop();

  const formData = new FormData();
  formData.append('audio', {
    uri: audioUri,
    name: fileName,
    type: mimeType || 'audio/x-m4a',
  });

  const response = await fetch('https://neogurukul.onrender.com/api/v1/users/upload_lecture', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Upload failed: ${err}`);
  }

  return await response.json();
};
