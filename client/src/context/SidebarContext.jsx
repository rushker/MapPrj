// src/context/SidebarContext.jsx
////SidebarContainer.jsx là "bộ định tuyến sidebar metadata" — nó kiểm tra xem người dùng đang chỉnh sửa gì (area hay entity)
import { createContext, useContext, useState, useCallback } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingType, setEditingType] = useState(null); // 'area' | 'entity'
  const [editingData, setEditingData] = useState(null); // entity or areaMetadata

  const openSidebar = useCallback((type, data) => {
    setEditingType(type);
    setEditingData(data);
    setSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    setEditingType(null);
    setEditingData(null);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        sidebarOpen,
        editingType,
        editingData, // <-- đổi tên cho trung lập
        setEditingData,
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
