//src/hooks/useSidebarManager.js-Quản lý state + API của Khu C và Markers
import { useState } from 'react';

export function useSidebarManager() {
  const [activeTab, setActiveTab] = useState(null); // 'khuA' | 'khuC' | 'marker'
  const [editingEntity, setEditingEntity] = useState(null); // object chứa metadata

  const openSidebar = (type, entity) => {
    setActiveTab(type);
    setEditingEntity(entity);
  };

  const closeSidebar = () => {
    setActiveTab(null);
    setEditingEntity(null);
  };

  const updateEditingEntity = (updates) => {
    if (editingEntity) {
      setEditingEntity({ ...editingEntity, ...updates });
    }
  };

  return {
    activeTab,
    editingEntity,
    openSidebar,
    closeSidebar,
    updateEditingEntity,
  };
}
