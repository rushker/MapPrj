// components/sidebars/areas/KhuASidebar.jsx
import { toast } from 'react-hot-toast';
import OpacitySlider from './OpacitySlider';
import useAreaMetadata from '../../../../hooks/local/metadata/useAreaMetadata';

export default function KhuASidebar({ 
  metadata, 
  onSave, 
  onDelete, 
  onClose, 
  isEditMode = false 
}) {
  const {
    areaMetadata,
    errors,
    validate,
    isUnchanged,
    isValid,
    handleInputChange,
    handleOpacityChange,
  } = useAreaMetadata(metadata, isEditMode); // Truyền isEditMode vào hook

  if (!areaMetadata) return <div className="p-4">Chưa chọn Khu A</div>;

  const handleSaveClick = () => {
    const valid = validate();
    if (!valid) return;
    
    if (onSave) {
      onSave(areaMetadata);
      toast.success('Đã lưu nháp Khu A');
    }
  };

  const saveDisabled = !isValid || isUnchanged || !isEditMode; // Thêm điều kiện !isEditMode

  return (
    <div className="p-4 flex flex-col space-y-4 bg-white">
      <h2 className="text-xl font-semibold">Thông tin Khu A</h2>

      {/* Tên */}
      <div>
        <input
          type="text"
          placeholder="Tên khu A"
          value={areaMetadata.name || ''}
          onChange={isEditMode ? handleInputChange('name') : undefined}
          readOnly={!isEditMode}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
            errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          } ${!isEditMode ? 'bg-gray-100' : ''}`}
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Mô tả */}
      <textarea
        placeholder="Mô tả"
        value={areaMetadata.description || ''}
        onChange={isEditMode ? handleInputChange('description') : undefined}
        readOnly={!isEditMode}
        className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
          !isEditMode ? 'bg-gray-100' : ''
        }`}
        rows={3}
      />

      {/* Type */}
      <div>
        <input
          type="text"
          placeholder="Loại khu (type)"
          value={areaMetadata.type || ''}
          onChange={isEditMode ? handleInputChange('type') : undefined}
          readOnly={!isEditMode}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
            errors.type ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          } ${!isEditMode ? 'bg-gray-100' : ''}`}
        />
        {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type}</p>}
      </div>

      {/* Opacity - Chỉ hiển thị khi ở chế độ chỉnh sửa */}
      {isEditMode && (
        <div className="pt-4 border-t">
          <OpacitySlider 
            value={areaMetadata.opacity ?? 0.2} 
            onChange={handleOpacityChange} 
          />
        </div>
      )}

      {/* Buttons - Chỉ hiển thị khi ở chế độ chỉnh sửa */}
      {isEditMode && (
        <div className="pt-6 flex justify-between">
          <button
            onClick={handleSaveClick}
            disabled={saveDisabled}
            className={`px-5 py-2 rounded text-white transition ${
              saveDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            Lưu nháp
          </button>
          <button
            onClick={onClose}
            className="mt-4 bg-gray-200 text-gray-800 px-5 py-2 rounded hover:bg-gray-300 transition self-start"
          >
            Đóng
          </button>

          <button
            onClick={onDelete}
            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
          >
            Xóa
          </button>
        </div>
      )}
    </div>
  );
}