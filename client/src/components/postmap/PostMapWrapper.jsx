// src/components/postmap/PostMapWrapper.jsx
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import LeafletMap from './draw/LeafletMap';
import SidebarContainer from './sidebars/SidebarContainer';
import { createArea, updateAreaPolygon, updateArea } from '../../services/areas';
import {updateEntityMetadata,updateEntityGeometry} from'../../services/entities';
import { useTempAreaId } from '../../hooks/local/useTempAreaId';
import { useAreaContext } from '../../context/AreaContext';
import useAutoSave from '../../hooks/local/useAutoSave';
import { useEnsureValidAreaId } from '../../utils/useEnsureValidAreaId';

export default function PostMapWrapper() {
  // ------------------------- AREA ID INIT -------------------------
  const getCoordinates = () => {
    // TODO: Extract from drawn layer (refactor later)
    return null;
  };
  useEnsureValidAreaId(getCoordinates, 18);

  // ---------------------- CONTEXT & STATE ----------------------
  const { saveAreaId } = useTempAreaId();
  const {
    areaId,
    areaMetadata,
    setAreaMetadata,
    addEntity,
    updateEntityMetadata,
    updateEntityGeometry,
    clearEntities,
  } = useAreaContext();

  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [isCreatingArea, setIsCreatingArea] = useState(false);

  // Reset entity selection when areaId changes
  useEffect(() => {
    setSelectedEntityId(null);
    clearEntities?.(); // optional: clear entities when switching area
  }, [areaId]);

  // ------------------------ AUTO SAVE ------------------------
  useAutoSave();

  // --------------------- AREA CREATE HANDLER ---------------------
  const handleCreateArea = async ({ coordinates, polygon, maxZoom }) => {
    if (!window.confirm('Bạn có chắc muốn tạo khu vực này?')) return;
    if (isCreatingArea) return;
    setIsCreatingArea(true);

    try {
      const res = await createArea({ coordinates, polygon, maxZoom });
      if (!res.success || !res.data?._id) {
        throw new Error('Tạo khu vực thất bại từ phía backend');
      }

      const newId = res.data._id;
      saveAreaId(newId, coordinates);
      toast.success('Đã tạo khu vực thành công!');
      return newId;
    } catch (err) {
      console.error(err);
      toast.error('Tạo khu vực thất bại: ' + err.message);
      return null;
    } finally {
      setIsCreatingArea(false);
    }
  };

  // ------------------- AREA POLYGON UPDATE -------------------
  const handleUpdatePolygon = async ({ coordinates }) => {
    if (!areaId) {
      toast.error('Chưa có khu vực để cập nhật polygon');
      return;
    }
    try {
      const res = await updateAreaPolygon(areaId, { polygon: coordinates });
      if (!res.success) throw new Error('Backend cập nhật polygon thất bại');
      setAreaMetadata(res.data);
      toast.success('Cập nhật polygon thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Cập nhật polygon thất bại: ' + err.message);
    }
  };

  // ------------------- ENTITY GEOMETRY UPDATE -------------------
   const handleUpdateEntityGeometry = async ({ entityId, coordinates }) => {
    if (!areaId) {
      toast.error('Không tìm thấy areaId');
      return;
    }
    
    try {
      // FIX: THÊM areaId
      await updateEntityGeometry(areaId, entityId, { coordinates });
      updateEntityGeometry(entityId, { coordinates }); // local update
      toast.success('Đã cập nhật vị trí/thể hiện hình học của đối tượng');
    } catch (err) {
      console.error(err);
      toast.error('Cập nhật hình học thất bại');
    }
  };


  // ------------------- CREATE ENTITY HANDLER -------------------
  const handleCreateEntity = (entity) => {
    if (!areaId) {
      toast.error('Vui lòng tạo khu vực trước khi thêm đối tượng');
      return;
    }
    addEntity(entity);
    setSelectedEntityId(entity._id);
  };

  // ------------------- SAVE AREA METADATA ----------------------
  
  const handleSaveAreaMetadata = async (metadata) => {
    if (!areaId) {
      toast.error('Không tìm thấy areaId để lưu metadata');
      return;
    }
    try {
      const res = await updateArea(areaId, metadata);
      if (!res.success) throw new Error('Lưu metadata thất bại từ server');
      setAreaMetadata(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  // ------------------- SAVE ENTITY METADATA ----------------------
  const handleSaveEntityMetadata = async (entityId, metadata) => {
  if (!areaId) {
    toast.error('Vui lòng chọn khu vực trước');
    return;
  }
  
  try {
    // Gọi API cập nhật metadata
    await updateEntityMetadata(areaId, entityId, metadata);
    
    // Cập nhật state local
    updateEntityMetadata(entityId, metadata);
    
    toast.success('Đã cập nhật thông tin đối tượng');
  } catch (err) {
    console.error('Lỗi khi lưu metadata:', err);
    toast.error(`Lỗi: ${err.message}`);
  }
};

  // ------------------------ RENDER ------------------------
  return (
    <div className="flex h-screen w-full">
      <div className="flex-1">
        <LeafletMap
          areaMetadata={areaMetadata}
          selectedEntityId={selectedEntityId}
          onSelectEntity={setSelectedEntityId}
          enableDraw={true}
          drawShape={null}
          enableEdit={true}
          enableDrag={true}
          enableRemove={true}
          onCreateArea={handleCreateArea}
          onUpdatePolygon={handleUpdatePolygon}
          onUpdateEntityGeometry={handleUpdateEntityGeometry}
          onCreateEntity={handleCreateEntity}
          isCreatingArea={isCreatingArea}
        />
      </div>
      <SidebarContainer
        onSaveAreaMetadata={handleSaveAreaMetadata}
        onSaveEntity={handleSaveEntityMetadata}
      />
    </div>
  );
}
