import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function UploadForm({ onFileUpload, isLoaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    
    const filePath = `uploads/${Date.now()}.pdf`;
    const { error } = await supabase.storage
      .from('course presentations') 
      .upload(filePath, file);

    setUploading(false);

    if (error) {
      console.error('Ошибка загрузки:', error.message);
      return;
    }

    const { data: signedUrlData, error: urlError } = await supabase
      .storage
      .from('course presentations') 
      .createSignedUrl(filePath, 60 * 60 * 24 * 30 * 6);

    if (urlError) {
      console.error('Error creating signed URL:', urlError.message);
      return;
    }
    onFileUpload(signedUrlData.signedUrl);
    isLoaded(true); // Передаем URL в родительский компонент
  };

  return (
    <div className="mt-3 flex flex-col items-center">
      <input type="file" onChange={handleFileChange} />
      <button 
        onClick={handleUpload} 
        disabled={uploading}
        className="bg-blue-500 p-1 rounded-lg pr-2 pl-2 mt-2"
      >
        {uploading ? 'Загрузка...' : 'Загрузить'}
      </button>
    </div>
  );
}