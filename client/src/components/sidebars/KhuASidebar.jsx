// src/components/sidebars/KhuASidebar.jsx
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import OpacitySlider from './OpacitySlider';
import useLocalArea from '../../hooks/useLocalArea';
import { Info } from 'lucide-react';

export default function KhuASidebar({ entity, onChange, onSave, onDelete }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    errors,
    validate,
    isUnchanged,
    isValid,
    handleInputChange,
    handleCheckboxChange,
    handleOpacityChange,
  } = useLocalArea(entity, onChange);

  if (!entity) return <div className="p-4">Chưa chọn Khu A</div>;

  const handleSaveClick = async () => {
    if (!validate()) return;
    try {
      setIsLoading(true);
      await onSave(entity);
      toast.success('Đã lưu Khu A thành công');
    } catch (err) {
      console.error(err);
      toast.error('Lưu thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col space-y-4 bg-white">
      <h2 className="text-xl font-semibold">Thông tin Khu A</h2>

      {/* Tên */}
      <div>
        <input
          type="text"
          placeholder="Tên khu A"
          value={entity.name || ''}
          onChange={handleInputChange('name')}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
            errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Mô tả */}
      <textarea
        placeholder="Mô tả"
        value={entity.description || ''}
        onChange={handleInputChange('description')}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows={3}
      />

      {/* Type */}
      <div>
        <input
          type="text"
          placeholder="Loại khu (type)"
          value={entity.type || ''}
          onChange={handleInputChange('type')}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
            errors.type ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type}</p>}
      </div>

      {/* Opacity */}
      <div className="pt-4 border-t">
        <OpacitySlider
          value={entity.opacity ?? 0.2}
          onChange={handleOpacityChange}
        />
      </div>

      {/* Zoom lock */}
      <div className="flex items-center gap-2 text-sm pt-1">
        <input
          type="checkbox"
          checked={entity.lockedZoom ?? false}
          onChange={handleCheckboxChange('lockedZoom')}
        />
        <span className="text-gray-800">Khóa zoom</span>
        {entity.lockedZoom && (
          <span className="text-yellow-600 flex items-center gap-1" title="Người dùng sẽ không thay đổi được mức zoom">
            <Info size={16} /> Zoom bị khóa
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="pt-6 flex justify-between">
        <button
          onClick={handleSaveClick}
          disabled={!isValid || isUnchanged || isLoading}
          className={`px-5 py-2 rounded text-white transition ${
            !isValid || isUnchanged || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isLoading ? 'Đang lưu...' : 'Lưu'}
        </button>

        <button
          onClick={onDelete}
          disabled={isLoading}
          className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
