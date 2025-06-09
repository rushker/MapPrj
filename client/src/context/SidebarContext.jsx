// src/context/SidebarContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingType, setEditingType] = useState(null); // 'area' | 'entity'
  const [editingData, setEditingData] = useState(null); // data của area hoặc entity

  // Mở sidebar, đồng thời thiết lập loại và dữ liệu đang chỉnh sửa
  const openSidebar = useCallback((type, data) => {
    setEditingType(type);
    setEditingData(data);
    setSidebarOpen(true);
  }, []);

  // Đóng sidebar và reset dữ liệu
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    setEditingType(null);
    setEditingData(null);
  }, []);

  // Xử lý xoá (handleDelete) để truyền cho SidebarContainer
  // Logic cụ thể xoá nên được implement hoặc override bên ngoài khi dùng context
  // Ở đây chỉ định nghĩa hàm placeholder để tránh lỗi
  const handleDelete = useCallback(() => {
    // Placeholder: Thường sẽ được ghi đè hoặc truyền từ component cha
    // Có thể emit event hoặc callback ở đây để gọi xoá dữ liệu thực tế
    console.warn('handleDelete chưa được implement');
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        sidebarOpen,
        editingType,
        editingData,
        setEditingData,
        openSidebar,
        closeSidebar,
        handleDelete,
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
