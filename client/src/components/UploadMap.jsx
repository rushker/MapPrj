// src/components/UploadModal.jsx
import { useState } from 'react';
import { FiUpload, FiX, FiMap } from 'react-icons/fi';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PNG, JPEG, or PDF file');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      // Replace with your actual upload logic
      const uploadedUrl = await mockUpload(file);
      onUploadSuccess(uploadedUrl);
      onClose();
    } catch (err) {
      setError('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const mockUpload = (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1500);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FiMap className="text-primary-500" />
            Upload New Map
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Map File
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition">
                  <FiUpload className="text-gray-400 mb-2" size={24} />
                  <p className="text-sm text-gray-600">
                    {file ? file.name : 'Click to select file'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, or PDF (Max 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {preview && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="border rounded-lg p-2">
                <img
                  src={preview}
                  alt="Map preview"
                  className="max-h-40 w-auto mx-auto"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="animate-spin">↻</span>
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload />
                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;