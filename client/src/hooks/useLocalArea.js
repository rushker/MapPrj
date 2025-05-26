// src/hooks/useLocalArea.js
import { useState, useEffect, useMemo } from 'react';

export default function useLocalArea(entity, onChange) {
  const [errors, setErrors] = useState({});
  const [initialEntity, setInitialEntity] = useState(null);

  useEffect(() => {
    setErrors({});
    setInitialEntity(entity);
  }, [entity]);

  const validate = () => {
    const newErrors = {};
    if (!entity?.name?.trim()) newErrors.name = 'Tên khu A không được để trống';
    if (!entity?.type?.trim()) newErrors.type = 'Loại khu (type) không được để trống';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    const value = e?.target?.value ?? e;
    onChange({ ...entity, [field]: value });
  };

  const handleCheckboxChange = (field) => (e) => {
    onChange({ ...entity, [field]: e.target.checked });
  };

  const handleOpacityChange = (opacity) => {
    onChange({ ...entity, opacity });
  };

  const isUnchanged = useMemo(() => {
    if (!initialEntity) return false;
    return ['name', 'description', 'type', 'opacity', 'lockedZoom'].every(
      (key) => entity?.[key] === initialEntity?.[key]
    );
  }, [entity, initialEntity]);

  const isValid = useMemo(() => {
    return !!(entity?.name?.trim() && entity?.type?.trim());
  }, [entity]);

  return {
    errors,
    validate,
    isUnchanged,
    isValid,
    handleInputChange,
    handleCheckboxChange,
    handleOpacityChange,
  };
}
