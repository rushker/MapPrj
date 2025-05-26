// src/context/SidebarContext.jsx
import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingType, setEditingType] = useState(null); // 'polygon' | 'marker' | 'area'
  const [editingEntity, setEditingEntity] = useState(null);

  function openSidebar(type, entity) {
    setEditingType(type);
    setEditingEntity(entity);
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
    setEditingType(null);
    setEditingEntity(null);
  }

  return (
    <SidebarContext.Provider
      value={{
        sidebarOpen,
        editingType,
        editingEntity,
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

