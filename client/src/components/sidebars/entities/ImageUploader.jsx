// components/sidebars/entities/ImageUploader.jsx
export default function ImageUploader({ images, onUpload, onDelete }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Hình ảnh</label>
      <input
        type="file"
        accept="image/*"
        className="mb-3 block w-full text-sm text-gray-700"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url) => (
            <div
              key={url}
              className="relative group border rounded overflow-hidden"
            >
              <img
                src={url}
                alt="entity"
                className="object-cover w-full h-24"
              />
              <button
                type="button"
                onClick={() => onDelete(url)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-80 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
