// components/sidebars/areas/KhuASidebar.jsx
import { useMemo } from 'react';
import { toast } from 'react-hot-toast';
import OpacitySlider from './OpacitySlider';
import useAreaMetadata from '../../../../hooks/local/metadata/useAreaMetadata';

export default function KhuASidebar({ metadata, onSave, onClose, isEditMode }) {
  const areaId = useMemo(() => metadata?._id, [metadata]);
  const {
    areaMetadata,
    errors,
    validate,
    isValid,
    isUnchanged,
    handleInputChange,
    handleOpacityChange,
  } = useAreaMetadata(areaId); // ✅ Truyền đúng areaId để hook khởi tạo state

  if (!areaMetadata) return <div className="p-4">Chưa chọn Khu A</div>;

  const handleSaveClick = () => {
    if (!validate()) return;
    onSave?.(areaMetadata);
    toast.success('Đã lưu nháp Khu A');
  };

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
        <OpacitySlider value={areaMetadata.opacity ?? 0.2} onChange={handleOpacityChange} />
      )}

      {isEditMode && (
        <div className="flex justify-between">
          <button onClick={handleSaveClick} disabled={!isValid || isUnchanged}>
            Lưu
          </button>
          <button onClick={onClose}>Đóng</button>
        </div>
      )}
    </div>
  );
}


