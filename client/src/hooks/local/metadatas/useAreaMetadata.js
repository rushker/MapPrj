//hooks/local/metadata/useAreaMetadata.js
// Quản lý metadata tạm của Khu A
import { useState, useEffect, useMemo } from 'react';

export default function useAreaMetadata(area, onChange) {
  const [errors, setErrors] = useState({});
  const [initialArea, setInitialArea] = useState(null);

  useEffect(() => {
    setErrors({});
    setInitialArea(area);
  }, [area]);

  const validate = () => {
    const newErrors = {};
    if (!area?.name?.trim()) newErrors.name = 'Tên khu A không được để trống';
    if (!area?.type?.trim()) newErrors.type = 'Loại khu A không được để trống';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    const value = e?.target?.value ?? e;
    onChange({ ...area, [field]: value });
  };

  const handleCheckboxChange = (field) => (e) => {
    onChange({ ...area, [field]: e.target.checked });
  };

  const handleOpacityChange = (value) => {
    onChange({ ...area, opacity: value });
  };

  const isUnchanged = useMemo(() => {
    if (!initialArea) return false;
    return ['name', 'type', 'description', 'opacity', 'lockedZoom'].every(
      (key) => area?.[key] === initialArea?.[key]
    );
  }, [area, initialArea]);

  const isValid = useMemo(() => {
    return !!(area?.name?.trim() && area?.type?.trim());
  }, [area]);

  return {
    errors,
    validate,
    isValid,
    isUnchanged,
    handleInputChange,
    handleCheckboxChange,
    handleOpacityChange,
  };
}

