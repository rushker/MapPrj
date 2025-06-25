// src/components/sidebars/areas/KhuASidebar.jsx
import ColorOpacityPicker from '../../../postmap/draw/ColorOpacityPicker';
import useAreaMetadata from '../../../../hooks/local/metadata/useAreaMetadata';

export default function KhuASidebar({ onClose, isEditMode }) {
  const {
    areaMetadata,
    errors,
    handleInputChange,
    handleStyleChange,
  } = useAreaMetadata();

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
        <div className="space-y-4">
          <ColorOpacityPicker
            label="Viền (Stroke)"
            color={areaMetadata.strokeColor || { r: 51, g: 136, b: 255, a: 1 }}
            onChange={(val) => handleStyleChange('strokeColor', val)}
          />
          <ColorOpacityPicker
            label="Màu nền (Fill)"
            color={areaMetadata.fillColor || { r: 255, g: 0, b: 0, a: 0.4 }}
            onChange={(val) => handleStyleChange('fillColor', val)}
          />
        </div>
      )}

      {isEditMode && (
        <div className="flex justify-end">
          <button onClick={onClose}>Đóng</button>
        </div>
      )}
    </div>
  );
}
