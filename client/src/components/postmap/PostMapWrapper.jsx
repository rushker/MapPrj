// src/components/postmap/PostMapWrapper.jsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import LeafletMap from './draw/LeafletMap';
import SidebarContainer from './sidebars/SidebarContainer';
import { createArea, updateAreaPolygon, updateArea } from '../../services/areas';
import { useTempAreaId } from '../../hooks/local/useTempAreaId';
import { useAreaContext, AreaProvider } from '../../context/AreaContext';
import useAutoSave from '../../hooks/local/useAutoSave';
import { useEnsureValidAreaId } from '../../utils/useEnsureValidAreaId';

export default function PostMapWrapper() {
  // --------------------- ENSURE VALID AREA ID ---------------------
  // Hook validate/restore/create areaId based on drawn coordinates
  const getCoordinates = () => {
    // TODO: Implement extraction of current rectangle coords from map layer
    return null;
  };
  // defaultMaxZoom can be parameterized or config
  useEnsureValidAreaId(getCoordinates, 18);

  // --------------------------- AUTO SAVE ---------------------------
  useAutoSave();

  // ------------------------ CONTEXT & STATE ------------------------
  const { saveAreaId } = useTempAreaId();
  const { areaId, areaMetadata, setAreaMetadata, addEntity, updateEntity } = useAreaContext();
  const [selectedEntityId, setSelectedEntityId] = useState(null);

  // ----------------------- CREATE AREA HANDLER -----------------------
  const handleCreateArea = async (coordinates, maxZoom) => {
    if (!window.confirm('Bạn có chắc muốn tạo khu vực này?')) return;

    try {
      // Payload: chỉ gồm coords và maxZoom, metadata cập nhật sau
      const res = await createArea({ coordinates, maxZoom });
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
    }
  };

  // --------------------- UPDATE POLYGON HANDLER ---------------------
  const handleUpdatePolygon = async (updatedPolygonCoords) => {
    if (!areaId) {
      toast.error('Chưa có khu vực để cập nhật polygon');
      return;
    }
    try {
      const response = await updateAreaPolygon(areaId, { polygon: updatedPolygonCoords });
      if (!response.success) throw new Error('Backend cập nhật polygon thất bại');
      setAreaMetadata(response.data);
      toast.success('Cập nhật polygon thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Cập nhật polygon thất bại: ' + err.message);
    }
  };

  // ---------------------- CREATE ENTITY HANDLER ----------------------
  const handleCreateEntity = (entity) => {
    if (!areaId) {
      toast.error('Vui lòng tạo khu vực trước khi thêm đối tượng');
      return;
    }
    addEntity(entity);
    setSelectedEntityId(entity._id);
  };

  // ---------------------- SAVE AREA METADATA ----------------------
  const handleSaveAreaMetadata = async (metadata) => {
    if (!areaId) {
      toast.error('Không tìm thấy areaId để lưu metadata');
      return;
    }
    try {
      const response = await updateArea(areaId, metadata);
      if (!response.success) throw new Error('Lưu metadata thất bại từ server');
      setAreaMetadata(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // --------------------- SAVE ENTITY METADATA ---------------------
  const handleSaveEntityMetadata = async (entityId, updatedMetadata) => {
    try {
      updateEntity(entityId, updatedMetadata);
      toast.success('Đã lưu metadata của đối tượng');
    } catch (err) {
      console.error(err);
      toast.error('Lưu metadata thất bại');
    }
  };

  return (
    <AreaProvider isEditMode={true}>
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
            onCreateEntity={handleCreateEntity}
          />
        </div>
        <SidebarContainer
          onSaveAreaMetadata={handleSaveAreaMetadata}
          onSaveEntity={handleSaveEntityMetadata}
        />
      </div>
    </AreaProvider>
  );
}
