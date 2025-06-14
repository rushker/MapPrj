// hooks/local/metadata/useEntityMetadata.js
import { useState, useEffect, useMemo } from 'react';
import { useAreaContext } from '../../../context/AreaContext';

// Hook quản lý metadata tạm của Entity (Khu C / Marker)
export function useEntityMetadata(entity, onChange) {
  const { areaId, isEditMode } = useAreaContext();
  const [initialEntity, setInitialEntity] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (entity && !entity.areaId && areaId) {
      const updated = { ...entity, areaId };
      if (onChange) onChange(updated);
    }
    setInitialEntity(entity);
    setErrors({});
  }, [entity, areaId, onChange]);

  const validate = () => {
    const newErrors = {};
    if (!entity?.type?.trim()) newErrors.type = 'Loại entity không được để trống';
    if (!entity?.name?.trim()) newErrors.name = 'Tên entity không được để trống';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    if (!isEditMode) return;

    const value = e?.target?.value ?? e;
    const updated = { ...entity };

    if (field.startsWith('metadata.')) {
      updated.metadata = {
        ...updated.metadata,
        [field.split('.')[1]]: value,
      };
    } else {
      updated[field] = value;
    }

    if (onChange) onChange(updated);
  };

  const handleCheckboxChange = (field) => (e) => {
    if (!isEditMode) return;

    const updated = { ...entity, [field]: e.target.checked };
    if (onChange) onChange(updated);
  };

  const handleImagesChange = (newImages) => {
    if (!isEditMode) return;

    const updated = {
      ...entity,
      metadata: {
        ...entity.metadata,
        images: newImages,
      },
    };
    if (onChange) onChange(updated);
  };

  const resetInitial = () => {
    setInitialEntity(entity);
  };

  const isUnchanged = useMemo(() => {
    if (!initialEntity) return false;
    return ['name', 'type', 'metadata.description'].every((key) => {
      const keys = key.split('.');
      const getVal = (obj) => keys.reduce((o, k) => o?.[k], obj);
      return getVal(entity) === getVal(initialEntity);
    });
  }, [entity, initialEntity]);

  const isValid = useMemo(() => {
    return !!(entity?.name?.trim() && entity?.type?.trim());
  }, [entity]);

  return {
    entity,
    errors,
    validate,
    isValid,
    isUnchanged,
    handleInputChange,
    handleCheckboxChange,
    handleImagesChange,
    resetInitial,
  };
}
