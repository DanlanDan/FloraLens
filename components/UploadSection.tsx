import React, { useCallback, useState } from 'react';

interface UploadSectionProps {
  onImageSelected: (file: File) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  }, [onImageSelected]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  }, [onImageSelected]);

  return (
    <div className="max-w-2xl mx-auto mt-12 px-6">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-emerald-900 mb-4">Identify & Care for Your Plants</h2>
        <p className="text-lg text-gray-600">Upload a photo of any plant to instantly get identification, detailed care guides, and chat with an AI gardening expert.</p>
      </div>

      <div
        className={`relative border-4 border-dashed rounded-3xl p-12 transition-all duration-300 ease-in-out flex flex-col items-center justify-center cursor-pointer group
          ${isDragging 
            ? 'border-emerald-500 bg-emerald-50 scale-105 shadow-xl' 
            : 'border-gray-300 bg-white hover:border-emerald-400 hover:shadow-lg'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleFileChange}
        />
        
        <div className="bg-emerald-100 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-emerald-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Click or Drag to Upload</h3>
        <p className="text-sm text-gray-500">Supports JPG, PNG, WEBP</p>
      </div>

      {/* Quick demo images for testing/users without photos */}
      <div className="mt-8 text-center">
         <p className="text-sm text-gray-400 mb-4">No photo? Try these examples:</p>
         <div className="flex justify-center gap-4">
            <button className="overflow-hidden rounded-lg shadow-sm hover:shadow-md hover:ring-2 ring-emerald-400 transition-all w-20 h-20 relative" onClick={async () => {
                 const res = await fetch('https://images.unsplash.com/photo-1512428814795-ff5cc5fb5301?auto=format&fit=crop&w=300&q=80');
                 const blob = await res.blob();
                 const file = new File([blob], "monstera.jpg", { type: "image/jpeg" });
                 onImageSelected(file);
            }}>
                <img src="https://images.unsplash.com/photo-1512428814795-ff5cc5fb5301?auto=format&fit=crop&w=150&q=60" alt="Monstera" className="object-cover w-full h-full" />
            </button>
             <button className="overflow-hidden rounded-lg shadow-sm hover:shadow-md hover:ring-2 ring-emerald-400 transition-all w-20 h-20 relative" onClick={async () => {
                 const res = await fetch('https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=300&q=80');
                 const blob = await res.blob();
                 const file = new File([blob], "succulent.jpg", { type: "image/jpeg" });
                 onImageSelected(file);
            }}>
                <img src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=150&q=60" alt="Succulent" className="object-cover w-full h-full" />
            </button>
         </div>
      </div>
    </div>
  );
};