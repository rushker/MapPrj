// hooks/local/metadata/useAreaMetadata.js
import { useState, useEffect, useMemo } from 'react';
import { useAreaContext } from '../../../context/AreaContext';

export default function useAreaMetadata(onChange) {
  const {
    areaMetadata,
    setAreaMetadata,
    isEditMode,
  } = useAreaContext();

  const [errors, setErrors] = useState({});
  const [initialMetadata, setInitialMetadata] = useState(null);

  // Ghi nhận snapshot metadata lần đầu (hoặc khi areaId đổi)
  useEffect(() => {
  if (areaMetadata && areaMetadata._id) {
    setInitialMetadata({ ...areaMetadata });
  }
}, [areaMetadata]); 

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
    onChange?.(updated);
  };

  const handleOpacityChange = (value) => {
  if (!isEditMode) return;
    const updated = { ...areaMetadata, strokeOpacity: value }; // 👈 đổi key
    setAreaMetadata(updated);
    onChange?.(updated);
  };

  const isUnchanged = useMemo(() => {
    if (!initialMetadata || !areaMetadata) return false;
    return ['name', 'type', 'description', 'strokeOpacity'].every(
      (key) => areaMetadata[key] === initialMetadata[key]
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
    handleOpacityChange,
  };
}
