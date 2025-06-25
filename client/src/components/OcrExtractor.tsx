import { useRef, useState } from 'react';
import Tesseract from 'tesseract.js';

interface OcrExtractorProps {
  onExtracted: (text: string) => void;
}

export default function OcrExtractor({ onExtracted }: OcrExtractorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResult('');
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      // Convert PDF to image if needed (tesseract.js can handle images directly)
      const fileUrl = URL.createObjectURL(file);
      const { data } = await Tesseract.recognize(fileUrl, 'eng', {
        logger: (m) => {
          // Optionally handle progress
        },
      });
      setResult(data.text);
      onExtracted(data.text);
    } catch (err) {
      setError('Failed to extract text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mb-6 p-4 border rounded-md bg-gray-50'>
      <label className='block mb-2 font-medium'>
        Extract Recipe from Image or PDF
      </label>
      <input
        type='file'
        accept='image/*,application/pdf'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='mb-2'
      />
      {loading && <div className='text-blue-600'>Extracting text...</div>}
      {error && <div className='text-red-500'>{error}</div>}
      {result && (
        <div className='mt-2 p-2 bg-white border rounded text-sm whitespace-pre-wrap max-h-40 overflow-y-auto'>
          <strong>Extracted Text:</strong>
          <div>{result}</div>
        </div>
      )}
    </div>
  );
}
