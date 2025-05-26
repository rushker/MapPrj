// src/components/sidebars/SidebarLayout.jsx
import { useState } from 'react';
import { uploadImage, deleteImage } from '../../services/media';
import { getCloudinaryPublicId } from '../../utils/cloudinary';

export default function SidebarLayout({
  title,
  entity,
  onChange,
  onSave,
  onDelete,
  fields = [],
}) {
  const [uploading, setUploading] = useState(false);

  const handleTextChange = (key) => (e) => {
    onChange({ ...entity, [key]: e.target.value });
  };

  const handleImageChange = (key) => async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const oldPublicId = getCloudinaryPublicId(entity[key]);
      if (oldPublicId) {
        try {
          await deleteImage(oldPublicId);
        } catch (err) {
          console.error('Không thể xoá ảnh cũ:', err);
        }
      }

      const formData = new FormData();
      formData.append('file', file);

      const uploaded = await uploadImage(formData);
      if (uploaded?.url) {
        onChange({ ...entity, [key]: uploaded.url });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="font-bold mb-2">{title}</h2>

      {fields.map(({ key, label, type }) => {
        if (type === 'text') {
          return (
            <div key={key} className="mb-2">
              <label className="block mb-1">{label}:</label>
              <input
                type="text"
                value={entity[key] || ''}
                onChange={handleTextChange(key)}
                className="border p-1 w-full"
              />
            </div>
          );
        }

        if (type === 'textarea') {
          return (
            <div key={key} className="mb-2">
              <label className="block mb-1">{label}:</label>
              <textarea
                value={entity[key] || ''}
                onChange={handleTextChange(key)}
                className="border p-1 w-full"
              />
            </div>
          );
        }

        if (type === 'image') {
          const imageUrl =
            typeof entity[key] === 'string'
              ? entity[key]
              : entity[key]?.url;

          return (
            <div key={key} className="mb-2">
              <label className="block mb-1">{label}:</label>
              <input type="file" accept="image/*" onChange={handleImageChange(key)} />
              {uploading && <p className="text-sm text-gray-600 mt-1">Đang upload...</p>}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="preview"
                  className="mt-2 max-w-full rounded"
                />
              )}
            </div>
          );
        }

        return null;
      })}

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onSave(entity)}
          disabled={uploading}
          className={`px-4 py-2 rounded text-white ${
            uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {uploading ? 'Đang xử lý...' : 'Lưu'}
        </button>

        {onDelete && (
          <button
            onClick={() => onDelete(entity)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Xoá
          </button>
        )}
      </div>
    </div>
  );
}
