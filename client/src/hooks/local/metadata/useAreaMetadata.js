// hooks/local/metadata/useAreaMetadata.js
import { useState, useEffect, useMemo } from 'react';
import { useAreaContext } from '../../../context/AreaContext';

export default function useAreaMetadata(onChange) {
  const { areaMetadata, setAreaMetadata, isEditMode } = useAreaContext(); // areaMetadata không chứa id
  const [errors, setErrors] = useState({});
  const [initialMetadata, setInitialMetadata] = useState(null);

  useEffect(() => {
    setInitialMetadata(areaMetadata ? { ...areaMetadata } : null);
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
    const updated = { ...areaMetadata, opacity: value };
    setAreaMetadata(updated);
    onChange?.(updated);
  };

  const isUnchanged = useMemo(() => {
    if (!initialMetadata) return false;
    return ['name', 'type', 'description', 'opacity'].every(
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
    handleOpacityChange,
  };
}
