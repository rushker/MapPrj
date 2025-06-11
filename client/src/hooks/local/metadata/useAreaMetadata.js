// hooks/local/metadata/useAreaMetadata.js
import { useState, useEffect, useMemo } from 'react';
import { useAreaContext } from '../../../context/AreaContext';

// Hook quản lý metadata tạm của Khu A
export default function useAreaMetadata(onChange) {
  const { areaMetadata, setAreaMetadata, isEditMode } = useAreaContext();
  const [errors, setErrors] = useState({});
  const [initialMetadata, setInitialMetadata] = useState(null);

  // Cập nhật metadata ban đầu khi areaMetadata (từ context) thay đổi
  useEffect(() => {
    setInitialMetadata(areaMetadata ? { ...areaMetadata } : null);
  }, [areaMetadata?.id]);

  const validate = () => {
    const newErrors = {};
    if (!areaMetadata?.name?.trim()) newErrors.name = 'Tên khu A không được để trống';
    if (!areaMetadata?.type?.trim()) newErrors.type = 'Loại khu A không được để trống';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    if (!isEditMode) return;
    const value = e?.target?.value ?? e;
    const updated = { ...areaMetadata, [field]: value };
    setAreaMetadata(updated);
    if (onChange) onChange(updated);
  };

  const handleCheckboxChange = (field) => (e) => {
    if (!isEditMode) return;
    const updated = { ...areaMetadata, [field]: e.target.checked };
    setAreaMetadata(updated);
    if (onChange) onChange(updated);
  };

  const handleOpacityChange = (value) => {
    if (!isEditMode) return;
    const updated = { ...areaMetadata, opacity: value };
    setAreaMetadata(updated);
    if (onChange) onChange(updated);
  };

  const resetInitial = () => {
    if (initialMetadata && isEditMode) {
      setAreaMetadata({ ...initialMetadata });
    }
  };

  const isUnchanged = useMemo(() => {
    if (!initialMetadata) return false;
    return ['name', 'type', 'description', 'opacity', 'lockedZoom'].every(
      (key) => areaMetadata?.[key] === initialMetadata?.[key]
    );
  }, [areaMetadata, initialMetadata]);

  const isValid = useMemo(() => {
    return !!(areaMetadata?.name?.trim() && areaMetadata?.type?.trim());
  }, [areaMetadata]);

  return {
    areaMetadata,
    setAreaMetadata,
    errors,
    validate,
    isValid,
    isUnchanged,
    handleInputChange,
    handleCheckboxChange,
    handleOpacityChange,
    resetInitial,
  };
}
