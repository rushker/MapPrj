// components/sidebars/areas/KhuASidebar.jsx
import OpacitySlider from './OpacitySlider';
import useAreaMetadata from '../../../../hooks/local/metadata/useAreaMetadata';

export default function KhuASidebar({ onClose, isEditMode }) {
  const {
    areaMetadata,
    errors,
    handleInputChange,
    handleOpacityChange,
  } = useAreaMetadata(); // Lấy từ context, không truyền metadata

  if (!areaMetadata) return <div className="p-4">Chưa chọn Khu A</div>;

  return (
    <div className="p-4 space-y-4 bg-white">
      <h2 className="text-xl font-semibold">Thông tin Khu A</h2>

      <input
        placeholder="Tên khu A"
        value={areaMetadata.name || ''}
        onChange={handleInputChange('name')}
        readOnly={!isEditMode}
        className="w-full border rounded px-3 py-2"
      />
      {errors.name && <p className="text-red-600">{errors.name}</p>}

      <textarea
        placeholder="Mô tả"
        value={areaMetadata.description || ''}
        onChange={handleInputChange('description')}
        readOnly={!isEditMode}
        className="w-full border rounded px-3 py-2"
      />

      <input
        placeholder="Loại khu (type)"
        value={areaMetadata.type || ''}
        onChange={handleInputChange('type')}
        readOnly={!isEditMode}
        className="w-full border rounded px-3 py-2"
      />
      {errors.type && <p className="text-red-600">{errors.type}</p>}

      {isEditMode && (
        <OpacitySlider
  value={areaMetadata.strokeOpacity ?? 1}
  onChange={handleOpacityChange}
  label="Độ trong suốt viền Khu A:"
/>
      )}

      {isEditMode && (
        <div className="flex justify-end">
          <button onClick={onClose}>Đóng</button>
        </div>
      )}
    </div>
  );
}
