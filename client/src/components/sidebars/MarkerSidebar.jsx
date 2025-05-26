// src/components/sidebars/MarkerSidebar.jsx
import SidebarLayout from './SidebarLayout';

export default function MarkerSidebar({ entity, onChange, onSave, onDelete }) {
  if (!entity) return <div className="p-4">Chưa chọn Marker</div>;

  return (
    <SidebarLayout
      title="Thông tin Marker"
      entity={entity}
      onChange={onChange}
      onSave={onSave}
      onDelete={onDelete}
       fields={['name','description','image']}
      {...props}
    />
  );
}