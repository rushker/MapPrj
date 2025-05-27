// src/context/SidebarContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [editingEntity, setEditingEntity] = useState(null);

  const openSidebar = useCallback((type, entity) => {
    setEditingType(type);
    setEditingEntity(entity);
    setSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    setEditingType(null);
    setEditingEntity(null);
  }, []);

  const handleSave = useCallback(async (updatedEntity) => {
    // Implement API call here
    console.log('Saving entity:', updatedEntity);
    closeSidebar();
  }, [closeSidebar]);

  const handleDelete = useCallback(async () => {
    // Implement API call here
    console.log('Deleting entity:', editingEntity);
    closeSidebar();
  }, [closeSidebar, editingEntity]);

  const value = {
    sidebarOpen,
    editingType,
    editingEntity,
    openSidebar,
    closeSidebar,
    handleSave,
    handleDelete,
    setEditingEntity
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
};