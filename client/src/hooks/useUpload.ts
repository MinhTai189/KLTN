import { useState } from 'react';
import { uploadApi } from 'api/upload';
import { toast } from 'react-toastify';

export const useUpload = () => {
  const [loading, setLoading] = useState(false);

  async function upload(files: FileList | File[], folderName: string) {
    const formData = new FormData();
    formData.append('folder', folderName);
    const text = files.length === 1 ? 'file' : 'files';

    Array.from(files).forEach((file) => {
      formData.append(text, file);
    });

    try {
      setLoading(true);

      const response: any = await uploadApi.byFormData(formData);

      setLoading(false);

      return response.data;
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  }

  return { upload, loading };
};
