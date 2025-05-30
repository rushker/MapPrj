// src/context/SidebarContext.jsx
////SidebarContainer.jsx là "bộ định tuyến sidebar metadata" — nó kiểm tra xem người dùng đang chỉnh sửa gì (area hay entity)
import { createContext, useContext, useState, useCallback } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingType, setEditingType] = useState(null); // 'area' or 'entity'
  const [editingEntity, setEditingEntity] = useState(null); // object being edited

  const openSidebar = useCallback((type, entity) => {
    setEditingType(type);
    setEditingEntity(entity);
    setSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    setEditingEntity(null);
    setEditingType(null);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        sidebarOpen,
        editingType,
        editingEntity,
        setEditingEntity,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
}
