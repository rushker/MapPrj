// components/sidebars/entities/ImageUploader.jsx
import { useRef, useState } from 'react';
import { FiUploadCloud, FiTrash } from 'react-icons/fi';

export default function ImageUploader({ images = [], onUpload, onDelete }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    [...files].forEach((file) => {
      if (file.type.startsWith('image/')) {
        onUpload?.(file);
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="mt-4">
      <label className="block mb-2 font-medium">Ảnh minh họa:</label>

      <div
        className={`border-2 border-dashed rounded p-4 text-center transition-all cursor-pointer ${
          isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FiUploadCloud className="mx-auto text-3xl text-gray-400" />
        <p className="text-sm text-gray-600 mt-2">
          Kéo ảnh vào đây hoặc <span className="text-blue-600 underline">chọn từ máy</span>
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          ref={inputRef}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Hiển thị ảnh đã chọn */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img src={url} alt={`uploaded-${index}`} className="rounded shadow object-cover h-24 w-full" />
              <button
                type="button"
                onClick={() => onDelete?.(url)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hidden group-hover:block"
              >
                <FiTrash className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
