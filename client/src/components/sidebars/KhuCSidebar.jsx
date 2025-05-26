// src/components/sidebars/KhuCSidebar.jsx
import SidebarLayout from './SidebarLayout';

export default function KhuCSidebar({ entity, onChange, onSave, onDelete }) {
  if (!entity) return <div className="p-4">Chưa chọn Khu vực C</div>;

  return (
    <SidebarLayout
      title="Thông tin Khu vực C"
      entity={entity}
      onChange={onChange}
      onSave={onSave}
      onDelete={onDelete}
      fields={['name','description','image']}
      {...props}
    />
  );
}
