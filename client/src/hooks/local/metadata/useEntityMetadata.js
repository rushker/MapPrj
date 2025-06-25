// hooks/local/metadata/useEntityMetadata.js

import { useState, useEffect, useMemo } from 'react';
import { useAreaContext } from '../../../context/AreaContext';

/**
 * Hook dùng để quản lý tạm thời dữ liệu của entity (polygon, marker)
 * và đồng bộ với context qua `onChange`
 *
 * @param {Object} entity - Đối tượng entity cần quản lý
 * @param {Function} onChange - Hàm callback khi entity thay đổi
 */
export function useEntityMetadata(entity, onChange) {
  const { areaId, isEditMode } = useAreaContext();

  const [initialEntity, setInitialEntity] = useState(null);
  const [errors, setErrors] = useState({});

  // Khi entity hoặc areaId thay đổi, thiết lập entity ban đầu nếu chưa có areaId
  useEffect(() => {
    if (entity && !entity.areaId && areaId) {
      const updated = { ...entity, areaId };
      onChange?.(updated);
    }

    setInitialEntity(entity);
    setErrors({});
  }, [entity, areaId, onChange]);

  /**
   * Kiểm tra xem entity có hợp lệ không (dựa trên name và type)
   */
  const validate = () => {
    const newErrors = {};
    if (!entity?.type?.trim()) newErrors.type = 'Loại entity không được để trống';
    if (!entity?.name?.trim()) newErrors.name = 'Tên entity không được để trống';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handler chung cho input (text, textarea) — hỗ trợ field bình thường và metadata.[field]
   */
  const handleInputChange = (field) => (e) => {
    if (!isEditMode) return;

    const value = e?.target?.value ?? e;
    const updated = { ...entity };

    if (field.startsWith('metadata.')) {
      const key = field.split('.')[1];
      updated.metadata = {
        ...updated.metadata,
        [key]: value,
      };
    } else {
      updated[field] = value;
    }

    onChange?.(updated);
  };

  /**
   * Handler cho các checkbox
   */
  const handleCheckboxChange = (field) => (e) => {
    if (!isEditMode) return;

    const updated = { ...entity, [field]: e.target.checked };
    onChange?.(updated);
  };

  /**
   * Cập nhật danh sách ảnh trong metadata.images
   */
  const handleImagesChange = (newImages) => {
    if (!isEditMode) return;

    const updated = {
      ...entity,
      metadata: {
        ...entity.metadata,
        images: newImages,
      },
    };
    onChange?.(updated);
  };

  /**
   * Cập nhật metadata.location (chỉ dùng cho marker)
   * location = { displayName, lat, lon, address: { ... } }
   */
  const handleLocationChange = (newLocation) => {
    if (!isEditMode) return;

    const updated = {
      ...entity,
      metadata: {
        ...entity.metadata,
        location: newLocation,
      },
    };
    onChange?.(updated);
  };

  /**
   * Cập nhật màu — chỉ áp dụng cho polygon , và Area(rectangle) có thể truyền field là strokeColor, strokeOpacity, fillColor, fillOpacity.
   */
  const handleStyleChange = (field, value) => {
  if (!isEditMode) return;

  const updated = {
    ...entity,
    metadata: {
      ...entity.metadata,
      [field]: value,
    },
  };

  if (onChange) onChange(updated);
};


  /**
   * Đặt lại entity hiện tại thành giá trị "ban đầu"
   */
  const resetInitial = () => {
    setInitialEntity(entity);
  };

  /**
   * Kiểm tra entity có bị thay đổi gì không so với ban đầu
   */
  const isUnchanged = useMemo(() => {
    if (!initialEntity) return false;

    const fieldsToCheck = ['name', 'type', 'metadata.description'];
    return fieldsToCheck.every((key) => {
      const keys = key.split('.');
      const getVal = (obj) => keys.reduce((o, k) => o?.[k], obj);
      return getVal(entity) === getVal(initialEntity);
    });
  }, [entity, initialEntity]);

  /**
   * Kiểm tra entity có hợp lệ không
   */
  const isValid = useMemo(() => {
    return !!(entity?.name?.trim() && entity?.type?.trim());
  }, [entity]);

  return {
    entity,
    errors,
    validate,
    isValid,
    isUnchanged,
    resetInitial,
    handleInputChange,
    handleCheckboxChange,
    handleImagesChange,
    handleLocationChange,
    handleStyleChange,
  };
}
